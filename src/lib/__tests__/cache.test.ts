/**
 * Cache System Unit Tests
 *
 * 테스트 범위:
 * - 기본 get/set 작업
 * - TTL 만료 동작
 * - 캐시 삭제 (단일 및 패턴)
 * - 캐시 정리 및 통계
 * - withCache 래퍼 함수
 * - 헬퍼 함수들
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  contentCache,
  withCache,
  createCacheKey,
  invalidateNotionCache,
  getTTL,
  CACHE_KEYS,
} from '../cache'

describe('ContentCache', () => {
  beforeEach(() => {
    // 각 테스트 전에 캐시 초기화
    contentCache.clear()
  })

  afterEach(() => {
    // 타이머 복원
    vi.restoreAllMocks()
  })

  describe('Basic Operations', () => {
    it('should store and retrieve data', () => {
      const key = 'test:key'
      const data = { value: 'test data' }

      contentCache.set(key, data)
      const result = contentCache.get(key)

      expect(result).toEqual(data)
    })

    it('should return null for non-existent key', () => {
      const result = contentCache.get('non-existent-key')
      expect(result).toBeNull()
    })

    it('should overwrite existing data with same key', () => {
      const key = 'test:key'
      const data1 = { value: 'first' }
      const data2 = { value: 'second' }

      contentCache.set(key, data1)
      contentCache.set(key, data2)
      const result = contentCache.get(key)

      expect(result).toEqual(data2)
    })

    it('should handle different data types', () => {
      contentCache.set('string', 'hello')
      contentCache.set('number', 42)
      contentCache.set('boolean', true)
      contentCache.set('array', [1, 2, 3])
      contentCache.set('object', { nested: { value: 'test' } })
      contentCache.set('null', null)

      expect(contentCache.get('string')).toBe('hello')
      expect(contentCache.get('number')).toBe(42)
      expect(contentCache.get('boolean')).toBe(true)
      expect(contentCache.get('array')).toEqual([1, 2, 3])
      expect(contentCache.get('object')).toEqual({ nested: { value: 'test' } })
      expect(contentCache.get('null')).toBeNull()
    })
  })

  describe('TTL Expiration', () => {
    it('should return null after TTL expires', () => {
      vi.useFakeTimers()
      const key = 'test:ttl'
      const data = { value: 'test' }
      const ttl = 1000 // 1초

      contentCache.set(key, data, ttl)

      // TTL 이전에는 데이터 반환
      expect(contentCache.get(key)).toEqual(data)

      // TTL 경과 후에는 null 반환
      vi.advanceTimersByTime(1001)
      expect(contentCache.get(key)).toBeNull()

      vi.useRealTimers()
    })

    it('should use custom TTL when provided', () => {
      vi.useFakeTimers()
      const key = 'test:custom-ttl'
      const data = { value: 'test' }
      const customTTL = 5000 // 5초

      contentCache.set(key, data, customTTL)

      // 3초 후에도 데이터 존재
      vi.advanceTimersByTime(3000)
      expect(contentCache.get(key)).toEqual(data)

      // 6초 후에는 만료
      vi.advanceTimersByTime(3000)
      expect(contentCache.get(key)).toBeNull()

      vi.useRealTimers()
    })

    it('should use default TTL when not specified', () => {
      vi.useFakeTimers()
      const key = 'test:default-ttl'
      const data = { value: 'test' }

      contentCache.set(key, data)

      // 9분 후에도 데이터 존재 (기본 TTL 10분)
      vi.advanceTimersByTime(9 * 60 * 1000)
      expect(contentCache.get(key)).toEqual(data)

      // 11분 후에는 만료
      vi.advanceTimersByTime(2 * 60 * 1000)
      expect(contentCache.get(key)).toBeNull()

      vi.useRealTimers()
    })

    it('should automatically delete expired item on get', () => {
      vi.useFakeTimers()
      const key = 'test:auto-delete'
      const data = { value: 'test' }
      const ttl = 1000

      contentCache.set(key, data, ttl)
      expect(contentCache.getStats().size).toBe(1)

      // TTL 경과 후 get 호출 시 자동 삭제
      vi.advanceTimersByTime(1001)
      contentCache.get(key)
      expect(contentCache.getStats().size).toBe(0)

      vi.useRealTimers()
    })
  })

  describe('Delete Operations', () => {
    it('should delete specific key', () => {
      const key = 'test:delete'
      const data = { value: 'test' }

      contentCache.set(key, data)
      expect(contentCache.get(key)).toEqual(data)

      contentCache.delete(key)
      expect(contentCache.get(key)).toBeNull()
    })

    it('should delete keys matching pattern', () => {
      contentCache.set('notion:post:1', { id: 1 })
      contentCache.set('notion:post:2', { id: 2 })
      contentCache.set('youtube:video:1', { id: 3 })

      contentCache.deletePattern('^notion:post:')

      expect(contentCache.get('notion:post:1')).toBeNull()
      expect(contentCache.get('notion:post:2')).toBeNull()
      expect(contentCache.get('youtube:video:1')).toEqual({ id: 3 })
    })

    it('should clear all cache', () => {
      contentCache.set('key1', { value: 1 })
      contentCache.set('key2', { value: 2 })
      contentCache.set('key3', { value: 3 })

      expect(contentCache.getStats().size).toBe(3)

      contentCache.clear()

      expect(contentCache.getStats().size).toBe(0)
      expect(contentCache.get('key1')).toBeNull()
      expect(contentCache.get('key2')).toBeNull()
      expect(contentCache.get('key3')).toBeNull()
    })
  })

  describe('Cleanup and Stats', () => {
    it('should cleanup expired items', () => {
      vi.useFakeTimers()

      contentCache.set('key1', { value: 1 }, 1000)
      contentCache.set('key2', { value: 2 }, 5000)
      contentCache.set('key3', { value: 3 }, 10000)

      expect(contentCache.getStats().size).toBe(3)

      // 2초 후 정리 - key1만 만료
      vi.advanceTimersByTime(2000)
      contentCache.cleanup()

      expect(contentCache.getStats().size).toBe(2)
      expect(contentCache.get('key1')).toBeNull()
      expect(contentCache.get('key2')).not.toBeNull()
      expect(contentCache.get('key3')).not.toBeNull()

      // 6초 후 정리 - key1, key2 만료
      vi.advanceTimersByTime(4000)
      contentCache.cleanup()

      expect(contentCache.getStats().size).toBe(1)
      expect(contentCache.get('key2')).toBeNull()
      expect(contentCache.get('key3')).not.toBeNull()

      vi.useRealTimers()
    })

    it('should return accurate stats', () => {
      const stats1 = contentCache.getStats()
      expect(stats1.size).toBe(0)
      expect(stats1.keys).toEqual([])

      contentCache.set('key1', { value: 1 })
      contentCache.set('key2', { value: 2 })

      const stats2 = contentCache.getStats()
      expect(stats2.size).toBe(2)
      expect(stats2.keys).toContain('key1')
      expect(stats2.keys).toContain('key2')
    })
  })

  describe('withCache Wrapper', () => {
    it('should cache function results', async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: 'test' })
      const key = 'test:withCache'

      const result1 = await withCache(key, fetcher)
      const result2 = await withCache(key, fetcher)

      expect(result1).toEqual({ data: 'test' })
      expect(result2).toEqual({ data: 'test' })
      expect(fetcher).toHaveBeenCalledTimes(1) // 캐시 히트로 1번만 호출
    })

    it('should call fetcher again after TTL expires', async () => {
      vi.useFakeTimers()
      const fetcher = vi.fn()
        .mockResolvedValueOnce({ data: 'first' })
        .mockResolvedValueOnce({ data: 'second' })
      const key = 'test:withCache-ttl'
      const ttl = 1000

      const result1 = await withCache(key, fetcher, ttl)
      expect(result1).toEqual({ data: 'first' })
      expect(fetcher).toHaveBeenCalledTimes(1)

      // TTL 경과 전 - 캐시 히트
      vi.advanceTimersByTime(500)
      const result2 = await withCache(key, fetcher, ttl)
      expect(result2).toEqual({ data: 'first' })
      expect(fetcher).toHaveBeenCalledTimes(1)

      // TTL 경과 후 - fetcher 재호출
      vi.advanceTimersByTime(600)
      const result3 = await withCache(key, fetcher, ttl)
      expect(result3).toEqual({ data: 'second' })
      expect(fetcher).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })

    it('should handle fetcher errors', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('Fetch failed'))
      const key = 'test:withCache-error'

      await expect(withCache(key, fetcher)).rejects.toThrow('Fetch failed')
    })
  })

  describe('Helper Functions', () => {
    it('createCacheKey should format keys correctly', () => {
      expect(createCacheKey('posts')).toBe('posts:')
      expect(createCacheKey('posts', 'list')).toBe('posts:list')
      expect(createCacheKey('post', 'slug', 123)).toBe('post:slug:123')
      expect(createCacheKey('blocks', 'abc', 'def', 456)).toBe('blocks:abc:def:456')
    })

    it('getTTL should return different values based on NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV

      // Development 환경
      vi.stubEnv('NODE_ENV', 'development')
      expect(getTTL(10 * 60 * 1000)).toBe(1 * 60 * 1000) // 1분

      // Production 환경
      vi.stubEnv('NODE_ENV', 'production')
      expect(getTTL(10 * 60 * 1000)).toBe(10 * 60 * 1000) // 기본 TTL

      // Test 환경
      vi.stubEnv('NODE_ENV', 'test')
      expect(getTTL(10 * 60 * 1000)).toBe(10 * 60 * 1000) // 기본 TTL

      vi.stubEnv('NODE_ENV', originalEnv)
    })

    it('invalidateNotionCache should delete specific slug', () => {
      const slug = 'test-post'
      contentCache.set(CACHE_KEYS.POST_BY_SLUG(slug), { data: 'test' })
      contentCache.set(CACHE_KEYS.POSTS_LIST, { data: 'list' })

      invalidateNotionCache(slug)

      expect(contentCache.get(CACHE_KEYS.POST_BY_SLUG(slug))).toBeNull()
      expect(contentCache.get(CACHE_KEYS.POSTS_LIST)).not.toBeNull()
    })

    it('invalidateNotionCache should delete all notion cache when no slug provided', () => {
      contentCache.set('notion:post:1', { id: 1 })
      contentCache.set('notion:post:2', { id: 2 })
      contentCache.set('notion:settings', { data: 'settings' })
      contentCache.set('youtube:video:1', { id: 3 })

      invalidateNotionCache()

      expect(contentCache.get('notion:post:1')).toBeNull()
      expect(contentCache.get('notion:post:2')).toBeNull()
      expect(contentCache.get('notion:settings')).toBeNull()
      expect(contentCache.get('youtube:video:1')).not.toBeNull()
    })
  })

  describe('CACHE_KEYS Constants', () => {
    it('should generate correct cache keys', () => {
      expect(CACHE_KEYS.POSTS_LIST).toBe('notion:posts:list')
      expect(CACHE_KEYS.POST_BY_SLUG('my-post')).toBe('notion:post:my-post')
      expect(CACHE_KEYS.POST_BLOCKS('abc123')).toBe('notion:blocks:abc123')
      expect(CACHE_KEYS.POST_RENDERED('my-post')).toBe('notion:rendered:my-post')
      expect(CACHE_KEYS.YOUTUBE_INFO('https://youtube.com/watch?v=123')).toBe('youtube:info:https://youtube.com/watch?v=123')
      expect(CACHE_KEYS.SITE_SETTINGS).toBe('notion:site:settings')
    })
  })

  describe('Singleton Pattern', () => {
    it('should maintain singleton instance', () => {
      contentCache.set('singleton-test', { value: 'test' })

      // 동일한 인스턴스 확인
      const stats = contentCache.getStats()
      expect(stats.size).toBe(1)
      expect(stats.keys).toContain('singleton-test')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string keys', () => {
      contentCache.set('', { value: 'empty key' })
      expect(contentCache.get('')).toEqual({ value: 'empty key' })
    })

    it('should handle very large data', () => {
      const largeData = {
        items: Array.from({ length: 10000 }, (_, i) => ({
          id: i,
          value: `item-${i}`,
          nested: { deep: { value: Math.random() } }
        }))
      }

      contentCache.set('large-data', largeData)
      const result = contentCache.get('large-data')

      expect(result).toEqual(largeData)
      expect((result as typeof largeData).items).toHaveLength(10000)
    })

    it('should handle unicode characters in keys', () => {
      contentCache.set('한글:키', { value: 'korean' })
      contentCache.set('emoji:🚀', { value: 'rocket' })

      expect(contentCache.get('한글:키')).toEqual({ value: 'korean' })
      expect(contentCache.get('emoji:🚀')).toEqual({ value: 'rocket' })
    })

    it('should handle concurrent set operations', () => {
      const key = 'concurrent-key'

      contentCache.set(key, { value: 1 })
      contentCache.set(key, { value: 2 })
      contentCache.set(key, { value: 3 })

      // 마지막 set이 적용되어야 함
      expect(contentCache.get(key)).toEqual({ value: 3 })
    })
  })
})
