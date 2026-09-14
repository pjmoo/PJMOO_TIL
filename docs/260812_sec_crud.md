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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/sec_crud/controller/BoardController.java](<../../sec_crud/src/main/java/org/example/sec_crud/controller/BoardController.java>) · [src/main/java/org/example/sec_crud/controller/MainController.java](<../../sec_crud/src/main/java/org/example/sec_crud/controller/MainController.java>) · [src/main/java/org/example/sec_crud/controller/UserAccountController.java](<../../sec_crud/src/main/java/org/example/sec_crud/controller/UserAccountController.java>)

### 회원가입 저장과 로그인 검증 연결하기

회원가입은 입력 검증과 중복 확인 후 비밀번호를 해시해 계정을 저장한다. 로그인은 저장된 계정과 비밀번호 검증 결과를 인증 객체로 연결한다. 폼 입력 DTO, 계정 엔티티, 인증 주체 객체는 역할이 달라 필요한 정보만 전달하는 것이 중요하다.

**예시로 이해하기:** 같은 비밀번호를 두 번 encode해 문자열이 같은지 비교하는 방식은 솔트가 있는 해시에서 맞지 않는다. matches로 평문 입력과 저장된 해시를 검증한다. 사전 중복 조회를 통과한 두 가입 요청이 동시에 저장될 수 있으므로 DB 유일성 제약도 살펴본다.

근거: 412-1 회원 관리와 DB 기반 인증 구현하기 — [22쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=22>) · [25쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=25>) · [33쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=33>) · [36쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=36>) · [45쪽](<../../260629_ex/새 폴더/8-12/412-1_회원_관리와_DB_기반_인증_구현하기.pdf#page=45>)

### 역할 권한과 작성자 권한을 함께 검사하기

역할 기반 접근 제어는 회원·관리자 같은 사용자 범주의 권한을 정한다. 작성자 검사는 특정 게시글과 현재 사용자의 관계를 확인한다. “회원이면 수정 API 호출 가능”이라는 경로 규칙만으로 다른 회원의 글 수정을 막을 수는 없다.

**예시로 이해하기:** 수정할 글의 ID는 요청에서 받고 사용자 ID는 검증된 인증 주체에서 얻는다. 서버가 읽은 글의 작성자와 비교한 뒤 수정한다. 화면 버튼 표시, API 접근 규칙, 서비스의 소유권 검사가 각각 맡는 범위를 나누어 기록한다.

근거: 412-2 역할 기반 인가와 작성자 권한 검증 — [7쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=7>) · [18쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=18>) · [40쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=40>) · [41쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=41>) · [44쪽](<../../260629_ex/새 폴더/8-12/412-2_역할_기반_인가와_작성자_권한_검증.pdf#page=44>)

### 연관관계의 주인과 N+1의 발생 시점

양방향 관계에서는 외래키 변경을 반영하는 연관관계의 주인이 중요하다. 반대쪽 컬렉션에만 추가하면 기대한 FK 변경이 저장되지 않을 수 있다. LAZY는 필요한 시점까지 조회를 미루지만 반복문에서 연관 객체를 하나씩 읽으면 N+1 쿼리가 생길 수 있다.

**예시로 이해하기:** 회원 목록 1회 조회 후 각 회원의 팀을 읽으며 추가 SQL이 발생하는지 확인한다. fetch join이나 조회 전용 DTO로 필요한 데이터를 가져오는 방법을 비교한다. 컬렉션 fetch join과 페이징을 함께 쓰면 행 수가 늘어나므로 단순히 한 번의 쿼리로 줄이는 것만 목표로 삼지 않는다.

근거: 323-2 JPA 연관관계 매핑과 N1 문제 — [9쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=9>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=11>) · [19쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=26>) · [28쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=28>)

<!-- pdf-til-supplement:end -->
