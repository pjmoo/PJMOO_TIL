# 티스토리(Tistory) 블로그 스킨 맞춤 커스터마이징 🎨🛠

국내 블로그 서비스인 티스토리(Tistory)의 스킨 구조 명세에 맞춰 커스텀 스타일 및 동작 레이아웃을 구현해보는 독립 웹 디자인 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [index.html](file:///C:/workspace/tli/index.html) : 로컬에서 스킨 레이아웃을 모의 테스트해보는 가상 테스트 HTML
- [style.css](file:///C:/workspace/tli/style.css) : 사이드바, 본문 폰트, 여백 등을 통제하는 메인 스타일 코드
- [tistory-skin/](file:///C:/workspace/tli/tistory-skin/) : 티스토리 스킨 업로드 규격 파일인 `index.xml`, `skin.html` 파일이 담긴 폴더

---

## 🛠 배운 핵심 개념 (What We Learned)

- **티스토리 스킨 엔진**: 티스토리 치환자(예: `[##_title_##]`)가 들어간 `skin.html`의 뼈대를 분석해 원하는 위치에 스타일이 덮어씌워지도록 조정하는 규칙을 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 로컬 테스트 화면을 보기 위해 [index.html](file:///C:/workspace/tli/index.html) 파일을 크롬 브라우저로 실행하여 결과물을 검증합니다.
