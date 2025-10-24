/**
 * AdSense 광고 로딩 상태 확인 스크립트
 * GitHub Pages에 배포된 사이트의 AdSense 설정을 확인합니다.
 */

import { chromium } from 'playwright';

const siteUrl = 'https://freelife1191.github.io/nextjs-notion-blog/posts/blog-intro-template-with-media';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`\n🔍 사이트 방문: ${siteUrl}\n`);

  try {
    // 페이지 로드
    await page.goto(siteUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // AdSense 스크립트 로드 대기

    // AdSense 스크립트 확인
    const adsenseScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.find(s => s.src.includes('adsbygoogle.js'))?.src || null;
    });

    console.log('📜 AdSense 스크립트:', adsenseScript ? '✅ 로드됨' : '❌ 없음');
    if (adsenseScript) {
      console.log(`   URL: ${adsenseScript}`);
    }

    // adsbygoogle 전역 변수 확인
    const adsbyGoogleExists = await page.evaluate(() => {
      return typeof window.adsbygoogle !== 'undefined';
    });

    console.log('\n🌐 window.adsbygoogle:', adsbyGoogleExists ? '✅ 존재' : '❌ 없음');

    if (adsbyGoogleExists) {
      const adsbyGoogleLength = await page.evaluate(() => window.adsbygoogle.length);
      console.log(`   배열 길이: ${adsbyGoogleLength}`);
    }

    // 광고 유닛 확인
    const adUnits = await page.evaluate(() => {
      const ads = Array.from(document.querySelectorAll('.adsbygoogle'));
      return ads.map(ad => ({
        client: ad.getAttribute('data-ad-client'),
        slot: ad.getAttribute('data-ad-slot'),
        format: ad.getAttribute('data-ad-format'),
        status: ad.getAttribute('data-adsbygoogle-status'),
        width: ad.offsetWidth,
        height: ad.offsetHeight,
        html: ad.innerHTML.slice(0, 100),
      }));
    });

    console.log(`\n📊 광고 유닛 개수: ${adUnits.length}`);
    adUnits.forEach((ad, index) => {
      console.log(`\n   광고 #${index + 1}:`);
      console.log(`   - Client: ${ad.client}`);
      console.log(`   - Slot: ${ad.slot || '(Auto Ads)'}`);
      console.log(`   - Format: ${ad.format}`);
      console.log(`   - Status: ${ad.status || '(초기화 안됨)'}`);
      console.log(`   - 크기: ${ad.width}x${ad.height}px`);
      console.log(`   - 내용: ${ad.html ? (ad.html.length > 0 ? '있음' : '비어있음') : '비어있음'}`);
    });

    // 콘솔 에러 확인
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('\n⚠️  콘솔 에러:');
      consoleErrors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('\n✅ 콘솔 에러 없음');
    }

    // 스크린샷 저장
    await page.screenshot({
      path: 'tests/debug/adsense-check.png',
      fullPage: true
    });
    console.log('\n📸 스크린샷 저장: tests/debug/adsense-check.png');

    console.log('\n👀 브라우저를 10초간 유지합니다...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('\n❌ 에러 발생:', error.message);
  } finally {
    await browser.close();
  }
})();
