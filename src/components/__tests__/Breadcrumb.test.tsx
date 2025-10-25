/**
 * Breadcrumb 컴포넌트 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb } from '../Breadcrumb'

// Next.js Link 컴포넌트 모킹
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Lucide React 아이콘 모킹
vi.mock('lucide-react', () => ({
  ChevronRight: (props: any) => (
    <svg data-testid="chevron-right" aria-hidden={props['aria-hidden']} {...props} />
  ),
}))

describe('Breadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render single item breadcrumb', () => {
      render(<Breadcrumb items={[{ label: 'Home' }]} />)

      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('should render multiple items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: 'Current Page' },
      ]
      render(<Breadcrumb items={items} />)

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Articles')).toBeInTheDocument()
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    it('should render items in correct order', () => {
      const items = [
        { label: 'First', href: '/first' },
        { label: 'Second', href: '/second' },
        { label: 'Third' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const listItems = container.querySelectorAll('li')
      expect(listItems[0]).toHaveTextContent('First')
      expect(listItems[1]).toHaveTextContent('Second')
      expect(listItems[2]).toHaveTextContent('Third')
    })
  })

  describe('Links', () => {
    it('should render links for items with href', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      render(<Breadcrumb items={items} />)

      const homeLink = screen.getByText('Home')
      expect(homeLink.tagName).toBe('A')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should not render link for last item', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current', href: '/current' },
      ]
      render(<Breadcrumb items={items} />)

      const currentItem = screen.getByText('Current')
      expect(currentItem.tagName).toBe('SPAN')
    })

    it('should not render link for items without href', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'No Link' },
      ]
      render(<Breadcrumb items={items} />)

      const noLinkItem = screen.getByText('No Link')
      expect(noLinkItem.tagName).toBe('SPAN')
    })

    it('should apply hover styles to links', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      render(<Breadcrumb items={items} />)

      const homeLink = screen.getByText('Home')
      expect(homeLink).toHaveClass('hover:text-foreground', 'transition-colors')
    })
  })

  describe('ChevronRight Separator', () => {
    it('should render separator between items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const chevrons = container.querySelectorAll('[data-testid="chevron-right"]')
      // Should have 2 separators for 3 items
      expect(chevrons).toHaveLength(2)
    })

    it('should not render separator after last item', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const listItems = container.querySelectorAll('li')
      const lastItem = listItems[listItems.length - 1]
      const chevronInLastItem = lastItem.querySelector('[data-testid="chevron-right"]')
      expect(chevronInLastItem).toBeNull()
    })

    it('should have aria-hidden on separator icons', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const chevrons = container.querySelectorAll('[data-testid="chevron-right"]')
      chevrons.forEach(chevron => {
        expect(chevron).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('should have correct size classes', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const chevrons = container.querySelectorAll('[data-testid="chevron-right"]')
      chevrons.forEach(chevron => {
        expect(chevron).toHaveClass('w-4', 'h-4', 'flex-shrink-0')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper nav element with aria-label', () => {
      render(<Breadcrumb items={[{ label: 'Home' }]} />)

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    })

    it('should mark last item as current page', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current Page' },
      ]
      render(<Breadcrumb items={items} />)

      const currentItem = screen.getByText('Current Page')
      expect(currentItem).toHaveAttribute('aria-current', 'page')
    })

    it('should not mark non-last items as current', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current Page' },
      ]
      render(<Breadcrumb items={items} />)

      const homeItem = screen.getByText('Home')
      expect(homeItem).not.toHaveAttribute('aria-current')
    })

    it('should have proper list structure', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const list = container.querySelector('ol')
      expect(list).toBeInTheDocument()
      expect(list?.querySelectorAll('li')).toHaveLength(2)
    })
  })

  describe('Styling', () => {
    it('should apply text-foreground and font-medium to last item', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      render(<Breadcrumb items={items} />)

      const currentItem = screen.getByText('Current')
      expect(currentItem).toHaveClass('text-foreground', 'font-medium')
    })

    it('should not apply special styling to non-last items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      render(<Breadcrumb items={items} />)

      const homeItem = screen.getByText('Home')
      expect(homeItem).not.toHaveClass('font-medium')
    })

    it('should have proper gap between items', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const list = container.querySelector('ol')
      expect(list).toHaveClass('gap-2')
    })

    it('should have proper text size and color', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const list = container.querySelector('ol')
      expect(list).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { container } = render(<Breadcrumb items={[]} />)
      const list = container.querySelector('ol')
      expect(list?.querySelectorAll('li')).toHaveLength(0)
    })

    it('should handle single item without href', () => {
      render(<Breadcrumb items={[{ label: 'Only Item' }]} />)

      const item = screen.getByText('Only Item')
      expect(item).toHaveAttribute('aria-current', 'page')
      expect(item.tagName).toBe('SPAN')
    })

    it('should handle long breadcrumb trail', () => {
      const items = [
        { label: 'Level 1', href: '/1' },
        { label: 'Level 2', href: '/2' },
        { label: 'Level 3', href: '/3' },
        { label: 'Level 4', href: '/4' },
        { label: 'Level 5' },
      ]
      const { container } = render(<Breadcrumb items={items} />)

      const listItems = container.querySelectorAll('li')
      expect(listItems).toHaveLength(5)

      const chevrons = container.querySelectorAll('[data-testid="chevron-right"]')
      expect(chevrons).toHaveLength(4) // One less than items
    })

    it('should handle items with special characters', () => {
      const items = [
        { label: 'Home & About', href: '/' },
        { label: 'Products > Services' },
      ]
      render(<Breadcrumb items={items} />)

      expect(screen.getByText('Home & About')).toBeInTheDocument()
      expect(screen.getByText('Products > Services')).toBeInTheDocument()
    })

    it('should handle items with Korean characters', () => {
      const items = [
        { label: '홈', href: '/' },
        { label: '게시글', href: '/posts' },
        { label: '현재 페이지' },
      ]
      render(<Breadcrumb items={items} />)

      expect(screen.getByText('홈')).toBeInTheDocument()
      expect(screen.getByText('게시글')).toBeInTheDocument()
      expect(screen.getByText('현재 페이지')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should wrap items in nav element', () => {
      const { container } = render(<Breadcrumb items={[{ label: 'Home' }]} />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('mb-6')
    })

    it('should use ordered list for items', () => {
      const { container } = render(<Breadcrumb items={[{ label: 'Home' }]} />)

      const list = container.querySelector('ol')
      expect(list).toBeInTheDocument()
    })

    it('should have flex layout with proper wrapping', () => {
      const { container } = render(<Breadcrumb items={[{ label: 'Home' }]} />)

      const list = container.querySelector('ol')
      expect(list).toHaveClass('flex', 'items-center', 'flex-wrap')
    })
  })
})
