/**
 * 포스트 히어로 컴포넌트
 * 상세 페이지의 전체 폭 커버 이미지 섹션
 */

'use client'

import { memo, useMemo } from 'react'
import Image from 'next/image'

interface PostHeroProps {
  title: string
  coverImageUrl?: string
  publishedAt: string
  category?: string
  className?: string
}

export const PostHero = memo(function PostHero({ title, coverImageUrl, publishedAt, category, className = '' }: PostHeroProps) {
  // 날짜 포맷팅 (예: OCTOBER 2025) - useMemo로 캐싱
  const formattedDate = useMemo(() => {
    const date = new Date(publishedAt)
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
    const year = date.getFullYear()
    return `${month} ${year}`
  }, [publishedAt])
  return (
    <section className={`relative w-full mb-12 ${className}`}>
      {coverImageUrl ? (
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden rounded-xl shadow-xl">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
            referrerPolicy="no-referrer"
          />
          {/* 그라데이션 오버레이 - 하단만 어둡게 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* 제목 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-3 sm:space-y-4">
              {/* 날짜와 카테고리 */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wider">
                  {formattedDate}
                </span>
                {category && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs sm:text-sm font-bold text-red-500 dark:text-red-400 tracking-wider uppercase">
                      {category}
                    </span>
                  </>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-xl">
          <div className="text-center px-6">
            <div className="space-y-3 sm:space-y-4">
              {/* 날짜와 카테고리 */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                  {formattedDate}
                </span>
                {category && (
                  <>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-500 tracking-wider uppercase">
                      {category}
                    </span>
                  </>
                )}
              </div>

              {/* 제목 */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}
    </section>
  )
})
