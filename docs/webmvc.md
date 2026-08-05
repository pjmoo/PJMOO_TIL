# 🍃 Spring Web MVC 실습 프로젝트

스프링 웹 MVC의 핵심 동작 원리를 자바 기반 설정(Java-based Configuration)을 통해 단계별로 학습하고 구현한 실습 저장소입니다.

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/spring%20framework-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white" alt="Spring" />
  <img src="https://img.shields.io/badge/apache%20tomcat-%23F8DC75.svg?style=for-the-badge&logo=apache-tomcat&logoColor=black" alt="Tomcat" />
  <img src="https://img.shields.io/badge/apache%20maven-%23C71A36.svg?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven" />
  <br>
  <img src="https://img.shields.io/badge/Lombok-bc5137?style=for-the-badge&logo=lombok&logoColor=white" alt="Lombok" />
  <img src="https://img.shields.io/badge/JSP-007396?style=for-the-badge" alt="JSP" />
  <img src="https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS" />
  <img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
</p>

---

## 📂 단계별 학습 내용

각 단계별 핵심 개념, 비유 설명, 그리고 기술 면접 질문은 아래 문서에서 확인할 수 있습니다.

### [Step 1: Spring Web MVC 초기 설정](step1.md)
* **주요 내용**: `web.xml` 없이 Java Code 기반으로 `DispatcherServlet` 및 스프링 컨테이너 설정
* **핵심 개념**: Servlet 3.0+ SPI 메커니즘, `WebApplicationInitializer`, `WebConfig`

### [Step 2: Controller 구현, 데이터 전달(Model/DTO) 및 정적 리소스 설정](step2.md)
* **주요 내용**: `@Controller` 매핑, `ViewResolver` 접두사/접미사 설정, `/WEB-INF` 보안 영역 활용, Java `record` 기반 DTO 데이터 전달 및 정적 리소스 핸들러(`/resources/**`) 매핑
* **핵심 개념**: `InternalResourceViewResolver`, JavaBeans 규약과 JSP EL 바인딩, `WebMvcConfigurer`

### [Step 3: HTTP POST 요청 처리, 데이터 바인딩 및 PRG 패턴](step3.md)
* **주요 내용**: POST 요청의 폼 데이터 객체 바인딩, `HttpSession` 기반 상태 관리, 이중 전송 방지를 위한 PRG(Post-Redirect-Get) 패턴 구현
* **핵심 개념**: `@ModelAttribute`, Lombok `@ToString`, Forward vs Redirect의 동작 흐름

### [Step 4: Web Bean Scopes & Scoped Proxy](step4.md)
* **주요 내용**: 요청 범위(`@RequestScope`)와 세션 범위(`@SessionScope`) 빈 생성 및 생명 주기 검증, 싱글톤 빈과의 결합 모순 해결
* **핵심 개념**: 생성자 주입(`@RequiredArgsConstructor`), AOP Scoped Proxy 메커니즘, `RequestContextHolder` (ThreadLocal)
