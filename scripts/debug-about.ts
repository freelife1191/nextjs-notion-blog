/**
 * About 페이지 데이터 디버그 스크립트
 */

import { createNotionClient } from '../src/services/notion/client'
import * as fs from 'fs'
import * as path from 'path'

async function debugAbout() {
  console.log('🔍 Debugging About page data...\n')

  const client = createNotionClient()
  const aboutPage = await client.getAboutPage()

  if (!aboutPage) {
    console.log('❌ No about page found')
    return
  }

  console.log('✅ About page fetched successfully')
  console.log('Title:', aboutPage.title)
  console.log('Total blocks:', aboutPage.content.length)
  console.log('\n--- Block Structure ---\n')

  // 블록 구조 출력
  function printBlock(block: any, indent = 0) {
    const prefix = '  '.repeat(indent)
    const type = block.type
    const id = block.id?.slice(0, 8) || 'no-id'

    console.log(`${prefix}[${type}] ${id}`)

    // Children 확인
    const blockData = block[type]
    if (blockData) {
      const hasChildren = block.has_children
      const children = blockData.children || []

      if (hasChildren) {
        console.log(`${prefix}  ↳ has_children: true`)
      }

      if (children.length > 0) {
        console.log(`${prefix}  ↳ children count: ${children.length}`)
        children.forEach((child: any) => printBlock(child, indent + 2))
      }

      // Rich text 미리보기
      const richText = blockData.rich_text
      if (richText && richText.length > 0) {
        const text = richText.map((rt: any) => rt.plain_text || '').join('')
        if (text) {
          console.log(`${prefix}  ↳ text: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`)
        }
      }
    }
  }

  aboutPage.content.forEach((block) => printBlock(block))

  // JSON 파일로 저장
  const outputPath = path.join(__dirname, 'debug-about-output.json')
  fs.writeFileSync(outputPath, JSON.stringify(aboutPage, null, 2))
  console.log(`\n📄 Full data saved to: ${outputPath}`)
}

debugAbout().catch(console.error)
