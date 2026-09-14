# 자바스크립트 연계 HTML 레이아웃 스스로 코딩하기 🛠

지금껏 공부한 HTML 뼈대 작성과 CSS 스타일링, 그리고 자바스크립트의 기초 동적 요소를 결합해 나 홀로 처음부터 끝까지 작은 웹 브라우저 기능을 구현해 보는 독립 연습장입니다.

---

## 📂 학습 파일 구성 (Files)

- [index.html](file:///C:/workspace/260522_self-pra/index.html) : 자율 실습용 웹 문서 페이지 소스코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **종합 결합 연습**: HTML, CSS, JavaScript를 유기적으로 조합하여 실제 브라우저가 화면을 띄우고 사용자의 이벤트에 따라 반응하게 만드는 일련의 설계 능력을 배양합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. [index.html](file:///C:/workspace/260522_self-pra/index.html) 파일을 웹 브라우저로 띄워 내가 기획한 화면 구성이 잘 돌아가는지 직접 테스트해 봅니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [index.html](<../../260522_self-pra/index.html>)

### HTML 구조가 화면 변경으로 이어지는 과정

브라우저는 HTML을 읽어 DOM 객체 트리를 만든다. querySelector로 얻는 것은 HTML 문자열이 아니라 현재 문서 안의 요소 참조이며, 찾지 못하면 null이다. classList로 상태를 바꾸면 표현 방식은 CSS가 담당하고, textContent로 값을 넣으면 문자열을 HTML 태그로 해석하지 않는다.

**예시로 이해하기:** 카드 목록을 만든다고 가정하면 데이터 배열 → createElement로 요소 생성 → textContent로 제목 지정 → 부모에 append 순서로 생각할 수 있다. 사용자 입력을 그대로 innerHTML에 넣는 방식은 피한다. HTML·CSS 실습에서는 먼저 정적인 구조를 이해한 뒤 이 과정을 동적 화면의 확장으로 읽는다.

근거: 161-1 Document Object Model — [4쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=4>) · [6쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=6>) · [14쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=18>)

<!-- pdf-til-supplement:end -->
