/**
 * 마크다운 렌더링 컴포넌트
 * react-markdown을 사용하여 클라이언트 사이드에서 마크다운을 렌더링합니다
 */

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  children: string
  className?: string
  inline?: boolean
}

/**
 * 마크다운 텍스트를 렌더링하는 컴포넌트
 * @param children - 렌더링할 마크다운 텍스트
 * @param className - 추가 CSS 클래스
 * @param inline - 인라인 모드 (p 태그 없이 렌더링)
 */
export function Markdown({ children, className, inline = false }: MarkdownProps) {
  return (
    <div className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 링크는 새 창에서 열기
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            />
          ),
          // 인라인 모드일 때 p 태그를 span으로 대체
          p: ({ node, ...props }) =>
            inline ? <span {...props} /> : <p {...props} />,
          // 리스트 스타일
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1" {...props} />
          ),
          // 리스트 아이템
          li: ({ node, ...props }) => <li className="text-inherit" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
