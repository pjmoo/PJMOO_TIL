# 바닐라 자바스크립트 텍스트 분석 및 음성 합성(TTS) 질의응답 웹 💬🔊

순수 웹 언어(HTML/CSS/JS)를 사용해 만든 텍스트 분석 연습장으로, 텍스트 질문 데이터 수집과 브라우저 자체 음성 합성(TTS, Text-to-Speech) API를 연결하는 실습을 포함합니다.

---

## 📂 학습 파일 구성 (Files)

- [index.html](file:///C:/workspace/QandA/index.html) : 사용자 질문 입력 및 응답 텍스트가 노출되는 UI 문서
- [script.js](file:///C:/workspace/QandA/script.js) : 음성 합성 엔진을 트리거하고 질문 답변 데이터를 로드해 바인딩하는 스크립트
- [qa.md](file:///C:/workspace/QandA/qa.md) / [re.md](file:///C:/workspace/QandA/re.md) : 학습용 질문 답변 데이터 모음 문서
- [tts.txt](file:///C:/workspace/QandA/tts.txt) : TTS 작동 테스트를 위한 임시 텍스트 파일

---

## 🛠 배운 핵심 개념 (What We Learned)

- **웹 음성 API (Speech Synthesis)**: 별도의 클라우드 서버 없이 브라우저 내장 TTS 기능을 호출해 한글이나 영어를 말소리로 송출하는 방법을 이해합니다.
- **DOM 이벤트 바인딩**: 폼 제출 시 질문 내용을 분석해 화면 말풍선으로 업데이트하는 로직을 복습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. [index.html](file:///C:/workspace/QandA/index.html) 파일을 브라우저로 엽니다.
2. 텍스트를 입력하고 버튼을 눌러 음성 출력 및 텍스트 렌더링을 관찰합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [index.html](<../../EXex_EX/QandA/index.html>) · [script_explained.js](<../../EXex_EX/QandA/script_explained.js>) · [script.js](<../../EXex_EX/QandA/script.js>)

### HTML 구조가 화면 변경으로 이어지는 과정

브라우저는 HTML을 읽어 DOM 객체 트리를 만든다. querySelector로 얻는 것은 HTML 문자열이 아니라 현재 문서 안의 요소 참조이며, 찾지 못하면 null이다. classList로 상태를 바꾸면 표현 방식은 CSS가 담당하고, textContent로 값을 넣으면 문자열을 HTML 태그로 해석하지 않는다.

**예시로 이해하기:** 카드 목록을 만든다고 가정하면 데이터 배열 → createElement로 요소 생성 → textContent로 제목 지정 → 부모에 append 순서로 생각할 수 있다. 사용자 입력을 그대로 innerHTML에 넣는 방식은 피한다. HTML·CSS 실습에서는 먼저 정적인 구조를 이해한 뒤 이 과정을 동적 화면의 확장으로 읽는다.

근거: 161-1 Document Object Model — [4쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=4>) · [6쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=6>) · [14쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=18>)

### 이벤트 등록과 실행 시점 구분하기

이벤트 리스너 등록은 함수를 즉시 실행하는 일이 아니라 특정 사건이 발생했을 때 호출할 함수를 보관하는 일이다. addEventListener에 함수 호출 결과 대신 함수 자체를 전달한다. DOM이 준비되기 전에 요소를 찾으면 연결에 실패할 수 있으며, 리스너를 제거할 때는 등록 당시의 함수 참조와 캡처 설정이 맞아야 한다.

**예시로 이해하기:** 폼 저장은 버튼 click만 처리하기보다 form의 submit을 처리하면 Enter 제출도 같은 경로로 들어온다. 자바스크립트로 전송을 맡길 경우 preventDefault로 기본 제출을 막고 입력 검증 → 요청 → 결과 표시를 이어 간다.

근거: 161-2 Event — [13쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=13>) · [16쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=16>) · [19쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=21>) · [23쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=23>)

### 화면 상태와 브라우저 상태 분리하기

DOM은 문서 내용, BOM은 타이머·주소·저장소 등 브라우저 환경을 다룬다. localStorage와 sessionStorage는 문자열 저장소이므로 객체는 JSON으로 직렬화하고 다시 파싱해야 한다. 저장된 값이 없거나 손상되었을 때 기본값으로 돌아가는 경로도 필요하다.

**예시로 이해하기:** 메모 앱에서는 입력 상태를 저장하고 새로고침 후 복원하는 흐름을 따라가면 된다. 시계의 setInterval은 정확한 시각을 보장하는 시계 장치가 아니므로 표시할 때 현재 시간을 다시 읽는다. pushState는 주소 기록을 바꾸며, 그 주소에 맞는 화면 렌더링은 별도 코드가 맡는다.

근거: 162 Browser Object Model — [15쪽](<../../260629_ex/새 폴더/5-28/162_Browser_Object_Model.pdf#page=15>) · [24쪽](<../../260629_ex/새 폴더/5-28/162_Browser_Object_Model.pdf#page=24>) · [27쪽](<../../260629_ex/새 폴더/5-28/162_Browser_Object_Model.pdf#page=27>) · [43쪽](<../../260629_ex/새 폴더/5-28/162_Browser_Object_Model.pdf#page=43>) · [47쪽](<../../260629_ex/새 폴더/5-28/162_Browser_Object_Model.pdf#page=47>)

<!-- pdf-til-supplement:end -->
