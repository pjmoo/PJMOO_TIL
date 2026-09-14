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

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/fatdogai2/controller/ChatController.java](<../../FatDogAi2/src/main/java/org/example/fatdogai2/controller/ChatController.java>) · [src/main/java/org/example/fatdogai2/FatDogAi2Application.java](<../../FatDogAi2/src/main/java/org/example/fatdogai2/FatDogAi2Application.java>) · [src/main/java/org/example/fatdogai2/repository/ChatMemoryJpaRepository.java](<../../FatDogAi2/src/main/java/org/example/fatdogai2/repository/ChatMemoryJpaRepository.java>)

### 구조화 출력과 대화 메모리는 별도 문제

구조화 출력은 모델 응답을 앱에서 다루기 쉬운 타입으로 변환하는 과정이다. JSON으로 파싱되었다고 내용까지 맞는 것은 아니므로 필수 값과 범위를 검증해야 한다. 대화 메모리는 이전 메시지를 다시 실어 보내며 conversationId로 대화를 구분한다.

**예시로 이해하기:** 일정 결과의 날짜·장소 필드가 존재해도 실제로 가능한 일정인지는 별도 검증 대상이다. 대화 ID를 받는 API는 그 ID가 현재 사용자의 것인지 확인해야 한다. 메모리 저장소에 기록했다는 사실과 모델 요청에 이력이 포함되었다는 사실도 구분한다.

근거: 331-2 Spring AI 활용 — [11쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=11>) · [13쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=13>) · [27쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=27>) · [29쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=29>) · [33쪽](<../../260629_ex/새 폴더/7-28/331-2_Spring_AI_활용.pdf#page=33>)

### 영속 상태와 변경 감지

JPA는 엔티티와 테이블의 매핑을 정의하는 표준이고 Hibernate는 이를 구현한다. 영속성 컨텍스트가 관리하는 엔티티의 변경은 flush 시점에 SQL로 반영될 수 있다. 객체 필드를 바꾸는 즉시 DB에 커밋되는 것은 아니며 flush와 commit도 같은 뜻이 아니다.

**예시로 이해하기:** 트랜잭션 안에서 조회한 엔티티의 상태를 바꾸는 흐름과 화면에서 받은 새 객체를 save하는 흐름을 구분한다. 쓰기 트랜잭션 밖의 객체 변경이 자동 저장된다고 가정하지 않는다. 엔티티를 응답에 직접 노출하기보다 필요한 값을 DTO에 담으면 저장 구조와 응답 계약을 분리할 수 있다.

근거: 323-1 JPA와 Hibernate — [31쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=31>) · [33쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=33>) · [35쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=35>) · [42쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=42>) · [46쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=46>)

### 연관관계의 주인과 N+1의 발생 시점

양방향 관계에서는 외래키 변경을 반영하는 연관관계의 주인이 중요하다. 반대쪽 컬렉션에만 추가하면 기대한 FK 변경이 저장되지 않을 수 있다. LAZY는 필요한 시점까지 조회를 미루지만 반복문에서 연관 객체를 하나씩 읽으면 N+1 쿼리가 생길 수 있다.

**예시로 이해하기:** 회원 목록 1회 조회 후 각 회원의 팀을 읽으며 추가 SQL이 발생하는지 확인한다. fetch join이나 조회 전용 DTO로 필요한 데이터를 가져오는 방법을 비교한다. 컬렉션 fetch join과 페이징을 함께 쓰면 행 수가 늘어나므로 단순히 한 번의 쿼리로 줄이는 것만 목표로 삼지 않는다.

근거: 323-2 JPA 연관관계 매핑과 N1 문제 — [9쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=9>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=11>) · [19쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=26>) · [28쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=28>)

<!-- pdf-til-supplement:end -->
