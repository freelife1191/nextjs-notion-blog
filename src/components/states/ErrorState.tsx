'use client'

/**
 * 오류 상태 컴포넌트
 * 데이터 로딩 실패나 오류 발생 시 표시되는 UI
 */

import Link from 'next/link'
import { Icon } from '@/lib/icons'
import { getErrorMessage } from '@/lib/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  error?: unknown
  onRetry?: () => void
  showHomeButton?: boolean
}

export function ErrorState({
  title = '오류가 발생했습니다',
  description,
  error,
  onRetry,
  showHomeButton = false,
}: ErrorStateProps) {
  // 브라우저 콘솔에 에러 로깅
  if (typeof window !== 'undefined' && error) {
    console.group('🚨 [ErrorState] Error Details')
    console.error('Error object:', error)
    console.error('Error type:', typeof error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error name:', error.name)
      console.error('Error stack:', error.stack)
    }
    console.groupEnd()
  }

  // error가 제공되면 사용자 친화적인 메시지 사용
  const finalDescription = description || (error ? getErrorMessage(error) : '데이터를 불러오는 중 문제가 발생했습니다.')

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Alert variant="destructive" className="max-w-2xl">
        <Icon
          name="error"
          size={24}
          className="mt-0.5"
        />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {finalDescription}
        </AlertDescription>

        {(onRetry || showHomeButton) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="default"
                aria-label="다시 시도"
              >
                <Icon name="refreshCw" size={16} />
                다시 시도
              </Button>
            )}

            {showHomeButton && (
              <Button
                asChild
                variant="secondary"
                aria-label="홈으로 이동"
              >
                <Link href="/">
                  <Icon name="home" size={16} />
                  홈으로 이동
                </Link>
              </Button>
            )}
          </div>
        )}
      </Alert>
    </div>
  )
}
