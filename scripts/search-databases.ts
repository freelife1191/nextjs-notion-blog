/**
 * Notion 워크스페이스에서 데이터베이스 검색
 * Integration이 접근 가능한 모든 데이터베이스를 찾아줍니다
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// .env.local 파일 읽기
const envPath = resolve(__dirname, '../.env.local')
let NOTION_API_KEY = process.env.NOTION_API_KEY

try {
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').trim()
      if (key === 'NOTION_API_KEY') NOTION_API_KEY = value
    }
  })
} catch {
  console.log('⚠️  .env.local 파일을 읽을 수 없습니다.')
}

console.log('🔍 Notion 워크스페이스에서 데이터베이스 검색 중...\n')

if (!NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY가 설정되지 않았습니다.')
  console.error('\n💡 .env.local 파일에 NOTION_API_KEY를 추가하세요:')
  console.error('   NOTION_API_KEY=secret_your_api_key_here')
  process.exit(1)
}

console.log('✅ API Key 확인 완료\n')

async function searchDatabases() {
  try {
    console.log('📡 Notion API 호출 중...\n')

    // Search API로 데이터베이스 검색
    const response = await fetch(
      'https://api.notion.com/v1/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'object',
            value: 'database'
          },
          sort: {
            direction: 'descending',
            timestamp: 'last_edited_time'
          }
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
    console.log(`📊 총 ${data.results.length}개의 데이터베이스 발견\n`)

    if (data.results.length === 0) {
      console.log('⚠️  접근 가능한 데이터베이스가 없습니다.\n')
      console.log('💡 다음 사항을 확인하세요:')
      console.log('1. Notion Integration이 생성되었는지 확인')
      console.log('2. Integration이 데이터베이스 페이지에 연결되었는지 확인')
      console.log('3. 데이터베이스 페이지 우측 상단 "..." → "Add connections" → Integration 선택')
      return
    }

    // 각 데이터베이스 정보 출력
    data.results.forEach((db: any, index: number) => {
      const title = db.title?.[0]?.plain_text || 'Untitled Database'
      const id = db.id.replace(/-/g, '') // 하이픈 제거
      const url = db.url
      const lastEdited = new Date(db.last_edited_time).toLocaleString('ko-KR')

      // 데이터베이스 속성 확인
      const properties = db.properties || {}
      const propertyNames = Object.keys(properties)
      const propertyTypes = propertyNames.map(name =>
        `${name} (${properties[name].type})`
      )

      // Posts 데이터베이스인지 확인
      const hasTitle = propertyNames.some(p => properties[p].type === 'title')
      const hasStatus = propertyNames.some(p => p.toLowerCase().includes('status'))
      const hasSlug = propertyNames.some(p => p.toLowerCase().includes('slug'))

      const isBlogDatabase = hasTitle && (hasStatus || hasSlug)

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📁 데이터베이스 #${index + 1} ${isBlogDatabase ? '⭐ (블로그 DB 가능성 높음)' : ''}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📌 이름: ${title}`)
      console.log(`🆔 ID: ${id}`)
      console.log(`🔗 URL: ${url}`)
      console.log(`📅 마지막 수정: ${lastEdited}`)
      console.log(`📋 속성 (${propertyNames.length}개):`)
      propertyTypes.forEach(prop => {
        console.log(`   - ${prop}`)
      })

      if (isBlogDatabase) {
        console.log(`\n✨ 이 데이터베이스를 .env.local에 설정하세요:`)
        console.log(`   NOTION_DATABASE_ID=${id}`)
      }
      console.log('')
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('💡 다음 단계:')
    console.log('1. 위에서 블로그 포스트를 관리하는 데이터베이스 ID를 찾으세요')
    console.log('2. .env.local 파일에 NOTION_DATABASE_ID 업데이트:')
    console.log('   NOTION_DATABASE_ID=찾은_데이터베이스_ID')
    console.log('3. npm run test:notion 명령어로 다시 테스트')

  } catch (error) {
    console.error('❌ 에러 발생:', error)
    if (error instanceof Error) {
      console.error('메시지:', error.message)
    }
  }
}

searchDatabases()
