/**
 * 페이지네이션 컴포넌트
 * PREV/NEXT 네비게이션 구현
 */

'use client'

import Link from 'next/link'
import { NavigationIcon } from '@/lib/icons'
import { motion } from 'framer-motion'
import { fadeVariants, scaleVariants, useInViewAnimation, useHoverAnimation } from '@/lib/motion'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const getPageUrl = (page: number) => {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <motion.nav
      className="flex justify-center items-center py-8"
      variants={fadeVariants}
      {...useInViewAnimation}
      aria-label="페이지 네비게이션"
    >
      <div className="flex items-center space-x-4">
        {/* PREV 버튼 */}
        {hasPrevPage ? (
          <motion.div
            variants={scaleVariants}
            {...useHoverAnimation}
          >
            <Link
              href={getPageUrl(currentPage - 1)}
              className="inline-flex items-center px-4 py-2 text-body text-foreground hover:text-primary transition-colors"
              aria-label={`이전 페이지 (${currentPage - 1}페이지)`}
            >
              <NavigationIcon direction="prev" size={16} className="mr-2" />
              PREV
            </Link>
          </motion.div>
        ) : (
          <span
            className="inline-flex items-center px-4 py-2 text-body text-muted-foreground cursor-not-allowed"
            aria-disabled="true"
          >
            <NavigationIcon direction="prev" size={16} className="mr-2" />
            PREV
          </span>
        )}

        {/* 페이지 번호 (선택사항 - 레퍼런스에 따라 숨김) */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <span
              className="text-body-small text-muted-foreground"
              aria-current="page"
              aria-label={`현재 페이지: ${currentPage} / 전체 ${totalPages}페이지`}
            >
              {currentPage} / {totalPages}
            </span>
          </div>
        )}

        {/* NEXT 버튼 */}
        {hasNextPage ? (
          <motion.div
            variants={scaleVariants}
            {...useHoverAnimation}
          >
            <Link
              href={getPageUrl(currentPage + 1)}
              className="inline-flex items-center px-4 py-2 text-body text-foreground hover:text-primary transition-colors"
              aria-label={`다음 페이지 (${currentPage + 1}페이지)`}
            >
              NEXT
              <NavigationIcon direction="next" size={16} className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <span
            className="inline-flex items-center px-4 py-2 text-body text-muted-foreground cursor-not-allowed"
            aria-disabled="true"
          >
            NEXT
            <NavigationIcon direction="next" size={16} className="ml-2" />
          </span>
        )}
      </div>
    </motion.nav>
  )
}
