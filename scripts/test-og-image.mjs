#!/usr/bin/env node
/**
 * OG Image 설정 확인 스크립트
 * Notion Site Settings DB에서 OGImage가 올바르게 설정되었는지 확인
 */

import dotenv from 'dotenv'

// .env.local 파일 로드
dotenv.config({ path: '.env.local' })

const NOTION_API_KEY = process.env.NOTION_API_KEY
const siteDatabaseId = process.env.NOTION_SITE_DATABASE_ID

console.log('🔍 OG Image 설정 확인 중...\n')

if (!siteDatabaseId) {
  console.log('⚠️  NOTION_SITE_DATABASE_ID가 설정되지 않았습니다.')
  console.log('💡 기본 OG 이미지가 사용됩니다.')
  process.exit(0)
}

try {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${siteDatabaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 1,
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ API 호출 실패:', errorText)
    process.exit(1)
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    console.log('❌ Site Settings DB가 비어있습니다.')
    process.exit(1)
  }

  const page = data.results[0]
  const props = page.properties

  console.log('✅ Site Settings DB 연결 성공!\n')
  console.log('📋 OGImage 필드 확인:\n')

  // OGImage 필드 확인
  const ogImageField = props.OGImage

  if (!ogImageField) {
    console.log('❌ OGImage 필드가 존재하지 않습니다.')
    console.log('💡 Notion DB에 "OGImage" 필드를 추가하세요 (타입: Files)')
    process.exit(1)
  }

  console.log('필드 타입:', ogImageField.type)

  if (ogImageField.type !== 'files') {
    console.log('❌ OGImage 필드 타입이 "files"가 아닙니다.')
    console.log(`   현재 타입: ${ogImageField.type}`)
    console.log('💡 OGImage 필드를 Files 타입으로 변경하세요.')
    process.exit(1)
  }

  const files = ogImageField.files || []

  if (files.length === 0) {
    console.log('⚠️  OGImage 필드에 이미지가 업로드되지 않았습니다.')
    console.log('💡 Notion에서 OGImage 필드에 이미지를 업로드하세요.')
    console.log('   권장 크기: 1200x630px')
    process.exit(0)
  }

  console.log(`파일 개수: ${files.length}`)

  const file = files[0]
  let imageUrl = null

  if (file.type === 'file') {
    imageUrl = file.file?.url
  } else if (file.type === 'external') {
    imageUrl = file.external?.url
  }

  if (!imageUrl) {
    console.log('❌ 이미지 URL을 가져올 수 없습니다.')
    process.exit(1)
  }

  console.log('✅ OG 이미지 URL:', imageUrl)
  console.log('')
  console.log('📌 확인 사항:')
  console.log('1. 이미지가 Notion에 업로드된 경우: URL은 유효하지만 2시간 후 만료됩니다.')
  console.log('   → 배포 시 자동으로 새 URL이 생성됩니다.')
  console.log('2. 외부 URL을 사용한 경우: 영구적으로 사용 가능합니다.')
  console.log('   → 안정적인 이미지 호스팅을 권장합니다.')
  console.log('')
  console.log('✅ OG 이미지 설정이 완료되었습니다!')
  console.log('💡 배포 후 링크 미리보기(카카오톡, 슬랙 등)에서 확인하세요.')

} catch (error) {
  console.error('❌ 오류 발생:', error.message)
  process.exit(1)
}
