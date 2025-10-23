import { test, expect, type Page } from '@playwright/test';

/**
 * 디테일한 퍼포먼스 테스트
 * - 페이지 로드 시간
 * - 네비게이션 속도
 * - 캐시 효과
 * - Notion API 호출 분석
 */

interface PerformanceMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
}

/**
 * Performance timing 수집
 */
async function getPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    const timing = performance.timing;
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint').pop() as any;

    // TTI 추정 (간단한 방법: load 이후 네트워크가 조용해지는 시점)
    const tti = timing.loadEventEnd || timing.domContentLoadedEventEnd;

    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: lcpEntry?.renderTime || lcpEntry?.loadTime || 0,
      timeToInteractive: tti - timing.navigationStart,
    };
  });
}

/**
 * 네트워크 요청 분석
 */
function trackNetworkRequests(page: Page) {
  const requests: Array<{ url: string; method: string; duration: number; status: number }> = [];

  page.on('requestfinished', async (request) => {
    const url = request.url();
    const method = request.method();
    const response = await request.response();
    const timing = request.timing();

    requests.push({
      url,
      method,
      duration: timing.responseEnd,
      status: response?.status() || 0,
    });
  });

  return requests;
}

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 캐시 초기화
    await page.context().clearCookies();
  });

  test('홈페이지 로드 성능 측정', async ({ page }) => {
    console.log('\n=== 홈페이지 로드 성능 테스트 ===');

    const requests = trackNetworkRequests(page);
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    const metrics = await getPerformanceMetrics(page);

    // Notion API 요청 분석
    const notionRequests = requests.filter(r => r.url.includes('notion.com'));

    console.log('📊 성능 메트릭:');
    console.log(`  - DOMContentLoaded: ${metrics.domContentLoaded}ms`);
    console.log(`  - Load Complete: ${metrics.loadComplete}ms`);
    console.log(`  - First Paint: ${metrics.firstPaint}ms`);
    console.log(`  - First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`  - Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
    console.log(`  - Time to Interactive: ${metrics.timeToInteractive}ms`);
    console.log(`  - Total Load Time: ${loadTime}ms`);
    console.log(`\n🌐 네트워크 요청:`);
    console.log(`  - Total Requests: ${requests.length}`);
    console.log(`  - Notion API Calls: ${notionRequests.length}`);
    notionRequests.forEach(req => {
      console.log(`    - ${req.method} ${req.url.split('?')[0]} (${req.duration}ms)`);
    });

    // 성능 기준 검증
    expect(metrics.largestContentfulPaint).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.firstContentfulPaint).toBeLessThan(1800); // FCP < 1.8s
    expect(loadTime).toBeLessThan(5000); // Total load < 5s
  });

  test('페이지 네비게이션 성능 (1→2→1)', async ({ page }) => {
    console.log('\n=== 페이지 네비게이션 성능 테스트 ===');

    // 첫 페이지 로드
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const requests1 = trackNetworkRequests(page);
    const start1 = Date.now();

    // Page 2로 이동
    await page.click('a[href="/?page=2"]');
    await page.waitForLoadState('networkidle');

    const nav1Time = Date.now() - start1;
    const notionRequests1 = requests1.filter(r => r.url.includes('notion.com'));

    console.log(`\n📄 Page 1 → Page 2:`);
    console.log(`  - Navigation Time: ${nav1Time}ms`);
    console.log(`  - Notion API Calls: ${notionRequests1.length}`);

    const requests2 = trackNetworkRequests(page);
    const start2 = Date.now();

    // Page 1로 돌아가기
    await page.click('a[href="/?page=1"]');
    await page.waitForLoadState('networkidle');

    const nav2Time = Date.now() - start2;
    const notionRequests2 = requests2.filter(r => r.url.includes('notion.com'));

    console.log(`\n📄 Page 2 → Page 1:`);
    console.log(`  - Navigation Time: ${nav2Time}ms`);
    console.log(`  - Notion API Calls: ${notionRequests2.length}`);

    // 캐시 효과 검증: 두 번째 네비게이션은 더 빨라야 함
    console.log(`\n✅ 캐시 효과: ${notionRequests2.length === 0 ? '작동 (' + notionRequests2.length + ' API calls)' : '미작동 (' + notionRequests2.length + ' API calls)'}`);

    // 성능 기준
    expect(nav1Time).toBeLessThan(3000); // 첫 네비게이션 < 3s
    expect(nav2Time).toBeLessThan(1000); // 캐시된 네비게이션 < 1s
    expect(notionRequests2.length).toBe(0); // 캐시로 인한 API 호출 없음
  });

  test('포스트 클릭 및 재방문 성능', async ({ page }) => {
    console.log('\n=== 포스트 클릭 성능 테스트 ===');

    // 홈페이지 로드
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 첫 번째 포스트 링크 가져오기 (더 구체적인 셀렉터 사용)
    const firstPostLink = page.locator('article').first().locator('a[href^="/posts/"]').first();
    const postHref = await firstPostLink.getAttribute('href');

    // 첫 번째 포스트 클릭
    const requests1 = trackNetworkRequests(page);
    const start1 = Date.now();

    await firstPostLink.click();
    await page.waitForLoadState('networkidle');

    const clickTime1 = Date.now() - start1;
    const notionRequests1 = requests1.filter(r => r.url.includes('notion.com'));

    console.log(`\n📝 첫 번째 포스트 클릭:`);
    console.log(`  - Load Time: ${clickTime1}ms`);
    console.log(`  - Notion API Calls: ${notionRequests1.length}`);
    notionRequests1.forEach(req => {
      console.log(`    - ${req.method} ${req.url.includes('query') ? 'query' : req.url.includes('blocks') ? 'blocks' : 'other'} (${req.duration}ms)`);
    });

    // 뒤로가기
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // 같은 포스트 재클릭 (캐시 테스트)
    const requests2 = trackNetworkRequests(page);
    const start2 = Date.now();

    // 더 안정적인 셀렉터 사용
    await page.locator(`a[href="${postHref}"]`).first().click();
    await page.waitForLoadState('networkidle');

    const clickTime2 = Date.now() - start2;
    const notionRequests2 = requests2.filter(r => r.url.includes('notion.com'));

    console.log(`\n📝 같은 포스트 재클릭 (캐시 테스트):`);
    console.log(`  - Load Time: ${clickTime2}ms`);
    console.log(`  - Notion API Calls: ${notionRequests2.length}`);
    console.log(`  - 개선율: ${Math.round((1 - clickTime2/clickTime1) * 100)}%`);

    console.log(`\n✅ 캐시 효과: ${notionRequests2.length === 0 ? '완벽 (' + notionRequests2.length + ' API calls)' : '부분적 (' + notionRequests2.length + ' API calls)'}`);

    // 성능 기준
    expect(clickTime1).toBeLessThan(5000); // 첫 클릭 < 5s
    expect(clickTime2).toBeLessThan(clickTime1 * 0.5); // 재방문은 50% 이상 빨라야 함
    expect(notionRequests2.length).toBe(0); // 캐시로 인한 API 호출 없음
  });

  test('About 페이지 로드 성능', async ({ page }) => {
    console.log('\n=== About 페이지 성능 테스트 ===');

    const requests = trackNetworkRequests(page);
    const startTime = Date.now();

    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    const notionRequests = requests.filter(r => r.url.includes('notion.com'));

    console.log(`\n📄 About 페이지:`);
    console.log(`  - Load Time: ${loadTime}ms`);
    console.log(`  - Notion API Calls: ${notionRequests.length}`);

    // About 페이지는 정적이므로 매우 빨라야 함
    expect(loadTime).toBeLessThan(2000); // < 2s
    expect(notionRequests.length).toBeLessThan(3); // 최소한의 API 호출
  });

  test('전체 사용자 플로우 성능', async ({ page }) => {
    console.log('\n=== 전체 사용자 플로우 성능 테스트 ===');

    const flow: Array<{ action: string; time: number; apiCalls: number }> = [];

    // 1. 홈페이지 방문
    let start = Date.now();
    let requests = trackNetworkRequests(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    flow.push({
      action: 'Homepage Load',
      time: Date.now() - start,
      apiCalls: requests.filter(r => r.url.includes('notion.com')).length
    });

    // 2. 페이지 2로 이동
    start = Date.now();
    requests = trackNetworkRequests(page);
    await page.click('a[href="/?page=2"]');
    await page.waitForLoadState('networkidle');
    flow.push({
      action: 'Navigate to Page 2',
      time: Date.now() - start,
      apiCalls: requests.filter(r => r.url.includes('notion.com')).length
    });

    // 3. 포스트 클릭
    start = Date.now();
    requests = trackNetworkRequests(page);
    await page.locator('article').first().locator('a[href^="/posts/"]').first().click();
    await page.waitForLoadState('networkidle');
    flow.push({
      action: 'Open Post',
      time: Date.now() - start,
      apiCalls: requests.filter(r => r.url.includes('notion.com')).length
    });

    // 4. 뒤로가기
    start = Date.now();
    requests = trackNetworkRequests(page);
    await page.goBack();
    await page.waitForLoadState('networkidle');
    flow.push({
      action: 'Back to List',
      time: Date.now() - start,
      apiCalls: requests.filter(r => r.url.includes('notion.com')).length
    });

    // 5. About 방문
    start = Date.now();
    requests = trackNetworkRequests(page);
    await page.click('a[href="/about/"]');
    await page.waitForLoadState('networkidle');
    flow.push({
      action: 'Visit About',
      time: Date.now() - start,
      apiCalls: requests.filter(r => r.url.includes('notion.com')).length
    });

    console.log('\n📊 전체 플로우 분석:');
    console.log('┌─────────────────────┬───────────┬─────────────┐');
    console.log('│ Action              │ Time (ms) │ API Calls   │');
    console.log('├─────────────────────┼───────────┼─────────────┤');
    flow.forEach(step => {
      console.log(`│ ${step.action.padEnd(19)} │ ${String(step.time).padStart(9)} │ ${String(step.apiCalls).padStart(11)} │`);
    });
    console.log('└─────────────────────┴───────────┴─────────────┘');

    const totalTime = flow.reduce((sum, step) => sum + step.time, 0);
    const totalApiCalls = flow.reduce((sum, step) => sum + step.apiCalls, 0);

    console.log(`\n총 소요 시간: ${totalTime}ms`);
    console.log(`총 API 호출: ${totalApiCalls}회`);

    // 전체 플로우가 15초 내에 완료되어야 함
    expect(totalTime).toBeLessThan(15000);
  });
});
