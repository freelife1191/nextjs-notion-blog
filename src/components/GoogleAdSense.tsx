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
 * - Next.js Script 컴포넌트 사용하여 <head>에 스크립트 삽입 (Static Export 지원)
 */

import Script from 'next/script'

interface GoogleAdSenseProps {
  publisherId: string
  autoAds?: boolean
}

export function GoogleAdSense({ publisherId, autoAds = true }: GoogleAdSenseProps) {
  // 개발 환경에서는 AdSense를 로드하지 않음
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    return null
  }

  // Static export를 위해 beforeInteractive 사용
  // afterInteractive는 static export에서 script 태그가 HTML에 포함되지 않음
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  )
}
