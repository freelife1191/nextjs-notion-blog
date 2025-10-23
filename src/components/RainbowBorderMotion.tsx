/**
 * 무지개 테두리 애니메이션 컴포넌트
 *
 * ArticleListItem에서 중복 사용되던 무지개 테두리 애니메이션을 재사용 가능한 컴포넌트로 추출
 */

'use client'

import { motion } from 'framer-motion'
import { ANIMATION_DURATION } from '@/lib/motion'

interface RainbowBorderMotionProps {
  /** 호버 상태 */
  isHovered: boolean
  /** 테두리 둥글기 (기본값: 'md') */
  borderRadius?: 'sm' | 'md' | 'lg' | 'full'
  /** 애니메이션 지속 시간 (기본값: RAINBOW_BORDER 상수) */
  duration?: number
}

/**
 * 무지개 테두리 애니메이션 컴포넌트
 *
 * @example
 * ```tsx
 * <motion.span className="relative px-4 py-2">
 *   <span className="relative z-10">Label</span>
 *   <RainbowBorderMotion isHovered={isHovered} borderRadius="md" />
 * </motion.span>
 * ```
 */
export function RainbowBorderMotion({
  isHovered,
  borderRadius = 'md',
  duration = ANIMATION_DURATION.RAINBOW_BORDER,
}: RainbowBorderMotionProps) {
  const borderRadiusClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[borderRadius]

  return (
    <motion.span
      className={`absolute inset-0 ${borderRadiusClass} pointer-events-none`}
      style={{
        background:
          'conic-gradient(from 0deg at 50% 50%, #ff0000 0deg, #ff7f00 51deg, #ffff00 102deg, #00ff00 153deg, #0000ff 204deg, #4b0082 255deg, #9400d3 306deg, #ff0000 360deg)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: '1.5px',
      }}
      animate={
        isHovered
          ? {
              opacity: [0.6, 1, 0.6],
              transition: {
                opacity: { duration, repeat: Infinity, ease: 'easeInOut' },
              },
            }
          : {
              opacity: 0,
              transition: {
                opacity: { duration: 0.2 },
              },
            }
      }
    />
  )
}
