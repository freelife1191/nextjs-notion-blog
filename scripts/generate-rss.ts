/**
 * RSS Feed 정적 생성 스크립트
 * 빌드 시점에 RSS 피드를 생성하여 public 디렉토리에 저장
 */

// CRITICAL: Load environment variables BEFORE importing any application modules
import { config } from 'dotenv'
import { resolve, join } from 'path'
import { existsSync, writeFileSync, mkdirSync } from 'fs'

// Load .env.local file for local development
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  config({ path: envPath })
  console.log('✅ Loaded environment variables from .env.local')
} else {
  console.log('ℹ️  .env.local not found, using environment variables from system')
}

// Check if required environment variables are present
const hasRequiredEnv = process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID

if (!hasRequiredEnv) {
  console.log('⚠️  Required environment variables (NOTION_API_KEY, NOTION_DATABASE_ID) are not set')
  console.log('⚠️  Skipping RSS generation - this is expected in CI environments where RSS is generated during build')
  process.exit(0) // Exit successfully without generating RSS
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function generateRSS() {
  console.log('🔄 Generating RSS feed...')

  // Dynamic import to avoid loading env.ts before environment variables are set
  const { createNotionClient } = await import('../src/services/notion/client')
  const notionClient = createNotionClient()

  try {
    // Get site configuration and posts
    const [siteConfig, allPosts] = await Promise.all([
      notionClient.getSiteConfig(),
      notionClient.listPublishedPosts()
    ])

    // Determine base URL based on environment
    const isDev = process.env.NODE_ENV === 'development'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (isDev ? 'http://localhost:3000' : 'https://your-username.github.io')

    // Fetch latest 20 posts
    const posts = allPosts.slice(0, 20)

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.siteTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.siteDescription)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const postUrl = `${baseUrl}/posts/${post.slug}`
        const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ''}
      ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') || ''}
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ''}
    </item>`
      })
      .join('')}
  </channel>
</rss>`

    // Ensure public directory exists
    const publicDir = join(process.cwd(), 'public')
    mkdirSync(publicDir, { recursive: true })

    // Write RSS to public/rss.xml
    const rssPath = join(publicDir, 'rss.xml')
    writeFileSync(rssPath, rss, 'utf-8')

    console.log(`✅ RSS feed generated successfully at: ${rssPath}`)
    console.log(`📊 Total posts in feed: ${posts.length}`)
  } catch (error) {
    console.error('❌ Failed to generate RSS feed:', error)
    process.exit(1)
  }
}

generateRSS()
