# 스프링 부트 MyBatis SQL 매퍼(Mapper) 입문 V1 🍃💾

자바 코드 내에 SQL 문을 하드코딩하지 않고, 별도의 XML 파일에 SQL을 깨끗하게 격리 관리하여 복잡한 DB 쿼리를 쉽게 실행하는 SQL 매퍼 프레임워크 'MyBatis'의 기초 입문 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/mybatis/pom.xml) : MyBatis Spring Boot Starter 및 데이터베이스 커넥터 설정 명세
- [src/main/resources/](file:///C:/workspace/mybatis/src/main/resources/) : SQL 쿼리가 작성된 XML 매퍼 파일 및 스프링 속성 설정
- [src/main/java/](file:///C:/workspace/mybatis/src/main/java/) : MyBatis 인터페이스와 데이터 교환용 DTO(Data Transfer Object) 자바 클래스들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **SQL 매퍼 (SQL Mapper)**: 소스코드와 쿼리문을 완전 분리해 데이터베이스 수정이나 성능 튜닝 시 자바 코드를 건드릴 필요가 없는 구조를 배웁니다.
- **인터페이스 바인딩**: 마이바티스가 자바 인터페이스와 XML 태그의 ID를 연결해 자동으로 실행 쿼리 인스턴스를 주입해 주는 원리를 학습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `application.properties`에 데이터베이스 접속 키를 등록합니다.
2. 서버를 구동하여 마이바티스 레포지토리가 정상적으로 SQL 데이터의 INSERT 및 SELECT 조회를 수행하는지 검증합니다.
