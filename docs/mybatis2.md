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
