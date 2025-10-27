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

## 🚀 빠른 시작 (20분이면 완성!)

**📘 [빠른 설치 가이드](./docs/QUICK_INSTALLATION_GUIDE.md)** ⭐ **가장 빠른 방법!**
- ⏱️ **20분 완성** - 가장 간단하고 빠른 가이드
- 💻 **코딩 불필요** - 웹 브라우저에서 클릭만으로 완료
- 📸 **스크린샷 제공** - 모든 단계를 이미지와 함께 안내
- ✅ **즉시 시작 가능** - Node.js, Git 등 개발 도구 설치 불필요

**또는 [비개발자를 위한 완전 가이드](./docs/NON_DEVELOPER_GUIDE.md)** (30분)
- 더 자세한 설명이 필요하다면 이 가이드를 선택하세요

---

**👨‍💻 개발자이신가요?**

로컬 개발 환경을 설정하고 커스터마이징하고 싶다면 **[개발자 가이드](./docs/DEVELOPER_GUIDE.md)** (60분)를 참고하세요.
- Node.js 20+, Git 필요
- 로컬 개발 환경 설정
- 테스트 실행 및 커스터마이징

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
- **1시간마다 자동으로** Notion 변경사항 감지
- 글 작성 → 발행 상태 변경 → **1시간 이내 자동 배포**
- GitHub Actions가 모든 과정을 자동화

</td>
</tr>
</table>

**💡 사용 방법:** Notion에서 글 작성 → Status를 "Publish"로 변경 → 완료! 나머지는 자동입니다.

