# PJMOO_TIL - Today I Learned 📝

<!-- workspace-readme-learning:start -->
## 파일과 연결한 학습 안내

아래 설명은 이 폴더의 실제 소스와 빌드 설정을 기준으로 정리했습니다. 기존 소개의 기능 설명은 연결된 파일과 함께 확인할 수 있습니다.

### 주요 파일과 역할

| 파일 | 역할과 읽을 내용 |
| --- | --- |
| [package.json](<package.json>) | Node 패키지 의존성과 실제 실행 스크립트 |
| [app.js](<app.js>) | 화면 요소·이벤트·상태 처리 — `init`, `showError`, `continueInit` |
| [index.html](<index.html>) | PJMOO TIL — Today I Learned 화면 |
| [server.js](<server.js>) | JavaScript 모듈 또는 문법 실습 |
| [tistory_skin/app.js](<tistory_skin/app.js>) | 화면 요소·이벤트·상태 처리 — `init`, `showError`, `continueInit` |
| [build.js](<build.js>) | JavaScript 모듈 또는 문법 실습 — `processLogs` |
| [docs/260514.md](<docs/260514.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260515_ex01.md](<docs/260515_ex01.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260515_ex02.md](<docs/260515_ex02.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260515_remote2.md](<docs/260515_remote2.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260518_ex.md](<docs/260518_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260518_self-pra.md](<docs/260518_self-pra.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260519_ex.md](<docs/260519_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260520_ex.md](<docs/260520_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260521_ex.md](<docs/260521_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260522_ex.md](<docs/260522_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260522_self-pra.md](<docs/260522_self-pra.md>) | 설계·학습·운영 내용을 설명하는 문서 |
| [docs/260526_ex.md](<docs/260526_ex.md>) | 설계·학습·운영 내용을 설명하는 문서 |

### 실행과 설정 확인

- [package.json](<package.json>)에 선언된 실행 스크립트: `build`, `dev`.
- 패키지를 준비한 뒤 프로젝트 루트에서 `npm run dev`을 사용합니다. 스크립트별 실제 명령은 package.json에서 확인합니다.
- 코드·설정에서 참조하는 환경 변수 이름: `APP_MESSAGE`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, `DB_USERNAME`, `GROQ_API_KEY`, `PORT`. 기본값과 필수 여부는 각 참조 위치에서 확인합니다.

### 관련 PDF와 보충 설명

- [6/16 강의](<../260629_ex/새 폴더/6-16/README.md>): 문서 작성과 회고를 문제·선택 근거·관찰 결과의 기록으로 연결합니다.

이 링크는 구현을 이해하기 위한 관련 기초 자료입니다. 해당 강의가 이 저장소의 모든 기능이나 이후 버전의 API를 설명한다는 뜻은 아닙니다.

### 읽는 순서와 복습

- 원본 문서와 이를 보여 주는 화면·빌드 코드가 있으면 그 연결부터 읽습니다. 사실과 계획을 구분하고 코드 또는 기록으로 확인할 수 있는 근거를 연결합니다.

<!-- workspace-readme-learning:end -->

매일 학습한 기술 내용과 실습 코드를 날짜 및 주제별로 정리한 개인 학습 저장소입니다.

---

## 📅 날짜별 학습 로그 (Daily Logs)

