# 🐾 JPA 실습 프로젝트: 반려동물 & 진료 예약 관리 서비스 (JPA2)

이 프로젝트는 자바 표준 ORM 기술인 **JPA(Java Persistence API)**의 기초부터 연관관계 매핑, 그리고 성능 최적화(N+1 문제 해결)까지 학습하기 위한 실습 애플리케이션입니다.

공부를 처음 시작하거나 프로그래밍을 잘 모르는 사람도 쉽게 이해할 수 있도록 동작 원리와 파일 구조를 나누어 설명합니다.

---

## 📖 핵심 개념 쉽게 이해하기

### 1. JPA(Java Persistence API)란 무엇인가요?
* **JPA**는 자바 프로그램과 데이터베이스 사이에서 동작하는 **'번역기(통역사)'** 역할을 합니다.
* 과거에는 개발자가 직접 복잡한 데이터베이스 명령어(SQL)를 하나하나 작성해야 했지만, JPA를 사용하면 자바 코드로 데이터를 조작할 때 JPA가 알아서 데이터베이스 명령어로 번역하여 실행해 줍니다.

### 2. 엔티티(Entity)란 무엇인가요?
* 데이터베이스의 테이블과 1:1로 매칭되는 자바 클래스입니다. 데이터베이스에 저장할 **'데이터의 설계도'**라고 생각하시면 편합니다.

---

## 📂 실습 핵심 파일 구조 및 역할 설명

### 1. 뼈대 데이터 설계도 (Entity)
* [Animal.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/entity/Animal.java): **동물 분류** (예: 강아지, 고양이, 앵무새 등)를 표현합니다.
* [Pet.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/entity/Pet.java): **반려동물 정보** (이름, 나이 등)를 가집니다. 각 펫은 하나의 동물 분류에 속합니다. (N:1 연관관계)
* [PetHistory.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/entity/PetHistory.java): 펫 정보가 몇 번 수정되었는지 횟수를 누적해서 기록하는 **로그(이력)** 설계도입니다.
* [Doctor.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/entity/Doctor.java): 진료를 담당할 **수의사(의사) 정보** 설계도입니다.
* [Reservation.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/entity/Reservation.java): 어떤 펫이 어떤 수의사에게 언제 진료를 받을지 기록하는 **예약 정보** 설계도입니다.

### 2. 브라우저 요청 처리기 (Controller)
* [MainController.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/controller/MainController.java): 펫 등록, 목록 조회, 상세 정보 보기, 수정, 삭제 기능을 제어합니다.
* [ReservationController.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/controller/ReservationController.java): 수의사 등록 및 예약 신청, 예약 목록 조회 기능을 제어합니다.

