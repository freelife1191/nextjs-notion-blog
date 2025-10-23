import { test, expect } from '@playwright/test';

test.describe('YouTube mention icon size', () => {
  test('should display YouTube mention icon at correct size', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('http://localhost:3000');

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // 유튜브 멘션이 있는 포스트 찾기 (스크린샷에 보이는 "에일린 mind yoga" 텍스트로 검색)
    const yogaLink = page.locator('text=에일린 mind yoga').first();

    if (await yogaLink.count() > 0) {
      console.log('Found yoga link on homepage');

      // 링크 멘션 아이콘 찾기
      const icon = page.locator('.link-mention-inline-icon').first();

      if (await icon.count() > 0) {
        // 아이콘 크기 확인
        const box = await icon.boundingBox();
        console.log('Icon bounding box:', box);

        // 스크린샷 캡처
        await page.screenshot({ path: 'youtube-mention-before.png', fullPage: true });

        // 아이콘이 14px x 14px이어야 함
        expect(box?.width).toBeLessThanOrEqual(16);
        expect(box?.height).toBeLessThanOrEqual(16);
      }
    } else {
      console.log('Yoga link not found on homepage, searching posts...');

      // 첫 번째 포스트로 이동
      const firstPost = page.locator('article a').first();
      if (await firstPost.count() > 0) {
        await firstPost.click();
        await page.waitForLoadState('networkidle');

        // 포스트 내에서 유튜브 멘션 찾기
        const mentionLink = page.locator('.link-mention-inline').first();

        if (await mentionLink.count() > 0) {
          const icon = page.locator('.link-mention-inline-icon').first();
          const box = await icon.boundingBox();
          console.log('Icon bounding box:', box);

          // 스크린샷 캡처
          await page.screenshot({ path: 'youtube-mention-post.png', fullPage: true });

          // 아이콘이 14px x 14px이어야 함
          expect(box?.width).toBeLessThanOrEqual(16);
          expect(box?.height).toBeLessThanOrEqual(16);
        }
      }
    }
  });

  test('inspect icon styles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 모든 링크 멘션 아이콘 찾기
    const icons = page.locator('.link-mention-inline-icon');
    const count = await icons.count();

    console.log(`Found ${count} link mention icons`);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const icon = icons.nth(i);
      const styles = await icon.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          display: computed.display,
          objectFit: computed.objectFit
        };
      });
      console.log(`Icon ${i} styles:`, styles);
    }
  });
});
