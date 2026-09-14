# 🔐 Spring Boot Security & JPA 소셜 로그인 실습 프로젝트 (secu)

본 프로젝트는 **Spring Boot 4.x**, **Spring Security 6.x**, 그리고 **JPA(PostgreSQL - Neon Serverless DB)**를 연동하여 데이터베이스 기반의 회원가입/로그인, 댓글 시스템(CRUD 및 쿼리 최적화), 관리자 권한 제어, 그리고 **카카오 소셜 로그인(OAuth2)**까지 단계별로 구축한 실습 프로젝트입니다.

---

## 🛠️ 기술 스택 (Technology Stack)
- **Framework**: Spring Boot 4.1.x
- **Security**: Spring Security 6.x (OAuth2 Client)
- **Database**: PostgreSQL (Neon Serverless DB 연동)
- **ORM**: Spring Data JPA (Hibernate)
- **Template Engine**: Thymeleaf (Thymeleaf Extras SpringSecurity6)
- **Build Tool**: Gradle

---

## 📂 프로젝트 구조 및 핵심 파일 설명

### 1. 보안 설정 (Configuration)
- [`SecurityConfig.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/config/SecurityConfig.java): 비밀번호 암호화 인코더(`Argon2`) 정의, 권한별 인가 규칙 설정, 폼 로그인/로그아웃 설정 및 카카오 OAuth2 소셜 로그인 통합 설정을 담은 보안 구성 클래스.

### 2. 도메인 및 엔티티 (Domain & Entities)
- [`UserAccountEntity.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/entity/UserAccountEntity.java): 사용자 식별 정보를 정의한 엔티티. 일반 가입 유저와 소셜 가입 유저(`socialId`, `socialProvider`) 정보를 통합적으로 관리합니다.
- [`CommentEntity.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/entity/CommentEntity.java): 댓글 내용을 저장하며 작성자([`UserAccountEntity`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/entity/UserAccountEntity.java))와 다대일(`@ManyToOne(fetch = FetchType.LAZY)`) 단방향 연관 관계를 맺고 있는 엔티티.

### 3. 리포지토리 및 성능 최적화 (Repositories)
- [`UserAccountRepository.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/repository/UserAccountRepository.java): 유저 데이터 접근 리포지토리.
- [`CommentRepository.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/repository/CommentRepository.java): 댓글 목록 조회 시 발생하는 **N+1 쿼리 문제**를 해결하기 위해 `JOIN FETCH` 및 `@EntityGraph(attributePaths = "writer")`를 활용해 성능을 최적화한 리포지토리.

### 4. 비즈니스 로직 및 인증/소셜 처리 (Services & DTOs)
- [`UserAccountService.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/service/UserAccountService.java): 중복 유저 검증 및 Argon2 비밀번호 암호화를 적용한 회원가입 비즈니스 로직.
- [`CommentService.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/service/CommentService.java): 댓글 CRUD 기능 및 삭제 시 **"댓글 작성자 본인"** 또는 **"관리자(ADMIN) 권한자"** 여부를 판별하는 소유권 검증 로직.
- [`CustomUserDetailsService.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/service/CustomUserDetailsService.java) & [`CustomUserDetails.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/dto/CustomUserDetails.java): DB 기반 로그인 처리를 위해 `UserDetailsService`와 `UserDetails`를 구현하여 커스텀 정보(유저 PK ID 등)를 바인딩합니다.
- [`CustomOAuth2UserService.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/service/CustomOAuth2UserService.java): 카카오 로그인 완료 후 유저 정보(JSON)를 파싱하여 신규 회원일 경우 소셜 전용 계정으로 자동 가입 처리하는 OAuth2 서비스.
- [`CustomOAuth2User.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/dto/CustomOAuth2User.java): 일반 로그인 객체([`CustomUserDetails`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/dto/CustomUserDetails.java))와 소셜 로그인 객체를 일원화하기 위한 DTO 클래스.
- [`KakaoOAuth2DTO.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/domain/dto/KakaoOAuth2DTO.java): 카카오 유저 정보 JSON 데이터를 Jackson 매핑을 통해 안전하게 추출하는 데이터 전송 객체.

