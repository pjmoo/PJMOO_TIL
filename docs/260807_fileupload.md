# 💾 Spring Boot 파일 업로드 & 스토리지 연동 실습 정리

이 프로젝트는 Spring Boot 환경에서 로컬 파일 시스템 업로드부터 시작하여 데이터베이스 연동(PostgreSQL), 엔티티 관계 설정(1:N 다중 이미지 업로드), 그리고 클라우드 오브젝트 스토리지(AWS S3 / Supabase Storage) 연동 및 스트리밍 서비스 구현까지의 파일 업로드 흐름을 단계별로 실습한 내용입니다.

---

## 📑 목차
1. [개발 환경 및 기술 스택](#1-개발-환경-및-기술-스택)
2. [1단계: 로컬 파일 업로드 (LocalFileStore)](#2-1단계-로컬-파일-업로드-localfilestore)
3. [2단계: JPA Auditing & 사용자 프로필 등록 (UserProfile)](#3-2단계-jpa-auditing--사용자-프로필-등록-userprofile)
4. [3단계: 영화 다중 이미지 등록 (1:N 관계 매핑)](#4-3단계-영화-다중-이미지-등록-1n-관계-매핑)
5. [4단계: 클라우드 S3 스토리지 연동 및 파일 스트리밍 (S3FileStore)](#5-4단계-클라우드-s3-스토리지-연동-및-파일-스트리밍-s3filestore)
6. [설정 및 실행 방법](#6-설정-및-실행-방법)

---

## 1. 개발 환경 및 기술 스택
* **Core**: Java 17, Spring Boot 4.1.0, Gradle
* **Database**: Spring Data JPA, H2 (로컬 테스트용), PostgreSQL (Supabase)
* **Storage**: Local File System, AWS S3 (Supabase Storage 연동)
* **View**: Thymeleaf, HTML5, CSS3
* **Libraries**: Lombok, Spring Cloud AWS Starter S3, Spring Validation

---

## 2. 1단계: 로컬 파일 업로드 (LocalFileStore)
기본적인 로컬 저장 장치에 파일을 저장하고 웹에 렌더링하는 보안 가이드라인이 반영된 로컬 파일 업로드 로직입니다.

### 보안 위협 방어
* `StringUtils.cleanPath()`를 사용하여 파일 경로를 왜곡하는 디렉터리 트래버스 공격을 방지합니다.
* 파일 저장 시 `UUID` 조합 이름(예: `UUID.확장자`)으로 변경하여 중복된 파일명 덮어쓰기 현상을 방지합니다.

### 확장자 및 용량 검증
* **지원 확장자 제한**: `jpg`, `jpeg`, `png`, `gif`, `webp` 이외의 악성 파일 업로드를 서버 단에서 차단합니다.
* `application-file.yaml` 파일의 `max-file-size` 설정을 통해 업로드 용량 제한을 설정했습니다. (HTTP 413 Payload Too Large 방지 목적의 상향 조정 완료)

### 정적 경로 매핑
* `WebConfig`에서 `addResourceHandlers`를 사용하여 외부 저장 경로(`src/main/resources/static/upload/`)를 웹 URL 경로(`/upload/**`)로 매핑하여 브라우저에서 바로 접근 및 프리뷰할 수 있도록 했습니다.

---

## 3. 2단계: JPA Auditing & 사용자 프로필 등록 (UserProfile)
등록 일자 및 수정 일자 자동 기록 설정과 이미지 파일 정보를 데이터베이스 테이블에 연결하는 기초 단계입니다.

### JPA Auditing
* `@CreatedDate` 및 `@LastModifiedDate`가 포함된 `BaseEntity`를 추상 클래스로 두고, 모든 엔티티가 이를 상속받아 등록 시간 정보를 자동으로 트래킹합니다.
* `@EnableJpaAuditing` 설정을 위해 `JpaConfig` 분리 설정을 적용했습니다.

### Thymeleaf 폼 바인딩
* `UserProfileController`에서 Thymeleaf의 `th:object`와 `th:field`를 사용하여 폼 데이터와 유효성 검증(`@Valid`) 결과의 편리한 처리를 진행했습니다.
* 유저 정보와 이미지 경로 정보를 데이터베이스에 온전히 기록합니다.

---

## 4. 3단계: 영화 다중 이미지 등록 (1:N 관계 매핑)
한 명의 영화 정보에 다수의 스틸컷/포스터 이미지를 등록하는 실습입니다.

### 엔티티 연관관계 설정
* 한 영화(`MovieEntity`)는 여러 이미지(`MovieImageEntity`)를 가질 수 있도록 `@OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)`로 연결했습니다.

### N+1 쿼리 성능 개선
* 목록 조회 시 각 영화마다 관련 이미지를 가져오는 추가 쿼리가 발생하는 성능 문제(N+1 문제)를 방지하기 위해, JPA의 `@EntityGraph(attributePaths = {"images"})` 속성을 적용해 한 번의 조인 쿼리로 다중 이미지 관계 데이터를 효율적으로 조회합니다.

---

## 5. 4단계: 클라우드 S3 스토리지 연동 및 파일 스트리밍 (S3FileStore)
로컬 저장 방식의 한계를 극복하고 실무 환경과 동일하게 클라우드 분산 파일 스토리지로 마이그레이션한 최종 실습입니다.

### 스프링 클라우드 S3 연동
* `spring-cloud-aws-starter-s3` 라이브러리를 추가하여, 기존 AWS SDK 설정을 간편하게 Spring Boot Autoconfiguration으로 바인딩하였습니다.
* `StorageProperty` 레코드를 통해 외부 설정 속성(`app.storage`)을 주입받아 사용하고 `@Validated`를 통해 누락된 정보 유효성 검사를 자동으로 통과하게 구성했습니다.

### `@Primary`를 통한 다형성 구현
* `FileStore` 인터페이스를 선언하고 기존 `LocalFileStore`와 신규 `S3FileStore`를 다형적으로 설계했습니다.
* `S3FileStore` 클래스 상단에 `@Primary` 어노테이션을 부여함으로써 기존 컨트롤러의 소스 코드 변경 없이 파일 저장 방식이 로컬에서 S3로 원클릭 전환되도록 아키텍처를 유연하게 구성했습니다.

### S3 파일 직접 스트리밍
* 외부 보안 및 비공개 S3 버킷 환경을 고려해 S3 객체의 URI를 바로 외부에 노출하지 않고, Spring Boot 서버가 S3에서 바이너리 데이터를 직접 가져와 스트리밍하는 파일 뷰 컨트롤러(`FileViewController` -> `/upload/{id}`)를 구축했습니다.

---

## 6. 설정 및 실행 방법

### 1. 용량 제한 설정 (`application-file.yaml`)
기본 1MB 크기 제한으로 인한 업로드 실패 문제를 차단하기 위해 아래와 같이 제한 한도를 확대하였습니다.

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB      # 단일 파일 최대 용량
      max-request-size: 50MB   # 전체 요청 최대 용량
```

### 2. 로컬 환경 변수 셋업
데이터베이스와 Supabase S3 연결 정보는 보안을 위해 로컬 파일인 `.env.dev` 파일에 설정해야 합니다. 
상세한 변수 키 목록은 프로젝트 루트에 위치한 `.env.dev.example` 파일을 참조하여 설정해 주세요.

> [!WARNING]
> `.env.dev` 파일은 보안상 절대로 Git 저장소에 커밋되어선 안 됩니다. (이미 `.gitignore`에 등록되어 있습니다.)

### 3. 실행 단계
1. `.env.dev.example` 템플릿을 참고하여 루트 디렉터리에 `.env.dev` 파일을 작성합니다.
2. 로컬 데이터베이스 또는 Supabase DB 컨테이너 상태를 점검합니다.
3. Gradle을 통해 빌드 및 기동합니다:
   ```bash
   ./gradlew bootRun
   ```
4. 웹 브라우저에서 `http://localhost:8080`에 접속하여 영화 등록, 다중 이미지 업로드 및 유저 프로필 등록 페이지를 테스트합니다.
