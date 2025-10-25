/**
 * 아티클 날짜 배지 컴포넌트
 * 월/년도를 표시하고 클릭 시 해당 월의 포스트 목록으로 이동
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, memo } from 'react'
import { RainbowBorderMotion } from '@/components/RainbowBorderMotion'
import { ANIMATION_SCALE } from '@/lib/motion'

interface DateBadgeProps {
  /** 날짜 문자열 (ISO 8601 형식) */
  publishedAt: string
  /** 클릭 이벤트 전파 방지 여부 */
  stopPropagation?: boolean
}

/**
 * 날짜 배지 컴포넌트
 *
 * @example
 * ```tsx
 * <DateBadge publishedAt="2024-01-15T00:00:00.000Z" />
 * ```
 */
export const DateBadge = memo(function DateBadge({ publishedAt, stopPropagation = true }: DateBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 날짜 포맷팅 (예: OCTOBER 2024)
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase()
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  // 월 필터용 URL 생성 (YYYY-MM 형식)
  const getMonthParam = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 7)
  }

  return (
    <Link
      href={`/?month=${getMonthParam(publishedAt)}`}
      className="relative cursor-pointer inline-block order-first"
      onClick={(e) => stopPropagation && e.stopPropagation()}
    >
      <motion.span
        className="relative inline-block text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider px-4 py-2"
        whileHover={{ scale: ANIMATION_SCALE.HOVER_SMALL }}
        whileTap={{ scale: ANIMATION_SCALE.TAP_MEDIUM }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <span className="relative z-10">{formatDateHeader(publishedAt)}</span>
        <RainbowBorderMotion isHovered={isHovered} borderRadius="md" />
      </motion.span>
    </Link>
  )
})
