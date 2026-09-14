# 🔒 Spring Boot REST Security & JWT 실습 프로젝트 (rest-sec)

본 프로젝트는 Spring Boot 환경에서 **Spring Security**와 **JWT (JSON Web Token)**를 활용하여 REST API 보안 및 인증 체계를 단계별로 구축한 실습 저장소입니다.

---

## 🛠️ 기술 스택
- **Framework**: Spring Boot 3.x, Spring Security 6.x
- **Database / ORM**: Spring Data JPA
- **Authentication**: JWT (JJWT 0.13.0)
- **API Documentation**: Springdoc OpenAPI (Swagger UI)

---

## 📂 프로젝트 패키지 구조
```text
src/main/java/org/example/restsec/
├── RestSecApplication.java        # 애플리케이션 진입점
├── auth/
│   ├── JwtAuthenticationFilter.java    # JWT 요청 인증 필터
│   ├── JwtProperties.java              # JWT 속성 바인딩
│   ├── JwtTokenProvider.java          # JWT 토큰 생성 및 검증 제공자
│   ├── RestAccessDeniedHandler.java    # 403 Forbidden 예외 처리기
│   └── RestAuthenticationEntryPoint.java # 401 Unauthorized 예외 처리기
├── config/
│   ├── JpaConfig.java                  # JPA Auditing 설정
│   ├── SecurityConfig.java             # Spring Security 및 CORS/CSRF 필터 체인 설정
│   └── SwaggerUIConfig.java            # OpenAPI / Swagger UI Bearer Auth 연동 설정
├── controller/
│   ├── AuthController.java             # JWT 발급을 위한 로그인 REST API 컨트롤러
│   └── ChairController.java            # 의자 정보 CRUD REST 컨트롤러 (보호된 API)
├── entity/
│   ├── BaseEntity.java                 # JPA Auditing 기반 공통 등록/수정 시간 필드
│   └── ChairEntity.java                # 의자 도메인 JPA 엔티티
├── repository/
│   └── ChairJpaRepository.java         # 의자 JPA 리포지토리 인터페이스
└── service/
    └── ChairService.java               # 의자 CRUD 비즈니스 로직 서비스
```

---

## 💡 주요 단계별 구현 내용

