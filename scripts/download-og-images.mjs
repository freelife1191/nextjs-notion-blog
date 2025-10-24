#!/usr/bin/env node

/**
 * OG Image 다운로드 스크립트
 *
 * Notion에서 OG Image URL을 가져와서 public/og-images/에 저장합니다.
 * 이렇게 하면 S3 임시 URL 만료 문제를 해결할 수 있습니다.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OG_IMAGES_DIR = path.join(PUBLIC_DIR, 'og-images');

/**
 * 디렉토리가 없으면 생성
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
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
 * Notion API를 통해 Site 설정에서 OG Image URL 가져오기
 */
async function getOgImageUrl() {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_SITE_DATABASE_ID = process.env.NOTION_SITE_DATABASE_ID;

  if (!NOTION_API_KEY || !NOTION_SITE_DATABASE_ID) {
    console.log('⚠️  NOTION_API_KEY or NOTION_SITE_DATABASE_ID not found, skipping OG image download');
    return null;
  }

  try {
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

    if (!data.results || data.results.length === 0) {
      console.log('⚠️  No site configuration found in Notion');
      return null;
    }

    const page = data.results[0];
    const ogImageProperty = page.properties['OGImage'] || page.properties['ogImage'];

    if (!ogImageProperty || !ogImageProperty.files || ogImageProperty.files.length === 0) {
      console.log('⚠️  No OG Image found in Notion Site configuration');
      return null;
    }

    const ogImageFile = ogImageProperty.files[0];
    const ogImageUrl = ogImageFile.file?.url || ogImageFile.external?.url;

    if (!ogImageUrl) {
      console.log('⚠️  OG Image URL is empty');
      return null;
    }

    return ogImageUrl;
  } catch (error) {
    console.error('❌ Error fetching OG Image from Notion:', error.message);
    return null;
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🚀 Starting OG Image download...\n');

  // public/og-images 디렉토리 생성
  ensureDirectoryExists(OG_IMAGES_DIR);

  // Notion에서 OG Image URL 가져오기
  const ogImageUrl = await getOgImageUrl();

  if (!ogImageUrl) {
    console.log('⚠️  No OG Image to download, skipping...');
    return;
  }

  console.log(`📥 Downloading OG Image from Notion...`);
  console.log(`   URL: ${ogImageUrl.substring(0, 100)}...`);

  // 파일 확장자 추출 (기본값: .jpg)
  const urlWithoutQuery = ogImageUrl.split('?')[0];
  const ext = path.extname(urlWithoutQuery) || '.jpg';
  const filename = `default${ext}`;
  const filepath = path.join(OG_IMAGES_DIR, filename);

  try {
    await downloadImage(ogImageUrl, filepath);
    console.log(`✅ OG Image downloaded successfully!`);
    console.log(`   Saved to: ${path.relative(process.cwd(), filepath)}`);

    // 파일 크기 확인
    const stats = fs.statSync(filepath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   File size: ${fileSizeKB} KB`);
  } catch (error) {
    console.error(`❌ Failed to download OG Image: ${error.message}`);
    process.exit(1);
  }

  console.log('\n✨ OG Image download completed!\n');
}

main();
