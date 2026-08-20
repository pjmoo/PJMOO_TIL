# 🍪 Spring Security + JWT + Redis Refresh Token 기반 인증 시스템 (jwt-fetch)

본 프로젝트는 Spring Boot, Spring Security, Redis, JPA, Thymeleaf, Vanilla JS(Fetch API)를 활용하여 **무상태(Stateless) 기반의 회원가입/로그인, JWT 토큰(Access Token & Refresh Token) 발급 및 검증, Redis를 연동한 Refresh Token 관리, 그리고 로그아웃 처리**를 구현한 실습 프로젝트입니다.

---

## 🛠️ 기술 스택
- **Framework**: Spring Boot 3.x, Spring Security 6.x
- **Database / ORM**: MySQL, Spring Data JPA
- **Session / Cache Store**: Redis (Refresh Token & TTL 관리)
- **Authentication**: JWT (jjwt 0.12.x), Cookie (HttpOnly, Secure, SameSite=Strict)
- **Frontend / Template Engine**: HTML5, Thymeleaf, Vanilla JS (Fetch API)

---

## 📂 프로젝트 패키지 구조
```text
src/main/java/org/example/jwtfetch/
├── JwtFetchApplication.java          # 애플리케이션 진입점
├── auth/
│   ├── AuthCookieUtil.java           # HttpOnly/Secure/SameSite 쿠키 유틸리티
│   ├── JwtFilter.java                # 요청마다 Access Token 검증 필터 (OncePerRequestFilter)
│   ├── JwtProvider.java              # JWT 발급, 검증, Claims 파싱 담당 컴포넌트
│   ├── RefreshToken.java             # Redis 저장용 Refresh Token Entity (@RedisHash)
│   └── RefreshTokenRepository.java   # Redis Spring Data JPA Repository
├── config/
│   ├── AuthProperties.java           # JWT 비밀키 및 만료 시간 Properties 바인딩
│   ├── JpaConfig.java                # JPA Auditing 활성화 설정
│   └── SecurityConfig.java           # Spring Security 및 PasswordEncoder 설정
├── controller/
│   ├── AuthController.java           # 회원가입, 로그인, 로그아웃 REST API 컨트롤러
│   └── MainController.java           # 뷰 템플릿(Thymeleaf) 반환 컨트롤러 (페이지 매핑)
├── domain/
│   ├── entity/
│   │   ├── BaseEntity.java           # 생성일/수정일/식별자 공통화 부모 클래스
│   │   └── UserAccount.java          # 사용자 정보 엔티티
│   └── repository/
│       └── UserAccountRepository.java # 사용자 JPA 리포지토리
├── dto/
│   ├── LoginForm.java                # 로그인 요청 DTO
│   └── SignUpForm.java               # 회원가입 요청 DTO
└── service/
    └── UserAccountService.java       # 회원가입, 패스워드 비교, 토큰 발급 로직
```

---

## 💡 주요 단계별 구현 내용

### 1. JPA Auditing 및 엔티티 공통화 💾
- **[BaseEntity.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/domain/entity/BaseEntity.java)**: 모든 엔티티가 공유하는 고유 식별자(`id`, `uuid`) 및 생성일시(`createdAt`), 수정일시(`updatedAt`) 필드를 정의하고, `@MappedSuperclass` 및 `@EntityListeners(AuditingEntityListener.class)`를 설정했습니다.
- **[UserAccount.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/domain/entity/UserAccount.java)**: `BaseEntity`를 상속하여 사용자 계정 테이블을 정의했습니다.
- **[JpaConfig.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/config/JpaConfig.java)**: `@EnableJpaAuditing`를 선언해 자동으로 시간 필드가 업데이트되도록 설정했습니다.

