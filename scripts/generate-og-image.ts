#!/usr/bin/env tsx
/**
 * Generate default Open Graph image
 * Creates a 1200x630px PNG image for social media sharing
 */

import * as fs from 'fs'
import * as path from 'path'

const svgContent = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#gradient)"/>

  <!-- Title -->
  <text
    x="600"
    y="280"
    font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="72"
    font-weight="700"
    fill="#ffffff"
    text-anchor="middle"
    letter-spacing="-0.02em"
  >
    Your Name
  </text>

  <!-- Subtitle -->
  <text
    x="600"
    y="340"
    font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="36"
    font-weight="400"
    fill="#94a3b8"
    text-anchor="middle"
    letter-spacing="-0.01em"
  >
    Blog
  </text>

  <!-- Description -->
  <text
    x="600"
    y="400"
    font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="24"
    font-weight="300"
    fill="#64748b"
    text-anchor="middle"
  >
    Notion-powered personal blog
  </text>

  <!-- Bottom accent line -->
  <rect x="400" y="480" width="400" height="3" fill="#3b82f6" rx="1.5"/>
</svg>
`.trim()

// Write SVG file
const outputDir = path.join(process.cwd(), 'public', 'images')
const svgPath = path.join(outputDir, 'og-default.svg')

console.log('📝 Creating default OG image SVG...')
fs.writeFileSync(svgPath, svgContent)
console.log(`✅ SVG created: ${svgPath}`)

console.log('\n📌 Next steps:')
console.log('To convert SVG to PNG (1200x630), you can use one of these methods:')
console.log('1. Online converter: https://cloudconvert.com/svg-to-png')
console.log('2. ImageMagick: convert -density 300 og-default.svg -resize 1200x630 og-default.png')
console.log('3. Or use the SVG directly in the meta tags (most browsers support it)')
console.log('\n💡 For now, the code references og-default.png, so you should:')
console.log('   - Convert the SVG to PNG using the above methods')
console.log('   - Place the PNG at: public/images/og-default.png')
