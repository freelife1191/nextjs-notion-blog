/**
 * 에러 바운더리 컴포넌트
 * Next.js App Router에서 사용하는 에러 핸들링 컴포넌트
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { getErrorMessage, logError } from '@/lib/errors'
import { Icon } from '@/lib/icons'

export interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // 에러 로깅
    logError(error, 'ErrorBoundary')
  }, [error])

  const userMessage = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 에러 아이콘 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Icon
              name="error"
              size={48}
              className="text-red-600 dark:text-red-500"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            문제가 발생했습니다
          </h1>
          <p className="text-muted-foreground">
            {userMessage}
          </p>
        </div>

        {/* 에러 상세 정보 (개발 모드) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
              개발자 정보 보기
            </summary>
            <div className="text-xs font-mono text-muted-foreground space-y-2">
              <div>
                <strong>Error:</strong> {error.message}
              </div>
              {error.digest && (
                <div>
                  <strong>Digest:</strong> {error.digest}
                </div>
              )}
              {error.stack && (
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Icon name="refreshCw" size={20} className="mr-2" />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            <Icon name="home" size={20} className="mr-2" />
            홈으로 이동
          </Link>
        </div>

        {/* 추가 도움말 */}
        <p className="text-sm text-muted-foreground">
          문제가 계속되면{' '}
          <a
            href="mailto:support@example.com"
            className="text-primary hover:underline"
          >
            문의하기
          </a>
        </p>
      </div>
    </div>
  )
}
