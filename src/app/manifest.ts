import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const isDev = process.env.NODE_ENV === 'development'
const basePath = isDev ? '' : '/nextjs-notion-blog'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Notion Blog',
    short_name: 'Blog',
    description: 'Notion으로 관리하는 개인 블로그',
    start_url: basePath + '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: basePath + '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
