/**
 * 아티클 리스트 아이템 컴포넌트
 * 홈페이지의 포스트 목록에서 사용되는 개별 아이템
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState, memo, useMemo } from 'react'
import { slideUpVariants, useInViewAnimation, ANIMATION_DURATION } from '@/lib/motion'
import { Card, CardContent } from '@/components/ui/card'
import { DateBadge } from '@/components/article/DateBadge'
import { LabelBadge } from '@/components/article/LabelBadge'
import { TagList } from '@/components/article/TagList'

interface ArticleListItemProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    label?: string
    tags?: string[]
    publishedAt: string
    author: string
    coverImageUrl?: string
  }
  index?: number
}

export const ArticleListItem = memo(function ArticleListItem({ post, index = 0 }: ArticleListItemProps) {
  const [shouldAnimate, setShouldAnimate] = useState(true)

  useEffect(() => {
    // 페이지 로드가 히스토리 네비게이션(뒤로가기)인 경우 애니메이션 스킵
    const navigationEntry = window.performance?.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const isBackNavigation = navigationEntry?.type === 'back_forward'
    if (isBackNavigation) {
      setShouldAnimate(false)
    }
  }, [])

  const formattedDate = useMemo(() => {
    return new Date(post.publishedAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [post.publishedAt])

  return (
    <motion.div
      {...(shouldAnimate ? useInViewAnimation : {})}
      animate="visible"
      variants={slideUpVariants}
      transition={{ delay: index * ANIMATION_DURATION.STAGGER_DELAY }}
    >
      <Card className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 shadow-none rounded-none">
        <CardContent className="px-4 sm:px-6 py-0">
          <article className="flex gap-4 sm:gap-6">
          {/* 커버 이미지 */}
          {post.coverImageUrl && (
            <Link
              href={`/posts/${post.slug}`}
              className="flex-shrink-0 w-48 h-32 sm:w-64 sm:h-40 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 relative group"
              prefetch={false}
            >
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 192px, 256px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                draggable={false}
                priority={index < 4}
                loading={index < 4 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                referrerPolicy="no-referrer"
              />
            </Link>
          )}

          {/* 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 날짜와 라벨 */}
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 mb-2">
              <DateBadge publishedAt={post.publishedAt} />
              {post.label && <LabelBadge label={post.label} />}
            </div>

            {/* 제목 */}
            <Link href={`/posts/${post.slug}`} prefetch={false} className="group mt-4 mb-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            {/* 요약 */}
            <Link href={`/posts/${post.slug}`} prefetch={false} className="mb-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                {post.excerpt}
              </p>
            </Link>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-auto">
              <Link href={`/posts/${post.slug}`} prefetch={false} className="flex items-center space-x-3 sm:space-x-4 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <span className="truncate">{post.author}</span>
                <time dateTime={post.publishedAt}>
                  {formattedDate}
                </time>
              </Link>

              {/* 태그 */}
              <TagList tags={post.tags || []} />
            </div>
          </div>
          </article>
        </CardContent>
      </Card>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: Only re-render if post content or index changes
  return (
    prevProps.post.slug === nextProps.post.slug &&
    prevProps.post.title === nextProps.post.title &&
    prevProps.post.excerpt === nextProps.post.excerpt &&
    prevProps.post.coverImageUrl === nextProps.post.coverImageUrl &&
    prevProps.post.label === nextProps.post.label &&
    prevProps.post.publishedAt === nextProps.post.publishedAt &&
    prevProps.post.author === nextProps.post.author &&
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.post.tags) === JSON.stringify(nextProps.post.tags)
  )
})
