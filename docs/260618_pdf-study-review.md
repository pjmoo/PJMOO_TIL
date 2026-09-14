# 학습 정리 (5/27 ~ 6/18)

## 전체 흐름

에이전틱 코딩 환경을 구성한 뒤, 프런트엔드 JavaScript의 DOM·이벤트·브라우저 API와 비동기 통신을 학습했다. 이후 Supabase와 생성형 AI API, LangChain으로 웹앱의 백엔드/AI 연동 방식을 익히고, 6월 16일부터 Java 백엔드 개발 환경과 기초 문법으로 전환했다.

| 날짜 | 주제 | 핵심 산출/확인 포인트 |
| --- | --- | --- |
| 5/27 | Agentic Coding Environment | OpenCode와 외부 LLM(NIM) 연동 |
| 5/27 | Harness Engineering | `AGENTS.md`, `SKILLS.md`, `DESIGN.md`, MCP 구성 |
| 5/27~28 | DOM | 선택·생성·수정·삭제 및 XSS 안전성 |
| 5/28 | Event / BOM | 이벤트 처리, 브라우저 API·저장소·히스토리 |
| 5/29 | Callback / Promise | 비동기 실행 구조와 오류 처리 |
| 6/1 | Fetch | HTTP, REST, AJAX, Fetch API |
| 6/2 | Supabase | BaaS, RLS, CRUD, 스토리지 |
| 6/4 | 생성형 AI 웹앱 | 서버 래핑, 키 보안, CORS, 배포 |
| 6/5 | LangChain과 에이전트 | 체인·파서·메모리·폴백·라우팅 |
| 6/16 | Java 환경 / 개발자 회고 | JDK·IDE 설정, 회고 작성법 |
| 6/17~18 | Java 문법 / 흐름제어·컬렉션 | 타입, 입력, 조건·반복, 배열·컬렉션 |

---

## 5월 27일 — 에이전틱 코딩 환경

### 151-1. Agentic Coding Environment

- 특정 회사나 모델에 종속되지 않고, 비용·성능·보안 요구에 맞춰 LLM을 교체하는 **에이전틱 유연성**이 핵심이다.
- OpenCode CLI를 로컬 터미널에서 실행하고, NIM API Key를 연동해 Nemotron 3 Super 같은 외부 모델을 사용할 수 있다.
- 무료 모델은 사용량 제한이 있을 수 있으므로 한도와 모델별 성능을 비교한다.
- 프롬프트·API Key·프로젝트의 민감정보는 외부 모델에 전달하지 않도록 주의한다.

### 151-2. Harness Engineering

- 하네스 엔지니어링은 AI 코딩 에이전트가 저장소의 맥락과 규칙을 지키도록 문서·도구·디자인 기준을 제공하는 방식이다.
- `AGENTS.md`: 프로젝트 구조, 실행/검증 방법, 작업 규칙을 전달한다.
- `SKILLS.md`: 사용할 외부 도구와 스킬의 목적·호출 방법을 명세한다.
- `DESIGN.md`: UI/UX의 톤, 컴포넌트, 레이아웃 기준을 고정한다.
- MCP는 클라이언트(에이전트)가 서버(외부 도구·데이터)와 표준 방식으로 연결하는 구조다.

---

## 5월 27~28일 — DOM, 이벤트, 브라우저

### 161-1. Document Object Model

- DOM은 브라우저가 HTML을 파싱해 만든 객체 트리이며, 시작점은 `document`다.
- 요소 탐색: `querySelector()`는 첫 요소, `querySelectorAll()`은 모든 일치 요소를 찾는다.
- 안전한 동적 UI 생성은 `createElement()` → `textContent` → `append()`/`prepend()` 흐름으로 한다.
- 상태·속성 변경에는 `classList`, `setAttribute`, `dataset`을 사용하고, 제거에는 `element.remove()`를 사용한다.
- 사용자 입력을 `innerHTML`에 바로 넣으면 XSS 위험이 있으므로 텍스트는 `textContent`로 넣는다.

