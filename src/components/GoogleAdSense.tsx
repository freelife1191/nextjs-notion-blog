/**
 * Google AdSense 컴포넌트
 *
 * Notion Settings 데이터베이스에서 설정된 AdSense Publisher ID를 사용하여
 * Google AdSense 스크립트를 로드합니다.
 *
 * 특징:
 * - 개발 환경에서는 비활성화 (로컬 개발 시 광고 미표시)
 * - 프로덕션 환경에서만 활성화
 * - Auto Ads 지원 (Google이 자동으로 최적 위치에 광고 배치)
 * - Next.js Script 컴포넌트의 afterInteractive 전략 사용
 */

'use client'

import Script from 'next/script'
import { logger } from '@/lib/logger'

interface GoogleAdSenseProps {
  publisherId: string
  autoAds?: boolean
}

export function GoogleAdSense({ publisherId, autoAds = true }: GoogleAdSenseProps) {
  // 개발 환경에서는 AdSense를 로드하지 않음
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    logger.log('[GoogleAdSense] Skipped in development environment')
    return null
  }

  return (
    <>
      {/* Google AdSense 스크립트 로드 */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Auto Ads 활성화 (선택 사항) */}
      {autoAds && (
        <Script id="google-adsense-auto-ads" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({});
          `}
        </Script>
      )}
    </>
  )
}
