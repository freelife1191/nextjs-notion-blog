/**
 * Notion API에서 Label 속성을 읽어오는지 테스트하는 스크립트
 */

import { createNotionClient } from '../src/services/notion/client'

async function testNotionLabel() {
  try {
    console.log('🔍 Notion Database에서 포스트 조회 중...\n')

    const notionClient = createNotionClient()
    const posts = await notionClient.listPublishedPosts()

    console.log(`📊 총 ${posts.length}개의 포스트를 찾았습니다.\n`)

    // 처음 3개 포스트만 표시
    posts.slice(0, 3).forEach((post, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📝 포스트 ${index + 1}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`제목: ${post.title}`)
      console.log(`Slug: ${post.slug}`)
      console.log(`날짜: ${post.date}`)
      console.log(`태그: ${post.tags?.join(', ') || '없음'}`)

      if (post.label) {
        console.log(`\n✅ Label 값: "${post.label}"`)
      } else {
        console.log(`\n❌ Label 값이 없습니다.`)
      }

      console.log(`\n`)
    })

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`\n💡 해결 방법:`)
    console.log(`1. Notion Database에 "Label" 속성이 있는지 확인`)
    console.log(`2. 속성 이름이 정확히 "Label"인지 확인 (대소문자 구분)`)
    console.log(`3. 속성 타입이 "Select"인지 확인`)
    console.log(`4. 포스트에 Label 값이 설정되어 있는지 확인`)
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  }
}

testNotionLabel().catch(console.error)
