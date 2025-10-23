/**
 * 태그 칩 컴포넌트
 * 포스트의 태그들을 표시하는 컴포넌트
 */

'use client'

import { motion } from 'framer-motion'
import { Icon } from '@/lib/icons'
import { fadeVariants, scaleVariants, useInViewAnimation, useHoverAnimation, ANIMATION_DURATION } from '@/lib/motion'

interface TagChipsProps {
  tags: string[]
  maxDisplay?: number
  className?: string
}

export function TagChips({
  tags,
  maxDisplay = 5,
  className = ''
}: TagChipsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  const displayTags = tags.slice(0, maxDisplay)
  const remainingCount = tags.length - maxDisplay

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
}
