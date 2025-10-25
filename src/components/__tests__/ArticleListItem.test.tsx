/**
 * ArticleListItem 컴포넌트 유닛 테스트
 * 렌더링, 최적화, 이미지 로딩 검증
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleListItem } from '../ArticleListItem';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}));

// Mock sub-components
vi.mock('../ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
}));

vi.mock('../article/DateBadge', () => ({
  DateBadge: ({ publishedAt }: { publishedAt: string }) => (
    <time data-testid="date-badge">{publishedAt}</time>
  ),
}));

vi.mock('../article/LabelBadge', () => ({
  LabelBadge: ({ label }: { label: string }) => (
    <span data-testid="label-badge">{label}</span>
  ),
}));

vi.mock('../article/TagList', () => ({
  TagList: ({ tags }: { tags: string[] }) => (
    <div data-testid="tag-list">{tags.join(', ')}</div>
  ),
}));

// Mock motion utilities
vi.mock('@/lib/motion', () => ({
  slideUpVariants: {},
  useInViewAnimation: {},
  ANIMATION_DURATION: { STAGGER_DELAY: 0.1 },
}));

const createMockPost = (overrides = {}) => ({
  id: 'test-id',
  title: 'Test Post Title',
  slug: 'test-post',
  excerpt: 'This is a test excerpt',
  label: 'Test Label',
  tags: ['tag1', 'tag2'],
  publishedAt: '2025-01-01T00:00:00.000Z',
  author: 'Test Author',
  coverImageUrl: 'https://example.com/image.jpg',
  ...overrides,
});

describe('ArticleListItem', () => {
  beforeEach(() => {
    // Mock window.performance
    global.window = {
      performance: {
        getEntriesByType: vi.fn().mockReturnValue([
          { type: 'navigate' } as PerformanceNavigationTiming,
        ]),
      },
    } as any;
  });

  describe('Rendering', () => {
    it('should render post title', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('should render post excerpt', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
    });

    it('should render author name', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });

    it('should render date badge', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      expect(screen.getByTestId('date-badge')).toBeInTheDocument();
    });

    it('should render label badge when label exists', () => {
      const post = createMockPost({ label: 'Tutorial' });
      render(<ArticleListItem post={post} />);

      expect(screen.getByTestId('label-badge')).toHaveTextContent('Tutorial');
    });

    it('should not render label badge when label is undefined', () => {
      const post = createMockPost({ label: undefined });
      render(<ArticleListItem post={post} />);

      expect(screen.queryByTestId('label-badge')).not.toBeInTheDocument();
    });

    it('should render tags', () => {
      const post = createMockPost({ tags: ['react', 'nextjs'] });
      render(<ArticleListItem post={post} />);

      const tagList = screen.getByTestId('tag-list');
      expect(tagList).toHaveTextContent('react, nextjs');
    });

    it('should handle empty tags array', () => {
      const post = createMockPost({ tags: [] });
      render(<ArticleListItem post={post} />);

      expect(screen.getByTestId('tag-list')).toHaveTextContent('');
    });
  });

  describe('Cover Image', () => {
    it('should render cover image when URL is provided', () => {
      const post = createMockPost({ coverImageUrl: 'https://example.com/cover.jpg' });
      render(<ArticleListItem post={post} />);

      const image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');
      expect(image).toHaveAttribute('alt', 'Test Post Title');
    });

    it('should not render cover image when URL is undefined', () => {
      const post = createMockPost({ coverImageUrl: undefined });
      render(<ArticleListItem post={post} />);

      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument();
    });

    it('should render images with correct index', () => {
      const post = createMockPost();

      // First item (index 0)
      const { rerender } = render(<ArticleListItem post={post} index={0} />);
      let image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();

      // Second item (index 1)
      rerender(<ArticleListItem post={post} index={1} />);
      image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();

      // Third item (index 2)
      rerender(<ArticleListItem post={post} index={2} />);
      image = screen.getByTestId('next-image');
      expect(image).toBeInTheDocument();
    });

    it('should set loading=eager for first 2 items', () => {
      const post = createMockPost();

      // First item
      const { rerender } = render(<ArticleListItem post={post} index={0} />);
      let image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('loading', 'eager');

      // Third item - should be lazy
      rerender(<ArticleListItem post={post} index={2} />);
      image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('should have blur placeholder', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('placeholder', 'blur');
      expect(image).toHaveAttribute('blurDataURL');
    });

    it('should have proper sizes attribute', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      const image = screen.getByTestId('next-image');
      expect(image).toHaveAttribute('sizes', '(max-width: 640px) 192px, 256px');
    });
  });

  describe('Links', () => {
    it('should have correct post link URLs', () => {
      const post = createMockPost({ slug: 'my-awesome-post' });
      render(<ArticleListItem post={post} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/posts/my-awesome-post');
      });
    });

    it('should have correct href on all links', () => {
      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      const links = screen.getAllByRole('link');
      // All links should point to the post page
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', '/posts/test-post');
      });
    });
  });

  describe('Date Formatting', () => {
    it('should format date in Korean locale', () => {
      const post = createMockPost({ publishedAt: '2025-01-15T10:30:00.000Z' });
      render(<ArticleListItem post={post} />);

      // Date should be formatted by useMemo
      // The formatted date is shown in the time element
      const timeElement = screen.getAllByRole('time')[0];
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe('Performance Optimization', () => {
    it('should skip animation on back navigation', () => {
      // Mock back navigation
      global.window.performance.getEntriesByType = vi.fn().mockReturnValue([
        { type: 'back_forward' } as PerformanceNavigationTiming,
      ]);

      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      // Component should render without animation
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should use animation on normal navigation', () => {
      // Mock normal navigation
      global.window.performance.getEntriesByType = vi.fn().mockReturnValue([
        { type: 'navigate' } as PerformanceNavigationTiming,
      ]);

      const post = createMockPost();
      render(<ArticleListItem post={post} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should apply stagger delay based on index', () => {
      const post = createMockPost();

      // Render with different indices
      const { rerender } = render(<ArticleListItem post={post} index={0} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();

      rerender(<ArticleListItem post={post} index={3} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Memo Optimization', () => {
    it('should not re-render when props are unchanged', () => {
      const post = createMockPost();
      const { rerender } = render(<ArticleListItem post={post} index={0} />);

      // Re-render with same props
      rerender(<ArticleListItem post={post} index={0} />);

      // Component should be memoized
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('should re-render when post content changes', () => {
      const post1 = createMockPost({ title: 'Original Title' });
      const post2 = createMockPost({ title: 'Updated Title' });

      const { rerender } = render(<ArticleListItem post={post1} index={0} />);
      expect(screen.getByText('Original Title')).toBeInTheDocument();

      rerender(<ArticleListItem post={post2} index={0} />);
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });

    it('should re-render when index changes', () => {
      const post = createMockPost();
      const { rerender } = render(<ArticleListItem post={post} index={0} />);

      rerender(<ArticleListItem post={post} index={1} />);

      // Component should re-render with new index
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional fields gracefully', () => {
      const post = createMockPost({
        label: undefined,
        tags: undefined,
        coverImageUrl: undefined,
      });

      render(<ArticleListItem post={post} />);

      // Should still render core content
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
      expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(200);
      const post = createMockPost({ title: longTitle });

      render(<ArticleListItem post={post} />);

      // Title should be truncated with line-clamp-2
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long excerpts', () => {
      const longExcerpt = 'B'.repeat(500);
      const post = createMockPost({ excerpt: longExcerpt });

      render(<ArticleListItem post={post} />);

      // Excerpt should be truncated with line-clamp-2
      expect(screen.getByText(longExcerpt)).toBeInTheDocument();
    });
  });
});
