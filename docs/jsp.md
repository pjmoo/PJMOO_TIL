# 자바 서버 페이지(JSP) 고급 기법 - 표현언어(EL) & JSTL 태그 라이브러리 🍃🎨

HTML 코드 사이에 지저분한 자바 스크립틀릿 문법(`<% ... %>`)을 걷어내고, 전용 태그와 중괄호 표현식만으로 뷰 영역 데이터를 깔끔하게 출력하는 고급 JSP 기술을 공부합니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/jsp/pom.xml) : JSTL 라이브러리 종속성이 적힌 Maven 설정 파일
- [01_secure.md](file:///C:/workspace/jsp/01_secure.md) ~ [04_jstl.md](file:///C:/workspace/jsp/04_jstl.md) : XSS 공격 방어 등 보안 실무, 중복 레이아웃을 합치는 `<jsp:include>`, 데이터를 출력하는 EL(`\\${data}`), 조건/반복 처리를 태그로 수행하는 JSTL 문법 이론 요약본
- [src/main/webapp/](file:///C:/workspace/jsp/src/main/webapp/) : 실제 EL과 JSTL 태그가 적용된 JSP 템플릿 화면 파일들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **표현 언어 (Expression Language)**: 자바의 복잡한 Getter 호출 없이 `\\${member.name}` 형태로 브라우저 화면에 출력하는 방식을 마스터합니다.
- **JSTL**: 자바의 `if`, `for` 문 대신 `<c:if>`, `<c:forEach>` 태그를 이용해 퍼블리셔와 개발자가 협업하기 편한 화면 코드를 만듭니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. WAS(톰캣) 서버를 구동하고 프로젝트 웹 에셋 경로를 확인합니다.
2. 브라우저로 JSP 페이지들을 열어 자바 백엔드 데이터가 정상 치환되어 완전한 웹페이지로 그려지는지 테스트합니다.
