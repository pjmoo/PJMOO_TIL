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
