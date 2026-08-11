# 🎨 Cloudflare Workers AI & Supabase 이미지 생성 프로젝트 (Imagegen)

이 프로젝트는 Spring Boot를 기반으로 하여 사용자가 한글로 프롬프트를 입력하면, LLM을 통해 프롬프트를 영문으로 최적화(번역/개선)한 뒤 Cloudflare Workers AI를 통해 이미지를 생성하고, 생성된 이미지를 Supabase S3 스토리지에 업로드하고 메타데이터를 Supabase PostgreSQL 데이터베이스에 저장하는 실습 예제 프로젝트입니다.

---

## 🏛️ 서비스 아키텍처 및 이미지 생성 워크플로우

생성 프로세스는 다음과 같은 흐름으로 진행됩니다:

```mermaid
sequenceDiagram
    actor User as 사용자
    participant Controller as [ImageGenController]
    participant Service as [ImageGenService]
    participant LLM as Groq LLM (Spring AI)
    participant CF as Cloudflare Workers AI (Flux)
    participant S3 as Supabase S3 Storage
    participant DB as Supabase PostgreSQL

    User->>Controller: 한글 프롬프트 입력 및 요청 (POST /gen)
    Controller->>Service: generateImage(prompt) 호출
    Service->>LLM: improvePrompt(prompt) 호출 (영문 최적화 요청)
    LLM-->>Service: 영문으로 번역 및 개선된 프롬프트 반환
    Service->>CF: invokeImage(improvedPrompt) 호출 (flux-1-schnell)
    CF-->>Service: Base64로 인코딩된 이미지 데이터 반환
    Service->>S3: Base64 디코딩 후 S3 업로드 (S3Template.upload)
    S3-->>Service: 저장된 S3 객체 key (filename) 반환
    Service->>DB: 생성 내역 DB 저장 (filename, prompt, improved)
    Service-->>Controller: ImageResultDTO 반환
    Controller-->>User: 리다이렉트 및 이미지 조회 화면 렌더링
```

---

## 🚀 주요 기능 및 핵심 컴포넌트

### 1. 프롬프트 최적화 (Groq LLM 연동)
* **목적:** 사용자가 입력한 한국어 프롬프트를 이미지 생성 모델이 이해하기 쉬운 500자 이내의 영어 프롬프트로 변환 및 개선합니다.
* **설정 클래스:** [ImageGenConfig.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/config/ImageGenConfig.java)
  * `ChatModel`을 커스텀하여 `promptImproveClient` 빈(Bean)을 정의하고 시스템 프롬프트 및 파라미터(`temperature(0.3)`)를 구성하였습니다.
* **비즈니스 로직:** [ImageGenService.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/service/ImageGenService.java)의 `improvePrompt()` 메소드에서 번역을 처리합니다.

### 2. 이미지 생성 (Cloudflare Workers AI flux-1-schnell)
* **목적:** 번역 및 최적화된 영어 프롬프트를 기반으로 고품질 이미지를 생성합니다.
* **비즈니스 로직:** [ImageGenService.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/service/ImageGenService.java)의 `invokeImage()` 메소드
  * `RestClient`를 통해 Cloudflare의 AI API(`@cf/black-forest-labs/flux-1-schnell` 모델)를 호출하여 Base64 형태의 이미지 데이터를 획득합니다.
* **설정 클래스:** [ImageGenConfig.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/config/ImageGenConfig.java)의 `cfWorkersAiClient` 빈 등록 부분에서 API 호출 제한 시간(Connection 5초, Read 60초) 및 Bearer Token 인증 헤더 등을 설정하였습니다.

### 3. 이미지 저장 및 조회 (Supabase S3 Storage)
* **목적:** 생성된 Base64 이미지를 저장하기에 영구적이고 가벼운 Supabase S3 스토리지에 업로드하고 다운로드합니다.
* **비즈니스 로직:** [ImageGenService.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/service/ImageGenService.java)의 `upload()` 및 `download()` 메소드
  * Spring Cloud AWS의 `S3Template`을 활용하여 S3 Bucket에 고유한 UUID를 파일명으로 하여 저장합니다.
