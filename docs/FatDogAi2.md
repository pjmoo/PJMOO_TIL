# FatDog AI 플랫폼 V2 - JPA & 도커 가상화 🐳🤖

스프링 부트 환경에서 데이터베이스 데이터 모델 클래스인 JPA 엔티티를 활용하고, 인공지능 API 호출 기능과 도커(Docker) 컨테이너 패키징 설정을 함께 엮어 배포 준비 과정을 훈련하는 고급 프로젝트입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/FatDogAi2/pom.xml) : Spring Data JPA, AI 드라이버, Lombok 라이브러리 종속성 설정
- [Dockerfile](file:///C:/workspace/FatDogAi2/Dockerfile) : 서버를 리눅스 컨테이너 가상 환경에 패키징하여 빌드하는 도커 파일
- [scratch/merge_jpa.ps1](file:///C:/workspace/FatDogAi2/scratch/merge_jpa.ps1) : JPA 관련 설정을 병합 제어해 주는 유틸 스크립트

---

## 🛠 배운 핵심 개념 (What We Learned)

- **JPA 데이터 영속성**: SQL 문을 매번 짜지 않고 자바 객체와 테이블을 1:1 자동 맵핑하여 데이터를 조작하는 ORM 핵심 기술을 공부합니다.
- **컨테이너 가상화 (Docker)**: 개발 컴퓨터뿐만 아니라 어떤 환경에서도 서버가 정상 구동되도록 가상 환경의 종속성을 이미지로 조립하는 개념을 익힙니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. `.env.dev.example` 파일을 참고하여 개발용 설정 환경변수 `.env.dev`를 만듭니다.
2. 도커가 켜진 상태에서 `docker build -t fatdog-ai-2 .` 명령으로 이미지를 생성하거나, IDE에서 직접 Spring Boot 서비스를 띄웁니다.
