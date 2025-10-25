'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { PostHero } from './PostHero'
import { PostMeta } from './PostMeta'
import { TagChips } from './TagChips'
import CodeHighlight from './CodeHighlight'
import { ImageZoom } from './ImageZoom'
import { Breadcrumb } from './Breadcrumb'
import { motion } from 'framer-motion'
import { pageVariants, usePageAnimation } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { NavigationIcon } from '@/lib/icons'
import type { TOCItem } from '@/lib/toc'

interface PostHeroClientProps {
  title: string
  coverImageUrl?: string
  author: string
  publishedAt: string
  readTime: number
  tags: string[]
  label?: string
  toc: TOCItem[]
  contentHtml: string
}

// TOC 리스트 컴포넌트
interface TOCListProps {
  items: TOCItem[]
}

function TOCList({ items }: TOCListProps) {
  if (items.length === 0) return null

  return (
    <ul className="toc-list">
      {items.map((item) => (
        <li key={item.id} className={`toc-item toc-level-${item.level}`} data-level={item.level}>
          <a href={`#${item.id}`} className="toc-link">
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function PostHeroClient({
  title,
  coverImageUrl,
  author,
  publishedAt,
  readTime,
  tags,
  label,
  toc,
  contentHtml,
}: PostHeroClientProps) {
  // 페이지 진입 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Mermaid 다이어그램 탭 전환 함수 등록
  useEffect(() => {
    // Define switchMermaidTab function on window object for onclick handlers
    (window as any).switchMermaidTab = function(blockId: string, tab: string) {
      const wrapper = document.querySelector(`[data-mermaid-block="${blockId}"]`);
      if (!wrapper) return;

      // 탭 버튼 전환
      wrapper.querySelectorAll('.mermaid-tab').forEach(btn => {
        const button = btn as HTMLButtonElement;
        if (button.dataset.tab === tab) {
          // Active 상태
          button.classList.add('active', 'bg-gray-300', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-gray-100');
          button.classList.remove('text-gray-100', 'hover:bg-gray-700/40');
        } else {
          // Inactive 상태
          button.classList.remove('active', 'bg-gray-300', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-gray-100');
          button.classList.add('text-gray-100', 'hover:bg-gray-700/40');
        }
      });

      // 패널 전환
      wrapper.querySelectorAll('.mermaid-tab-panel').forEach(panel => {
        const panelElement = panel as HTMLElement;
        if (panelElement.dataset.panel === tab) {
          panelElement.classList.remove('hidden');
          panelElement.classList.add('active');
        } else {
          panelElement.classList.add('hidden');
          panelElement.classList.remove('active');
        }
      });
    };

    // Cleanup on unmount
    return () => {
      delete (window as any).switchMermaidTab;
    };
  }, [])

  return (
    <>
      <CodeHighlight />
      <ImageZoom />
      <motion.article
        className="pt-4 pb-8 lg:pt-6 lg:pb-12"
        variants={pageVariants}
        {...usePageAnimation}
      >
        {/* 목록으로 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          aria-label="목록으로"
          asChild
        >
          <Link href="/" prefetch={true}>
            <NavigationIcon direction="prev" size={16} className="mr-2" />
            목록으로
          </Link>
        </Button>

        {/* Breadcrumb navigation */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Articles', href: '/' },
            { label: title },
          ]}
        />

        {/* 히어로 섹션 */}
        <PostHero
          title={title}
          coverImageUrl={coverImageUrl}
          publishedAt={publishedAt}
          category={label}
        />

        {/* 메타 정보 */}
        <PostMeta
          author={author}
          publishedAt={publishedAt}
          readTime={readTime}
        />

        {/* 태그 */}
        {tags && tags.length > 0 && (
          <TagChips tags={tags} className="mb-12" />
        )}

        {/* 본문 내용 */}
        <article className="prose prose-gray max-w-none dark:prose-invert">
          {/* 목차 (헤딩이 있는 경우) - not-prose로 제외 */}
          {toc.length > 0 && (
            <div className="not-prose">
              <div className="toc">
                <h3>목차</h3>
                <TOCList items={toc} />
              </div>
            </div>
          )}

          {/* 본문 내용 */}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      </motion.article>
    </>
  )
}
