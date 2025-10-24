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
 * - useEffect를 사용하여 클라이언트 사이드에서만 스크립트 로드 (data-nscript 충돌 방지)
 */

'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

interface GoogleAdSenseProps {
  publisherId: string
  autoAds?: boolean
}

export function GoogleAdSense({ publisherId, autoAds = true }: GoogleAdSenseProps) {
  useEffect(() => {
    // 개발 환경에서는 AdSense를 로드하지 않음
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment) {
      logger.log('[GoogleAdSense] Skipped in development environment')
      return
    }

    // 이미 스크립트가 로드되었는지 확인
    const existingScript = document.querySelector(
      `script[src*="adsbygoogle.js?client=${publisherId}"]`
    )

    if (existingScript) {
      logger.log('[GoogleAdSense] Script already loaded')
      return
    }

    // AdSense 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      logger.log('[GoogleAdSense] Script loaded successfully')

      // Auto Ads 활성화
      if (autoAds) {
        try {
          // @ts-ignore
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          logger.log('[GoogleAdSense] Auto ads initialized')
        } catch (error) {
          logger.error('[GoogleAdSense] Failed to initialize auto ads:', error)
        }
      }
    }

    script.onerror = () => {
      logger.error('[GoogleAdSense] Failed to load script')
    }

    document.head.appendChild(script)

    // Cleanup
    return () => {
      // 스크립트는 제거하지 않음 (페이지 전환 시에도 유지)
    }
  }, [publisherId, autoAds])

  return null
}
