# 자바 백엔드의 근본 - 서블릿(Servlet) 라이프사이클 & 스코프 ☕🔌

스프링 프레임워크 뒤에서 브라우저의 HTTP 요청을 자바 클래스로 직접 응답해 주는 핵심 기초 백엔드 스펙인 '서블릿(Servlet)'의 작동 원리, 생성 소멸 주기 및 4대 영역(Scope)을 학습합니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/servlet/pom.xml) : 서블릿 API 및 톰캣 관련 라이브러리 지정
- [FirstServlet.md](file:///C:/workspace/servlet/FirstServlet.md) ~ [ScopeServlet2.md](file:///C:/workspace/servlet/ScopeServlet2.md) : 서블릿 구조, `init-service-destroy` 라이프사이클 분석, 데이터 보관용 영역(Page, Request, Session, Application Scope)에 대한 이론 정리
- [src/main/java/](file:///C:/workspace/servlet/src/main/java/) : `doGet`/`doPost` 메소드를 재정의해 동적으로 HTML 문자열을 인코딩해 던지는 자바 서블릿 실습 파일들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **서블릿 라이프사이클**: 첫 요청 시 객체가 메모리에 뜨는 과정(`init`)과 스레드로 일하는 과정(`service`)을 이해합니다.
- **데이터 스코프**: 요청 한 번 동안만 유지되는 `RequestScope`와, 브라우저가 꺼지기 전까지 살아있는 `SessionScope`의 차이와 자바 객체 바인딩을 공부합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 톰캣 서버 설정을 맞추고 프로젝트를 빌드/배포합니다.
2. `http://localhost:8080/servlet/first` 등의 주소로 접속해 서블릿이 자바 코드로 출력해 주는 화면과 톰캣 콘솔의 초기화 동작 로그를 확인합니다.
