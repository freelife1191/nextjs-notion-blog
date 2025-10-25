/**
 * TagChips 컴포넌트 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TagChips } from '../TagChips'

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

// Motion hooks 모킹
vi.mock('@/lib/motion', () => ({
  fadeVariants: {},
  scaleVariants: {},
  useInViewAnimation: {},
  useHoverAnimation: {},
  ANIMATION_DURATION: {
    STAGGER_DELAY: 0.05,
  },
}))

describe('TagChips', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all tags when count is less than maxDisplay', () => {
      const tags = ['React', 'TypeScript', 'Next.js']
      render(<TagChips tags={tags} />)

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
    })

    it('should render tags up to maxDisplay limit', () => {
      const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6']
      render(<TagChips tags={tags} maxDisplay={3} />)

      expect(screen.getByText('Tag1')).toBeInTheDocument()
      expect(screen.getByText('Tag2')).toBeInTheDocument()
      expect(screen.getByText('Tag3')).toBeInTheDocument()
      expect(screen.queryByText('Tag4')).not.toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('should not render remaining count when all tags are shown', () => {
      const tags = ['Tag1', 'Tag2']
      render(<TagChips tags={tags} maxDisplay={5} />)

      expect(screen.getByText('Tag1')).toBeInTheDocument()
      expect(screen.getByText('Tag2')).toBeInTheDocument()
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const tags = ['React']
      const { container } = render(
        <TagChips tags={tags} className="custom-class" />
      )

      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should return null for empty array', () => {
      const { container } = render(<TagChips tags={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle undefined tags gracefully', () => {
      const { container } = render(<TagChips tags={undefined as any} />)
      expect(container.firstChild).toBeNull()
    })

    it('should handle null tags gracefully', () => {
      const { container } = render(<TagChips tags={null as any} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('MaxDisplay Configuration', () => {
    it('should use default maxDisplay of 5', () => {
      const tags = ['1', '2', '3', '4', '5', '6', '7']
      render(<TagChips tags={tags} />)

      // First 5 should be visible
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      // 6th should not be visible
      expect(screen.queryByText('6')).not.toBeInTheDocument()
      // Should show +2 remaining
      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('should respect custom maxDisplay value', () => {
      const tags = ['A', 'B', 'C', 'D', 'E']
      render(<TagChips tags={tags} maxDisplay={2} />)

      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.queryByText('C')).not.toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('should handle maxDisplay of 1', () => {
      const tags = ['Only', 'One']
      render(<TagChips tags={tags} maxDisplay={1} />)

      expect(screen.getByText('Only')).toBeInTheDocument()
      expect(screen.queryByText('One')).not.toBeInTheDocument()
      expect(screen.getByText('+1')).toBeInTheDocument()
    })

    it('should handle maxDisplay larger than tags array', () => {
      const tags = ['A', 'B']
      render(<TagChips tags={tags} maxDisplay={10} />)

      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('should render tag icon for each displayed tag', () => {
      const tags = ['React', 'TypeScript']
      const { container } = render(<TagChips tags={tags} />)

      const tagIcons = container.querySelectorAll('[data-icon="tag"]')
      expect(tagIcons).toHaveLength(2)
    })

    it('should render tag icons with correct size', () => {
      const tags = ['React']
      const { container } = render(<TagChips tags={tags} />)

      const tagIcon = container.querySelector('[data-icon="tag"]')
      expect(tagIcon).toHaveAttribute('data-size', '12')
    })

    it('should not render icon for remaining count', () => {
      const tags = ['A', 'B', 'C', 'D', 'E', 'F']
      const { container } = render(<TagChips tags={tags} maxDisplay={2} />)

      const tagIcons = container.querySelectorAll('[data-icon="tag"]')
      // Should only have 2 icons for the 2 displayed tags
      expect(tagIcons).toHaveLength(2)
    })
  })

  describe('Remaining Count Display', () => {
    it('should calculate remaining count correctly', () => {
      const tags = ['1', '2', '3', '4', '5', '6', '7', '8']
      render(<TagChips tags={tags} maxDisplay={3} />)

      expect(screen.getByText('+5')).toBeInTheDocument()
    })

    it('should show +1 for one remaining tag', () => {
      const tags = ['A', 'B', 'C', 'D']
      render(<TagChips tags={tags} maxDisplay={3} />)

      expect(screen.getByText('+1')).toBeInTheDocument()
    })

    it('should not show remaining count when none remaining', () => {
      const tags = ['A', 'B']
      render(<TagChips tags={tags} maxDisplay={5} />)

      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have proper wrapper classes', () => {
      const tags = ['React']
      const { container } = render(<TagChips tags={tags} />)

      const wrapper = container.querySelector('.flex.flex-wrap.items-center.gap-2')
      expect(wrapper).toBeInTheDocument()
    })

    it('should have proper tag item structure', () => {
      const tags = ['React']
      const { container } = render(<TagChips tags={tags} />)

      const tagItem = container.querySelector('.inline-flex.items-center.gap-1\\.5')
      expect(tagItem).toBeInTheDocument()
    })

    it('should have proper styling for tag items', () => {
      const tags = ['React']
      const { container } = render(<TagChips tags={tags} />)

      const tagItem = container.querySelector('.px-3.py-1.text-sm')
      expect(tagItem).toBeInTheDocument()
    })
  })

  describe('Tag Content', () => {
    it('should render Korean tags correctly', () => {
      const tags = ['리액트', '타입스크립트', '넥스트']
      render(<TagChips tags={tags} />)

      expect(screen.getByText('리액트')).toBeInTheDocument()
      expect(screen.getByText('타입스크립트')).toBeInTheDocument()
      expect(screen.getByText('넥스트')).toBeInTheDocument()
    })

    it('should render tags with special characters', () => {
      const tags = ['C++', 'C#', 'F#']
      render(<TagChips tags={tags} />)

      expect(screen.getByText('C++')).toBeInTheDocument()
      expect(screen.getByText('C#')).toBeInTheDocument()
      expect(screen.getByText('F#')).toBeInTheDocument()
    })

    it('should render long tag names', () => {
      const tags = ['Very Long Tag Name That Should Still Display']
      render(<TagChips tags={tags} />)

      expect(screen.getByText('Very Long Tag Name That Should Still Display')).toBeInTheDocument()
    })

    it('should preserve tag order', () => {
      const tags = ['First', 'Second', 'Third']
      const { container } = render(<TagChips tags={tags} />)

      const tagElements = Array.from(container.querySelectorAll('.inline-flex.items-center'))
      expect(tagElements[0]).toHaveTextContent('First')
      expect(tagElements[1]).toHaveTextContent('Second')
      expect(tagElements[2]).toHaveTextContent('Third')
    })
  })

  describe('Edge Cases', () => {
    it('should handle single tag', () => {
      const tags = ['Solo']
      render(<TagChips tags={tags} />)

      expect(screen.getByText('Solo')).toBeInTheDocument()
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    })

    it('should handle maxDisplay of 0', () => {
      const tags = ['A', 'B', 'C']
      render(<TagChips tags={tags} maxDisplay={0} />)

      expect(screen.queryByText('A')).not.toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('should handle duplicate tags', () => {
      const tags = ['React', 'React', 'React']
      render(<TagChips tags={tags} />)

      // React key warning might appear but should still render
      const reactTags = screen.getAllByText('React')
      expect(reactTags).toHaveLength(3)
    })
  })
})
