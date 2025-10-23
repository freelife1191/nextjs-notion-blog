/**
 * URL을 자동으로 감지하여 링크로 변환하는 유틸리티
 */

import React from 'react'

// URL을 감지하는 정규식
// http://, https://, www. 로 시작하는 URL을 감지
const URL_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi

/**
 * 텍스트에서 URL을 감지하고 React 링크 컴포넌트로 변환
 * @param text - 변환할 텍스트
 * @returns React 노드 배열
 */
export function linkifyText(text: string): React.ReactNode[] {
  if (!text) return []

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // 정규식으로 URL 찾기
  const matches = text.matchAll(URL_REGEX)

  for (const match of matches) {
    const url = match[0]
    const index = match.index!

    // URL 이전의 일반 텍스트 추가
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index))
    }

    // URL을 링크로 변환
    const href = url.startsWith('www.') ? `https://${url}` : url
    parts.push(
      <a
        key={`link-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
      >
        {url}
      </a>
    )

    lastIndex = index + url.length
  }

  // 남은 텍스트 추가
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}
