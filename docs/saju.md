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
