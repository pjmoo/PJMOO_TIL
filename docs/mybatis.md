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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/mybatis/controller/BoardController.java](<../../mybatis/src/main/java/org/example/mybatis/controller/BoardController.java>) · [src/main/java/org/example/mybatis/controller/MainController.java](<../../mybatis/src/main/java/org/example/mybatis/controller/MainController.java>) · [src/main/java/org/example/mybatis/controller/MemberController.java](<../../mybatis/src/main/java/org/example/mybatis/controller/MemberController.java>)

### Mapper 호출이 SQL 실행으로 연결되는 기준

MyBatis는 개발자가 작성한 SQL과 Java 메서드·객체를 연결한다. XML namespace는 Mapper 인터페이스, SQL id는 메서드에 대응한다. 조회 결과를 객체로 바꿀 때 컬럼명과 필드명이 다르면 별칭이나 resultMap으로 관계를 명확히 해야 한다.

**예시로 이해하기:** 메서드는 있는데 실행문을 못 찾는 오류라면 SQL 자체보다 XML 검색 경로와 namespace·id부터 확인한다. INSERT의 생성 키 반영은 반환 행 수와 다른 결과이므로 어떤 객체 필드에 키가 채워지는지 읽는다. 값에는 바인딩 문법을 사용하고 문자열 치환과 구분한다.

근거: 322-1 MyBatis와 SQL Mapper — [22쪽](<../../260629_ex/새 폴더/7-21/322-1_MyBatis와_SQL_Mapper.pdf#page=22>) · [24쪽](<../../260629_ex/새 폴더/7-21/322-1_MyBatis와_SQL_Mapper.pdf#page=24>) · [29쪽](<../../260629_ex/새 폴더/7-21/322-1_MyBatis와_SQL_Mapper.pdf#page=29>) · [33쪽](<../../260629_ex/새 폴더/7-21/322-1_MyBatis와_SQL_Mapper.pdf#page=33>)

<!-- pdf-til-supplement:end -->
