# 🍃 Thymeleaf & Spring Boot 실습 프로젝트 (260804_thymeleaf)

이 프로젝트는 Spring Boot와 Thymeleaf, Spring Data JPA, H2 데이터베이스, 그리고 Docker 멀티 스테이징 빌드 환경까지 다각도로 스프링 웹 애플리케이션의 핵심 기능을 실습할 수 있도록 설계된 예제 프로젝트입니다.

백엔드 웹 개발의 기초가 없어도 흐름을 파악하고 이해할 수 있도록 기능별 핵심 요점과 실제 동작 방식을 상세하게 정리했습니다.

---

## 📂 프로젝트 구조와 실습 파일 링크

실습 단계별로 다룬 주요 파일 목록입니다. 각 파일명을 클릭하여 소스 코드를 바로 확인할 수 있습니다.

### 1. 설정 및 인프라 (Configuration & Infrastructure)
* [`build.gradle`](file:///C:/workspace/thymeleaf/build.gradle): 프로젝트에 필요한 라이브러리(Thymeleaf, JPA, H2 DB, Lombok 등) 의존성을 관리하는 설정 파일입니다.
* [`application.yaml`](file:///C:/workspace/thymeleaf/src/main/resources/application.yaml): 애플리케이션의 메인 설정 파일로, 실행 프로필(`dev,app,db`) 및 템플릿 캐싱 비활성화를 처리합니다.
* [`application-app.yaml`](file:///C:/workspace/thymeleaf/src/main/resources/application-app.yaml): 외부 주입용 메시지 설정을 모아둔 개별 프로필 설정 파일입니다.
* [`application-db.yaml`](file:///C:/workspace/thymeleaf/src/main/resources/application-db.yaml): 개발/운영 환경별 JPA 및 H2 데이터베이스 연결 정보 설정 파일입니다.
* [`Dockerfile`](file:///C:/workspace/thymeleaf/Dockerfile): 서비스 배포를 최적화하기 위한 Gradle 빌드 및 JRE 실행 다단계(Multi-stage) 도커 설정 파일입니다.

### 2. 다국어 메시지 리소스 (Internationalization - i18n)
* [`messages.properties`](file:///C:/workspace/thymeleaf/src/main/resources/messages.properties): 기본(한국어) 다국어 메시지 키-값 정의 파일입니다.
* [`messages_en.properties`](file:///C:/workspace/thymeleaf/src/main/resources/messages_en.properties): 영어 사용자를 위한 다국어 메시지 정의 파일입니다.
* [`messages_ko.properties`](file:///C:/workspace/thymeleaf/src/main/resources/messages_ko.properties): 한국어 로케일 대응을 위한 메시지 파일 파일입니다.

### 3. 자바 소스 코드 (Java Spring Code)
* [`ThymeleafApplication.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/ThymeleafApplication.java): 애플리케이션의 메인 진입 클래스로, 외부 프로퍼티 스캔 어노테이션이 설정되어 있습니다.
* [`AppProperties.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/config/AppProperties.java): `@ConfigurationProperties`를 사용해 야믈(`yaml`) 설정 값을 자바 객체(Record)로 안전하게 바인딩하는 클래스입니다.
* [`AppConfig.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/config/AppConfig.java): 스프링 프로필(`@Profile`) 조건에 맞춰 스프링 컨테이너에 빈(Bean)을 등록하고, 우선순위 지정(`@Primary`, `@Qualifier`)을 테스트하는 설정 파일입니다.
* [`Pizza.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/entity/Pizza.java): 데이터베이스 테이블과 매핑되는 JPA 엔티티 클래스입니다.
* [`PizzaRepository.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/repository/PizzaRepository.java): 피자 엔티티에 대한 CRUD 데이터베이스 조작을 담당하는 JpaRepository 인터페이스입니다.
* [`MainController.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/controller/MainController.java): 클라이언트의 HTTP 요청(GET/POST)을 받아 비즈니스 로직을 연결하고 Thymeleaf 뷰에 데이터를 전달하는 컨트롤러입니다.

### 4. 뷰 템플릿 (View Template)
* [`index.html`](file:///C:/workspace/thymeleaf/src/main/resources/templates/index.html): Thymeleaf 템플릿 엔진 문법을 활용하여 서버의 데이터를 HTML 화면에 출력해주는 뷰 파일입니다.

---

## 💡 실습 테마별 상세 정리

### 1. 스프링 실행 환경 설정과 프로필 (Profiles)
* **개념:** 하나의 프로그램 소스코드로 개발 환경(Local, Dev), 실서버 환경(Prod), 혹은 데이터베이스 환경(Db) 등 다채로운 환경에 맞춰 설정값을 분리해 동작하게 만드는 기술입니다.
* **실습 내용:** 
  - `application.yaml`에서 `spring.profiles.active: dev,app,db` 설정을 통해 여러 프로필 설정 파일을 동시에 읽어옵니다.
  - 개발 중 HTML을 수정했을 때 즉각 반영되도록 `thymeleaf.cache: false`로 설정하여 캐시를 비활성화했습니다.

### 2. 설정 파일 속성값 바인딩과 주입 (`@Value` vs `@ConfigurationProperties`)
* **`@Value` (필드 주입):**
  - 설정 파일에 적힌 단일 값을 자바 클래스 변수에 쏙 주입하는 가장 직관적이고 쉬운 방법입니다.
  - `MainController.java`에서 `@Value("${app.message}") private String msg;` 형태로 사용했습니다.
* **`@ConfigurationProperties` (객체 바인딩):**
  - 관련 있는 여러 설정값들을 자바의 객체(클래스/레코드)에 안전하게 통째로 매핑하는 구조적이고 현대적인 기법입니다.
  - `AppProperties.java`에서 `app` 접두사로 묶인 속성들을 record 형태로 자동 주입받았습니다.

### 3. 스프링 빈(Bean) 등록과 충돌 해결 (`@Primary` vs `@Qualifier`)
* **개념:** 스프링이 관리하는 객체를 **Bean(빈)**이라고 부릅니다. 특정 개발/운영 환경별로 서로 다른 빈을 생성하거나, 동일한 타입의 빈이 여러 개 존재할 때 스프링이 이를 올바르게 찾아 주입받도록 조율해야 합니다.
* **해결 방법:**
  - `@Profile("dev")`: 특정 프로필이 활성화되었을 때만 빈을 생성합니다.
  - `@Primary`: 동일한 타입의 빈이 여러 개 등록되어 있을 때, 별도 지정이 없으면 이 빈을 1순위로 채택하여 의존성을 주입합니다.
  - `@Qualifier("특정이름")`: 사용할 빈의 이름을 콕 찝어서 강제로 주입받게 설정합니다.
  - 실습을 진행한 `AppConfig.java` 소스 코드를 통해 스프링 의존성 주입(DI) 흐름을 직관적으로 실습했습니다.

### 4. 데이터베이스 연동 (JPA & H2)
* **개념:** 자바 객체와 관계형 데이터베이스 테이블을 자동으로 매핑해주는 기술(JPA)과, 가볍고 빠른 인메모리 개발용 데이터베이스(H2)를 조합하여 데이터를 실제로 영구 저장하는 연동 실습입니다.
* **실습 내용:**
  - **Entity ([`Pizza.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/entity/Pizza.java)):** 데이터베이스에 저장할 테이블의 모양과 컬럼 설정을 정의했습니다.
  - **Repository ([`PizzaRepository.java`](file:///C:/workspace/thymeleaf/src/main/java/org/example/thymeleaf/repository/PizzaRepository.java)):** JPA가 제공하는 기본 CRUD 메서드(`save()`, `findAll()`)를 별도의 SQL 작성 없이 즉각 사용할 수 있게 제공하는 인터페이스입니다.
  - **DTO (Data Transfer Object):** 엔티티 객체가 데이터베이스 스키마와 직접 닿아있기 때문에 외부 통신용(화면 전송용) 데이터를 따로 담는 가방(`PizzaDTO`)을 설계해 안전하게 변환했습니다.

### 5. Thymeleaf 템플릿 엔진 주요 문법
서버가 만든 데이터를 HTML 파일에 얹어서 사용자에게 뿌려줄 때 사용하는 핵심 문법들을 공부했습니다.

* **텍스트 출력과 이스케이프:**
  - **기본 출력 (Escaped):** HTML 특수기호(`<`, `>` 등)를 안전하게 문자열로 인코딩하여 출력합니다 (XSS 공격 대비).
    - `th:text="${data}"` 혹은 `[[${data}]]`
  - **비이스케이프 출력 (Unescaped):** 전달받은 태그 문자열을 실제 HTML 요소로 해석해 브라우저에 렌더링합니다.
    - `th:utext="${data}"` 혹은 `[(${data})]` (실습 중 주석 처리됨)
* **다국어 메시지 바인딩 (`#{...}`):**
  - `#{page.headline}` 형식의 식을 작성하면, 접속한 로케일 정보에 대응되는 프로퍼티 파일(`messages.properties` 혹은 `messages_en.properties`)에서 텍스트를 자동 매칭하여 변경 노출합니다.
* **URL 표현식 (`@{...}`):**
  - 경로를 처리할 때 유용한 표현식으로, 동적 경로 변수(`@{/login/{id}(id=...)}`)나 쿼리 매개변수(`@{/login(pass=...)}`) 처리가 매우 유연합니다.
* **반복문과 루프 상태 변수 (`th:each`):**
  - 리스트를 반복 출력할 때 현재 반복 상태를 알려주는 변수를 2번째 매개변수(`status`)로 받아볼 수 있습니다.
  - `status.count` (1부터 시작하는 순번), `status.index` (0부터 시작하는 인덱스), `status.first`/`status.last` (처음/끝 여부 boolean) 등을 제공합니다.
* **조건문 (`th:if`, `th:unless`, `th:switch`):**
  - 특정 조건에 부합할 때만 화면에 태그를 노출하는 분기 기법입니다.
  - `th:unless`는 조건이 거짓일 때만 태그를 노출하며, `th:switch`와 `th:case`를 이용한 다중 선택도 가능합니다.

### 6. 컨테이너 배포 최적화 (Multi-stage Dockerfile)
* **개념:** 애플리케이션을 도커 컨테이너로 가볍고 안전하게 배포하기 위해, 빌드(Build) 단계와 실행(Run) 단계를 완전히 쪼개는 빌드 최적화 기법입니다.
* **실습 내용:**
  - **Builder Stage:** 무겁지만 빌드 툴이 들어있는 Gradle JDK 이미지에서 소스코드를 컴파일 및 빌드하여 `app.jar`를 만듭니다.
  - **Run Stage:** 완성된 `app.jar` 파일만 쏙 빼와서 가벼운 경량 JRE 17 Alpine 이미지 위로 얹어 가볍게 구동합니다.
  - 실행 매개변수에 `-XX:MaxRAMPercentage=75.0`을 지정하여 클라우드 컨테이너의 메모리 한계에서 발생할 수 있는 Out-Of-Memory(OOM) 현상을 방지하도록 실행 성능 최적화를 적용했습니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/thymeleaf/controller/MainController.java](<../../thymeleaf/src/main/java/org/example/thymeleaf/controller/MainController.java>) · [src/main/java/org/example/thymeleaf/ThymeleafApplication.java](<../../thymeleaf/src/main/java/org/example/thymeleaf/ThymeleafApplication.java>) · [src/main/resources/templates/index.html](<../../thymeleaf/src/main/resources/templates/index.html>)

### Gradle Wrapper와 의존성 범위

Wrapper는 프로젝트에서 사용할 Gradle 버전을 정해 개발자마다 설치된 빌드 도구의 차이를 줄인다. implementation·runtimeOnly·testImplementation은 의존성이 필요한 단계를 구분한다. BOM은 라이브러리 버전 조합을 관리하지만 모든 라이브러리를 자동 추가하지는 않는다.

**예시로 이해하기:** JDBC 드라이버가 실행 시에만 필요한 경우와 소스에서 직접 사용하는 라이브러리를 비교하면 의존성 범위의 차이가 보인다. PDF의 Spring Boot 4 실습을 읽더라도 기존 프로젝트의 버전을 곧바로 바꾸지 말고 build.gradle과 Wrapper 설정을 기준으로 동작을 해석한다.

근거: 401-1 Spring Boot 4와 Gradle (1) — [20쪽](<../../260629_ex/새 폴더/8-4/401-1_Spring_Boot_4와_Gradle (1).pdf#page=20>) · [21쪽](<../../260629_ex/새 폴더/8-4/401-1_Spring_Boot_4와_Gradle (1).pdf#page=21>) · [23쪽](<../../260629_ex/새 폴더/8-4/401-1_Spring_Boot_4와_Gradle (1).pdf#page=23>) · [25쪽](<../../260629_ex/새 폴더/8-4/401-1_Spring_Boot_4와_Gradle (1).pdf#page=25>)

### 설정 파일의 값과 실제 적용값 구분하기

같은 설정 키가 여러 출처에 있으면 우선순위에 따라 최종 값이 정해진다. 프로파일은 환경별 설정을 선택하고 ConfigurationProperties는 관련 값을 타입으로 묶는다. 파일에 값이 적혀 있다는 사실만으로 그 값이 실행 시 사용된다고 판단하면 설정 오류를 놓칠 수 있다.

**예시로 이해하기:** 개발 포트를 바꿨는데 반영되지 않으면 활성 프로파일과 환경 변수·실행 인자를 함께 확인한다. .env 파일도 존재만으로 모든 실행 도구에 자동 적용되는 것은 아니므로 import나 로딩 구성을 읽는다. 비밀 값 자체보다 어떤 설정 키가 어디서 공급되는지를 TIL에 남긴다.

근거: 401-2 application-yml과 외부 설정 — [10쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=10>) · [13쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=13>) · [17쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=17>) · [28쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=28>) · [32쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=32>) · [34쪽](<../../260629_ex/새 폴더/8-4/401-2_application-yml과_외부_설정.pdf#page=34>)

### 템플릿 표현식이 HTML로 바뀌는 시점

Thymeleaf는 서버가 모델과 템플릿을 결합해 HTML을 만든다. 브라우저는 완성된 HTML을 받으므로 th:if로 제외된 요소는 단순히 CSS로 가린 요소와 다르다. 변수·메시지·링크 표현식은 각각 데이터 출력, 다국어 문구, URL 조립이라는 목적을 갖는다.

**예시로 이해하기:** 책 제목을 th:text로 출력하면 HTML 이스케이프가 적용된다. th:utext는 HTML을 해석하므로 신뢰하지 않는 입력에 사용하면 위험하다. 메뉴가 렌더링되지 않아도 사용자가 직접 URL을 호출할 수 있으므로 권한 검사는 서버에서 수행한다.

근거: 401-3 Thymeleaf 기초 — [6쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=6>) · [13쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=13>) · [23쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=23>) · [26쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=26>) · [34쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=34>) · [35쪽](<../../260629_ex/새 폴더/8-4/401-3_Thymeleaf_기초.pdf#page=35>)

<!-- pdf-til-supplement:end -->
