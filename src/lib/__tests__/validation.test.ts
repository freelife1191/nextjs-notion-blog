/**
 * Validation Schemas Tests
 *
 * Zod 스키마 검증 테스트
 *
 * 테스트 범위:
 * - 각 Zod 스키마의 유효한 데이터 검증
 * - 각 Zod 스키마의 무효한 데이터 검증
 * - validateData 헬퍼 함수
 * - validateDataWithFallback 헬퍼 함수
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  TagWithColorSchema,
  SocialLinksSchema,
  PostListItemSchema,
  BlockObjectResponseSchema,
  PostDetailSchema,
  ProfileSettingsSchema,
  SiteConfigSchema,
  AboutPageSchema,
  validateData,
  validateDataWithFallback,
} from '../validation'
import { logger } from '../logger'

describe('Validation Schemas', () => {
  describe('TagWithColorSchema', () => {
    it('should validate valid tag with color', () => {
      const data = { name: 'typescript', color: 'blue' }
      const result = TagWithColorSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should use default color when not provided', () => {
      const data = { name: 'typescript' }
      const result = TagWithColorSchema.parse(data)

      expect(result).toEqual({ name: 'typescript', color: 'default' })
    })

    it('should reject empty tag name', () => {
      const data = { name: '', color: 'blue' }
      expect(() => TagWithColorSchema.parse(data)).toThrow('Tag name cannot be empty')
    })

    it('should reject missing tag name', () => {
      const data = { color: 'blue' }
      expect(() => TagWithColorSchema.parse(data)).toThrow()
    })
  })

  describe('SocialLinksSchema', () => {
    it('should validate valid social links', () => {
      const data = {
        github: 'https://github.com/username',
        twitter: 'https://twitter.com/username',
        email: 'user@example.com',
      }
      const result = SocialLinksSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should accept empty strings', () => {
      const data = {
        github: '',
        twitter: '',
        email: '',
      }
      const result = SocialLinksSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should accept all social link types', () => {
      const data = {
        kakaoChannel: 'https://pf.kakao.com/channel',
        kakao: 'https://open.kakao.com/profile',
        instagram: 'https://instagram.com/username',
        blog: 'https://blog.example.com',
        email: 'user@example.com',
        github: 'https://github.com/username',
        twitter: 'https://twitter.com/username',
        youtube: 'https://youtube.com/channel',
        linkedin: 'https://linkedin.com/in/username',
        threads: 'https://threads.net/username',
        facebook: 'https://facebook.com/username',
        tiktok: 'https://tiktok.com/@username',
        telegram: 'https://t.me/username',
        line: 'https://line.me/ti/p/username',
      }
      const result = SocialLinksSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject invalid URLs', () => {
      const data = {
        github: 'not-a-url',
      }
      expect(() => SocialLinksSchema.parse(data)).toThrow()
    })

    it('should reject invalid email format', () => {
      const data = {
        email: 'not-an-email',
      }
      expect(() => SocialLinksSchema.parse(data)).toThrow()
    })
  })

  describe('PostListItemSchema', () => {
    it('should validate valid post list item', () => {
      const data = {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-15T00:00:00Z',
        tags: ['typescript', 'testing'],
        tagsWithColors: [
          { name: 'typescript', color: 'blue' },
          { name: 'testing', color: 'green' },
        ],
        label: 'Featured',
        description: 'A test post',
        coverImageUrl: 'https://example.com/cover.jpg',
        language: 'ko',
        author: 'John Doe',
        status: 'Publish',
        statusColor: 'green',
      }
      const result = PostListItemSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should validate minimal post list item', () => {
      const data = {
        slug: 'minimal-post',
        title: 'Minimal Post',
      }
      const result = PostListItemSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject empty slug', () => {
      const data = {
        slug: '',
        title: 'Test',
      }
      expect(() => PostListItemSchema.parse(data)).toThrow('Slug is required')
    })

    it('should reject empty title', () => {
      const data = {
        slug: 'test',
        title: '',
      }
      expect(() => PostListItemSchema.parse(data)).toThrow('Title is required')
    })

    it('should reject invalid date format', () => {
      const data = {
        slug: 'test',
        title: 'Test',
        date: '2025-01-15', // Not a datetime string
      }
      expect(() => PostListItemSchema.parse(data)).toThrow()
    })

    it('should reject invalid cover image URL', () => {
      const data = {
        slug: 'test',
        title: 'Test',
        coverImageUrl: 'not-a-url',
      }
      expect(() => PostListItemSchema.parse(data)).toThrow()
    })
  })

  describe('BlockObjectResponseSchema', () => {
    it('should validate valid block object', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Hello' } }],
        },
      }
      const result = BlockObjectResponseSchema.parse(data)

      expect(result.id).toBe(data.id)
      expect(result.type).toBe(data.type)
    })

    it('should allow additional properties (passthrough)', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'Title' } }],
        },
        has_children: false,
        archived: false,
      }
      const result = BlockObjectResponseSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject invalid UUID format', () => {
      const data = {
        id: 'not-a-uuid',
        type: 'paragraph',
      }
      expect(() => BlockObjectResponseSchema.parse(data)).toThrow()
    })

    it('should reject missing type', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      }
      expect(() => BlockObjectResponseSchema.parse(data)).toThrow()
    })
  })

  describe('PostDetailSchema', () => {
    it('should validate valid post detail', () => {
      const data = {
        slug: 'test-post',
        title: 'Test Post',
        html: '<p>Content</p>',
        content: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'paragraph',
          },
        ],
      }
      const result = PostDetailSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should validate post detail with all fields', () => {
      const data = {
        slug: 'detailed-post',
        title: 'Detailed Post',
        date: '2025-01-15T00:00:00Z',
        tags: ['test'],
        tagsWithColors: [{ name: 'test', color: 'default' }],
        label: 'Featured',
        description: 'Description',
        coverImageUrl: 'https://example.com/cover.jpg',
        language: 'ko',
        author: 'Author',
        status: 'Publish',
        statusColor: 'green',
        html: '<h1>Title</h1><p>Content</p>',
        content: [
          { id: '123e4567-e89b-12d3-a456-426614174000', type: 'heading_1' },
          { id: '234e5678-e89b-12d3-a456-426614174001', type: 'paragraph' },
        ],
      }
      const result = PostDetailSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject missing html', () => {
      const data = {
        slug: 'test',
        title: 'Test',
        content: [],
      }
      expect(() => PostDetailSchema.parse(data)).toThrow()
    })

    it('should reject missing content', () => {
      const data = {
        slug: 'test',
        title: 'Test',
        html: '<p>Test</p>',
      }
      expect(() => PostDetailSchema.parse(data)).toThrow()
    })
  })

  describe('ProfileSettingsSchema', () => {
    it('should validate valid profile settings', () => {
      const data = {
        name: 'John Doe',
        profileImage: 'https://example.com/profile.jpg',
        jobTitle: 'Software Engineer',
        bio: 'Full-stack developer',
        homeTitle: 'Welcome',
        homeDescription: 'My personal blog',
        socialLinks: {
          github: 'https://github.com/johndoe',
          email: 'john@example.com',
        },
      }
      const result = ProfileSettingsSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should validate minimal profile settings', () => {
      const data = {
        name: 'John Doe',
        homeTitle: 'Welcome',
        homeDescription: 'My blog',
        socialLinks: {},
      }
      const result = ProfileSettingsSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject empty name', () => {
      const data = {
        name: '',
        homeTitle: 'Welcome',
        homeDescription: 'My blog',
        socialLinks: {},
      }
      expect(() => ProfileSettingsSchema.parse(data)).toThrow('Name is required')
    })

    it('should reject empty homeTitle', () => {
      const data = {
        name: 'John',
        homeTitle: '',
        homeDescription: 'My blog',
        socialLinks: {},
      }
      expect(() => ProfileSettingsSchema.parse(data)).toThrow('Home title is required')
    })

    it('should reject empty homeDescription', () => {
      const data = {
        name: 'John',
        homeTitle: 'Welcome',
        homeDescription: '',
        socialLinks: {},
      }
      expect(() => ProfileSettingsSchema.parse(data)).toThrow('Home description is required')
    })

    it('should reject invalid profile image URL', () => {
      const data = {
        name: 'John',
        profileImage: 'not-a-url',
        homeTitle: 'Welcome',
        homeDescription: 'My blog',
        socialLinks: {},
      }
      expect(() => ProfileSettingsSchema.parse(data)).toThrow()
    })
  })

  describe('SiteConfigSchema', () => {
    it('should validate valid site config', () => {
      const data = {
        siteTitle: 'My Blog',
        siteDescription: 'A personal blog about tech',
        ga4MeasurementId: 'G-ABCD123456',
        enableAnalytics: true,
        adsensePublisherId: 'ca-pub-1234567890',
        enableAdsense: true,
        adsenseAutoAds: false,
      }
      const result = SiteConfigSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should validate minimal site config', () => {
      const data = {
        siteTitle: 'Blog',
        siteDescription: 'Description',
      }
      const result = SiteConfigSchema.parse(data)

      expect(result).toEqual({
        ...data,
        enableAnalytics: false,
        enableAdsense: false,
        adsenseAutoAds: false,
      })
    })

    it('should reject empty site title', () => {
      const data = {
        siteTitle: '',
        siteDescription: 'Description',
      }
      expect(() => SiteConfigSchema.parse(data)).toThrow('Site title is required')
    })

    it('should reject empty site description', () => {
      const data = {
        siteTitle: 'Blog',
        siteDescription: '',
      }
      expect(() => SiteConfigSchema.parse(data)).toThrow('Site description is required')
    })

    it('should reject invalid GA4 measurement ID format', () => {
      const data = {
        siteTitle: 'Blog',
        siteDescription: 'Description',
        ga4MeasurementId: 'INVALID-FORMAT',
      }
      expect(() => SiteConfigSchema.parse(data)).toThrow('Invalid GA4 measurement ID format')
    })

    it('should accept valid GA4 measurement ID formats', () => {
      const validIds = ['G-ABCD123456', 'G-ABC123', 'G-1234567890']

      validIds.forEach((id) => {
        const data = {
          siteTitle: 'Blog',
          siteDescription: 'Description',
          ga4MeasurementId: id,
        }
        const result = SiteConfigSchema.parse(data)
        expect(result.ga4MeasurementId).toBe(id)
      })
    })

    it('should reject invalid AdSense publisher ID format', () => {
      const data = {
        siteTitle: 'Blog',
        siteDescription: 'Description',
        adsensePublisherId: 'INVALID-FORMAT',
      }
      expect(() => SiteConfigSchema.parse(data)).toThrow('Invalid AdSense publisher ID format')
    })

    it('should accept valid AdSense publisher ID format', () => {
      const data = {
        siteTitle: 'Blog',
        siteDescription: 'Description',
        adsensePublisherId: 'ca-pub-1234567890123456',
      }
      const result = SiteConfigSchema.parse(data)
      expect(result.adsensePublisherId).toBe('ca-pub-1234567890123456')
    })
  })

  describe('AboutPageSchema', () => {
    it('should validate valid about page', () => {
      const data = {
        title: 'About Me',
        html: '<h1>About</h1><p>Content</p>',
        content: [
          { id: '123e4567-e89b-12d3-a456-426614174000', type: 'heading_1' },
          { id: '234e5678-e89b-12d3-a456-426614174001', type: 'paragraph' },
        ],
      }
      const result = AboutPageSchema.parse(data)

      expect(result).toEqual(data)
    })

    it('should reject empty title', () => {
      const data = {
        title: '',
        html: '<p>Content</p>',
        content: [],
      }
      expect(() => AboutPageSchema.parse(data)).toThrow('Title is required')
    })

    it('should reject missing html', () => {
      const data = {
        title: 'About',
        content: [],
      }
      expect(() => AboutPageSchema.parse(data)).toThrow()
    })

    it('should reject missing content', () => {
      const data = {
        title: 'About',
        html: '<p>Content</p>',
      }
      expect(() => AboutPageSchema.parse(data)).toThrow()
    })
  })
})

describe('Helper Functions', () => {
  describe('validateData', () => {
    it('should validate and return data when valid', () => {
      const data = { name: 'typescript', color: 'blue' }
      const result = validateData(TagWithColorSchema, data, 'test tag')

      expect(result).toEqual(data)
    })

    it('should throw error with context when invalid', () => {
      const data = { name: '', color: 'blue' }

      expect(() => validateData(TagWithColorSchema, data, 'tag validation')).toThrow(
        'Validation failed for tag validation'
      )
    })

    it('should include detailed error messages', () => {
      const data = {
        slug: '',
        title: '',
      }

      expect(() => validateData(PostListItemSchema, data, 'post')).toThrow('Slug is required')
      expect(() => validateData(PostListItemSchema, data, 'post')).toThrow('Title is required')
    })

    it('should handle multiple validation errors', () => {
      const data = {
        siteTitle: '',
        siteDescription: '',
        ga4MeasurementId: 'INVALID',
      }

      try {
        validateData(SiteConfigSchema, data, 'site config')
        expect.fail('Should have thrown error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toContain('Validation failed for site config')
      }
    })
  })

  describe('validateDataWithFallback', () => {
    let loggerWarnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      loggerWarnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      loggerWarnSpy.mockRestore()
    })

    it('should return validated data when valid', () => {
      const data = { name: 'typescript', color: 'blue' }
      const fallback = { name: 'fallback', color: 'default' }
      const result = validateDataWithFallback(TagWithColorSchema, data, fallback, 'test tag')

      expect(result).toEqual(data)
      expect(loggerWarnSpy).not.toHaveBeenCalled()
    })

    it('should return fallback and warn when invalid', () => {
      const data = { name: '', color: 'blue' }
      const fallback = { name: 'fallback', color: 'default' }
      const result = validateDataWithFallback(TagWithColorSchema, data, fallback, 'test tag')

      expect(result).toEqual(fallback)
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Validation warning for test tag')
      )
    })

    it('should include error details in warning message', () => {
      const data = { name: '', color: 'blue' }
      const fallback = { name: 'fallback', color: 'default' }

      validateDataWithFallback(TagWithColorSchema, data, fallback, 'tag validation')

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Tag name cannot be empty')
      )
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using fallback data')
      )
    })

    it('should handle complex fallback objects', () => {
      const data = {
        siteTitle: '',
        siteDescription: '',
      }
      const fallback = {
        siteTitle: 'Default Blog',
        siteDescription: 'Default Description',
        enableAnalytics: false,
        enableAdsense: false,
        adsenseAutoAds: false,
      }

      const result = validateDataWithFallback(SiteConfigSchema, data, fallback, 'site config')

      expect(result).toEqual(fallback)
      expect(loggerWarnSpy).toHaveBeenCalled()
    })
  })
})
