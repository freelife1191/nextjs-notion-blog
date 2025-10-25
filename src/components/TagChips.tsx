/**
 * 태그 칩 컴포넌트
 * 포스트의 태그들을 표시하는 컴포넌트
 */

'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/lib/icons'
import { fadeVariants, scaleVariants, useInViewAnimation, useHoverAnimation, ANIMATION_DURATION } from '@/lib/motion'

interface TagChipsProps {
  tags: string[]
  maxDisplay?: number
  className?: string
}

export const TagChips = memo(function TagChips({
  tags,
  maxDisplay = 5,
  className = ''
}: TagChipsProps) {
  // displayTags와 remainingCount를 useMemo로 캐싱 (Hook은 항상 최상위에서 호출)
  const { displayTags, remainingCount } = useMemo(() => {
    if (!tags || tags.length === 0) {
      return { displayTags: [], remainingCount: 0 }
    }
    return {
      displayTags: tags.slice(0, maxDisplay),
      remainingCount: tags.length - maxDisplay
    }
  }, [tags, maxDisplay])

  // Early return은 Hook 호출 후에 실행
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <motion.div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      variants={fadeVariants}
      {...useInViewAnimation}
    >
      {displayTags.map((tag, index) => (
        <motion.div
          key={tag}
          variants={scaleVariants}
          {...useHoverAnimation}
          transition={{ delay: index * ANIMATION_DURATION.STAGGER_DELAY }}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-sm text-gray-700 dark:text-gray-300"
        >
          <Icon name="tag" size={12} />
          {tag}
        </motion.div>
      ))}

      {remainingCount > 0 && (
        <motion.div
          variants={scaleVariants}
          transition={{ delay: displayTags.length * ANIMATION_DURATION.STAGGER_DELAY }}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-500 dark:text-gray-400"
        >
          +{remainingCount}
        </motion.div>
      )}
    </motion.div>
  )
})
