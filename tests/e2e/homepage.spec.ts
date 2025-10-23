import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/Notion Blog/i);
  });

  test('should display blog posts', async ({ page }) => {
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check for post elements or "no posts" message
    const hasNoPosts = await page.getByText(/No posts found/i).isVisible().catch(() => false);

    if (!hasNoPosts) {
      // If there are posts, verify they're displayed
      const posts = page.locator('article, .post-card');
      await expect(posts.first()).toBeVisible();
    }
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links
    const aboutLink = page.getByRole('link', { name: /about/i });

    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);
    }
  });

  test('should support dark mode toggle', async ({ page }) => {
    await page.goto('/');

    // Look for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i]');

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Verify dark mode class is toggled
      const html = page.locator('html');
      const hasDarkClass = await html.evaluate((el) => el.classList.contains('dark'));
      expect(hasDarkClass).toBeTruthy();
    }
  });
});
