# 개발자 가이드

> 이 가이드는 로컬 개발 환경을 설정하고 프로젝트를 커스터마이징하려는 개발자를 위한 문서입니다.
> 비개발자분들은 [비개발자를 위한 완전 가이드](./NON_DEVELOPER_GUIDE.md)를 참고하세요.

**⏱️ 소요 시간**: 약 30-60분
**📋 필요한 것**: Node.js 20+, Git, GitHub 계정, Notion 계정

---

## 📌 목차

<!-- TOC -->
* [개발자 가이드](#개발자-가이드)
  * [📌 목차](#-목차)
  * [1. 사전 준비](#1-사전-준비)
    * [필수 요구사항](#필수-요구사항)
    * [선택 요구사항](#선택-요구사항)
    * [설치 확인](#설치-확인)
  * [2. 프로젝트 Fork 및 Clone](#2-프로젝트-fork-및-clone)
    * [Step 1: GitHub에서 Fork](#step-1-github에서-fork)
    * [Step 2: 로컬에 Clone](#step-2-로컬에-clone)
  * [3. Notion 설정](#3-notion-설정)
    * [필수 설정](#필수-설정)
    * [선택 설정](#선택-설정)
  * [4. GitHub 설정](#4-github-설정)
    * [Step 1: Secrets 등록](#step-1-secrets-등록)
    * [Step 2: GitHub Pages 활성화](#step-2-github-pages-활성화)
    * [Step 3: Actions 권한 설정](#step-3-actions-권한-설정)
  * [5. 로컬 개발 환경 설정](#5-로컬-개발-환경-설정)
    * [Step 1: 환경 변수 설정](#step-1-환경-변수-설정)
    * [Step 2: 개발 서버 실행](#step-2-개발-서버-실행)
    * [Step 3: 빌드 테스트](#step-3-빌드-테스트)
  * [6. 블로그 배포](#6-블로그-배포)
    * [자동 배포 (권장)](#자동-배포-권장)
    * [로컬 배포 테스트](#로컬-배포-테스트)
  * [7. 커스터마이징](#7-커스터마이징)
    * [프로필 수정](#프로필-수정)
    * [테마 색상 변경](#테마-색상-변경)
    * [페이지네이션 개수 변경](#페이지네이션-개수-변경)
    * [타이포그래피 스타일 변경](#타이포그래피-스타일-변경)
  * [8. 테스트](#8-테스트)
    * [Unit Tests](#unit-tests)
    * [E2E Tests](#e2e-tests)
  * [9. 문제 해결](#9-문제-해결)
    * [빌드 실패](#빌드-실패)
    * [Notion 데이터가 안 보임](#notion-데이터가-안-보임)
    * [이미지가 안 보임](#이미지가-안-보임)
    * [TypeScript 오류](#typescript-오류)
  * [📚 추가 자료](#-추가-자료)
  * [🤝 기여하기](#-기여하기)
<!-- TOC -->

---

## 1. 사전 준비

### 필수 요구사항

- ✅ **Node.js 20+** - [다운로드](https://nodejs.org/)
- ✅ **Git** - [다운로드](https://git-scm.com/)
- ✅ **GitHub 계정** - [가입](https://github.com/signup)
- ✅ **Notion 계정** (무료) - [가입](https://www.notion.so/signup)

### 선택 요구사항

- ⭕ **Google Analytics 계정** - 방문자 추적을 원하는 경우
- ⭕ **Google AdSense 계정** - 광고 수익을 원하는 경우
- ⭕ **VS Code** - 추천 코드 에디터

### 설치 확인

터미널에서 다음 명령어로 설치를 확인하세요:

```bash
node --version  # v20.0.0 이상
npm --version   # v10.0.0 이상
git --version   # v2.0.0 이상
```

---

## 2. 프로젝트 Fork 및 Clone

### Step 1: GitHub에서 Fork

1. [프로젝트 저장소](https://github.com/freelife1191/nextjs-notion-blog) 접속
2. 우측 상단의 **Fork** 버튼 클릭
3. Repository name을 원하는 이름으로 변경
   - User Site 방식 (권장): `username.github.io`
   - Project Site 방식: 자유롭게 (예: `my-blog`)
4. **Create fork** 클릭

### Step 2: 로컬에 Clone

```bash
# Fork한 저장소 Clone
git clone https://github.com/<your-username>/<repo-name>.git

# 프로젝트 디렉토리로 이동
cd <repo-name>

# 의존성 설치
npm install
```

**설치 확인:**
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → 블로그가 보이면 성공!

---

## 3. Notion 설정

Notion을 CMS로 사용하기 위한 설정입니다.

> 📖 **상세 가이드**: [Notion 설정 가이드](./NOTION_SETUP_GUIDE.md)

### 필수 설정

1. **Integration 생성**
   - [Notion Integrations](https://www.notion.so/my-integrations) 접속
   - "New integration" 클릭
   - Name: `nextjs-blog` (또는 원하는 이름)
   - Type: `Internal` 선택
   - **API Key 복사** (나중에 사용)

2. **Posts 데이터베이스 생성**
   - Notion에서 새 페이지 생성
   - `/database` 입력하여 데이터베이스 추가
   - 필수 속성 추가:
     - `Title` (제목)
     - `Slug` (URL 경로)
     - `Status` (Select: Publish, Draft, Hidden, Wait)
     - `Date` (날짜)
     - `Tags` (Multi-select, 선택)
     - `Label` (Select, 선택)

3. **Integration 연결**
   - 데이터베이스 우측 상단 `⋯` → "Add connections"
   - 만든 Integration 선택

4. **Database ID 복사**
   - 데이터베이스 URL: `https://notion.so/[32자리ID]?v=...`
   - `?v=` 앞의 32자리 ID를 복사

### 선택 설정

- 👤 **Profile 데이터베이스**: 프로필 정보
- ⚙️ **Site 데이터베이스**: 사이트 설정
- 📄 **About 페이지**: 소개 페이지

자세한 내용은 [Notion 설정 가이드](./NOTION_SETUP_GUIDE.md)를 참고하세요.

---

## 4. GitHub 설정

### Step 1: Secrets 등록

GitHub Actions가 Notion에 접근할 수 있도록 환경 변수를 등록합니다.

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 다음 Secret들을 추가:

| Name | Value | 설명 |
|------|-------|------|
| `NOTION_API_KEY` | `secret_xxxxx...` | Integration API Key |
| `NOTION_DATABASE_ID` | `32자리ID` | Posts 데이터베이스 ID |
| `NOTION_PROFILE_DATABASE_ID` | `32자리ID` | Profile 데이터베이스 ID (선택) |
| `NOTION_SITE_DATABASE_ID` | `32자리ID` | Site 데이터베이스 ID (선택) |
| `NOTION_ABOUT_PAGE_ID` | `32자리ID` | About 페이지 ID (선택) |
| `NEXT_PUBLIC_SITE_URL` | `https://username.github.io` | 블로그 URL |

### Step 2: GitHub Pages 활성화

1. **Settings** → **Pages**
2. **Source**: `GitHub Actions` 선택
3. 저장 (자동 저장됨)

### Step 3: Actions 권한 설정

1. **Settings** → **Actions** → **General**
2. **Workflow permissions**:
   - `Read and write permissions` 선택
   - `Allow GitHub Actions to create and approve pull requests` 체크
3. **Save** 클릭

---

## 5. 로컬 개발 환경 설정

### Step 1: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PROFILE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # 선택
NOTION_SITE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     # 선택
NOTION_ABOUT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx        # 선택

# 로컬 개발용
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **주의**: `.env.local`은 `.gitignore`에 포함되어 있으므로 Git에 커밋되지 않습니다.

### Step 2: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속하여 확인합니다.

### Step 3: 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run start
```

`http://localhost:3000`에서 프로덕션 빌드를 확인할 수 있습니다.

---

## 6. 블로그 배포

### 자동 배포 (권장)

GitHub Actions가 1시간마다 자동으로 배포합니다.

**수동 배포:**
1. GitHub 저장소 → **Actions** 탭
2. **Deploy to GitHub Pages** 클릭
3. **Run workflow** → **Run workflow** 클릭
4. 2-5분 대기
5. `https://username.github.io` 접속하여 확인

### 로컬 배포 테스트

```bash
# 정적 파일 생성
npm run build

# out/ 디렉토리에 정적 파일 생성됨
ls out/
```

---

## 7. 커스터마이징

### 프로필 수정

`src/components/ProfileSidebar.tsx` 파일에서 기본 프로필 정보를 수정할 수 있습니다.

### 테마 색상 변경

`src/app/globals.css` 파일에서 CSS 변수를 수정:

```css
:root {
  --primary: 220 70% 50%;
  --primary-foreground: 0 0% 100%;
  /* ... */
}
```

### 페이지네이션 개수 변경

`src/app/page.tsx` 파일에서 `POSTS_PER_PAGE` 상수 수정:

```typescript
const POSTS_PER_PAGE = 4; // 원하는 개수로 변경
```

### 타이포그래피 스타일 변경

`tailwind.config.js` 파일에서 prose 스타일을 커스터마이징:

```javascript
typography: {
  DEFAULT: {
    css: {
      // 스타일 수정
    }
  }
}
```

자세한 내용은 [Tailwind Typography 가이드](./TAILWIND_TYPOGRAPHY_GUIDE.md)를 참고하세요.

---

## 8. 테스트

### Unit Tests

```bash
# 모든 단위 테스트 실행
npm run test

# Watch 모드 (파일 변경 시 자동 실행)
npm run test -- --watch

# 특정 파일만 테스트
npm run test cache.test.ts
```

**테스트 파일 위치:**
- `src/lib/__tests__/` - 라이브러리 단위 테스트
- `src/services/notion/__tests__/` - Notion 서비스 테스트

### E2E Tests

```bash
# E2E 테스트 실행
npm run test:e2e

# UI 모드 (시각적 디버깅)
npm run test:e2e:ui

# 브라우저 표시 모드
npm run test:e2e:headed

# 디버그 모드 (단계별 실행)
npm run test:e2e:debug

# 테스트 결과 리포트 보기
npm run test:e2e:report
```

**테스트 파일 위치:**
- `tests/e2e/` - E2E 테스트

---

## 9. 문제 해결

### 빌드 실패

**원인**: Notion API Key 또는 Database ID 오류

**해결**:
1. `.env.local` 파일 확인
2. GitHub Secrets 확인
3. Notion Integration이 데이터베이스에 연결되어 있는지 확인

### Notion 데이터가 안 보임

**원인**: Integration 권한 부족

**해결**:
1. Notion 데이터베이스 → 우측 상단 `⋯` → "Add connections"
2. Integration 선택하여 연결

### 이미지가 안 보임

**원인**: Notion 이미지 URL은 1시간 후 만료됨

**해결**:
- 1시간 후 자동 재배포 대기
- 또는 수동으로 워크플로우 재실행

### TypeScript 오류

**원인**: 타입 정의 불일치

**해결**:
```bash
# 타입 검사
npm run type-check

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 추가 자료

- [비개발자를 위한 완전 가이드](./NON_DEVELOPER_GUIDE.md)
- [Notion 설정 가이드](./NOTION_SETUP_GUIDE.md)
- [Giscus 댓글 시스템 설정](./GISCUS_SETUP_GUIDE.md)
- [고급 기능 가이드](./ADVANCED_FEATURES_GUIDE.md)
- [문제 해결 가이드](./TROUBLESHOOTING_GUIDE.md)
- [Tailwind Typography 가이드](./TAILWIND_TYPOGRAPHY_GUIDE.md)

---

## 🤝 기여하기

버그를 발견하거나 기능을 개선하고 싶으시다면:

1. 이슈 생성: [GitHub Issues](https://github.com/freelife1191/nextjs-notion-blog/issues)
2. Fork → 수정 → Pull Request
3. 코드 리뷰 및 머지

---

**Happy Coding! 🚀**
