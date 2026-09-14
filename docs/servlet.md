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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/servlet/FirstServlet.java](<../../servlet/src/main/java/org/example/servlet/FirstServlet.java>) · [src/main/java/org/example/servlet/FormServlet.java](<../../servlet/src/main/java/org/example/servlet/FormServlet.java>) · [src/main/java/org/example/servlet/LifeCycleServlet.java](<../../servlet/src/main/java/org/example/servlet/LifeCycleServlet.java>)

### 빌드 결과와 실행 컨테이너의 관계

Maven은 의존성을 모으고 컴파일·테스트·패키징 단계를 수행한다. WAR는 웹 애플리케이션을 서블릿 컨테이너에 배포하는 형태이며, 실행 가능한 JAR는 별도 실행 구성이 필요하다. 파일 확장자만 바꾸어 배포 방식이 전환되는 것은 아니다.

**예시로 이해하기:** pom.xml의 packaging과 서블릿 의존성, 배포 대상 컨테이너를 함께 읽는다. Maven의 package는 앞선 기본 라이프사이클 단계를 수행하지만 clean은 별도 라이프사이클이다. javax와 jakarta 패키지를 섞는 문제는 코드 오타보다 의존성·컨테이너 조합에서 원인을 찾는다.

근거: 231-1 Maven  Tomcat — [5쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=5>) · [10쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=10>) · [17쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=17>)

### 요청별 데이터와 Servlet의 공유 필드

서블릿 인스턴스는 여러 요청에서 재사용될 수 있지만 요청·응답 객체는 각 요청의 데이터를 담는다. 사용자별 값을 서블릿 필드에 넣으면 요청끼리 섞일 수 있다. request·session·application 범위는 단순한 저장 위치가 아니라 공유 대상과 수명의 차이다.

**예시로 이해하기:** 조회 결과를 request에 담고 forward하면 같은 요청에서 JSP가 읽을 수 있다. redirect는 브라우저가 새 요청을 보내므로 기존 request 속성은 이어지지 않는다. 한 번만 보여줄 메시지를 세션에 보관한다면 소비 후 제거하는 과정까지 필요하다.

근거: 231-2 Servlet — [13쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=13>) · [15쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=15>) · [21쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=22>)

<!-- pdf-til-supplement:end -->
