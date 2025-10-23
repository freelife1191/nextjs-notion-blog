'use client'

/**
 * 빈 상태 컴포넌트
 * 데이터가 없을 때 표시되는 UI
 */

import { Icon } from '@/lib/icons'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: keyof typeof import('@/lib/icons').icons
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = '콘텐츠가 없습니다',
  description = '아직 게시된 글이 없습니다. 곧 새로운 콘텐츠를 준비하겠습니다.',
  icon = 'file',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <Icon 
          name={icon} 
          size={48} 
          className="text-muted-foreground" 
        />
      </div>
      
      <h3 className="text-heading-3 text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-body text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
