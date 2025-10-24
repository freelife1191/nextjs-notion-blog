#!/usr/bin/env node

/**
 * 프로필 이미지만 다운로드하는 스크립트
 *
 * Notion에서 프로필 이미지만 다운로드하여 public/images/에 저장합니다.
 * 프로필 이미지는 모든 페이지에서 사용되므로 로컬에 저장하는 것이 좋습니다.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 파일에서 환경 변수 로드
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_SITE_DATABASE_ID = process.env.NOTION_SITE_DATABASE_ID;

/**
 * 디렉토리가 없으면 생성
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * URL에서 이미지 다운로드
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // 실패 시 파일 삭제
      reject(err);
    });
  });
}

/**
 * Site 설정 가져오기
 */
async function getSiteSettings() {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_SITE_DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      page_size: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  const data = await response.json();
  return data.results[0];
}

/**
 * 이미지 URL 추출
 */
function extractImageUrl(property) {
  if (!property || !property.files || property.files.length === 0) {
    return null;
  }

  const file = property.files[0];
  return file.file?.url || file.external?.url || null;
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 Starting profile image download...\n');

  if (!NOTION_API_KEY || !NOTION_SITE_DATABASE_ID) {
    console.log('⚠️  Missing required environment variables, skipping...');
    return;
  }

  // public/images 디렉토리 생성
  ensureDirectoryExists(IMAGES_DIR);

  try {
    // 프로필 이미지 다운로드
    console.log('📥 Downloading profile image...');
    const siteSettings = await getSiteSettings();
    const profileImageUrl = extractImageUrl(siteSettings.properties.ProfileImage || siteSettings.properties.profileImage);

    if (profileImageUrl) {
      const ext = path.extname(new URL(profileImageUrl).pathname.split('?')[0]) || '.jpg';
      const filepath = path.join(IMAGES_DIR, `profile${ext}`);

      await downloadImage(profileImageUrl, filepath);
      console.log(`   ✅ Profile image saved: /images/profile${ext}`);

      console.log('\n✨ Download completed!\n');
    } else {
      console.log('   ⚠️  No profile image found in Notion\n');
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
