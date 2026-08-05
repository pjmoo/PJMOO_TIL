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
