# MyBatis SQL 매퍼 심화 - 동적 SQL & 복합 관계 매핑 V2 🍃💾

매번 쿼리를 다르게 작성할 필요 없이 조건식에 따라 쿼리가 실시간으로 달라지는 '동적 SQL(<if>, <choose>, <foreach>)' 기법과, 1:N 이나 N:M 테이블 구조를 객체 필드로 조인해 가져오는 ResultMap 맵핑 기술을 다룹니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/mybatis2/pom.xml) : 빌드 및 종속성 관리 설정 파일
- [src/main/resources/](file:///C:/workspace/mybatis2/src/main/resources/) : 동적 분기 태그가 들어간 XML SQL 매퍼들
- [src/main/java/](file:///C:/workspace/mybatis2/src/main/java/) : 쿼리 파라미터 매핑을 전달하고 다중 리스트를 회수하는 고도화된 자바 코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **동적 SQL**: 조건부 조회 필터링, 검색 키워드가 비어있을 때 전체 조회 처리 등 실제 비즈니스에 핵심적인 조건부 쿼리 제작 능력을 키웁니다.
- **ResultMap 설계**: 테이블 조인 결과를 자바 객체 내의 List 컬렉션 필드로 바로 채워넣어 조립(Mapping)해 주는 기법을 익힙니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 개발 환경에 대응하는 데이터베이스에 연결하고 스프링 부트 서버를 가동합니다.
2. 동적 다중 조건 검색 컨트롤러 주소를 테스트하여 알맞은 조건의 검색 행들만 골라 반환되는지 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/mybatis2/controller/MainController.java](<../../mybatis2/src/main/java/org/example/mybatis2/controller/MainController.java>) · [src/main/java/org/example/mybatis2/controller/OrderController.java](<../../mybatis2/src/main/java/org/example/mybatis2/controller/OrderController.java>) · [src/main/java/org/example/mybatis2/controller/UserAccountController.java](<../../mybatis2/src/main/java/org/example/mybatis2/controller/UserAccountController.java>)

### 동적 SQL은 최종 SQL까지 확인하기

동적 SQL은 입력에 따라 조건 조각을 조립한다. where는 조건이 있을 때 WHERE를 붙이고 앞쪽 연결자를 정리하며 set은 부분 수정의 쉼표 처리를 돕는다. 태그가 문법을 조립해 주어도 “조건이 하나도 없을 때 전체 조회·수정해도 되는가”라는 업무 판단까지 대신하지는 않는다.

**예시로 이해하기:** 검색어 없음, 검색어만 있음, 여러 조건 조합을 나누어 최종 SQL과 바인딩 값을 예상한다. IN 절의 컬렉션이 비었을 때 전체 조회로 바뀌지 않도록 의도를 정한다. 1:N 결과를 collection에 매핑할 때는 부모 식별자를 지정해 중복 행을 같은 부모로 묶는다.

근거: 322-2 MyBatis 동적 SQL과 연관관계 매핑 — [8쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=8>) · [10쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=10>) · [12쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=12>) · [16쪽](<../../260629_ex/새 폴더/7-21/322-2_MyBatis_동적_SQL과_연관관계_매핑.pdf#page=16>)

<!-- pdf-til-supplement:end -->