```js
const item = document.createElement('li');
item.textContent = userInput;
item.dataset.id = String(id);
list.append(item);
```

### 161-2. Event

- 이벤트는 클릭·입력·폼 전송 같은 사용자 행동 또는 문서 로딩 같은 시스템 변화 신호다.
- 인라인 이벤트 속성은 HTML과 JS를 섞고, DOM 프로퍼티 방식은 핸들러가 하나만 유지되는 한계가 있다.
- 여러 핸들러는 `addEventListener()`로 등록한다.
- 주요 시점: `DOMContentLoaded`(DOM 구성 완료), `click`, `submit`, `input`, `change`, `focus`, `blur`.
- 폼의 기본 새로고침 전송을 막을 때는 `event.preventDefault()`를 호출한다.

### 162. Browser Object Model

- BOM은 브라우저 창과 실행 환경을 제어하는 API이며, DOM은 문서 자체를 다룬다.
- 브라우저에서는 `window`가 전역 객체다. 타이머는 `setTimeout`, `setInterval`로 등록하고 필요 시 해제한다.
- `localStorage`는 브라우저를 닫아도 남고, `sessionStorage`는 현재 탭 세션에 한정된다.
- Clipboard API는 비동기이며 보안 컨텍스트·사용자 동작 등의 제약을 받는다.
- URL은 `scheme`, `host`, `port`, `path`, `query`, `fragment`으로 구성된다.
- History API의 `back`, `forward`, `pushState`와 `popstate`로 페이지 이동 상태를 다룬다.

---

## 5월 29일~6월 1일 — JavaScript 비동기 통신

### 162-1. Callback

- JavaScript는 싱글 스레드이므로 오래 걸리는 작업은 비동기로 요청해 화면·입력이 멈추지 않게 한다.
- 실행 순서에는 Call Stack, Web APIs, Task Queue, Event Loop가 협력한다.
- 콜백이 중첩되면 읽기 어렵고 오류 처리가 분산되는 **콜백 헬** 문제가 생긴다.
- 타이머는 ID를 저장한 뒤 `clearTimeout()`/`clearInterval()`로 정리할 수 있다.

### 162-2. Promise

- Promise 상태는 `pending` → `fulfilled` 또는 `rejected`로 한 번만 전이한다.
- `.then()`으로 성공 흐름을 연결하고, `.catch()`에서 오류를 모아 처리하며, `.finally()`는 성공·실패와 관계없이 실행한다.
- Promise 후속 작업은 Microtask Queue에 들어가 일반 Task Queue보다 먼저 처리된다.
- 병렬 요청 선택 기준: 모두 성공해야 하면 `Promise.all`, 결과를 전부 받고 싶으면 `allSettled`, 가장 먼저 끝난 결과는 `race`, 첫 성공 결과는 `any`를 쓴다.
- `async`/`await`는 Promise 기반 코드를 위에서 아래로 읽히게 만들며, 오류는 `try/catch`로 처리한다.

### 163-1. Fetch

- API는 시스템 간 데이터 송수신을 위한 약속된 인터페이스다. OpenAPI(명세)와 Open API(공개 서비스)는 구분한다.
- HTTP 요청/응답은 메서드, URL, 헤더, 본문, 상태 코드로 이해한다.
- REST에서는 자원을 URI로 표현하고 CRUD를 보통 `POST`/`GET`/`PATCH` 또는 `PUT`/`DELETE`에 대응한다.
- `fetch()`는 응답 헤더를 받는 Promise와 본문을 파싱하는 Promise, 두 단계를 거친다. HTTP 4xx/5xx는 자동 예외가 아니므로 `response.ok`를 검사한다.

