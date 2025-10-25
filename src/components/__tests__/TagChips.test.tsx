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

  describe('Regression Tests - Previous Bugs', () => {
    /**
     * 회귀 테스트: React Hook 규칙 위반
     *
     * 이전 버그: useMemo가 early return 이후에 호출되어 React Hook 규칙 위반
     * 오류 메시지: "React Hook 'useMemo' is called conditionally"
     *
     * 수정 방법: useMemo를 early return 이전으로 이동
     * 관련 파일: src/components/TagChips.tsx:24-33
     */
    it('[BUG-FIX] should call useMemo before any early returns (React Hook rules)', () => {
      // This test verifies that useMemo is always called in the same order
      // regardless of the tags value, preventing Hook rules violation

      // Test 1: null tags - should not throw Hook error
      const { rerender } = render(<TagChips tags={null as any} />)
      expect(() => rerender(<TagChips tags={null as any} />)).not.toThrow()

      // Test 2: empty tags - should not throw Hook error
      rerender(<TagChips tags={[]} />)
      expect(() => rerender(<TagChips tags={[]} />)).not.toThrow()

      // Test 3: valid tags - should not throw Hook error
      rerender(<TagChips tags={['React']} />)
      expect(() => rerender(<TagChips tags={['React']} />)).not.toThrow()
    })

    /**
     * 회귀 테스트: Null 참조 오류
     *
     * 이전 버그: tags가 null일 때 useMemo 내부에서 tags.slice() 호출하여 오류 발생
     * 오류 메시지: "TypeError: Cannot read properties of null (reading 'slice')"
     *
     * 수정 방법: useMemo 내부에 null/undefined 체크 추가
     * 관련 파일: src/components/TagChips.tsx:26-28
     */
    it('[BUG-FIX] should handle null tags in useMemo without throwing (null safety)', () => {
      // This test verifies that useMemo handles null/undefined tags gracefully
      // without calling .slice() on null

      // Test 1: null tags should not throw in useMemo
      expect(() => render(<TagChips tags={null as any} />)).not.toThrow()

      // Test 2: undefined tags should not throw in useMemo
      expect(() => render(<TagChips tags={undefined as any} />)).not.toThrow()

      // Test 3: both should return null (no rendering)
      const { container: container1 } = render(<TagChips tags={null as any} />)
      expect(container1.firstChild).toBeNull()

      const { container: container2 } = render(<TagChips tags={undefined as any} />)
      expect(container2.firstChild).toBeNull()
    })

    /**
     * 회귀 테스트: useMemo 의존성 배열 검증
     *
     * 이 테스트는 useMemo가 tags와 maxDisplay 변경 시 올바르게 재계산되는지 확인합니다.
     */
    it('[BUG-FIX] should recalculate useMemo when dependencies change', () => {
      const { rerender } = render(<TagChips tags={['A', 'B', 'C']} maxDisplay={2} />)

      // Initial: 2 tags displayed, +1 remaining
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.queryByText('C')).not.toBeInTheDocument()
      expect(screen.getByText('+1')).toBeInTheDocument()

      // Change maxDisplay: should show all 3 tags
      rerender(<TagChips tags={['A', 'B', 'C']} maxDisplay={5} />)
      expect(screen.getByText('A')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('C')).toBeInTheDocument()
      expect(screen.queryByText(/\+/)).not.toBeInTheDocument()

      // Change tags: should show new tags
      rerender(<TagChips tags={['X', 'Y', 'Z']} maxDisplay={5} />)
      expect(screen.getByText('X')).toBeInTheDocument()
      expect(screen.getByText('Y')).toBeInTheDocument()
      expect(screen.getByText('Z')).toBeInTheDocument()
      expect(screen.queryByText('A')).not.toBeInTheDocument()
    })
  })
})
