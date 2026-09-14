# 스프링 코어(Spring Core) - IoC 컨테이너 & 스프링 빈(Bean) 기초 🍃🏛

스프링 프레임워크의 가장 깊은 내부 핵심인 '제어의 역전(IoC)'과 객체의 생명주기를 알아서 매니징하는 '스프링 빈(Bean)' 등록 및 관리 원리를 학습하는 순수 스프링 입문서입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/spring/pom.xml) : Spring Context 등 코어 라이브러리 종속성
- [step1+2.md](file:///C:/workspace/spring/step1+2.md) ~ [step4.md](file:///C:/workspace/spring/step4.md) : 자바 클래스를 스프링 공장(ApplicationContext)에 집어넣는 XML 설정법, 어노테이션 기반 컴포넌트 스캔, 의존관계 자동 주입(`@Autowired`) 이론서
- [src/main/java/](file:///C:/workspace/spring/src/main/java/) : 의존성을 주입받아 작동을 실행해보는 자바 빈(Bean) 실습 소스코드

---

## 🛠 배운 핵심 개념 (What We Learned)

- **제어의 역전 (IoC)**: 객체의 제어권이 개발자의 `new`에서 스프링 컨테이너로 넘어가는 객체지향 설계의 진수를 배웁니다.
- **의존관계 주입 (DI)**: 생성자나 필드 주입을 통해 결합도를 낮추고 테스트하기 편한 객체로 탈바꿈시키는 스프링의 핵심 메커니즘을 마스터합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 메인 자바 코드를 IDE에서 구동하여 스프링 컨테이너가 켜진 뒤 등록된 객체들을 알아서 꺼내 동작시키는 과정을 관찰합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/step1/Main.java](<../../spring/src/main/java/org/example/step1/Main.java>) · [src/main/java/org/example/step2/Main.java](<../../spring/src/main/java/org/example/step2/Main.java>) · [src/main/java/org/example/step3/Main.java](<../../spring/src/main/java/org/example/step3/Main.java>)

### DI는 객체를 외부에서 조립하는 방식

DI는 클래스가 협력 객체를 직접 만들지 않고 외부에서 받는 방식이다. Spring 컨테이너는 빈을 생성하고 의존관계를 연결한다. 생성자에 필수 의존성을 드러내면 누락을 빨리 찾고 테스트용 구현을 넣기도 쉽다. 싱글톤 빈이라고 해서 내부 상태가 자동으로 스레드 안전해지지는 않는다.

**예시로 이해하기:** 서비스가 Repository 인터페이스를 생성자로 받으면 실제 DB 구현과 메모리 구현을 교체할 수 있다. 요청마다 달라지는 사용자 값을 싱글톤 필드에 저장하지 말고 메서드 인자나 적절한 요청 범위에서 전달하는 이유를 함께 설명한다.

근거: 241-1 Spring Core — [8쪽](<../../260629_ex/새 폴더/7-6/241-1_Spring_Core.pdf#page=8>) · [11쪽](<../../260629_ex/새 폴더/7-6/241-1_Spring_Core.pdf#page=11>) · [12쪽](<../../260629_ex/새 폴더/7-6/241-1_Spring_Core.pdf#page=12>) · [13쪽](<../../260629_ex/새 폴더/7-6/241-1_Spring_Core.pdf#page=13>) · [22쪽](<../../260629_ex/새 폴더/7-6/241-1_Spring_Core.pdf#page=22>)

<!-- pdf-til-supplement:end -->
