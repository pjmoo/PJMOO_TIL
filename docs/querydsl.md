# 🍓 Querydsl 실습 프로젝트 (Spring Boot + Spring Data JPA + Querydsl)

이 프로젝트는 Spring Boot 환경에서 **Spring Data JPA**와 **Querydsl**을 연동하여, 보다 안전하고 유연하게 데이터베이스를 조회하는 방법을 배우기 위한 실습 프로젝트입니다. 

초보자분들도 쉽게 이해할 수 있도록 프로젝트 구조와 핵심 개념, 구현된 코드의 흐름을 정리해 두었습니다.

---

## 💡 Querydsl이란 무엇이고, 왜 사용할까요?

보통 JPA를 사용할 때 `@Query` 어노테이션 안에 SQL과 유사한 **JPQL(Java Persistence Query Language)**을 직접 문자열로 작성하여 조회 쿼리를 만듭니다. 
하지만 JPQL은 단순 문자열이기 때문에 아래와 같은 치명적인 단점이 있습니다.
* **오타 체크 불가**: 쿼리 문자열에 오타가 있어도 컴파일 시점(빌드할 때)에는 에러가 발생하지 않고, 실제 서버가 실행되어 해당 기능이 작동할 때(런타임) 에러가 발생합니다.
* **동적 쿼리 작성의 어려움**: 조건에 따라 쿼리가 바뀌어야 하는 경우(예: 제목만 검색할 때, 내용도 같이 검색할 때 등) 문자열을 더하고 합치는 과정이 매우 복잡하고 지저분해집니다.

**Querydsl**은 이러한 문제를 해결하기 위해 등장했습니다!
* **컴파일 시점 에러 탐지**: SQL을 자바 코드로 작성할 수 있게 도와주어, 오타가 나거나 타입이 맞지 않으면 빌드 시점에 바로 컴파일 에러를 띄워줍니다.
* **동적 쿼리 작성 용이**: 자바의 메서드와 조건식을 활용해 복잡한 검색 조건도 깔끔하게 구현할 수 있습니다.
* **자동 완성 지원**: IDE(IntelliJ 등)의 코드 자동 완성 기능을 사용할 수 있어 개발 생산성이 향상됩니다.

---

## ⚙️ 프로젝트 환경 설정

### 1. `pom.xml` (의존성 및 Q-Class 생성 설정)
Querydsl을 사용하려면 자바 엔티티 클래스(예: `Board.java`)를 분석하여 쿼리 작성용 도구인 **Q-Class(QBoard.java)**를 빌드할 때 자동으로 생성해주어야 합니다.
이를 위해 `pom.xml`에 Querydsl 의존성과 `apt-maven-plugin` 설정이 포함되어 있습니다.

### 2. `JpaConfig.java` (설정 클래스)
Querydsl의 핵심 도구인 `JPAQueryFactory`와, 생성 시간/수정 시간을 자동으로 관리해주는 JPA Auditing 기능을 설정하는 클래스입니다.
* **[`JpaConfig.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/config/JpaConfig.java)**
```java
@Configuration
@EnableJpaAuditing // JPA Auditing(생성/수정일자 자동 기록) 기능 활성화
public class JpaConfig {

    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager entityManager) {
        // Querydsl 쿼리를 생성하고 실행하기 위해 JPAQueryFactory를 빈으로 등록합니다.
        return new JPAQueryFactory(entityManager);
    }
}
```

---

## 📂 핵심 코드 설명

### 1. 데이터 모델 (Entity)
* **[`BaseEntity.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/entity/BaseEntity.java)**: 모든 테이블에 공통으로 들어가는 `createdAt`(등록시간)과 `updatedAt`(수정시간)을 정의한 추상 클래스입니다. `@EntityListeners(AuditingEntityListener.class)` 설정을 통해 데이터 저장/변경 시 자동으로 시간이 입력됩니다.
* **[`Board.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/entity/Board.java)**: 게시판 데이터를 정의한 엔티티 클래스입니다. `BaseEntity`를 상속받아 시간 속성을 자동으로 상속받습니다.

### 2. 데이터 저장소 (Repository)
이 프로젝트는 단순 CRUD용 JPA Repository와 복잡한 조회용 Querydsl Repository를 나누어 사용하는 구조를 연습합니다.
* **[`JPABoardRepository.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/repository/JPABoardRepository.java)**: Spring Data JPA의 `JpaRepository` 인터페이스를 상속받아 기본 CRUD(save, delete, findById 등) 기능을 제공받습니다.
* **[`QBoardRepository.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/repository/QBoardRepository.java)**: **Querydsl 전용 저장소**입니다. 빌드 시 생성된 `QBoard` 객체와 `JPAQueryFactory`를 사용하여 직접 데이터베이스를 조회하는 자바 코드를 작성합니다.
```java
@Repository
@RequiredArgsConstructor
public class QBoardRepository {
    private final JPAQueryFactory jpaQueryFactory;

    public List<Board> findAll() {
        QBoard board = QBoard.board; // 빌드 시 자동 생성되는 Q-Class 객체 사용
        return jpaQueryFactory
                .selectFrom(board) // select * from board
                .orderBy(board.id.desc()) // order by id desc (최신 글이 먼저 나오도록 정렬)
                .where(board.title.contains("딸기")) // where title like '%딸기%' (제목에 "딸기"가 포함된 게시글만 필터링)
                .fetch(); // 쿼리 실행 및 결과를 리스트로 조회
    }
}
```

### 3. 비즈니스 로직 (Service)
* **[`BoardService.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/service/BoardService.java)**: 컨트롤러로부터 요청을 받아 비즈니스 로직을 수행합니다. 
  * 게시글 등록 시에는 `JPABoardRepository`를 이용해 데이터를 안전하게 `save`합니다.
  * 게시글 목록 조회 시에는 `QBoardRepository`를 이용하여 필터링 및 정렬이 적용된 결과를 가져옵니다.