| 날짜 (Date) | 학습 주제 (Topic) | 상세 보기 (Link) |
| :--- | :--- | :--- |
| 2026-05-14 | 260514 | [상세 보기](docs/260514.md) |
| 2026-05-15 | 260515_ex01 | [상세 보기](docs/260515_ex01.md) |
| 2026-05-15 | HTML 첫걸음 - 웹페이지 뼈대 연습 🎈 | [상세 보기](docs/260515_ex02.md) |
| 2026-05-15 | 260515_remote2 | [상세 보기](docs/260515_remote2.md) |
| 2026-05-18 | HTML 주요 태그 & CSS 기초 정복하기 🎨 | [상세 보기](docs/260518_ex.md) |
| 2026-05-18 | HTML & CSS 스스로 코딩하기 (개인 자율 실습) 🛠 | [상세 보기](docs/260518_self-pra.md) |
| 2026-05-19 | CSS 레이아웃 핵심(Flex & Position) & 부트스트랩/테일윈드 맛보기 📐 | [상세 보기](docs/260519_ex.md) |
| 2026-05-20 | 개발자의 문서 작성법 마크다운(Markdown) & 기본 텍스트 핸들링 📝 | [상세 보기](docs/260520_ex.md) |
| 2026-05-21 | 자바스크립트(JavaScript) 기초 문법 다지기 💻 | [상세 보기](docs/260521_ex.md) |
| 2026-05-22 | 자바스크립트 중급 핵심 - 반복문, 함수, 호이스팅 & 클로저 🧠 | [상세 보기](docs/260522_ex.md) |
| 2026-05-22 | 자바스크립트 연계 HTML 레이아웃 스스로 코딩하기 🛠 | [상세 보기](docs/260522_self-pra.md) |
| 2026-05-26 | 자바스크립트 ES6+ 핵심 자료구조 & 객체 지향 프로그래밍(OOP) 및 예외 처리 ⚙ | [상세 보기](docs/260526_ex.md) |
| 2026-05-27 | 자바스크립트 DOM 조작 & 애니 정보 사이트 미니 프로젝트 🎬 | [상세 보기](docs/260527_ex.md) |
| 2026-05-27 | 애니메이션 디자인 시스템 & 커스텀 페이지 홈워크 🎬 | [상세 보기](docs/260527_homework.md) |
| 2026-05-28 | 자바스크립트 DOM 제어 심화 & 이벤트 핸들링 정복하기 ⚙ | [상세 보기](docs/260528_ex.md) |
| 2026-05-29 | 비동기 자바스크립트의 이해 - 콜백, 프로미스, 그리고 Async/Await ⏳ | [상세 보기](docs/260529_ex.md) |
| 2026-05-29 | 비동기 제어 기반의 시계 & 메모 애플리케이션 과제 🕰 | [상세 보기](docs/260529_HW.md) |
| 2026-06-01 | AJAX API 통신 & PokeAPI를 통한 가상의 몬스터 정보 수집 실습 👾 | [상세 보기](docs/260601_ex.md) |
| 2026-06-01 | 네트워크 API 연동 가상 도감(PokeAPI) 카드 구현 홈워크 🃏 | [상세 보기](docs/260601_HW.md) |
| 2026-06-02 | 웹 인증(Auth) 메커니즘, 게시판 구조 설계 & 오브젝트 스토리지 기초 🔒 | [상세 보기](docs/260602_ex.md) |
| 2026-06-04 | Node.js & Express 백엔드 프레임워크 & Gemini AI SDK 연결 실습 🚀 | [상세 보기](docs/260604_ex.md) |
| 2026-06-04 | Express AI API 서버 & 프론트엔드 연결 챗봇 미니 프로젝트 💬 | [상세 보기](docs/260604_HW.md) |
| 2026-06-05 | LangChain.js 프레임워크 & 프롬프트 템플릿, 메모리 & 체인 학습 🤖 | [상세 보기](docs/260605_ex.md) |
| 2026-06-08 ~ 10 | HTML & CSS 종합 복습 웹 페이지 과제 🎨 | [상세 보기](docs/260608-10_HW.md) |
| 2026-06-08 | MOTIPE - 지역 축제 기반 AI 여행 추천 플랫폼 | [상세 보기](docs/260608_HW.md) |
| 2026-06-16 | 나의 첫 자바(Java) 프로그램 - 개발 환경 구축 ☕ | [상세 보기](docs/260616_first-java.md) |
| 2026-06-17 | 자바 기본 문법과 연산자 및 제어문 연습 ➕ | [상세 보기](docs/260617_ex.md) |
| 2026-06-18 | 자바 기초 실습 백업 임시 폴더 📁 | [상세 보기](docs/260618_ex-main.md) |
| 2026-06-18 | 자바 배열(Array), 반복문 & 초급 알고리즘 문제 해결 🧩 | [상세 보기](docs/260618_ex.md) |
| 2026-06-19 | 자바 배열 응용 알고리즘 문제 해결 트레이닝 🏋️ | [상세 보기](docs/260619_ex.md) |
| 2026-06-22 | 자바 클래스(Class) & 객체 지향 프로그래밍(OOP) 기초 🏛 | [상세 보기](docs/260622_ex.md) |
| 2026-06-23 | 자바 상속(Inheritance), 정보 은닉 & 패키지 개념 🛡 | [상세 보기](docs/260623_ex.md) |
| 2026-06-24 | 자바 다형성(Polymorphism), 추상 클래스 & 인터페이스 🎭 | [상세 보기](docs/260624_ex.md) |
| 2026-06-26 | 자바 예외 처리(Exception), 파일 입출력 스트림 & 정규표현식 📂 | [상세 보기](docs/260626_ex.md) |
| 2026-06-29 | 자바 핵심 알고리즘 문제 해결 연습장 🏋️ | [상세 보기](docs/260629_ex.md) |
| 2026-06-30 | 자바 기초 백업용 임시 폴더 📁 | [상세 보기](docs/260630_ex.md) |
| 2026-07-10 | 🗂️ MySQL DQL 학습 및 SQLD 대비 저장소 (DQL & SQLD Study Repository) | [상세 보기](docs/260710_dql.md) |
| 2026-07-13 | 데이터베이스 SQL 기초 - 데이터 조회(DQL), 서브쿼리 & 조인(JOIN) 정복 📊 | [상세 보기](docs/260713_dql-subquery-join.md) |
| 2026-07-14 | 데이터베이스 SQL 데이터 조작(DML) & 테이블 정의(DDL) 마스터 🛠 | [상세 보기](docs/260714_dml-ddl.md) |
| 2026-07-15 | 데이터베이스 설계 및 모델링 - 카레 가게 ERD 설계 홈워크 📐 | [상세 보기](docs/260715_modeling.md) |
| 2026-07-16 | 자바 데이터베이스 연동 기초 - JDBC 프로그래밍 ☕🔌 | [상세 보기](docs/260716_jdbc.md) |
| 2026-07-20 | 스프링 부트(Spring Boot) 입문 - Spring JDBC 연동 🍃🔌 | [상세 보기](docs/260720_spring-jdbc.md) |
| 2026-07-23 | JPA 게임 영웅 도감 실습 정리 🎮 | [상세 보기](docs/jpa.md) |
| 2026-07-24 | JPA 실습 프로젝트: 반려동물 & 진료 예약 관리 서비스 (JPA2) 🐾 | [상세 보기](docs/jpa2.md) |
| 2026-07-27 | Spring Data JPA 실습 프로젝트 (JPA3) 📱 | [상세 보기](docs/jpa3.md) |
| 2026-07-27 | Querydsl 실습 프로젝트 (Spring Boot + Spring Data JPA + Querydsl) 🍓 | [상세 보기](docs/querydsl.md) |
| 2026-07-28 | Spring AI 실습 프로젝트 (Movie Recommendation System) 🌱 | [상세 보기](docs/springai.md) |
| 2026-07-29 | Spring AI 2.0 실습 가이드 (Spring Boot 4.x + Groq AI) 🍃 | [상세 보기](docs/springai2.md) |
| 2026-07-30 | Spring AI RAG (Retrieval-Augmented Generation) 실습 프로젝트 🚀 | [상세 보기](docs/rag.md) |
| 2026-08-04 | 걱정인형 (Worrydoll) - Spring AI & RAG 실습 프로젝트 🧸 | [상세 보기](docs/worrydoll.md) |
| 2026-08-04 | Thymeleaf & Spring Boot 실습 프로젝트 (260804_thymeleaf) 🍃 | [상세 보기](docs/thymeleaf.md) |
| 2026-08-05 | Spring Boot & Thymeleaf 도서 관리 시스템 (thssr) 실습 정리 📚 | [상세 보기](docs/thssr.md) |
| 2026-08-06 | 영화 관리 서비스 실습 정리 (Frag) 🎬 | [상세 보기](docs/260806_frag.md) |
| 2026-08-07 | Spring Boot 파일 업로드 & 스토리지 연동 실습 정리 (260807_fileupload) 💾 | [상세 보기](docs/260807_fileupload.md) |
| 2026-08-10 | AI 파일 & 이미지 RAG 시스템 (PDF & Image RAG) 🚀 | [상세 보기](docs/260810_aifile.md) |
| 2026-08-11 | 🎨 Cloudflare Workers AI & Supabase 이미지 생성 프로젝트 (Imagegen) | [상세 보기](docs/260811_imagegen.md) |
| 2026-08-11 | 🔒 Spring Security 기초 실습 프로젝트 (Sec) | [상세 보기](docs/260811_sec.md) |
| 2026-08-12 | 🔐 Spring Security & JPA CRUD 실습 프로젝트 (260812_sec_crud) | [상세 보기](docs/260812_sec_crud.md) |
| 2026-08-13 | 🔐 Spring Boot Security & JPA 소셜 로그인 실습 프로젝트 (secu) | [상세 보기](docs/260813_secu_social.md) |
| 2026-08-14 | 📌 Spring Boot 게시판 REST API 실습 프로젝트 (rest) | [상세 보기](docs/260814_rest.md) |
| 2026-08-18 | 🔒 Spring Boot REST Security & JWT 실습 프로젝트 (rest-sec) | [상세 보기](docs/260818_rest_sec.md) |
| 2026-08-19 | 🔒 Spring Security & JWT 실습 프로젝트 (`sec-jwt`) | [상세 보기](docs/260819_sec_jwt.md) |
| 2026-08-20 | 🍪 Spring Security + JWT + Redis Refresh Token 기반 인증 시스템 (jwt-fetch) | [상세 보기](docs/260820_jwt_fetch.md) |
| 2026-08-20 ~ 2026-09-03 | BaroHae - 긴급 업무 매칭 플랫폼 프로젝트 회고와 구현 기록 | [상세 보기](docs/260903_barohae.md) |
| 2026-09-07 | Docker와 Linux 기초 명령어 실습 | [상세 보기](docs/260907_infra.md) |
| 2026-09-08 | Docker 네트워크와 GHCR 이미지 배포 실습 | [상세 보기](docs/260908_docker-ghcr.md) |
| 2026-09-09 | Docker Compose 환경 분리와 Nginx 리버스 프록시 실습 | [상세 보기](docs/260909_docker-compose-nginx.md) |
| 2026-06-18 | 학습 정리 (5/27 ~ 6/18) | [상세 보기](docs/260618_pdf-study-review.md) |
| 2026-09-10 | 로그·메트릭 수집(PLG 스택 & Prometheus) 및 인프라 모니터링 실습 | [상세 보기](docs/260910_complex-back.md) |
| 2026-09-14 | AWS CLI로 ARM EC2에 Docker 애플리케이션 배포 | [상세 보기](docs/260914_aws-cli.md) |
| 2026-09-11 | complex-back2: Spring Boot 애플리케이션과 관측성 구성 | [상세 보기](docs/260911_complex-back2.md) |
| 2026-09-15 | AWS EC2 Docker Compose 배포와 Nginx 리버스 프록시 | [상세 보기](docs/260915_compose.md) |
| 2026-09-15 | Claude Code 협업 설정과 Spring Boot OAuth2·AI 프로젝트 점검 | [상세 보기](docs/260915_cc.md) |
| 2026-09-16 | AWS 관리형 서비스 연동과 무상태 구조 이해 | [상세 보기](docs/260916_aws.md) |


