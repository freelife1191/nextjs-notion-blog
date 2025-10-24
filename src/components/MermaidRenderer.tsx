'use client'

import { useEffect } from 'react'

/**
 * Mermaid 다이어그램 렌더러 컴포넌트
 * 페이지 내의 .mermaid 클래스를 가진 요소들을 찾아 다이어그램으로 렌더링합니다.
 */
export function MermaidRenderer() {
  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      if (typeof window === 'undefined') return

      try {
        // 페이지에 Mermaid 다이어그램이 있는지 확인
        const mermaidElements = document.querySelectorAll('.mermaid')
        if (mermaidElements.length === 0) {
          console.log('[Mermaid] No Mermaid elements found')
          return
        }

        console.log(`[Mermaid] Found ${mermaidElements.length} Mermaid elements`)

        // Mermaid 라이브러리 동적 로드
        const mermaid = (await import('mermaid')).default
        console.log('[Mermaid] Library loaded successfully')

        // 다크 모드 감지
        const isDarkMode = document.documentElement.classList.contains('dark')
        console.log('[Mermaid] Dark mode:', isDarkMode)

        // Mermaid 초기화 (단순화된 설정)
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode ? 'dark' : 'default',
          securityLevel: 'loose',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          logLevel: 'debug',
        })

        console.log('[Mermaid] Initialized with theme:', isDarkMode ? 'dark' : 'default')

        // 각 Mermaid 요소 렌더링 (for...of 사용하여 async 제대로 처리)
        let index = 0
        for (const element of Array.from(mermaidElements)) {
          try {
            // 이미 렌더링된 다이어그램은 건너뛰기 (SVG가 이미 있는 경우)
            if (element.querySelector('svg')) {
              console.log(`[Mermaid] Skipping already rendered diagram ${index}`)
              index++
              continue
            }

            const id = `mermaid-diagram-${index}`
            // textContent는 이미 HTML 엔티티가 디코딩된 상태
            const mermaidCode = (element.textContent || '').trim()

            console.log(`[Mermaid] Rendering diagram ${index}:`, {
              id,
              codeLength: mermaidCode.length,
              codePreview: mermaidCode.substring(0, 100),
              fullCode: mermaidCode,
            })

            // 다이어그램 렌더링
            const { svg } = await mermaid.render(id, mermaidCode)

            console.log(`[Mermaid] Diagram ${index} rendered successfully, SVG length:`, svg.length)

            // SVG 삽입
            element.innerHTML = svg

            console.log(`[Mermaid] Diagram ${index} inserted into DOM`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            const errorStack = error instanceof Error ? error.stack : ''
            console.error(`[Mermaid] Diagram rendering failed (${index}):`, {
              message: errorMessage,
              stack: errorStack,
              error: error
            })
            element.innerHTML = `<div class="text-red-500 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 rounded">
              <p class="font-bold mb-2">다이어그램 렌더링 실패:</p>
              <p class="text-sm">${errorMessage}</p>
            </div>`
          }
          index++
        }
      } catch (error) {
        console.error('[Mermaid] Library loading failed:', error)
      }
    }

    renderMermaidDiagrams()

    // 다크 모드 토글 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          console.log('[Mermaid] Theme changed, re-rendering diagrams')
          renderMermaidDiagrams()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // 복사 버튼 이벤트 핸들러 (Mermaid 다이어그램용)
    const handleCopyClick = (event: Event) => {
      const target = event.target as HTMLElement
      if (!target.matches('[data-copy-btn]')) return

      const button = target as HTMLButtonElement
      const copyText = button.dataset.copyText

      if (!copyText) return

      navigator.clipboard.writeText(copyText).then(() => {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = originalText
        }, 2000)
      }).catch(err => {
        console.error('[Mermaid] Copy failed:', err)
      })
    }

    // 이벤트 위임으로 복사 버튼 처리
    document.addEventListener('click', handleCopyClick)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleCopyClick)
    }
  }, [])

  return null
}
