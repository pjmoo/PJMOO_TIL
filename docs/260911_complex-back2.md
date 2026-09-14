# complex-back2: Spring Boot 애플리케이션과 관측성 구성

> 학습일: 2026-09-11  
> 저장소: https://github.com/pjmoo/complex-back2

## 프로젝트 개요

Pokemon 데이터를 등록하고 조회하는 Spring Boot REST 애플리케이션이다. Java 17과 Spring Boot 4.1.1을 사용하며, JPA와 PostgreSQL로 데이터를 저장한다. Docker Compose로 애플리케이션과 모니터링 스택을 함께 실행할 수 있도록 구성했다.

## 코드 구조

도메인과 인프라를 분리한 구조를 사용한다.

- **domain**: 불변 도메인 모델인 `Pokemon` record와 `PokemonRepository` 포트
- **app**: `PokemonService`가 유스케이스와 트랜잭션을 담당
- **infra**: `PokemonJpaEntity`, Spring Data JPA Repository, 도메인 포트 구현
- **ui**: `PokemonController`와 입력 DTO

도메인 모델은 JPA에 직접 의존하지 않는다. `PokemonJpaEntity.from()`로 도메인을 엔티티로 변환해 저장하고, `to()`로 조회 결과를 다시 도메인 객체로 변환한다. 이 경계를 두면 영속성 기술이 도메인 코드로 퍼지는 것을 막을 수 있다.

## API

```
POST /pokemons
GET  /pokemons
```

POST는 이름과 레벨을 받아 201 Created를 반환하고, GET은 저장된 포켓몬 목록을 반환한다. 서비스는 클래스 전체에 `@Transactional(readOnly = true)`를 적용하고 저장 메서드에만 `@Transactional`을 지정해 읽기와 쓰기의 의도를 구분한다.

## Docker Compose 구성

`compose.yml`은 다음 서비스를 `mon-net` 네트워크로 연결한다.

- `app`: Spring Boot 컨테이너, 8080 포트
- `loki`: 로그 저장소, 3100 포트
- `alloy`: 애플리케이션 로그를 수집해 Loki로 전송
- `prometheus`: Actuator 지표 수집
- `grafana`: 로그와 지표 시각화, 3000 포트
- `alertmanager`: Prometheus 경보를 Slack·메일로 전달, 9093 포트

애플리케이션 로그 디렉터리는 `log-data` named volume으로 Alloy에 공유한다. 설정 파일은 컨테이너에 읽기 전용으로 마운트해 실행 환경에서 임의로 변경되지 않게 한다. PostgreSQL 접속 정보는 `.env`에서 주입하고 저장소에는 비밀 값을 커밋하지 않는다.

## 로그와 메트릭 흐름

Logback이 파일에 기록한 로그를 Alloy가 수집해 Loki로 push한다. Grafana는 Loki를 데이터 소스로 사용해 로그를 검색한다.

Spring Boot Actuator와 Micrometer Prometheus registry는 `/actuator/prometheus` 엔드포인트를 제공한다. Prometheus는 이 엔드포인트를 주기적으로 pull하고, Grafana에서 PromQL로 요청량·JVM 메모리·에러율 등을 조회한다.

## Alertmanager 경보

`config/alert_rules.yml`에는 다음 경보를 정의했다.

- `InstanceDown`: `up{instance="app:8080"} == 0` 상태가 30초 지속되면 critical
- `HighJVMHeapUsage`: JVM heap 사용률이 30%를 30초 초과하면 warning

경보 상태는 Inactive → Pending → Firing 순서로 바뀐다. `for` 시간을 두면 순간적인 네트워크 오류나 GC로 인한 오탐을 줄일 수 있다. Alertmanager는 group, deduplication, inhibition으로 알림 폭주를 줄이고 Slack Webhook 또는 SMTP로 전달한다. 문제가 해소되면 Resolved 알림을 보낸다.

## Grafana Cloud 연동

Prometheus의 `remote_write`를 사용해 외부에서 접근 가능한 outbound HTTPS로 Grafana Cloud에 메트릭을 전송한다. Remote Write URL, Instance ID, API Token은 `.env`에만 보관한다. 로컬 Prometheus와 Grafana Cloud 구성을 샘플 파일로 분리하면 환경별 자격 증명과 엔드포인트를 안전하게 관리할 수 있다.

## 검증 순서

1. `docker compose up -d` 후 `docker compose ps`로 컨테이너 상태를 확인한다.
2. `/actuator/prometheus`가 응답하고 Prometheus Targets가 UP인지 확인한다.
3. `docker compose stop app`으로 장애를 만들어 Alertmanager에서 Pending과 Firing을 확인한다.
4. 앱을 다시 시작해 Resolved 알림과 Grafana Cloud의 `up` 값 복구를 확인한다.
5. 실습 종료 후 `docker compose down`을 실행한다. DB와 Grafana 데이터를 지울 필요가 있을 때만 `down -v`를 사용한다.

## 배운 점

애플리케이션 기능만 구현하는 것보다 로그·메트릭·경보를 함께 설계해야 장애를 감지하고 원인을 추적할 수 있다. 특히 Compose의 서비스 이름을 네트워크 DNS처럼 사용하고, 환경 변수 치환과 컨테이너 내부 환경 변수 주입을 구분해야 설정 오류를 줄일 수 있다. 관측성 스택은 데이터를 수집하는 것에서 끝나지 않고, 실제 장애를 발생시켜 알림이 전달되고 복구되는지까지 검증해야 한다.

