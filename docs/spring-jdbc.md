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