```js
async function loadUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

---

## 6월 2~5일 — BaaS와 생성형 AI 웹앱

### 163-2. Supabase

- Supabase는 PostgreSQL을 기반으로 DB, 인증, 스토리지, 실시간 기능을 제공하는 오픈소스 BaaS다.
- 테이블을 만들면 REST API를 활용할 수 있고, SDK 체이닝으로 CRUD와 파일 업로드를 처리할 수 있다.
- 클라이언트에 공개 가능한 Anon Key만 사용하며, 실제 데이터 접근 권한은 RLS(Row Level Security) 정책으로 제한한다.
- 키를 숨기는 것만으로 보안을 끝내지 말고, 테이블별 읽기·쓰기 정책을 반드시 검증한다.

### 171-1. 생성형 AI 활용 웹앱 개발

- AI 활용은 학습/운영 보조, 에이전트 기반 코드 작업, API 기반 앱 기능 통합으로 나눌 수 있다.
- Provider, API Key, Token, Rate Limit와 대표 오류 코드를 이해한다.
- 프런트엔드에 비밀 API Key를 넣으면 노출되므로, 서버가 AI API를 호출하는 **서버 래핑 구조**를 사용한다.
- Express 서버가 브라우저와 AI Provider 사이에서 인증·입력 검증·요청 중계를 담당한다.
- SOP, Origin, CORS의 차이를 이해하고 Render 등의 환경 변수에 키를 저장해 배포한다.

### 172. LangChain과 에이전트 개발

- LangChain/LangChainJS는 프롬프트, 모델, 파서, 메모리 같은 LLM 앱 구성 요소를 연결하는 오케스트레이션 도구다.
- 프롬프트 템플릿과 실행 파라미터를 분리하고, LCEL 체인을 `.invoke()`로 실행한다.
- 출력은 문자열 파서 또는 JSON/구조화 파서로 검증 가능한 형식으로 받는다.
- `ChatMessageHistory`로 대화 문맥을 관리하며, 폴백으로 모델/API 장애에 대비한다.
- LLM은 텍스트 생성 모델이고, 에이전트는 목표에 따라 모델·도구·라우팅을 선택해 작업 흐름을 수행하는 상위 구조다.

---

## 6월 16일 — Java 시작과 회고

### 201. 자바 백엔드 개발 환경 구축

- Java 17 이상과 IntelliJ IDEA를 기준으로 개발 환경을 통일한다.
- IDE는 편집기, 컴파일러, 디버거, 정적 분석을 묶어 개발 흐름을 단축한다.
- IntelliJ는 JVM 생태계에 맞춘 정적 분석·자동완성·리팩터링이 강점이다.
- 자주 쓰는 단축키, 포맷터, 코드 검사와 필요한 플러그인을 초기에 설정한다.

### 202. 취업 목적의 개발자 회고 작성법

- 회고는 잘한 점의 나열보다 문제 → 원인 → 시도 → 결과 → 다음 액션을 남기는 기록이다.
- 팀 회고에서는 해결책을 계속할지(Repeat), 새 방식을 도입할지(New) 결정한다.
- 개인 회고는 실수 재발 방지와 과정 설계 능력의 증명에 활용한다.
- 트러블슈팅·실패 사례도 사후 분석으로 구체적으로 기록하면 문제 해결력과 협업 태도를 보여 줄 수 있다.

회고 템플릿:

```text
상황: 어떤 목표/문제가 있었나?
원인: 무엇이 왜 예상과 달랐나?
시도: 어떤 가설로 무엇을 했나?
결과: 수치·로그·사용자 반응 등으로 무엇을 확인했나?
다음 행동: 유지할 것(Repeat)과 바꿀 것(New)은 무엇인가?
```

---

## 6월 17~18일 — Java 문법, 흐름제어와 컬렉션

### 211-1. Java 문법

- Java는 컴파일 시 타입을 검사하는 정적 타입 언어이고, JavaScript는 실행 시점에 타입이 정해지는 동적 타입 언어다.
- 클래스는 PascalCase, 변수·메서드는 camelCase, 상수는 `UPPER_SNAKE_CASE`를 쓴다.
- 표준 진입점은 `public static void main(String[] args)`다.
- `Scanner`로 숫자를 읽은 뒤 문자열을 읽을 때 남은 개행을 `nextLine()`으로 한 번 소비한다.
- 원시 타입은 `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`이며 값 자체를 다룬다. 배열·객체·문자열 등 참조 타입은 객체의 참조를 다룬다.
- `==`는 원시 값 또는 참조 주소를 비교하고, 문자열·객체의 내용 비교는 `.equals()`를 사용한다.
- 자동 형변환은 더 넓은 범위로, 강제 형변환은 손실 가능성을 인지한 채 명시적으로 한다. 문자열 수치는 `Integer.parseInt()` 등으로 변환한다.

### 211-2. 흐름제어와 컬렉션

- Java 조건식에는 반드시 `boolean` 값이 와야 하며 JavaScript식 truthy/falsy는 사용할 수 없다.
- `switch` 표현식은 `->` 문법으로 분기하고 값을 반환할 수 있다.
- `break`는 반복/분기를 종료하고, `continue`는 현재 반복만 건너뛴다.
- 배열은 단일 타입만 저장하고 크기가 고정된다. 길이는 `.length`로 확인한다.
- 향상된 for문은 순회용이며 요소 자체를 교체하는 용도로는 적합하지 않다.
- 컬렉션은 제네릭으로 요소 타입을 제한한다: 순서 목록은 `ArrayList`, 키-값은 `HashMap`, 중복 없는 집합은 `HashSet`을 쓴다.

```java
List<String> names = new ArrayList<>();
names.add("민지");

