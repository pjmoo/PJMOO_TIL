# 프로그래머스 리팩토링 및 클린 코드 자바 실습 ☕⚙

자바로 알고리즘 문제를 푼 뒤, 코드 가독성을 높이고 유지보수를 편리하게 하기 위해 함수 분리, 네이밍 개선, 그리고 중복 코드를 제거하는 '리팩토링(Refactoring)' 연습 프로젝트입니다. (Gradle 빌드 환경)

---

## 📂 학습 파일 구성 (Files)

- [build.gradle.kts](file:///C:/workspace/programmers-refactor-practice/build.gradle.kts) : Kotlin DSL 기반의 Gradle 의존성 빌드 설정 파일
- [src/main/java/](file:///C:/workspace/programmers-refactor-practice/src/main/java/) : 리팩토링 대상 자바 코드 및 개선체 소스파일

---

## 🛠 배운 핵심 개념 (What We Learned)

- **클린 코드 (Clean Code)**: 변수명을 의미 있게 짓고, 하나의 메소드는 단 하나의 역할만 수행하게 쪼개어 가독성을 높이는 훈련을 합니다.
- **Gradle 빌드 시스템**: 빌드 속도가 빠른 코틀린 기반 Gradle 환경에서 의존성을 주입하고 컴파일하는 과정을 실습합니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. IntelliJ 등에서 본 폴더를 열어 Gradle 빌드가 완료될 때까지 대기합니다.
2. `src/test/java`에 마련된 단위 테스트를 수행하여 리팩토링 후에도 기능이 깨지지 않고 동일하게 작동하는지 검증합니다.
