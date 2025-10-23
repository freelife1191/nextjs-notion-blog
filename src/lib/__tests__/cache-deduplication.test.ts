/**
 * 캐시 중복 요청 방지 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { withCache, contentCache } from '../cache';

describe('Cache Deduplication', () => {
  beforeEach(() => {
    contentCache.clear();
  });

  it('should prevent duplicate API calls for concurrent requests', async () => {
    let callCount = 0;

    const slowFetcher = async () => {
      callCount++;
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms 지연
      return { data: 'result', timestamp: Date.now() };
    };

    // 동시에 같은 키로 3번 요청
    const [result1, result2, result3] = await Promise.all([
      withCache('test-key', slowFetcher),
      withCache('test-key', slowFetcher),
      withCache('test-key', slowFetcher),
    ]);

    // API는 1번만 호출되어야 함
    expect(callCount).toBe(1);

    // 모든 결과가 동일해야 함
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);

    // timestamp가 같아야 함 (같은 결과를 공유)
    expect(result1.timestamp).toBe(result2.timestamp);
    expect(result2.timestamp).toBe(result3.timestamp);
  });

  it('should use cache for subsequent requests after first request completes', async () => {
    let callCount = 0;

    const fetcher = async () => {
      callCount++;
      return 'data';
    };

    // 첫 번째 요청
    await withCache('test-key-2', fetcher);
    expect(callCount).toBe(1);

    // 두 번째 요청 (캐시에서 가져와야 함)
    await withCache('test-key-2', fetcher);
    expect(callCount).toBe(1); // 여전히 1번만 호출

    // 세 번째 요청 (캐시에서 가져와야 함)
    await withCache('test-key-2', fetcher);
    expect(callCount).toBe(1); // 여전히 1번만 호출
  });

  it('should handle errors in concurrent requests', async () => {
    let callCount = 0;

    const failingFetcher = async () => {
      callCount++;
      await new Promise(resolve => setTimeout(resolve, 50));
      throw new Error('API Error');
    };

    // 동시에 같은 키로 3번 요청
    const promises = [
      withCache('error-key', failingFetcher),
      withCache('error-key', failingFetcher),
      withCache('error-key', failingFetcher),
    ];

    // 모두 실패해야 함
    await expect(Promise.all(promises)).rejects.toThrow('API Error');

    // API는 1번만 호출되어야 함
    expect(callCount).toBe(1);
  });

  it('should allow new requests after error', async () => {
    let callCount = 0;

    const sometimesFails = async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error('First call fails');
      }
      return 'success';
    };

    // 첫 번째 요청 실패
    await expect(withCache('retry-key', sometimesFails)).rejects.toThrow();
    expect(callCount).toBe(1);

    // 두 번째 요청 성공해야 함
    const result = await withCache('retry-key', sometimesFails);
    expect(result).toBe('success');
    expect(callCount).toBe(2);
  });
});
