# 📱 Spring Data JPA 실습 프로젝트 (JPA3)

이 프로젝트는 **Spring Data JPA**의 핵심적인 고급 기능들을 실습하고 이해하기 위해 구성된 프로젝트입니다.  
초보자분들도 쉽게 학습할 수 있도록 실습에서 다룬 주요 개념(Auditing, Dirty Checking, Transaction, Self-Invocation, Paging/Sorting)을 실제 코드 예시와 함께 단계별로 정리해 두었습니다.

---

## 🛠️ 기술 스택 (Tech Stack)
- **Java**: 17
- **Framework**: Spring Boot 4.1.0
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **JPA & ORM**: Spring Data JPA, Hibernate, QueryDSL (JPAQueryFactory 설정)
- **View**: JSP (JavaServer Pages) & JSTL

---

## 📂 프로젝트 구조 및 주요 파일
각 파일을 클릭하면 해당 실습 코드로 바로 이동하여 확인하실 수 있습니다.

- **Entity & Configuration**
  - [JPAConfig.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/config/JPAConfig.java): Auditing 기능 활성화 및 QueryDSL `JPAQueryFactory` 빈 설정
  - [BaseEntity.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/entity/BaseEntity.java): 생성 시간/수정 시간을 자동으로 기록하는 공통 부모 엔티티
  - [Phone.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/entity/Phone.java): 휴대폰 정보를 담은 메인 데이터베이스 엔티티

- **Repository (데이터 접근 계층)**
  - [PhoneRepository.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/repository/PhoneRepository.java): 휴대폰 저장소의 비즈니스용 인터페이스
  - [JPAPhoneRepository.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/repository/JPAPhoneRepository.java): Spring Data JPA에서 기본으로 제공하는 `JpaRepository` 구현체
  - [PhoneRepositoryImpl.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/repository/PhoneRepositoryImpl.java): 외부 인터페이스와 JPA/QueryDSL 기술을 연결해주는 구현 클래스

- **Service (비즈니스 로직 계층)**
  - [PhoneService.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/service/PhoneService.java): 트랜잭션, 더티 체킹, 롤백 규칙, 자가 호출 문제를 다루는 핵심 서비스 클래스
  - [PhoneService2.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/service/PhoneService2.java): 프록시(AOP) 동작과 트랜잭션 전파(Propagation)를 검증하기 위한 서브 서비스 클래스

