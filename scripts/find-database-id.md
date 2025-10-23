# 📝 Notion 데이터베이스 ID 찾는 방법

## 🎯 문제 상황
현재 `.env.local`에 설정된 ID가 **페이지 ID**입니다.
블로그 포스트를 관리하는 **데이터베이스 ID**를 찾아야 합니다.

---

## ✅ 올바른 데이터베이스 ID 찾기

### 1️⃣ Notion에서 데이터베이스 열기

**중요**: 개별 포스트 페이지가 아닌, **포스트 목록을 보여주는 데이터베이스(테이블/보드)**를 열어야 합니다.

```
❌ 잘못된 예: 개별 포스트 페이지
   "첫 번째 블로그 글" 페이지 열기

✅ 올바른 예: 포스트 목록 데이터베이스
   "Blog Posts" 테이블 또는 "블로그 관리" 데이터베이스 열기
```

---

### 2️⃣ URL 형식 확인

#### ❌ **페이지 URL** (현재 설정 - 잘못됨)
```
https://www.notion.so/Title-292ac0e6aa5280f6a3d3e785e1ab04c7
```
- 하이픈 없는 32자 ID
- 개별 페이지를 가리킴

#### ✅ **데이터베이스 URL** (올바름)
```
https://www.notion.so/workspace/1234567890abcdef1234567890abcdef?v=...
```
또는
```
https://www.notion.so/1234567890abcdef1234567890abcdef?v=...
```
- 하이픈 없는 32자 ID
- `?v=` 뒤에 뷰 ID가 붙음 (중요!)
- 데이터베이스를 가리킴

---

### 3️⃣ 데이터베이스 찾는 단계별 가이드

1. **Notion 워크스페이스 열기**
2. **좌측 사이드바에서 블로그 포스트 데이터베이스 찾기**
   - "Blog Posts", "블로그", "Articles" 등의 이름
   - 📊 데이터베이스 아이콘이 있음 (테이블, 보드, 갤러리 등)
3. **데이터베이스 클릭하여 열기**
4. **브라우저 주소창의 URL 복사**
5. **URL에서 데이터베이스 ID 추출**

---

### 4️⃣ URL에서 ID 추출 예시

**전체 URL**:
```
https://www.notion.so/myworkspace/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6?v=9876543210
```

**데이터베이스 ID** (하이픈 제거):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### 5️⃣ 데이터베이스 구조 확인

데이터베이스에 다음 속성이 있는지 확인하세요:

- ✅ **Title** (제목)
- ✅ **Slug** (URL 경로)
- ✅ **Status** (Publish/Draft)
- ✅ **Date** (날짜)
- ✅ **Tags** (태그)
- ✅ **Description** (설명)
- ⭕ **CoverImage** (커버 이미지 - 선택)
- ⭕ **Author** (작성자 - 선택)

---

## 🔧 .env.local 업데이트 방법

올바른 데이터베이스 ID를 찾았으면 `.env.local` 파일을 업데이트하세요:

```bash
NOTION_API_KEY=secret_your_api_key_here
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # 새 데이터베이스 ID
```

---

## 🎬 데이터베이스가 없는 경우

블로그 포스트를 관리하는 데이터베이스가 없다면 새로 만들어야 합니다:

### 새 데이터베이스 만들기

1. Notion에서 **새 페이지** 생성
2. **Table - Database** 선택
3. 다음 속성 추가:
   - Title (기본 제공)
   - Slug (Text)
   - Status (Select: Publish, Draft)
   - Date (Date)
   - Tags (Multi-select)
   - Description (Text)
   - Author (Text)

4. 데이터베이스 페이지를 열고 URL에서 ID 복사

---

## 💡 팁

- 데이터베이스 URL에는 항상 `?v=` 파라미터가 포함됩니다
- 개별 페이지 URL에는 `?v=` 파라미터가 없습니다
- 데이터베이스 아이콘: 📊, 📋, 🗂️
- 페이지 아이콘: 📄

---

## 🆘 여전히 찾을 수 없는 경우

Notion API를 사용하여 워크스페이스의 모든 데이터베이스를 검색할 수 있습니다.
(이 기능은 별도 스크립트로 제공 가능)
