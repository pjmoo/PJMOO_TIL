# 🐶 FatDog AI

> 헥사고날(Hexagonal) / 클린(Clean) 아키텍처로 구성한 웹 기반 멀티-LLM 채팅 애플리케이션

브라우저에서 메시지와 AI 모델을 고르면, 서버가 여러 AI 제공자(Google Gemini · NVIDIA Nemotron · Groq) 중 하나에 물어보고 답을 화면에 돌려줍니다. "AI 챗봇"이라는 기능 자체보다 **어떻게 계층을 나누고 의존성을 관리하는가**를 학습하기 위한 프로젝트

---

## ✨ 주요 기능

- 🤖 **멀티 AI 제공자** — 하나의 `ChatProvider` 인터페이스로 Google Gemini(GenAI SDK), NVIDIA Nemotron(NIM API), Groq(REST API)를 다형적으로 처리
- 🔀 **모델별 전략 라우팅** — 선택한 모델 이름에 따라 런타임에 적절한 제공자를 선택 (`AIChatService`)
- 💬 **세션별 대화 이력** — `HttpSession` ID를 사용자 식별자로 사용해 대화방을 구분하고 맥락(history)을 함께 전달
- 🧹 **응답 후처리** — Groq 응답에서 사고 과정/영어 마커를 제거하고 한글 최종 답변만 추출(`GroqChatProvider.getFinalAnswer`)
- 🧱 **포트 & 어댑터 설계** — 저장소·AI 제공자를 인터페이스 뒤에 숨겨, 안쪽 계층 수정 없이 구현체 교체 가능

---

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|------|-----------|
| 언어 / 런타임 | Java 17 |
| 웹 | Jakarta Servlet 6.0, JSP + JSTL 3.0 |
| AI 연동 | Google GenAI SDK (`google-genai`), NVIDIA NIM · Groq REST API |
| JSON | Gson, Jackson Databind |
| 빌드 / 패키징 | Maven (WAR), `maven-war-plugin` |
| 테스트 | JUnit 5 |

> 서블릿 6.0 / JSP는 **Jakarta EE 10** 기준이므로 **Tomcat 10.1+** 등 Jakarta 네임스페이스를 지원하는 컨테이너가 필요합니다.

---

## 🏗️ 아키텍처

의존성은 항상 안쪽(도메인)을 향합니다:

```
presentation ──▶ inbound port ──▶ service ──▶ outbound port ◀── infrastructure
 (Controller)     (ChatUseCase)   (흐름 조율)   (Repository/Provider)   (실제 구현)
```

### 요청 처리 흐름

```
[브라우저]            [진입점]              [유스케이스]              [갈아끼울 부품]
 채팅 폼  ── POST /chat ─▶ ChatController ─▶ ChatUseCase.save() ─┬─▶ ChatRepository (저장/조회)
 화면    ◀─ GET /chat ──  chat.jsp  ◀── DTO 변환   (AIChatService)  │      (InMemoryChatRepository)
                                                                     └─▶ ChatProvider (AI 호출, 모델별 분기)
                                                                          ├ GenAIChatProvider (Gemini/Gemma)
                                                                          ├ NimChatProvider   (Nemotron)
                                                                          └ GroqChatProvider  (그 외)
```

핵심은 **`AIChatService`가 자기가 부르는 게 Gemini인지 Nemotron인지 Groq인지, 저장이 메모리인지 DB인지 모른다**는 점입니다. 전부 인터페이스(포트) 뒤에 숨겨져 있어(DIP), 구현체를 갈아끼워도 안쪽 코드는 바뀌지 않습니다.

> 현재 [`ChatController`](src/main/java/com/example/fatdogai/presentation/controller/ChatController.java)는 3-way 라우팅을 하는 `AIChatService`를 사용합니다. `GeminiChatService`는 Gemini↔Nemotron 2-way 버전으로 남아 있는 대체 구현입니다.

### 계층별 클래스 배치

