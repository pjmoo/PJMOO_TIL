# 📚 Spring Boot & Thymeleaf 도서 관리 시스템 (thssr) 실습 정리

이 프로젝트는 **Spring Boot**, **Spring Data JPA**, 그리고 **Thymeleaf**를 사용하여 간단한 도서 관리 시스템을 구축하는 실습 프로젝트입니다. 
초보자분들도 쉽게 이해할 수 있도록 오늘 구현하고 실습한 파일들의 역할과 핵심 개념들을 정리했습니다.

---

## 🏗️ 전체 아키텍처 구조

이 서비스는 웹 브라우저(HTML 화면)부터 데이터베이스(DB)까지 아래와 같은 흐름으로 데이터를 주고받습니다:

```
[ 브라우저 (HTML 화면) ] <----> [ Controller (컨트롤러) ] <----> [ Service (비즈니스 로직) ] <----> [ Repository (데이터 저장소) ] <----> [ Database (H2 DB) ]
```

---

## 📂 실습 파일 및 역할 소개

### 1. ⚙️ 설정 관련 파일 (Configuration & Properties)

#### 📝 [JpaConfig.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/config/JpaConfig.java)
* **역할**: JPA Auditing(자동 시간 기록 기능)을 활성화합니다.
* **설명**: `@EnableJpaAuditing` 애노테이션을 설정하여 데이터가 생성되거나 수정될 때 생성 시간과 수정 시간을 자동으로 DB에 기록해 주는 기능을 켭니다.

#### 📝 [CustomProperties.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/config/CustomProperties.java)
* **역할**: `application.yaml` 설정 파일에 적어둔 커스텀 값들을 안전하게 Java 객체로 가져옵니다.
* **설명**: 스프링 부트에서 제공하는 외부 설정 바인딩 기능(`@ConfigurationProperties`)을 활용하여, 사이트의 소유자(site-owner) 등 관리 정보를 자바의 `record` 객체로 자동 바인딩합니다.

#### 📝 [ThssrApplication.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/ThssrApplication.java)
* **역할**: 애플리케이션의 시작점(메인 클래스)입니다.
* **설명**: `@ConfigurationPropertiesScan` 애노테이션을 추가하여, `CustomProperties` 같은 설정 클래스들을 스프링이 자동으로 찾아서 빈(Bean)으로 등록하게 했습니다.

#### 📝 [application.yaml](file:///C:/workspace/thssr/src/main/resources/application.yaml)
* **역할**: 애플리케이션의 환경 설정 파일입니다.
* **설명**: 데이터베이스 연결 정보, Thymeleaf 캐시 설정 및 사이트 소유자 정보(`custom.site-owner`)를 정의합니다.

#### 📝 [messages.properties](file:///C:/workspace/thssr/src/main/resources/messages.properties)
* **역할**: 유효성 검증 실패 시 화면에 보여줄 **친절한 한글 에러 메시지**를 정의합니다.
* **설명**: 빈 유효성 검증(Bean Validation) 도중 에러가 나면 기본 영어 에러 메시지 대신 한글 메시지(예: `공백일 수 없습니다`)가 출력되도록 연결해 줍니다.

---

### 2. 🗄️ 데이터베이스 및 엔티티 (Database & Entity)

#### 📝 [BaseEntity.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/model/entity/BaseEntity.java)
* **역할**: 모든 DB 테이블이 공통으로 가지는 기본 정보를 정의한 부모 클래스입니다.
* **설명**: 모든 데이터의 고유 식별자(`id`)와 생성 시간(`createdAt`), 수정 시간(`updatedAt`)을 공통으로 관리합니다. 식별자 자동 생성 전략을 `IDENTITY`로 설정하여 DB가 알아서 ID를 증가(Auto Increment)시키도록 설정했습니다.

#### 📝 [BookEntity.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/model/entity/BookEntity.java)
* **역할**: 실제 데이터베이스 내 **도서(Book) 테이블**과 1:1로 매핑되는 객체입니다.
* **설명**: 도서의 제목(title), 저자(author), 카테고리(category), 가격(price) 필드를 가지고 있으며 도서 정보를 데이터베이스에 저장하고 수정할 때 원본 데이터 역할을 수행합니다.

---

### 3. 💾 데이터 저장소 및 서비스 (Repository & Service)

#### 📝 [BookJpaRepository.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/model/repository/BookJpaRepository.java)
* **역할**: Spring Data JPA가 제공하는 강력한 DB 조작 인터페이스입니다.
* **설명**: SQL 쿼리를 직접 짜지 않아도 이름 규칙에 맞춰 메서드를 선언(예: `findByTitleContaining`)하면 스프링이 알아서 제목으로 도서를 검색하는 쿼리를 만들어 줍니다.

#### 📝 [BookRepository.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/model/repository/BookRepository.java) & [BookRepositoryImpl.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/model/repository/BookRepositoryImpl.java)
* **역할**: 서비스 계층과 DB 데이터 계층을 느슨하게 연결(디커플링)하기 위한 추상화 인터페이스와 그 구현체입니다.

#### 📝 [BookService.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/service/BookService.java)
* **역할**: 도서 관리의 모든 비즈니스 로직(저장, 상세 조회, 수정, 삭제, 검색)을 담당하는 중심부입니다.
* **설명**: 컨트롤러로부터 요청을 받아 필요한 가공 처리를 하고 저장소를 통해 영구적으로 데이터를 변경합니다.

---

### 4. 📤 데이터 전달 및 검증 (DTO & Validation)

