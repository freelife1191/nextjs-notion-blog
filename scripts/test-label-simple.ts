/**
 * Notion API에서 Label 속성을 읽어오는지 테스트하는 간단한 스크립트
 */

import fs from 'fs'
import path from 'path'

// .env.local 파일에서 환경 변수 로드
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local 파일을 찾을 수 없습니다.')
    return {}
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env: Record<string, string> = {}

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      if (key && value) {
        env[key.trim()] = value.trim()
      }
    }
  })

  return env
}

async function testNotionLabel() {
  const env = loadEnv()
  const apiKey = env.NOTION_API_KEY
  const databaseId = env.NOTION_DATABASE_ID

  if (!apiKey || !databaseId) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.')
    console.log('NOTION_API_KEY:', apiKey ? '✅ 설정됨' : '❌ 없음')
    console.log('NOTION_DATABASE_ID:', databaseId ? '✅ 설정됨' : '❌ 없음')
    return
  }

  console.log('🔍 Notion Database에서 포스트 조회 중...\n')

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Status',
            select: { equals: 'Publish' },
          },
          page_size: 3,
        }),
      }
    )

    if (!response.ok) {
      console.error('❌ Notion API 호출 실패:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('상세 오류:', errorData)
      return
    }

    const data: any = await response.json()

    console.log(`📊 총 ${data.results.length}개의 포스트를 찾았습니다.\n`)

    data.results.forEach((page: any, index: number) => {
      const props = page.properties

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📝 포스트 ${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

      // Title
      const title = props.Title?.title?.[0]?.plain_text || 'Untitled'
      console.log(`제목: ${title}`)

      // Slug
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'N/A'
      console.log(`Slug: ${slug}`)

      // Label 확인
      if (props.Label) {
        console.log(`\n✅ Label 속성이 존재합니다!`)
        console.log(`   타입:`, props.Label.type)
        console.log(`   전체 데이터:`, JSON.stringify(props.Label, null, 2))

        if (props.Label.select) {
          console.log(`   ✨ Label 값: "${props.Label.select.name}"`)
        } else {
          console.log(`   ⚠️  Label 값이 비어있습니다.`)
        }
      } else {
        console.log(`\n❌ Label 속성이 없습니다!`)
        console.log(`\n사용 가능한 속성 목록:`)
        Object.keys(props).forEach(key => {
          console.log(`   - ${key} (${props[key]?.type})`)
        })
      }

      console.log(`\n`)
    })

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`\n💡 해결 방법:`)
    console.log(`1. Notion Database에 "Label" 속성이 있는지 확인`)
    console.log(`2. 속성 이름이 정확히 "Label"인지 확인 (대소문자 구분)`)
    console.log(`3. 속성 타입이 "Select"인지 확인`)
    console.log(`4. 포스트에 Label 값이 설정되어 있는지 확인`)
    console.log(`\n💡 Notion Database 링크:`)
    console.log(`   https://www.notion.so/${databaseId}`)
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  }
}

testNotionLabel().catch(console.error)
