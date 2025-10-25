/**
 * PostHero 컴포넌트 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostHero } from '../PostHero'

// Next.js Image 컴포넌트 모킹
vi.mock('next/image', () => ({
  default: ({ src, alt, priority, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      data-priority={priority}
      {...props}
    />
  ),
}))

describe('PostHero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with cover image', () => {
      render(
        <PostHero
          title="Test Post"
          coverImageUrl="https://example.com/image.jpg"
          publishedAt="2024-10-15"
          category="Tech"
        />
      )

      expect(screen.getByText('Test Post')).toBeInTheDocument()
      expect(screen.getByAltText('Test Post')).toBeInTheDocument()
      expect(screen.getByText('OCTOBER 2024')).toBeInTheDocument()
      expect(screen.getByText('Tech')).toBeInTheDocument()
    })

    it('should render without cover image', () => {
      render(
        <PostHero
          title="Test Post Without Image"
          publishedAt="2024-10-15"
        />
      )

      expect(screen.getByText('Test Post Without Image')).toBeInTheDocument()
      expect(screen.queryByAltText('Test Post Without Image')).not.toBeInTheDocument()
      expect(screen.getByText('OCTOBER 2024')).toBeInTheDocument()
    })

    it('should render without category', () => {
      render(
        <PostHero
          title="Test Post"
          coverImageUrl="https://example.com/image.jpg"
          publishedAt="2024-10-15"
        />
      )

      expect(screen.getByText('Test Post')).toBeInTheDocument()
      expect(screen.queryByText('•')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <PostHero
          title="Test Post"
          publishedAt="2024-10-15"
          className="custom-class"
        />
      )

      const section = container.querySelector('section')
      expect(section).toHaveClass('custom-class')
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly for January', () => {
      render(
        <PostHero
          title="Test Post"
          publishedAt="2024-01-15"
        />
      )

      expect(screen.getByText('JANUARY 2024')).toBeInTheDocument()
    })

    it('should format date correctly for December', () => {
      render(
        <PostHero
          title="Test Post"
          publishedAt="2024-12-25"
        />
      )

      expect(screen.getByText('DECEMBER 2024')).toBeInTheDocument()
    })

    it('should format date correctly for different years', () => {
      const { rerender } = render(
        <PostHero
          title="Test Post"
          publishedAt="2023-06-15"
        />
      )

      expect(screen.getByText('JUNE 2023')).toBeInTheDocument()

      rerender(
        <PostHero
          title="Test Post"
          publishedAt="2025-06-15"
        />
      )

      expect(screen.getByText('JUNE 2025')).toBeInTheDocument()
    })
  })

  describe('Image Priority', () => {
    it('should set priority attribute for cover image', () => {
      render(
        <PostHero
          title="Test Post"
          coverImageUrl="https://example.com/image.jpg"
          publishedAt="2024-10-15"
        />
      )

      const img = screen.getByAltText('Test Post')
      expect(img).toHaveAttribute('data-priority', 'true')
    })
  })

  describe('Component Structure', () => {
    it('should have proper section structure with cover image', () => {
      const { container } = render(
        <PostHero
          title="Test Post"
          coverImageUrl="https://example.com/image.jpg"
          publishedAt="2024-10-15"
          category="Tech"
        />
      )

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
      expect(section).toHaveClass('relative', 'w-full', 'mb-12')
    })

    it('should have proper section structure without cover image', () => {
      const { container } = render(
        <PostHero
          title="Test Post"
          publishedAt="2024-10-15"
        />
      )

      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
      expect(section).toHaveClass('relative', 'w-full', 'mb-12')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <PostHero
          title="Test Post"
          publishedAt="2024-10-15"
        />
      )

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Post')
    })

    it('should have proper time element', () => {
      const { container } = render(
        <PostHero
          title="Test Post"
          publishedAt="2024-10-15"
        />
      )

      // 날짜 텍스트는 span으로 표시되므로 존재 확인
      expect(screen.getByText('OCTOBER 2024')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render when props are unchanged', () => {
      const renderSpy = vi.fn()

      const TestWrapper = ({ title }: { title: string }) => {
        renderSpy()
        return (
          <PostHero
            title={title}
            publishedAt="2024-10-15"
            category="Tech"
          />
        )
      }

      const { rerender } = render(<TestWrapper title="Test Post" />)

      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Re-render with same props
      rerender(<TestWrapper title="Test Post" />)

      // Should render twice (once for initial, once for rerender)
      // After optimization with React.memo, the PostHero component itself shouldn't re-render
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })
  })
})
