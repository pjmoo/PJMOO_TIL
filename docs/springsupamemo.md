# 📝 Spring SupaMemo: 스프링 MVC에서 Supabase 연동까지의 여정

> **Spring MVC 아키텍처 수립과 Supabase REST API를 활용한 데이터 영속화 구현 프로젝트**
> 
> 본 프로젝트는 단순한 서블릿 템플릿에서 시작하여 단계적으로 **Spring MVC 프레임워크**를 도입하고, 최종적으로 **3계층 아키텍처(Layered Architecture)**와 외부 클라우드 데이터베이스 플랫폼인 **Supabase**를 연동하기까지의 전 과정을 단계별 브랜치로 구성하여 기록한 교육용 아키텍처 학습 프로젝트입니다.

---

## 🗺️ 프로젝트 발전 로드맵 (단계별 요약)

다음은 본 프로젝트가 발전해 온 과정과 브랜치 구성표입니다. 각 단계의 상세 내역은 해당하는 파일 링크를 클릭하여 확인할 수 있습니다.

| 단계 | 브랜치명 | 핵심 목표 | 도입 기능 및 주요 변경사항 | 주요 생성/수정 파일 | 상세 파일 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Step 0** | `step0` | 프로젝트 초기화 | Maven 기반 기초 웹 프로젝트 세팅 및 전통적 Servlet 구동 | `HelloServlet.java`, `index.jsp` | [step0.md](file:///Users/morgan/Documents/workspace/springsupamemo/step0.md) |
| **Step 1** | `step1` | Spring MVC 도입 | Java Config 기반 프론트 컨트롤러 패턴 및 스프링 IoC 컨테이너 설정 | `WebAppInitializer.java`, `WebConfig.java`, `HomeController.java`, `home.jsp` | [step1.md](file:///Users/morgan/Documents/workspace/springsupamemo/step1.md) |
| **Step 2** | `step2` | 인터랙션 구현 | CSS 분리, DTO 도입, WAS 세션을 이용한 메모 임시 저장 및 PRG 패턴 확립 | `style.css`, `MemoFormDTO.java`, `MemoViewDTO.java`, JSTL 목록 출력 | [step2.md](file:///Users/morgan/Documents/workspace/springsupamemo/step2.md) |
| **Step 3** | `step3` / `main` | 데이터베이스 연동 | 3계층 구조 분할 및 Supabase REST API(HTTP Client) 기반 데이터 영속화 완성 | `SupabaseUtil.java`, `MemoRepository.java`, `MemoService.java`, `MemoEntity.java`, `MemoTableDTO.java` | [step3.md](file:///Users/morgan/Documents/workspace/springsupamemo/step3.md) |

---

## 🎨 아키텍처 흐름도 (Mermaid)

스프링 MVC 구조와 계층형 아키텍처 하에서 사용자의 메모 요청이 외부 클라우드 DB인 Supabase까지 도달했다가 갱신되어 브라우저에 뿌려지는 전체적인 데이터 흐름도입니다.

```mermaid
sequenceDiagram
    autonumber
    actor User as 사용자 브라우저
    participant DS as DispatcherServlet
    participant Controller as HomeController
    participant Service as MemoService
    participant Repository as MemoRepository
    participant Util as SupabaseUtil
    participant DB as Supabase Cloud

    Note over User, DB: 1. 메모 저장 흐름 (POST)
    User->>DS: POST / (memo 전송)
    DS->>Controller: memoForm(MemoFormDTO) 호출
    Controller->>Service: save(MemoFormDTO) 호출
    Note over Service: DTO 데이터를 기반으로 영속성용 MemoEntity 빌드
    Service->>Repository: save(MemoEntity) 호출
    Repository->>Util: save(MemoEntity) 호출
    Note over Util: Jackson을 통해 MemoSupabaseDTO로 직렬화
    Util->>DB: HTTP POST /rest/v1/memo (API Key 포함)
    DB-->>Util: HTTP 201 Created 응답
    Util-->>Repository: void 반환
    Repository-->>Service: void 반환
    Service-->>Controller: void 반환
    Controller-->>User: 302 Redirect (redirect:/)
    
    Note over User, DB: 2. 리다이렉트 후 화면 조회 흐름 (GET)
    User->>DS: GET /
    DS->>Controller: home(Model) 호출
    Controller->>Service: findAll() 호출
    Service->>Repository: findAll() 호출
    Repository->>Util: getAll() 호출
    Util->>DB: HTTP GET /rest/v1/memo
    DB-->>Util: HTTP 200 OK (JSON 리스트 반환)
    Note over Util: Response JSON을 List<MemoTableDTO>로 변환
    Util-->>Repository: List<MemoEntity> 반환 (Entity 변환)
    Repository-->>Service: List<MemoEntity> 반환
    Note over Service: Entity 스트림을 가공해 화면용 List<MemoViewDTO>로 변환
    Service-->>Controller: List<MemoViewDTO> 반환
    Note over Controller: Model에 memoList 담기
    Controller-->>DS: home (뷰 이름 반환)
    Note over DS: ViewResolver를 거쳐 home.jsp 해석 및 JSTL c:forEach 렌더링
    DS-->>User: 렌더링된 HTML 응답
```

---

## 🍽️ 초심자를 위한 비유: "스프링 웹 애플리케이션 식당"

웹 개발과 아키텍처가 처음이라면, 이 시스템 전체를 하나의 **고급 예약제 레스토랑**으로 생각해보세요!

> [!TIP]
> * **웹 브라우저 (손님)**: 맛있는 음식을 주문하고 다 차려진 음식을 먹는 존재입니다.
> * **톰캣 WAS (식당 건물과 기본 유틸리티)**: 식당이 정상적으로 돌아가기 위한 물, 불, 전기가 공급되는 인프라입니다.
> * **DispatcherServlet (수석 지배인 / 매니저)**: 문 앞에 서서 들어오는 모든 손님의 주문을 접수하고, 어떤 서빙 직원에게 보낼지 조율하는 핵심 총괄자입니다.
> * **HomeController (홀 서빙 직원)**: 매니저에게 주문표를 건네받아 주방에 알리고, 음식이 나오면 손님에게 예쁜 그릇에 담아 테이블로 직접 나르는 직원입니다.
> * **MemoFormDTO (주문서)**: 손님이 직접 펜으로 끄적여서 적어낸 메뉴 요구 사항입니다.
> * **MemoViewDTO (서빙 트레이)**: 조리가 끝난 뒤 손님 앞에 나갈 수 있도록 가공해서 담아놓은 예쁜 개인 접시 세트입니다.
> * **MemoService (메인 셰프 / 요리사)**: 서빙 직원이 전달한 주문서를 보고 재료를 가공하고 조합하여 실제 완성된 음식으로 만들어내는 요리의 브레인입니다.
> * **MemoEntity (손질된 신선한 생재료)**: 주방 요리 도구에 맞게 껍질을 까고 손질해 놓은 날것의 재료입니다.
> * **MemoRepository (창고 관리인)**: 셰프가 "재료 가져와라", "재료 보관해라"라고 명령하면 묵묵히 창고로 가서 조달해 주는 직원입니다.
> * **SupabaseUtil (트럭 기사)**: 창고에 재료가 없거나 멀리 있는 외부 대형 농장(클라우드 DB)에 보관해야 할 때, 직접 고속도로를 달려 외부 농장에 물건을 던져두고 가져오는 외부 배송 기사입니다.
> * **Supabase (식자재 전문 외부 대형 물류센터)**: 식당 내부에 두기에는 너무나 방대한 양의 데이터(식재료)를 안전하게 무제한으로 보관해 주는 외부 전문 업체입니다.

---

## 🛠️ 주니어를 위한 백엔드 핵심 원리/구조 설명

### 1. Java Servlet과 Spring DispatcherServlet의 관계와 기동 원리
전통적인 서블릿 환경(Step 0)에서는 URL 매핑 단위로 클래스(`HttpServlet` 상속)를 다수 생성해야 했으며, 자원 할당 및 요청 분배 코드가 중복되는 문제가 있었습니다. 
스프링 MVC는 이를 극복하기 위해 **프론트 컨트롤러 패턴(Front Controller Pattern)**의 결정체인 `DispatcherServlet`을 단일 진입점으로 세웁니다.
* **톰캣(WAS) 기동**: `WebApplicationInitializer` 인터페이스를 구현한 클래스([WebAppInitializer](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/config/WebAppInitializer.java))를 찾아서 기동 시점에 컨텍스트를 로드합니다.
* **서블릿 등록**: `DispatcherServlet` 인스턴스를 서블릿 컨텍스트에 등록하고 모든 요청(`/*` 또는 `/`)을 매핑합니다.
* **인터셉트**: 들어오는 모든 HTTP 요청은 `DispatcherServlet`을 거치며, 컨트롤러의 `@RequestMapping` 정보에 매핑되어 적절한 컨트롤러로 위임됩니다.

### 2. XML에서 Java Config로의 변화와 그 이점
과거 스프링은 `web.xml`이나 `applicationContext.xml` 등 방대한 XML 설정을 필요로 했습니다. 이는 오타에 취약하고 컴파일 시점 검증이 불가능하다는 치명적 단점이 있었습니다.
* **타입 안정성**: 자바 클래스 기반([WebConfig](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/config/WebConfig.java))으로 구성하여 컴파일 타임에 모든 빈(Bean) 스캔 및 오타 검증이 수행됩니다.
* **코드 가독성**: 어노테이션 기반 설정(`@EnableWebMvc`, `@ComponentScan`)을 통해 코드의 흐름을 직관적으로 추적할 수 있습니다.

### 3. 제어의 역전(IoC)과 생성자 주입(DI)의 구조
스프링은 개발자가 직접 `new Service()`를 호출하여 객체의 생명주기를 결정하지 않고, 스프링 컨테이너에 객체를 빈(Bean)으로 등록해 필요한 곳에 주입해주는 **의존성 주입(Dependency Injection)** 방식을 사용합니다.
* **생성자 주입(Constructor Injection)**: 순환 참조를 방지하고, 주입받는 객체의 불변성(`final` 필드 사용 가능)을 보장하며, 테스트 코드 작성 시 Mock 객체를 직접 주입하기에 매우 유리합니다.
* Lombok의 `@RequiredArgsConstructor`는 클래스 내부의 `final` 지정을 가진 필드를 모아 자동으로 매개변수 생성자를 만들어 줍니다. 스프링 프레임워크 4.3 버전 이후부터는 단일 생성자를 가진 클래스의 경우 자동으로 스프링 컨테이너가 해당 생성자를 이용해 의존성을 주입하므로 추가적인 `@Autowired` 애노테이션조차 명시할 필요가 없습니다.

### 4. DTO(Data Transfer Object)와 Entity를 반드시 분리하는 이유
* **Entity**: 실제 DB 테이블 스키마와 직접 결합되어 있는 코어 도메인 모델([MemoEntity](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/model/MemoEntity.java))입니다. 비즈니스 규칙과 핵심 속성을 담고 있어 프레젠테이션(화면) 계층의 요구사항 변화로 인해 도메인 모델이 흔들려서는 안 됩니다.
* **DTO**: 화면이나 외부 API 통신 요구사항에 맞춤 설계된 전송용 가방([MemoFormDTO](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/dto/MemoFormDTO.java), [MemoViewDTO](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/dto/MemoViewDTO.java), [MemoTableDTO](file:///Users/morgan/Documents/workspace/springsupamemo/src/main/java/org/example/springsupamemo/dto/MemoTableDTO.java))입니다.
  - 필요한 데이터만 정제해서 노출하므로 보안성이 증대됩니다.
  - 화면 포맷(예: 날짜 형식 포맷팅)에 따른 도메인 손상을 원천적으로 차단합니다.

### 5. Java HttpClient를 통한 외부 REST API 연동 구조
* **자바 기본 네이티브 HTTP 클라이언트**: 별도의 거대한 프레임워크 의존성(예: WebClient 등) 없이 JDK 11부터 내장된 `java.net.http.HttpClient`를 활용하여 경량화된 네트워크 요청을 전송합니다.
* **직렬화/역직렬화**: Jackson 라이브러리의 `ObjectMapper`를 사용하여 자바 객체와 JSON 포맷 문자열 간의 데이터 마샬링(Marshalling)을 처리합니다. 수신 시에는 `TypeReference` 구조를 사용해 제네릭 소거(Type Erasure) 문제를 피하고 안전하게 `List<MemoTableDTO>`로 역직렬화합니다.

---

## 🎯 면접 대비 백엔드 예상 Q&A 문항

> [!IMPORTANT]
> 백엔드 개발자 면접 시 물어볼 법한 날카로운 예상 질문과 해설 답변 모음입니다.

### Q1. 스프링 구동 시 `WebApplicationInitializer`의 동작 방식과 WAS(톰캣 등)와의 연동 원리는 무엇인가요?
**A1.**  
톰캣과 같은 WAS는 시작할 때 자바 표준 기술 규약인 **ServletContainerInitializer(SCI)**를 탐색하여 로딩합니다. 스프링 프레임워크는 내부적으로 SCI의 구현체인 `SpringServletContainerInitializer`를 보유하고 있으며, 이 클래스는 `@HandlesTypes(WebApplicationInitializer.class)` 애노테이션 설정을 통해 구동 시점에 클래스패스 상에 존재하는 `WebApplicationInitializer` 인터페이스 구현체들을 수집합니다. 
수집된 구현체(본 프로젝트의 `WebAppInitializer`)의 `onStartup(ServletContext)` 메서드를 호출하고, 이때 자바 코드로 스프링 컨테이너인 `AnnotationConfigWebApplicationContext`를 생성 및 `DispatcherServlet`을 등록하는 일련의 서블릿 라이프사이클 바인딩 작업이 프로그램 방식으로 완료됩니다.

---

### Q2. Web.xml 기반 설정 대신 Java Config 설정을 사용하는 이유와 장단점은 무엇인가요?
**A2.**  
* **이유와 장점**: Java Config는 코드로 설정을 구성하므로 자동 완성, 타입 안정성, 상속을 통한 재사용성 등 자바 언어 자체의 강력한 정적 분석 지원을 받습니다. 또한 빌드 시 컴파일 에러를 바로 잡아주어 런타임 이전에 오류를 감지할 수 있습니다. 
* **단점**: 설정 변경 사항이 생길 때마다 매번 애플리케이션 코드를 재컴파일하고 재배포해야 한다는 한계가 존재합니다. (XML의 경우 빌드 없이 텍스트 수정만으로 반영이 가능한 경우가 있었습니다.)

---

### Q3. 컨트롤러에서 POST 요청 처리 후 곧바로 뷰를 렌더링하지 않고 `redirect:/`로 리턴하는 이유(PRG 패턴)는 무엇인가요?
**A3.**  
이를 **PRG(Post-Redirect-Get) 패턴**이라고 합니다. 사용자가 메모 등록 등의 쓰기 작업(POST)을 한 뒤 리다이렉트 처리 없이 그 자리에서 HTML 화면을 결과로 내려주게 되면, 사용자가 브라우저에서 '새로고침(F5)'을 누를 때마다 동일한 브라우저의 직전 POST 요청이 다시 전송되어 서버상에 중복으로 메모가 등록되는 오작동이 발생하게 됩니다. 
POST 요청 성공 후 즉시 302 상태 코드와 함께 GET 요청용 URL 주소로 리다이렉션을 시키면, 브라우저의 최근 요청 이력이 GET으로 변경되므로 사용자가 새로고침을 하더라도 쓰기 작업이 반복 실행되지 않고 안전하게 조회 화면만 재요청하게 됩니다.

---

### Q4. 3계층 아키텍처(Controller - Service - Repository)로 단계를 나누는 이유와 결합도/응집도 측면의 장점은 무엇인가요?
**A4.**  
각 레이어가 오직 **자신이 전담해야 하는 단 하나의 책임(관심사 분리)**에만 집중할 수 있게 만들기 위해서입니다.
* **Controller**: HTTP 요청 수신, 데이터 검증, 응답 포맷 결정에 집중합니다.
* **Service**: 순수한 도메인 비즈니스 규칙 정의와 트랜잭션 관리 등의 논리 연산을 처리합니다.
* **Repository**: 외부 인프라스트럭처나 DB에 무관하게 데이터의 조회/적재 기능만을 추상화하여 보장합니다.
이를 통해 각 계층은 하위 레이어가 무엇을 쓰는지(예: 인메모리 세션인지 Supabase DB인지) 세부 구현을 알지 못하게 인터페이스와 DTO를 매개체로 두어 **결합도를 대폭 감소**시키고, 각 파일은 고유한 역할에 집중하여 **응집도를 극대화**합니다. 결과적으로 특정 기술의 변화(예: DB 벤더 변경 등)가 발생했을 때 상위 계층의 비즈니스 코드를 전혀 수정하지 않아도 되므로 높은 유지보수성을 가지게 됩니다.

---

### Q5. DTO와 Entity를 분리해야 하는 이유는 무엇이며, 이들을 상호 변환하는 작업은 아키텍처 상 어디서 수행하는 것이 적절할까요?
**A5.**  
* **분리 이유**: Entity는 영속성 계층과 강하게 결합되어 있으므로, 화면 요구사항의 변덕에 따라 Entity 구조가 매번 바뀌면 연관된 데이터베이스 테이블 설계가 깨져 성능 저하나 원하지 않는 사이드 이펙트가 발생합니다. DTO를 통해 각 통신 지점(입력 폼, 화면 출력, API 연동 등)에 딱 필요한 필드와 포맷만 정제해서 껍데기를 입혀주는 것이 구조상 안전합니다.
* **적절한 변환 위치**: DTO를 Entity로 변환하는 변환 작업의 책임은 비즈니스 정책을 수립하는 **Service 계층** 또는 데이터 접근 시 전달될 매개값을 빌딩하는 단계에서 수행하는 것이 보편적으로 선호됩니다. 컨트롤러는 DTO 데이터의 유효성 검증만 수행하고 영속성 객체의 내부 형태까지는 알지 못하도록 하여 계층 간 격리를 단단하게 유지하는 것이 좋은 설계 원칙에 가깝습니다. (조회의 경우 Repository에서 가져온 Entity 리스트를 Service 레이어에서 스트림 파이프라인을 거치며 `MemoViewDTO`로 가공하여 Controller 방향으로 올려 보내는 구조가 권장됩니다.)
