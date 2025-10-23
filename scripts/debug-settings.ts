/**
 * 설정 데이터 파싱 디버깅 스크립트
 */

import fs from 'fs'
import path from 'path'

// .env.local 파일에서 환경 변수 로드
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local 파일을 찾을 수 없습니다.')
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
}

// 환경 변수 로드
loadEnv()

import { createNotionClient } from '../src/services/notion/client'

async function debugSettings() {
  try {
    console.log('🔍 설정 데이터 가져오기 중...\n')

    const notionClient = createNotionClient()
    const settings = await notionClient.getSiteSettings()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 파싱된 설정 데이터')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('기본 정보:')
    console.log('  Name:', settings.name)
    console.log('  JobTitle:', settings.jobTitle)
    console.log('  Bio:', settings.bio)
    console.log('  ProfileImage:', settings.profileImage)
    console.log()

    console.log('홈페이지 설정:')
    console.log('  HomeTitle:', settings.homeTitle)
    console.log('  HomeDescription:', settings.homeDescription)
    console.log()

    console.log('저작권 정보:')
    console.log('  CopyrightText:', settings.copyrightText)
    console.log('  FooterText:', settings.footerText)
    console.log()

    console.log('소셜 링크:')
    console.log('  KakaoChannel:', settings.socialLinks.kakaoChannel)
    console.log('  Kakao:', settings.socialLinks.kakao)
    console.log('  Instagram:', settings.socialLinks.instagram)
    console.log('  Blog:', settings.socialLinks.blog)
    console.log('  Email:', settings.socialLinks.email)
    console.log('  GitHub:', settings.socialLinks.github)
    console.log('  Twitter:', settings.socialLinks.twitter)
    console.log('  YouTube:', settings.socialLinks.youtube)
    console.log('  LinkedIn:', settings.socialLinks.linkedin)
    console.log('  Threads:', settings.socialLinks.threads)
    console.log()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('전체 JSON:')
    console.log(JSON.stringify(settings, null, 2))

  } catch (error) {
    console.error('❌ 오류 발생:', error)
  }
}

debugSettings().catch(console.error)
