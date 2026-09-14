# 스프링 데이터 접근 - Spring JDBC & 드라이버 연동 🍃💾

스프링 부트 환경에서 DB 드라이버 설정을 외부 속성 파일로 격리시키고, JdbcTemplate을 이용해 관계형 DB 테이블의 영속 처리를 유기적으로 구동해 보는 기본 실습 아키텍처입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/spring-jdbc/pom.xml) : Spring Boot Starter JDBC 명세
- [sql/mysql_ddl.sql](file:///C:/workspace/spring-jdbc/sql/mysql_ddl.sql) : MySQL 테스트용 테이블 생성 쿼리
- [src/main/java/](file:///C:/workspace/spring-jdbc/src/main/java/) : JdbcTemplate 레포지토리를 사용해 데이터 조회 및 저장을 담당하는 자바 코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **데이터소스 (DataSource)**: 커넥션 풀을 관리하여 성능 저하를 방지하고 스프링이 안전하게 DB 세션을 회수하도록 하는 기본 설정을 학습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `src/main/resources/application.properties`에 데이터베이스 세션을 올바르게 선언합니다.
2. 프로젝트를 구동하여 테이블 데이터의 입력/조회가 정상 작동하는지 로그로 추적합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/springjdbc/controller/AccountController.java](<../../spring-jdbc/src/main/java/org/example/springjdbc/controller/AccountController.java>) · [src/main/java/org/example/springjdbc/controller/MainController.java](<../../spring-jdbc/src/main/java/org/example/springjdbc/controller/MainController.java>) · [src/main/java/org/example/springjdbc/SpringJdbcApplication.java](<../../spring-jdbc/src/main/java/org/example/springjdbc/SpringJdbcApplication.java>)

### JdbcTemplate과 업무 트랜잭션의 경계

JdbcTemplate은 반복되는 JDBC 자원 관리와 예외 변환을 줄이고 RowMapper는 한 결과 행을 객체로 바꾼다. SQL과 매핑 규칙은 개발자가 작성한다. 여러 저장소 호출이 함께 성공해야 하는 업무에서는 서비스가 트랜잭션의 시작과 끝을 표현하는 위치가 된다.

**예시로 이해하기:** 이체 서비스가 출금·입금을 각각 호출할 때 둘 사이에 실패하면 함께 되돌아가야 한다. Repository 메서드 각각의 성공만 확인하면 업무 전체의 일관성을 놓칠 수 있다. 외부 HTTP 호출이나 파일 저장은 DB 트랜잭션으로 자동 복구되지 않는다.

근거: 321-2 Spring JDBC와 영속성 — [21쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=22>) · [29쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=29>) · [35쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=35>) · [37쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=37>)

<!-- pdf-til-supplement:end -->
