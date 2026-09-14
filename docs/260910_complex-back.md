# 로그·메트릭 수집(PLG 스택 & Prometheus) 및 인프라 모니터링 실습

> 2026-09-10에 Spring Boot 앱에 Actuator 및 Micrometer Prometheus를 연동하고, Docker Compose 환경에서 Promtail·Loki·Grafana(PLG 스택) 기반의 로그 수집 파이프라인과 Prometheus 메트릭 수집을 실습했다.

## 핵심 실습 내용

1. **로그 수집 파이프라인 (PLG 스택)**
   - Spring Boot 애플리케이션의 Logback 로거 설정을 통해 파일(`spring-app.log`)로 롤링 기록
   - Promtail이 마운트된 공유 볼륨(`/var/log/app/*.log`)의 로그를 실시간 스크랩하여 Loki(`http://loki:3100`)로 Push
   - Grafana에서 Loki 데이터소스를 조회하여 실시간 로그 검색 및 모니터링 수행

2. **메트릭 수집 파이프라인 (Prometheus & Actuator)**
   - Spring Boot Actuator와 `micrometer-registry-prometheus` 의존성을 통한 `/actuator/prometheus` 엔드포인트 오픈
   - Prometheus가 풀(Pull) 방식으로 주기적인 메트릭 스크랩 수행
   - Grafana 대시보드에서 Counter, Gauge, Histogram 메트릭을 PromQL로 시각화

3. **Docker Compose 기반 인프라 통합**
   - `app`, `promtail`, `loki`, `grafana`, `db` 서비스를 단일 네트워크와 볼륨으로 연계 구성

---

## 관련 저장소

- [complex-back](https://github.com/pjmoo/complex-back)

<!-- infra-pdf-20260914:start -->
## TIL 부연 설명 — 9월 인프라 PDF

기존 실습을 새로 추가된 PDF와 연결해 풀어 쓴 설명이다. 페이지 번호는 표지를 포함한 PDF 순서이며, 아래 개념 예시는 실제 실행 결과와 구분한다.

### 이미지 빌드와 컨테이너 실행은 다른 단계

Dockerfile은 Gradle/JDK 단계에서 `bootJar`를 실행하고, JRE 단계에는 컴파일 산출물인 `*.jar`를 복사하는 멀티 스테이지 빌드를 사용한다. 소스보다 `build.gradle`·`settings.gradle`을 먼저 복사하면 의존성 다운로드 레이어를 재사용해 빌드 속도를 최적화할 수 있다.

멀티 스테이지는 컴파일에 필요한 대형 도구(JDK, Gradle 등)와 운영 시 필요한 경량 실행 파일(JRE)을 분리하는 방식이다. 앞 단계에서 만든 파일 중 `COPY --from`으로 선택한 것만 다음 단계로 옮긴다. `docker build`는 이미지를 만들며 웹 서버를 계속 실행해 두는 명령은 아니다. 실제 서비스는 그 이미지로 컨테이너를 생성·실행할 때 시작된다.

PDF 근거: 이미지 빌드·볼륨·네트워크 — [4쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=4>) · [5쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=5>) · [6쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=6>) · [7쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=7>)

### 로그는 파일 경로를 따라, 메트릭은 엔드포인트를 따라 읽기

Compose에서 앱의 `/app/logs`와 Promtail의 `/var/log/app`은 같은 명명 볼륨(`log-data`)의 서로 다른 마운트 경로다. Promtail 설정(`promtail.yml`)의 `__path__: /var/log/app/*.log`가 그 파일을 읽고 `http://loki:3100/loki/api/v1/push`로 전송한다. Grafana는 로그 저장소 자체가 아니라 Loki 같은 데이터소스를 조회해 시각화해 주는 대시보드 화면이다.

Logback은 파일 크기, 보관 이력, 전체 크기 상한을 설정해 파일 순환(Rotation)을 관리한다. 파일 순환은 로컬 디스크 사용을 제한하는 과정이며 Loki의 자체 보관 주기(Retention) 정책과는 별개다. 로그가 조회되지 않으면 앱 파일 생성 → 공유 볼륨 마운트 경로 → Promtail 수집 → Loki 저장 → Grafana 데이터소스 연결 순서로 파이프라인을 점검한다.

PDF 근거: 로그 및 메트릭 수집 — [6쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=6>) · [10쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=10>) · [13쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=13>) · [14쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=14>) · [30쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=30>)

### Prometheus 메트릭 수집과 모니터링 시각화

Actuator와 `micrometer-registry-prometheus` 의존성을 추가하면 `/actuator/prometheus` 엔드포인트에서 메트릭을 Prometheus 포맷으로 노출한다. Prometheus는 스크랩(Scrape) 주소와 주기에 따라 이 엔드포인트를 풀(Pull) 방식으로 가져와 시계열 데이터베이스(TSDB)에 저장한다.

로그는 특정 오류 사건의 원인과 맥락을 상세히 추적하고, 메트릭은 요청량(RPS), 에러율, 메모리·CPU 점유율 등의 시스템 통계 변화를 파악한다. 누적 요청 Counter에 `rate(...[1m])`를 적용하면 최근 1분 구간의 초당 평균 증가율을 계산한다. 현재 메모리 사용량 같은 Gauge는 순간값 자체를 모니터링한다.

```promql
rate(http_server_requests_seconds_count[1m])
```

PDF 근거: 로그 및 메트릭 수집 — [8쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=8>) · [10쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=10>) · [18쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=18>) · [19쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=19>) · [20쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=20>) · [29쪽](<../../260629_ex/새 폴더/9-10/05-1_로그_및_메트릭_수집_PLG스택과_Prometheus.pdf#page=29>)

<!-- infra-pdf-20260914:end -->
