# CSS 스타일 연습 - 여행 테마별 랜딩페이지 실습 🎨✈

동일한 정보 골격을 가진 여행 사이트를 바탕으로, 다채로운 CSS 색상 테마(다크모드, 힐링 네이처, 석양, 미니멀 등)와 폰트 디자인을 적용하여 웹 디자인 감각을 극대화하는 실습 프로젝트 공간입니다.

---

## 📂 학습 파일 구성 (Files)

- [hw2_ex/01_ex/](file:///C:/workspace/hw2_ex/hw2_ex/01_ex/) : 기본적인 반응형 정렬 방식을 테스트하는 기초 폴더
- [hw2_ex/02_ex/](file:///C:/workspace/hw2_ex/hw2_ex/02_ex/) : `luxury`, `minimal`, `nature`, `youthful` 등 테마별 CSS가 적용된 여러 버전의 여행 정보 페이지 모음

---

## 🛠 배운 핵심 개념 (What We Learned)

- **디자인 감각 트레이닝**: 동일한 마크업 구조에서 CSS 스타일시트만 다르게 연결하여 사이트의 전반적인 분위기와 사용자 경험(UX)을 완전히 변화시키는 디자인 파워를 실습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. [hw2_ex/02_ex/](file:///C:/workspace/hw2_ex/hw2_ex/02_ex/) 폴더 내의 각 테마별 html 파일(예: `nature_healing_travel.html`)을 브라우저로 엽니다.
2. 스타일 변화를 시각적으로 직접 체감해 봅니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

### HTML 구조가 화면 변경으로 이어지는 과정

브라우저는 HTML을 읽어 DOM 객체 트리를 만든다. querySelector로 얻는 것은 HTML 문자열이 아니라 현재 문서 안의 요소 참조이며, 찾지 못하면 null이다. classList로 상태를 바꾸면 표현 방식은 CSS가 담당하고, textContent로 값을 넣으면 문자열을 HTML 태그로 해석하지 않는다.

**예시로 이해하기:** 카드 목록을 만든다고 가정하면 데이터 배열 → createElement로 요소 생성 → textContent로 제목 지정 → 부모에 append 순서로 생각할 수 있다. 사용자 입력을 그대로 innerHTML에 넣는 방식은 피한다. HTML·CSS 실습에서는 먼저 정적인 구조를 이해한 뒤 이 과정을 동적 화면의 확장으로 읽는다.

근거: 161-1 Document Object Model — [4쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=4>) · [6쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=6>) · [14쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=18>)

### 이벤트 등록과 실행 시점 구분하기

이벤트 리스너 등록은 함수를 즉시 실행하는 일이 아니라 특정 사건이 발생했을 때 호출할 함수를 보관하는 일이다. addEventListener에 함수 호출 결과 대신 함수 자체를 전달한다. DOM이 준비되기 전에 요소를 찾으면 연결에 실패할 수 있으며, 리스너를 제거할 때는 등록 당시의 함수 참조와 캡처 설정이 맞아야 한다.

**예시로 이해하기:** 폼 저장은 버튼 click만 처리하기보다 form의 submit을 처리하면 Enter 제출도 같은 경로로 들어온다. 자바스크립트로 전송을 맡길 경우 preventDefault로 기본 제출을 막고 입력 검증 → 요청 → 결과 표시를 이어 간다.

근거: 161-2 Event — [13쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=13>) · [16쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=16>) · [19쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=21>) · [23쪽](<../../260629_ex/새 폴더/5-28/161-2_Event.pdf#page=23>)

<!-- pdf-til-supplement:end -->