Map<String, Integer> scores = new HashMap<>();
scores.put("민지", 100);

for (String name : names) {
    System.out.println(name);
}
```

> 6/18의 `211-2_흐름제어와_컬렉션 (1).pdf`는 6/17의 같은 자료와 SHA-256 해시가 동일한 중복본이다. 내용 정리는 한 번만 반영했다.

---

## 우선 복습 순서

1. **Java 기초**: `Scanner`, 타입 변환, 문자열 비교, 조건문·반복문, 배열과 `ArrayList`를 직접 작성한다.
2. **비동기 통신**: `fetch` + `async/await` + `response.ok` 검사 패턴을 익힌다.
3. **브라우저 UI**: DOM 생성은 `textContent`, 이벤트는 `addEventListener` 중심으로 구현한다.
4. **보안**: 프런트엔드에 비밀 키를 두지 않고, Supabase는 RLS 정책과 함께 점검한다.
5. **AI 앱 구조**: 서버 래핑 → LLM 호출 → 구조화된 응답 파싱 → 오류/폴백 처리 순서로 설계한다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

### HTML 구조가 화면 변경으로 이어지는 과정

브라우저는 HTML을 읽어 DOM 객체 트리를 만든다. querySelector로 얻는 것은 HTML 문자열이 아니라 현재 문서 안의 요소 참조이며, 찾지 못하면 null이다. classList로 상태를 바꾸면 표현 방식은 CSS가 담당하고, textContent로 값을 넣으면 문자열을 HTML 태그로 해석하지 않는다.

**예시로 이해하기:** 카드 목록을 만든다고 가정하면 데이터 배열 → createElement로 요소 생성 → textContent로 제목 지정 → 부모에 append 순서로 생각할 수 있다. 사용자 입력을 그대로 innerHTML에 넣는 방식은 피한다. HTML·CSS 실습에서는 먼저 정적인 구조를 이해한 뒤 이 과정을 동적 화면의 확장으로 읽는다.

근거: 161-1 Document Object Model — [4쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=4>) · [6쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=6>) · [14쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=18>)

### 콜백이 곧 비동기는 아니다

콜백은 다른 함수에 전달하는 함수라는 역할을 뜻한다. 배열 순회처럼 지금 호출할 수도 있고 타이머처럼 나중에 호출할 수도 있다. 비동기 콜백은 현재 호출 스택이 끝난 뒤 실행되므로 setTimeout의 지연이 0이어도 바로 다음 줄보다 먼저 실행되지 않는다.

**예시로 이해하기:** “시작 출력 → 0ms 타이머 등록 → 끝 출력”에서는 시작·끝이 먼저 보이고 타이머 출력이 나중에 나타난다. 타이머 등록을 감싼 try/catch는 나중에 실행되는 콜백 내부의 예외를 잡지 못하므로 실제 실패하는 실행 경로에서 처리해야 한다.

근거: 162-1 JavaScript Callback — [8쪽](<../../260629_ex/새 폴더/5-29/162-1_JavaScript_Callback.pdf#page=8>) · [9쪽](<../../260629_ex/새 폴더/5-29/162-1_JavaScript_Callback.pdf#page=9>) · [12쪽](<../../260629_ex/새 폴더/5-29/162-1_JavaScript_Callback.pdf#page=12>) · [21쪽](<../../260629_ex/새 폴더/5-29/162-1_JavaScript_Callback.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/5-29/162-1_JavaScript_Callback.pdf#page=26>)

### Promise로 결과와 실패를 연결하기

Promise는 아직 준비되지 않은 결과를 값처럼 전달하게 해 준다. then에서 다음 비동기 작업의 Promise를 반환해야 뒤 단계가 그 완료를 기다린다. async 함수는 Promise를 반환하며 await는 그 함수의 후속 실행을 늦추지만 브라우저 전체를 멈추지는 않는다.

**예시로 이해하기:** 프로필을 받은 뒤 그 ID로 게시글을 조회하는 작업은 순서가 필요하다. 서로 독립적인 여러 프로필은 Promise.all로 모을 수 있지만 하나가 실패하면 전체 결과가 거절된다. 각 작업의 성공·실패가 모두 필요하면 allSettled의 결과를 각각 확인한다.

근거: 162-2 JavaScript Promise — [6쪽](<../../260629_ex/새 폴더/5-29/162-2_JavaScript_Promise.pdf#page=6>) · [11쪽](<../../260629_ex/새 폴더/5-29/162-2_JavaScript_Promise.pdf#page=11>) · [14쪽](<../../260629_ex/새 폴더/5-29/162-2_JavaScript_Promise.pdf#page=14>) · [19쪽](<../../260629_ex/새 폴더/5-29/162-2_JavaScript_Promise.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/5-29/162-2_JavaScript_Promise.pdf#page=21>)

### HTTP 성공과 데이터 파싱 성공 구분하기

fetch의 첫 Promise는 Response를, response.json()의 Promise는 본문을 읽고 변환한 값을 제공한다. 서버가 404나 500을 응답해도 fetch 자체는 정상적으로 완료될 수 있으므로 response.ok 또는 status를 먼저 확인한다. 네트워크 실패, HTTP 오류, JSON 파싱 오류는 원인이 다르다.

**예시로 이해하기:** 목록 조회에서는 로딩 표시 → 응답 상태 확인 → JSON 변환 → 빈 목록 또는 카드 렌더링 순서로 분리한다. JSON 전송은 직렬화와 Content-Type을 맞추고, FormData 전송은 브라우저가 multipart boundary를 구성하도록 Content-Type을 직접 고정하지 않는다.

근거: 163-1 JavaScript Fetch — [11쪽](<../../260629_ex/새 폴더/6-1/163-1_JavaScript_Fetch.pdf#page=11>) · [12쪽](<../../260629_ex/새 폴더/6-1/163-1_JavaScript_Fetch.pdf#page=12>) · [23쪽](<../../260629_ex/새 폴더/6-1/163-1_JavaScript_Fetch.pdf#page=23>) · [25쪽](<../../260629_ex/새 폴더/6-1/163-1_JavaScript_Fetch.pdf#page=25>) · [28쪽](<../../260629_ex/새 폴더/6-1/163-1_JavaScript_Fetch.pdf#page=28>)

### 인증 정보와 행 접근 권한 연결하기

Supabase는 데이터베이스·인증·스토리지를 API로 제공한다. 브라우저에서 연결할 수 있다는 사실이 모든 행을 읽거나 수정해도 된다는 뜻은 아니다. 인증은 사용자를 식별하고 RLS는 그 사용자가 접근 가능한 행을 제한한다. 화면에서 수정 버튼을 숨기는 것만으로 데이터 접근을 막을 수는 없다.

**예시로 이해하기:** 게시글 수정에서는 현재 사용자와 작성자 ID의 관계를 정책에서 확인하는 흐름을 생각한다. 파일 업로드 권한과 게시글 행의 수정 권한도 별개다. 공개 클라이언트 키와 서버 전용 비밀키를 구분하고, DB 저장 실패 시 이미 업로드한 파일이 남는 경우까지 살펴본다.

근거: 163-2 Supabase — [5쪽](<../../260629_ex/새 폴더/6-2/163-2_Supabase.pdf#page=5>) · [6쪽](<../../260629_ex/새 폴더/6-2/163-2_Supabase.pdf#page=6>) · [11쪽](<../../260629_ex/새 폴더/6-2/163-2_Supabase.pdf#page=11>) · [17쪽](<../../260629_ex/새 폴더/6-2/163-2_Supabase.pdf#page=17>)

### 배운 내용을 재현 가능한 TIL로 남기기

TIL은 사용한 기술 이름을 나열하는 데서 한 걸음 더 나아가 문제, 선택한 방법, 관찰 결과를 연결하는 기록이다. “왜 이 방법을 썼는가”와 “어떤 입력에서 확인했는가”를 적어야 나중에 다른 상황에도 적용할 수 있다. 실행하지 않은 예상 결과는 실제로 관찰한 결과와 구분한다.

**예시로 이해하기:** 예를 들어 “비동기를 배웠다” 대신 “타이머가 마지막에 출력되는 이유를 예상하고 실행 순서를 비교했다”처럼 적는다. 코드 링크, 입력값, 실제 출력, 틀렸던 가설을 함께 남기고 PDF의 개념 설명은 그 관찰을 해석하는 근거로 연결한다.

근거: 202 취업 목적의 개발자 회고 작성법 — [5쪽](<../../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=5>) · [8쪽](<../../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=8>) · [10쪽](<../../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=10>) · [12쪽](<../../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=12>)

### 값·참조·비교 연산 이해하기

기본 타입 변수는 값을, 참조 타입 변수는 객체를 가리키는 참조 값을 담는다. 객체에 대한 ==는 같은 객체를 가리키는지 비교하고 equals는 해당 클래스가 정의한 동등성 규칙을 사용한다. String은 내용을 바꾸는 것처럼 보이는 연산도 새 문자열을 만들어 참조를 다시 대입할 수 있다.

**예시로 이해하기:** new String("java")로 만든 두 문자열은 내용은 같아도 서로 다른 객체다. 내용 비교에는 equals를 사용한다. final인 참조 변수는 다른 객체를 대입할 수 없지만, 그 객체 내부까지 항상 불변이 되는 것은 아니다.

근거: 211-1 Java 문법 — [24쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=24>) · [27쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=27>) · [30쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=30>) · [37쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=37>)

### 반복 범위와 자료구조의 계약

배열은 길이가 고정되어 있고 인덱스는 0부터 length-1까지다. List는 순서와 중복을, Set은 중복 제거를, Map은 키로 값을 찾는 관계를 표현한다. 자료구조 선택은 문법 취향보다 필요한 조회·추가·중복 처리 방식에 따라 결정한다.

**예시로 이해하기:** 이름이 여러 번 나오는 목록의 등장 횟수는 Map<이름, 횟수>로 표현할 수 있다. 순회 조건이 i <= length이면 마지막에 범위를 벗어나므로 i < length와 비교한다. 향상된 for문의 지역 변수에 값을 대입해도 기본 타입 배열의 원소가 자동 변경되지는 않는다.

근거: 211-2 흐름제어와 컬렉션 — [15쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=15>) · [17쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=17>) · [21쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=21>) · [23쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=23>) · [25쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=25>) · [27쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=27>)

<!-- pdf-til-supplement:end -->