---

## 🛠 주제별 프로젝트 실습 (Project Logs)

| 프로젝트명 (Project) | 설명 (Description) | 상세 보기 (Link) |
| :--- | :--- | :--- |
| springai | 🌱 Spring AI 실습 프로젝트 (Movie Recommendation System) | [상세 보기](docs/springai.md) |
| springai2 | 🍃 Spring AI 2.0 실습 가이드 (Spring Boot 4.x + Groq AI) | [상세 보기](docs/springai2.md) |
| webmvc | 🍃 Spring Web MVC 실습 프로젝트 | [상세 보기](docs/webmvc.md) |
| thymeleaf | 🍃 Thymeleaf & Spring Boot 실습 프로젝트 (260804_thymeleaf) | [상세 보기](docs/thymeleaf.md) |
| querydsl | 🍓 Querydsl 실습 프로젝트 (Spring Boot + Spring Data JPA + Querydsl) | [상세 보기](docs/querydsl.md) |
| jpa | 🎮 JPA 게임 영웅 도감 실습 정리 | [상세 보기](docs/jpa.md) |
| FatDogAI | 🐶 FatDog AI | [상세 보기](docs/FatDogAI.md) |
| jpa2 | 🐾 JPA 실습 프로젝트: 반려동물 & 진료 예약 관리 서비스 (JPA2) | [상세 보기](docs/jpa2.md) |
| plan | 📅 정보처리기사 3과목 (데이터베이스 구축) D-23 합격 학습 계획서 | [상세 보기](docs/plan.md) |
| thssr | 📚 Spring Boot & Thymeleaf 도서 관리 시스템 (thssr) 실습 정리 | [상세 보기](docs/thssr.md) |
| springsupamemo | 📝 Spring SupaMemo: 스프링 MVC에서 Supabase 연동까지의 여정 | [상세 보기](docs/springsupamemo.md) |
| jpa3 | 📱 Spring Data JPA 실습 프로젝트 (JPA3) | [상세 보기](docs/jpa3.md) |
| todayfortune | 🔮 오늘의 운세 서비스 (todayfortune) 단계별 구현 가이드 | [상세 보기](docs/todayfortune.md) |
| worrydoll | 🧸 걱정인형 (Worrydoll) - Spring AI & RAG 실습 프로젝트 | [상세 보기](docs/worrydoll.md) |
| boot-legacy | 🚀 Boot Legacy 실습 프로젝트 | [상세 보기](docs/boot-legacy.md) |
| rag | 🚀 Spring AI RAG (Retrieval-Augmented Generation) 실습 프로젝트 | [상세 보기](docs/rag.md) |
| portfolio | 개인 포트폴리오 웹사이트 백업 📁 | [상세 보기](docs/portfolio.md) |
| HW-news | 객체 지향 설계 기반 뉴스 스크래퍼(News Scraper) 홈워크 📰🤖 | [상세 보기](docs/HW-news.md) |
| news-scraper | 뉴스 정보 수집 자동화 프로그램(News Scraper) 📰🤖 | [상세 보기](docs/news-scraper.md) |
| fatdog2 | 뚱냥이(FatDog) 스프링 부트 웹 프로젝트 V2 🐱🍃 | [상세 보기](docs/fatdog2.md) |
| til-skin | 바닐라 자바스크립트 기반 공부 일지(TIL) 스킨 프론트엔드 📝🎨 | [상세 보기](docs/til-skin.md) |
| board | 바닐라 자바스크립트 기반 미니 추리 보드 게임 웹 애플리케이션 🕵️‍♂️🃏 | [상세 보기](docs/board.md) |
| QandA | 바닐라 자바스크립트 텍스트 분석 및 음성 합성(TTS) 질의응답 웹 💬🔊 | [상세 보기](docs/QandA.md) |
| saju | 사주풀이 AI 융합 웹 애플리케이션 백엔드 🍃🔮 | [상세 보기](docs/saju.md) |
| spring-jdbc | 스프링 데이터 접근 - Spring JDBC & 드라이버 연동 🍃💾 | [상세 보기](docs/spring-jdbc.md) |
| archat | 스프링 백엔드 아키텍처 비교 실습 - Layered MVC vs Clean Architecture 🍃🏰 | [상세 보기](docs/archat.md) |
| mybatis | 스프링 부트 MyBatis SQL 매퍼(Mapper) 입문 V1 🍃💾 | [상세 보기](docs/mybatis.md) |
| spring | 스프링 코어(Spring Core) - IoC 컨테이너 & 스프링 빈(Bean) 기초 🍃🏛 | [상세 보기](docs/spring.md) |
| servlet | 자바 백엔드의 근본 - 서블릿(Servlet) 라이프사이클 & 스코프 ☕🔌 | [상세 보기](docs/servlet.md) |
| jsp | 자바 서버 페이지(JSP) 고급 기법 - 표현언어(EL) & JSTL 태그 라이브러리 🍃🎨 | [상세 보기](docs/jsp.md) |
| justchat | 자바 서블릿/JSP AI 연동 챗봇 & 도커 및 클라우드 배포 🐳💬 | [상세 보기](docs/justchat.md) |
| cookiesession | 자바 웹 상태 유지 기술 - 쿠키(Cookie) & 세션(Session) 🍪🔒 | [상세 보기](docs/cookiesession.md) |
| 260622HW | 자바 제어 로직 구현 코딩 홈워크 📝 | [상세 보기](docs/260622HW.md) |
| tli-skin | 티스토리 스킨 배포 규격본 🎨 | [상세 보기](docs/tli-skin.md) |
| tli | 티스토리(Tistory) 블로그 스킨 맞춤 커스터마이징 🎨🛠 | [상세 보기](docs/tli.md) |
| programmers-refactor-practice | 프로그래머스 리팩토링 및 클린 코드 자바 실습 ☕⚙ | [상세 보기](docs/programmers-refactor-practice.md) |
| aibe7-team2 | AIBE7 프로젝트 1 - 팀별 AI 여행 플래너 구현 모음 ✈🤖 | [상세 보기](docs/aibe7-team2.md) |
| plz2 | AIBE7 프로젝트 1 - Team 01 'MOTIPE' 백업용 워크스페이스 ✈🤖 | [상세 보기](docs/plz2.md) |
| plz | AIBE7 프로젝트 1 - Team 01 'MOTIPE' 정민 커스텀 개발 브랜치 ✈🤖 | [상세 보기](docs/plz.md) |
| HWHWHW | AIBE7 프로젝트 1 - Team 01 AI 여행 도우미 'MOTIPE' ✈🤖 | [상세 보기](docs/HWHWHW.md) |
| hw2_ex | CSS 스타일 연습 - 여행 테마별 랜딩페이지 실습 🎨✈ | [상세 보기](docs/hw2_ex.md) |
| temp_FatDogAI | FatDog AI 플랫폼 임시 스냅샷 디렉토리 📁 | [상세 보기](docs/temp_FatDogAI.md) |
| FatDogAi2 | FatDog AI 플랫폼 V2 - JPA & 도커 가상화 🐳🤖 | [상세 보기](docs/FatDogAi2.md) |
| Fatdogaiex | FatDog AI 확장 실습 플랫폼 🍃🤖 | [상세 보기](docs/Fatdogaiex.md) |
| HELP | MOTIPE - 지역 축제 기반 AI 여행 추천 플랫폼 | [상세 보기](docs/HELP.md) |
| mybatis3 | MyBatis 트랜잭션 제어 & 고급 커스텀 데이터베이스 설정 V3 🍃💾 | [상세 보기](docs/mybatis3.md) |
| mybatis2 | MyBatis SQL 매퍼 심화 - 동적 SQL & 복합 관계 매핑 V2 🍃💾 | [상세 보기](docs/mybatis2.md) |
| nim-rest-client | NIM REST Client (AI 기반 학습 계획 생성 시스템) | [상세 보기](docs/nim-rest-client.md) |
| 260807_fileupload | 💾 Spring Boot 파일 업로드 & 스토리지 연동 실습 정리 | [상세 보기](docs/260807_fileupload.md) |
| 260810_aifile | 📂 AI 파일 & 이미지 RAG 시스템 (PDF & Image RAG) 🚀 | [상세 보기](docs/260810_aifile.md) |
| 260811_imagegen | 🎨 Cloudflare Workers AI & Supabase 이미지 생성 프로젝트 (Imagegen) | [상세 보기](docs/260811_imagegen.md) |
| 260811_sec | 🔒 Spring Security 기초 실습 프로젝트 (Sec) | [상세 보기](docs/260811_sec.md) |
| 260812_sec_crud | 🔐 Spring Security & JPA CRUD 실습 프로젝트 (260812_sec_crud) | [상세 보기](docs/260812_sec_crud.md) |
| 260813_secu_social | 🔐 Spring Boot Security & JPA 소셜 로그인 실습 프로젝트 (secu) | [상세 보기](docs/260813_secu_social.md) |
| 260814_rest | 📌 Spring Boot 게시판 REST API 실습 프로젝트 (rest) | [상세 보기](docs/260814_rest.md) |
| 260818_rest_sec | 🔒 Spring Boot REST Security & JWT 실습 프로젝트 (rest-sec) | [상세 보기](docs/260818_rest_sec.md) |
| 260819_sec_jwt | 🔒 Spring Security & JWT 실습 프로젝트 (`sec-jwt`) | [상세 보기](docs/260819_sec_jwt.md) |
| 260820_jwt_fetch | 🍪 Spring Security + JWT + Redis Refresh Token 기반 인증 시스템 (jwt-fetch) | [상세 보기](docs/260820_jwt_fetch.md) |
| 260903_barohae | BaroHae - 긴급 업무 매칭 플랫폼 프로젝트 회고와 구현 기록 | [상세 보기](docs/260903_barohae.md) |
| 260907_infra | Docker와 Linux 기초 명령어 실습 | [상세 보기](docs/260907_infra.md) |
| 260908_docker-ghcr | Docker 네트워크와 GHCR 이미지 배포 실습 | [상세 보기](docs/260908_docker-ghcr.md) |
| 260909_docker-compose-nginx | Docker Compose 환경 분리와 Nginx 리버스 프록시 실습 | [상세 보기](docs/260909_docker-compose-nginx.md) |
| 260618_pdf-study-review | 학습 정리 (5/27 ~ 6/18) | [상세 보기](docs/260618_pdf-study-review.md) |
| 260910_complex-back | 로그·메트릭 수집(PLG 스택 & Prometheus) 및 인프라 모니터링 실습 | [상세 보기](docs/260910_complex-back.md) |
| 260914_aws-cli | AWS CLI로 ARM EC2에 Docker 애플리케이션 배포 | [상세 보기](docs/260914_aws-cli.md) |
| 260911_complex-back2 | complex-back2: Spring Boot 애플리케이션과 관측성 구성 | [상세 보기](docs/260911_complex-back2.md) |
| 260915_compose | AWS EC2 Docker Compose 배포와 Nginx 리버스 프록시 | [상세 보기](docs/260915_compose.md) |
| 260915_cc | Claude Code 협업 설정과 Spring Boot OAuth2·AI 프로젝트 점검 | [상세 보기](docs/260915_cc.md) |
| 260916_aws | AWS 관리형 서비스 연동과 무상태 구조 이해 | [상세 보기](docs/260916_aws.md) |


