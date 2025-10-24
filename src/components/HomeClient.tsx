/**
 * 홈 페이지 클라이언트 컴포넌트
 * 필터링 및 페이지네이션을 처리합니다
 */

'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ArticleListItem } from '@/components/ArticleListItem'
import { EmptyState, ErrorState } from '@/components/states'
import type { PostListItem } from '@/services/notion/client'
import { NavigationIcon } from '@/lib/icons'
import { useSearchParams } from 'next/navigation'
import { Markdown } from './Markdown'
import CodeHighlight from './CodeHighlight'

interface HomeClientProps {
  posts: PostListItem[]
  settings: {
    homeTitle: string
    homeDescription?: string
  }
  error: string | null
}

export function HomeClient({ posts, settings, error }: HomeClientProps) {
  const searchParams = useSearchParams()

  // 필터 파라미터
  const filterMonth = searchParams.get('month') || undefined
  const filterLabel = searchParams.get('label') || undefined
  const filterTag = searchParams.get('tag') || undefined

  // 페이지 파라미터
  const currentPage = Number(searchParams.get('page')) || 1
  const postsPerPage = 4

  // 필터링 및 페이지네이션 계산 (useMemo로 최적화)
  const { paginatedPosts, totalPosts, totalPages } = useMemo(() => {
    // 필터링 적용
    let filteredPosts = posts

    if (filterMonth) {
      filteredPosts = filteredPosts.filter((post) => {
        const postMonth = post.date?.slice(0, 7) // YYYY-MM 형식
        return postMonth === filterMonth
      })
    }

    if (filterLabel) {
      filteredPosts = filteredPosts.filter((post) => post.label === filterLabel)
    }

    if (filterTag) {
      filteredPosts = filteredPosts.filter((post) => post.tags?.includes(filterTag))
    }

    // 페이지네이션 계산
    const totalPosts = filteredPosts.length
    const totalPages = Math.ceil(totalPosts / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return {
      paginatedPosts,
      totalPosts,
      totalPages,
    }
  }, [posts, filterMonth, filterLabel, filterTag, currentPage, postsPerPage])

  // 활성 필터 확인
  const hasActiveFilters = filterMonth || filterLabel || filterTag

  // 필터 레이블 생성
  const getFilterLabel = () => {
    if (filterMonth) {
      const date = new Date(filterMonth + '-01')
      const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
      const year = date.getFullYear()
      return `${month} ${year}`
    }
    if (filterLabel) return filterLabel
    if (filterTag) return `#${filterTag}`
    return null
  }

  return (
    <>
      <CodeHighlight />
      <div className="pt-6">
        {/* 페이지 헤더 */}
        <header className="mb-6 lg:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {settings.homeTitle}
        </h1>
        <div className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <Markdown className="[&>*]:text-sm lg:[&>*]:text-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {settings.homeDescription || ''}
          </Markdown>
        </div>

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">필터:</span>
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium">
                {getFilterLabel()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({totalPosts}개)
              </span>
              <Link
                href="/"
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                초기화
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 포스트 목록 */}
      <section>
        {error ? (
          <ErrorState
            title="데이터를 불러올 수 없습니다"
            description="Notion API에서 데이터를 가져오는 중 문제가 발생했습니다."
            error={error}
            showHomeButton={true}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title="아직 게시된 글이 없습니다"
            description="곧 새로운 콘텐츠를 준비하겠습니다."
            icon="file"
          />
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              {paginatedPosts.map((post, index) => (
                <ArticleListItem
                  key={post.slug}
                  post={{
                    id: post.slug,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.description || '',
                    label: post.label,
                    tags: post.tags,
                    publishedAt: post.date || new Date().toISOString(),
                    author: post.author || '작성자',
                    coverImageUrl: post.coverImageUrl,
                  }}
                  index={index}
                />
              ))}
            </div>

            {/* 스타일리쉬한 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center justify-between w-full gap-4">
                  {/* PREV 버튼 */}
                  <Link
                    href={currentPage > 1 ? `/?page=${currentPage - 1}` : '#'}
                    prefetch={false}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      currentPage > 1
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-800 cursor-not-allowed'
                    }`}
                    aria-disabled={currentPage <= 1}
                  >
                    <NavigationIcon direction="prev" size={20} />
                    <span className="hidden sm:inline">PREV</span>
                  </Link>

                  {/* 페이지 번호들 */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/?page=${page}`}
                        prefetch={false}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                          page === currentPage
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg scale-110'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>

                  {/* NEXT 버튼 */}
                  <Link
                    href={currentPage < totalPages ? `/?page=${currentPage + 1}` : '#'}
                    prefetch={false}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      currentPage < totalPages
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-800 cursor-not-allowed'
                    }`}
                    aria-disabled={currentPage >= totalPages}
                  >
                    <span className="hidden sm:inline">NEXT</span>
                    <NavigationIcon direction="next" size={20} />
                  </Link>
                </nav>
              </div>
            )}
          </>
        )}
      </section>

      </div>
    </>
  )
}
