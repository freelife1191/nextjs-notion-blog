'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger';

/**
 * 언어명을 Prism.js 컴포넌트 이름으로 매핑
 */
const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'prism-javascript',
  js: 'prism-javascript',
  typescript: 'prism-typescript',
  ts: 'prism-typescript',
  python: 'prism-python',
  py: 'prism-python',
  sql: 'prism-sql',
  bash: 'prism-bash',
  sh: 'prism-bash',
  shell: 'prism-bash',
  json: 'prism-json',
  html: 'prism-markup',
  xml: 'prism-markup',
  markup: 'prism-markup',
  css: 'prism-css',
}

export default function CodeHighlight() {
  useEffect(() => {
    // Prism.js 선택적 로딩
    const loadPrism = async () => {
      if (typeof window !== 'undefined') {
        try {
          // 1. 페이지에서 사용된 언어 감지
          const codeBlocks = document.querySelectorAll('code[class*="language-"]')
          const usedLanguages = new Set<string>()

          codeBlocks.forEach((block) => {
            const classList = Array.from(block.classList)
            classList.forEach((className) => {
              if (className.startsWith('language-')) {
                const lang = className.replace('language-', '').toLowerCase()
                const prismComponent = LANGUAGE_MAP[lang]
                if (prismComponent) {
                  usedLanguages.add(prismComponent)
                }
              }
            })
          })

          // 코드 블록이 없으면 Prism 로딩하지 않음
          if (usedLanguages.size === 0) return

          // 2. Prism 코어 로드
          const Prism = (await import('prismjs')).default

          // 3. 사용된 언어 문법만 동적으로 로드
          await Promise.all(
            Array.from(usedLanguages).map(async (component) => {
              try {
                await import(`prismjs/components/${component}`)
              } catch (error) {
                logger.warn(`Failed to load Prism language: ${component}`, error)
              }
            })
          )

          // 4. 구문 강조 실행
          Prism.highlightAll()
        } catch (error) {
          logger.warn('Prism.js 로딩 실패:', error)
        }
      }
    }

    loadPrism()

    // 복사 버튼 이벤트 핸들러 설정
    const handleCopyClick = (event: Event) => {
      const button = event.target as HTMLButtonElement
      if (!button.dataset.copyBtn) return

      const blockId = button.dataset.copyBtn
      const wrapper = document.querySelector(`[data-code-block="${blockId}"]`)
      if (!wrapper) return

      const codeElement = wrapper.querySelector('code')
      if (!codeElement) return

      const text = codeElement.textContent || ''

      navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }).catch(err => {
        logger.error('복사 실패:', err)
      })
    }

    // 이벤트 위임으로 복사 버튼 처리
    document.addEventListener('click', handleCopyClick)

    return () => {
      document.removeEventListener('click', handleCopyClick)
    }
  }, [])

  return null
}