### 3. 비즈니스 로직 처리기 (Service)
* [PetService.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/service/PetService.java): 펫의 등록/수정/삭제 시 DB 트랜잭션 처리 및 상세 로직을 실행합니다.
* [ReservationService.java](file:///C:/workspace/jpa2/src/main/java/org/example/jpa2/service/ReservationService.java): 수의사와 예약의 데이터 조회 및 등록 과정을 처리합니다.

### 4. 화면 페이지 (JSP Views)
* [index.jsp](file:///C:/workspace/jpa2/src/main/webapp/WEB-INF/views/index.jsp): 메인 화면으로, 등록된 펫 목록 확인 및 새 펫/동물 종류를 추가할 수 있습니다.
* [detail.jsp](file:///C:/workspace/jpa2/src/main/webapp/WEB-INF/views/detail.jsp): 특정 펫의 정보를 수정하거나 소프트 삭제(Soft Delete)를 수행합니다.
* [reservation.jsp](file:///C:/workspace/jpa2/src/main/webapp/WEB-INF/views/reservation.jsp): 수의사를 등록하고 예약을 진행하며, 전체 예약 목록과 N+1 문제를 검증할 수 있는 예약 목록을 보여줍니다.
* [n1.jsp](file:///C:/workspace/jpa2/src/main/webapp/WEB-INF/views/n1.jsp): JPA 성능 최적화(N+1 조회 문제 해결) 결과를 보여주는 단순 예약 조회 화면입니다.

---

## ⚠️ 필수 주의 사항 (오류 발생 원인 안내)

이 프로젝트는 교육용 실습 예제로 제작되어 **예외 처리(방어 코드)가 구현되어 있지 않습니다.** 따라서 아래 상황에서는 오류 페이지가 발생하므로 주의해 주시기 바랍니다.

### 1. 입력값을 누락한 채 전송할 때 (500 에러)
* **현상**: 이름이나 나이, 의사 이름 등의 입력란을 **비워두고(공백 상태) '추가'나 '수정' 버튼을 누르면** 브라우저에 **Whitelabel Error Page(500 Internal Server Error)**가 표시됩니다.
* **이유**: 데이터베이스 설계상 필수 값(`NOT NULL`)으로 입력되어야 하는 항목들에 빈 값이 전달되어 DB 저장 실패 예외가 발생하기 때문입니다.
* **해결법**: 펫 이름, 나이, 의사 이름 등의 입력칸에 **반드시 값을 올바르게 채워 넣고** 버튼을 눌러주세요.

### 2. 존재하지 않는 ID를 조회할 때 (500 에러)
* **현상**: 브라우저 주소창에 `http://localhost:8080/999`와 같이 데이터베이스에 없는 임의의 ID를 입력하여 상세 페이지 조회를 시도하면 **500 에러**가 발생합니다.
* **이유**: 소스 코드 내부에서 조회 실패 시 `orElseThrow()`를 호출하여 자바 예외(`NoSuchElementException`)를 발생시키기 때문입니다.

---

## 🚀 로컬 서버 실행 방법
1. 로컬 PC에 Java 17 이상이 설치되어 있는지 확인합니다.
2. 프로젝트 루트 폴더에 데이터베이스 연결 정보를 담은 `C:\workspace\jpa2\.env.dev` 파일이 존재하는지 확인합니다.
3. 터미널 또는 IDE에서 프로젝트를 실행한 뒤 브라우저에서 `http://localhost:8080`으로 접속합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/jpa2/controller/MainController.java](<../../jpa2/src/main/java/org/example/jpa2/controller/MainController.java>) · [src/main/java/org/example/jpa2/controller/ReservationController.java](<../../jpa2/src/main/java/org/example/jpa2/controller/ReservationController.java>) · [src/main/java/org/example/jpa2/Jpa2Application.java](<../../jpa2/src/main/java/org/example/jpa2/Jpa2Application.java>)

### 영속 상태와 변경 감지

JPA는 엔티티와 테이블의 매핑을 정의하는 표준이고 Hibernate는 이를 구현한다. 영속성 컨텍스트가 관리하는 엔티티의 변경은 flush 시점에 SQL로 반영될 수 있다. 객체 필드를 바꾸는 즉시 DB에 커밋되는 것은 아니며 flush와 commit도 같은 뜻이 아니다.

**예시로 이해하기:** 트랜잭션 안에서 조회한 엔티티의 상태를 바꾸는 흐름과 화면에서 받은 새 객체를 save하는 흐름을 구분한다. 쓰기 트랜잭션 밖의 객체 변경이 자동 저장된다고 가정하지 않는다. 엔티티를 응답에 직접 노출하기보다 필요한 값을 DTO에 담으면 저장 구조와 응답 계약을 분리할 수 있다.

근거: 323-1 JPA와 Hibernate — [31쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=31>) · [33쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=33>) · [35쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=35>) · [42쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=42>) · [46쪽](<../../260629_ex/새 폴더/7-23/323-1_JPA와_Hibernate.pdf#page=46>)

### 연관관계의 주인과 N+1의 발생 시점

양방향 관계에서는 외래키 변경을 반영하는 연관관계의 주인이 중요하다. 반대쪽 컬렉션에만 추가하면 기대한 FK 변경이 저장되지 않을 수 있다. LAZY는 필요한 시점까지 조회를 미루지만 반복문에서 연관 객체를 하나씩 읽으면 N+1 쿼리가 생길 수 있다.

**예시로 이해하기:** 회원 목록 1회 조회 후 각 회원의 팀을 읽으며 추가 SQL이 발생하는지 확인한다. fetch join이나 조회 전용 DTO로 필요한 데이터를 가져오는 방법을 비교한다. 컬렉션 fetch join과 페이징을 함께 쓰면 행 수가 늘어나므로 단순히 한 번의 쿼리로 줄이는 것만 목표로 삼지 않는다.

근거: 323-2 JPA 연관관계 매핑과 N1 문제 — [9쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=9>) · [11쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=11>) · [19쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=19>) · [21쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=21>) · [26쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=26>) · [28쪽](<../../260629_ex/새 폴더/7-23/323-2_JPA_연관관계_매핑과_N1_문제.pdf#page=28>)

<!-- pdf-til-supplement:end -->
