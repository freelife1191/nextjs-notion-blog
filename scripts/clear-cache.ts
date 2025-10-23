/**
 * 캐시 클리어 스크립트
 * 성능 테스트를 위해 모든 캐시를 초기화합니다
 */

import { contentCache } from '../src/lib/cache';

console.log('🧹 Clearing all caches...');

// 전역 캐시 초기화
if (globalThis.__notionCache) {
  globalThis.__notionCache.clear();
  console.log('✅ Global cache cleared');
}

// contentCache 초기화
contentCache.clear();
console.log('✅ Content cache cleared');

console.log('✨ All caches cleared successfully!');
