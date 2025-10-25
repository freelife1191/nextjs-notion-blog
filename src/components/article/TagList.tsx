/**
 * 아티클 태그 목록 컴포넌트
 * 태그 목록을 표시하고 더보기 기능 제공
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, memo } from 'react'
import { RainbowBorderMotion } from '@/components/RainbowBorderMotion'
import { ANIMATION_SCALE } from '@/lib/motion'

interface TagListProps {
  /** 태그 배열 */
  tags: string[]
  /** 초기 표시 태그 수 (기본: 2) */
  initialDisplayCount?: number
  /** 클릭 이벤트 전파 방지 여부 */
  stopPropagation?: boolean
}

/**
 * 태그 목록 컴포넌트
 *
 * 처음에는 지정된 개수만큼의 태그만 표시하고,
 * 나머지는 "+N" 버튼을 클릭하여 확장할 수 있습니다.
 *
 * @example
 * ```tsx
 * <TagList tags={['React', 'TypeScript', 'Next.js']} initialDisplayCount={2} />
 * ```
 */
export const TagList = memo(function TagList({
  tags,
  initialDisplayCount = 2,
  stopPropagation = true,
}: TagListProps) {
  const [showAllTags, setShowAllTags] = useState(false)
  const [hoveredTagIndex, setHoveredTagIndex] = useState<number | null>(null)

  const toggleShowAllTags = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowAllTags(!showAllTags)
  }

  if (!tags || tags.length === 0) {
    return null
  }

  const visibleTags = showAllTags ? tags : tags.slice(0, initialDisplayCount)
  const hasMoreTags = tags.length > initialDisplayCount

  return (
    <div className="hidden sm:flex items-center space-x-2">
      {visibleTags.map((tag, index) => (
        <Link
          key={`${tag}-${index}`}
          href={`/?tag=${encodeURIComponent(tag)}`}
          className="relative cursor-pointer inline-block"
          onClick={(e) => stopPropagation && e.stopPropagation()}
        >
          <motion.span
            className="inline-block px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs relative"
            whileHover={{ scale: ANIMATION_SCALE.HOVER_SMALL }}
            whileTap={{ scale: ANIMATION_SCALE.TAP_SMALL }}
            onHoverStart={() => setHoveredTagIndex(index)}
            onHoverEnd={() => setHoveredTagIndex(null)}
          >
            <span className="relative z-10">{tag}</span>
            <RainbowBorderMotion isHovered={hoveredTagIndex === index} borderRadius="full" />
          </motion.span>
        </Link>
      ))}

      {hasMoreTags && !showAllTags && (
        <span
          className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          onClick={toggleShowAllTags}
        >
          +{tags.length - initialDisplayCount}
        </span>
      )}
    </div>
  )
})
