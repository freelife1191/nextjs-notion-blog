/**
 * 사이트맵 및 RSS 피드 생성 스크립트
 * 빌드 시 정적 파일로 생성
 */

import fs from 'fs'
import path from 'path'

// Notion API에서 포스트 데이터 가져오기
async function fetchPosts() {
  const headers = {
    Authorization: `Bearer ${process.env.NOTION_API_KEY ?? ''}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  } as const

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return []
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filter: { property: 'Status', status: { equals: 'Publish' } },
        sorts: [{ property: 'Date', direction: 'descending' }],
        page_size: 100,
      }),
    })

    if (!res.ok) return []

    const data = await res.json()
    const toText = (arr?: any[]) => (arr ?? []).map(t => t.plain_text ?? '').join('')
    
    return data.results.map((page: any) => {
      const p = page.properties ?? {}
      return {
        slug: toText(p.Slug?.rich_text),
        title: toText(p.Title?.title) || 'Untitled',
        date: p.Date?.date?.start || new Date().toISOString(),
        description: toText(p.Description?.rich_text),
        updatedAt: page.last_edited_time,
      }
    }).filter((p: any) => p.slug)
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

// XML 사이트맵 생성
function generateSitemap(posts: any[]) {
  const baseUrl = 'https://your-username.github.io/your-repo-name'
  const currentDate = new Date().toISOString()

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly', lastmod: currentDate },
    { url: '/about', priority: '0.8', changefreq: 'monthly', lastmod: currentDate },
  ]

  const postPages = posts.map(post => ({
    url: `/posts/${post.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: post.updatedAt,
  }))

  const allPages = [...staticPages, ...postPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return sitemap
}

// RSS 피드 생성
function generateRSSFeed(posts: any[]) {
  const baseUrl = 'https://your-username.github.io/your-repo-name'
  const currentDate = new Date().toUTCString()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Name — Blog</title>
    <description>Notion-powered personal blog by Your Name. 개발, 디자인, 일상에 대한 생각을 공유합니다.</description>
    <link>${baseUrl}</link>
    <language>ko</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    
    ${posts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description || ''}]]></description>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid>${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`

  return rss
}

// robots.txt 생성
function generateRobotsTxt() {
  const baseUrl = 'https://your-username.github.io/your-repo-name'
  
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`
}

// 메인 실행 함수
async function main() {
  console.log('🚀 사이트맵 및 RSS 피드 생성 시작...')

  try {
    // 포스트 데이터 가져오기
    const posts = await fetchPosts()
    console.log(`📝 ${posts.length}개의 포스트를 찾았습니다.`)

    // 출력 디렉토리 생성
    const outputDir = path.join(process.cwd(), 'out')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 사이트맵 생성
    const sitemap = generateSitemap(posts)
    fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap)
    console.log('✅ sitemap.xml 생성 완료')

    // RSS 피드 생성
    const rssFeed = generateRSSFeed(posts)
    fs.writeFileSync(path.join(outputDir, 'feed.xml'), rssFeed)
    console.log('✅ feed.xml 생성 완료')

    // robots.txt 생성
    const robotsTxt = generateRobotsTxt()
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxt)
    console.log('✅ robots.txt 생성 완료')

    console.log('🎉 모든 파일 생성이 완료되었습니다!')
  } catch (error) {
    console.error('❌ 오류 발생:', error)
    process.exit(1)
  }
}

// 스크립트 실행
if (require.main === module) {
  main()
}

export { generateSitemap, generateRSSFeed, generateRobotsTxt }