#### 📝 [BookFormDTO.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/dto/BookFormDTO.java)
* **역할**: 화면 입력 폼의 데이터를 주고받기 위한 **전용 데이터 바구니(DTO)**입니다.
* **설명**: 엔티티 객체를 화면에 직접 노출하지 않고 안전하게 입력값만을 걸러내어 사용합니다. 빈 검증 애노테이션을 부착하여 검증 규칙을 설정했습니다.
  * `@NotBlank`: 공백이나 null을 허용하지 않음 (도서명, 저자, 카테고리)
  * `@NotNull`: 필수 입력 값 (가격)
  * `@Min(1000)`: 책 가격은 최소 1,000원 이상이어야 함

#### 📝 [Update.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/dto/Update.java)
* **역할**: 도서 정보 **수정(Update) 단계에만** 적용할 검증 그룹을 구분하기 위한 마커 인터페이스입니다.
* **설명**: 책을 새로 등록할 때는 ID가 없지만, 수정할 때는 수정하려는 책의 고유 ID가 필수적입니다. 이처럼 수정 상황에만 ID 검증을 활성화하기 위해 검증 그룹(Validation Group)을 지정하여 처리했습니다.

---

### 5. 🎮 웹 요청 처리 (Controller)

#### 📝 [BookController.java](file:///C:/workspace/thssr/src/main/java/org/example/thssr/controller/BookController.java)
* **역할**: 웹 브라우저의 모든 요청(URL 주소 입력, 버튼 클릭, 폼 제출)을 받아 적절한 응답 화면이나 처리를 실행합니다.
* **주요 기능**:
  * **도서 목록 및 검색**: `@RequestParam(defaultValue = "") String keyword`을 사용하여 사용자가 검색어를 입력하지 않으면 전체를 보여주고, 입력하면 제목 기반으로 필터링하여 보여줍니다.
  * **도서 등록 및 수정**:
    * 신규 등록 시에는 일반 검증을 적용하고, 수정 시에는 `@Validated(Update.class)`를 적용하여 수정용 검증 그룹만 따로 체크합니다.
    * 특정 카테고리(예: "소설")의 도서는 가격이 너무 저렴하면 안 되는 복합 로직의 경우, `bindingResult.reject()`를 호출해 글로벌 에러(특정 필드가 아닌 객체 전체의 에러)를 동적으로 발생시켰습니다.
  * **일회성 메시지 전달 (Flash Attribute)**: 도서의 등록, 수정, 삭제 처리가 완료되고 나면 브라우저가 첫 화면으로 리다이렉트되는데, 이때 딱 한 번만 화면에 "성공했습니다!"라는 알림 배너가 뜨도록 `RedirectAttributes`의 `addFlashAttribute`를 사용했습니다.

---

### 6. 🖥️ 화면 템플릿 (Thymeleaf HTML View)

스프링 웹 서버에서 데이터를 동적으로 결합하여 최종 HTML을 완성해 주는 Thymeleaf 템플릿 엔진 파일들입니다.

#### 📝 [index.html](file:///C:/workspace/thssr/src/main/resources/templates/index.html)
* **설명**: 메인 도서 목록 및 제목 검색 화면입니다.
  * 상단에 설정 파일에서 읽어온 사이트 소유자 명을 동적으로 표시합니다.
  * 등록, 수정, 삭제 성공 시 전달된 플래시 속성을 활용해 화면 상단에 녹색 알림 배너를 띄웁니다.
  * 검색 창을 배치하여 키워드로 실시간 도서 필터링이 가능합니다.

#### 📝 [form.html](file:///C:/workspace/thssr/src/main/resources/templates/form.html)
* **설명**: 도서의 등록과 수정을 동시에 처리하는 똑똑한 입력 폼입니다.
  * Thymeleaf의 `th:object="${bookForm}"`을 통해 입력값들을 컨트롤러 DTO와 유연하게 연동합니다.
  * 유효성 검증(Validation) 도중 에러가 나면 `th:errors`를 통해 사용자가 적어 넣은 값 바로 밑에 붉은 글씨로 커스텀 에러 메시지를 출력합니다.
  * 에러가 난 필드는 `th:errorclass`에 의해 테두리가 붉은색으로 변해 입력 오류가 있음을 시각적으로 바로 알려줍니다.

#### 📝 [detail.html](file:///C:/workspace/thssr/src/main/resources/templates/detail.html)
* **설명**: 등록된 도서의 상세 내용을 보여주는 페이지로, 이곳에서 도서 정보를 수정하거나 삭제할 수 있는 액션 버튼을 제공합니다.

---

## 💡 오늘 실습에서 배운 가장 중요한 핵심 개념 (핵심 트러블슈팅)

### 🚨 BindingResult의 필수 매개변수 위치 규칙
스프링 MVC 컨트롤러에서 데이터 유효성 검증(`@Validated` 등) 결과를 받아내기 위해 `BindingResult` 객체를 사용할 때는 **반드시 검증 대상 객체 바로 다음에 적어야 합니다.**
```java
// 🙆‍♂️ 올바른 위치 (검증 대상 바로 다음)
public String updateBook(@Validated(Update.class) @ModelAttribute("bookForm") BookFormDTO bookFormDTO,
                         BindingResult bindingResult, 
                         RedirectAttributes redirectAttributes)

// 🙅‍♂️ 잘못된 위치 (사이에 다른 인자가 있으면 예외가 발생하거나 검증 결과가 템플릿으로 전달되지 않음)
public String updateBook(@Validated(Update.class) @ModelAttribute("bookForm") BookFormDTO bookFormDTO,
                         RedirectAttributes redirectAttributes,
                         BindingResult bindingResult)
```
이 순서를 어기면 스프링이 에러 바인딩을 처리하지 못하고 400 Bad Request 에러 등을 뱉어내기 때문에 항상 기억해야 합니다!
