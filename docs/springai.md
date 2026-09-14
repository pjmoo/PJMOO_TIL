# 🌱 Spring AI 실습 프로젝트 (Movie Recommendation System)

이 프로젝트는 **Spring AI** 프레임워크를 사용하여 다양한 대형 언어 모델(LLM) 공급자(Provider)를 연동하고, AI 응답 결과를 웹 애플리케이션으로 연동하며, 최종적으로 구조화된 데이터(Structured Output)로 영화 추천을 받는 실습 내용을 담고 있습니다.

---

## 💡 핵심 개념 이해하기

처음 공부하시는 분들을 위해 Spring AI의 핵심 개념들을 먼저 정리합니다.

### 1. Spring AI란?
스프링 생태계에서 인공지능(AI) 모델들을 일관된 인터페이스로 쉽게 다룰 수 있도록 도와주는 스프링 공식 프로젝트입니다. 개발자는 각 AI 제공사(OpenAI, Google, Groq 등)의 SDK를 개별적으로 공부할 필요 없이, Spring AI가 제공하는 공통 인터페이스를 통해 편리하게 AI 서비스를 통합할 수 있습니다.

### 2. ChatModel vs ChatClient
* **`ChatModel` (저수준 인터페이스)**: AI API와의 물리적 통신을 담당하는 기본 빈(Bean) 객체입니다. (예: `OpenAiChatModel`, `GoogleGenAiChatModel`)
* **`ChatClient` (고수준 인터페이스 - 권장)**: `ChatModel`을 랩핑하여 추가적인 Fluent API(체이닝 메소드), 디폴트 시스템 메시지, 기본 옵션(모델명, 온도 등)을 편리하게 지정하고 요청을 처리할 수 있는 스프링 공식 추천 클라이언트 인터페이스입니다.

### 3. Structured Output (구조화된 출력)
* 기본적으로 LLM은 문자열(Markdown/Text)로 답변합니다. 하지만 실무에서는 이를 JSON 포맷이나 자바 객체(DTO)로 변환해 데이터베이스에 저장하거나 가공해야 합니다.
* Spring AI의 `responseEntity(Class)` 기능을 이용하면, AI 모델이 우리의 자바 DTO 스키마에 딱 맞춰 JSON 형태로 답변하도록 유도하고, 스프링이 이를 자동으로 자바 객체로 역직렬화(Parsing)해 줍니다.

---

## 🛠️ 주요 환경 설정 및 의존성

### 1. 의존성 정의 ([pom.xml](file:///C:/workspace/springai/pom.xml))
스프링 부트 `4.0.7` 환경에서 Spring AI `2.0.0` 버전을 연동하기 위해 `spring-ai-bom`을 사용하고, 다음과 같은 스타터 라이브러리를 추가했습니다.
* **Google Gemini 연동**: `spring-ai-starter-model-google-genai`
* **OpenAI API 호환 연동(Groq, NIM)**: `spring-ai-starter-model-openai` (Groq 및 NVIDIA NIM은 OpenAI API 규격을 공유하므로 이 라이브러리를 재사용합니다.)

