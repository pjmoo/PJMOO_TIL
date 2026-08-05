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
