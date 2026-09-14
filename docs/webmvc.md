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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/webmvc/step2/controller/FoodController.java](<../../webmvc/src/main/java/org/example/webmvc/step2/controller/FoodController.java>) · [src/main/java/org/example/webmvc/step3/controller/ShirtController.java](<../../webmvc/src/main/java/org/example/webmvc/step3/controller/ShirtController.java>) · [src/main/java/org/example/webmvc/step4/ScopeController.java](<../../webmvc/src/main/java/org/example/webmvc/step4/ScopeController.java>)

### 요청 바인딩과 응답 변환의 갈림길

DispatcherServlet은 경로에 맞는 컨트롤러를 찾고 실행을 중개한다. 폼·쿼리 파라미터를 객체에 바인딩하는 것과 JSON 본문을 메시지 컨버터로 읽는 것은 서로 다른 경로다. 반환값도 뷰 이름으로 해석할지 응답 본문으로 직렬화할지 컨트롤러 구성에 따라 달라진다.

**예시로 이해하기:** 일반 Controller가 "books"를 반환하면 모델과 템플릿으로 HTML을 만드는 구성을 사용할 수 있다. ResponseBody가 적용되면 그 문자열 자체가 본문이 된다. Model에 넣은 속성 이름과 템플릿에서 읽는 이름이 맞는지도 확인한다.

근거: 241-2 Spring Web MVC — [6쪽](<../../260629_ex/새 폴더/7-7/241-2_Spring_Web_MVC.pdf#page=6>) · [7쪽](<../../260629_ex/새 폴더/7-7/241-2_Spring_Web_MVC.pdf#page=7>) · [9쪽](<../../260629_ex/새 폴더/7-7/241-2_Spring_Web_MVC.pdf#page=9>) · [12쪽](<../../260629_ex/새 폴더/7-7/241-2_Spring_Web_MVC.pdf#page=12>) · [18쪽](<../../260629_ex/새 폴더/7-7/241-2_Spring_Web_MVC.pdf#page=18>)

<!-- pdf-til-supplement:end -->
