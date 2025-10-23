/**
 * Next.js Instrumentation
 * 서버 시작 시 및 주기적으로 실행되는 백그라운드 작업
 */

import { getSiteSettingsMemo, listPublishedPostsMemo } from './lib/request-memo'
import { logger } from './lib/logger'

let warmupInterval: NodeJS.Timeout | null = null

/**
 * 캐시 워밍: 자주 사용되는 데이터를 미리 캐싱
 */
async function warmupCache() {
  logger.log('🔥 [Cache Warmup] Starting cache warmup...')

  try {
    // 병렬로 자주 사용되는 데이터 가져오기
    const startTime = Date.now()
    await Promise.all([
      getSiteSettingsMemo(),
      listPublishedPostsMemo(),
    ])

    const duration = Date.now() - startTime
    logger.log(`✅ [Cache Warmup] Completed in ${duration}ms`)
  } catch (error) {
    logger.error('❌ [Cache Warmup] Failed:', error)
  }
}

/**
 * 서버 시작 시 실행
 */
export async function register() {
  // 서버 환경에서만 실행 (브라우저에서는 실행 안됨)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 1. 서버 시작 시 즉시 캐시 워밍
    await warmupCache()

    // 2. 개발 모드에서만 주기적 캐시 워밍 (8분마다)
    // 프로덕션은 정적 빌드이므로 불필요
    if (process.env.NODE_ENV === 'development' && !warmupInterval) {
      warmupInterval = setInterval(() => {
        warmupCache()
      }, 8 * 60 * 1000) // 8분마다 (TTL 10분보다 짧게)

      logger.log('🔄 [Cache Warmup] Background refresh enabled (every 8 minutes)')
    }
  }
}
