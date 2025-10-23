import { test, expect } from '@playwright/test';

test.describe('Post Page', () => {
  test('should load a post page successfully', async ({ page }) => {
    // First, go to homepage to find a post
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to find and click on a post link
    const postLink = page.locator('a[href*="/posts/"]').first();

    if (await postLink.isVisible()) {
      await postLink.click();

      // Verify we're on a post page
      await expect(page).toHaveURL(/\/posts\//);

      // Check that the post content is visible
      const postContent = page.locator('article, main');
      await expect(postContent).toBeVisible();
    } else {
      test.skip(true, 'No posts available to test');
    }
  });

  test('should display post metadata', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();

    if (await postLink.isVisible()) {
      await postLink.click();

      // Look for common metadata elements
      const hasDate = await page.locator('time, .date, [datetime]').isVisible().catch(() => false);
      const hasAuthor = await page.locator('.author, [rel="author"]').isVisible().catch(() => false);

      // At least one metadata element should be present
      expect(hasDate || hasAuthor).toBeTruthy();
    } else {
      test.skip(true, 'No posts available to test');
    }
  });

  test('should render Notion content correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();

    if (await postLink.isVisible()) {
      await postLink.click();

      // Wait for content to render
      await page.waitForLoadState('networkidle');

      // Check for common Notion block types
      const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
      const hasParagraphs = await page.locator('p').count() > 0;

      // Post should have some content
      expect(hasHeadings || hasParagraphs).toBeTruthy();
    } else {
      test.skip(true, 'No posts available to test');
    }
  });

  test('should support navigation back to homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const postLink = page.locator('a[href*="/posts/"]').first();

    if (await postLink.isVisible()) {
      await postLink.click();

      // Find and click back/home link
      const homeLink = page.getByRole('link', { name: /home|back/i }).first();

      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    } else {
      test.skip(true, 'No posts available to test');
    }
  });
});
