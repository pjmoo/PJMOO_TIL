# 🚀 Spring AI RAG (Retrieval-Augmented Generation) 실습 프로젝트

이 프로젝트는 **Spring Boot**와 **Spring AI** 라이브러리를 활용하여 최신 LLM(대형 언어 모델) 및 벡터 데이터베이스를 연동하고, **RAG(검색 증강 생성)** 서비스를 구축하는 실습 프로젝트입니다.

---

## 💡 RAG(검색 증강 생성)란 무엇인가요?

일반적인 AI(예: GPT, Gemini 등)는 학습 데이터에 포함되지 않은 정보(우리 회사 내부 문서, 실시간 뉴스 등)에 대해 물어보면 올바른 답변을 하지 못하거나 거짓말(환각 현상, Hallucination)을 하게 됩니다.

**RAG(Retrieval-Augmented Generation)**는 이 문제를 해결하기 위해 다음과 같은 단계를 거칩니다:
1. **검색(Retrieval)**: 사용자가 질문을 하면, 데이터베이스(벡터 DB)에서 질문과 관련된 정보가 담긴 문서를 찾습니다.
2. **증강(Augmented)**: 찾아낸 관련 문서를 사용자의 질문과 합쳐서 AI에게 전달합니다.
3. **생성(Generation)**: AI는 제공받은 참고 문서 내용을 기반으로 하여 거짓말하지 않고 정확한 답변을 생성합니다.

---

## 🛠️ 오늘 실습한 핵심 기능 및 파일 요약

초보자분들의 이해를 돕기 위해 실습 파일별 역할과 이론을 정리했습니다.

### 1. 🔍 텍스트 임베딩 (Embedding)
* **개념**: 컴퓨터는 인간의 언어를 직접 이해하지 못합니다. **임베딩(Embedding)**은 단어나 문장을 3차원 공간 속의 특정 좌표(숫자 배열, Vector)로 변환해 주는 기술입니다. 의미가 비슷한 문장일수록 좌표 공간에서 거리가 가까워집니다.
* **관련 파일**:
  * [`EmbeddingService.java`](src/main/java/org/example/rag/service/EmbeddingService.java): Google의 `gemini-embedding-001` 모델을 사용하여 사용자가 입력한 텍스트를 벡터 좌표값(float 배열)으로 변환해 주는 서비스입니다.

### 2. 🗄️ 벡터 데이터베이스와 유사도 검색 (Vector Database & Similarity Search)
* **개념**: 텍스트를 숫자로 나타낸 벡터 데이터를 저장하고 빠르게 찾아낼 수 있는 전용 데이터베이스입니다. 본 실습에서는 PostgreSQL의 `pgvector` 확장을 사용했습니다.
* **관련 파일**:
  * [`DocumentService.java`](src/main/java/org/example/rag/service/DocumentService.java) (`save`, `search` 메서드):
    * **`save`**: 입력받은 텍스트 문서와 카테고리 메타데이터를 함께 벡터 데이터베이스에 저장합니다. (저장할 때 자동으로 임베딩을 수행합니다.)
    * **`search`**: 사용자 질문(Query)과 벡터 데이터베이스에 들어있는 문서들의 유사도(코사인 유사도 등)를 계산하여, 가장 연관성이 높은 문서 `topK(최대 4개)`를 뽑아옵니다. 최소 유사도 임계치(`similarityThreshold`)를 설정하여 관련 없는 문서는 걸러냅니다.

### 3. ⚙️ 문서 적재 ETL 파이프라인 (Chunking & Ingest)
* **개념**: 책 한 권이나 긴 문서를 한 번에 AI에게 주면 요금이 많이 나오고 집중력이 흐려집니다. 그래서 문서를 적절한 크기(Chunk Size)로 잘게 쪼개는 **청킹(Chunking)** 과정이 필요합니다. 
* **관련 파일**:
  * [`DocumentService.java`](src/main/java/org/example/rag/service/DocumentService.java) (`ingest` 메서드):
    * **Extract (추출)**: `TextReader`를 이용하여 `sample.txt` 파일 내용을 읽어옵니다.
    * **Transform (변환/청킹)**: `TokenTextSplitter`를 사용해 사용자가 지정한 크기(예: 200토큰 또는 1000토큰)만큼 텍스트를 쪼갭니다. 이 때 중복 저장을 방지하기 위해 텍스트 내용을 해싱하여 고유한 UUID를 발급합니다.
    * **Load (적재)**: 쪼개진 여러 개의 문서 조각(Chunk)들을 벡터 데이터베이스에 한 번에 저장합니다.
  * [`sample.txt`](src/main/resources/docs/sample.txt): RAG 테스트를 위해 미리 작성해 둔 코딩 팁, 프로그래밍 가이드 등의 원본 문서 파일입니다.

