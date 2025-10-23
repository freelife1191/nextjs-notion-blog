/**
 * 아티클 라벨 배지 컴포넌트
 * 카테고리 라벨을 표시하고 클릭 시 해당 라벨의 포스트 목록으로 이동
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { RainbowBorderMotion } from '@/components/RainbowBorderMotion'
import { ANIMATION_SCALE } from '@/lib/motion'

interface LabelBadgeProps {
  /** 라벨 텍스트 */
  label: string
  /** 클릭 이벤트 전파 방지 여부 */
  stopPropagation?: boolean
}

/**
 * 라벨 배지 컴포넌트
 *
 * @example
 * ```tsx
 * <LabelBadge label="Technology" />
 * ```
 */
export function LabelBadge({ label, stopPropagation = true }: LabelBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/?label=${encodeURIComponent(label)}`}
      className="relative cursor-pointer inline-block"
      onClick={(e) => stopPropagation && e.stopPropagation()}
    >
      <motion.span
        className="relative inline-block text-sm font-bold text-pink-600 dark:text-pink-600 tracking-wider uppercase px-4 py-2"
        whileHover={{ scale: ANIMATION_SCALE.HOVER_MEDIUM }}
        whileTap={{ scale: ANIMATION_SCALE.TAP_MEDIUM }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <span className="relative z-10">{label}</span>
        <RainbowBorderMotion isHovered={isHovered} borderRadius="md" />
      </motion.span>
    </Link>
  )
}
