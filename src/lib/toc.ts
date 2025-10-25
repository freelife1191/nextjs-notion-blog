/**
 * 목차(TOC) 생성 및 앵커 관리
 * 본문의 헤딩을 기반으로 목차와 앵커 링크 생성
 */

export interface TOCItem {
  id: string
  title: string
  level: number
  element?: HTMLElement
}

/**
 * 텍스트를 URL-safe ID로 변환
 */
export function generateId(text: string): string {
  let id = text
    .toLowerCase()
    // 알파벳, 숫자, 한글, 공백, 하이픈만 허용
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속된 하이픈을 하나로
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거

  // ID가 비어있거나 숫자로 시작하면 접두사 추가
  if (!id || /^\d/.test(id)) {
    id = `heading-${id}`
  }

  return id
}

/**
 * HTML 문자열에서 헤딩 요소들을 추출하여 TOC 생성
 */
export function generateTOCFromHTML(htmlContent: string): TOCItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const toc: TOCItem[] = []
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    const title = heading.textContent?.trim() || ''
    
    if (title) {
      const id = generateId(title)
      toc.push({
        id,
        title,
        level,
      })
    }
  })
  
  return toc
}

/**
 * HTML 콘텐츠에 헤딩에 ID 속성 추가 (서버 사이드 호환)
 */
export function addIdsToHeadings(htmlContent: string): string {
  const usedIds = new Set<string>()
  let headingIndex = 0

  // 서버 사이드에서는 DOMParser가 없으므로 정규식 사용
  return htmlContent.replace(
    /<(h[1-6])([^>]*?)>([^<]+)<\/h[1-6]>/gi,
    (match, tag, attributes, title) => {
      // 이미 id 속성이 있는지 확인
      if (attributes.includes('id=')) {
        return match
      }

      // ID 생성
      let id = generateId(title.trim())

      // ID가 비어있으면 fallback 사용
      if (!id || id === '-') {
        id = `heading-${headingIndex}`
      }

      // 중복된 ID인 경우 suffix 추가
      let uniqueId = id
      let counter = 1
      while (usedIds.has(uniqueId)) {
        uniqueId = `${id}-${counter}`
        counter++
      }

      usedIds.add(uniqueId)
      headingIndex++

      return `<${tag}${attributes} id="${uniqueId}">${title}</${tag}>`
    }
  )
}

/**
 * TOC 아이템을 렌더링용 HTML로 변환 (중첩 구조 지원)
 */
export function renderTOC(toc: TOCItem[]): string {
  if (toc.length === 0) return ''
  
  let html = '<div class="toc-container">\n'
  html += '<h3 class="toc-title">목차</h3>\n'
  html += '<ul class="toc-list">\n'
  
  let currentLevel = 1
  let openLists = 0
  
  toc.forEach((item) => {
    // 레벨이 올라갔을 때 새로운 ul 태그 열기
    if (item.level > currentLevel) {
      for (let i = currentLevel; i < item.level; i++) {
        html += '  '.repeat(i) + '<ul class="toc-sublist">\n'
        openLists++
      }
    }
    
    // 레벨이 내려갔을 때 ul 태그 닫기
    if (item.level < currentLevel) {
      for (let i = currentLevel; i > item.level; i--) {
        html += '  '.repeat(i - 1) + '</ul>\n'
        openLists--
      }
    }
    
    const indent = '  '.repeat(item.level)
    html += `${indent}<li class="toc-item toc-level-${item.level}">\n`
    html += `${indent}  <a href="#${item.id}" class="toc-link">${item.title}</a>\n`
    html += `${indent}</li>\n`
    
    currentLevel = item.level
  })
  
  // 남은 ul 태그들 닫기
  for (let i = 0; i < openLists; i++) {
    html += '  '.repeat(currentLevel - i) + '</ul>\n'
  }
  
  html += '</ul>\n'
  html += '</div>\n'
  
  return html
}

/**
 * 스크롤 위치에 따른 활성 TOC 아이템 감지
 */
export function getActiveTOCItem(toc: TOCItem[]): string | null {
  if (typeof window === 'undefined') return null
  
  const scrollPosition = window.scrollY + 100 // 헤더 오프셋 고려
  
  for (let i = toc.length - 1; i >= 0; i--) {
    const element = document.getElementById(toc[i].id)
    if (element && element.offsetTop <= scrollPosition) {
      return toc[i].id
    }
  }
  
  return toc[0]?.id || null
}

/**
 * TOC 링크 클릭 시 부드러운 스크롤
 */
export function scrollToHeading(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

/**
 * Notion 블록 데이터에서 TOC 생성
 */
export function generateTOCFromNotionBlocks(blocks: unknown[]): TOCItem[] {
  const toc: TOCItem[] = []
  const usedIds = new Set<string>()

  // blocks가 배열이 아닌 경우 빈 배열 반환
  if (!Array.isArray(blocks)) {
    return toc
  }

  blocks.forEach((block: any, index: number) => {
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const level = parseInt(block.type.split('_')[1])
      const title = block[block.type]?.rich_text?.map((text: any) => text.plain_text).join('') || ''

      if (title) {
        let id = generateId(title)

        // ID가 비어있으면 fallback 사용
        if (!id || id === '-') {
          id = `heading-${index}`
        }

        // 중복된 ID인 경우 suffix 추가
        let uniqueId = id
        let counter = 1
        while (usedIds.has(uniqueId)) {
          uniqueId = `${id}-${counter}`
          counter++
        }

        usedIds.add(uniqueId)
        toc.push({
          id: uniqueId,
          title,
          level,
        })
      }
    }
  })

  return toc
}

/**
 * TOC 스타일링을 위한 CSS 클래스
 */
export const tocStyles = `
.toc-container {
  @apply bg-muted/50 rounded-lg p-6 mb-8;
}

.toc-title {
  @apply text-heading-3 text-foreground mb-4;
}

.toc-list {
  @apply space-y-1;
}

.toc-sublist {
  @apply ml-3 space-y-1;
}

.toc-item {
  @apply list-none;
}

.toc-link {
  @apply text-body text-muted-foreground hover:text-foreground transition-colors;
  @apply block py-1 px-2 rounded hover:bg-muted;
}

.toc-level-1 .toc-link {
  @apply font-semibold text-base;
}

.toc-level-2 .toc-link {
  @apply text-sm ml-2;
}

.toc-level-3 .toc-link {
  @apply text-sm ml-4;
}

.toc-level-4 .toc-link {
  @apply text-xs ml-6;
}

.toc-level-5 .toc-link {
  @apply text-xs ml-8;
}

.toc-level-6 .toc-link {
  @apply text-xs ml-9;
}

.toc-link.active {
  @apply text-primary bg-primary/10;
}
`
