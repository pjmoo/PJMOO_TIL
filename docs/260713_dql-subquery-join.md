# 데이터베이스 SQL 기초 - 데이터 조회(DQL), 서브쿼리 & 조인(JOIN) 정복 📊

관계형 데이터베이스(RDB)에 저장된 수많은 표(Table)에서 필요한 데이터만 정확하게 쏙쏙 뽑아내는 SQL 조회 쿼리의 핵심을 공부하는 연습장입니다.

---

## 📂 학습 파일 구성 (Files)

- [dql01.sql](file:///C:/workspace/260713_dql-subquery-join/dql01.sql) ~ [dql02.sql](file:///C:/workspace/260713_dql-subquery-join/dql02.sql) : 필터링(`WHERE`), 정렬(`ORDER BY`), 그룹화(`GROUP BY`) 기초 조회 쿼리
- [subquery01.sql](file:///C:/workspace/260713_dql-subquery-join/subquery01.sql) ~ [subquery02.sql](file:///C:/workspace/260713_dql-subquery-join/subquery02.sql) : 쿼리문 안에 또 다른 쿼리를 중첩하여 사용해 복잡한 조건식을 푸는 서브쿼리 실습
- [join01.sql](file:///C:/workspace/260713_dql-subquery-join/join01.sql) ~ [join02.sql](file:///C:/workspace/260713_dql-subquery-join/join02.sql) : 흩어져 있는 테이블을 연결 고리(외래키)를 기준으로 하나로 병합하는 JOIN 연산 실습
- 다수의 설명 문서들(.md) : 각각의 실습 SQL 쿼리의 작동 이론 해설

---

## 🛠 배운 핵심 개념 (What We Learned)

- **조인 (JOIN)**: 관계형 데이터베이스의 꽃인 테이블 결합(`INNER JOIN`, `LEFT OUTER JOIN`) 방식을 학습합니다.
- **서브쿼리 (Subquery)**: 조건식 안에 임시 조회를 집어넣어, 특정 평균값보다 비싼 상품 목록 등을 정밀 필터링하는 법을 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. MySQL 또는 Oracle 등 사용 중인 RDBMS 콘솔 또는 GUI 툴(DBeaver 등)을 실행합니다.
2. 연결된 데이터베이스 세션에서 각 `.sql` 파일의 질의문을 한 줄씩 블록 씌워 실행한 뒤 출력 그리드를 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [131115.sql](<../../260713_dql-subquery-join/131115.sql>) · [131530.sql](<../../260713_dql-subquery-join/131530.sql>) · [59041.sql](<../../260713_dql-subquery-join/59041.sql>)

### SELECT를 쓰는 순서와 해석하는 순서

SQL은 원하는 결과를 선언하는 언어다. 이해를 위한 논리적 순서는 FROM·JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT로 볼 수 있다. 이는 DB가 실제로 수행하는 물리적 실행 계획과는 다르다. WHERE는 개별 행을, HAVING은 집계한 그룹을 거른다.

**예시로 이해하기:** 부서별 인원이 3명 이상인 부서를 찾는다면 부서로 그룹을 만든 뒤 HAVING COUNT(*) >= 3을 적용한다. NULL은 값이 없음을 나타내므로 = NULL 대신 IS NULL을 사용하고, COUNT(컬럼)은 NULL을 제외하지만 COUNT(*)는 행을 센다는 차이를 확인한다.

근거: 311-1 DQL — [15쪽](<../../260629_ex/새 폴더/7-10/311-1_DQL.pdf#page=15>) · [21쪽](<../../260629_ex/새 폴더/7-10/311-1_DQL.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/7-10/311-1_DQL.pdf#page=22>) · [23쪽](<../../260629_ex/새 폴더/7-10/311-1_DQL.pdf#page=23>)

### JOIN으로 늘어나는 행과 EXISTS의 의미

JOIN은 연결 조건에 맞는 행 조합을 만든다. 한 회원에게 주문이 여러 개면 회원 정보도 여러 행에 반복될 수 있다. 존재 여부만 필요할 때는 EXISTS로 의도를 표현할 수 있다. LEFT JOIN은 대응 행이 없는 왼쪽 행도 남기지만 뒤 WHERE 조건이 그 행을 다시 제거할 수 있다.

**예시로 이해하기:** 주문이 없는 회원도 표시하려면 오른쪽 테이블의 필터를 ON과 WHERE 중 어디에 둘지 구분한다. 결과 행 수가 예상보다 많다면 DISTINCT부터 붙이기보다 1:N 관계와 조인 조건을 먼저 확인한다.

근거: 311-2 SubqueryJoin — [14쪽](<../../260629_ex/새 폴더/7-10/311-2_SubqueryJoin.pdf#page=14>) · [20쪽](<../../260629_ex/새 폴더/7-10/311-2_SubqueryJoin.pdf#page=20>) · [21쪽](<../../260629_ex/새 폴더/7-10/311-2_SubqueryJoin.pdf#page=21>) · [30쪽](<../../260629_ex/새 폴더/7-10/311-2_SubqueryJoin.pdf#page=30>)

<!-- pdf-til-supplement:end -->
