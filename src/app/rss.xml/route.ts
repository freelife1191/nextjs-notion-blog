import { createNotionClient } from '@/services/notion/client'

// Required for static export - pre-render this route at build time
export const dynamic = 'force-static'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const notionClient = createNotionClient()

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

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
