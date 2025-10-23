/**
 * 환경변수 검증 및 타입 안전성 보장
 * Zod를 사용하여 애플리케이션 시작 시 환경변수를 검증합니다.
 */

import { z } from 'zod'

/**
 * 환경변수 스키마 정의
 * - NODE_ENV: 환경 (development, production, test)
 * - NOTION_API_KEY: Notion API 인증 키 (필수)
 * - NOTION_DATABASE_ID: 포스트 데이터베이스 ID (필수)
 * - NOTION_PROFILE_DATABASE_ID: 프로필 설정 데이터베이스 ID (선택)
 * - NOTION_SITE_DATABASE_ID: 사이트 설정 데이터베이스 ID (선택)
 * - NOTION_ABOUT_PAGE_ID: About 페이지 ID (선택)
 * - NOTION_WEBHOOK_SECRET: Webhook 서명 검증용 (선택)
 * - GITHUB_TOKEN: GitHub API 토큰 (선택)
 * - GITHUB_REPO: GitHub 저장소 (선택)
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
  NOTION_PROFILE_DATABASE_ID: z.string().optional(),
  NOTION_SITE_DATABASE_ID: z.string().optional(),
  NOTION_ABOUT_PAGE_ID: z.string().optional(),
  NOTION_WEBHOOK_SECRET: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_REPO: z.string().optional(),
})

/**
 * 환경변수 타입 추론
 */
export type Env = z.infer<typeof envSchema>

/**
 * 검증된 환경변수
 *
 * 애플리케이션 시작 시 즉시 검증되며, 검증 실패 시 명확한 에러 메시지와 함께 종료됩니다.
 *
 * @example
 * ```ts
 * import { env } from '@/lib/env'
 *
 * const apiKey = env.NOTION_API_KEY // string (타입 안전)
 * const webhook = env.NOTION_WEBHOOK_SECRET // string | undefined
 * ```
 */
export const env = envSchema.parse(process.env)

/**
 * 레거시 호환성을 위한 헬퍼 함수
 * @deprecated 직접 `env` 객체를 사용하세요
 */
export function getEnv(key: 'NOTION_API_KEY' | 'NOTION_DATABASE_ID'): string {
  return env[key]
}

/**
 * 레거시 호환성을 위한 헬퍼 함수
 * @deprecated 직접 `env` 객체를 사용하세요
 */
export function getEnvOptional(key: 'NOTION_PROFILE_DATABASE_ID' | 'NOTION_SITE_DATABASE_ID'): string | undefined {
  return env[key]
}

/**
 * 레거시 호환성을 위한 헬퍼 함수
 * @deprecated 직접 `env` 객체를 사용하세요
 */
export function getOptionalEnv(key: string, fallback?: string): string | undefined {
  const value = env[key as keyof Env]
  if (value && typeof value === 'string' && value.trim().length > 0) return value
  return fallback
}
