'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger';
import { getPrismComponent } from '@/lib/languages';

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
                const prismComponent = getPrismComponent(lang)
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

      // 일반 코드 블록 복사
      if (button.dataset.copyBtn) {
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
        return
      }

      // Mermaid 코드 복사
      if (button.dataset.mermaidCopy) {
        const copyText = button.dataset.copyText
        if (!copyText) return

        // HTML 엔티티 디코딩
        const textarea = document.createElement('textarea')
        textarea.innerHTML = copyText
        const decodedText = textarea.value

        navigator.clipboard.writeText(decodedText).then(() => {
          const originalText = button.textContent
          button.textContent = 'Copied!'
          setTimeout(() => {
            button.textContent = originalText
          }, 2000)
        }).catch(err => {
          logger.error('복사 실패:', err)
        })
        return
      }
    }

    // 이벤트 위임으로 복사 버튼 처리
    document.addEventListener('click', handleCopyClick)

    return () => {
      document.removeEventListener('click', handleCopyClick)
    }
  }, [])

  return null
}
