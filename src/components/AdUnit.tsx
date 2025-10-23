/**
 * Google AdSense 광고 유닛 컴포넌트
 *
 * 포스트 본문에 삽입되는 개별 광고 단위
 * 개발 환경에서는 플레이스홀더를 표시하고, 프로덕션에서는 실제 광고를 표시합니다.
 */

'use client'

import { useEffect, useRef } from 'react'
import { logger } from '@/lib/logger';

interface AdUnitProps {
  /**
   * 광고 슬롯 ID (AdSense에서 발급)
   * 설정하지 않으면 Auto Ads 사용
   */
  adSlot?: string

  /**
   * 광고 형식
   * - 'auto': 자동 크기 조정
   * - 'rectangle': 사각형 (300x250)
   * - 'horizontal': 가로형 (728x90)
   * - 'vertical': 세로형 (160x600)
   */
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'

  /**
   * 반응형 광고 활성화
   */
  fullWidthResponsive?: boolean

  /**
   * 광고 라벨 (예: "광고", "Advertisement")
   */
  label?: string

  /**
   * 광고 클라이언트 ID (Publisher ID)
   */
  publisherId?: string
}

export function AdUnit({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  label = '광고',
  publisherId,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDevelopment && adRef.current && publisherId) {
      try {
        // @ts-expect-error - adsbygoogle는 Google AdSense 스크립트에서 제공
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        logger.error('AdSense error:', error)
      }
    }
  }, [isDevelopment, publisherId])

  // 개발 환경에서는 플레이스홀더 표시
  if (isDevelopment) {
    return (
      <div className="not-prose my-8">
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/20">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-xs text-muted-foreground/60">
            Google AdSense 광고 영역 (프로덕션에서만 표시됨)
          </p>
          {adSlot && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              Slot: {adSlot}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Publisher ID가 없으면 광고를 표시하지 않음
  if (!publisherId) {
    return null
  }

  return (
    <div className="not-prose my-8">
      {/* 광고 라벨 */}
      <div className="text-center mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Google AdSense 광고 */}
      <div className="flex justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={publisherId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>
    </div>
  )
}