### 2. Spring Security & Argon2 패스워드 암호화 🔐
- **[SecurityConfig.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/config/SecurityConfig.java)**:
  - JWT 기반의 무상태(Stateless) 아키텍처이므로 세션을 생성하지 않도록 `SessionCreationPolicy.STATELESS`로 설정하였습니다.
  - CSRF, Form Login, HTTP Basic 로그인을 비활성화했습니다.
  - 특정 공용 엔드포인트(`/`, `/login`, `/signup`, `/api/auth/login`, `/api/auth/signup`)에 대해서는 인증 없이 접근이 가능하도록 허용하고, 그 외의 모든 요청은 로그인 후 이용하도록 통제했습니다.
  - `PasswordEncoderFactories.createDelegatingPasswordEncoder()`를 통해 Argon2와 BCrypt 등 다중 패스워드 암호화를 지원하게 하였으며, 기본 암호화 알고리즘으로 강력한 Argon2를 사용했습니다.

### 3. JWT 토큰 발급 및 파싱 (`jjwt`) 🔑
- **[JwtProvider.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/auth/JwtProvider.java)**:
  - HMAC-SHA 서명 키를 생성하고 토큰을 빌드(`issueToken`) 및 검증(`parseToken`)하는 책임을 담당합니다.
  - Access Token and Refresh Token의 발급 및 파싱 로직을 포함합니다.
- **[AuthProperties.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/config/AuthProperties.java)**:
  - `.env`에 정의된 JWT 비밀키(`JWT_SECRET_KEY`) 및 Access/Refresh Token의 만료 시간을 `@ConfigurationProperties`로 가져와 타입 안전하게 바인딩합니다.

### 4. 보안 쿠키 설정 (HttpOnly, Secure, SameSite) 🍪
- **[AuthCookieUtil.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/auth/AuthCookieUtil.java)**:
  - 브라우저 로컬 스토리지에 토큰을 저장할 경우 XSS 공격에 취약하기 때문에, 브라우저가 자동으로 요청 헤더에 담아 전송하는 **쿠키(Cookie)**를 토큰 저장소로 활용했습니다.
  - 쿠키 생성 시 아래의 보안 플래그를 명시했습니다:
    - `httpOnly(true)`: JavaScript(`document.cookie`)를 통해 쿠키를 조회하는 것을 전면 차단하여 XSS 공격 방지.
    - `secure(true)`: HTTPS 통신 프로토콜에서만 브라우저가 서버로 쿠키를 전송하도록 제한. (로컬 호스트 개발 단계에서는 브라우저 제한에 따라 미작동할 수 있음)
    - `sameSite("Strict")`: 제3의 사이트에서 발생하는 크로스 사이트 요청(CSRF) 공격을 방어하기 위해 strict 정책 사용.

### 5. HTTP 요청 검증 필터 구현 🔍
- **[JwtFilter.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/auth/JwtFilter.java)**:
  - `OncePerRequestFilter`를 확장하여 요청이 들어올 때마다 한 번씩 쿠키 내의 Access Token을 추출합니다.
  - 토큰이 존재하고 서명이 올바른 경우, 유저네임을 꺼내 `UsernamePasswordAuthenticationToken`을 만들고 이를 `SecurityContextHolder`에 세팅하여 스프링 시큐리티가 인증된 요청으로 간주하게 설정합니다.

### 6. Redis 연동을 통한 Refresh Token 관리 💾
- **[RefreshToken.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/auth/RefreshToken.java)**:
  - Redis에 데이터를 매핑하기 위해 `@RedisHash`를 선언했습니다.
  - TTL(Time To Live) 속성을 활용해 만료 시간이 지나면 Redis 엔진 자체에서 자동으로 데이터가 소멸되도록 지정했습니다.
