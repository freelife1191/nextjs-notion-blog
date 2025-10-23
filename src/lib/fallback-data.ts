/**
 * Fallback data for build-time failures
 * Notion API 실패 시 사용할 폴백 데이터
 */

/**
 * 더미 포스트 슬러그 목록
 * generateStaticParams에서 Notion API 실패 시 사용
 */
export const FALLBACK_POST_SLUGS = [
  'comprehensive-notion-blocks-guide',
  'advanced-web-development-techniques',
  'ui-ux-design-principles',
  'database-design-best-practices',
  'mobile-app-development-trends',
  'ai-integration-web-applications',
  'cybersecurity-web-development',
] as const

/**
 * 기본 포스트 데이터
 * 개발 환경에서 Notion API 없이 테스트할 때 사용
 */
export const FALLBACK_POST = {
  title: 'Coming Soon',
  description: '블로그 포스트를 준비 중입니다.',
  author: 'Blog Author',
  date: new Date().toISOString(),
  tags: ['Blog', 'Development'],
  label: 'Tech',
  slug: 'coming-soon',
  coverImageUrl: undefined,
  html: '<p>블로그 포스트를 준비 중입니다.</p>',
  content: [],
}

/**
 * 에러 폴백 페이지 데이터
 */
export const ERROR_FALLBACK = {
  title: '포스트를 불러올 수 없습니다',
  description: 'Notion에서 포스트를 불러오는 중 오류가 발생했습니다.',
  message: 'Notion API에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
}