| 계층 | 패키지 | 주요 클래스 | 역할 |
|------|--------|-------------|------|
| **Domain** | `domain/model` | [`Chat`](src/main/java/com/example/fatdogai/domain/model/Chat.java) | 채팅 1건을 담는 불변 값 객체(record) |
| **Application** | `application/port` | [`ChatUseCase`](src/main/java/com/example/fatdogai/application/port/ChatUseCase.java) (in) · [`ChatRepository`](src/main/java/com/example/fatdogai/application/port/ChatRepository.java) · [`ChatProvider`](src/main/java/com/example/fatdogai/application/port/ChatProvider.java) · [`ChatPublisher`](src/main/java/com/example/fatdogai/application/port/ChatPublisher.java) (out) | 계층 경계(인터페이스)만 정의 |
| | `application/service` | [`AIChatService`](src/main/java/com/example/fatdogai/application/service/AIChatService.java) (활성) · [`GeminiChatService`](src/main/java/com/example/fatdogai/application/service/GeminiChatService.java) | 유스케이스 구현 · 흐름 조율 |
| **Infrastructure** | `infrastructure/persistence` | [`InMemoryChatRepository`](src/main/java/com/example/fatdogai/infrastructure/persistence/InMemoryChatRepository.java) | 인메모리 저장 어댑터 |
| | `infrastructure/external` | [`GenAIChatProvider`](src/main/java/com/example/fatdogai/infrastructure/external/GenAIChatProvider.java) · [`GenAIConfig`](src/main/java/com/example/fatdogai/infrastructure/external/GenAIConfig.java) · [`NimChatProvider`](src/main/java/com/example/fatdogai/infrastructure/external/NimChatProvider.java) · [`GroqChatProvider`](src/main/java/com/example/fatdogai/infrastructure/external/GroqChatProvider.java) · [`GroqAIConfig`](src/main/java/com/example/fatdogai/infrastructure/external/GroqAIConfig.java) | 외부 AI API 어댑터 |
| **Presentation** | `presentation/controller` | [`ChatController`](src/main/java/com/example/fatdogai/presentation/controller/ChatController.java) · [`BaseController`](src/main/java/com/example/fatdogai/presentation/controller/BaseController.java) | `/chat` 서블릿 진입점 |
| | `presentation/dto` | [`ChatResponseDTO`](src/main/java/com/example/fatdogai/presentation/dto/ChatResponseDTO.java) | 화면 전용 DTO + 도메인→DTO 매퍼 |
| | `presentation/listener` | [`WebEnvListener`](src/main/java/com/example/fatdogai/presentation/listener/WebEnvListener.java) | 앱 시작 시 `.env` 로드 |

---

## 📁 프로젝트 구조

```
FatDogAI/
├── src/main/
│   ├── java/com/example/fatdogai/
│   │   ├── domain/model/Chat.java
│   │   ├── application/
│   │   │   ├── port/          # ChatUseCase, ChatRepository, ChatProvider, ChatPublisher
│   │   │   └── service/       # AIChatService(활성), GeminiChatService
│   │   ├── infrastructure/
│   │   │   ├── persistence/   # InMemoryChatRepository
│   │   │   └── external/      # GenAIChatProvider, GenAIConfig,
│   │   │                      #   NimChatProvider, GroqChatProvider, GroqAIConfig
│   │   └── presentation/
│   │       ├── controller/    # ChatController, BaseController
│   │       ├── dto/           # ChatResponseDTO
│   │       └── listener/      # WebEnvListener
│   └── webapp/WEB-INF/
│       ├── views/chat.jsp     # 채팅 화면 (HTML + CSS + JS)
│       └── web.xml
├── .env.sample               # 필요한 환경변수 양식
├── pom.xml
└── mvnw / mvnw.cmd            # Maven Wrapper
```

---

## 🚀 시작하기

### 사전 준비

