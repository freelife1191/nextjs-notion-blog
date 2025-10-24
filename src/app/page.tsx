import { createHomeMetadata, createJsonLd } from '@/lib/seo'
import type { PostListItem } from '@/services/notion/client'
import { listPublishedPostsMemo, getSiteSettingsMemo, getSiteConfigMemo } from '@/lib/request-memo'
import type { Metadata } from 'next'
import { HomeClient } from '@/components/HomeClient'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const revalidate = 600 // ISR 10분

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteConfig = await getSiteConfigMemo()
    return createHomeMetadata(siteConfig)
  } catch {
    return createHomeMetadata()
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-username.github.io'

export default async function Home() {
  let posts: PostListItem[] = []
  let settings: any
  let siteConfig: any
  let error: string | null = null

  try {
    // 병렬로 설정과 포스트 가져오기
    ;[settings, siteConfig, posts] = await Promise.all([
      getSiteSettingsMemo(),
      getSiteConfigMemo(),
      listPublishedPostsMemo(),
    ])
  } catch (err) {
    error = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'

    // 에러 시에도 설정은 가져오기 시도
    try {
      ;[settings, siteConfig] = await Promise.all([
        getSiteSettingsMemo(),
        getSiteConfigMemo(),
      ])
    } catch {
      settings = {
        homeTitle: '블로그 제목',
        homeSubtitle: 'Notion Site Settings 데이터베이스에 homeTitle, homeSubtitle 속성을 설정하세요',
      }
      siteConfig = {}
    }
  }

  // WebSite Schema
  const websiteJsonLd = createJsonLd({
    type: 'WebSite',
    title: settings?.homeTitle || siteConfig?.siteTitle || '블로그 제목',
    description: settings?.homeSubtitle || siteConfig?.siteDescription || 'Notion으로 관리하는 개인 블로그',
    url: SITE_URL,
    siteConfig,
  })

  // Blog Schema
  const blogJsonLd = createJsonLd({
    type: 'Blog',
    title: settings?.homeTitle || siteConfig?.siteTitle || '블로그 제목',
    description: settings?.homeSubtitle || siteConfig?.siteDescription || 'Notion으로 관리하는 개인 블로그',
    url: SITE_URL,
    author: siteConfig?.author || '작성자 이름',
    siteConfig,
  })

  // 첫 3개 게시물의 이미지를 preload
  const imagesToPreload = posts
    .slice(0, 3)
    .map(post => post.coverImageUrl)
    .filter((url): url is string => !!url)

  return (
    <>
      {/* Preload critical images */}
      {imagesToPreload.map((url, index) => (
        <link
          key={`preload-${index}`}
          rel="preload"
          as="image"
          href={url}
        />
      ))}

      {/* Structured Data - WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Structured Data - Blog Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <Suspense
        fallback={
          <div className="py-6 lg:py-8">
            <div className="mb-8 lg:mb-10">
              <Skeleton className="h-12 w-64 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        }
      >
        <HomeClient posts={posts} settings={settings} error={error} />
      </Suspense>
    </>
  )
}
