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
