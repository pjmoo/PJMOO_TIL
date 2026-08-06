# 🎬 영화 관리 서비스 실습 정리 (Frag)

이 프로젝트는 Spring Boot, Spring Data JPA, Thymeleaf를 사용하여 영화 정보를 등록, 조회, 수정, 삭제(CRUD)할 수 있는 웹 서비스입니다. 

오늘 실습한 핵심 내용들을 초보자의 눈높이에 맞춰 단계별로 정리했습니다.

---

## 📑 목차
1. [Lombok과 JPA 엔티티 설계](#1-lombok과-jpa-엔티티-설계)
2. [아키텍처 설계 (Repository & Service)](#2-아키텍처-설계-repository--service)
3. [화면(Thymeleaf)과 DTO 활용](#3-화면thymeleaf과-dto-활용)
4. [공통 레이아웃 분리 (Thymeleaf Fragments)](#4-공통-레이아웃-분리-thymeleaf-fragments)
5. [데이터 중복 방지와 예외 처리 (Exception Handling)](#5-데이터-중복-방지와-예외-처리-exception-handling)
6. [💡 트러블슈팅 (실습 꿀팁)](#-트러블슈팅-실습-꿀팁)

---

## 1. Lombok과 JPA 엔티티 설계

데이터베이스의 테이블과 매핑되는 자바 객체인 **엔티티(Entity)**를 설계하고, 반복 코드를 줄여주는 라이브러리인 **Lombok**을 적용했습니다.

### 공통 필드 분리 (`BaseEntity`)
모든 테이블에 공통으로 들어가는 `id`(기본키), `createdAt`(생성일), `updatedAt`(수정일) 필드를 `BaseEntity`에 모아 관리합니다.
* `@MappedSuperclass`: 자식 엔티티 클래스들에게 매핑 정보를 상속해 줍니다.
* `@EntityListeners(AuditingEntityListener.class)`: 생성일과 수정일을 자동으로 기록해 줍니다.

### 영화 엔티티 (`MovieEntity`)
영화의 `title`(제목)과 `price`(가격) 정보를 가집니다.
* `@Builder`: 빌더 패턴을 적용하여 안전하고 직관적인 객체 생성을 도와줍니다.
* `@NoArgsConstructor` & `@AllArgsConstructor`: JPA가 엔티티를 다룰 때 필수적인 생성자들을 자동으로 만들어 줍니다.

---

## 2. 아키텍처 설계 (Repository & Service)

역할별로 클래스를 분리하여 코드가 복잡해져도 유지보수하기 쉽게 만들었습니다.

* **Repository (저장소 레이어)**
  * 데이터베이스에 직접 접근하는 역할을 합니다.
  * `MovieJpaRepository`는 Spring Data JPA가 제공하는 `JpaRepository`를 상속하여 기본적인 CRUD 쿼리를 코드 한 줄 없이 동작하게 만듭니다.
* **Service (비즈니스 로직 레이어)**
  * 실제 서비스의 핵심 규칙과 흐름을 관리합니다.
  * 컨트롤러와 데이터 레이어 사이에서 가교 역할을 수행합니다.

---

## 3. 화면(Thymeleaf)과 DTO 활용

### DTO (Data Transfer Object) 왜 쓸까요?
데이터베이스와 매핑된 **엔티티(Entity)를 직접 웹 화면으로 전달하면 안 됩니다.** 
화면의 요구사항은 언제든지 바뀔 수 있고, 엔티티가 직접 노출되면 보안상 위험하기 때문에 **데이터 전송 전용 객체인 DTO**를 만들어 사용했습니다.
* `MovieFormDTO`: 등록 및 수정 폼 입력 데이터를 받아오기 위한 DTO
* `MovieViewDTO`: 상세 및 목록 화면에 영화 정보를 출력하기 위한 DTO

### Thymeleaf를 활용한 CRUD 기능 구현
* **조회 (`GET /movies`)**: 영화 목록을 바인딩하여 출력합니다.
* **등록 (`POST /movies/new`)**: 영화 이름과 가격을 입력받아 DB에 추가합니다.
* **상세 (`GET /movies/{id}`)**: 특정 영화의 상세 정보를 표시합니다.
* **수정 (`POST /movies/{id}/edit`)**: 등록 화면 템플릿을 재사용하여 정보를 수정합니다.
* **삭제 (`POST /movies/{id}/delete`)**: 등록된 영화를 제거합니다.

---

## 4. 공통 레이아웃 분리 (Thymeleaf Fragments)

웹 페이지마다 들어가는 중복 코드(헤더 영역, 상단 네비게이션 바 등)를 매번 쓰지 않고, 한 곳에 모아 모듈화했습니다.

* `templates/fragments/head.html`: 공통 `<head>` 정보 (CSS 로드 등)
* `templates/fragments/nav.html`: 공통 상단 네비게이션 메뉴 바
* `templates/fragments/errorMsg.html`: 에러 발생 시 경고창 템플릿

사용할 때는 html 태그에 `th:replace="~{fragments/nav :: nav}"`와 같이 삽입하여 재사용합니다.

---

## 5. 데이터 중복 방지와 예외 처리 (Exception Handling)

### 유니크 제약조건 (`@Column(unique = true)`)
영화 이름이 같으면 데이터베이스에 등록되지 않도록 `title` 컬럼에 `UNIQUE` 제약조건을 설정했습니다.

### 전역 예외 처리 (`@ControllerAdvice`)
컨트롤러 곳곳에서 발생하는 예외를 한 곳에서 처리할 수 있도록 `MovieErrorController`를 구성했습니다.
* `@ExceptionHandler`: 특정 예외가 발생했을 때 이를 캐치하여 전용 에러 화면(`error/unique.html`, `error/404.html`)으로 사용자에게 친절한 문구와 함께 유도합니다.

---

## 💡 트러블슈팅 (실습 꿀팁)

### Q. 엔티티에 `@Column(unique = true)`를 추가했는데도 중복 데이터가 계속 등록돼요!
* **원인**: Hibernate 설정이 `spring.jpa.hibernate.ddl-auto: update`로 설정된 경우, 이미 생성되어 존재하는 테이블 컬럼에 `unique` 제약조건을 새로 추가하지 못하는 데이터베이스의 한계 때문입니다.
* **해결방법**: 
  1. 개발 환경이라면 데이터베이스 툴에서 **`DROP TABLE movies;`** 쿼리로 테이블을 완전히 지운 후 프로젝트를 재시작합니다.
  2. 서버가 켜지면서 새롭게 테이블을 만들고 `UNIQUE` 제약조건을 정상적으로 탑재하게 됩니다.
