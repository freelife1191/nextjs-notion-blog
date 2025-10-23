#!/usr/bin/env tsx
/**
 * Convert OG image SVG to PNG using Playwright
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

async function convertSvgToPng() {
  const svgPath = path.join(process.cwd(), 'public', 'images', 'og-default.svg')
  const pngPath = path.join(process.cwd(), 'public', 'images', 'og-default.png')

  if (!fs.existsSync(svgPath)) {
    console.error('❌ SVG file not found:', svgPath)
    process.exit(1)
  }

  const svgContent = fs.readFileSync(svgPath, 'utf-8')

  // Create HTML wrapper for the SVG
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 630px;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
  `.trim()

  console.log('🚀 Launching browser...')
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  })

  console.log('📄 Loading SVG content...')
  await page.setContent(html)

  console.log('📸 Taking screenshot...')
  await page.screenshot({
    path: pngPath,
    omitBackground: false,
  })

  await browser.close()

  console.log(`✅ PNG created: ${pngPath}`)
  console.log(`   Size: 1200x630px`)
}

convertSvgToPng().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
