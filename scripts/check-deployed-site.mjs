#!/usr/bin/env node

/**
 * 배포된 사이트의 GA4/AdSense 스크립트 로딩 확인
 */

const SITE_URL = 'https://notionblogsample.github.io/';

console.log('='.repeat(60));
console.log('🌐 배포된 사이트 GA4/AdSense 확인');
console.log('='.repeat(60));
console.log(`사이트 URL: ${SITE_URL}`);
console.log();

try {
  const response = await fetch(SITE_URL);
  const html = await response.text();

  console.log('📊 HTML 분석 결과:');
  console.log();

  // GA4 스크립트 확인
  const hasGtagScript = html.includes('googletagmanager.com/gtag/js');
  const hasGA4Id = html.includes('G-YCDZ0H9VR8');
  const hasDataLayer = html.includes('window.dataLayer');

  console.log('Google Analytics 4:');
  console.log(`  gtag.js 스크립트: ${hasGtagScript ? '✅ 발견' : '❌ 없음'}`);
  console.log(`  Measurement ID (G-YCDZ0H9VR8): ${hasGA4Id ? '✅ 발견' : '❌ 없음'}`);
  console.log(`  dataLayer 초기화: ${hasDataLayer ? '✅ 발견' : '❌ 없음'}`);
  console.log();

  // AdSense 스크립트 확인
  const hasAdSenseScript = html.includes('pagead2.googlesyndication.com');
  const hasAdSenseId = html.includes('ca-pub-4222924715781885') || html.includes('pub-4222924715781885');

  console.log('Google AdSense:');
  console.log(`  AdSense 스크립트: ${hasAdSenseScript ? '✅ 발견' : '❌ 없음'}`);
  console.log(`  Publisher ID: ${hasAdSenseId ? '✅ 발견' : '❌ 없음'}`);
  console.log();

  // 개발 환경 체크 문자열 확인
  const hasDevSkipMessage = html.includes('Skipped in development environment');
  if (hasDevSkipMessage) {
    console.log('⚠️  경고: "Skipped in development environment" 메시지 발견!');
    console.log('    → 프로덕션 빌드인데도 개발 환경으로 인식되고 있을 수 있습니다.');
    console.log();
  }

  // 스크립트 태그 검색
  const scriptMatches = html.match(/<script[^>]*>(.*?)<\/script>/gs) || [];
  const externalScripts = html.match(/<script[^>]*src="([^"]+)"[^>]*>/g) || [];

  console.log(`📝 총 스크립트 태그 수: ${scriptMatches.length + externalScripts.length}`);
  console.log(`   인라인 스크립트: ${scriptMatches.length}`);
  console.log(`   외부 스크립트: ${externalScripts.length}`);
  console.log();

  // GA4 관련 외부 스크립트 찾기
  const gaScripts = externalScripts.filter(s => s.includes('google'));
  if (gaScripts.length > 0) {
    console.log('🔍 Google 관련 스크립트:');
    gaScripts.forEach(s => {
      const match = s.match(/src="([^"]+)"/);
      if (match) console.log(`   - ${match[1]}`);
    });
  } else {
    console.log('❌ Google 관련 외부 스크립트를 찾을 수 없습니다.');
  }
  console.log();

  // 진단
  console.log('='.repeat(60));
  console.log('🔧 진단 결과');
  console.log('='.repeat(60));

  if (!hasGtagScript && !hasAdSenseScript) {
    console.log('❌ GA4와 AdSense 스크립트가 모두 로드되지 않았습니다.');
    console.log();
    console.log('가능한 원인:');
    console.log('1. 클라이언트 컴포넌트에서 process.env.NODE_ENV가 제대로 작동하지 않음');
    console.log('2. 컴포넌트가 조건부로 렌더링되지 않음 (enableAnalytics, enableAdsense false)');
    console.log('3. 빌드 시 환경변수가 설정되지 않음');
    console.log();
    console.log('해결 방법:');
    console.log('1. GitHub Secrets에 NOTION_SITE_DATABASE_ID 등록 확인');
    console.log('2. 개발 환경 체크 로직 수정 (클라이언트 컴포넌트에서 제거)');
  } else if (!hasGtagScript) {
    console.log('❌ GA4 스크립트만 로드되지 않았습니다.');
  } else if (!hasAdSenseScript) {
    console.log('❌ AdSense 스크립트만 로드되지 않았습니다.');
  } else {
    console.log('✅ GA4와 AdSense 스크립트가 정상적으로 로드되었습니다!');
  }
  console.log('='.repeat(60));

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
}
