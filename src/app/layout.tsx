import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleAdSense } from "@/components/GoogleAdSense";
import { getSiteSettingsMemo, getSiteConfigMemo } from "@/lib/request-memo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfigMemo();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-username.github.io';

  return {
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    icons: {
      icon: '/favicon.ico',
      apple: '/favicon.ico', // Use favicon for apple icon to prevent 404
    },
    // Fix Notion S3 image CORS errors by setting referrer policy
    referrer: 'no-referrer',
    openGraph: {
      title: siteConfig.siteTitle,
      description: siteConfig.siteDescription,
      url: siteUrl,
      siteName: siteConfig.siteTitle,
      images: siteConfig.ogImage ? [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.siteTitle,
        },
      ] : undefined,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.siteTitle,
      description: siteConfig.siteDescription,
      images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      types: {
        'application/rss+xml': '/rss.xml',
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Notion에서 설정 가져오기
  const settings = await getSiteSettingsMemo();
  const siteConfig = await getSiteConfigMemo();

  // 프로필 데이터 변환
  const profile = {
    name: settings.name,
    photoUrl: settings.profileImage,
    bio: settings.bio,
    jobTitle: settings.jobTitle,
    socialLinks: settings.socialLinks,
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Analytics - Notion 설정에 따라 조건부 렌더링 */}
        {siteConfig.enableAnalytics && siteConfig.ga4MeasurementId && (
          <GoogleAnalytics measurementId={siteConfig.ga4MeasurementId} />
        )}

        {/* Google AdSense - afterInteractive 전략으로 최적화 */}
        {siteConfig.enableAdsense && siteConfig.adsensePublisherId && (
          <GoogleAdSense publisherId={siteConfig.adsensePublisherId} />
        )}

        <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <div className="mx-auto max-w-2xl sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
                {/* 좌측 사이드바 영역 */}
                <aside className="lg:col-span-4 xl:col-span-4 lg:pr-8 xl:pr-12 relative">
                  {/* 스타일리쉬한 세로선 - 프로필부터 copyright까지 */}
                  <div className="hidden lg:block absolute right-0 top-12 w-px h-[calc(100%-6rem)] bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                  <div className="sticky top-4 pt-4">
                    <ProfileSidebar
                      profile={profile}
                      adsensePublisherId={siteConfig.enableAdsense ? siteConfig.adsensePublisherId : undefined}
                    />
                  </div>
                </aside>

                {/* 우측 메인 콘텐츠 영역 */}
                <main className="lg:col-span-8 xl:col-span-8">
                  {children}
                  <SiteFooter />
                </main>
              </div>
            </div>

            {/* 모바일 메뉴 */}
            <MobileMenu />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
