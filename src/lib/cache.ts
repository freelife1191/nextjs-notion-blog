/**
 * 콘텐츠 캐싱 시스템
 * Notion API 호출을 최적화하고 성능을 향상시키기 위한 캐싱 메커니즘
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class ContentCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 10 * 60 * 1000 // 10분

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  /**
   * 캐시에서 특정 키 삭제
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 특정 패턴과 일치하는 모든 캐시 삭제
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 만료된 캐시 항목들 정리
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 캐시 통계 정보
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// 싱글톤 인스턴스 (globalThis에 저장하여 모든 요청에서 공유)
// 개발 모드와 프로덕션 모드 모두에서 캐시를 공유하여 성능 향상
const globalForCache = globalThis as unknown as {
  contentCache: ContentCache | undefined
}

if (!globalForCache.contentCache) {
  globalForCache.contentCache = new ContentCache()
}

export const contentCache = globalForCache.contentCache

/**
 * 환경별 TTL 설정
 */
export function getTTL(baseTTL: number): number {
  if (process.env.NODE_ENV === 'development') {
    return 1 * 60 * 1000; // 개발 환경에서는 1분
  }
  return baseTTL; // 프로덕션 환경에서는 기본 TTL 사용
}

/**
 * 캐시 키 생성 헬퍼
 */
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

/**
 * 진행 중인 요청 추적 (중복 API 호출 방지)
 */
const inflightRequests = new Map<string, Promise<unknown>>();

/**
 * Notion API 호출을 위한 캐시 래퍼
 * 동시 요청 중복 방지 기능 포함
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const finalTTL = ttl ? getTTL(ttl) : getTTL(10 * 60 * 1000); // 기본 10분 TTL

  // 캐시에서 먼저 확인
  const cached = contentCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // 이미 진행 중인 요청이 있는지 확인
  const existingRequest = inflightRequests.get(key);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  // 새 요청 시작
  const requestPromise = (async () => {
    try {
      const data = await fetcher();

      // 결과를 캐시에 저장
      contentCache.set(key, data, finalTTL);

      return data;
    } finally {
      // 요청 완료 후 진행 중 목록에서 제거
      inflightRequests.delete(key);
    }
  })();

  // 진행 중 목록에 추가
  inflightRequests.set(key, requestPromise);

  return requestPromise;
}

/**
 * Notion 관련 캐시 키 상수
 */
export const CACHE_KEYS = {
  POSTS_LIST: 'notion:posts:list',
  POST_BY_SLUG: (slug: string) => `notion:post:${slug}`,
  POST_BLOCKS: (postId: string) => `notion:blocks:${postId}`,
  POST_RENDERED: (slug: string) => `notion:rendered:${slug}`,
  YOUTUBE_INFO: (url: string) => `youtube:info:${url}`,
  SITE_SETTINGS: 'notion:site:settings',
  SITE_CONFIG: 'notion:site:config',
  ABOUT_PAGE: 'notion:about:page',
  ABOUT_PAGE_RENDERED: 'notion:about:rendered',
  DATABASE_SCHEMA: (databaseId: string) => `notion:db:schema:${databaseId}`,
  DATABASE_QUERY: (databaseId: string, pageSize: number) => `notion:db:query:${databaseId}:${pageSize}`,
} as const

/**
 * Notion 콘텐츠 캐시 무효화
 */
export function invalidateNotionCache(slug?: string) {
  if (slug) {
    // 특정 포스트 캐시 무효화
    contentCache.delete(CACHE_KEYS.POST_BY_SLUG(slug))
  } else {
    // 모든 Notion 관련 캐시 무효화
    contentCache.deletePattern('^notion:')
  }
}

// 주기적으로 만료된 캐시 정리 (5분마다)
if (typeof window === 'undefined') {
  setInterval(() => {
    contentCache.cleanup()
  }, 5 * 60 * 1000)
}
