# 사주풀이 AI 융합 웹 애플리케이션 백엔드 🍃🔮

스프링 부트를 이용해 구동되는 백엔드 서버 프로젝트로, 사용자의 생년월일시 입력값을 받아 동양 역학 사주 알고리즘 및 외부 AI를 조합해 분석 결과를 산출해 주는 이색 웹 서비스 백엔드입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/saju/pom.xml) : 롬복, 스프링 웹 등 종속성 명세
- [Dockerfile](file:///C:/workspace/saju/Dockerfile) : 클라우드 컨테이너화 배포를 위한 도커 설정
- [src/main/resources/](file:///C:/workspace/saju/src/main/resources/) : 데이터 소스 연결 및 기본 파라미터 매핑 리소스들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **비즈니스 도메인 서비스 설계**: 생년월일과 시간을 60갑자 사주 정보로 변환해 주는 로직을 스프링 컨트롤러와 서비스 구조에 얹어 웹 API로 배포하는 방식을 익힙니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `.env` 파일에 API Key 등 필요한 정보를 매핑합니다.
2. IDE에서 서버를 가동하거나 `./mvnw spring-boot:run`을 실행해 웹 포트로 접속합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/saju/controller/SajuController.java](<../../saju/src/main/java/org/example/saju/controller/SajuController.java>) · [src/main/java/org/example/saju/SajuApplication.java](<../../saju/src/main/java/org/example/saju/SajuApplication.java>) · [src/main/java/org/example/saju/service/SajuService.java](<../../saju/src/main/java/org/example/saju/service/SajuService.java>)

### AI 서비스의 입력·호출·출력 책임

ChatModel은 모델 통신 계약을, ChatClient는 프롬프트 구성과 호출을 편하게 연결하는 계층을 제공한다. 컨트롤러가 제공자 세부 설정까지 다루기보다 서비스에 입력을 넘기고 앱에 맞는 결과를 받으면 제공자 변경 영향을 줄일 수 있다.

**예시로 이해하기:** 영화 추천이라면 사용자 조건 → 추천 서비스 → 모델 응답 → 화면 DTO 순서로 읽는다. 제공자가 호환 API를 제공하더라도 지원 모델·옵션·구조화 출력까지 모두 같다고 가정하지 않는다. 교안 예제의 제공자 설정은 프로젝트에 선언된 의존성과 대조한다.

근거: 331-1 Spring AI 기초 — [32쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=32>) · [33쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=33>) · [36쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=36>) · [37쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=37>) · [41쪽](<../../260629_ex/새 폴더/7-27/331-1_Spring_AI_기초.pdf#page=41>)

<!-- pdf-til-supplement:end -->
