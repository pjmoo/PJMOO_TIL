# MyBatis 트랜잭션 제어 & 고급 커스텀 데이터베이스 설정 V3 🍃💾

다수의 SQL 연산을 하나의 원자성 단위로 묶는 데이터베이스 트랜잭션 처리 기법과, 마이바티스의 커스텀 설정(CamlCase 언더바 컬럼 자동 변환 등)을 가미하는 마이바티스 최종 심화 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/mybatis3/pom.xml) : 롬복 및 스프링 데이터 관련 최종 종속성
- [src/main/java/](file:///C:/workspace/mybatis3/src/main/java/) : `@Transactional` 어노테이션을 사용하여 비즈니스 비정상 예외 발생 시 DB 롤백 처리를 주도하는 서비스 및 레포지토리 레이어 자바 코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **트랜잭션 ACID**: 하나라도 실패하면 전부 없던 일로 취급하는 금융 결제 등의 안전한 데이터베이스 가공 개념과 스프링 부트 연계 기술을 다룹니다.
- **MyBatis Configuration**: 언더바 형식의 컬럼명(`user_id`)을 자바의 카멜케이스 변수명(`userId`)으로 자동 매치시키는 매핑 커스텀 설정을 이해합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 데이터베이스 스키마 생성 및 연동 정보를 맞춥니다.
2. 고의로 예외가 발생하는 모의 테스트 코드를 돌려, DB에 트랜잭션 롤백이 성공해 더러운 데이터가 남지 않는지 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/mybatis3/controller/MainController.java](<../../mybatis3/src/main/java/org/example/mybatis3/controller/MainController.java>) · [src/main/java/org/example/mybatis3/Mybatis3Application.java](<../../mybatis3/src/main/java/org/example/mybatis3/Mybatis3Application.java>) · [src/main/java/org/example/mybatis3/mapper/EnrollMapper.java](<../../mybatis3/src/main/java/org/example/mybatis3/mapper/EnrollMapper.java>)

### 동적 SQL은 최종 SQL까지 확인하기

동적 SQL은 입력에 따라 조건 조각을 조립한다. where는 조건이 있을 때 WHERE를 붙이고 앞쪽 연결자를 정리하며 set은 부분 수정의 쉼표 처리를 돕는다. 태그가 문법을 조립해 주어도 “조건이 하나도 없을 때 전체 조회·수정해도 되는가”라는 업무 판단까지 대신하지는 않는다.

**예시로 이해하기:** 검색어 없음, 검색어만 있음, 여러 조건 조합을 나누어 최종 SQL과 바인딩 값을 예상한다. IN 절의 컬렉션이 비었을 때 전체 조회로 바뀌지 않도록 의도를 정한다. 1:N 결과를 collection에 매핑할 때는 부모 식별자를 지정해 중복 행을 같은 부모로 묶는다.

근거: 322-2 MyBatis 동적 SQL과 연관관계 매핑 — [8쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=8>) · [10쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=10>) · [12쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=12>) · [16쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=16>)

### JdbcTemplate과 업무 트랜잭션의 경계

JdbcTemplate은 반복되는 JDBC 자원 관리와 예외 변환을 줄이고 RowMapper는 한 결과 행을 객체로 바꾼다. SQL과 매핑 규칙은 개발자가 작성한다. 여러 저장소 호출이 함께 성공해야 하는 업무에서는 서비스가 트랜잭션의 시작과 끝을 표현하는 위치가 된다.

**예시로 이해하기:** 이체 서비스가 출금·입금을 각각 호출할 때 둘 사이에 실패하면 함께 되돌아가야 한다. Repository 메서드 각각의 성공만 확인하면 업무 전체의 일관성을 놓칠 수 있다. 외부 HTTP 호출이나 파일 저장은 DB 트랜잭션으로 자동 복구되지 않는다.

근거: 321-2 Spring JDBC와 영속성 — [21쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=22>) · [29쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=29>) · [35쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=35>) · [37쪽](<../../260629_ex/새 폴더/7-20/321-2_Spring_JDBC와_영속성.pdf#page=37>)

<!-- pdf-til-supplement:end -->