- **[RefreshTokenRepository.java](file:///C:/workspace/jwt-fetch/src/main/java/org/example/jwtfetch/auth/RefreshTokenRepository.java)**:
  - `CrudRepository`를 상속받아 Redis 저장 공간과 간편하게 통신합니다.
- **로그인 시 & 로그아웃 시 처리**:
  - 로그인 성공 시 Access Token과 Refresh Token을 동시 발급하며, Refresh Token은 Redis에 저장해 관리합니다.
  - 로그아웃 요청 시에는 해당 쿠키들의 만료 기한을 0으로 만들어 브라우저에서 토큰 쿠키를 지우고, Redis 저장소에서도 사용자 아이디에 연결된 Refresh Token을 명시적으로 삭제하여 완벽하게 인증 세션을 폐기합니다.

---

## 📌 전체 아키텍처 & 인증 흐름

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 (브라우저)
    participant Server as 스프링 부트 서버
    participant DB as MySQL (사용자 정보)
    participant Redis as Redis (리프레시 토큰)

    %% 1. 회원가입
    Note over User, Server: 1. 회원가입 (SignUp)
    User->>Server: POST /signup (username, password)
    Note over Server: Password 암호화 (Argon2)
    Server->>DB: UserAccount 저장
    Server-->>User: 회원가입 완료 (Redirect /)

    %% 2. 로그인
    Note over User, Server: 2. 로그인 & 토큰 발급
    User->>Server: POST /login (username, password)
    Server->>DB: 사용자 정보 조회 및 비밀번호 매칭 검증
    Note over Server: Access Token & Refresh Token 생성
    Server->>Redis: Refresh Token 저장 (만료시간 설정)
    Note over Server: HttpOnly, Secure, SameSite=Strict 쿠키 설정
    Server-->>User: 쿠키에 토큰을 실어 응답 (Set-Cookie)

    %% 3. 인증 요청
    Note over User, Server: 3. 인증된 요청 (/test 등)
    User->>Server: GET /test (쿠키 자동 동봉)
    Note over Server: JwtFilter에서 쿠키 추출 및 검증
    Note over Server: SecurityContext에 Authentication 설정
    Server-->>User: /test 페이지 반환 (200 OK)

    %% 4. 로그아웃
    Note over User, Server: 4. 로그아웃 (Logout)
    User->>Server: DELETE /logout
    Server->>Redis: 사용자의 Refresh Token 삭제
    Note over Server: Access/Refresh 쿠키 만료(MaxAge=0) 설정
    Server-->>User: 로그아웃 완료
```

---

## 🚀 실행 및 설정 방법

1. **`.env` 설정**
   - 프로젝트 루트([`C:/workspace/jwt-fetch/`](file:///C:/workspace/jwt-fetch/)) 디렉토리에 `.env` 파일을 생성하고 데이터베이스 접속 정보, Redis 호스트 정보, 그리고 충분한 길이(최소 256비트 이상)의 JWT 시크릿 키를 정의합니다.
   ```env
   # Database 설정 (Aiven Cloud MySQL)
   AIVEN_MYSQL_HOST=your-mysql-host.aivencloud.com
   AIVEN_MYSQL_PORT=your-port
   AIVEN_MYSQL_NAME=jwt
   AIVEN_MYSQL_USER=avnadmin
   AIVEN_MYSQL_PASSWORD=your_password
   
   # JWT 설정 (HMAC-SHA 256비트 이상 권장)
   JWT_SECRET_KEY=your_base64_encoded_secret_key_that_is_long_enough_over_32_bytes
   
   # Redis 설정 (Valkey / Redis Aiven URL)
   AIVEN_REDIS_URL=rediss://default:your_redis_password@your-redis-host.aivencloud.com:your-port
   ```

2. **애플리케이션 구동**
   ```bash
   ./gradlew bootRun
   ```

3. **테스트 및 검증**
   - 브라우저에서 `http://localhost:8080/` 접속 후 회원가입 및 로그인을 진행하고, 쿠키가 올바르게 발급되었는지 검사합니다.
   - `/test` 경로(인증 필수 화면)가 정상적으로 표시되는지 확인하고, 로그아웃 후 다시 접속 시 차단되는지 확인합니다.