### 1단계: 기본 도메인 설계 및 JPA 설정
* **JPA Auditing**: [`BaseEntity.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/entity/BaseEntity.java)를 설계하고 [`JpaConfig.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/config/JpaConfig.java)를 통해 `@EnableJpaAuditing`을 활성화하여 생성일(`createdAt`)과 수정일(`modifiedAt`)을 자동으로 추적하도록 설정했습니다.
* **도메인 CRUD**: [`ChairEntity.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/entity/ChairEntity.java), [`ChairJpaRepository.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/repository/ChairJpaRepository.java), 그리고 [`ChairService.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/service/ChairService.java) 레이어를 작성해 CRUD 비즈니스 로직을 구축하였습니다.

### 2단계: Spring Security 기본 설정 및 CORS/CSRF
* **CSRF 비활성화**: REST API의 무상태성을 고려해 CSRF 보안 설정을 비활성화했습니다.
* **CORS 설정**: 외부 도메인(`http://127.0.0.1:5500`)에서의 API 접근을 허용하도록 [`SecurityConfig.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/config/SecurityConfig.java) 내부에 `CorsConfigurationSource` Bean을 정의하고 설정했습니다.
* **정적 리소스 및 경로 허용**: 프론트엔드 테스트를 위한 정적 페이지 경로와 Swagger UI 관련 경로를 인증 예외(`permitAll()`) 경로로 지정했습니다.

### 3단계: HTTP Basic 인증 & 예외 처리 커스터마이징
* **HTTP Basic Auth**: 인증 실패 시 기본 HTML 로그인 폼 대신 REST 응답에 맞춘 에러를 출력하기 위해 HTTP Basic 인증을 비활성화하고, 커스텀 예외 핸들러를 도입했습니다.
* **401 Unauthorized**: 인증에 실패해 접근 권한을 획득하지 못했을 경우 JSON 형태의 에러 응답을 반환하는 [`RestAuthenticationEntryPoint.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/auth/RestAuthenticationEntryPoint.java)를 구현하였습니다.
* **403 Forbidden**: 필요한 권한이 없는 자원에 접근(예: DELETE 요청 시 ADMIN 권한 검증 실패 등)할 경우 처리하는 [`RestAccessDeniedHandler.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/auth/RestAccessDeniedHandler.java)를 연동하였습니다.

### 4단계: JWT 기반 인증 체계 전환
* **JJWT 라이브러리 연동**: JWT 처리를 위해 `jjwt-api`, `jjwt-impl`, `jjwt-jackson` 의존성(0.13.0 버전)을 추가했습니다.
* **JwtProperties 설정 분리**: 보안을 위해 JWT 서명 비밀 키와 토큰 유효 기간 설정을 `application-jwt.yaml`로 분리하고, [`JwtProperties.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/auth/JwtProperties.java) 클래스에서 `@ConfigurationProperties`를 사용해 가져오도록 설정했습니다.
* **JwtTokenProvider 구현**:
  * [`JwtTokenProvider.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/auth/JwtTokenProvider.java)는 사용자 식별자 및 역할을 포함하는 JWT Access Token 생성 및 검증 로직을 포함합니다.
* **로그인 API 및 Filter 연동**:
  * [`AuthController.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/controller/AuthController.java)에서 사용자 인증 후 성공 시 JWT 토큰을 발급하는 `/auth/login` 엔드포인트를 제공합니다.
  * [`JwtAuthenticationFilter.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/auth/JwtAuthenticationFilter.java)를 구현하여 요청 헤더(`Authorization: Bearer <TOKEN>`)에서 토큰을 파싱하고, 검증이 성공할 경우 `SecurityContextHolder`에 인증 객체를 주입하여 요청 당 1회 인증 프로세스가 수행되도록 설계했습니다.

---

## 🔄 JWT 인증 흐름 (Authentication Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Client as 클라이언트 (브라우저/Swagger)
    participant Auth as AuthController (로그인 API)
    participant Provider as JwtTokenProvider
    participant Filter as JwtAuthenticationFilter
    participant API as ChairController (보호된 API)

    Note over Client, Auth: 1. 로그인 및 토큰 발급
    Client->>Auth: POST /auth/login (username, password)
    Auth->>Provider: 토큰 생성 요청
    Provider-->>Auth: JWT Access Token 생성 완료
    Auth-->>Client: JWT 반환

    Note over Client, API: 2. 토큰을 이용한 API 요청
    Client->>Filter: GET /chair (Header: Bearer <JWT>)
    Filter->>Provider: 토큰 검증 및 Claims 파싱
    Provider-->>Filter: 유효한 토큰 및 권한 정보 반환
    Filter->>Filter: SecurityContext에 인증 정보 저장
    Filter->>API: 컨트롤러로 요청 전달
    API-->>Client: API 응답 데이터 전달
```

---

## 🚀 실행 및 테스트 방법

### 1. Swagger UI 접속
* 애플리케이션 실행 후 `http://localhost:8080/swagger-ui.html`에 접속합니다.

### 2. 로그인 및 토큰 발급
* [`AuthController.java`](file:///C:/workspace/rest-sec/src/main/java/org/example/restsec/controller/AuthController.java)의 `/auth/login` API를 호출하여 JWT를 발급받고 복사합니다.

### 3. 인증 토큰 적용
* Swagger UI 우측 상단의 **Authorize** 버튼을 클릭한 후 복사한 토큰을 `bearerAuth` 필드에 입력하여 적용합니다.

### 4. 보호된 API 호출
* `/chair` 등의 엔드포인트에 요청을 전송해 권한에 따라 정상 처리되는지 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/restsec/controller/AuthController.java](<../../rest-sec/src/main/java/org/example/restsec/controller/AuthController.java>) · [src/main/java/org/example/restsec/controller/ChairController.java](<../../rest-sec/src/main/java/org/example/restsec/controller/ChairController.java>) · [src/main/java/org/example/restsec/RestSecApplication.java](<../../rest-sec/src/main/java/org/example/restsec/RestSecApplication.java>)

### 보안 필터의 오류와 컨트롤러 오류

보안 필터에서 차단된 요청은 컨트롤러까지 도달하지 않을 수 있어 ControllerAdvice만으로 모든 오류를 처리할 수 없다. 인증 실패는 AuthenticationEntryPoint, 접근 거부는 AccessDeniedHandler 같은 보안 계층의 처리 지점과 연결한다. 401과 403을 구분해야 클라이언트도 로그인과 권한 부족을 다르게 안내한다.

**예시로 이해하기:** 구체적인 허용 규칙을 앞에 두고 포괄 규칙을 뒤에 두는 순서를 읽는다. JWT 또는 REST라는 이름만으로 CSRF를 꺼도 된다고 판단하지 않는다. 쿠키처럼 브라우저가 자격 증명을 자동 전송하는지와 실제 인증 방식을 기준으로 검토한다.

근거: 423 Spring Security와 REST API 인증인가 — [13쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=13>) · [25쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=25>) · [27쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=27>) · [33쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=33>) · [35쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=35>) · [36쪽](<../../260629_ex/새 폴더/8-18/423_Spring_Security와_REST_API_인증인가.pdf#page=36>)

### JWT를 읽는 것과 검증하는 것의 차이

JWT의 payload는 Base64URL로 표현되며 일반적으로 누구나 디코딩할 수 있다. 서명은 내용 변조를 검증하는 수단이지 본문을 숨기는 암호화가 아니다. 서버는 서명·만료와 앱이 요구하는 클레임을 검증한 뒤 인증 객체를 만들어야 한다.

**예시로 이해하기:** 토큰에서 사용자 ID를 읽었다는 이유만으로 인증을 통과시키면 안 된다. Bearer 토큰 추출 → 검증 → SecurityContext 구성 → 인가 순서로 읽는다. 클라이언트가 토큰을 삭제해도 복사된 토큰은 만료 전까지 유효할 수 있어 로그아웃 정책과 별도로 생각해야 한다.

근거: 424-1 JWT 기반 무상태 인증 — [15쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=15>) · [17쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=17>) · [18쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=18>) · [20쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=20>) · [29쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=29>) · [39쪽](<../../260629_ex/새 폴더/8-18/424-1_JWT_기반_무상태_인증.pdf#page=39>)

### 오류 응답을 클라이언트가 처리할 수 있게 만들기

REST의 오류 응답은 상태 코드와 일관된 본문이 함께 있어야 한다. ProblemDetail의 type·title·status·detail·instance는 오류의 종류와 상황을 표현하고 필요한 필드 오류는 확장 정보로 추가할 수 있다. 도메인 예외를 HTTP 응답으로 바꾸는 책임을 공통 처리기에 모으면 중복을 줄인다.

**예시로 이해하기:** 없는 글은 404, 입력 검증 실패는 400처럼 클라이언트가 대응을 구분할 수 있게 한다. 서버의 SQL·스택 추적·비밀 설정을 응답에 담지 않고 요청 식별자로 로그와 연결한다. 실제 HTTP 상태와 본문의 status가 일치하는지도 확인한다.

근거: 421-2 REST API 예외 처리와 문서화 — [9쪽](<../../260629_ex/새 폴더/8-13/421-2_REST_API_예외_처리와_문서화.pdf#page=9>) · [17쪽](<../../260629_ex/새 폴더/8-13/421-2_REST_API_예외_처리와_문서화.pdf#page=17>) · [18쪽](<../../260629_ex/새 폴더/8-13/421-2_REST_API_예외_처리와_문서화.pdf#page=18>) · [31쪽](<../../260629_ex/새 폴더/8-13/421-2_REST_API_예외_처리와_문서화.pdf#page=31>) · [39쪽](<../../260629_ex/새 폴더/8-13/421-2_REST_API_예외_처리와_문서화.pdf#page=39>)

<!-- pdf-til-supplement:end -->
