/**
 * Google Analytics 4 (GA4) 컴포넌트
 *
 * Notion Settings 데이터베이스에서 설정된 GA4 Measurement ID를 사용하여
 * Google Analytics 추적 스크립트를 로드합니다.
 *
 * 특징:
 * - 개발 환경에서는 비활성화 (로컬 개발 시 추적 방지)
 * - 프로덕션 환경에서만 활성화
 * - Next.js Script 컴포넌트의 afterInteractive 전략 사용 (페이지 상호작용 이후 로드)
 */

'use client'

import Script from 'next/script'
import { logger } from '@/lib/logger'

interface GoogleAnalyticsProps {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // 개발 환경에서는 GA를 로드하지 않음
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    logger.log('[GoogleAnalytics] Skipped in development environment')
    return null
  }

  return (
    <>
      {/* Google Analytics gtag.js 스크립트 로드 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      {/* Google Analytics 초기화 스크립트 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