### 4. 컨트롤러 및 뷰 (Web MVC)
* **[`BoardController.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/controller/BoardController.java)**: 
  * `GET /`: `BoardService.findAll()`을 호출하여 제목에 "딸기"가 들어간 최신 게시글 목록을 불러와 `index.jsp` 템플릿에 전달합니다.
  * `POST /`: 사용자가 웹 화면에서 입력한 제목과 내용을 DTO([`BoardFormDTO.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/dto/BoardFormDTO.java))로 전달받은 후, 엔티티로 변환하여 새로운 게시글을 등록합니다.
* **[`index.jsp`](file:///C:/workspace/querydsl/src/main/webapp/WEB-INF/views/index.jsp)**: 게시글 등록 폼과 게시글 목록을 화면에 렌더링하는 JSP 파일입니다.

---

## 🏃‍♂️ 실행 및 동작 확인 방법

1. **프로젝트 빌드 (Q-Class 생성)**
   Querydsl 코드가 정상 작동하기 위해서는 최초 1회 또는 엔티티 변경 시 Maven 컴파일을 수행하여 Q-Class를 생성해야 합니다.
   ```bash
   ./mvnw compile
   ```
   * 빌드가 완료되면 `target/generated-sources/annotations` 경로 하위에 `QBoard.java` 파일이 자동으로 생성됩니다.

2. **애플리케이션 실행**
   * 메인 클래스인 [`QuerydslApplication.java`](file:///C:/workspace/querydsl/src/main/java/org/example/querydsl/QuerydslApplication.java)를 실행합니다.
   * 브라우저에서 `http://localhost:8080`에 접속합니다.

3. **기능 테스트**
   * 화면의 입력창에 **제목**과 **내용**을 입력한 뒤 **[생성]** 버튼을 누릅니다.
   * **필터링 테스트**: 제목에 `"딸기"`라는 단어가 포함된 게시글만 화면 하단의 목록에 최신순(ID 역순)으로 노출되는지 확인합니다. (예: `"딸기 케이크"`는 목록에 표시되지만, `"사과 주스"`는 화면 목록에 노출되지 않음)

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/querydsl/controller/BoardController.java](<../../querydsl/src/main/java/org/example/querydsl/controller/BoardController.java>) · [src/main/java/org/example/querydsl/QuerydslApplication.java](<../../querydsl/src/main/java/org/example/querydsl/QuerydslApplication.java>) · [src/main/java/org/example/querydsl/repository/JPABoardRepository.java](<../../querydsl/src/main/java/org/example/querydsl/repository/JPABoardRepository.java>)

### 트랜잭션 프록시·페이징·동적 조회

Spring의 일반적인 프록시 기반 트랜잭션은 프록시를 거치는 호출에 적용된다. 같은 객체 안에서 메서드를 직접 호출하면 붙어 있는 어노테이션만으로 새 경계가 생기지 않는다. Page는 전체 개수 정보가 필요하고 Slice는 다음 구간 존재 여부에 집중하므로 조회 비용과 요구사항을 함께 본다.

**예시로 이해하기:** 정렬 값이 같은 행이 있다면 ID 같은 추가 정렬 기준을 두어 페이지 순서를 안정시킨다. Querydsl은 조건을 타입으로 조립하게 돕지만 N+1이나 느린 실행 계획을 자동 해결하지 않는다. Auditing의 최종 수정 시각은 모든 변경 이력을 저장한 기록과 다르다.

근거: 323-3 JPA 실무 심화 — [10쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=10>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=11>) · [15쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=15>) · [18쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=18>) · [25쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=25>) · [30쪽](<../../260629_ex/새 폴더/7-23/323-3_JPA_실무_심화.pdf#page=30>)

### 연관관계의 주인과 N+1의 발생 시점

양방향 관계에서는 외래키 변경을 반영하는 연관관계의 주인이 중요하다. 반대쪽 컬렉션에만 추가하면 기대한 FK 변경이 저장되지 않을 수 있다. LAZY는 필요한 시점까지 조회를 미루지만 반복문에서 연관 객체를 하나씩 읽으면 N+1 쿼리가 생길 수 있다.

**예시로 이해하기:** 회원 목록 1회 조회 후 각 회원의 팀을 읽으며 추가 SQL이 발생하는지 확인한다. fetch join이나 조회 전용 DTO로 필요한 데이터를 가져오는 방법을 비교한다. 컬렉션 fetch join과 페이징을 함께 쓰면 행 수가 늘어나므로 단순히 한 번의 쿼리로 줄이는 것만 목표로 삼지 않는다.

근거: 323-2 JPA 연관관계 매핑과 N1 문제 — [9쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=9>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=11>) · [19쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=26>) · [28쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=28>)

<!-- pdf-til-supplement:end -->
