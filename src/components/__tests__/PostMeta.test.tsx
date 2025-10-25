/**
 * PostMeta 컴포넌트 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostMeta } from '../PostMeta'

// Framer Motion 모킹
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Icon 모킹
vi.mock('@/lib/icons', () => ({
  Icon: ({ name, size }: { name: string; size: number }) => (
    <svg data-icon={name} data-size={size} aria-hidden="true" />
  ),
}))

// useInViewAnimation 모킹
vi.mock('@/lib/motion', () => ({
  fadeVariants: {},
  useInViewAnimation: {},
}))

describe('PostMeta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all meta information with readTime', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={5}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('2024년 10월 15일')).toBeInTheDocument()
      expect(screen.getByText('5분 읽기')).toBeInTheDocument()
    })

    it('should render without readTime', () => {
      render(
        <PostMeta
          author="Jane Smith"
          publishedAt="2024-10-15"
        />
      )

      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('2024년 10월 15일')).toBeInTheDocument()
      expect(screen.queryByText(/분 읽기/)).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          className="custom-class"
        />
      )

      const metaDiv = container.querySelector('.custom-class')
      expect(metaDiv).toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly for January', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-01-15"
        />
      )

      expect(screen.getByText('2024년 1월 15일')).toBeInTheDocument()
    })

    it('should format date correctly for December', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-12-25"
        />
      )

      expect(screen.getByText('2024년 12월 25일')).toBeInTheDocument()
    })

    it('should format date correctly for different years', () => {
      const { rerender } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2023-06-15"
        />
      )

      expect(screen.getByText('2023년 6월 15일')).toBeInTheDocument()

      rerender(
        <PostMeta
          author="John Doe"
          publishedAt="2025-06-15"
        />
      )

      expect(screen.getByText('2025년 6월 15일')).toBeInTheDocument()
    })

    it('should handle single-digit dates', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-01-05"
        />
      )

      expect(screen.getByText('2024년 1월 5일')).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('should render user icon', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const userIcon = container.querySelector('[data-icon="user"]')
      expect(userIcon).toBeInTheDocument()
      expect(userIcon).toHaveAttribute('data-size', '16')
    })

    it('should render calendar icon', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const calendarIcon = container.querySelector('[data-icon="calendar"]')
      expect(calendarIcon).toBeInTheDocument()
      expect(calendarIcon).toHaveAttribute('data-size', '16')
    })

    it('should render clock icon when readTime is provided', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={5}
        />
      )

      const clockIcon = container.querySelector('[data-icon="clock"]')
      expect(clockIcon).toBeInTheDocument()
      expect(clockIcon).toHaveAttribute('data-size', '16')
    })

    it('should not render clock icon when readTime is not provided', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const clockIcon = container.querySelector('[data-icon="clock"]')
      expect(clockIcon).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper time element with datetime attribute', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const timeElement = screen.getByText('2024년 10월 15일')
      expect(timeElement.tagName).toBe('TIME')
      expect(timeElement).toHaveAttribute('dateTime', '2024-10-15')
    })

    it('should have aria-hidden on icons', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={5}
        />
      )

      const icons = container.querySelectorAll('[aria-hidden="true"]')
      expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('Component Structure', () => {
    it('should have proper spacing between elements', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={5}
        />
      )

      const metaDiv = container.querySelector('.space-x-6')
      expect(metaDiv).toBeInTheDocument()
    })

    it('should have proper text size styling', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const metaDiv = container.querySelector('.text-body-small')
      expect(metaDiv).toBeInTheDocument()
    })

    it('should have proper margin bottom', () => {
      const { container } = render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
        />
      )

      const metaDiv = container.querySelector('.mb-8')
      expect(metaDiv).toBeInTheDocument()
    })
  })

  describe('Read Time Display', () => {
    it('should display correct read time for single minute', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={1}
        />
      )

      expect(screen.getByText('1분 읽기')).toBeInTheDocument()
    })

    it('should display correct read time for multiple minutes', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={15}
        />
      )

      expect(screen.getByText('15분 읽기')).toBeInTheDocument()
    })

    it('should handle zero read time', () => {
      render(
        <PostMeta
          author="John Doe"
          publishedAt="2024-10-15"
          readTime={0}
        />
      )

      // readTime이 0이면 표시하지 않음 (falsy)
      expect(screen.queryByText('0분 읽기')).not.toBeInTheDocument()
    })
  })

  describe('Author Display', () => {
    it('should display author name correctly', () => {
      render(
        <PostMeta
          author="김철수"
          publishedAt="2024-10-15"
        />
      )

      expect(screen.getByText('김철수')).toBeInTheDocument()
    })

    it('should handle long author names', () => {
      const longName = 'Very Long Author Name That Should Still Display'
      render(
        <PostMeta
          author={longName}
          publishedAt="2024-10-15"
        />
      )

      expect(screen.getByText(longName)).toBeInTheDocument()
    })
  })
})