- **Controller & DTO & UI**
  - [MainController.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/controller/MainController.java): 페이지네이션 및 생성/수정 요청을 받아 처리하는 웹 컨트롤러
  - [PhoneFormDTO.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/dto/PhoneFormDTO.java): 클라이언트로부터 전달되는 폰 정보를 담는 Java 17 Record DTO
  - [index.jsp](file:///C:/workspace/jpa3/src/main/webapp/WEB-INF/views/index.jsp): 화면에 폰 목록을 렌더링하고, 생성/수정/페이지 정렬 테스트가 가능한 UI 페이지

---

## 💡 핵심 실습 개념 이해하기 (Beginner's Guide)

### 1. Spring Data JPA Auditing (등록/수정 시간 자동 생성)
데이터베이스의 테이블마다 등록 시간(`createdAt`)과 수정 시간(`updatedAt`)을 매번 직접 입력하는 것은 매우 번거롭습니다. Spring Data JPA는 이를 자동으로 넣어주는 **Auditing** 기능을 지원합니다.

* **어떻게 동작하나요?**
  1. [BaseEntity.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/entity/BaseEntity.java)에 `@MappedSuperclass`를 붙여 다른 엔티티들이 상속받을 수 있도록 하고, `@EntityListeners(AuditingEntityListener.class)`를 붙여 변경 감지 리스너를 장착합니다.
  2. 필드 위에 `@CreatedDate`와 `@LastModifiedDate`를 붙입니다.
  3. [JPAConfig.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/config/JPAConfig.java) 설정 클래스 상단에 `@EnableJpaAuditing`을 선언하여 기능을 활성화합니다.
  4. 이후 [Phone.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/entity/Phone.java) 엔티티가 저장되거나 수정될 때 데이터베이스에 시간이 자동으로 기록됩니다.

---

### 2. Dirty Checking (더티 체킹 / 변경 감지)
데이터를 수정할 때 보통 `update()` 나 `save()` 메서드를 직접 호출해야 할 것 같지만, JPA 환경에서는 영속 상태의 엔티티 값만 변경하면 자동으로 수정 쿼리가 실행됩니다. 이를 **더티 체킹(변경 감지)**이라고 부릅니다.

* **동작 원리**
  - 트랜잭션 범위 안에서 데이터베이스로부터 데이터를 조회해 오면, JPA는 그 데이터의 초기 상태를 캡처(Snapshot)해 둡니다.
  - 비즈니스 로직에 의해 엔티티의 상태(예: 이름 수정)가 변경된 상태에서 트랜잭션이 종료(Commit)되는 시점에, JPA는 **초기 Snapshot과 현재 상태를 비교**합니다.
  - 달라진 부분이 있다면 **자동으로 `UPDATE` SQL을 생성하여 실행**합니다.

```java
// PhoneService.java 코드 예시
@Transactional // <- 트랜잭션 시작
public void changeName(Long id, String name) {
    Phone phone = findById(id); // DB에서 조회 (JPA 영속성 컨텍스트 관리 하에 들어감)
    phone.changeName(name);     // 값을 수정함 (따로 save()를 호출하지 않음!)
} // <- 트랜잭션 종료 시 변경 사항 감지 후 UPDATE SQL 자동 실행!
```

---

### 3. Spring 트랜잭션의 예외 처리와 롤백 (Rollback) 규칙
Spring의 `@Transactional`은 기본적으로 어떤 에러(Exception)가 났는지에 따라 롤백을 할지 안 할지가 결정됩니다.

* **기본 규칙**: 
  - **Unchecked Exception** (런타임 예외: `RuntimeException`, `Error` 등): **자동으로 전체 롤백**
  - **Checked Exception** (`Exception` 등): **기본적으로 롤백되지 않고 커밋됨** (중요!)
* **실습 코드 설명**:
  [PhoneService.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/service/PhoneService.java#L80-L95)에서는 이 규칙을 커스텀하게 조절하는 예제를 실습했습니다.
  ```java
  @Transactional(
      rollbackFor = { NullPointerException.class, NoSuchElementException.class }, // 이 예외들이 발생하면 롤백해라
      noRollbackFor = ArithmeticException.class // 0으로 나누는 수학적 에러가 발생해도 롤백하지 말고 그냥 커밋해라!
  )
  public void tx3() {
      save(Phone.builder().name("tx3").build());
      System.out.println(1 / 0); // ArithmeticException 발생! (롤백하지 않고 'tx3' 저장 커밋 처리됨)
  }
  ```

---

### 4. Spring AOP 자가 호출 문제 (Self-Invocation)
Spring에서 `@Transactional`은 **AOP(Aspect Oriented Programming) 프록시 패턴**을 사용하여 적용됩니다. 즉, 외부에서 서비스 객체를 호출할 때 Spring이 만든 가짜 껍데기(Proxy)가 트랜잭션을 시작해주고 실제 비즈니스 메서드를 호출해 주는 방식입니다.

* **자가 호출(Self-Invocation) 문제**:
  동일한 클래스 내에서 A 메서드가 B 메서드를 호출하는 경우, Spring 프록시를 통하지 않고 내부의 진짜 메서드가 직접 호출됩니다. 이 때문에 B 메서드에 붙은 `@Transactional(propagation = Propagation.REQUIRES_NEW)` 같은 트랜잭션 설정이 완전히 무시됩니다.
* **실습 예제 코드 분석**:
  - **실패 사례**: [PhoneService.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/service/PhoneService.java#L73-L78)의 `tx2Out()` -> 내부 메서드 `tx2()`를 직접 호출하므로 `tx2()`의 트랜잭션 전파 속성이 무시됨.
  - **성공 사례 (외부 호출)**: [PhoneService2.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/service/PhoneService2.java#L12-L17)의 `tx2Out()` -> 외부 빈인 `phoneService`의 `tx2()`를 호출하므로 Spring 프록시를 정상적으로 통과하여 `REQUIRES_NEW`가 동작함.

---

### 5. Paging & Sorting (정렬과 페이징 처리)
데이터베이스의 대용량 데이터를 일정한 크기 단위로 나누어 보여주는 기능입니다. Spring MVC와 Spring Data JPA는 `Pageable` 인터페이스를 제공하여 이 처리를 매우 단순화해줍니다.

* **컨트롤러에서 다루는 방법**:
  [MainController.java](file:///C:/workspace/jpa3/src/main/java/org/example/jpa3/controller/MainController.java#L31-L48)의 `/list` 엔드포인트를 참고하세요.
  ```java
  @GetMapping("/list")
  public String list(
          @PageableDefault(
                  page = 0,               // 기본 페이지 번호 (0부터 시작)
                  size = 5,               // 기본 페이지 크기 (5개씩 보기)
                  sort = "id",            // 정렬 기준 필드
                  direction = Sort.Direction.DESC // 정렬 방향 (내림차순)
          ) Pageable pageable, 
          Model model) {
      model.addAttribute("phones", phoneService.findAll(pageable).toList());
      return "index";
  }
  ```
  - 클라이언트가 브라우저 주소창에 `http://localhost:8080/list?page=0&size=5&sort=name,asc` 와 같이 파라미터를 넘겨주면, Spring이 알아서 `Pageable` 객체로 바인딩하여 쿼리에 필요한 정렬 조건과 offset/limit 조회를 수행합니다.

---

## 🏃 실행 및 테스트 방법

1. **환경 설정 파일 작성**
   - 루트 경로에 있는 [.env.dev.example](file:///C:/workspace/jpa3/.env.dev.example) 파일을 복사하여 `.env.dev` 파일을 생성합니다.
   - 본인의 로컬 PostgreSQL 데이터베이스 연결 환경에 맞게 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 등을 기입합니다.

2. **애플리케이션 실행**
   IDE를 이용하거나 아래의 Maven 래퍼 명령어로 구동할 수 있습니다.
   ```bash
   # application-dev.properties 프로파일 설정으로 실행됨
   ./mvnw spring-boot:run
   ```

3. **기능 검증**
   - `http://localhost:8080`에 접속하여 데이터 추가, 이름 수정, 정렬 조건 변경에 따른 페이징이 제대로 일어나는지 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/jpa3/controller/MainController.java](<../../jpa3/src/main/java/org/example/jpa3/controller/MainController.java>) · [src/main/java/org/example/jpa3/Jpa3Application.java](<../../jpa3/src/main/java/org/example/jpa3/Jpa3Application.java>) · [src/main/java/org/example/jpa3/repository/JPAPhoneRepository.java](<../../jpa3/src/main/java/org/example/jpa3/repository/JPAPhoneRepository.java>)

### 트랜잭션 프록시·페이징·동적 조회

Spring의 일반적인 프록시 기반 트랜잭션은 프록시를 거치는 호출에 적용된다. 같은 객체 안에서 메서드를 직접 호출하면 붙어 있는 어노테이션만으로 새 경계가 생기지 않는다. Page는 전체 개수 정보가 필요하고 Slice는 다음 구간 존재 여부에 집중하므로 조회 비용과 요구사항을 함께 본다.

**예시로 이해하기:** 정렬 값이 같은 행이 있다면 ID 같은 추가 정렬 기준을 두어 페이지 순서를 안정시킨다. Querydsl은 조건을 타입으로 조립하게 돕지만 N+1이나 느린 실행 계획을 자동 해결하지 않는다. Auditing의 최종 수정 시각은 모든 변경 이력을 저장한 기록과 다르다.

근거: 323-3 JPA 실무 심화 — [10쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=10>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=11>) · [15쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=15>) · [18쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=18>) · [25쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=25>) · [30쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=30>)

### 연관관계의 주인과 N+1의 발생 시점

양방향 관계에서는 외래키 변경을 반영하는 연관관계의 주인이 중요하다. 반대쪽 컬렉션에만 추가하면 기대한 FK 변경이 저장되지 않을 수 있다. LAZY는 필요한 시점까지 조회를 미루지만 반복문에서 연관 객체를 하나씩 읽으면 N+1 쿼리가 생길 수 있다.

**예시로 이해하기:** 회원 목록 1회 조회 후 각 회원의 팀을 읽으며 추가 SQL이 발생하는지 확인한다. fetch join이나 조회 전용 DTO로 필요한 데이터를 가져오는 방법을 비교한다. 컬렉션 fetch join과 페이징을 함께 쓰면 행 수가 늘어나므로 단순히 한 번의 쿼리로 줄이는 것만 목표로 삼지 않는다.

근거: 323-2 JPA 연관관계 매핑과 N1 문제 — [9쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=9>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=11>) · [19쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=26>) · [28쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=28>)

<!-- pdf-til-supplement:end -->