<!-- pdf-til-supplement:start -->
## TIL 부연 설명 — PDF와 연결하기

기존 실습 내용을 이해하기 위한 PDF 기반 부연 설명이다. 아래 예시는 개념을 설명하기 위한 것이며, 이 프로젝트에서 실행해 관찰한 결과와는 구분한다. 페이지 번호는 표지를 포함한 PDF 순서다.

함께 읽을 파일: [app.js](<app.js>) · [index.html](<index.html>) · [server.js](<server.js>)

### 배운 내용을 재현 가능한 TIL로 남기기

TIL은 사용한 기술 이름을 나열하는 데서 한 걸음 더 나아가 문제, 선택한 방법, 관찰 결과를 연결하는 기록이다. “왜 이 방법을 썼는가”와 “어떤 입력에서 확인했는가”를 적어야 나중에 다른 상황에도 적용할 수 있다. 실행하지 않은 예상 결과는 실제로 관찰한 결과와 구분한다.

**예시로 이해하기:** 예를 들어 “비동기를 배웠다” 대신 “타이머가 마지막에 출력되는 이유를 예상하고 실행 순서를 비교했다”처럼 적는다. 코드 링크, 입력값, 실제 출력, 틀렸던 가설을 함께 남기고 PDF의 개념 설명은 그 관찰을 해석하는 근거로 연결한다.

근거: 202 취업 목적의 개발자 회고 작성법 — [5쪽](<../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=5>) · [8쪽](<../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=8>) · [10쪽](<../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=10>) · [12쪽](<../260629_ex/새 폴더/6-16/202_취업_목적의_개발자_회고_작성법.pdf#page=12>)

<!-- pdf-til-supplement:end -->
