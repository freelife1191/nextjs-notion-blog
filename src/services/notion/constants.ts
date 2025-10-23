/**
 * Notion API 상수 및 설정
 *
 * 하드코딩된 값들을 중앙화하여 유지보수성을 향상시킵니다.
 */

/**
 * Notion API 기본 설정
 */
export const NOTION_CONFIG = {
  /** Notion API 버전 */
  API_VERSION: '2022-06-28',
  /** Notion API 기본 URL */
  BASE_URL: 'https://api.notion.com/v1',
} as const

/**
 * Notion API 엔드포인트 생성 함수
 */
export const NOTION_ENDPOINTS = {
  /** 데이터베이스 쿼리 엔드포인트 */
  databaseQuery: (databaseId: string) => `databases/${databaseId}/query`,
  /** 데이터베이스 조회 엔드포인트 */
  database: (databaseId: string) => `databases/${databaseId}`,
  /** 페이지 조회 엔드포인트 */
  page: (pageId: string) => `pages/${pageId}`,
  /** 블록 자식 조회 엔드포인트 */
  blockChildren: (blockId: string) => `blocks/${blockId}/children`,
} as const

/**
 * 캐시 TTL (Time To Live) 설정 (밀리초)
 */
export const CACHE_TTL = {
  /** 기본 TTL (10분) */
  DEFAULT: 10 * 60 * 1000,
  /** 포스트 목록 TTL (10분) */
  POSTS_LIST: 10 * 60 * 1000,
  /** 포스트 상세 TTL (10분) */
  POST_DETAIL: 10 * 60 * 1000,
  /** 사이트 설정 TTL (60분) */
  SITE_SETTINGS: 60 * 60 * 1000,
  /** 데이터베이스 스키마 TTL (60분) */
  DATABASE_SCHEMA: 60 * 60 * 1000,
  /** YouTube 정보 TTL (60분) */
  YOUTUBE_INFO: 60 * 60 * 1000,
  /** 렌더링된 콘텐츠 TTL (10분) */
  RENDERED_CONTENT: 10 * 60 * 1000,
} as const

/**
 * 페이지네이션 설정
 */
export const PAGINATION = {
  /** 페이지당 포스트 수 */
  POSTS_PER_PAGE: 4,
  /** Notion API 최대 페이지 크기 */
  MAX_PAGE_SIZE: 100,
} as const

/**
 * 재시도 설정
 */
export const RETRY_CONFIG = {
  /** 최대 재시도 횟수 */
  MAX_RETRIES: 3,
  /** 기본 지연 시간 (밀리초) */
  BASE_DELAY: 1000,
  /** 지수 백오프 승수 */
  BACKOFF_MULTIPLIER: 2,
} as const
