# End-to-End Tests with Playwright

This directory contains E2E tests for the Notion Blog using Playwright.

## Prerequisites

Playwright and its dependencies are already installed. If you need to reinstall browsers:

```bash
npx playwright install
```

## Running Tests

From the `web/` directory:

```bash
# Run all E2E tests (headless mode)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see the browser)
npm run test:e2e:headed

# Debug tests with Playwright Inspector
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

## Test Structure

- `homepage.spec.ts` - Tests for the homepage functionality
- `post.spec.ts` - Tests for individual post pages

## Writing Tests

Tests are written using Playwright's test framework:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## Configuration

Playwright configuration is in `playwright.config.ts` at the project root. It includes:

- Multiple browser support (Chromium, Firefox, WebKit)
- Mobile device testing
- Automatic dev server startup
- Screenshot on failure
- Trace recording on retry

## CI/CD Integration

To run tests in CI, ensure:

1. `PLAYWRIGHT_BASE_URL` environment variable is set (optional)
2. Tests run in headless mode by default
3. Screenshots and traces are captured for debugging

## Debugging

- Use `await page.pause()` to pause test execution
- Run with `--debug` flag for step-by-step debugging
- Check `playwright-report/` for HTML reports
- View traces in Playwright Trace Viewer for failed tests

## Best Practices

1. Use data-testid attributes for stable selectors
2. Wait for network idle on pages with dynamic content
3. Use `test.skip()` for tests that depend on data availability
4. Keep tests independent and isolated
5. Mock Notion API calls for faster, more reliable tests

## MCP Integration

The Playwright MCP server (configured in `../.mcp.json`) allows AI assistants to:

- Navigate and interact with the blog
- Verify UI behavior
- Take screenshots for debugging
- Execute JavaScript in the browser context

This enables automated testing and debugging through AI assistance.