### 4. 💬 RAG 기반 카테고리 필터링 채팅 (RAG Chat & Filter)
* **개념**: 사용자의 질문에 대답할 때 관련 문서를 데이터베이스에서 자동으로 찾아와 참고 답변을 생성합니다. 또한 메타데이터 필터(예: `category == 'java'`)를 적용하여 특정 주제의 문서들만 집중적으로 참고하도록 제한할 수 있습니다.
* **관련 파일**:
  * [`RagConfig.java`](src/main/java/org/example/rag/config/RagConfig.java):
    * `ChatClient`를 설정하는 곳입니다.
    * **System Prompt**: AI에게 "주어진 컨텍스트 내에서만 대답하고, 모르는 내용은 찾을 수 없다고 답변하라"는 페르소나와 규칙을 설정합니다.
    * **QuestionAnswerAdvisor**: 질문이 오면 자동으로 벡터 DB에서 관련 문서를 검색해 질문과 함께 LLM에 덧붙여 주는 RAG 핵심 컴포넌트(Advisor)를 연결합니다.
  * [`DocumentService.java`](src/main/java/org/example/rag/service/DocumentService.java) (`chat` 메서드):
    * `FILTER_EXPRESSION` 매개변수를 활용하여 사용자가 원하는 특정 카테고리의 정보만 필터링해서 참고 문서로 사용하도록 필터 기능을 구현했습니다.

### 5. 🖥️ 웹 인터페이스 및 설정 파일
* **관련 파일**:
  * [`MainController.java`](src/main/java/org/example/rag/controller/MainController.java): 프론트엔드 폼 전송 요청을 받아 적절한 서비스(임베딩, 적재, 검색, 채팅)로 전달해 주는 컨트롤러입니다.
  * [`index.jsp`](src/main/webapp/WEB-INF/views/index.jsp): 사용자가 직접 텍스트 임베딩, 문서 주입(Chunk 200/1000), 데이터 입력, 유사도 검색, RAG 채팅을 직관적으로 테스트할 수 있는 웹 UI 페이지입니다. 마크다운 형식의 AI 답변을 깔끔하게 보여주기 위해 `marked.js`가 내장되어 있습니다.
  * [`application-dev.properties`](src/main/resources/application-dev.properties) & [`.env.dev.sample`](.env.dev.sample): Neon PostgreSQL 데이터베이스 접속 정보, Groq 및 Gemini API 키 등 중요 환경 변수를 주입하는 설정 파일입니다.
  * [`lombok.config`](lombok.config): 스프링 환경에서 의존성 주입 시 `@RequiredArgsConstructor`를 사용할 때 롬복이 `@Qualifier` 어노테이션까지 같이 전파할 수 있도록 돕는 세부 설정 파일입니다.

---

## 🏃‍♂️ 실행 방법 (로컬 환경)

1. **환경 변수 복사**: 
   `.env.dev.sample` 파일을 복사하여 `.env.dev` 파일을 생성합니다.
2. **API 키 설정**:
   생성한 `.env.dev` 파일 내부의 데이터베이스 호스트, 비밀번호 및 사용하실 API Key(Gemini, Groq 등) 정보를 실제 정보로 기입합니다. (이 파일은 `.gitignore`에 등록되어 외부로 노출되지 않습니다.)
3. **애플리케이션 실행**:
   `mvnw spring-boot:run` 또는 개발 IDE에서 `RagApplication`을 실행합니다.
4. **브라우저 접속**:
   `http://localhost:8080` 으로 접속하여 직접 문서를 적재하고 RAG 채팅을 테스트해 봅니다!
