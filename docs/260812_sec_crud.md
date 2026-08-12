# 🔐 Spring Security & JPA CRUD 실습 프로젝트 (260812_sec_crud)

본 프로젝트는 **Spring Boot 3**, **Spring Security**, 그리고 **Spring Data JPA**를 활용하여 유저 회원가입/로그인/탈퇴 및 게시판(Board) CRUD 기능을 구현한 실습 프로젝트입니다.

---

## 🛠️ 기술 스택 (Technology Stack)
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security 6.x
- **Database**: MySQL (Aiven Cloud DB 연동)
- **ORM**: Spring Data JPA (Hibernate)
- **Template Engine**: Thymeleaf
- **Build Tool**: Gradle

---

## 📂 프로젝트 구조 및 핵심 파일 설명

### 1. 설정 (Configuration & Properties)
- [`application.yaml`](file:///C:/workspace/sec_crud/src/main/resources/application.yaml) / [`application-db.yaml`](file:///C:/workspace/sec_crud/src/main/resources/application-db.yaml): 데이터베이스 접속 설정 및 Thymeleaf 캐시 비활성화, Spring Security 테스트용 기본 유저 계정 설정.
- [`.env.dev.sample`](file:///C:/workspace/sec_crud/.env.dev.sample): Aiven Cloud DB 접속 시 필요한 환경 변수 템플릿. `.env.dev` 파일에 값을 기입하여 로컬에서 연동합니다.
- [`SecurityConfig.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/config/SecurityConfig.java): 비밀번호 암호화 인코더(Argon2) 정의 및 페이지별 권한 인가(requestMatchers), Custom Login/Logout 설정을 담은 보안 구성 클래스.

### 2. 도메인 및 엔티티 (Domain & Entities)
- [`BaseEntity.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/entity/BaseEntity.java): 생성 시간(`createdAt`) 및 수정 시간(`updatedAt`)을 자동으로 기록하는 JPA Auditing 상위 클래스.
- [`UserAccountEntity.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/entity/UserAccountEntity.java): 유저 계정 정보를 담고 있는 엔티티. Soft Delete(`isActive` 컬럼) 기능 및 ElementCollection을 통한 다대다 유저 역할(`roles`) 매핑 관리.
- [`UserAccountRole.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/enums/UserAccountRole.java): 유저 권한 정보(`USER`, `ADMIN`)를 정의하는 Enum 클래스.
- [`BoardEntity.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/entity/BoardEntity.java): 게시글 제목, 내용, 그리고 유저(`UserAccountEntity`)와의 다대일(`@ManyToOne(fetch = FetchType.LAZY)`) 관계가 적용된 게시글 엔티티.

### 3. 리포지토리 및 쿼리 최적화 (Repositories)
- [`UserAccountJpaRepository.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/repository/UserAccountJpaRepository.java): 활성화된 유저 정보만 필터링 조회(`isActive = true`)하기 위한 Custom Query(`@Query`)가 적용된 JPA 리포지토리.
- [`BoardJpaRepository.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/repository/BoardJpaRepository.java): **N+1 쿼리 문제** 해결을 위해 `@EntityGraph` 및 `JOIN FETCH`를 사용해 작성자(`writer`) 정보를 지연 로딩 없이 함께 조회하도록 구현된 리포지토리.

### 4. 비즈니스 로직 및 인증 처리 (Services & DTOs)
- [`UserAccountService.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/service/UserAccountService.java): 중복 가입 방지 검증, 비밀번호 해싱(Argon2)을 적용한 회원가입 비즈니스 로직 및 회원 탈퇴(isActive = false) 처리.
- [`BoardService.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/entity/BoardService.java): 게시물 작성, 조회, 그리고 작성자 본인 여부 검증을 포함한 수정 로직 구현.
- [`CustomUserDetailsService.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/service/CustomUserDetailsService.java) & [`CustomUserDetails.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/dto/CustomUserDetails.java): DB와 연동하여 인증 과정을 처리하기 위해 Spring Security의 `UserDetailsService`, `UserDetails`를 커스텀 구현한 클래스.
- DTO 클래스들 ([`UserJoinFormDTO.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/dto/UserJoinFormDTO.java), [`UserLoginFormDTO.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/dto/UserLoginFormDTO.java), [`BoardFormDTO.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/domain/dto/BoardFormDTO.java)): 컨트롤러와 뷰, 서비스 계층 간 안전하게 데이터를 주고받기 위한 불변 DTO.

### 5. 웹 컨트롤러 및 뷰 (Controllers & Views)
- [`MainController.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/controller/MainController.java): 메인 인덱스 페이지 연결 및 로그인된 사용자 세션 정보 전달.
- [`UserAccountController.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/controller/UserAccountController.java): 로그인, 회원가입, 탈퇴 요청 처리 매핑.
- [`BoardController.java`](file:///C:/workspace/sec_crud/src/main/java/org/example/sec_crud/controller/BoardController.java): 게시판 목록 조회, 새 글 작성, 본인 작성 글 수정 기능 매핑.
- `templates/` 하위 HTML 파일들:
  - [`index.html`](file:///C:/workspace/sec_crud/src/main/resources/templates/index.html): 메인 페이지. 로그인 상태에 따른 프로필 정보 조회 및 로그아웃/탈퇴 폼 제공.
  - [`join.html`](file:///C:/workspace/sec_crud/src/main/resources/templates/user/join.html) & [`login.html`](file:///C:/workspace/sec_crud/src/main/resources/templates/user/login.html): 회원가입 및 로그인 폼.
  - [`page.html`](file:///C:/workspace/sec_crud/src/main/resources/templates/board/page.html): 게시글 작성, 전체 목록 조회 및 본인이 쓴 글 수정이 가능한 원페이지 구성 뷰.

---

## 🔑 주요 구현 기능 및 설계 특징

1. **JPA Auditing 활성화**:
   - `SecCrudApplication`에 `@EnableJpaAuditing`을 적용하고, 엔티티들이 `BaseEntity`를 확장함으로써 데이터 생성/수정 시간이 데이터베이스에 자동으로 삽입됩니다.
2. **보안성 높은 비밀번호 암호화**:
   - `DelegatingPasswordEncoder`를 통해 `Argon2` 알고리즘을 기본값으로 사용하고 있습니다. (`bcrypt`, `scrypt` 지원)
3. **Soft Delete를 이용한 회원 탈퇴**:
   - 탈퇴 시 데이터베이스에서 유저 레코드를 직접 삭제하지 않고 `isActive = false`로 속성을 변경합니다.
   - 탈퇴한 유저의 정보가 로그인 혹은 중복 회원 검증 단계에서 접근되지 않도록 리포지토리 쿼리에 `u.isActive = true` 필터링을 추가했습니다.
4. **N+1 문제 방지 (성능 최적화)**:
   - 게시물 목록을 불러올 때 매번 작성자 정보 쿼리가 추가적으로 나가는 N+1 문제를 방지하기 위해 `BoardJpaRepository`에서 `@EntityGraph(attributePaths = "writer")`를 선언하고 단건 상세조회 시 `JOIN FETCH`를 사용했습니다.

---

## 🏃 실행 및 테스트 방법
1. **환경 변수 파일 작성**:
   - 프로젝트 루트 디렉토리에 `.env.dev` 파일을 생성하고 `.env.dev.sample` 양식에 맞춰 실습용 데이터베이스(MySQL) 접속 정보를 기입합니다.
2. **애플리케이션 실행**:
   - 터미널에서 `./gradlew bootRun` 명령으로 서버를 가동합니다.
3. **접근 가능 경로 테스트**:
   - 비인증 접근 허용 경로: `/`, `/user/join`, `/user/login`
   - 인증 필요 경로: `/board`, `/user/withdraw` (비로그인 상태로 진입 시 로그인 페이지로 리다이렉트됩니다.)
