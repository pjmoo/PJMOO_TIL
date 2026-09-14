# 뚱냥이(FatDog) 스프링 부트 웹 프로젝트 V2 🐱🍃

스프링 부트를 기반으로 웹 애플리케이션의 공통 설정, 기본 홈 컨트롤러 개설, 템플릿 엔진 서빙을 테스트하는 프로젝트 뼈대입니다.

---

## 📂 학습 파일 구성 (Files)

- [pom.xml](file:///C:/workspace/fatdog2/pom.xml) : Spring Boot Starter Web 종속성이 포함된 빌드 명세서
- [src/main/java/](file:///C:/workspace/fatdog2/src/main/java/) : 웹 요청 주소를 매핑하여 화면을 연결하는 컨트롤러 로직 파일들

---

## 🛠 배운 핵심 개념 (What We Learned)

- **스프링 부트 아키텍처**: 내장 톰캣 서버를 구동해 빠르게 자바 기반 웹사이트를 배포하는 핵심 환경 구조를 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. IDE에서 메인 Application 클래스를 Run 하거나, 터미널에서 `./mvnw spring-boot:run`을 실행합니다.

<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [src/main/java/org/example/fatdog2/controller/HomeController.java](<../../EXex_EX/fatdog2/src/main/java/org/example/fatdog2/controller/HomeController.java>) · [src/main/java/org/example/fatdog2/Fatdog2Application.java](<../../EXex_EX/fatdog2/src/main/java/org/example/fatdog2/Fatdog2Application.java>) · [src/main/java/org/example/fatdog2/ServletInitializer.java](<../../EXex_EX/fatdog2/src/main/java/org/example/fatdog2/ServletInitializer.java>)

### 값·참조·비교 연산 이해하기

기본 타입 변수는 값을, 참조 타입 변수는 객체를 가리키는 참조 값을 담는다. 객체에 대한 ==는 같은 객체를 가리키는지 비교하고 equals는 해당 클래스가 정의한 동등성 규칙을 사용한다. String은 내용을 바꾸는 것처럼 보이는 연산도 새 문자열을 만들어 참조를 다시 대입할 수 있다.

**예시로 이해하기:** new String("java")로 만든 두 문자열은 내용은 같아도 서로 다른 객체다. 내용 비교에는 equals를 사용한다. final인 참조 변수는 다른 객체를 대입할 수 없지만, 그 객체 내부까지 항상 불변이 되는 것은 아니다.

근거: 211-1 Java 문법 — [24쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=24>) · [27쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=27>) · [30쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=30>) · [37쪽](<../../260629_ex/새 폴더/6-17/211-1_Java_문법.pdf#page=37>)

### 반복 범위와 자료구조의 계약

배열은 길이가 고정되어 있고 인덱스는 0부터 length-1까지다. List는 순서와 중복을, Set은 중복 제거를, Map은 키로 값을 찾는 관계를 표현한다. 자료구조 선택은 문법 취향보다 필요한 조회·추가·중복 처리 방식에 따라 결정한다.

**예시로 이해하기:** 이름이 여러 번 나오는 목록의 등장 횟수는 Map<이름, 횟수>로 표현할 수 있다. 순회 조건이 i <= length이면 마지막에 범위를 벗어나므로 i < length와 비교한다. 향상된 for문의 지역 변수에 값을 대입해도 기본 타입 배열의 원소가 자동 변경되지는 않는다.

근거: 211-2 흐름제어와 컬렉션 — [15쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=15>) · [17쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=17>) · [21쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=21>) · [23쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=23>) · [25쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=25>) · [27쪽](<../../260629_ex/새 폴더/6-17/211-2_흐름제어와_컬렉션.pdf#page=27>)

<!-- pdf-til-supplement:end -->
