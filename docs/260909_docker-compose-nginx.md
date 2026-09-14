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

<!-- infra-pdf-20260914:start -->
## TIL 부연 설명 — 9월 인프라 PDF

기존 실습을 새로 추가된 PDF와 연결해 풀어 쓴 설명이다. 페이지 번호는 표지를 포함한 PDF 순서이며, 아래 개념 예시는 실제 실행 결과와 구분한다.

### Compose의 설정 치환과 DB 준비 시점

현재 `compose.yml`의 `${DB_HOST}` 등은 Compose가 명세를 읽을 때 치환하고, `environment`에 적힌 값은 앱 컨테이너 내부로 전달한다. Compose 실행 시 `--env-file`로 변수 치환에 사용할 파일을 고르는 것과, 서비스 내부의 `env_file`로 컨테이너에 환경변수를 주입하는 것은 서로 구분해야 한다. 컨테이너 생성 시 주입된 환경변수를 바꿀 때는 재생성이 필요하며 단순 `restart`만으로는 새 값이 반영되지 않는다.

`depends_on: [db]`는 DB 프로세스나 네트워크 포트가 준비되는 시점까지 대기하는 헬스체크(healthcheck) 조건이 아니다. MySQL 컨테이너가 막 부팅되는 초기화 단계에서는 앱의 첫 JDBC 연결 시도가 실패할 수 있다. 컨테이너가 시작되었는지, DB 데몬이 외부 연결을 수락하는지, 앱이 실제 쿼리를 성공했는지를 각각 단계별로 확인해야 한다. `db-data` 명명 볼륨은 일반적인 `docker compose down` 후에도 보존되지만, `down -v` 옵션은 볼륨까지 영구 삭제하므로 데이터 초기화 시 주의한다.

PDF 근거: Compose 멀티컨테이너 관리 — [7쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=7>) · [8쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=8>) · [15쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=15>) · [18쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=18>) · [20쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=20>) · [24쪽](<../../260629_ex/새 폴더/9-9/04-1_Docker_Compose_기반_멀티컨테이너와_백그라운드_관리.pdf#page=24>)

### 운영 오버라이드와 이중화 실습은 다른 구성

개발용 `compose.override.yml`은 로컬 디버깅을 위해 앱(8080)과 DB(3306) 포트를 호스트에 직접 공개한다. 반면 운영용 `compose.prod.yml`은 외부 노출 진입점을 Nginx(80)로 일원화하고 내부 앱·DB 포트는 컨테이너 내부망으로 격리한다.

로드밸런싱 실습(`compose.3tier.yml`)에서는 Nginx의 호스트 포트를 81로 매핑하고, `nginx.conf`의 upstream 블록에 `app1:8080`, `app2:8080`을 등록하여 트래픽을 분산한다. 따라서 이 실습의 브라우저 접속 주소는 `http://localhost:81`이다. 앱 컨테이너는 프론트엔드 네트워크와 백엔드 네트워크 양쪽에 연결되고 DB는 백엔드 네트워크에만 속한다. 여러 웹 앱 컨테이너를 두어 부하를 나누더라도, Nginx가 단일 인스턴스라면 진입점 단일 장애점(SPOF) 문제가 남을 수 있다.

`X-Forwarded-For` 헤더는 프록시를 거쳐온 실제 클라이언트 IP를 전달한다. 백엔드 앱에서 이 값을 안전하게 신뢰하려면 신뢰할 수 있는 리버스 프록시 IP 대역을 지정해야 하며, 임의의 요청 헤더를 그대로 사용자 신원으로 수용해서는 안 된다.

PDF 근거: Nginx 로드밸런싱·환경 분리 — [4쪽](<../../260629_ex/새 폴더/9-9/04-2_Docker_Compose_Nginx_로드밸런싱과_다중환경_분기.pdf#page=4>) · [9쪽](<../../260629_ex/새 폴더/9-9/04-2_Docker_Compose_Nginx_로드밸런싱과_다중환경_분기.pdf#page=9>) · [10쪽](<../../260629_ex/새 폴더/9-9/04-2_Docker_Compose_Nginx_로드밸런싱과_다중환경_분기.pdf#page=10>) · [18쪽](<../../260629_ex/새 폴더/9-9/04-2_Docker_Compose_Nginx_로드밸런싱과_다중환경_분기.pdf#page=18>) · [23쪽](<../../260629_ex/새 폴더/9-9/04-2_Docker_Compose_Nginx_로드밸런싱과_다중환경_분기.pdf#page=23>)

<!-- infra-pdf-20260914:end -->

