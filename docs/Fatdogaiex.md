# FatDog AI 확장 실습 플랫폼 🍃🤖

스프링 부트 프로젝트와 인공지능 API SDK 기능을 유기적으로 연동하여 텍스트 생성 및 시뮬레이션을 구현해 보는 심화 실습 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/Fatdogaiex/pom.xml) : 프로젝트 의존성 설정 파일
- [src/main/java/](file:///C:/workspace/Fatdogaiex/src/main/java/) : AI 쿼리를 수행하고 결과를 응답받는 컨트롤러 및 도메인 로직

---

## 🛠 배운 핵심 개념 (What We Learned)

- **백엔드 AI 연동**: 외부 대형 언어 모델(LLM)에 쿼리를 쏘고 JSON 등으로 수신받아 로컬 DB 구조에 매핑하는 풀 아키텍처 연습입니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 프로젝트를 실행한 후 AI 질문 전송 컨트롤러 매핑 주소로 로컬 호출을 수행하여 API 반응을 검증합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/com/example/fatdogaiex/HelloServlet.java](<../../Fatdogaiex/src/main/java/com/example/fatdogaiex/HelloServlet.java>)

### 빌드 결과와 실행 컨테이너의 관계

Maven은 의존성을 모으고 컴파일·테스트·패키징 단계를 수행한다. WAR는 웹 애플리케이션을 서블릿 컨테이너에 배포하는 형태이며, 실행 가능한 JAR는 별도 실행 구성이 필요하다. 파일 확장자만 바꾸어 배포 방식이 전환되는 것은 아니다.

**예시로 이해하기:** pom.xml의 packaging과 서블릿 의존성, 배포 대상 컨테이너를 함께 읽는다. Maven의 package는 앞선 기본 라이프사이클 단계를 수행하지만 clean은 별도 라이프사이클이다. javax와 jakarta 패키지를 섞는 문제는 코드 오타보다 의존성·컨테이너 조합에서 원인을 찾는다.

근거: 231-1 Maven  Tomcat — [5쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=5>) · [10쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=10>) · [17쪽](<../../260629_ex/새 폴더/6-30/231-1_Maven__Tomcat.pdf#page=17>)

### 요청별 데이터와 Servlet의 공유 필드

서블릿 인스턴스는 여러 요청에서 재사용될 수 있지만 요청·응답 객체는 각 요청의 데이터를 담는다. 사용자별 값을 서블릿 필드에 넣으면 요청끼리 섞일 수 있다. request·session·application 범위는 단순한 저장 위치가 아니라 공유 대상과 수명의 차이다.

**예시로 이해하기:** 조회 결과를 request에 담고 forward하면 같은 요청에서 JSP가 읽을 수 있다. redirect는 브라우저가 새 요청을 보내므로 기존 request 속성은 이어지지 않는다. 한 번만 보여줄 메시지를 세션에 보관한다면 소비 후 제거하는 과정까지 필요하다.

근거: 231-2 Servlet — [13쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=13>) · [15쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=15>) · [21쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=21>) · [22쪽](<../../260629_ex/새 폴더/6-30/231-2_Servlet.pdf#page=22>)

<!-- pdf-til-supplement:end -->
