/**
 * Notion Settings Database 테스트 스크립트
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

async function testSettingsDatabase() {
  const env = loadEnv()
  const apiKey = env.NOTION_API_KEY
  const databaseId = env.NOTION_SETTINGS_DATABASE_ID

  console.log('🔍 설정 확인...\n')
  console.log('NOTION_API_KEY:', apiKey ? '✅ 설정됨' : '❌ 없음')
  console.log('NOTION_SETTINGS_DATABASE_ID:', databaseId ? `✅ ${databaseId}` : '❌ 없음')
  console.log()

  if (!apiKey || !databaseId) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.')
    return
  }

  try {
    console.log('📊 Notion Settings Database 조회 중...\n')

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
          page_size: 1, // 첫 번째 행만
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

    console.log(`📊 조회 결과: ${data.results.length}개의 행을 찾았습니다.\n`)

    if (data.results.length === 0) {
      console.warn('⚠️  데이터베이스에 행이 없습니다!')
      console.log('\n💡 해결 방법:')
      console.log('1. Notion 설정 데이터베이스를 열기')
      console.log('2. 첫 번째 행에 데이터 입력')
      console.log('3. 다시 테스트')
      return
    }

    const page = data.results[0]
    const props = page.properties

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 첫 번째 행 데이터')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // 모든 속성 출력
    Object.keys(props).forEach(key => {
      const prop = props[key]
      console.log(`${key}:`)
      console.log(`  타입: ${prop.type}`)

      if (prop.type === 'title' && prop.title?.[0]) {
        console.log(`  ✅ 값: "${prop.title[0].plain_text}"`)
      } else if (prop.type === 'rich_text' && prop.rich_text?.[0]) {
        console.log(`  ✅ 값: "${prop.rich_text[0].plain_text}"`)
      } else if (prop.type === 'url' && prop.url) {
        console.log(`  ✅ 값: "${prop.url}"`)
      } else if (prop.type === 'email' && prop.email) {
        console.log(`  ✅ 값: "${prop.email}"`)
      } else if (prop.type === 'files' && prop.files?.[0]) {
        const file = prop.files[0]
        const url = file.type === 'external' ? file.external?.url : file.file?.url
        console.log(`  ✅ 파일: "${url}"`)
      } else {
        console.log(`  ⚠️  값이 비어있습니다`)
      }
      console.log()
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('💡 권장 속성 목록:')
    console.log('- Name (Title)')
    console.log('- ProfileImage (Files & media)')
    console.log('- JobTitle (Text)')
    console.log('- Bio (Text)')
    console.log('- HomeTitle (Text)')
    console.log('- HomeDescription (Text)')
    console.log('- CopyrightText (Text)')
    console.log('- FooterText (Text)')
    console.log('- Instagram (URL)')
    console.log('- Email (Email)')
    console.log('- GitHub (URL)')
    console.log('- Blog (URL)')
    console.log('- KakaoChannel (URL)')
    console.log('- Kakao (URL)')
    console.log('- Twitter (URL)')
    console.log('- YouTube (URL)')
    console.log('- LinkedIn (URL)')
    console.log('- Threads (URL)')

  } catch (error) {
    console.error('❌ 오류 발생:', error)
  }
}

testSettingsDatabase().catch(console.error)
