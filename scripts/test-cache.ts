/**
 * 캐시 테스트 스크립트
 */

import { contentCache, withCache } from '../src/lib/cache'

async function main() {
  console.log('=== 캐시 테스트 시작 ===\n')

  // 1. 캐시 초기 상태
  console.log('1. 초기 캐시 상태:', contentCache.getStats())

  // 2. 데이터 저장
  console.log('\n2. 데이터 저장 테스트')
  contentCache.set('test:key1', { data: 'value1' }, 60000)
  console.log('   저장 후 캐시 상태:', contentCache.getStats())

  // 3. 데이터 조회
  console.log('\n3. 데이터 조회 테스트')
  const result = contentCache.get('test:key1')
  console.log('   조회 결과:', result)

  // 4. withCache 테스트
  console.log('\n4. withCache 함수 테스트')

  let callCount = 0
  const testFetcher = async () => {
    callCount++
    console.log(`   fetcher 호출됨 (${callCount}번째)`)
    return { data: 'fetched data', timestamp: Date.now() }
  }

  // 첫 번째 호출 (캐시 미스)
  console.log('\n   첫 번째 withCache 호출:')
  const data1 = await withCache('test:withCache', testFetcher, 60000)
  console.log('   결과:', data1)

  // 두 번째 호출 (캐시 히트)
  console.log('\n   두 번째 withCache 호출:')
  const data2 = await withCache('test:withCache', testFetcher, 60000)
  console.log('   결과:', data2)

  console.log('\n   fetcher 총 호출 횟수:', callCount, '(예상: 1)')

  // 5. 최종 캐시 상태
  console.log('\n5. 최종 캐시 상태:', contentCache.getStats())

  console.log('\n=== 캐시 테스트 완료 ===')
}

main().catch(console.error)
