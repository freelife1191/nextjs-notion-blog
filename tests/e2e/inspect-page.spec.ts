import { test } from '@playwright/test';

test('inspect page for YouTube mentions', async ({ page }) => {
  // 홈페이지로 이동
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // 페이지에서 모든 링크 확인
  const allLinks = await page.locator('a').all();
  console.log(`Total links found: ${allLinks.length}`);

  // 포스트 링크 찾기
  const postLinks = await page.locator('article a[href^="/posts/"]').all();
  console.log(`Post links found: ${postLinks.length}`);

  if (postLinks.length > 0) {
    // 첫 번째 포스트로 이동
    console.log('Navigating to first post...');
    await postLinks[0].click();
    await page.waitForLoadState('networkidle');

    // 링크 멘션 찾기
    const linkMentions = await page.locator('.link-mention-inline').all();
    console.log(`Link mentions found: ${linkMentions.length}`);

    if (linkMentions.length > 0) {
      // 아이콘 크기 확인
      const icons = await page.locator('.link-mention-inline-icon').all();
      console.log(`Icons found: ${icons.length}`);

      for (let i = 0; i < Math.min(icons.length, 3); i++) {
        const box = await icons[i].boundingBox();
        const styles = await icons[i].evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            width: computed.width,
            height: computed.height,
            maxWidth: computed.maxWidth,
            maxHeight: computed.maxHeight,
          };
        });
        console.log(`Icon ${i}:`, { box, styles });
      }

      // 스크린샷 캡처
      await page.screenshot({ path: 'inspect-mention.png', fullPage: true });
    }
  }

  // 페이지 일시정지 (수동 검사용)
  await page.pause();
});
