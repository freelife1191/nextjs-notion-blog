#!/usr/bin/env node

/**
 * Site Settings 데이터베이스 진단 스크립트
 *
 * 실행 방법:
 * node scripts/test-site-config.mjs
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 로드
config({ path: join(__dirname, '../.env.local') });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_SITE_DATABASE_ID = process.env.NOTION_SITE_DATABASE_ID;

console.log('='.repeat(60));
console.log('🔍 Notion Site Settings 진단 시작');
console.log('='.repeat(60));
console.log();

// 1. 환경 변수 확인
console.log('📋 1. 환경 변수 확인');
console.log(`NOTION_API_KEY: ${NOTION_API_KEY ? '✅ 설정됨' : '❌ 없음'} (길이: ${NOTION_API_KEY?.length || 0})`);
console.log(`NOTION_SITE_DATABASE_ID: ${NOTION_SITE_DATABASE_ID ? '✅ 설정됨' : '❌ 없음'}`);
console.log(`  값: ${NOTION_SITE_DATABASE_ID}`);
console.log();

if (!NOTION_API_KEY || !NOTION_SITE_DATABASE_ID) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  process.exit(1);
}

// 2. Notion API 호출
console.log('📡 2. Notion API 호출 중...');
try {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_SITE_DATABASE_ID}/query`,
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
  );

  console.log(`응답 상태: ${response.status} ${response.statusText}`);
  console.log();

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API 호출 실패:');
    console.error(errorText);
    process.exit(1);
  }

  const data = await response.json();

  // 3. 데이터 구조 확인
  console.log('📊 3. 데이터베이스 응답 분석');
  console.log(`결과 수: ${data.results?.length || 0}`);
  console.log();

  if (!data.results || data.results.length === 0) {
    console.error('❌ 데이터베이스에 데이터가 없습니다!');
    console.log('💡 Notion Site Settings 데이터베이스에 최소 1개의 행을 추가하세요.');
    process.exit(1);
  }

  const page = data.results[0];
  const props = page.properties;

  console.log('📝 4. 속성(Properties) 확인');
  console.log('존재하는 속성 목록:');
  Object.keys(props).forEach(key => {
    const prop = props[key];
    console.log(`  - ${key} (타입: ${prop.type})`);
  });
  console.log();

  // 5. 필수 필드 확인
  console.log('✅ 5. 필수 필드 값 확인');

  const getPlainText = (richText) => {
    if (!richText || !Array.isArray(richText)) return '';
    return richText.map(t => t.plain_text).join('');
  };

  // SiteTitle은 title 타입 필드 (데이터베이스 이름 열)
  const siteTitle = props.SiteTitle?.title ? getPlainText(props.SiteTitle.title) : undefined;
  const siteDescription = props.SiteDescription?.rich_text ? getPlainText(props.SiteDescription.rich_text) : undefined;
  const ogImage = props.OGImage?.files?.[0]?.file?.url || props.OGImage?.files?.[0]?.external?.url;
  const twitterHandle = props.TwitterHandle?.rich_text ? getPlainText(props.TwitterHandle.rich_text) : undefined;
  const author = props.Author?.people?.[0]?.name || (props.Author?.rich_text ? getPlainText(props.Author.rich_text) : undefined);

  const ga4MeasurementId = props.GA4MeasurementId?.rich_text ? getPlainText(props.GA4MeasurementId.rich_text) : undefined;
  const enableAnalytics = props.EnableAnalytics?.checkbox;

  const adsensePublisherId = props.AdSensePublisherId?.rich_text ? getPlainText(props.AdSensePublisherId.rich_text) : undefined;
  const enableAdsense = props.EnableAdSense?.checkbox;
  const adsenseAutoAds = props.AdSenseAutoAds?.checkbox;

  console.log('기본 설정:');
  console.log(`  SiteTitle: ${siteTitle ? `✅ "${siteTitle}"` : '❌ 비어있음'}`);
  console.log(`  SiteDescription: ${siteDescription ? `✅ "${siteDescription}"` : '❌ 비어있음'}`);
  console.log();

  console.log('SEO 설정:');
  console.log(`  OGImage: ${ogImage ? `✅ ${ogImage.substring(0, 50)}...` : '❌ 없음'}`);
  console.log(`  TwitterHandle: ${twitterHandle ? `✅ "${twitterHandle}"` : '❌ 없음'}`);
  console.log(`  Author: ${author ? `✅ "${author}"` : '❌ 없음'}`);
  console.log();

  console.log('Google Analytics 설정:');
  console.log(`  GA4MeasurementId: ${ga4MeasurementId ? `✅ "${ga4MeasurementId}"` : '❌ 비어있음'}`);
  console.log(`  EnableAnalytics: ${enableAnalytics ? '✅ 체크됨' : '❌ 체크 안 됨'}`);
  console.log();

  console.log('Google AdSense 설정:');
  console.log(`  AdSensePublisherId: ${adsensePublisherId ? `✅ "${adsensePublisherId}"` : '❌ 비어있음'}`);
  console.log(`  EnableAdSense: ${enableAdsense ? '✅ 체크됨' : '❌ 체크 안 됨'}`);
  console.log(`  AdSenseAutoAds: ${adsenseAutoAds ? '✅ 체크됨' : '❌ 체크 안 됨'}`);
  console.log();

  // 6. 최종 설정 객체
  console.log('🎯 6. 최종 설정 객체 (getSiteConfig가 반환할 값)');
  const config = {
    siteTitle: siteTitle || '사이트 설정 DB의 SiteTitle 속성을 설정하세요',
    siteDescription: siteDescription || '사이트 설정 DB의 SiteDescription 속성을 설정하세요',
    ogImage,
    twitterHandle,
    author,
    ga4MeasurementId,
    enableAnalytics: enableAnalytics ?? false,
    adsensePublisherId,
    enableAdsense: enableAdsense ?? false,
    adsenseAutoAds: adsenseAutoAds ?? false,
  };

  console.log(JSON.stringify(config, null, 2));
  console.log();

  // 7. 문제 진단
  console.log('🔧 7. 문제 진단');
  const issues = [];

  if (!siteTitle) {
    issues.push('❌ SiteTitle이 비어있습니다 → Notion에서 SiteTitle 필드에 값을 입력하세요');
  }
  if (!siteDescription) {
    issues.push('❌ SiteDescription이 비어있습니다 → Notion에서 SiteDescription 필드에 값을 입력하세요');
  }
  if (ga4MeasurementId && !enableAnalytics) {
    issues.push('⚠️  GA4MeasurementId는 있지만 EnableAnalytics가 체크되지 않았습니다');
  }
  if (adsensePublisherId && !enableAdsense) {
    issues.push('⚠️  AdSensePublisherId는 있지만 EnableAdSense가 체크되지 않았습니다');
  }

  if (issues.length === 0) {
    console.log('✅ 모든 설정이 정상입니다!');
  } else {
    console.log('발견된 문제:');
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  console.log();

  console.log('='.repeat(60));
  console.log('✅ 진단 완료');
  console.log('='.repeat(60));

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  console.error(error.stack);
  process.exit(1);
}