- JDK 17
- Tomcat 10.1+ (또는 Jakarta EE 10 호환 서블릿 컨테이너)
- API 키
  - [Google AI Studio](https://aistudio.google.com/)의 `GEMINI_API_KEY`
  - [NVIDIA NIM](https://build.nvidia.com/)의 `NIM_API_KEY`
  - [Groq Console](https://console.groq.com/)의 `GROQ_API_KEY`

### 1) 환경변수 설정

`.env.sample`을 복사해 프로젝트 루트에 `.env`를 만들고 실제 키를 채웁니다.

```bash
cp .env.sample .env
```

```dotenv
# .env
GEMINI_API_KEY=your-gemini-api-key
NIM_API_KEY=your-nim-api-key
GROQ_API_KEY=your-groq-api-key
```

> 앱 시작 시 [`WebEnvListener`](src/main/java/com/example/fatdogai/presentation/listener/WebEnvListener.java)가 `.env`를 찾아 값을 시스템 프로퍼티로 로드합니다. `.env`는 `.gitignore`에 포함되어 커밋되지 않습니다.

### 2) 빌드

```bash
./mvnw clean package
```

`target/` 아래에 WAR 파일이 생성됩니다.

### 3) 실행

- **IDE(IntelliJ 등)**: Tomcat 10.1+ 런 구성에 이 모듈을 WAR(exploded)로 배포
- **직접 배포**: 생성된 WAR를 Tomcat의 `webapps/`에 복사 후 서버 기동

### 4) 접속

브라우저에서 컨텍스트 경로 뒤에 `/chat`을 붙여 접속합니다.

```
http://localhost:8080/<context-path>/chat
```

---

## 💬 사용법

1. 하단 입력창에 메시지를 입력합니다.
2. 드롭다운에서 AI 모델을 선택합니다. 모델 이름에 따라 제공자가 자동 결정됩니다.

   | 화면 표시 | 모델 값 | 라우팅 (`AIChatService`) |
   |-----------|---------|--------------------------|
   | gemma-4-26b | `gemma-4-26b-a4b-it` | Gemini (GenAI) — 이름에 `gemma` |
   | gemma-4-31b | `gemma-4-31b-it` | Gemini (GenAI) — 이름에 `gemma` |
   | gemini-3.1 | `gemini-3.1-flash-lite` | Gemini (GenAI) — 이름에 `gemini` |
   | 네모트론 3 | `nemotron-3-ultra-550b-a55b` | NVIDIA (NIM) — 이름에 `nemotron` |
   | Qwen 3.6 | `qwen/qwen3.6-27b` | Groq — 그 외 전부 |

3. **전송**을 누르면 같은 세션의 대화 이력을 맥락으로 함께 보내 답변을 받습니다.

> 라우팅 규칙: 모델명에 `gemini`/`gemma` → Gemini, `nemotron` → NVIDIA, **그 외 → Groq**. Groq 경로에서는 기본 모델(`openai/gpt-oss-20b`)과 시스템 지시를 사용하며, 응답의 사고 과정을 제거하고 한글 답변만 추출해 반환합니다.

---

## 🔌 새 AI 제공자 추가하기

이 아키텍처의 장점은 **AI를 갈아끼우기 쉽다**는 것입니다. 예를 들어 OpenAI를 추가한다면:

1. `infrastructure/external`에 `ChatProvider`를 구현하는 `OpenAIChatProvider` 작성
2. `AIChatService`의 라우팅 분기에 조건 추가 (또는 모델명→Provider 매핑 팩토리로 통일)

`ChatUseCase`, `ChatController`, `chat.jsp` 등 나머지 코드는 **한 줄도 바뀌지 않습니다.** 인메모리 저장소를 DB로 바꾸는 것도 `ChatRepository`를 구현하는 새 어댑터를 만들면 끝입니다.

---

## ⚠️ 알려진 제약 / 개선 예정

- **인메모리 저장** — 서버를 재시작하면 대화가 사라집니다. 실사용 시 DB 어댑터로 교체 필요.
- **Groq 응답 후처리(`getFinalAnswer`)가 휴리스틱** — 줄 단위로 영어/마커를 지우고 한글만 남기는 방식이라, 답변이 영어이거나 형식이 다르면 잘려 나갈 수 있습니다.
- **`WebEnvListener`의 디버그 로그 경로가 하드코딩** — 윈도우 절대경로(`C:\workspace\...`)라 다른 OS에서는 로그 파일 기록이 조용히 실패합니다(앱 동작에는 영향 없음).
- **JSP 출력 미이스케이프** — `${chat.message}` 직접 출력으로 XSS 여지가 있어 `<c:out>` 처리 권장.
- **`pom.xml`의 `junit-jupiter-api` 중복 선언** — 동일 의존성이 두 번 선언되어 있어 하나로 정리 필요. (`artifactId`/`name`은 `FatDogAI`로 정리 완료)

---
