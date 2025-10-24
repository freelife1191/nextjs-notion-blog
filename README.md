# Next.js Notion Blog

> **Next.js 15, shadcn/ui, Tailwind CSS**로 개발된 Notion 기반 자동화 블로그 서비스
> Notion을 CMS로 사용하고 1시간마다 GitHub Actions를 통해 자동 배포됩니다.

<!--
⚠️ 중요: Fork 후 아래 배지 URL을 본인의 GitHub 정보로 변경하세요!
YOUR-USERNAME을 본인의 GitHub 사용자명으로
YOUR-REPO-NAME을 본인의 저장소 이름으로 교체하세요.

예시:
- Fork 전: YOUR-USERNAME/YOUR-REPO-NAME
- Fork 후: john-doe/my-blog
-->
[![Deploy to GitHub Pages](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions/workflows/gh-pages.yml)

---

## 🚀 서비스 개발 진행 단계

| 기능 | 상태 | 설명 | 완료 일자 |
|------|------|------|----------|
| 💬 댓글 | ✅ **완료** | Giscus 댓글 시스템 | 2025-10-22 |
| 👤 About Me | ✅ **완료** | 프로필 페이지 | 2025-10-22 |
| ⚙️ 프로필 설정 | ✅ **완료** | Notion 기반 프로필 관리 | 2025-10-20 |
| 📝 블로그 포스팅 | ⚠️ **완료** | Notion CMS 연동 | 2025-10-24 |
| **🎨 사이트 설정** | | **Notion 기반 사이트 설정** | |
| └─ 📄 기본 정보 | ⚠️ **완료** | 사이트 제목, 설명, 파비콘 | 2025-10-24 |
| └─ 📊 분석 도구 | ⚠️ **완료** | Google Analytics 4 연동 | 2025-10-24 |
| └─ 💰 수익화 | ⚠️ **완료** | Google AdSense 연동 | 2025-10-24 |
| └─ 🔍 SEO 최적화 | ⚠️ **완료** | 메타 태그, sitemap, RSS | 2025-10-24 |
| └─ 🎨 테마 설정 | 🔧 **개발중** | 색상, 폰트 커스터마이징 | - |
| **🌐 사이트 URL 설정** | | **도메인 및 경로 설정** | |
| └─ 📌 Base Path | ✅ **완료** | 루트 경로 배포 (basePath 제거) | 2025-10-24 |
| └─ 🏠 커스텀 도메인 | ⚠️ **검증중** | 개인 도메인 연결 가이드 | - |
| └─ 🔒 HTTPS | ✅ **완료** | 자동 SSL 인증서 (GitHub Pages) | 2025-10-22 |

---

## ✨ 핵심 기능

<table>
<tr>
<td width="50%">

### 🎯 **Notion에서 모든 것을 관리**
- 글 작성부터 발행까지 **Notion에서만** 작업
- 별도의 관리자 페이지나 복잡한 설정 불필요
- 노션에 익숙하다면 **바로 블로그 운영 가능**

</td>
<td width="50%">

### ⚡ **완전 자동 동기화**
- **2시간마다 자동으로** Notion 변경사항 감지
- 글 작성 → 발행 상태 변경 → **2시간 이내 자동 배포**
- GitHub Actions가 모든 과정을 자동화

</td>
</tr>
</table>

**💡 사용 방법:** Notion에서 글 작성 → Status를 "Publish"로 변경 → 완료! 나머지는 자동입니다.

## 📖 목차

- [💡 프로젝트 소개](#-프로젝트-소개)
- [⚡ 빠른 시작 가이드](#-빠른-시작-가이드)
- [🛠️ 기술 스택](#️-기술-스택)
- [🎯 주요 기능](#-주요-기능)
- [🏗️ 아키텍처](#️-아키텍처)
- [🚀 시작하기](#-시작하기)
  - [1. 사전 준비](#1-사전-준비)
  - [2. 프로젝트 Fork 및 Clone](#2-프로젝트-fork-및-clone)
  - [3. Notion 설정](#3-notion-설정)
  - [4. GitHub 설정](#4-github-설정)
  - [5. 로컬 개발 환경 설정](#5-로컬-개발-환경-설정)
  - [6. 블로그 배포](#6-블로그-배포)
- [📝 블로그 운영 가이드](#-블로그-운영-가이드)
- [⚙️ 고급 설정](#️-고급-설정)
- [👨‍💻 개발자 가이드](#-개발자-가이드)
- [🔧 트러블슈팅](#-트러블슈팅)
- [❓ FAQ](#-faq)
- [🤝 개발 참여](#-개발-참여)
- [📄 라이센스](#-라이센스)
- [🙏 감사의 말](#-감사의-말)

---

## 💡 프로젝트 소개

이 프로젝트는 **Notion을 CMS로 활용**하여 블로그를 자동으로 생성하고 **GitHub Pages에 배포**하는 시스템입니다.

### 왜 이 프로젝트를 사용해야 하나요?

- **노션만 알면 됩니다** - 별도의 블로그 관리 툴 없이 노션에서 글을 작성하고 관리
- **완전 자동화** - 노션에서 글을 발행하면 1시간 이내 자동으로 블로그에 반영
- **무료 호스팅** - GitHub Pages를 통해 완전 무료로 블로그 운영
- **빠른 로딩** - Next.js Static Export로 정적 사이트 생성, CDN을 통한 빠른 전송
- **SEO 최적화** - Open Graph, Twitter Cards, JSON-LD 등 완벽한 SEO 지원
- **커스터마이징 가능** - 오픈소스 프로젝트로 원하는 대로 수정 가능

### 데모

- **라이브 데모**: https://notionblogsample.github.io
- **노션 데이터베이스 샘플**: https://www.notion.so/freelife/295573b3dc09809b9b4dc3c309399a97

### 버그 제보 및 기능 요청

프로젝트를 사용하시다가 버그를 발견하거나 새로운 기능을 제안하고 싶으시다면:

- 🐛 **버그 제보**: [GitHub Issues](https://github.com/freelife1191/nextjs-notion-blog/issues)에서 새 이슈를 생성해주세요
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/freelife1191/nextjs-notion-blog/discussions)에서 아이디어를 공유해주세요
- 📖 **문서 개선**: 오타나 불명확한 설명이 있다면 PR을 보내주세요

여러분의 피드백이 프로젝트를 더 좋게 만듭니다!

---

## ⚡ 빠른 시작 가이드

사용자 유형에 따라 적합한 가이드를 선택하세요:

### 👨‍💻 개발자이신가요?

기술적인 배경이 있고 로컬 개발 환경 설정이 가능하시다면:
- **[개발자용 상세 가이드](#시작하기)** (아래 "시작하기" 섹션)
- Node.js, Git, 터미널 명령어 사용
- 로컬에서 미리보기 및 커스터마이징

### 👤 비개발자이신가요?

프로그래밍 지식이 없어도 괜찮습니다! 웹 브라우저만으로 모든 설정이 가능합니다:
- **📘 [비개발자를 위한 완전 가이드](./docs/NON_DEVELOPER_GUIDE.md)**
- GitHub 웹사이트에서 모든 작업 진행
- 로컬 개발 환경 불필요
- 단계별 스크린샷과 자세한 설명
- 약 30분 소요

### 📚 Notion 설정이 처음이신가요?

Notion 데이터베이스 생성 및 Integration 설정이 필요하시다면:
- **[Notion 설정 가이드](./docs/NOTION_SETUP_GUIDE.md)**
- Posts 데이터베이스 생성 방법
- Settings 데이터베이스 설정 (선택)
- About 페이지 설정 (선택)

### 💬 댓글 기능을 추가하고 싶으신가요?

블로그에 무료 댓글 시스템을 추가하려면:
- **📘 [Giscus 댓글 시스템 설정 가이드](./docs/GISCUS_SETUP_GUIDE.md)**
- GitHub Discussions 기반 무료 댓글
- 스팸 방지 및 마크다운 지원
- 다크 모드 자동 전환
- 약 1시간 소요

### 🔧 문제가 발생했나요?

설정 중 오류가 발생하거나 궁금한 점이 있다면:
- **📘 [트러블슈팅 가이드](./docs/TROUBLESHOOTING_GUIDE.md)**
- 자주 발생하는 문제와 해결 방법
- 빌드 실패, 배포 오류, 포스트 미표시 등
- 단계별 디버깅 가이드

### ⚙️ 더 많은 기능이 필요하신가요?

블로그를 더욱 강력하게 만들고 싶다면:
- **📘 [고급 기능 설정 가이드](./docs/ADVANCED_FEATURES_GUIDE.md)**
- Google Analytics 4 설정
- Google AdSense 수익화
- 커스텀 도메인 연결
- SEO 최적화

---

## 🛠️ 기술 스택

### 🎨 프론트엔드
- **Next.js 15** - React 기반 풀스택 프레임워크
  - App Router 사용 (최신 라우팅 시스템)
  - React Server Components (서버 컴포넌트)
  - Static Export (정적 사이트 생성)
  - Turbopack (초고속 번들러)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성 보장
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
  - `@tailwindcss/typography` - 아름다운 마크다운 스타일링 ([스타일링 가이드](./docs/TAILWIND_TYPOGRAPHY_GUIDE.md))
  - `tailwind-merge` - 클래스 충돌 방지
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트 시스템
  - Radix UI 기반 (Avatar, Separator, Slot)
  - `class-variance-authority` - 컴포넌트 variant 관리
  - 프로젝트 전체에서 일관된 디자인 언어 제공 (필수 사용)
- **Lucide React** - 깔끔한 아이콘 라이브러리 (1000+ 아이콘)
  - 명시적 import로 tree-shaking 최적화
  - 모든 아이콘에 대해 Lucide 우선 사용 원칙
- **Framer Motion** - 부드러운 애니메이션
- **Zod** - 런타임 타입 검증 및 환경 변수 유효성 검사

### ⚙️ 백엔드 & 인프라
- **Notion API** - 콘텐츠 관리 시스템 (CMS)
  - `@notionhq/client` - 공식 Notion SDK
- **GitHub Actions** - CI/CD 자동화
  - Cron 스케줄링 (2시간마다 자동 동기화)
  - 자동 빌드 및 배포
- **GitHub Pages** - 정적 사이트 호스팅

### 🧪 개발 도구
- **Vitest** - 단위 테스트 프레임워크
- **Playwright** - E2E 테스트 프레임워크
  - `@playwright/mcp` - MCP 서버를 통한 AI 지원 테스팅
- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 변환 및 최적화
  - `autoprefixer` - 벤더 프리픽스 자동 추가
- **Prism.js** - 코드 하이라이팅
- **Unified 생태계** - 마크다운 처리
  - `remark-parse` - 마크다운 파싱
  - `remark-rehype` - 마크다운을 HTML로 변환
  - `remark-gfm` - GitHub Flavored Markdown 지원
  - `rehype-stringify` - HTML 직렬화

### 🔌 추가 기능
- **Google Analytics 4** - 방문자 분석
- **Google AdSense** - 광고 수익화 (선택)
- **RSS Feed** - 구독 기능
- **Sitemap** - 검색 엔진 최적화

---

## 🎯 주요 기능

### 📝 콘텐츠 관리
- ✅ **노션 기반 글 작성** - 노션의 모든 블록 타입 지원
- ✅ **자동 동기화** - 1시간마다 GitHub Actions가 자동으로 노션에서 최신 콘텐츠 가져오기
- ✅ **상태 관리** - Publish, Draft, Hidden, Wait 상태로 글 관리
- ✅ **태그 & 카테고리** - 다중 태그 및 라벨 분류
- ✅ **커버 이미지** - 노션 페이지 커버 또는 CoverImage 속성 지원

### 🎨 블로그 기능
- ✅ **반응형 디자인** - 모바일, 태블릿, 데스크톱 완벽 지원
- ✅ **다크 모드** - 시스템 설정 기반 자동 전환
- ✅ **스마트 필터링** - 월별, 태그, 라벨로 글 필터링
- ✅ **페이지네이션** - 4개씩 나누어 표시 (커스터마이징 가능)
- ✅ **목차 (TOC)** - 자동 생성되는 포스트 목차
- ✅ **코드 하이라이팅** - Prism.js 기반 다양한 언어 지원
- ✅ **유튜브 임베드** - 북마크로 유튜브 영상 자동 임베드

### 🚀 SEO & 성능
- ✅ **완벽한 SEO** - Open Graph, Twitter Cards, JSON-LD
- ✅ **사이트맵 자동 생성** - 검색 엔진 크롤링 최적화
- ✅ **RSS 피드** - 구독자를 위한 RSS 지원
- ✅ **빠른 로딩** - Static Export로 CDN을 통한 즉시 로딩
- ✅ **이미지 최적화** - Priority loading, Blur placeholder, Preload 지원
  - 첫 3개 이미지 우선 로딩 (LCP 개선)
  - 로딩 중 Blur placeholder 표시 (CLS 방지)
  - 중요 이미지 Preload (초기 로딩 속도 향상)

### 💰 분석 & 수익화
- ✅ **Google Analytics 4** - 방문자 추적 및 분석
- ✅ **Google AdSense** - 광고를 통한 수익 창출 (선택)
  - 포스트 상단/하단에 자동 배치
  - 반응형 광고 (모바일/데스크톱 최적화)
  - 개발 환경에서는 플레이스홀더로 표시
- ✅ **환경별 설정** - 개발/프로덕션 환경 분리

---

## 🏗️ 아키텍처

### 🔄 시스템 구조

```
┌─────────────────┐
│     Notion      │ ← 콘텐츠 작성 및 관리
│   (CMS)         │
└────────┬────────┘
         │ Notion API
         ▼
┌─────────────────┐
│ GitHub Actions  │ ← 1시간마다 자동 동기화
│  (Cron: */10)   │
└────────┬────────┘
         │ Build & Deploy
         ▼
┌─────────────────┐
│   Next.js       │ ← Static Export 빌드
│   (SSG)         │
└────────┬────────┘
         │ HTML/CSS/JS
         ▼
┌─────────────────┐
│ GitHub Pages    │ ← 무료 호스팅
│  (CDN)          │
└─────────────────┘
```

### 📊 데이터 흐름

1. **콘텐츠 작성**: 노션 데이터베이스에 글 작성
2. **상태 변경**: Status를 "Publish"로 설정
3. **자동 동기화**: GitHub Actions가 1시간마다 실행
4. **데이터 가져오기**: Notion API를 통해 발행된 글 목록 조회
5. **정적 빌드**: Next.js가 모든 페이지를 HTML로 사전 생성
6. **자동 배포**: GitHub Pages에 빌드 결과물 업로드
7. **글 게시**: `https://<username>.github.io/<repo-name>` 에서 확인 가능

### 📁 디렉토리 구조

```
nextjs-notion-blog/
├── src/
│   ├── app/                 # App Router 페이지
│   │   ├── page.tsx                # 홈페이지 (글 목록)
│   │   ├── about/                  # About 페이지
│   │   ├── posts/[slug]/           # 개별 포스트 페이지
│   │   ├── rss.xml/                # RSS 피드
│   │   └── sitemap.xml/            # 사이트맵
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ProfileSidebar.tsx      # 프로필 사이드바
│   │   ├── PostCard.tsx            # 포스트 카드
│   │   ├── GoogleAnalytics.tsx     # GA4 통합
│   │   └── GoogleAdSense.tsx       # AdSense 통합
│   ├── services/            # 비즈니스 로직
│   │   └── notion/
│   │       ├── client.ts           # Notion API 클라이언트
│   │       └── renderer.ts         # Notion 블록 → HTML 변환
│   └── lib/                 # 유틸리티 함수
│       ├── env.ts                  # 환경 변수 검증
│       ├── cache.ts                # 캐싱 시스템
│       ├── seo.ts                  # SEO 헬퍼
│       └── toc.ts                  # 목차 생성
├── public/                  # 정적 파일
├── tests/                   # 테스트
│   └── e2e/                        # E2E 테스트 (Playwright, *.spec.ts)
├── src/
│   ├── lib/__tests__/              # 단위 테스트 - lib (Vitest, *.test.ts)
│   └── services/notion/__tests__/  # 단위 테스트 - services (Vitest, *.test.ts)
├── .github/
│   └── workflows/
│       └── gh-pages.yml            # CI/CD 워크플로우
├── docs/                    # 문서
├── specs/                   # 사양
├── package.json
├── next.config.ts           # Next.js 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
└── README.md                # 이 문서
```

---

## 🚀 시작하기

### 1. 사전 준비

시작하기 전에 다음 항목들을 준비해주세요:

#### 필수 요구사항

- ✅ **GitHub 계정** - 코드 저장소 및 호스팅
- ✅ **Notion 계정** (무료) - 콘텐츠 관리
- ✅ **Node.js 20+** - 로컬 개발 환경 (선택사항)
- ✅ **Git** - 버전 관리 (선택사항)

#### 선택 요구사항

- ⭕ **Google Analytics 계정** - 방문자 추적을 원하는 경우
- ⭕ **Google AdSense 계정** - 광고 수익을 원하는 경우

---

### 2. 프로젝트 Fork 및 Clone

#### Step 1: GitHub에서 Fork

1. 이 저장소 페이지 우측 상단의 **Fork** 버튼 클릭
2. Repository name을 원하는 이름으로 변경 (예: `my-blog`, `nextjs-notion-blog`)
3. **Create fork** 클릭

#### Step 2: Repository 이름 확인

Fork가 완료되면 주소가 다음과 같은 형태가 됩니다:
```
https://github.com/<your-username>/<repo-name>
```

예시:
- `https://github.com/john-doe/my-blog`
- `https://github.com/jane-smith/nextjs-notion-blog`

**중요**: `<repo-name>` 부분을 기억해두세요. 나중에 설정에서 사용됩니다.

#### Step 3: 로컬에 Clone (개발자만)

**⚠️ 비개발자는 이 단계를 건너뛰세요!**

로컬에서 개발하려는 개발자만:

```bash
# 1. Clone
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. 의존성 설치
npm install
```

---

### 3. Notion 설정

Notion을 CMS(콘텐츠 관리 시스템)로 사용하기 위한 설정입니다.

#### 📚 Notion 구조 이해하기

블로그는 Notion의 다음 요소들로 구성됩니다:

| 구성 요소 | 용도 | 필수 여부 | 설명 |
|----------|------|----------|------|
| **📝 Posts 데이터베이스** | 블로그 글 관리 | ✅ 필수 | 제목, 본문, 태그 등을 관리. **Status가 "Publish"인 글만 공개**됨 |
| **🔑 Integration** | API 연결 | ✅ 필수 | 블로그가 Notion 데이터를 읽을 수 있도록 권한 부여 |
| **👤 Profile 데이터베이스** | 프로필 정보 | ⬜ 선택 | 이름, 직함, 소셜 링크 등 관리. 없으면 기본값 사용 |
| **⚙️ Site 데이터베이스** | 사이트 설정 | ⬜ 선택 | 사이트 제목, Analytics, AdSense 등 관리. 없으면 기본값 사용 |
| **📄 About 페이지** | 소개 페이지 | ⬜ 선택 | 자기소개 콘텐츠. 없으면 About 메뉴 미표시 |

**핵심 동작 방식:**
- Notion에서 글을 작성하고 **Status를 "Publish"로 설정**하면 블로그에 표시됩니다
- Draft, Hidden, Wait 상태는 모두 비공개로 처리됩니다
- 1시간마다 GitHub Actions가 자동으로 Notion 데이터를 가져와 배포합니다

---

> 📖 **처음부터 끝까지 상세한 설정 방법**
>
> [**📘 Notion 설정 가이드**](./docs/NOTION_SETUP_GUIDE.md)에서 다음을 확인하세요:
> - 🔑 [Integration 생성 및 권한 설정](./docs/NOTION_SETUP_GUIDE.md#1-notion-integration-생성)
> - 📝 [Posts 데이터베이스 구성](./docs/NOTION_SETUP_GUIDE.md#2-포스팅-데이터베이스-설정)
> - 👤 [Profile 데이터베이스 구성](./docs/NOTION_SETUP_GUIDE.md#3-프로필-설정-데이터베이스-구성)
> - ⚙️ [Site 데이터베이스 구성](./docs/NOTION_SETUP_GUIDE.md#4-사이트-설정-데이터베이스-구성)
> - 📄 [About 페이지 구성](./docs/NOTION_SETUP_GUIDE.md#5-about-페이지-구성)
> - 🔧 [환경 변수 설정](./docs/NOTION_SETUP_GUIDE.md#6-환경-변수-설정)
> - 🧪 [로컬 테스트](./docs/NOTION_SETUP_GUIDE.md#7-로컬-테스트)

---

#### ⚡ 빠른 설정 (필수만)

최소한으로 빠르게 시작하려면 다음만 설정하면 됩니다:

1. **Integration 생성**
   - [Notion Integrations](https://www.notion.so/my-integrations) 접속
   - "New integration" 클릭
   - API Key 복사 (나중에 사용)

2. **Posts 데이터베이스 생성**
   - Notion에서 새 페이지 생성
   - `/database` 입력하여 데이터베이스 추가
   - 필수 속성 추가: `Title`, `Slug`, `Status`, `Date`
   - Status 옵션: `Publish`, `Draft`, `Hidden`, `Wait`

3. **Integration 연결**
   - 데이터베이스 우측 상단 `⋯` 메뉴 → "Add connections"
   - 만든 Integration 선택

4. **데이터베이스 ID 복사**
   - 데이터베이스 URL에서 32자리 ID 추출
   - GitHub Secrets에 저장 (다음 단계에서 사용)

**이것만으로도 블로그가 작동합니다!** 프로필/사이트 설정은 나중에 추가할 수 있습니다.

---

#### 🎨 전체 설정 (권장)

더 완전한 블로그를 원한다면:

**필수 설정:**
- ✅ Integration + Posts 데이터베이스 (위 빠른 설정 참고)

**추가 설정 (선택):**
- 👤 **Profile 데이터베이스**: 프로필 사진, 이름, 직함, 소셜 링크 관리
- ⚙️ **Site 데이터베이스**: 사이트 제목, 설명, Google Analytics, AdSense 설정
- 📄 **About 페이지**: 자기소개 및 경력 페이지

**예상 소요 시간:**
- 빠른 설정 (필수만): 약 10분
- 전체 설정: 약 30분

💡 **Notion이 처음이신가요?** 걱정 마세요! [Notion 설정 가이드](./docs/NOTION_SETUP_GUIDE.md)는 Notion을 한 번도 사용해보지 않은 분도 따라할 수 있도록 스크린샷과 함께 작성되었습니다.

---

### 4. GitHub 설정

#### Step 1: Repository 설정 변경

**⚠️ GitHub Pages 배포 방식 선택**

GitHub Pages는 두 가지 배포 방식을 제공합니다:

| 배포 방식 | URL 형식 | Repository 이름 | 특징 |
|----------|---------|----------------|-----|
| **User Site** (권장) | `https://username.github.io` | `username.github.io` | ✅ 루트 경로, 깔끔한 URL<br>✅ **Google AdSense 필수** |
| **Project Site** | `https://username.github.io/repo-name` | 자유롭게 설정 | ⚠️ 서브패스 필요 (basePath 설정 필요)<br>❌ AdSense 사이트 확인 불가 |

**현재 이 프로젝트는 User Site (루트 경로) 방식으로 설정되어 있습니다.**

> **💰 Google AdSense를 사용하시나요?**
>
> Google AdSense 사이트 확인을 위해서는 **반드시 User Site 방식**으로 배포해야 합니다. AdSense는 루트 도메인의 HTML `<head>` 태그에서 스크립트를 확인하므로, Project Site (`/repo-name/`) 방식에서는 사이트 확인이 실패합니다.
>
> 자세한 내용은 [Google AdSense 설정 가이드](./docs/ADVANCED_FEATURES_GUIDE.md#-필수-repository-이름-설정)를 참고하세요.

**User Site로 배포하려면 (권장):**

1. Fork한 Repository 이름을 `<your-username>.github.io`로 변경
   - Settings → Repository name → `<your-username>.github.io`로 변경
   - 예: GitHub 사용자명이 `john-doe`인 경우 → `john-doe.github.io`

2. `.env.local` 파일에서 `NEXT_PUBLIC_SITE_URL` 수정:
   ```env
   NEXT_PUBLIC_SITE_URL=https://<your-username>.github.io
   ```

3. 완료! 추가 설정 없이 `https://<your-username>.github.io`에서 블로그 접속 가능

**Project Site로 배포하려면 (서브패스 사용):**

프로젝트를 서브패스에 배포하려면 추가 설정이 필요합니다:

1. `next.config.ts` 파일 수정:
   ```typescript
   const isDev = process.env.NODE_ENV === 'development';
   const repoBase = "/<your-repo-name>"; // 예: "/my-blog"

   const nextConfig: NextConfig = {
     output: isDev ? undefined : "export",
     basePath: isDev ? undefined : repoBase,
     assetPrefix: isDev ? undefined : repoBase,
     // ... 나머지 설정
   };
   ```

2. `src/app/layout.tsx` 파일 수정:
   ```typescript
   const basePath = isDev ? '' : '/<your-repo-name>';

   return {
     // ...
     icons: {
       icon: basePath + '/favicon.ico',
       apple: basePath + '/favicon.ico',
     },
   };
   ```

3. `src/app/manifest.ts` 파일 수정:
   ```typescript
   const basePath = isDev ? '' : '/<your-repo-name>';

   return {
     // ...
     start_url: basePath + '/',
     icons: [
       {
         src: basePath + '/favicon.ico',
         // ...
       },
     ],
   };
   ```

4. `.env.local` 파일에서 `NEXT_PUBLIC_SITE_URL` 수정:
   ```env
   NEXT_PUBLIC_SITE_URL=https://<your-username>.github.io/<your-repo-name>
   ```

**README.md 배지 URL 수정 (선택사항)**

1. `README.md` 파일 상단의 배포 배지 URL 수정
2. `YOUR-USERNAME`과 `YOUR-REPO-NAME`을 본인의 정보로 교체:
   ```markdown
   // 변경 전
   https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/actions/workflows/gh-pages.yml/badge.svg

   // 변경 후 (본인의 GitHub 정보로)
   https://github.com/john-doe/my-blog/actions/workflows/gh-pages.yml/badge.svg
   ```
   - `YOUR-USERNAME`: 본인의 GitHub 사용자명
   - `YOUR-REPO-NAME`: 본인의 Repository 이름

3. 두 곳 모두 수정 (이미지 URL과 링크 URL)

#### Step 2: GitHub Actions Secrets 설정

**⚠️ 필수 단계!** 이 설정이 없으면 블로그가 작동하지 않습니다.

GitHub Actions가 자동으로 Notion에서 콘텐츠를 가져오려면 접근 권한이 필요합니다.
다음 Secrets를 설정해야 합니다.

1. GitHub Repository 페이지 이동
2. **Settings** 탭 클릭
3. 왼쪽 사이드바에서 **Secrets and variables** → **Actions** 클릭
4. **New repository secret** 버튼 클릭
5. 다음 Secrets를 하나씩 추가:

**필수 Secrets**:

| Name | Value | 설명 |
|------|-------|------|
| `NOTION_API_KEY` | `secret_xxxxxxxxxxxx` | [3. Notion 설정](#3-notion-설정)에서 발급받은 Integration Secret |
| `NOTION_DATABASE_ID` | `a1b2c3d4...` | Posts 데이터베이스 ID ([Notion 설정 가이드](./docs/NOTION_SETUP_GUIDE.md#26-데이터베이스-id-가져오기) 참고) |

**선택 Secrets** (해당하는 경우에만):

| Name | Value | 설명 |
|------|-------|------|
| `NOTION_PROFILE_DATABASE_ID` | `e5f6g7h8...` | Profile 데이터베이스 ID ([가이드](./docs/NOTION_SETUP_GUIDE.md#34-데이터베이스-id-가져오기)) |
| `NOTION_SITE_DATABASE_ID` | `i9j0k1l2...` | Site 데이터베이스 ID ([가이드](./docs/NOTION_SETUP_GUIDE.md#44-데이터베이스-id-가져오기)) |
| `NOTION_ABOUT_PAGE_ID` | `m3n4o5p6...` | About 페이지 ID ([가이드](./docs/NOTION_SETUP_GUIDE.md#53-페이지-id-가져오기)) |

**Secret 추가 방법**:
- **Name**: 위 표의 Name 정확히 입력
- **Secret**: 해당 값 붙여넣기
- **Add secret** 클릭

#### Step 3: GitHub Pages 설정

1. Repository **Settings** → **Pages** (왼쪽 사이드바)
2. **Source** 섹션에서:
   - **Source**: `GitHub Actions` 선택
   - ⚠️ **주의**: `Deploy from a branch`가 아닌 `GitHub Actions`를 선택해야 합니다!

#### Step 4: GitHub Actions 권한 설정

1. Repository **Settings** → **Actions** → **General**
2. **Workflow permissions** 섹션에서:
   - ✅ **Read and write permissions** 선택
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크
3. **Save** 클릭

#### Step 5: 첫 배포 실행

1. Repository의 **Actions** 탭 클릭
2. 왼쪽에서 **Deploy to GitHub Pages** 워크플로우 선택
3. 우측 **Run workflow** 드롭다운 클릭
4. **Run workflow** 버튼 클릭
5. 진행 상황 확인:
   - 노란색 원: 진행 중
   - 초록색 체크: 성공
   - 빨간색 X: 실패 (로그 확인 필요)

배포가 성공하면 약 2-5분 후 다음 주소에서 블로그 확인 가능:

**User Site (루트 경로) 배포 시:**
```
https://<your-username>.github.io/
```

예시:
- `https://john-doe.github.io/`
- `https://jane-smith.github.io/`

**Project Site (서브패스) 배포 시:**
```
https://<your-username>.github.io/<repo-name>/
```

예시:
- `https://john-doe.github.io/my-blog/`
- `https://jane-smith.github.io/nextjs-notion-blog/`

---

### 5. 로컬 개발 환경 설정

**⚠️ 이 섹션은 개발자만 필요합니다!**

비개발자이거나 로컬에서 코드를 수정할 계획이 없다면 이 단계를 **건너뛰어도** 됩니다.
GitHub에서 직접 모든 작업을 할 수 있습니다.

로컬에서 블로그를 개발하고 미리보기하려면:

#### Step 1: 환경 변수 설정

1. `.env.local` 파일 생성
2. 다음 내용 추가:

```env
# ============================================
# 필수 환경 변수
# ============================================

# Notion Integration Secret Key
# 발급 방법: https://www.notion.so/my-integrations → New integration → Secrets 탭
# 형식: secret_로 시작하는 긴 문자열
NOTION_API_KEY=secret_xxxxxxxxxxxx

# Posts 데이터베이스 ID (블로그 글 목록)
# 찾는 방법: Notion에서 Posts 데이터베이스 열기 → 주소창의 32자리 문자열
# 예: https://notion.so/myworkspace/a1b2c3d4... → a1b2c3d4 부분
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# ============================================
# 사이트 URL 설정 (권장)
# ============================================

# 배포된 사이트의 전체 URL
# - User Site (권장): https://your-username.github.io
# - Project Site: https://your-username.github.io/your-repo-name
# - 커스텀 도메인: https://yourdomain.com
# SEO, Open Graph, RSS 피드에서 사용됨
NEXT_PUBLIC_SITE_URL=https://your-username.github.io

# ============================================
# 선택 환경 변수 (기능별 설정)
# ============================================

# Profile 데이터베이스 ID (프로필 정보, 소셜 링크)
# 없으면 기본 프로필 정보 사용
NOTION_PROFILE_DATABASE_ID=e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# Site 데이터베이스 ID (사이트 설정, Analytics, AdSense)
# 없으면 기본 사이트 설정 사용
NOTION_SITE_DATABASE_ID=i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4

# About 페이지 ID (자기소개 페이지)
# 없으면 About 메뉴 표시 안 함
NOTION_ABOUT_PAGE_ID=m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8

# ============================================
# Giscus 댓글 시스템 (선택)
# ============================================
# 설정 방법: docs/GISCUS_SETUP_GUIDE.md 참고
# https://giscus.app 에서 설정값 자동 생성 가능

# GitHub 저장소 (owner/repo 형식)
# 예: john-doe/my-blog
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo-name

# Giscus 저장소 ID
# https://giscus.app 에서 자동 생성됨
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOGxxxxxxx

# Discussions 카테고리 이름
# GitHub Discussions에서 생성한 카테고리 (예: General, Announcements)
NEXT_PUBLIC_GISCUS_CATEGORY=General

# Discussions 카테고리 ID
# https://giscus.app 에서 자동 생성됨
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOGxxxxxxx
```

⚠️ **주의**: `.env.local` 파일은 절대로 Git에 커밋하지 마세요! (`.gitignore`에 이미 포함됨)

#### Step 2: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

**유용한 명령어**:
```bash
# 개발 서버 (Turbopack - 초고속)
npm run dev

# 프로덕션 빌드 테스트
npm run build
npm run start

# 린팅
npm run lint

# 단위 테스트 (Vitest)
npm run test              # 전체 테스트 실행 (170개 테스트)
npm run test -- --watch   # Watch 모드 (파일 변경 시 자동 실행)

# E2E 테스트 (Playwright)
npm run test:e2e          # 전체 E2E 테스트 실행
npm run test:e2e:ui       # UI 모드 (시각적 디버깅)
npm run test:e2e:headed   # 브라우저 표시 모드
npm run test:e2e:debug    # 디버그 모드 (단계별 실행)
npm run test:e2e:report   # 테스트 리포트 확인
```

**테스트 전략**:
- **단위 테스트 (Vitest)**:
  - 총 170개 테스트 케이스 실행
  - 유틸리티 함수 및 데이터 변환 로직 검증
  - 캐싱, 에러 처리, 검증 로직, Notion 클라이언트 테스트
  - 테스트 위치: `src/lib/__tests__/`, `src/services/notion/__tests__/`
- **E2E 테스트 (Playwright)**:
  - 전체 사용자 플로우 검증 (홈페이지, 포스트 페이지, 필터링, 성능 등)
  - 테스트 위치: `tests/e2e/`
  - 다중 브라우저 지원 (Chromium, Firefox, WebKit)
- **MCP 통합**: Playwright MCP 서버로 AI 지원 테스팅 가능

---

### 6. 블로그 배포

#### 🚀 배포 간단 요약

블로그는 다음과 같이 자동으로 배포됩니다:

```
┌─────────────────────────────────────────────────────────────────┐
│  1️⃣  Notion에서 글 작성 (Status = "Publish")                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  2️⃣  GitHub Actions 자동 실행 (1시간마다 또는 Push 시)                │
│     • Notion API로 최신 데이터 가져오기                              │
│     • Next.js 정적 빌드 (HTML/CSS/JS 생성)                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  3️⃣  GitHub Pages에 자동 배포                                      │
│     • CDN을 통해 전 세계에서 빠르게 접근                               │
│     • HTTPS 자동 적용                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎉 완료! https://your-username.github.io                        │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 포인트:**
- ✅ Notion에서 글만 쓰면 됩니다 (나머지는 자동)
- ✅ 1시간 이내 자동 배포 (기다리기만 하면 됨)
- ✅ 코드 수정 시 즉시 배포 (git push만 하면 됨)

---

#### 📋 배포 프로세스 상세 설명

GitHub Actions가 어떻게 Notion 데이터를 가져와서 정적 사이트로 배포하는지 자세히 이해해봅시다.

**전체 배포 프로세스:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions 트리거                         │
│  • 1시간마다 자동 실행 (Cron: 0 * * * *)                          │
│  • main 브랜치에 Push                                             │
│  • 수동 실행 (workflow_dispatch)                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 1: 환경 설정 (Ubuntu 가상 서버)                   │
│  • Node.js 20 설치                                               │
│  • 코드 체크아웃 (git clone)                                       │
│  • npm 의존성 설치 (npm ci)                                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 2: 품질 검증                                    │
│  • 단위 테스트 실행 (Vitest - 170개 테스트)                           │
│  • 린터 검사 (ESLint)                                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 3: Notion 데이터 가져오기 & 빌드                   │
│                                                                 │
│  환경 변수 주입:                                                   │
│  ├─ NOTION_API_KEY          (Notion API 인증)                    │
│  ├─ NOTION_DATABASE_ID      (Posts 데이터베이스)                   │
│  ├─ NOTION_PROFILE_DATABASE_ID (프로필 정보)                      │
│  ├─ NOTION_SITE_DATABASE_ID    (사이트 설정)                      │
│  └─ NOTION_ABOUT_PAGE_ID       (About 페이지)                    │
│                                                                │
│  Next.js 빌드 프로세스:                                            │
│  ┌──────────────────────────────────────────────────┐          │
│  │ 1. Notion API 호출                                │          │
│  │    └─> NotionClient.fetchPosts()                 │          │
│  │         • Status = "Publish"인 글만 가져오기         │          │
│  │         • 제목, 본문, 태그, 커버 이미지 등              │          │
│  │                                                  │          │
│  │ 2. 블록 데이터 → HTML 변환                           │          │
│  │    └─> notionRenderer.renderBlocks()             │          │
│  │         • Heading, Paragraph, Code, Image 등      │          │
│  │         • React 컴포넌트로 변환                      │          │
│  │                                                  │          │
│  │ 3. 정적 페이지 생성 (Static Export)                  │          │
│  │    └─> generateStaticParams()                    │          │
│  │         • 모든 포스트 페이지 사전 생성                  │          │
│  │         • out/ 디렉토리에 HTML/CSS/JS 출력           │          │
│  │                                                  │          │
│  │ 4. 메타데이터 생성                                   │          │
│  │    • sitemap.xml (SEO용)                          │          │
│  │    • rss.xml (구독용)                              │          │
│  │    • robots.txt                                  │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                 │
│  결과물: out/ 디렉토리                                              │
│  ├── index.html                (홈페이지)                         │
│  ├── posts/                                                     │
│  │   ├── my-first-post.html   (개별 포스트)                        │
│  │   └── another-post.html                                      │
│  ├── about.html                (About 페이지)                     │
│  ├── sitemap.xml                                                │
│  ├── rss.xml                                                    │
│  └── _next/ (CSS, JS, 이미지)                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 4: 빌드 검증                                    │
│  • out/index.html 존재 확인                                       │
│  • 파일 개수 및 디렉토리 크기 확인                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Step 5: GitHub Pages 배포                           │
│  • out/ 디렉토리를 Artifact로 업로드                                 │
│  • actions/deploy-pages@v4 실행                                  │
│  • GitHub Pages CDN에 배포                                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              🎉 배포 완료!                                        │
│  https://your-username.github.io/your-repo-name                 │
│                                                                 │
│  • 전 세계 CDN을 통해 빠른 전송                                      │
│  • HTTPS 자동 적용 (Let's Encrypt)                                │
│  • 캐싱으로 초고속 로딩                                              │
└─────────────────────────────────────────────────────────────────┘
```

#### 🔑 핵심 원리

**1. GitHub Secrets로 안전한 인증**
```yaml
env:
  NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
  NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
```
- Secrets는 GitHub에 암호화되어 저장
- 워크플로우 실행 시에만 환경 변수로 주입
- 빌드 과정에서 Notion API에 안전하게 접근

**2. 빌드 타임에 모든 데이터 가져오기**
```typescript
// Next.js 빌드 시 실행 (런타임 X)
export async function generateStaticParams() {
  const posts = await notionClient.fetchPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```
- 사용자가 페이지를 볼 때가 아닌, **빌드할 때** Notion API 호출
- 모든 페이지를 HTML로 사전 생성
- 배포 후에는 Notion API 호출 없음 (초고속!)

**3. 정적 파일만 배포**
- Next.js 서버 불필요
- HTML/CSS/JS 파일만 GitHub Pages에 업로드
- CDN을 통해 전 세계에서 빠르게 접근

#### 🔄 자동 배포

다음 경우에 자동으로 배포됩니다:

1. **1시간마다 자동 동기화** (Cron)
   ```yaml
   schedule:
     - cron: '0 * * * *'  # 1시간마다 실행
   ```
   - GitHub Actions가 1시간마다 자동 실행
   - Notion에서 최신 데이터 가져오기
   - 변경사항이 있으면 자동 빌드 및 배포

2. **main 브랜치에 Push**
   ```yaml
   on:
     push:
       branches: [main]
   ```
   - 코드 변경 후 `git push origin main`
   - 자동으로 빌드 및 배포

#### 🎯 수동 배포

즉시 배포하고 싶다면:

1. GitHub Repository → **Actions** 탭
2. **Deploy to GitHub Pages** 선택
3. **Run workflow** → **Run workflow** 클릭
4. 약 2-5분 후 배포 완료

#### ✅ 배포 확인

배포가 성공했는지 확인:

1. **Actions** 탭에서 워크플로우 상태 확인
   - 🟡 노란색 원: 진행 중
   - 🟢 초록색 체크: 성공
   - 🔴 빨간색 X: 실패 (로그 확인 필요)

2. 빌드 로그에서 상세 정보 확인:
   ```
   ✅ index.html exists
   Total files: 156
   Directory size: 8.2M
   ```

3. 블로그 URL 접속하여 변경사항 확인:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

#### 🐛 배포 실패 시 체크리스트

배포가 실패하면 다음을 확인하세요:

1. **Secrets 설정 확인**
   - Settings → Secrets and variables → Actions
   - `NOTION_API_KEY`, `NOTION_DATABASE_ID` 값이 올바른지 확인

2. **Notion Integration 권한 확인**
   - Notion 데이터베이스에 Integration이 초대되었는지 확인
   - "Connect to" 버튼으로 Integration 추가

3. **빌드 로그 확인**
   - Actions 탭 → 실패한 워크플로우 클릭 → "Build (static export)" 단계 로그 확인
   - Notion API 에러 메시지 확인

4. **Posts 데이터베이스 확인**
   - Status가 "Publish"인 글이 최소 1개 이상 있는지 확인
   - Slug 필드가 비어있지 않은지 확인

---

## 📝 블로그 운영 가이드

> 📖 **더 자세한 설정 방법을 원하신다면?**
> [**Notion 설정 가이드**](./docs/NOTION_SETUP_GUIDE.md)에서 데이터베이스 구성, 속성 설정, 환경 변수 등 모든 설정 과정을 단계별로 확인하실 수 있습니다.

### 새 글 작성하기

> 💡 **Posts 데이터베이스 구성 및 속성 설명**은 [Notion 설정 가이드 > 2. 포스팅 데이터베이스 설정](./docs/NOTION_SETUP_GUIDE.md#2-포스팅-데이터베이스-설정)을 참고하세요.

1. Notion의 `Blog Posts` 데이터베이스 열기
2. 새 행 추가 (`+ New` 버튼)
3. 필수 정보 입력:
   - **Title**: 포스트 제목
   - **Slug**: URL 경로 (예: `my-first-post`)
     - 영문 소문자, 숫자, 하이픈(`-`)만 사용
     - 공백 대신 하이픈 사용
     - 예시: "Next.js 시작하기" → `nextjs-getting-started`
   - **Status**: `Draft` (작성 중)
   - **Date**: 발행 날짜
4. 행 클릭하여 페이지로 이동
5. 본문 작성 (모든 Notion 블록 타입 지원)
6. 작성 완료 후 **Status**를 `Publish`로 변경
7. 최대 1시간 이내 블로그에 자동 반영

### 글 수정하기

1. Notion에서 해당 포스트 페이지 열기
2. 내용 수정
3. 저장 (자동 저장됨)
4. 최대 1시간 이내 블로그에 자동 반영

### 글 삭제/숨기기

**삭제 (블로그에서 완전히 제거)**:
- Status를 `Draft`, `Hidden`, 또는 `Wait`로 변경
- 또는 Notion에서 페이지 삭제

**임시 숨김**:
- Status를 `Hidden`으로 변경
- 나중에 다시 `Publish`로 변경 가능

### 태그 관리

1. Posts 데이터베이스의 **Tags** 열 클릭
2. 기존 태그 선택 또는 새 태그 생성
3. 태그는 자동으로 블로그에 반영

### 커버 이미지 설정

두 가지 방법:

**방법 1: 페이지 커버 사용 (권장)**
1. 포스트 페이지 열기
2. 상단 `Add cover` 클릭
3. 이미지 업로드 또는 외부 URL 입력

**방법 2: CoverImage 속성 사용**
1. Posts 데이터베이스에서 **CoverImage** 열에 이미지 업로드
2. 우선순위: 페이지 커버 > CoverImage 속성

### 프로필 업데이트

> 💡 **프로필 및 사이트 설정 데이터베이스 구성 방법**은 [Notion 설정 가이드 > 3. 프로필 설정](./docs/NOTION_SETUP_GUIDE.md#3-프로필-설정-데이터베이스-구성)과 [4. 사이트 설정](./docs/NOTION_SETUP_GUIDE.md#4-사이트-설정-데이터베이스-구성)을 참고하세요.

**Profile 데이터베이스**의 첫 번째 행에서:

1. **Name**: 이름 변경
2. **ProfileImage**: 프로필 사진 업데이트
3. **JobTitle**: 직함 수정
4. **Bio**: 자기소개 수정
5. **HomeTitle**, **HomeDescription**: 홈 페이지 제목/설명 변경
6. 소셜 링크 URL 업데이트 (GitHub, Instagram, Email 등)

**Site 데이터베이스**의 첫 번째 행에서:

1. **SiteTitle**: 사이트 제목 변경
2. **SiteDescription**: 사이트 설명 수정
3. Analytics, AdSense 설정 변경

**Favicon (파비콘) 변경:**
- `src/app/favicon.ico` 파일을 원하는 아이콘으로 교체
- 권장 사이즈: 32x32px 또는 16x16px
- 지원 형식: `.ico`, `.png`, `.svg`
- [Favicon Generator](https://favicon.io/)에서 이미지를 favicon으로 변환 가능

변경 후 최대 1시간 이내 자동으로 블로그에 반영됩니다.

### About 페이지 수정

> 💡 **About 페이지 구성 방법**은 [Notion 설정 가이드 > 5. About 페이지 구성](./docs/NOTION_SETUP_GUIDE.md#5-about-페이지-구성)을 참고하세요.

1. Notion에서 About 페이지 열기
2. 내용 자유롭게 수정
3. 자동으로 블로그에 반영

### 필터링 기능 사용하기

블로그는 **월별, 태그, 라벨** 세 가지 방식의 필터링을 자동으로 지원합니다.

#### 1. 월별 필터링
포스트 목록에서 날짜를 클릭하면 해당 월의 글만 표시됩니다.

**URL 형식:**
```
https://your-blog.github.io/your-repo/?month=2025-01
```

**사용 예시:**
- 2025년 1월 글만 보기: `?month=2025-01`
- 2024년 12월 글만 보기: `?month=2024-12`

#### 2. 라벨 필터링
포스트 목록에서 라벨(카테고리)을 클릭하면 같은 라벨의 글만 표시됩니다.

**URL 형식:**
```
https://your-blog.github.io/your-repo/?label=개발
```

**사용 예시:**
- "개발" 라벨 글만 보기: `?label=개발`
- "일상" 라벨 글만 보기: `?label=일상`

#### 3. 태그 필터링
포스트 목록에서 태그를 클릭하면 해당 태그가 포함된 글만 표시됩니다.

**URL 형식:**
```
https://your-blog.github.io/your-repo/?tag=Next.js
```

**사용 예시:**
- "Next.js" 태그 글만 보기: `?tag=Next.js`
- "React" 태그 글만 보기: `?tag=React`

#### 필터 초기화
- 활성 필터가 있을 때 페이지 상단에 **"필터: ○○○"** 표시
- **"초기화"** 버튼 클릭으로 전체 글 목록으로 돌아가기
- 또는 홈 버튼/로고 클릭

#### 페이지네이션과 필터링
- 필터링된 결과도 **4개씩** 나누어 표시
- 페이지 하단의 페이지 번호로 이동 가능
- 필터는 모든 페이지에 유지됨

**커스터마이징:**
- 페이지당 글 개수 변경: `src/components/HomeClient.tsx`의 `postsPerPage` 값 수정 (기본: 4)

---

## ⚙️ 고급 설정

> 이 섹션은 **모든 사용자**를 위한 고급 기능 설정 가이드입니다.
> 개발자 전용 커스터마이징은 아래 [개발자 가이드](#개발자-가이드) 섹션을 참고하세요.

더 자세한 고급 설정 방법은 **📖 [고급 기능 가이드](./docs/ADVANCED_FEATURES_GUIDE.md)**를 참고하세요.

### 댓글 시스템 (Giscus)

블로그에 GitHub Discussions 기반 무료 댓글 시스템을 추가할 수 있습니다.

**특징:**
- ✅ 완전 무료 - GitHub Discussions 활용
- ✅ 스팸 방지 - GitHub 계정 필요
- ✅ 마크다운 지원 - 코드 블록, 이미지 첨부 가능
- ✅ 다크 모드 자동 전환

**설정 방법:**
📖 **[Giscus 댓글 시스템 설정 가이드](./docs/GISCUS_SETUP_GUIDE.md)**를 참고하세요 (비개발자를 위한 상세 가이드)

간단 요약:
1. GitHub Discussions 활성화
2. Giscus 앱 설치
3. 환경 변수 4개 설정:
   - `NEXT_PUBLIC_GISCUS_REPO`
   - `NEXT_PUBLIC_GISCUS_REPO_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
4. **GitHub Secrets에 환경 변수 추가** (배포용 - 필수!)
   - Settings → Secrets and variables → Actions
   - 위 4개 환경 변수를 모두 GitHub Secrets에 추가해야 배포된 사이트에서 댓글 표시됨

### SEO & 분석

이 블로그는 다음 기능을 자동으로 지원합니다:

- ✅ **메타 태그**: Open Graph, Twitter Cards
- ✅ **구조화된 데이터**: JSON-LD (Article, Person, WebSite)
- ✅ **사이트맵**: 자동 생성 (`/sitemap.xml`)
- ✅ **RSS 피드**: 자동 생성 (`/rss.xml`)
- ✅ **Google Analytics 4**: 방문자 추적
- ✅ **Google AdSense**: 광고 수익화

📖 **상세 설정 방법은 [고급 기능 가이드](./docs/ADVANCED_FEATURES_GUIDE.md)를 참고하세요.**

**간단 설정:**
- **Analytics**: Site 데이터베이스에 `GA4MeasurementId` 입력
- **AdSense**: Site 데이터베이스에 `AdSensePublisherId` 입력

---

## 👨‍💻 개발자 가이드

> 이 섹션은 **개발자**를 위한 커스터마이징 및 개발 가이드입니다.
> 코드 수정이나 로컬 개발이 필요하지 않다면 건너뛰어도 됩니다.

### 📚 기술 문서 참고

**핵심 프레임워크**
- [Next.js 공식 문서](https://nextjs.org/docs) - App Router, Static Export
- [React 공식 문서](https://react.dev/) - Server Components, Hooks
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/) - 타입 시스템
- [Tailwind CSS 문서](https://tailwindcss.com/docs) - 유틸리티 클래스

**UI 라이브러리**
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/docs/components) - UI 컴포넌트 시스템
- [Lucide Icons](https://lucide.dev/icons) - 아이콘 라이브러리
- [Framer Motion 문서](https://www.framer.com/motion/) - 애니메이션

**데이터 & 검증**
- [Zod 문서](https://zod.dev/) - 스키마 검증
- [Notion API 참조](https://developers.notion.com/) - Notion SDK

**테스팅**
- [Vitest 가이드](https://vitest.dev/guide/) - 단위 테스트
- [Playwright 문서](https://playwright.dev/docs/intro) - E2E 테스트

### 스타일링 가이드

**IMPORTANT**: 스타일 작업을 시작하기 전에 반드시 읽어야 할 문서:

📖 **[Tailwind Typography 가이드](./docs/TAILWIND_TYPOGRAPHY_GUIDE.md)** - 프로젝트의 핵심 스타일링 규칙과 패턴

**핵심 원칙:**
- **shadcn/ui 우선 사용**: 새로운 UI 컴포넌트 구현 전 [shadcn/ui](https://ui.shadcn.com/docs/components) 확인 필수
- **Lucide React 아이콘**: 모든 아이콘은 [Lucide](https://lucide.dev/icons) 라이브러리 사용
- **CSS 변수 패턴**: `hsl(var(--color-name))` 형식으로 테마 색상 관리
- **Tailwind 유틸리티 클래스**: 인라인 스타일보다 Tailwind 클래스 우선

### 핵심 라이브러리

이 프로젝트는 일관성을 위해 특정 라이브러리를 필수로 사용합니다:

**데이터 검증 - [Zod](https://zod.dev/)**
- 환경 변수, API 응답 검증에 사용
- 참고: `src/lib/env.ts`, `src/lib/validation.ts`
- 문서: [Zod 공식 가이드](https://zod.dev/)

**애니메이션 - [Framer Motion](https://www.framer.com/motion/)**
- 모든 UI 애니메이션에 사용 (CSS transition 대신)
- 프리셋: `src/lib/motion.ts`
- 사용 예시: ArticleListItem, TagChips, ThemeToggle 등
- 문서: [Framer Motion API](https://www.framer.com/motion/introduction/)

### 커스터마이징

**테마 & 스타일:**
- 색상: `src/app/globals.css` 파일의 CSS 변수 수정
- 폰트: `src/app/layout.tsx` 파일에서 Google Fonts 변경
- Typography: `tailwind.config.js`의 `prose` 스타일 커스터마이징

**레이아웃:**
- 홈: `src/app/page.tsx`
- 포스트: `src/app/posts/[slug]/page.tsx`
- About: `src/app/about/page.tsx`

**동기화 주기:**
`.github/workflows/gh-pages.yml`에서 cron 설정 변경 (기본: 1시간)

**컴포넌트 개발:**
- shadcn/ui 패턴 따르기
- 서버 컴포넌트 우선 (필요시 `"use client"` 명시)
- TypeScript strict mode 준수
- **Zod**로 데이터 검증
- **Framer Motion**으로 애니메이션 구현

---

## 🔧 트러블슈팅

📖 **자세한 문제 해결은 [트러블슈팅 가이드](./docs/TROUBLESHOOTING_GUIDE.md)를 참고하세요.**

### 자주 발생하는 문제

**빌드 실패:**
- Notion API 키/데이터베이스 ID 확인
- Integration이 데이터베이스에 초대되었는지 확인
- 속성 이름 대소문자 정확히 입력 (`Title` ≠ `title`)

**글이 표시 안 됨:**
- Status가 `Publish`인지 확인
- Slug가 비어있지 않은지 확인
- 1시간 대기 또는 Actions에서 수동 배포

**이미지 깨짐:**
- Notion에 이미지 직접 업로드 (외부 링크 차단 방지)
- JPG/PNG 형식 사용 권장

**404 오류:**
- `next.config.ts`의 `repoBase` 값이 Repository 이름과 일치하는지 확인
- GitHub Pages Source가 `GitHub Actions`로 설정되었는지 확인

💡 **도움이 필요하면**: [GitHub Issues](https://github.com/freelife1191/nextjs-notion-blog/issues)에 문의하세요

---

## ❓ FAQ

### Q: 완전 무료인가요?
**A**: 네! Notion, GitHub, GitHub Pages, GitHub Actions 모두 무료입니다.
- 선택사항: 커스텀 도메인 (연 $10-20)

### Q: 댓글 기능이 있나요?
**A**: Giscus (GitHub Discussions 기반) 통합 가능합니다.
- 📖 [Giscus 설정 가이드](./docs/GISCUS_SETUP_GUIDE.md) 참고

### Q: 여러 명이 함께 운영할 수 있나요?
**A**: 네! Notion Workspace에 팀원 초대하고 GitHub Collaborator로 추가하면 됩니다.

### Q: 비공개 글 작성이 가능한가요?
**A**: 네! Status를 `Draft`, `Hidden`, 또는 `Wait`로 설정하면 블로그에 표시되지 않습니다. **`Publish` 상태만 공개**되고 나머지는 모두 비공개로 처리됩니다.

### Q: HTTPS를 지원하나요?
**A**: GitHub Pages가 자동으로 HTTPS를 제공합니다 (Let's Encrypt).

---

## 🤝 개발 참여

기여를 환영합니다!

- 🐛 **버그 제보**: [GitHub Issues](https://github.com/freelife1191/nextjs-notion-blog/issues)
- 💡 **기능 제안**: [GitHub Discussions](https://github.com/freelife1191/nextjs-notion-blog/discussions)
- 🔧 **Pull Request**: Fork → Feature 브랜치 생성 → PR 제출

**PR 가이드라인**: ESLint 통과, 테스트 추가, 명확한 설명

---

## 📢 사용 시 출처 표시 부탁드립니다

이 프로젝트는 **MIT 라이센스**로 배포되어 자유롭게 수정 및 재배포가 가능합니다.

하지만 많은 시간과 노력을 들여 만든 프로젝트인 만큼, **사용하실 때 출처를 표시해주시면 큰 힘이 됩니다!** 🙏

### 출처 표시 방법 (권장)

블로그 푸터나 About 페이지에 다음과 같이 표시해주세요:

**방법 1: 간단한 텍스트 링크**
```
Powered by nextjs-notion-blog
```

**방법 2: GitHub 링크 포함**
```
Built with nextjs-notion-blog by @freelife1191
```

**방법 3: 블로그 About 페이지나 README에 언급**
```markdown
이 블로그는 [nextjs-notion-blog](https://github.com/freelife1191/nextjs-notion-blog)를 기반으로 제작되었습니다.
```

### 왜 출처 표시가 중요한가요?

- ✅ 다른 사람들이 이 프로젝트를 발견할 수 있습니다
- ✅ 오픈소스 생태계 발전에 기여합니다
- ✅ 개발자에게 동기부여가 됩니다
- ✅ 프로젝트가 계속 발전하고 유지보수될 수 있습니다

> **참고**: 출처 표시는 의무가 아닌 권장사항입니다. 하지만 여러분의 작은 배려가 오픈소스 커뮤니티를 더욱 풍요롭게 만듭니다! 🌟

---

## 📄 라이센스

MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움으로 만들어졌습니다:

### 핵심 프레임워크
- [Next.js](https://nextjs.org/) - React 기반 풀스택 프레임워크
- [React](https://react.dev/) - UI 라이브러리
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성 보장

### CMS & 데이터
- [Notion SDK](https://github.com/makenotion/notion-sdk-js) - Notion API 공식 클라이언트
- [Zod](https://zod.dev/) - 스키마 검증 라이브러리

### UI & 스타일링
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 UI 컴포넌트 시스템
- [Lucide React](https://lucide.dev/) - 아이콘 라이브러리
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리

### 테스팅
- [Vitest](https://vitest.dev/) - 단위 테스트 프레임워크
- [Playwright](https://playwright.dev/) - E2E 테스트 프레임워크

### 디자인 참고
- [Hong Minji's Works](https://hong-minji.github.io/works/) - UI/UX 디자인 레퍼런스

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

Happy Blogging! 🚀