* **다운로드 엔드포인트:** [ImageGenController.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/controller/ImageGenController.java)의 `/gen/{filename}` GET API를 통해 사용자의 브라우저에 S3로부터 다운로드받은 원본 이미지 스트림을 전송합니다.

### 4. 생성 내역 저장 (JPA & Supabase PostgreSQL)
* **목적:** 사용자가 이전에 생성한 이미지와 프롬프트 이력을 데이터베이스에 영구 보존하여 화면에 그리드 형식으로 보여줍니다.
* **엔티티:** [GenImage.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/entity/GenImage.java)
  * `id`, `filename` (S3 key), `prompt` (사용자 입력 한글 프롬프트), `improved` (최적화된 영어 프롬프트) 필드를 정의했습니다.
* **레포지토리:** [GenImageJpaRepository.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/repository/GenImageJpaRepository.java)

### 5. 사용자 화면 (Thymeleaf MVC)
* **컨트롤러:** [ImageGenController.java](file:///C:/workspace/imagegen/src/main/java/org/example/imagegen/controller/ImageGenController.java)
  * 사용자의 입력 데이터를 검증(`@NotBlank`, `@Size(max = 500)`)하고 에러 처리 및 결과 바인딩을 리다이렉트 시 플래시 어트리뷰트(`RedirectAttributes`)를 활용해 구현했습니다.
* **화면 템플릿:** [page.html](file:///C:/workspace/imagegen/src/main/resources/templates/gen/page.html)
  * 타임리프를 이용해 이미지 생성 폼 작성 및 이전 생성 이력 리스트를 썸네일과 함께 그리드로 출력합니다.

---

## ⚙️ 설정 정보 및 실행 방법

### 1. 환경 변수 구성
로컬 개발 환경에서는 프로젝트 루트 경로에 위치한 [.env.dev.sample](file:///C:/workspace/imagegen/.env.dev.sample) 파일을 복사하여 `.env.dev` 파일을 생성한 후 실제 키 값들로 채워 넣어야 합니다.

```properties
# Supabase DB
DB_HOST=aws-0-ap-northeast-2.pooler.supabase.com
DB_NAME=postgres
DB_USERNAME=postgres.******
DB_PASSWORD=******

# Groq API
GROQ_API_KEY=gsk_******

# Cloudflare Workers AI
CF_ACCOUNT_ID=******
CF_API_TOKEN=************

# Supabase S3 Storage
STORAGE_ENDPOINT=https://******.storage.supabase.co/storage/v1/s3
STORAGE_REGION=ap-northeast-2
STORAGE_ACCESS_KEY=******
STORAGE_SECRET_KEY=************
STORAGE_BUCKET=gen
```

### 2. 빌드 정보 ([build.gradle](file:///C:/workspace/imagegen/build.gradle))
* **Java Version:** 17
* **Framework:** Spring Boot 4.1.0
* **주요 의존성:**
  * Spring AI (`spring-ai-starter-model-openai` - Groq API 연동용)
  * Spring Cloud AWS (`spring-cloud-aws-starter-s3` - Supabase S3 연동용)
  * Spring Boot Starter (Data JPA, Web, Thymeleaf, Validation)
  * PostgreSQL JDBC Driver
  * Lombok

### 3. 활성화 프로필 ([application.yaml](file:///C:/workspace/imagegen/src/main/resources/application.yaml))
* `dev`, `ai`, `file`, `db` 프로필이 함께 활성화되어 작동합니다.
* `dev` 프로필이 활성화되면 루트 경로의 `.env.dev` 환경 변수 속성 파일이 자동으로 import됩니다.
```yaml
spring:
  profiles:
    active: dev,ai,file,db
```

---

> [!NOTE]
> 이 프로젝트는 Spring Boot의 최신 프로필 연동 기법 및 Spring AI 2.0.0 버전, 최신 Spring Cloud AWS 4.1.0을 결합한 클라우드 네이티브 웹 애플리케이션의 훌륭한 실습 템플릿입니다.
