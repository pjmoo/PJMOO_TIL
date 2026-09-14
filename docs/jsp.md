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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/com/example/jsp/step1/SecureServlet.java](<../../jsp/src/main/java/com/example/jsp/step1/SecureServlet.java>) · [src/main/java/com/example/jsp/step2/IncludeServlet.java](<../../jsp/src/main/java/com/example/jsp/step2/IncludeServlet.java>) · [src/main/java/com/example/jsp/step3/ElServlet.java](<../../jsp/src/main/java/com/example/jsp/step3/ElServlet.java>)

### JSP는 전달받은 모델을 화면으로 바꾸는 계층

컨트롤러가 요청 검증과 서비스 호출을 맡고 JSP는 전달받은 모델을 표현하면 화면 수정과 업무 규칙 수정의 영향을 나눌 수 있다. EL은 모델 값을 읽고 JSTL은 조건·반복을 표현한다. 템플릿에서 직접 DB를 조회하면 이 경계가 무너진다.

**예시로 이해하기:** 도서 목록을 컨트롤러에서 request 속성으로 전달하고 JSP에서 반복 출력하는 흐름을 따라간다. WEB-INF 아래의 JSP로 forward하는 구성은 외부에서 화면 파일에 직접 접근하는 경로를 줄인다. 사용자 입력 출력에는 HTML 이스케이프가 적용되는 태그·방식을 사용한다.

근거: 231-3 JSP — [6쪽](<../../260629_ex/새 폴더/6-30/231-3_JSP.pdf#page=6>) · [7쪽](<../../260629_ex/새 폴더/6-30/231-3_JSP.pdf#page=7>) · [14쪽](<../../260629_ex/새 폴더/6-30/231-3_JSP.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/6-30/231-3_JSP.pdf#page=18>)

<!-- pdf-til-supplement:end -->
