# HTML & CSS 스스로 코딩하기 (개인 자율 실습) 🛠

오늘 수업 시간에 학습한 HTML 태그와 CSS의 정렬, 색상, 디자인 기초 개념들을 기억하며 남의 도움 없이 나만의 자율 코딩을 완성해 보는 개인 실습실입니다.

---

## 📂 학습 파일 구성 (Files)

- [01_pra.html](file:///C:/workspace/260518_self-pra/01_pra.html) : 자유롭게 태그를 구성하며 연습해 본 파일
- [index.html](file:///C:/workspace/260518_self-pra/index.html) : 실습의 메인이 되는 웹 문서 페이지
- [style.css](file:///C:/workspace/260518_self-pra/style.css) : 직접 여백과 글자 정렬, 색상 코드를 작성해 꾸민 자율 디자인 스타일시트

---

## 🛠 배운 핵심 개념 (What We Learned)

- **HTML/CSS 분리**: HTML로는 오직 글과 구조만 작성하고, 꾸미는 것은 `style.css`에 모아 작성하여 파일 간의 역할 분담을 실습합니다.
- **자기주도 해결**: 오류가 나거나 배치가 틀어졌을 때, 브라우저 개발자 도구(`F12`)를 켜서 요소를 찍어보고 스타일을 직접 수정해 나가는 능력을 기릅니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. [index.html](file:///C:/workspace/260518_self-pra/index.html) 파일을 브라우저로 열어서 직접 설계하고 스타일링한 메인 화면을 확인합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [index.html](<../../260518_self-pra/index.html>) · [01_pra.html](<../../260518_self-pra/01_pra.html>)

### HTML 구조가 화면 변경으로 이어지는 과정

브라우저는 HTML을 읽어 DOM 객체 트리를 만든다. querySelector로 얻는 것은 HTML 문자열이 아니라 현재 문서 안의 요소 참조이며, 찾지 못하면 null이다. classList로 상태를 바꾸면 표현 방식은 CSS가 담당하고, textContent로 값을 넣으면 문자열을 HTML 태그로 해석하지 않는다.

**예시로 이해하기:** 카드 목록을 만든다고 가정하면 데이터 배열 → createElement로 요소 생성 → textContent로 제목 지정 → 부모에 append 순서로 생각할 수 있다. 사용자 입력을 그대로 innerHTML에 넣는 방식은 피한다. HTML·CSS 실습에서는 먼저 정적인 구조를 이해한 뒤 이 과정을 동적 화면의 확장으로 읽는다.

근거: 161-1 Document Object Model — [4쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=4>) · [6쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=6>) · [14쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=14>) · [18쪽](<../../260629_ex/새 폴더/5-27/161-1_Document_Object_Model.pdf#page=18>)

<!-- pdf-til-supplement:end -->
