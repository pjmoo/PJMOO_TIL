# Docker 네트워크와 GHCR 이미지 배포 실습

> 2026-09-08에 Spring Boot 애플리케이션을 Docker 이미지로 빌드하고, Docker 네트워크를 점검하며, GitHub Container Registry(GHCR)로 자동 배포하는 흐름을 정리했다.

## Docker 이미지 빌드

`simple-back-ghcr` 프로젝트의 `Dockerfile`은 멀티 스테이지 빌드로 구성되어 있다.

1. Gradle/JDK 이미지에서 `bootJar`를 실행해 실행 가능한 JAR를 만든다.
2. JRE 런타임 이미지에는 생성된 JAR만 복사한다.
3. 컨테이너는 `8080` 포트를 사용하고 `java -jar app.jar`로 애플리케이션을 실행한다.

```sh
docker build -t simple-back:local .
docker run --rm -p 8080:8080 simple-back:local
```

멀티 스테이지 빌드는 최종 이미지에 빌드 도구와 소스 코드를 포함하지 않아 이미지 크기와 공격 표면을 줄이는 데 도움이 된다.

## Docker 네트워크 점검

```sh
docker network ls
docker network inspect app-net
```

`docker network inspect app-net`은 `app-net` 네트워크의 드라이버, 서브넷, 연결된 컨테이너 등의 설정을 확인한다.

다음 오류는 Docker 데몬 연결은 정상이나, 이름이 `app-net`인 네트워크가 없다는 뜻이다.

```text
Error response from daemon: network app-net not found
```

필요하면 네트워크를 만들고 다시 점검한다.

```sh
docker network create app-net
docker network inspect app-net
```

## GitHub Container Registry(GHCR) 배포

`simple-back-ghcr`의 `.github/workflows/docker-publish.yml`은 `main` 브랜치에 push가 발생하면 다음 순서로 실행된다.

1. `actions/checkout`으로 소스를 가져온다.
2. Docker Buildx를 준비한다.
3. `GITHUB_TOKEN`으로 `ghcr.io`에 로그인한다. 이때 `packages: write` 권한이 필요하다.
4. 저장소 이름을 소문자로 변환한다.
5. 이미지를 빌드해 `ghcr.io/pjmoo/simple-back-ghcr:latest`로 푸시한다.

배포된 이미지는 다음처럼 받을 수 있다.

```sh
docker pull ghcr.io/pjmoo/simple-back-ghcr:latest
docker run --rm -p 8080:8080 ghcr.io/pjmoo/simple-back-ghcr:latest
```

## 확인할 점

- Docker Desktop 또는 Docker 데몬이 실행 중이어야 Docker 명령을 사용할 수 있다.
- `network not found` 오류는 네트워크 생성 여부를 먼저 확인한다.
- GHCR 패키지가 private이면 `docker pull` 전에 GitHub Personal Access Token으로 `docker login ghcr.io`가 필요할 수 있다.

## 관련 저장소

- [simple-back-ghcr](https://github.com/pjmoo/simple-back-ghcr)

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/simpleback/SimpleBackApplication.java](<../../simple-back/simple-back-ghcr/src/main/java/org/example/simpleback/SimpleBackApplication.java>) · [src/main/java/org/example/simpleback/ui/UserController.java](<../../simple-back/simple-back-ghcr/src/main/java/org/example/simpleback/ui/UserController.java>) · [src/main/java/org/example/simpleback/app/UserService.java](<../../simple-back/simple-back-ghcr/src/main/java/org/example/simpleback/app/UserService.java>)

### DB 클라이언트와 DB 서버 구분하기

DBeaver 같은 클라이언트는 SQL을 보내고 결과를 보여 주며 실제 데이터 저장과 쿼리 실행은 DB 서버가 맡는다. 연결에는 호스트·포트·데이터베이스·계정 등 서로 다른 정보가 필요하다. 관리형 DB를 사용해도 애플리케이션의 스키마·쿼리·권한 설계는 남아 있다.

**예시로 이해하기:** 연결 실패 시 서버에 도달하지 못하는 문제와 인증 실패, 존재하지 않는 DB 선택을 구분한다. localhost는 실행 중인 환경 자신을 가리키므로 컨테이너 안과 호스트에서 같은 문자열이 같은 서버를 뜻한다고 가정하면 안 된다.

근거: 301-2 데이터베이스 실습 — [7쪽](<../../260629_ex/새 폴더/7-9/301-2_데이터베이스_실습.pdf#page=7>) · [11쪽](<../../260629_ex/새 폴더/7-9/301-2_데이터베이스_실습.pdf#page=11>) · [16쪽](<../../260629_ex/새 폴더/7-9/301-2_데이터베이스_실습.pdf#page=16>) · [18쪽](<../../260629_ex/새 폴더/7-9/301-2_데이터베이스_실습.pdf#page=18>)

### 설정 파일의 값과 실제 적용값 구분하기

같은 설정 키가 여러 출처에 있으면 우선순위에 따라 최종 값이 정해진다. 프로파일은 환경별 설정을 선택하고 ConfigurationProperties는 관련 값을 타입으로 묶는다. 파일에 값이 적혀 있다는 사실만으로 그 값이 실행 시 사용된다고 판단하면 설정 오류를 놓칠 수 있다.

**예시로 이해하기:** 개발 포트를 바꿨는데 반영되지 않으면 활성 프로파일과 환경 변수·실행 인자를 함께 확인한다. .env 파일도 존재만으로 모든 실행 도구에 자동 적용되는 것은 아니므로 import나 로딩 구성을 읽는다. 비밀 값 자체보다 어떤 설정 키가 어디서 공급되는지를 TIL에 남긴다.

근거: 401-2 application-yml과 외부 설정 — [10쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=10>) · [13쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=13>) · [17쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=17>) · [28쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=28>) · [32쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=32>) · [34쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=34>)

### MVC와 계층형 설계의 역할 차이

MVC는 입력 제어·데이터·화면의 역할을 나누고, 계층형 설계는 웹 처리·업무 규칙·저장소 접근의 책임을 나눈다. 따라서 MVC와 Controller–Service–Repository 구조를 함께 사용할 수 있다. 클린 아키텍처에서는 업무 규칙이 외부 구현을 직접 참조하지 않도록 의존 방향을 조정한다.

**예시로 이해하기:** 컨트롤러는 “요청이 어떤 형식인가”, 서비스는 “이 작업이 허용되는가”, 저장소는 “어떻게 읽고 쓰는가”를 맡도록 생각한다. 외부 AI 제공자를 교체할 때 요청 API까지 바꿔야 한다면 제공자 전용 타입이 경계를 넘는지 살펴본다.

근거: 232 소프트웨어 아키텍처 패턴 — [4쪽](<../../260629_ex/새 폴더/7-2/232_소프트웨어_아키텍처_패턴.pdf#page=4>) · [12쪽](<../../260629_ex/새 폴더/7-2/232_소프트웨어_아키텍처_패턴.pdf#page=12>) · [15쪽](<../../260629_ex/새 폴더/7-2/232_소프트웨어_아키텍처_패턴.pdf#page=15>) · [19쪽](<../../260629_ex/새 폴더/7-2/232_소프트웨어_아키텍처_패턴.pdf#page=19>)

<!-- pdf-til-supplement:end -->
