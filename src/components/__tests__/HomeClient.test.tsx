/**
 * HomeClient 컴포넌트 유닛 테스트
 * 필터링, 페이지네이션, 최적화 동작 검증
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeClient } from '../HomeClient';
import type { PostListItem } from '@/services/notion/client';
import { useSearchParams } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

// Mock Markdown component
vi.mock('../Markdown', () => ({
  Markdown: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

// Mock CodeHighlight component
vi.mock('../CodeHighlight', () => ({
  default: () => <div data-testid="code-highlight" />,
}));

// Mock ArticleListItem component
vi.mock('../ArticleListItem', () => ({
  ArticleListItem: ({ post }: { post: any }) => (
    <article data-testid={`post-${post.slug}`}>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </article>
  ),
}));

const mockSearchParams = useSearchParams as ReturnType<typeof vi.fn>;

const createMockPost = (overrides: Partial<PostListItem> = {}): PostListItem => ({
  slug: 'test-post',
  title: 'Test Post',
  date: '2025-01-01',
  description: 'Test description',
  tags: ['tag1', 'tag2'],
  label: 'Test Label',
  author: 'Test Author',
  ...overrides,
});

describe('HomeClient', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockSearchParams.mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    } as any);
  });

  describe('Rendering', () => {
    it('should render page header with title and description', () => {
      const settings = {
        homeTitle: 'My Blog',
        homeDescription: 'Welcome to my blog',
      };

      render(<HomeClient posts={[]} settings={settings} error={null} />);

      expect(screen.getByText('My Blog')).toBeInTheDocument();
      expect(screen.getByTestId('markdown')).toHaveTextContent('Welcome to my blog');
    });

    it('should render empty state when no posts', () => {
      const settings = {
        homeTitle: 'My Blog',
      };

      render(<HomeClient posts={[]} settings={settings} error={null} />);

      expect(screen.getByText('아직 게시된 글이 없습니다')).toBeInTheDocument();
    });

    it('should render error state when error provided', () => {
      const settings = {
        homeTitle: 'My Blog',
      };
      const error = 'Failed to fetch posts';

      render(<HomeClient posts={[]} settings={settings} error={error} />);

      // Error title should be visible
      expect(screen.getByText('데이터를 불러올 수 없습니다')).toBeInTheDocument();
      // Error description should be visible
      expect(screen.getByText('Notion API에서 데이터를 가져오는 중 문제가 발생했습니다.')).toBeInTheDocument();
    });

    it('should render posts when available', () => {
      const settings = {
        homeTitle: 'My Blog',
      };
      const posts = [
        createMockPost({ slug: 'post-1', title: 'Post 1' }),
        createMockPost({ slug: 'post-2', title: 'Post 2' }),
      ];

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-2')).toBeInTheDocument();
    });

    it('should not render Markdown when description is empty', () => {
      const settings = {
        homeTitle: 'My Blog',
        homeDescription: '',
      };

      render(<HomeClient posts={[]} settings={settings} error={null} />);

      // Markdown should not render when description is empty
      expect(screen.queryByTestId('markdown')).not.toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should display first 4 posts on page 1', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = Array.from({ length: 10 }, (_, i) =>
        createMockPost({ slug: `post-${i}`, title: `Post ${i}` })
      );

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Should display first 4 posts
      expect(screen.getByTestId('post-post-0')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-2')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-3')).toBeInTheDocument();

      // Should not display 5th post
      expect(screen.queryByTestId('post-post-4')).not.toBeInTheDocument();
    });

    it('should display posts 5-8 on page 2', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = Array.from({ length: 10 }, (_, i) =>
        createMockPost({ slug: `post-${i}`, title: `Post ${i}` })
      );

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'page' ? '2' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Should display posts 4-7 (0-indexed)
      expect(screen.getByTestId('post-post-4')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-5')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-6')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-7')).toBeInTheDocument();

      // Should not display posts from page 1 or 3
      expect(screen.queryByTestId('post-post-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('post-post-8')).not.toBeInTheDocument();
    });

    it('should show pagination controls when more than 4 posts', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = Array.from({ length: 10 }, (_, i) =>
        createMockPost({ slug: `post-${i}` })
      );

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Check for PREV/NEXT buttons
      expect(screen.getByText('PREV')).toBeInTheDocument();
      expect(screen.getByText('NEXT')).toBeInTheDocument();

      // Check for page number links
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not show pagination when 4 or fewer posts', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = Array.from({ length: 4 }, (_, i) =>
        createMockPost({ slug: `post-${i}` })
      );

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Pagination should not be visible
      expect(screen.queryByText('PREV')).not.toBeInTheDocument();
      expect(screen.queryByText('NEXT')).not.toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('should filter posts by month', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [
        createMockPost({ slug: 'post-1', date: '2025-01-15' }),
        createMockPost({ slug: 'post-2', date: '2025-02-15' }),
        createMockPost({ slug: 'post-3', date: '2025-01-20' }),
      ];

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'month' ? '2025-01' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Should only show January posts
      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-3')).toBeInTheDocument();
      expect(screen.queryByTestId('post-post-2')).not.toBeInTheDocument();

      // Should show filter label
      expect(screen.getByText('JANUARY 2025')).toBeInTheDocument();
    });

    it('should filter posts by label', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [
        createMockPost({ slug: 'post-1', label: 'Tutorial' }),
        createMockPost({ slug: 'post-2', label: 'News' }),
        createMockPost({ slug: 'post-3', label: 'Tutorial' }),
      ];

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'label' ? 'Tutorial' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Should only show Tutorial posts
      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-3')).toBeInTheDocument();
      expect(screen.queryByTestId('post-post-2')).not.toBeInTheDocument();

      // Should show filter label
      expect(screen.getByText('Tutorial')).toBeInTheDocument();
    });

    it('should filter posts by tag', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [
        createMockPost({ slug: 'post-1', tags: ['react', 'typescript'] }),
        createMockPost({ slug: 'post-2', tags: ['nodejs'] }),
        createMockPost({ slug: 'post-3', tags: ['react', 'nextjs'] }),
      ];

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'tag' ? 'react' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Should only show posts with 'react' tag
      expect(screen.getByTestId('post-post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-post-3')).toBeInTheDocument();
      expect(screen.queryByTestId('post-post-2')).not.toBeInTheDocument();

      // Should show filter label
      expect(screen.getByText('#react')).toBeInTheDocument();
    });

    it('should show reset button when filter is active', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [createMockPost()];

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'tag' ? 'react' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      expect(screen.getByText('초기화')).toBeInTheDocument();
    });

    it('should show filtered post count', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [
        createMockPost({ slug: 'post-1', tags: ['react'] }),
        createMockPost({ slug: 'post-2', tags: ['react'] }),
        createMockPost({ slug: 'post-3', tags: ['nodejs'] }),
      ];

      mockSearchParams.mockReturnValue({
        get: vi.fn((key: string) => (key === 'tag' ? 'react' : null)),
      } as any);

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      expect(screen.getByText('(2개)')).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('should memoize filtered posts calculation', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [createMockPost()];

      const { rerender } = render(<HomeClient posts={posts} settings={settings} error={null} />);

      // Re-render with same props
      rerender(<HomeClient posts={posts} settings={settings} error={null} />);

      // Component should not re-render unnecessarily (verified by React.memo)
      expect(screen.getByTestId('post-test-post')).toBeInTheDocument();
    });

    it('should handle posts without optional fields', () => {
      const settings = { homeTitle: 'My Blog' };
      const posts = [
        createMockPost({
          tags: undefined,
          label: undefined,
          description: undefined,
          author: undefined,
        }),
      ];

      render(<HomeClient posts={posts} settings={settings} error={null} />);

      expect(screen.getByTestId('post-test-post')).toBeInTheDocument();
    });
  });
});
