# 바닐라 자바스크립트 기반 공부 일지(TIL) 스킨 프론트엔드 📝🎨

오늘 배운 내용을 기록하는 TIL(Today I Learned) 서비스의 가벼운 프론트엔드 디자인 스킨으로, 로컬 JSON 데이터 정보를 자바스크립트 카드로 시각화해 주는 웹 대시보드 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [index.html](file:///C:/workspace/til-skin/index.html) : TIL 목록 카드 정렬 화면 문서
- [style.css](file:///C:/workspace/til-skin/style.css) : 깔끔하고 가독성 좋은 피드 형태의 CSS 스타일시트
- [app.js](file:///C:/workspace/til-skin/app.js) : `til-data.json` 또는 `notes.json` 데이터를 로드해 화면에 뿌려주는 자바스크립트 로직
- [til-data.json](file:///C:/workspace/til-skin/til-data.json) : 복습 기록 정보가 누적 보관된 데이터셋 파일

---

## 🛠 배운 핵심 개념 (What We Learned)

- **비동기 JSON 파싱**: 로컬 데이터 파일을 읽어 자바스크립트 객체 배열로 만들고, 이를 화면 템플릿 스트링으로 치환해 HTML 영역에 꽂아 넣는 동적 렌더링 구조를 이해합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. [index.html](file:///C:/workspace/til-skin/index.html) 파일을 크롬 브라우저로 엽니다.
2. JSON 파일 내용이 화면 피드 카드로 예쁘게 자동 출력되는지 확인합니다.
