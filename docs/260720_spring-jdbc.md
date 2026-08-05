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