### 5. 웹 컨트롤러 (Controllers)
- [`UserAccountController.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/controller/UserAccountController.java): 일반 유저 회원가입 및 로그인 뷰 이동 매핑.
- [`CommentController.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/controller/CommentController.java): 댓글 생성, 수정, 삭제 처리 API.
- [`AdminController.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/controller/AdminController.java): 오직 `ROLE_ADMIN`만 접근 가능한 테스트 API.

---

## 🔑 주요 구현 기능 및 설계 특징

1. **Spring Security & DB 기반 인증 구축**:
   - `DelegatingPasswordEncoder`를 통해 현대 보안 표준인 `Argon2` 알고리즘으로 비밀번호를 암호화했습니다.
   - Thymeleaf Security 연동을 활용해 HTML 템플릿 상에서 인가 상태(`sec:authorize`)에 맞춘 동적 화면을 제어합니다.
2. **JPA N+1 쿼리 최적화**:
   - 지연 로딩(`LAZY`)으로 인해 발생하는 N+1 문제를 `JOIN FETCH`와 `@EntityGraph` 기법을 번갈아 실습하여 한 줄의 쿼리로 다량의 데이터를 즉시 성능 하락 없이 조회하도록 튜닝했습니다.
3. **소유권 검증 및 권한 인가**:
   - 특정 API 경로(`/admin/**`)는 Security 필터 체인에서 `hasRole('ADMIN')` 조건을 정의하여 인가되지 않은 일반 유저 접근을 완벽히 차단합니다.
   - 비즈니스 레이어에서 댓글 삭제 시 소유권을 검증하는 로직을 견고히 구현하였습니다.
4. **OAuth2 소셜 로그인 통합**:
   - 일반 Form 로그인 성공 유저와 OAuth2 소셜 로그인 성공 유저가 동일한 인터페이스를 기반으로 다뤄질 수 있게 구현하여, 컨트롤러가 `@AuthenticationPrincipal`로 로그인 수단에 관계없이 동일한 사용자 식별 객체를 받아올 수 있도록 일원화하였습니다.

---

## 🚨 트러블슈팅 (Troubleshooting)

### 📌 카카오 로그인 시 500 에러 (`Password NOT NULL 제약조건 위반`)
- **문제 상황**: 카카오 소셜 로그인을 성공적으로 마친 뒤 최초 자동 회원가입이 수행될 때, 아래와 같은 데이터베이스 삽입 실패 에러가 발생했습니다.
  > `ERROR: null value in column "password" of relation "user_account" violates not-null constraint`
- **원인**: 카카오 인증 과정에서는 사용자 비밀번호가 없으므로 `password` 필드를 `null`인 채로 삽입을 시도했으나, 데이터베이스 테이블에 설정된 기존 일반 회원용 `password NOT NULL` 제약 조건에 의해 트랜잭션이 거부되었습니다. (Hibernate의 `ddl-auto: update` 옵션은 이미 생성된 NOT NULL 제약조건을 지워주지 않습니다.)
- **해결**: 카카오 가입 처리 로직([`CustomOAuth2UserService.java`](file:///C:/workspace/secu/src/main/java/org/example/secu/service/CustomOAuth2UserService.java))에서 사용자를 빌드할 때 임의의 무작위 값(`UUID.randomUUID().toString()`)을 비밀번호로 강제 삽입해 주는 방식을 적용하여, DB의 제약조건을 만족시킴과 동시에 소셜 계정의 보안성을 해치지 않고 문제를 완벽하게 해결했습니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/secu/controller/AdminController.java](<../../secu/src/main/java/org/example/secu/controller/AdminController.java>) · [src/main/java/org/example/secu/controller/CommentController.java](<../../secu/src/main/java/org/example/secu/controller/CommentController.java>) · [src/main/java/org/example/secu/controller/UserAccountController.java](<../../secu/src/main/java/org/example/secu/controller/UserAccountController.java>)

### 회원가입 저장과 로그인 검증 연결하기

회원가입은 입력 검증과 중복 확인 후 비밀번호를 해시해 계정을 저장한다. 로그인은 저장된 계정과 비밀번호 검증 결과를 인증 객체로 연결한다. 폼 입력 DTO, 계정 엔티티, 인증 주체 객체는 역할이 달라 필요한 정보만 전달하는 것이 중요하다.

**예시로 이해하기:** 같은 비밀번호를 두 번 encode해 문자열이 같은지 비교하는 방식은 솔트가 있는 해시에서 맞지 않는다. matches로 평문 입력과 저장된 해시를 검증한다. 사전 중복 조회를 통과한 두 가입 요청이 동시에 저장될 수 있으므로 DB 유일성 제약도 살펴본다.

근거: 412-1 회원 관리와 DB 기반 인증 구현하기 — [22쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=22>) · [25쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=25>) · [33쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=33>) · [36쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=36>) · [45쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=45>)

### 역할 권한과 작성자 권한을 함께 검사하기

역할 기반 접근 제어는 회원·관리자 같은 사용자 범주의 권한을 정한다. 작성자 검사는 특정 게시글과 현재 사용자의 관계를 확인한다. “회원이면 수정 API 호출 가능”이라는 경로 규칙만으로 다른 회원의 글 수정을 막을 수는 없다.

**예시로 이해하기:** 수정할 글의 ID는 요청에서 받고 사용자 ID는 검증된 인증 주체에서 얻는다. 서버가 읽은 글의 작성자와 비교한 뒤 수정한다. 화면 버튼 표시, API 접근 규칙, 서비스의 소유권 검사가 각각 맡는 범위를 나누어 기록한다.

근거: 412-2 역할 기반 인가와 작성자 권한 검증 — [7쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=7>) · [18쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=18>) · [40쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=40>) · [41쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=41>) · [44쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=44>)

### 외부 로그인과 앱 계정의 연결

소셜 로그인은 외부 제공자의 인증 결과를 받아 앱의 사용자 계정과 연결하는 과정이다. 제공자 토큰과 앱 세션·앱 토큰은 서로 다른 자격 증명이다. 사용자를 식별할 때 제공자와 제공자 내부 사용자 ID의 조합을 생각하면 여러 로그인 수단의 충돌을 줄일 수 있다.

**예시로 이해하기:** 인가 코드 반환 → 서버의 토큰 교환 → 사용자 정보 확인 → 앱 계정 조회·연결 → 앱 로그인 상태 생성 순서로 추적한다. 클라이언트가 보낸 닉네임이나 이메일만으로 다른 기존 계정과 자동 연결해서는 안 된다.

근거: 413 OAuth2 소셜 로그인 연동 — [10쪽](<../../260629_ex/새 폴더/8-12/413_OAuth2_소셜_로그인_연동.pdf#page=10>) · [35쪽](<../../260629_ex/새 폴더/8-12/413_OAuth2_소셜_로그인_연동.pdf#page=35>) · [36쪽](<../../260629_ex/새 폴더/8-12/413_OAuth2_소셜_로그인_연동.pdf#page=36>) · [43쪽](<../../260629_ex/새 폴더/8-12/413_OAuth2_소셜_로그인_연동.pdf#page=43>)

<!-- pdf-til-supplement:end -->
