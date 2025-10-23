/**
 * Notion API 테스트 스크립트
 * 실제 Notion 데이터베이스에서 데이터를 가져와서 확인
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// .env.local 파일 읽기
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
  console.log('⚠️  .env.local 파일을 읽을 수 없습니다. 환경 변수 사용')
}

console.log('🔍 Notion API 테스트 시작...\n')

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.error('NOTION_API_KEY:', NOTION_API_KEY ? '✅ 설정됨' : '❌ 없음')
  console.error('NOTION_DATABASE_ID:', NOTION_DATABASE_ID ? '✅ 설정됨' : '❌ 없음')
  process.exit(1)
}

console.log('✅ 환경 변수 확인 완료')
console.log(`📦 DATABASE_ID: ${NOTION_DATABASE_ID.substring(0, 8)}...`)
console.log('')

async function testNotionAPI() {
  try {
    console.log('📡 Notion API 호출 중...\n')

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
          filter: {
            property: 'Status',
            select: {
              equals: 'Publish'
            }
          },
          sorts: [
            {
              property: 'Date',
              direction: 'descending'
            }
          ],
          page_size: 10
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API 호출 실패')
      console.error('Status:', response.status, response.statusText)
      console.error('Error:', errorText)
      return
    }

    const data = await response.json()

    console.log('✅ API 호출 성공!\n')
    console.log(`📊 총 ${data.results.length}개의 Publish 포스트 발견\n`)

    if (data.results.length === 0) {
      console.log('⚠️  Publish 상태의 글이 없습니다.')
      console.log('💡 Notion에서 Status를 "Publish"로 설정하세요.')
      return
    }

    // 각 포스트 정보 출력
    data.results.forEach((page: any, index: number) => {
      const props = page.properties || {}

      const title = props.Title?.title?.[0]?.plain_text || 'Untitled'
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'no-slug'
      const date = props.Date?.date?.start || 'No date'
      const tags = props.Tags?.multi_select?.map((t: any) => t.name).join(', ') || 'No tags'
      const description = props.Description?.rich_text?.[0]?.plain_text || 'No description'
      const author = props.Author?.rich_text?.[0]?.plain_text || props.Author?.people?.[0]?.name || 'No author'

      // 커버 이미지 확인
      let coverImageUrl = 'No cover image'
      if (page.cover) {
        coverImageUrl = page.cover.type === 'external'
          ? page.cover.external?.url
          : page.cover.file?.url
      } else if (props.CoverImage?.files?.[0]) {
        const file = props.CoverImage.files[0]
        coverImageUrl = file.type === 'external'
          ? file.external?.url
          : file.file?.url
      }

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📝 포스트 #${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📌 제목: ${title}`)
      console.log(`🔗 Slug: ${slug}`)
      console.log(`📅 날짜: ${date}`)
      console.log(`👤 작성자: ${author}`)
      console.log(`🏷️  태그: ${tags}`)
      console.log(`📝 설명: ${description.substring(0, 100)}${description.length > 100 ? '...' : ''}`)
      console.log(`🖼️  커버: ${coverImageUrl === 'No cover image' ? '❌ 없음' : '✅ 있음'}`)
      if (coverImageUrl !== 'No cover image') {
        console.log(`   URL: ${coverImageUrl.substring(0, 60)}...`)
      }
      console.log('')
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ 테스트 완료!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('💡 다음 단계:')
    console.log('1. http://localhost:3000 접속')
    console.log('2. 포스트 목록 확인')
    console.log('3. 포스트 클릭하여 상세 페이지 확인')

  } catch (error) {
    console.error('❌ 에러 발생:', error)
    if (error instanceof Error) {
      console.error('메시지:', error.message)
      console.error('스택:', error.stack)
    }
  }
}

testNotionAPI()
