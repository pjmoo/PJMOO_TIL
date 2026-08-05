# 자바 웹 상태 유지 기술 - 쿠키(Cookie) & 세션(Session) 🍪🔒

웹 브라우저와 서버 간에 연결 상태를 끊지 않고 사용자의 로그인 정보나 장바구니 데이터를 기억하게 해주는 웹 핵심 상태 보존 기술인 쿠키와 세션의 서블릿 구현법을 다룹니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/cookiesession/pom.xml) : 서블릿 및 톰캣 구동용 Maven 디펜던시 설정
- [step1.md](file:///C:/workspace/cookiesession/step1.md) ~ [step5.md](file:///C:/workspace/cookiesession/step5.md) : HTTP 비연결성(Stateless)의 한계, 쿠키의 동작 흐름, 안전한 서버 세션 생성과 소멸, 세션 타임아웃 이론 및 코드 실습 요약서
- [src/main/java/](file:///C:/workspace/cookiesession/src/main/java/) : `HttpServletRequest`로부터 세션을 꺼내어 상태를 등록/검증하는 자바 컨트롤러 소스코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **HTTP Stateless**: 웹의 근본적인 무상태 프로토콜 특징을 이해하고, 왜 보조 저장소(쿠키, 세션)가 탄생했는지 이해합니다.
- **쿠키 vs 세션**: 클라이언트 브라우저에 텍스트로 보관하는 쿠키와, 서버 안전한 메모리에 객체로 보관하는 세션의 보안적/성능적 차이를 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 톰캣(Tomcat) 서버를 연동하여 프로젝트를 빌드 및 구동합니다.
2. 로그인/로그아웃 페이지를 브라우저로 띄운 뒤, 크롬 개발자 도구의 **Application -> Storage** 메뉴에서 실제 생성되는 쿠키(JSESSIONID) 정보를 추적합니다.
