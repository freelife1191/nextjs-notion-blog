'use client'

import { useEffect } from 'react'

/**
 * 제목 앵커 링크 복사 기능을 제공하는 클라이언트 컴포넌트
 *
 * 기능:
 * - 제목 옆 링크 아이콘 클릭 시 해당 섹션의 URL을 클립보드에 복사
 * - URL 해시 업데이트로 브라우저 히스토리에 기록
 * - 복사 성공 시 시각적 피드백 제공
 */
export function HeadingAnchorScript() {
  useEffect(() => {
    // 링크 복사 함수
    const copyHeadingLink = async (headingId: string) => {
      try {
        // headingId에서 # 제거
        const id = headingId.startsWith('#') ? headingId.slice(1) : headingId

        // 현재 URL에 해시 추가
        const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${id}`

        // 클립보드에 복사
        await navigator.clipboard.writeText(url)

        // URL 해시 업데이트 (페이지 스크롤 없이)
        window.history.pushState(null, '', `#${id}`)

        // 해당 요소로 부드럽게 스크롤 (getElementById 사용 - 더 안전함)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        // 시각적 피드백 - 복사 성공 메시지 표시
        showCopyFeedback()
      } catch (error) {
        console.error('Failed to copy link:', error)
        // Fallback: 구형 브라우저 지원
        const id = headingId.startsWith('#') ? headingId.slice(1) : headingId
        fallbackCopyTextToClipboard(`${window.location.origin}${window.location.pathname}${window.location.search}#${id}`)
      }
    }

    // 복사 성공 피드백 표시
    function showCopyFeedback() {
      // 기존 토스트 메시지가 있으면 제거
      const existingToast = document.getElementById('copy-link-toast')
      if (existingToast) {
        existingToast.remove()
      }

      // 토스트 메시지 생성
      const toast = document.createElement('div')
      toast.id = 'copy-link-toast'
      toast.className = 'fixed bottom-8 right-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-opacity duration-300'
      toast.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="text-sm font-medium">Link copied!</span>
      `

      document.body.appendChild(toast)

      // 3초 후 페이드아웃 및 제거
      setTimeout(() => {
        toast.style.opacity = '0'
        setTimeout(() => {
          toast.remove()
        }, 300)
      }, 3000)
    }

    // Fallback: 구형 브라우저용 클립보드 복사
    function fallbackCopyTextToClipboard(text: string) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        showCopyFeedback()
      } catch (error) {
        console.error('Fallback: Failed to copy text:', error)
      }

      document.body.removeChild(textArea)
    }

    // 모든 제목 앵커 링크 버튼에 이벤트 리스너 추가
    const handlers = new Map<Element, (e: Event) => void>()

    // DOM이 완전히 로드된 후 이벤트 리스너 추가
    const setupEventListeners = () => {
      const anchorButtons = document.querySelectorAll('.heading-anchor-link')
      console.log('[HeadingAnchor] Found anchor buttons:', anchorButtons.length)

      anchorButtons.forEach((button) => {
        const handleClick = (e: Event) => {
          e.preventDefault()
          e.stopPropagation()

          // 가장 가까운 heading-wrapper에서 제목 요소 찾기
          const wrapper = (button as HTMLElement).closest('.heading-wrapper')
          const heading = wrapper?.querySelector('h1, h2, h3, h4, h5, h6')
          const headingId = heading?.id

          console.log('[HeadingAnchor] Clicked heading ID:', headingId)

          if (headingId) {
            copyHeadingLink(headingId) // # 없이 전달
          }
        }

        button.addEventListener('click', handleClick)
        handlers.set(button, handleClick)
      })
    }

    // DOM 업데이트 대기 후 실행
    const timeoutId = setTimeout(setupEventListeners, 100)

    // 페이지 로드 시 URL 해시가 있으면 해당 요소로 스크롤
    if (window.location.hash) {
      setTimeout(() => {
        // # 제거하고 getElementById 사용
        const id = window.location.hash.slice(1)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }

    // Cleanup 함수
    return () => {
      clearTimeout(timeoutId)
      handlers.forEach((handler, button) => {
        button.removeEventListener('click', handler)
      })
      handlers.clear()
    }
  }, [])

  return null
}
