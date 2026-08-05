# 자바 서블릿/JSP AI 연동 챗봇 & 도커 및 클라우드 배포 🐳💬

순수 서블릿과 JSP 환경에서 AI 챗 프론트엔드를 구성하고, 백엔드에서는 Gemini 모델 API를 연동하여 실시간 대화 서버를 구축한 뒤 이를 Docker 컨테이너로 묶어 클라우드(Render 등)에 실제 배포하는 고급 종합 실습입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/justchat/pom.xml) : 서블릿, HTTP 클라이언트 및 JSON 파서 라이브러리 종속성 명세
- [Dockerfile](file:///C:/workspace/justchat/Dockerfile) : 톰캣 웹 애플리케이션을 리눅스 가상화 컨테이너로 빌드하기 위한 도커 규격서
- [01_servlet_jsp_chat.md](file:///C:/workspace/justchat/01_servlet_jsp_chat.md) ~ [03_docker_render_deployment.md](file:///C:/workspace/justchat/03_docker_render_deployment.md) : 서블릿 기반 비동기 채팅 서버 구현, AI API 연동 원리, 도커 이미지 구성 및 Render 클라우드 배포 실무 가이드 문서

---

## 🛠 배운 핵심 개념 (What We Learned)

- **서블릿 비동기 통신**: 브라우저의 화면 리로드 없이 자바 서블릿과 백그라운드로 메시지를 주고받는 AJAX 파이프라인을 구축합니다.
- **배포 자동화**: 도커 컨테이너 빌드를 통해 운영체제에 구애받지 않고 언제 어디서나 챗봇 서비스를 상용 서버에 올리는 과정을 학습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `.env` 파일에 AI API Key값을 매핑합니다.
2. Maven으로 `war` 패키징을 수행한 뒤 톰캣으로 띄우거나, `docker build -t justchat .`을 쳐서 도커 가상 컨테이너로 서버를 띄워 접속합니다.
