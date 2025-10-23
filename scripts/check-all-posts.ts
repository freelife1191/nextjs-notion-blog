/**
 * 모든 포스트 조회 (필터 없이)
 * Status 값이 정확히 어떻게 설정되어 있는지 확인
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(__dirname, '../.env.local')
let NOTION_API_KEY = process.env.NOTION_API_KEY
let NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').trim()
      if (key === 'NOTION_API_KEY') NOTION_API_KEY = value
      if (key === 'NOTION_DATABASE_ID') NOTION_DATABASE_ID = value
    }
  })
} catch {
  console.log('⚠️  .env.local 파일을 읽을 수 없습니다.')
}

console.log('🔍 모든 포스트 조회 중 (필터 없음)...\n')

async function checkAllPosts() {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 10
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API 호출 실패')
      console.error('Error:', errorText)
      return
    }

    const data = await response.json()

    console.log(`📊 총 ${data.results.length}개의 포스트 발견\n`)

    if (data.results.length === 0) {
      console.log('⚠️  데이터베이스에 글이 없습니다.')
      console.log('💡 Notion 데이터베이스에 새 페이지를 추가하세요.')
      return
    }

    data.results.forEach((page: any, index: number) => {
      const props = page.properties || {}

      const title = props.Title?.title?.[0]?.plain_text || 'Untitled'
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'no-slug'
      const status = props.Status?.select?.name || 'No status'
      const date = props.Date?.date?.start || 'No date'

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📝 포스트 #${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📌 제목: ${title}`)
      console.log(`🔗 Slug: ${slug}`)
      console.log(`⭐ Status: ${status}`)
      console.log(`📅 날짜: ${date}`)
      console.log(`🔍 Status 타입: ${props.Status ? 'select' : 'undefined'}`)
      console.log(`🔍 Status 값: ${JSON.stringify(props.Status?.select)}`)
      console.log('')
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 Status가 "Publish"가 아닌 경우:')
    console.log('   1. Notion에서 Status 속성 클릭')
    console.log('   2. "Publish" 선택')
    console.log('   3. 다시 테스트')

  } catch (error) {
    console.error('❌ 에러 발생:', error)
  }
}

checkAllPosts()
