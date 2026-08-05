# 뉴스 정보 수집 자동화 프로그램(News Scraper) 📰🤖

외부 언론사 뉴스 기사 데이터를 주기적으로 추출 및 정리해 주는 자바 스크립트 도구이자, 깃허브 워크플로우를 이용해 수집 주기를 자동으로 통제하는 자동 크롤링 아키텍처 실습입니다.

---

## 📂 학습 파일 구성 (Files)

- [src/oop/search/](file:///C:/workspace/news-scraper/src/oop/search/) : 신문 기사 데이터 파싱 및 객체 지향적 자료구조화 자바 코드
- [.github/workflows/news-scraper.yml](file:///C:/workspace/news-scraper/.github/workflows/news-scraper.yml) : 주기적으로 스크립트를 깨워 원격 구동시키는 깃허브 액션 설정

---

## 🛠 배운 핵심 개념 (What We Learned)

- **웹 데이터 추출(Scraping)**: HTML 구조에서 원하는 기사 제목 and 본문 데이터의 텍스트 토큰을 안전하게 솎아내는 기본 원리를 배웁니다.
- **자동화 스케줄링**: cron 표현식을 활용해 깃허브 클라우드가 스스로 매일 정해진 시각에 서버 코드를 구동하게끔 조율하는 데브옵스 기초를 배웁니다.

---

## 🚀 실행 및 확인 방법 (How to Run)

1. 로컬 개발 환경에서 파싱 코드를 단독 컴파일하여 데이터가 출력되는지 점검합니다.
