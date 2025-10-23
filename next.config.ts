import type { NextConfig } from "next";

const repoBase = "/nextjs-notion-blog"; // GitHub Pages project path
const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: isDev ? undefined : "export", // 개발 환경에서는 export 비활성화
  images: {
    unoptimized: true, // Static export requires unoptimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Notion CDN uses AWS S3
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion specific
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com', // Notion file uploads
      },
    ],
    // 이미지 포맷 최적화 (브라우저가 지원하는 경우 WebP 사용)
    formats: ['image/webp'],
    // 이미지 크기 사전 정의 (성능 최적화)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
  },
  basePath: isDev ? undefined : repoBase, // 개발 환경에서는 basePath 비활성화
  assetPrefix: isDev ? undefined : repoBase, // 개발 환경에서는 assetPrefix 비활성화
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  // instrumentation.ts가 자동으로 활성화됨 (Next.js 15+)
};

export default nextConfig;
