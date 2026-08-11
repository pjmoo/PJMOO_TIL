# 🔒 Spring Security 기초 실습 프로젝트 (Sec)

이 프로젝트는 **Spring Boot** 환경에서 **Spring Security**와 **Thymeleaf**를 연동하여 웹 보안의 기초 동작 원리를 실습하는 토이 프로젝트입니다.

---

## 🛠 기술 스택
- **Java**: 17
- **Framework**: Spring Boot 4.1.0, Spring Security 6
- **Template Engine**: Thymeleaf
- **Build Tool**: Gradle

---

## 🔑 핵심 실습 내용

### 1. 보안 필터 체인 (SecurityFilterChain) 설정
[`SecurityConfig.java`](file:///C:/workspace/sec/src/main/java/org/example/sec/config/SecurityConfig.java) 파일을 통해 스프링 시큐리티 필터들의 규칙을 정의했습니다.

- **URL별 접근 권한 설정**:
  - `/`, `/error/**`, `/free/1`, `/free/2` 경로는 로그인 없이 모두 접근 가능 (`permitAll()`).
  - 특정 HTTP GET 메소드를 이용한 `/free/3` 경로 역시 접근 허용.
  - 이외의 다른 모든 요청(`anyRequest()`)은 반드시 로그인을 통한 인증(`authenticated()`)을 거쳐야 합니다.
- **로그인/로그아웃 폼 설정**:
  - 스프링 시큐리티가 제공하는 기본 필터를 커스텀하여 커스텀 로그인 페이지와 로그아웃 성공 후 리다이렉트 위치를 설정했습니다.

---

### 2. 인메모리 유저 정보 관리 및 패스워드 암호화
사용자 정보를 하드코딩하지 않고 스프링 빈으로 관리하며, 비밀번호를 안전하게 암호화했습니다.

- **외부 설정파일 주입 (`@ConfigurationProperties`)**:
  - [`SecurityProperty.java`](file:///C:/workspace/sec/src/main/java/org/example/sec/config/SecurityProperty.java) 레코드를 생성하여 [`application.yaml`](file:///C:/workspace/sec/src/main/resources/application.yaml)의 `app.security` 경로 하위의 설정값들(`username`, `password`, `role`)을 매핑해 보안 데이터를 안전하게 분리했습니다.
- **인메모리 유저 매니저 (`InMemoryUserDetailsManager`)**:
  - 데이터베이스 연동 전, 서버 메모리 상에 설정값에 정의된 관리자 계정(`admin / admin1234`)을 임시 등록하여 시큐리티 인증에 사용했습니다.
- **패스워드 암호화 (`PasswordEncoder`)**:
  - `PasswordEncoderFactories.createDelegatingPasswordEncoder()`를 통해 디폴트 암호화 알고리즘(BCrypt 등)을 자동 적용하여 비밀번호를 평문 대신 암호화된 값으로 유효성 검사를 진행합니다.

---

### 3. 커스텀 로그인 / 로그아웃 화면 구현
기본 제공되는 시큐리티 로그인 폼 대신 사용자 맞춤형 화면을 만들고 Thymeleaf 기능을 활용했습니다.

- **로그인 컨트롤러**: [`LoginController.java`](file:///C:/workspace/sec/src/main/java/org/example/sec/controller/LoginController.java)를 생성하여 `/login` GET 요청 시 직접 만든 [`login.html`](file:///C:/workspace/sec/src/main/resources/templates/login.html) 뷰를 반환합니다.
- **타임리프 시큐리티 연동**: `thymeleaf-extras-springsecurity6`를 활용해 로그인 상태인 사용자와 비로그인 사용자에게 보이는 메인 화면([`index.html`](file:///C:/workspace/sec/src/main/resources/templates/index.html)) 구성을 다르게 제어하고 로그아웃 버튼을 유기적으로 배치했습니다.

---

### 4. 커스텀 예외 핸들링 (Error Handling)
보안 권한 부족 오류 및 잘못된 URL 호출을 처리하는 사용자 친화적 에러 페이지를 설정했습니다.

- **403 Forbidden (권한 없음)**:
  - [`CustomAccessDeniedHandler.java`](file:///C:/workspace/sec/src/main/java/org/example/sec/security/CustomAccessDeniedHandler.java)를 구현하여 인가되지 않은 권한으로 자원에 접근할 경우 `/error/403` 경로로 포워딩되도록 설정했습니다.
  - 이와 매핑되는 [`403.html`](file:///C:/workspace/sec/src/main/resources/templates/error/403.html) 화면을 통해 "접근 권한이 없습니다" 경고 메시지를 노출합니다.
- **404 Not Found (페이지 찾을 수 없음)**:
  - Spring Boot 표준 디렉토리 매핑 규칙에 따라 [`404.html`](file:///C:/workspace/sec/src/main/resources/templates/error/404.html) 템플릿을 생성하여 잘못된 주소 접근 시 에러 페이지가 깔끔하게 노출되도록 구성했습니다.
