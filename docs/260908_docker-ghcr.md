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

<!-- infra-pdf-20260914:start -->
## TIL 부연 설명 — 9월 인프라 PDF

기존 실습을 새로 추가된 PDF와 연결해 풀어 쓴 설명이다. 페이지 번호는 표지를 포함한 PDF 순서이며, 아래 개념 예시는 실제 실행 결과와 구분한다.

### 이미지 빌드와 컨테이너 실행은 다른 단계

현재 Dockerfile은 Gradle/Maven 등의 빌드 단계와 경량 JRE 런타임 단계를 분리하여 이미지를 구성할 수 있다. 소스보다 의존성 정의 파일(`pom.xml` 또는 `build.gradle`)을 먼저 복사하면 캐시 레이어를 활용해 빌드 시간을 크게 단축할 수 있다.

멀티 스테이지는 컴파일에 필요한 도구와 운영 시 필요한 실행 파일만을 분리하는 방식이다. 앞 단계에서 만든 산출물 중 `COPY --from`으로 선택한 것만 최종 이미지로 옮긴다. `docker build`는 이미지를 만드는 명령이며 웹 서버를 계속 실행해 두는 것은 아니다. 실제 서비스는 그 이미지로 컨테이너를 생성·실행할 때 시작된다.

PDF 근거: 이미지 빌드·볼륨·네트워크 — [4쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=4>) · [5쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=5>) · [6쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=6>) · [7쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=7>)

### 설정·공개 포트·저장 데이터의 경계

Dockerfile의 `ENV PORT=8080`만으로 애플리케이션의 내부 포트가 자동 변경된다고 단정할 수 없다. 애플리케이션 설정에서 환경변수를 읽는지 확인해야 한다.

`EXPOSE`는 사용할 포트를 이미지 메타데이터에 명시하는 문서화 성격이며, 호스트 포트를 실제로 외부에 바인딩하는 동작은 아니다. `-p 호스트포트:컨테이너포트`가 호스트와 컨테이너 포트를 연결한다. 컨테이너 내부의 `localhost`는 컨테이너 자신이므로 별도 컨테이너(예: DB)의 주소로 쓸 수 없다. 같은 사용자 정의 브리지 네트워크에 묶여 있을 때 컨테이너 이름(DNS)으로 통신한다. 영속 데이터는 컨테이너 쓰기 레이어가 아닌 명명 볼륨이나 바인드 마운트로 분리한다.

PDF 근거: 이미지 빌드·볼륨·네트워크 — [10쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=10>) · [11쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=11>) · [12쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=12>) · [13쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=13>) · [14쪽](<../../260629_ex/새 폴더/9-8/03-1_도커_이미지_빌드와_볼륨_네트워크.pdf#page=14>)

### GHCR 발행과 서비스 배포를 구분하기

GitHub Actions 워크플로는 `main` 브랜치 push를 트리거로 checkout → Buildx 세팅 → GHCR 로그인 → 이미지 빌드 및 push를 수행한다. `packages: write` 권한이 패키지 레지스트리 발행에 필요하다.

발행 태그로 `latest`만 사용하면 이전 빌드 버전을 추적하기 어려우므로 커밋 SHA나 시맨틱 버저닝 태그를 함께 붙이는 것이 권장된다. GHCR에 이미지를 성공적으로 푸시했다고 해서 운영 서버의 컨테이너가 자동으로 교체·배포되는 것은 아니므로, 이미지 레지스트리 업로드와 서버 배포 단계를 명확히 구분한다.

PDF 근거: GHCR와 GitHub Actions — [4쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=4>) · [7쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=7>) · [9쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=9>) · [10쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=10>) · [12쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=12>) · [25쪽](<../../260629_ex/새 폴더/9-8/03-2_Docker_Registry_GHCR과_GitHub_Actions.pdf#page=25>)

<!-- infra-pdf-20260914:end -->

