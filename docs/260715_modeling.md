# 데이터베이스 설계 및 모델링 - 카레 가게 ERD 설계 홈워크 📐

실제 동작하는 비즈니스 도메인(예: 카레 전문 프랜차이즈 가게)의 실무 요구사항을 분석하여 올바른 관계형 테이블 구조를 설계하고 ERD(Entity Relationship Diagram)를 도출해내는 모델링 실습입니다.

---

## 📂 학습 파일 구성 (Files)

- [curry_shop_erd.uml](file:///C:/workspace/260715_modeling/curry_shop_erd.uml) : 테이블 간의 관계(1:N, N:M)와 필드를 도식화한 UML 기반 ERD 모델링 파일
- [schema/00.sql](file:///C:/workspace/260715_modeling/schema/00.sql) ~ [schema/06.sql](file:///C:/workspace/260715_modeling/schema/06.sql) : 설계한 ERD 구조대로 데이터베이스에 테이블을 구성하는 순차적 DDL 파일 모음
- [erd_diagram.md](file:///C:/workspace/260715_modeling/erd_diagram.md) : 요구 분석 명세와 테이블 컬럼들의 논리적 의미 설명서

---

## 🛠 배운 핵심 개념 (What We Learned)

- **데이터베이스 모델링**: 요구사항(예: 주문 시 여러 메뉴와 토핑이 추가된다)을 데이터 관점으로 추출하여 개체(Entity)와 속성(Attribute)을 나누는 법을 배웁니다.
- **정규화 (Normalization)**: 중복 데이터를 제거하고 테이블을 쪼개어 데이터 무결성을 보장하는 규칙을 학습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `schema/00.sql`부터 `06.sql`까지 순서대로 DBeaver 콘솔에 실행하여 카레 가게의 테이블들을 생성해 봅니다.
