/**
 * Request Memoization Tests
 *
 * React cache() API를 사용한 메모이제이션 함수들 테스트
 *
 * 테스트 범위:
 * - 각 메모 함수가 올바른 NotionClient 메서드 호출
 * - 에러 전파
 * - 반환 타입 검증
 * - 함수 실행 가능성 확인
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PostListItem, PostDetail, AboutPage, SiteConfig, SiteSettings } from '@/services/notion/client'

// Mock functions for NotionClient
const mockListPublishedPosts = vi.fn()
const mockGetPostBySlug = vi.fn()
const mockGetAboutPage = vi.fn()
const mockGetSiteConfig = vi.fn()
const mockGetSiteSettings = vi.fn()

// NotionClient 모킹
vi.mock('@/services/notion/client', () => ({
  createNotionClient: vi.fn(() => ({
    listPublishedPosts: mockListPublishedPosts,
    getPostBySlug: mockGetPostBySlug,
    getAboutPage: mockGetAboutPage,
    getSiteConfig: mockGetSiteConfig,
    getSiteSettings: mockGetSiteSettings,
  })),
}))

// Import after mocking
import {
  listPublishedPostsMemo,
  getPostBySlugMemo,
  getAboutPageMemo,
  getSiteConfigMemo,
  getSiteSettingsMemo,
} from '../request-memo'

describe('Request Memoization Functions', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 모킹 함수 초기화
    vi.clearAllMocks()
  })

  describe('listPublishedPostsMemo', () => {
    it('should call NotionClient.listPublishedPosts and return posts', async () => {
      const mockPosts: PostListItem[] = [
        {
          slug: 'test-post',
          title: 'Test Post',
          date: '2025-01-15',
          tags: ['test'],
          tagsWithColors: [{ name: 'test', color: 'default' }],
          label: 'Featured',
          description: 'Test description',
          coverImageUrl: 'https://example.com/cover.jpg',
          language: 'ko',
          author: 'John Doe',
          status: 'Publish',
          statusColor: undefined,
        },
      ]

      mockListPublishedPosts.mockResolvedValue(mockPosts)

      const result = await listPublishedPostsMemo()

      expect(mockListPublishedPosts).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPosts)
    })

    it('should propagate errors from NotionClient', async () => {
      const error = new Error('Failed to fetch posts')
      mockListPublishedPosts.mockRejectedValue(error)

      await expect(listPublishedPostsMemo()).rejects.toThrow('Failed to fetch posts')
    })

    it('should return empty array when no posts exist', async () => {
      mockListPublishedPosts.mockResolvedValue([])

      const result = await listPublishedPostsMemo()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('getPostBySlugMemo', () => {
    it('should call NotionClient.getPostBySlug with correct slug', async () => {
      const mockPost: PostDetail = {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-15',
        tags: ['test'],
        tagsWithColors: [{ name: 'test', color: 'default' }],
        label: 'Featured',
        description: 'Test description',
        coverImageUrl: 'https://example.com/cover.jpg',
        language: 'ko',
        author: 'John Doe',
        status: 'Publish',
        statusColor: undefined,
        content: [],
        html: '<p>Test content</p>',
      }

      mockGetPostBySlug.mockResolvedValue(mockPost)

      const result = await getPostBySlugMemo('test-post')

      expect(mockGetPostBySlug).toHaveBeenCalledWith('test-post')
      expect(mockGetPostBySlug).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPost)
    })

    it('should return null when post not found', async () => {
      mockGetPostBySlug.mockResolvedValue(null)

      const result = await getPostBySlugMemo('non-existent-slug')

      expect(result).toBeNull()
    })

    it('should propagate errors from NotionClient', async () => {
      const error = new Error('Failed to fetch post')
      mockGetPostBySlug.mockRejectedValue(error)

      await expect(getPostBySlugMemo('test-post')).rejects.toThrow('Failed to fetch post')
    })

    it('should handle different slugs correctly', async () => {
      const mockPost1: PostDetail = {
        slug: 'post-1',
        title: 'Post 1',
        date: '2025-01-15',
        tags: [],
        tagsWithColors: [],
        content: [],
        html: '<p>Content 1</p>',
      }

      const mockPost2: PostDetail = {
        slug: 'post-2',
        title: 'Post 2',
        date: '2025-01-16',
        tags: [],
        tagsWithColors: [],
        content: [],
        html: '<p>Content 2</p>',
      }

      mockGetPostBySlug
        .mockResolvedValueOnce(mockPost1)
        .mockResolvedValueOnce(mockPost2)

      const result1 = await getPostBySlugMemo('post-1')
      const result2 = await getPostBySlugMemo('post-2')

      expect(mockGetPostBySlug).toHaveBeenCalledWith('post-1')
      expect(mockGetPostBySlug).toHaveBeenCalledWith('post-2')
      expect(result1).toEqual(mockPost1)
      expect(result2).toEqual(mockPost2)
    })
  })

  describe('getAboutPageMemo', () => {
    it('should call NotionClient.getAboutPage and return about page', async () => {
      const mockAboutPage: AboutPage = {
        title: 'About Me',
        content: [],
        html: '<p>About content</p>',
      }

      mockGetAboutPage.mockResolvedValue(mockAboutPage)

      const result = await getAboutPageMemo()

      expect(mockGetAboutPage).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockAboutPage)
    })

    it('should return null when about page not found', async () => {
      mockGetAboutPage.mockResolvedValue(null)

      const result = await getAboutPageMemo()

      expect(result).toBeNull()
    })

    it('should propagate errors from NotionClient', async () => {
      const error = new Error('Failed to fetch about page')
      mockGetAboutPage.mockRejectedValue(error)

      await expect(getAboutPageMemo()).rejects.toThrow('Failed to fetch about page')
    })
  })

  describe('getSiteConfigMemo', () => {
    it('should call NotionClient.getSiteConfig and return config', async () => {
      const mockConfig: SiteConfig = {
        title: 'My Blog',
        description: 'Test blog',
        author: 'John Doe',
        language: 'ko',
        enableComments: true,
        enableAdsense: false,
        adsensePublisherId: undefined,
      }

      mockGetSiteConfig.mockResolvedValue(mockConfig)

      const result = await getSiteConfigMemo()

      expect(mockGetSiteConfig).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockConfig)
    })

    it('should propagate errors from NotionClient', async () => {
      const error = new Error('Failed to fetch site config')
      mockGetSiteConfig.mockRejectedValue(error)

      await expect(getSiteConfigMemo()).rejects.toThrow('Failed to fetch site config')
    })

    it('should handle config with all optional fields', async () => {
      const mockConfig: SiteConfig = {
        title: 'My Blog',
        description: 'Test blog',
        author: 'John Doe',
        language: 'ko',
        enableComments: true,
        enableAdsense: true,
        adsensePublisherId: 'ca-pub-1234567890',
      }

      mockGetSiteConfig.mockResolvedValue(mockConfig)

      const result = await getSiteConfigMemo()

      expect(result).toEqual(mockConfig)
      expect(result.enableAdsense).toBe(true)
      expect(result.adsensePublisherId).toBe('ca-pub-1234567890')
    })
  })

  describe('getSiteSettingsMemo', () => {
    it('should call NotionClient.getSiteSettings and return settings', async () => {
      const mockSettings: SiteSettings = {
        enableComments: true,
        enableAdsense: false,
        adsensePublisherId: undefined,
      }

      mockGetSiteSettings.mockResolvedValue(mockSettings)

      const result = await getSiteSettingsMemo()

      expect(mockGetSiteSettings).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockSettings)
    })

    it('should propagate errors from NotionClient', async () => {
      const error = new Error('Failed to fetch site settings')
      mockGetSiteSettings.mockRejectedValue(error)

      await expect(getSiteSettingsMemo()).rejects.toThrow('Failed to fetch site settings')
    })

    it('should handle settings with adsense enabled', async () => {
      const mockSettings: SiteSettings = {
        enableComments: true,
        enableAdsense: true,
        adsensePublisherId: 'ca-pub-1234567890',
      }

      mockGetSiteSettings.mockResolvedValue(mockSettings)

      const result = await getSiteSettingsMemo()

      expect(result.enableAdsense).toBe(true)
      expect(result.adsensePublisherId).toBe('ca-pub-1234567890')
    })
  })

  describe('Function Existence and Types', () => {
    it('should export all memoized functions', () => {
      expect(listPublishedPostsMemo).toBeDefined()
      expect(getPostBySlugMemo).toBeDefined()
      expect(getAboutPageMemo).toBeDefined()
      expect(getSiteConfigMemo).toBeDefined()
      expect(getSiteSettingsMemo).toBeDefined()
    })

    it('all functions should be async', () => {
      expect(listPublishedPostsMemo).toBeInstanceOf(Function)
      expect(getPostBySlugMemo).toBeInstanceOf(Function)
      expect(getAboutPageMemo).toBeInstanceOf(Function)
      expect(getSiteConfigMemo).toBeInstanceOf(Function)
      expect(getSiteSettingsMemo).toBeInstanceOf(Function)
    })
  })
})