<!-- TOC -->
* [Next.js Notion Blog](#nextjs-notion-blog)
  * [🚀 빠른 시작 (20분이면 완성!)](#-빠른-시작-20분이면-완성)
  * [✨ 핵심 기능](#-핵심-기능)
    * [🎯 **Notion에서 모든 것을 관리**](#-notion에서-모든-것을-관리)
    * [⚡ **완전 자동 동기화**](#-완전-자동-동기화)
  * [💡 프로젝트 소개](#-프로젝트-소개)
    * [📚 Notion CMS란?](#-notion-cms란)
    * [⚖️ Notion CMS 블로그의 장단점](#-notion-cms-블로그의-장단점)
    * [📊 규모별 적합성](#-규모별-적합성)
    * [왜 이 프로젝트를 사용해야 하나요?](#왜-이-프로젝트를-사용해야-하나요)
    * [데모](#데모)
    * [버그 제보 및 기능 요청](#버그-제보-및-기능-요청)
  * [🛠️ 기술 스택](#-기술-스택)
    * [🎨 프론트엔드](#-프론트엔드)
    * [⚙️ 백엔드 & 인프라](#-백엔드--인프라)
    * [🧪 개발 도구 & 품질 보증](#-개발-도구--품질-보증)
    * [🔌 추가 기능](#-추가-기능)
  * [🎯 주요 기능](#-주요-기능)
    * [📝 콘텐츠 관리](#-콘텐츠-관리)
    * [🎨 블로그 기능](#-블로그-기능)
    * [🚀 SEO & 성능](#-seo--성능)
    * [🎨 사이트 설정](#-사이트-설정)
    * [💰 분석 & 수익화](#-분석--수익화)
    * [🛡️ 품질 보증](#-품질-보증)
  * [📁 디렉토리 구조](#-디렉토리-구조)
  * [📝 블로그 운영 가이드](#-블로그-운영-가이드)
    * [새 글 작성하기](#새-글-작성하기)
    * [글 수정하기](#글-수정하기)
    * [글 삭제/숨기기](#글-삭제숨기기)
    * [태그 관리](#태그-관리)
    * [커버 이미지 설정](#커버-이미지-설정)
    * [프로필 업데이트](#프로필-업데이트)
    * [About 페이지 수정](#about-페이지-수정)
    * [필터링 기능 사용하기](#필터링-기능-사용하기)
      * [1. 월별 필터링](#1-월별-필터링)
      * [2. 라벨 필터링](#2-라벨-필터링)
      * [3. 태그 필터링](#3-태그-필터링)
      * [필터 초기화](#필터-초기화)
      * [페이지네이션과 필터링](#페이지네이션과-필터링)
  * [⚙️ 고급 설정](#-고급-설정)
    * [댓글 시스템 (Giscus)](#댓글-시스템-giscus)
    * [SEO & 분석](#seo--분석)
  * [👨‍💻 개발자 가이드](#-개발자-가이드)
  * [🔧 트러블슈팅](#-트러블슈팅)
    * [자주 발생하는 문제](#자주-발생하는-문제)
  * [❓ FAQ](#-faq)
    * [Q: 완전 무료인가요?](#q-완전-무료인가요)
    * [Q: 댓글 기능이 있나요?](#q-댓글-기능이-있나요)
    * [Q: 여러 명이 함께 운영할 수 있나요?](#q-여러-명이-함께-운영할-수-있나요)
    * [Q: 비공개 글 작성이 가능한가요?](#q-비공개-글-작성이-가능한가요)
    * [Q: HTTPS를 지원하나요?](#q-https를-지원하나요)
  * [🤝 개발 참여](#-개발-참여)
  * [📢 사용 시 출처 표시 부탁드립니다](#-사용-시-출처-표시-부탁드립니다)
    * [출처 표시 방법 (권장)](#출처-표시-방법-권장)
    * [왜 출처 표시가 중요한가요?](#왜-출처-표시가-중요한가요)
  * [📄 라이센스](#-라이센스)
  * [🙏 감사의 말](#-감사의-말)
    * [핵심 프레임워크](#핵심-프레임워크)
    * [CMS & 데이터](#cms--데이터)
    * [UI & 스타일링](#ui--스타일링)
    * [테스팅](#테스팅)
    * [디자인 참고](#디자인-참고)
<!-- TOC -->

---

## 💡 프로젝트 소개

이 프로젝트는 **Notion을 CMS로 활용**하여 블로그를 자동으로 생성하고 **GitHub Pages에 배포**하는 시스템입니다.

### 📚 Notion CMS란?

**Notion CMS(Content Management System)** 는 문서 작성 도구인 Notion을 블로그의 콘텐츠 관리 시스템으로 사용하는 방식입니다.

**전통적인 블로그 vs Notion CMS 블로그:**

| 구분 | 전통적인 블로그 | Notion CMS 블로그 |
|------|--------------|------------------|
| **글 작성** | WordPress 관리자 페이지 | 익숙한 Notion 에디터 |
| **에디터** | 별도 학습 필요 | Notion 사용 경험 그대로 |
| **이미지 업로드** | 별도 업로드 절차 | Notion에 붙여넣기만 |
| **백업** | 별도 백업 필요 | Notion에 자동 저장 |
| **협업** | 제한적 | Notion 공유 기능 활용 |
| **비용** | 호스팅 비용 발생 | 완전 무료 |

**Notion CMS 아키텍처:**

```
┌─────────────────────────────────────────────────────────────┐
│                         사용자                               │
│                     (콘텐츠 작성자)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │      📝 Notion       │ ← 콘텐츠 작성 및 관리
              │        (CMS)         │   - 글 작성 (29가지 블록)
              │                      │   - Status: Publish 설정
              └──────────┬───────────┘   - 태그, 카테고리 관리
                         │
                         │ Notion API
                         │ (초당 3회 제한)
                         ▼
              ┌──────────────────────┐
              │  🔄 GitHub Actions   │ ← 1시간마다 자동 동기화
              │   (Cron: 0 */1 *)    │   - Cron 스케줄링
              │                      │   - 자동 빌드 트리거
              └──────────┬───────────┘   - 환경 변수 관리
                         │
                         │ Build & Deploy
                         │
                         ▼
              ┌──────────────────────┐
              │    🏗️ Next.js 15     │ ← Static Export 빌드
              │       (SSG)          │   - getStaticProps
              │                      │   - generateStaticParams
              └──────────┬───────────┘   - Notion 블록 → React
                         │
                         │ HTML/CSS/JS
                         │ (out/ 디렉토리)
                         ▼
              ┌──────────────────────┐
              │  🌐 GitHub Pages     │ ← 무료 호스팅
              │       (CDN)          │   - HTTPS 자동 인증서
              │                      │   - 전 세계 CDN 배포
              └──────────┬───────────┘   - 빠른 로딩 속도
                         │
                         ▼
              ┌──────────────────────┐
              │     👥 독자          │ ← 블로그 방문
              │  https://username    │   - 정적 페이지 (매우 빠름)
              │    .github.io        │   - SEO 최적화
              └──────────────────────┘   - 다크모드, 댓글 등
```

**데이터 흐름:**
1. **📝 Notion** → 글 작성 & Status를 "Publish"로 변경
2. **⏰ 1시간 대기** → GitHub Actions Cron이 자동 실행
3. **🔄 GitHub Actions** → Notion API 호출하여 콘텐츠 조회
4. **🏗️ Next.js** → Notion 데이터를 HTML/CSS/JS로 변환 (SSG)
5. **📦 빌드** → `out/` 디렉토리에 정적 파일 생성
6. **🚀 배포** → GitHub Pages에 자동 업로드
7. **🌐 공개** → `https://username.github.io`에서 접속 가능

### ⚖️ Notion CMS 블로그의 장단점

**✅ 장점:**
- **편리한 글 작성** - Notion의 직관적인 에디터로 HTML/CSS 지식 없이 글 작성 가능
- **완전 무료** - Notion 무료 플랜 + GitHub 무료 서비스로 운영 비용 0원
- **자동 백업** - Notion에 모든 콘텐츠가 저장되어 안전
- **협업 친화적** - Notion 공유 기능으로 팀 블로그 운영 가능
- **버전 관리** - Notion의 페이지 기록으로 이전 버전 복구 가능
- **빠른 성능** - 정적 사이트 생성(SSG)으로 매우 빠른 로딩 속도

**⚠️ 단점 및 제약사항:**
- **빌드 시간** - 페이지가 많을수록 빌드 시간 증가 (100개 글 기준 약 2-3분)
- **Notion API 제한** - 초당 3회 요청 제한 (Rate Limit)
- **실시간 반영 불가** - 글 작성 후 1시간 이내 반영 (수동 배포로 즉시 가능)
- **대규모 사이트** - 1,000개 이상의 글이 있는 경우 빌드 시간이 길어질 수 있음

### 📊 규모별 적합성

이 프로젝트는 **소~중형 블로그**에 최적화되어 있습니다:

| 블로그 규모 | 글 개수 | 빌드 시간 | 권장사항 |
|-----------|--------|---------|---------|
| **소형** | ~100개 | 1-3분 | ✅ **매우 적합** - 빠른 빌드, 무료 운영 |
| **중형** | 100~500개 | 3-10분 | ✅ **적합** - ISR 방식 권장 |
| **대형** | 500~1,000개 | 10-30분 | ⚠️ **주의** - 캐싱 최적화 필수 |
| **초대형** | 1,000개+ | 30분+ | ❌ **비권장** - Headless CMS 검토 |

💡 **대규모 블로그를 운영하고 싶다면?**
- Notion CMS 최적화 서비스: [Feather.so](https://feather.so), [Super.so](https://super.so)
- 또는 Contentful, Strapi, Sanity 같은 전문 Headless CMS 고려

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
  - 무료 CMS (Notion 무료 플랜 사용 가능)
  - Rate Limit: 초당 3회 요청 제한
- **GitHub Actions** - CI/CD 자동화
  - Cron 스케줄링 (1시간마다 자동 동기화)
  - 자동 빌드 및 배포
  - 무료 CI/CD (GitHub 무료 플랜)
- **GitHub Pages** - 정적 사이트 호스팅
  - 무료 호스팅
  - 자동 SSL/HTTPS 인증서 제공
  - CDN을 통한 빠른 전송

### 🧪 개발 도구 & 품질 보증
- **Vitest** - 단위 테스트 프레임워크
  - ✅ **359개 테스트 케이스** (14개 테스트 파일)
  - 캐싱, 검증, 오류 처리, Notion 클라이언트 등 핵심 로직 검증
  - 회귀 테스트로 이전 버그 재발 방지
- **Playwright** - E2E 테스트 프레임워크
  - ✅ **5개 E2E 테스트 파일** (홈, 포스트, 성능, UI 검증)
  - `@playwright/mcp` - MCP 서버를 통한 AI 지원 테스팅
  - 멀티 브라우저 지원 (Chromium, Firefox, WebKit)
  - 모바일 디바이스 테스트 (Pixel 5, iPhone 12)
- **CI/CD 자동 검증**
  - GitHub Actions에서 모든 테스트 자동 실행
  - 배포 전 품질 검증 (100% 테스트 통과 필수)
  - 빌드 실패 시 자동 알림
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
- ✅ **노션 기반 글 작성** - 노션의 **29가지 블록 타입** 완벽 지원
  <details>
  <summary><b>📦 지원하는 Notion 블록 타입 전체 목록 (29개)</b></summary>

  **기본 블록 (7개)**
  - ✅ Paragraph (단락)
  - ✅ Heading 1, 2, 3 (제목)
  - ✅ Bulleted List (글머리 기호 목록)
  - ✅ Numbered List (번호 매기기 목록)
  - ✅ To-do (체크리스트)
  - ✅ Toggle (토글 목록)
  - ✅ Divider (구분선)

  **미디어 블록 (5개)**
  - ✅ Image (이미지)
  - ✅ Video (비디오 - YouTube, Vimeo, Spotify, Apple Podcasts)
  - ✅ Audio (오디오)
  - ✅ File (파일 다운로드)
  - ✅ PDF (PDF 뷰어)

  **고급 블록 (7개)**
  - ✅ Code (코드 블록 - Prism.js 구문 강조)
  - ✅ Quote (인용구)
  - ✅ Callout (콜아웃)
  - ✅ Table (표)
  - ✅ Equation (수식 - LaTeX/KaTeX)
  - ✅ Table of Contents (목차)
  - ✅ Columns (2단/3단 레이아웃)

  **임베드 블록 (3개)**
  - ✅ Bookmark (북마크 - YouTube 리치 프리뷰 지원)
  - ✅ Embed (외부 콘텐츠 임베드)
  - ✅ Link Preview (링크 미리보기)

  **데이터베이스 & 페이지 (5개)**
  - ✅ Child Page (하위 페이지)
  - ✅ Child Database (하위 데이터베이스)
  - ✅ Synced Block (동기화 블록)
  - ✅ Link to Page (페이지 링크)
  - ✅ Template (템플릿)

  **기타 (2개)**
  - ✅ Breadcrumb (브레드크럼)
  - ✅ Unsupported Blocks (미지원 블록 안내)

  **특별 지원 기능**
  - 🎨 **Notion 색상 지원** - 텍스트 색상 및 배경색 완벽 지원
  - 🔗 **멘션 지원** - Page, User, Date, Link Preview 멘션
  - 📱 **반응형 임베드** - YouTube, Vimeo, Spotify 자동 임베드
  - 🎯 **중첩 블록** - Toggle, Callout 내부 블록 완벽 렌더링
  </details>
- ✅ **자동 동기화** - 1시간마다 GitHub Actions가 자동으로 노션에서 최신 콘텐츠 가져오기
- ✅ **상태 관리** - Publish, Draft, Hidden, Wait 상태로 글 관리
- ✅ **태그 & 카테고리** - 다중 태그 및 라벨 분류
- ✅ **커버 이미지** - 노션 페이지 커버 또는 CoverImage 속성 지원

### 🎨 블로그 기능
- ✅ **반응형 디자인** - 모바일, 태블릿, 데스크톱 완벽 지원
- ✅ **다크 모드** - 시스템 설정 기반 자동 전환
- ✅ **About Me 페이지** - Notion 페이지 동기화로 자동 생성
- ✅ **댓글 시스템** - Giscus 댓글 시스템 (GitHub Discussions 기반)
- ✅ **프로필 사이드바** - 좌측 고정 프로필 영역
  - 프로필 사진 및 이름, 직함 표시
  - Bio (자기소개) - 마크다운 지원
  - 15개 소셜 미디어 링크 (GitHub, Instagram, Email, LinkedIn, Twitter, YouTube, Threads, Facebook, TikTok, Telegram, Line, Kakao, KakaoChannel, Blog, Notion)
  - 개발 진행 상태 모달
  - 반응형 모바일 메뉴
- ✅ **마크다운 지원**
  - 홈 페이지 상단 설명 (HomeDescription) - 마크다운 문법 완벽 지원
  - 프로필 Bio - 마크다운 렌더링
  - GitHub Flavored Markdown (GFM) 지원
  - 코드 블록, 링크, 리스트 등 모든 마크다운 요소 지원
- ✅ **스마트 필터링** - 월별, 태그, 라벨로 글 필터링
- ✅ **페이지네이션** - 4개씩 나누어 표시 (커스터마이징 가능)
- ✅ **목차 (TOC)** - 자동 생성되는 포스트 목차
- ✅ **앵커 링크** - 헤딩 옆 링크 아이콘으로 섹션 URL 복사
  - 원클릭 링크 복사 (클립보드 자동 복사)
  - URL 해시 자동 업데이트
  - 복사 성공 시 시각적 피드백
  - 부드러운 스크롤 이동
  - 목차에서 헤딩으로 바로 이동
- ✅ **코드 하이라이팅** - Prism.js 기반 다양한 언어 지원
- ✅ **유튜브 임베드** - 북마크로 유튜브 영상 자동 임베드
- ✅ **이미지 줌** - 이미지 확대 모달 뷰어

### 🚀 SEO & 성능
- ✅ **완벽한 SEO** - Open Graph, Twitter Cards, JSON-LD
  - 메타 태그 자동 생성
  - 소셜 미디어 미리보기 (Open Graph 이미지)
  - 구조화된 데이터 (JSON-LD)
- ✅ **사이트맵 자동 생성** - 검색 엔진 크롤링 최적화
- ✅ **RSS 피드** - 구독자를 위한 RSS 지원
- ✅ **빠른 로딩** - Static Export로 CDN을 통한 즉시 로딩
  - Static Site Generation (SSG) - 사전 빌드
  - 빌드 타임 캐싱 시스템
  - 자동 페이지 프리페치 (Prefetch)
  - 동적 import 최적화 (Code Splitting)
  - Turbopack 초고속 번들러
- ✅ **이미지 최적화** - Priority loading, Blur placeholder, Preload 지원
  - 첫 3개 이미지 우선 로딩 (LCP 개선)
  - 로딩 중 Blur placeholder 표시 (CLS 방지)
  - 중요 이미지 Preload (초기 로딩 속도 향상)
- ✅ **보안 설정** - API 키 GitHub Secrets 암호화 저장
- ✅ **커스텀 도메인** - 개인 도메인 연결 가능
- ✅ **HTTPS** - 자동 SSL 인증서 (GitHub Pages 제공)

### 🎨 사이트 설정
- ✅ **Notion 기반 사이트 설정** - Site 데이터베이스로 관리
  - 사이트 제목, 설명, 파비콘 설정
  - SEO 메타 정보 관리
  - 환경별 설정 분리 (개발/프로덕션)

### 💰 분석 & 수익화
- ✅ **Google Analytics 4** - 방문자 추적 및 분석
- ✅ **Google AdSense** - 광고를 통한 수익 창출 (선택)
  - **Auto Ads (자동 광고)** - Google이 최적 위치에 자동으로 광고 배치
  - Publisher ID만 입력하면 자동으로 광고 표시
  - 반응형 광고 (모바일/데스크톱 최적화)
  - 프로덕션 환경에서만 활성화
  - afterInteractive 전략으로 페이지 로딩 성능 최적화

### 🛡️ 품질 보증
- ✅ **Unit Tests** - 359개 테스트 케이스 (14개 테스트 파일)
  - Vitest 기반 단위 테스트
  - 캐싱, 검증, 오류 처리, Notion 클라이언트 등 핵심 로직 검증
  - 회귀 테스트로 이전 버그 재발 방지
- ✅ **E2E Tests** - Playwright (5개 테스트 파일)
  - 홈페이지, 포스트 페이지, 성능, UI 검증
  - 멀티 브라우저 지원 (Chromium, Firefox, WebKit)
  - 모바일 디바이스 테스트 (Pixel 5, iPhone 12)
- ✅ **CI/CD 자동 검증** - GitHub Actions에서 모든 테스트 자동 실행
  - 배포 전 품질 검증 (100% 테스트 통과 필수)
  - 빌드 실패 시 자동 알림

---

## 📁 디렉토리 구조

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
│   │   ├── ProfileSidebar.tsx      # 프로필 사이드바 (15개 소셜 링크, Bio 마크다운)
│   │   ├── PostCard.tsx            # 포스트 카드
│   │   ├── Markdown.tsx            # 마크다운 렌더러 (GFM 지원)
│   │   ├── HeadingAnchorScript.tsx # 헤딩 앵커 링크 (클릭으로 URL 복사)
│   │   ├── GoogleAnalytics.tsx     # GA4 통합
│   │   └── GoogleAdSense.tsx       # AdSense Auto Ads 통합
│   ├── services/            # 비즈니스 로직
│   │   └── notion/
│   │       ├── client.ts           # Notion API 클라이언트
│   │       └── renderer.ts         # Notion 블록 → HTML 변환
│   └── lib/                 # 유틸리티 함수
│       ├── env.ts                  # 환경 변수 검증
│       ├── cache.ts                # 캐싱 시스템
│       ├── seo.ts                  # SEO 헬퍼
│       └── toc.ts                  # 목차 생성 및 앵커 링크 관리
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

## 📝 블로그 운영 가이드

> 📖 **더 자세한 설정 방법을 원하신다면?**
> [**Notion 설정 가이드**](./docs/NOTION_SETUP_GUIDE.md)에서 데이터베이스 구성, 속성 설정, 환경 변수 등 모든 설정 과정을 단계별로 확인하실 수 있습니다.

### 새 글 작성하기

> 💡 **Posts 데이터베이스 구성 및 속성 설명**은 [Notion 설정 가이드 > 2. Posts 데이터베이스 설정](./docs/NOTION_SETUP_GUIDE.md#2-블로그 -데이터베이스-설정)을 참고하세요.

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

더 자세한 고급 설정 방법은 **📖 [고급 기능 가이드](./docs/ADVANCED_FEATURES_GUIDE.md)** 를 참고하세요.

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

로컬 개발 환경을 설정하고 프로젝트를 커스터마이징하려는 개발자를 위한 가이드입니다.

**📘 [개발자 가이드 전체 문서 보기](./docs/DEVELOPER_GUIDE.md)** (60분)

**포함 내용:**
- ✅ 사전 준비 (Node.js 20+, Git)
- ✅ 프로젝트 Fork 및 Clone
- ✅ Notion 설정
- ✅ GitHub 설정 (Secrets, Pages, Actions)
- ✅ 로컬 개발 환경 설정 (`.env.local`)
- ✅ 블로그 배포
- ✅ 커스터마이징 (프로필, 테마, 페이지네이션)
- ✅ 테스트 (Unit & E2E)
- ✅ 문제 해결

**핵심 기술 문서:**
- [Next.js 공식 문서](https://nextjs.org/docs) - App Router, Static Export
- [Tailwind Typography 가이드](./docs/TAILWIND_TYPOGRAPHY_GUIDE.md) - 스타일링 규칙과 패턴
- [shadcn/ui 컴포넌트](https://ui.shadcn.com/docs/components) - UI 컴포넌트 시스템
- [Notion API 참조](https://developers.notion.com/) - Notion SDK

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
Powered by freelife1191/nextjs-notion-blog
```

**방법 2: GitHub 링크 포함**
```
Built with nextjs-notion-blog by freelife1191
```

**방법 3: 블로그 About 페이지나 README에 언급**
```markdown
이 블로그는 [freelife1191/nextjs-notion-blog](https://github.com/freelife1191/nextjs-notion-blog)를 기반으로 제작되었습니다.
```

**방법 4: 링크로 연결**
```markdown
Powered by [nextjs-notion-blog](https://github.com/freelife1191/nextjs-notion-blog)
```

### 왜 출처 표시가 중요한가요?

- ✅ 다른 사람들이 이 프로젝트를 발견할 수 있습니다
- ✅ 오픈소스 생태계 발전에 기여합니다
- ✅ 개발자에게 동기부여가 됩니다
- ✅ 프로젝트가 계속 발전하고 유지보수될 수 있습니다

> **참고**: 출처 표시는 의무가 아닌 권장사항입니다. 하지만 여러분의 작은 배려가 오픈소스 커뮤니티를 더욱 풍요롭게 만듭니다! 🌟

---

## 📄 라이센스

이 프로젝트는 [MIT 라이센스](./LICENSE) 하에 배포됩니다.

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
