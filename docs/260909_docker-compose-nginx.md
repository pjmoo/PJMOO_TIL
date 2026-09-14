# Docker Compose 환경 분리와 Nginx 리버스 프록시 실습

> 2026-09-09에 Spring Boot 앱과 MySQL을 Docker Compose로 실행하고, 로컬·운영 환경을 분리한 뒤 Nginx 리버스 프록시를 연결하는 흐름을 실습했다.

## 학습 목표

- Compose 서비스명으로 컨테이너 간 통신하기
- MySQL 데이터를 volume에 보존하기
- 로컬과 운영 환경의 포트·설정을 Compose 파일로 분리하기
- Nginx가 외부 요청을 앱 컨테이너로 전달하도록 설정하기
- 여러 앱 인스턴스를 upstream으로 묶는 로드밸런싱 구조 이해하기

## 공통 Compose 구성

공통 `compose.yml`에는 Spring Boot 앱(`app`)과 MySQL(`db`)을 둔다. 앱은 DB 서비스명 `db`를 호스트로 사용하며, 두 서비스는 `app-net` 네트워크에서 통신한다.

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: on-failure
    depends_on:
      - db
    environment:
      APP_MESSAGE: ${APP_MESSAGE}
      SPRING_DATASOURCE_URL: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
      SPRING_DATASOURCE_USERNAME: ${DB_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
    networks:
      - app-net

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_RANDOM_ROOT_PASSWORD: true
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-net

volumes:
  db-data:

networks:
  app-net:
```

`depends_on`은 앱이 DB에 의존한다는 구성을 표현한다. 다만 DB가 실제로 연결 가능한 상태가 될 때까지 보장하지는 않으므로, 앱의 재시작 정책과 DB 연결 재시도 설정도 함께 고려해야 한다.

## 환경 변수 분리

민감 값과 환경별 값은 Git에 넣지 않고 `.env.local`, `.env.prod`처럼 별도 파일로 관리한다.

```dotenv
APP_MESSAGE=로컬 개발 환경
DB_HOST=db
DB_PORT=3306
DB_NAME=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_CONNECTION_TIMEOUT=30000
DB_DDL_AUTO=update
```

컨테이너 안에서 `localhost`는 자기 자신을 뜻한다. 따라서 앱에서 MySQL로 접속할 때는 `localhost:3306`이 아니라 `db:3306`을 사용해야 한다.

## 로컬 개발 환경

`compose.override.yml`은 개발 중 브라우저와 DB 클라이언트에서 접근할 수 있도록 포트를 연다.

```yaml
services:
  app:
    ports:
      - "8080:8080"
  db:
    ports:
      - "3306:3306"
```

```sh
docker compose --env-file .env.local \
  -f compose.yml \
  -f compose.override.yml \
  up -d

docker compose ps
docker compose logs app
curl -i localhost:8080
```

## 운영 환경과 Nginx

운영에서는 앱 포트를 직접 노출하지 않고 Nginx가 외부 `80` 포트를 받도록 구성한다.

```yaml
services:
  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx2.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-net
```

`nginx/nginx2.conf`는 Nginx가 내부 서비스 `app:8080`으로 요청을 전달하도록 만든다.

```nginx
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;

        location / {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    upstream backend_servers {
        server app:8080;
    }
}
```

```sh
docker compose --env-file .env.prod \
  -f compose.yml \
  -f compose.prod.yml \
  up -d

curl -i localhost:80
```

`proxy_set_header Host $host;`처럼 헤더 이름과 값 사이에는 공백이 필요하다. Nginx 설정을 바꾼 뒤에는 컨테이너를 다시 생성하거나 재시작해 반영 여부를 확인한다.

## 로드밸런싱 확장

수업의 `compose.3tier.yml`과 `nginx/nginx.conf`에서는 `app1`, `app2`를 upstream에 등록했다.

```nginx
upstream backend_servers {
    server app1:8080;
    server app2:8080;
}
```

이 구조에서는 Nginx가 요청을 여러 앱 인스턴스에 분산한다. 서비스 확장 시에는 앱 인스턴스가 같은 DB와 네트워크에 연결되어 있는지, 세션·파일 같은 상태를 어떻게 공유할지도 함께 설계해야 한다.

## 자주 쓰는 Compose 명령

```sh
docker compose config
docker compose config --quiet
docker compose ps
docker compose logs app
docker compose down
docker compose down -v
```

- `config`: 여러 Compose 파일과 환경 변수가 합쳐진 최종 구성을 확인한다.
- `config --quiet`: 구성 문법만 검증한다.
- `down -v`: 컨테이너와 네트워크뿐 아니라 named volume도 삭제하므로 DB 데이터가 초기화된다.

## 정리

Compose는 앱, DB, 프록시를 선언적으로 묶고 환경마다 필요한 차이만 override 파일로 분리하게 해 준다. 개발 환경에서는 앱과 DB 포트를 열어 빠르게 확인하고, 운영 환경에서는 Nginx를 단일 진입점으로 두어 앱 컨테이너를 직접 노출하지 않는 구조를 만들 수 있다.

## 관련 저장소

- [simple-back-compose](https://github.com/pjmoo/simple-back-compose)

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/simpleback/SimpleBackApplication.java](<../../simple-back-compose/src/main/java/org/example/simpleback/SimpleBackApplication.java>) · [src/main/java/org/example/simpleback/ui/UserController.java](<../../simple-back-compose/src/main/java/org/example/simpleback/ui/UserController.java>) · [src/main/java/org/example/simpleback/app/UserService.java](<../../simple-back-compose/src/main/java/org/example/simpleback/app/UserService.java>)

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
