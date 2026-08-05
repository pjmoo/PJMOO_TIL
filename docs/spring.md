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
