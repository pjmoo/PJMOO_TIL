# 스프링 부트(Spring Boot) 입문 - Spring JDBC 연동 🍃🔌

자바 백엔드의 절대 표준인 스프링 부트(Spring Boot) 개발 환경에 입문합니다. 과거의 무겁고 자원 해제가 번거로웠던 일반 JDBC를 개선하여 내부에서 알아서 커넥션을 관리해 주는 `JdbcTemplate` 기술을 사용해 데이터베이스와 상호작용하는 웹 애플리케이션 기초입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/260720_spring-jdbc/pom.xml) : Spring Boot Starter JDBC 종속성이 추가된 메인 설정 명세
- [src/main/java/](file:///C:/workspace/260720_spring-jdbc/src/main/java/) : 스프링 부트 애플리케이션 진입점 및 스프링 빈(Bean)으로 데이터베이스 쿼리를 처리하는 컨트롤러/레포지토리 자바 클래스들
- [src/main/resources/application.properties](file:///C:/workspace/260720_spring-jdbc/src/main/resources/application.properties) : 스프링이 알아서 데이터베이스 커넥션을 맺도록 설정 정보를 적어두는 설정 파일

---

## 🛠 배운 핵심 개념 (What We Learned)

- **의존성 주입 (Dependency Injection)**: 개발자가 직접 `new` 키워드로 커넥션 객체를 조립하지 않고, 스프링 컨테이너가 라이프사이클을 대신 주입해 주는 기본 원리를 깨닫습니다.
- **JdbcTemplate**: 반복되는 `try-catch-finally` 및 자원 해제(`close`) 생략이 가능하도록 스프링이 제공하는 편리한 DB 헬퍼 API 사용법을 습득합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `application.properties` 파일에 내 MySQL의 접속 정보(`spring.datasource.url` 등)를 올바르게 채웁니다.
2. 터미널에서 `./mvnw spring-boot:run`을 실행하거나 IDE에서 메인 Application 클래스의 실행 버튼을 눌러 스프링 부트 서버를 가동합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/springjdbc/controller/AccountController.java](<../../260720_spring-jdbc/src/main/java/org/example/springjdbc/controller/AccountController.java>) · [src/main/java/org/example/springjdbc/controller/MainController.java](<../../260720_spring-jdbc/src/main/java/org/example/springjdbc/controller/MainController.java>) · [src/main/java/org/example/springjdbc/SpringJdbcApplication.java](<../../260720_spring-jdbc/src/main/java/org/example/springjdbc/SpringJdbcApplication.java>)

### JdbcTemplate과 업무 트랜잭션의 경계

JdbcTemplate은 반복되는 JDBC 자원 관리와 예외 변환을 줄이고 RowMapper는 한 결과 행을 객체로 바꾼다. SQL과 매핑 규칙은 개발자가 작성한다. 여러 저장소 호출이 함께 성공해야 하는 업무에서는 서비스가 트랜잭션의 시작과 끝을 표현하는 위치가 된다.

**예시로 이해하기:** 이체 서비스가 출금·입금을 각각 호출할 때 둘 사이에 실패하면 함께 되돌아가야 한다. Repository 메서드 각각의 성공만 확인하면 업무 전체의 일관성을 놓칠 수 있다. 외부 HTTP 호출이나 파일 저장은 DB 트랜잭션으로 자동 복구되지 않는다.

근거: 321-2 Spring JDBC와 영속성 — [21쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=22>) · [29쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=29>) · [35쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=35>) · [37쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=37>)

<!-- pdf-til-supplement:end -->
