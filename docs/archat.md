# 스프링 백엔드 아키텍처 비교 실습 - Layered MVC vs Clean Architecture 🍃🏰

인공지능 챗봇(Archat) 백엔드 서버를 구축하면서, 컨트롤러-서비스-리포지토리로 이루어진 기본적인 레이어드 아키텍처(Spring MVC) 구조와 도메인 영역을 보호하며 느슨한 연결 관계를 지향하는 클린 아키텍처(Clean Architecture) 구조의 차이를 배우고 분석하는 고급 실습입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/archat/pom.xml) : 스프링 웹 및 기타 라이브러리 설정
- [step1_mvc.md](file:///C:/workspace/archat/step1_mvc.md) / [step2_clean.md](file:///C:/workspace/archat/step2_clean.md) : 레이어드 MVC 스타일의 설계 포인트와 이로 인해 생기는 결합 문제를 어댑터/포트 패턴을 도입해 해결하는 클린 아키텍처 구조 해설 문서
- [src/main/java/](file:///C:/workspace/archat/src/main/java/) : MVC 레이어 클래스들과 클린 아키텍처 인터페이스 포트(Port), 유스케이스(UseCase)를 구현한 자바 소스코드들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **레이어드 아키텍처 (Layered Architecture)**: 구현이 직관적이고 빠르지만 비즈니스 로직이 데이터베이스 라이브러리에 강하게 결합되는 한계점을 배웁니다.
- **포트와 어댑터 (Hexagonal / Clean)**: 비즈니스 로직(도메인)이 중심이 되고, DB나 웹 프레임워크는 주변부 '어댑터'가 되어 인터페이스인 '포트'를 꽂아 동작하도록 결합도를 낮추는 견고한 엔터프라이즈 설계 능력을 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 아키텍처 설계 문서(`step1_mvc.md`, `step2_clean.md`)를 보며 클래스 간의 호출 방향과 결합도를 비교합니다.
2. 프로젝트의 메인 스프링 클래스를 실행하여 AI 챗 서버 구동 과정을 테스트합니다.
