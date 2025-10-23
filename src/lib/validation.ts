/**
 * Zod validation schemas for Notion API responses
 *
 * Provides runtime type validation to ensure data integrity
 * and catch potential issues early in the data pipeline.
 */

import { z } from 'zod'
import { logger } from '@/lib/logger';

/**
 * Schema for tag with color information
 */
export const TagWithColorSchema = z.object({
  name: z.string().min(1, 'Tag name cannot be empty'),
  color: z.string().default('default'),
})

/**
 * Schema for social links
 */
export const SocialLinksSchema = z.object({
  kakaoChannel: z.string().url().optional().or(z.literal('')),
  kakao: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  blog: z.string().url().optional().or(z.literal('')),
  notion: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  threads: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  telegram: z.string().url().optional().or(z.literal('')),
  line: z.string().url().optional().or(z.literal('')),
})

/**
 * Schema for post list item
 */
export const PostListItemSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  tagsWithColors: z.array(TagWithColorSchema).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  language: z.string().optional(),
  author: z.string().optional(),
  status: z.string().optional(),
  statusColor: z.string().optional(),
})

/**
 * Schema for Notion block object (simplified validation)
 * Full validation of BlockObjectResponse would be very complex,
 * so we just validate the basic structure
 */
export const BlockObjectResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  // Additional properties are validated loosely
}).passthrough()

/**
 * Schema for post detail
 */
export const PostDetailSchema = PostListItemSchema.extend({
  html: z.string(),
  content: z.array(BlockObjectResponseSchema),
})

/**
 * Schema for profile settings (SiteSettings)
 */
export const ProfileSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  profileImage: z.string().url().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().optional(),
  homeTitle: z.string().min(1, 'Home title is required'),
  homeDescription: z.string().min(1, 'Home description is required'),
  socialLinks: SocialLinksSchema,
})

/**
 * Schema for site configuration
 */
export const SiteConfigSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  ga4MeasurementId: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid GA4 measurement ID format').optional(),
  enableAnalytics: z.boolean().default(false),
  adsensePublisherId: z.string().regex(/^ca-pub-[0-9]+$/, 'Invalid AdSense publisher ID format').optional(),
  enableAdsense: z.boolean().default(false),
  adsenseAutoAds: z.boolean().default(false),
})

/**
 * Schema for about page
 */
export const AboutPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  html: z.string(),
  content: z.array(BlockObjectResponseSchema),
})

// Export inferred types
export type TagWithColor = z.infer<typeof TagWithColorSchema>
export type SocialLinks = z.infer<typeof SocialLinksSchema>
export type PostListItem = z.infer<typeof PostListItemSchema>
export type PostDetail = z.infer<typeof PostDetailSchema>
export type ProfileSettings = z.infer<typeof ProfileSettingsSchema>
export type SiteConfig = z.infer<typeof SiteConfigSchema>
export type AboutPage = z.infer<typeof AboutPageSchema>

/**
 * Helper function to validate data with better error messages
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map((err: z.ZodIssue) =>
      `${err.path.join('.')}: ${err.message}`
    ).join(', ')

    throw new Error(`Validation failed for ${context}: ${errors}`)
  }

  return result.data
}

/**
 * Helper function to validate data with fallback
 */
export function validateDataWithFallback<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T,
  context: string
): T {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map((err: z.ZodIssue) =>
      `${err.path.join('.')}: ${err.message}`
    ).join(', ')

    logger.warn(`Validation warning for ${context}: ${errors}. Using fallback data.`)
    return fallback
  }

  return result.data
}
