/**
 * 포스트 메타 정보 컴포넌트
 * 작성자, 발행일, 읽기 시간 등 메타데이터 표시
 */

'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@/lib/icons'
import { fadeVariants, useInViewAnimation } from '@/lib/motion'

interface PostMetaProps {
  author: string
  publishedAt: string
  readTime?: number
  className?: string
}

export const PostMeta = memo(function PostMeta({
  author,
  publishedAt,
  readTime,
  className = ''
}: PostMetaProps) {
  // 날짜 포맷팅 - useMemo로 캐싱
  const formattedDate = useMemo(() => {
    return new Date(publishedAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [publishedAt])

  return (
    <motion.div
      className={`flex items-center space-x-6 text-body-small text-muted-foreground mb-8 ${className}`}
      variants={fadeVariants}
      {...useInViewAnimation}
    >
      {/* 작성자 */}
      <div className="flex items-center space-x-2">
        <Icon name="user" size={16} />
        <span>{author}</span>
      </div>

      {/* 발행일 */}
      <div className="flex items-center space-x-2">
        <Icon name="calendar" size={16} />
        <time dateTime={publishedAt}>
          {formattedDate}
        </time>
      </div>

      {/* 읽기 시간 */}
      {readTime && (
        <div className="flex items-center space-x-2">
          <Icon name="clock" size={16} />
          <span>{readTime}분 읽기</span>
        </div>
      )}
    </motion.div>
  )
})