### 2. 환경변수 관리 ([.env.dev](file:///C:/workspace/springai/.env.dev))
API Key와 같은 민감한 정보는 소스코드에 직접 노출하지 않고 `.env.dev` 파일에 따로 보관합니다. (샘플 양식은 [.env.dev.sample](file:///C:/workspace/springai/.env.dev.sample) 참고)
```properties
GROQ_API_KEY=YOUR_GROQ_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NIM_API_KEY=YOUR_NVIDIA_NIM_API_KEY
```

### 3. 스프링 설정 ([application-dev.properties](file:///C:/workspace/springai/src/main/resources/application-dev.properties))
* `spring.config.import=optional:file:.env.dev[.properties]` 설정을 통해 `.env.dev`의 변수들을 자동으로 스프링 프로퍼티로 바인딩합니다.
* 각 Provider별 Base URL, API Key 및 디폴트 모델을 아래와 같이 선언하여 관리합니다.
  * **Groq Base URL**: `https://api.groq.com/openai/v1`
  * **NVIDIA NIM Base URL**: `https://integrate.api.nvidia.com/v1`

---

## 💻 주요 소스 코드 분석

### 1. AI 클라이언트 Configuration ([ChatClientConfig.java](file:///C:/workspace/springai/src/main/java/org/example/springai/config/ChatClientConfig.java))
세 가지 다른 AI 모델 서비스인 **Groq**, **Google Gemini**, **NVIDIA NIM**을 각각 Spring 빈(Bean)으로 커스터마이징하여 등록합니다.
* **시스템 메시지 통일**: 모든 클라이언트에 본인 모델 정보를 상단에 알리고, 식사 메뉴를 추천하도록 하는 기본 시스템 프롬프트를 지정했습니다.
* **Gemini 설정**: `GoogleGenAiChatOptions`를 통해 `gemini-3.5-flash-lite` 모델을 설정하고, 생각 수준을 `thinkingLevel(GoogleGenAiThinkingLevel.LOW)`로 지정했습니다.
* **NIM 설정**: `NimProperties`([NimProperties.java](file:///C:/workspace/springai/src/main/java/org/example/springai/domain/NimProperties.java))로부터 base-url과 api-key를 주입받아 `OpenAiChatModel` 인스턴스를 직접 빌드하여 연동했습니다.

### 2. 비즈니스 로직 서비스 ([ChatService.java](file:///C:/workspace/springai/src/main/java/org/example/springai/service/ChatService.java))
```java
// 1. 일반 대화 서비스 (Provider 분기 처리)
public String chat(ChatDTO dto) {
    switch (dto.provider()) {
        case groq -> {
            return groqChatClient.prompt()
                    .system("제공 받은 내용을 Y 또는 N으로 답하시오")
                    .user(dto.message())
                    .options(ChatOptions.builder()
                            .model("llama-3.3-70b-versatile") // 런타임에 동적 모델 교체
                            .temperature(0.0)
                            .maxTokens(16))
                    .call().content();
        }
        case google -> {
            return geminiChatClient.prompt().user(dto.message()).call().content();
        }
        case nim -> {
            return nimChatClient.prompt().user(dto.message()).call().content();
        }
        default -> throw new RuntimeException("지원하지 않는 Provider");
    }
}

// 2. 구조화된 영화 추천 서비스 (Structured Output)
public ResponseEntity<ChatResponse, MovieRecommendationDTO> recommend(ChatDTO dto) {
    return geminiChatClient.prompt()
            .system("이전 프롬프트는 무시하고 다음 키워드에 어울리는 영화 추천.")
            .user(dto.message())
            .call()
            .responseEntity(MovieRecommendationDTO.class); // DTO 클래스를 주입하여 객체 파싱 자동화
}
```

### 3. 구조화 데이터 DTO ([MovieRecommendationDTO.java](file:///C:/workspace/springai/src/main/java/org/example/springai/dto/MovieRecommendationDTO.java))
영화 추천 데이터를 JSON 포맷 형태로 받아오기 위한 레코드 클래스입니다.
```java
@Builder
public record MovieRecommendationDTO(
        String title,  // 영화 제목
        int year,      // 개봉 연도
        String genre,  // 장르
        String reason  // 추천 이유
) {}
```

### 4. 컨트롤러 및 JSP 화면 연동
* **[MainController.java](file:///C:/workspace/springai/src/main/java/org/example/springai/controller/MainController.java)**:
  * 사용자의 질문 메시지와 선택한 AI 제공사(`ModelProvider`)를 `ChatDTO`로 바인딩받아 `ChatService.recommend()`를 실행합니다.
  * 가져온 결과 객체(`MovieRecommendationDTO`)와 API 호출 메타데이터(토큰 정보 등)를 세션에 포맷팅하여 저장 후 redirect합니다.
* **[index.jsp](file:///C:/workspace/springai/src/main/webapp/WEB-INF/views/index.jsp)**:
  * 화면 상에서 사용자의 질문과 Provider를 입력받는 간단한 폼 인터페이스를 제공합니다.
  * AI가 반환한 답변 문자열 및 마크다운 형식을 브라우저 단에서 `marked.min.js`를 사용해 깨끗하게 렌더링하여 사용자에게 보여줍니다.

---

## 🏃 실행 및 테스트 방법
1. 로컬 환경에 맞게 `GROQ_API_KEY`, `GEMINI_API_KEY`, `NIM_API_KEY`를 획득합니다.
2. 루트 디렉토리에 `.env.dev` 파일을 생성하고 획득한 키 정보를 작성합니다.
3. 프로젝트를 구동합니다:
   ```bash
   mvnw spring-boot:run
   ```
4. 브라우저에서 `http://localhost:8080`에 접속하여 원하시는 키워드(예: "행복", "SF")를 입력하고 원하는 Provider를 선택한 뒤 영화 추천 테스트를 진행합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/springai/controller/MainController.java](<../../springai/src/main/java/org/example/springai/controller/MainController.java>) · [src/main/java/org/example/springai/SpringaiApplication.java](<../../springai/src/main/java/org/example/springai/SpringaiApplication.java>) · [src/main/java/org/example/springai/service/ChatService.java](<../../springai/src/main/java/org/example/springai/service/ChatService.java>)

### AI 서비스의 입력·호출·출력 책임

ChatModel은 모델 통신 계약을, ChatClient는 프롬프트 구성과 호출을 편하게 연결하는 계층을 제공한다. 컨트롤러가 제공자 세부 설정까지 다루기보다 서비스에 입력을 넘기고 앱에 맞는 결과를 받으면 제공자 변경 영향을 줄일 수 있다.

**예시로 이해하기:** 영화 추천이라면 사용자 조건 → 추천 서비스 → 모델 응답 → 화면 DTO 순서로 읽는다. 제공자가 호환 API를 제공하더라도 지원 모델·옵션·구조화 출력까지 모두 같다고 가정하지 않는다. 교안 예제의 제공자 설정은 프로젝트에 선언된 의존성과 대조한다.

근거: 331-1 Spring AI 기초 — [32쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=32>) · [33쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=33>) · [36쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=36>) · [37쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=37>) · [41쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=41>)

### 구조화 출력과 대화 메모리는 별도 문제

구조화 출력은 모델 응답을 앱에서 다루기 쉬운 타입으로 변환하는 과정이다. JSON으로 파싱되었다고 내용까지 맞는 것은 아니므로 필수 값과 범위를 검증해야 한다. 대화 메모리는 이전 메시지를 다시 실어 보내며 conversationId로 대화를 구분한다.

**예시로 이해하기:** 일정 결과의 날짜·장소 필드가 존재해도 실제로 가능한 일정인지는 별도 검증 대상이다. 대화 ID를 받는 API는 그 ID가 현재 사용자의 것인지 확인해야 한다. 메모리 저장소에 기록했다는 사실과 모델 요청에 이력이 포함되었다는 사실도 구분한다.

근거: 331-2 Spring AI 활용 — [11쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=11>) · [13쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=13>) · [27쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=27>) · [29쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=29>) · [33쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=33>)

<!-- pdf-til-supplement:end -->
