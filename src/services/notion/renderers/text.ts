/**
 * Text Rendering Utilities
 *
 * Notion rich text를 HTML로 변환하는 핵심 유틸리티
 * Mention 처리, 텍스트 스타일, 날짜 포맷팅 등을 담당
 */

import { escapeHtml } from '@/lib/utils';
import { getNotionColorClass } from '@/lib/color-utils';
import type { NotionRichText } from '../renderer';

/**
 * Rich Text 배열을 HTML로 변환
 *
 * @param richText - Notion rich text 배열
 * @returns HTML 문자열
 */
export function renderRichText(richText: NotionRichText[]): string {
  if (!Array.isArray(richText)) {
    return '';
  }

  return richText
    .map(text => renderTextElement(text))
    .join('');
}

/**
 * 단일 Rich Text 요소를 HTML로 변환
 *
 * 다음 기능을 처리합니다:
 * - 텍스트 스타일 (bold, italic, strikethrough, underline, code)
 * - 텍스트 색상 및 배경색
 * - Mention (page, user, date, link_preview)
 * - 링크
 *
 * @param text - Notion rich text 요소
 * @returns HTML 문자열
 */
export function renderTextElement(text: NotionRichText): string {
  if (!text) return '';

  let content = text.plain_text || text.text?.content || '';
  const annotations = text.annotations || {};
  const link = text.text?.link || text.href;

  // HTML escape 적용 (XSS 방지 및 특수 문자 보호)
  content = escapeHtml(content);

  // 텍스트 스타일 적용 (색상 전에 먼저 적용)
  if (annotations.bold) {
    content = `<strong>${content}</strong>`;
  }
  if (annotations.italic) {
    content = `<em>${content}</em>`;
  }
  if (annotations.strikethrough) {
    content = `<del>${content}</del>`;
  }
  if (annotations.underline) {
    content = `<u>${content}</u>`;
  }

  // 색상 적용 (코드 스타일 전에 적용)
  if (annotations.color && annotations.color !== 'default') {
    const colorClass = getNotionColorClass(annotations.color);
    if (colorClass) {
      content = `<span class="${colorClass}">${content}</span>`;
    }
  }

  // 코드 스타일 (색상 이후에 적용 - 코드는 자체 배경이 있음)
  // 회색 배경 + 붉은색 텍스트 + 테두리 (Notion 스타일)
  if (annotations.code) {
    content = `<code class="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700 px-1 py-0.5 rounded text-sm font-mono">${content}</code>`;
  }

  // Mention 타입 처리 (링크 멘션) - 원본 텍스트 사용 (이미 escape됨)
  if (text.type === 'mention' && (text as any).mention) {
    const mention = (text as any).mention;
    // mention의 경우 annotations가 적용되기 전 원본 텍스트 사용
    const mentionText = escapeHtml(text.plain_text || text.text?.content || '');

    // Page mention - Notion 스타일 페이지 링크 카드
    if (mention.type === 'page' && mention.page) {
      const pageId = mention.page.id;
      const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

      // Notion 스타일 인라인 페이지 링크 카드
      // 파일 아이콘 + 페이지 제목 + 외부 링크 아이콘
      content = `<a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100 no-underline">
        <svg class="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span class="font-medium">${mentionText}</span>
        <svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" x2="21" y1="14" y2="3"></line>
        </svg>
      </a>`;
    }
    // User mention
    else if (mention.type === 'user' && mention.user) {
      content = `<span class="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">${mentionText}</span>`;
    }
    // Date mention - 날짜를 사람이 읽기 쉬운 형식으로 표시
    else if (mention.type === 'date' && mention.date) {
      const dateInfo = mention.date;
      const formattedDate = formatDateMention(dateInfo);
      content = `<span class="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
        <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>${formattedDate}</span>
      </span>`;
    }
    // Link preview mention
    else if (mention.type === 'link_preview' && mention.link_preview) {
      const url = mention.link_preview.url;
      content = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">${mentionText}</a>`;
    }
  }
  // 일반 링크 처리 - 가장 나중에 처리
  else if (link) {
    const href = typeof link === 'string' ? link : link.url;
    content = `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">${content}</a>`;
  }

  return content;
}

/**
 * 날짜 멘션을 사람이 읽기 쉬운 형식으로 포맷팅
 *
 * 다음 형식을 지원합니다:
 * - 상대적 날짜: "오늘", "내일", "어제"
 * - 절대적 날짜: "2024년 1월 1일 (월)"
 * - 시간 포함: "2024년 1월 1일 (월) 14:30"
 * - 기간: "2024년 1월 1일 (월) ~ 2024년 1월 2일 (화)"
 *
 * @param dateInfo - Notion 날짜 mention 정보 ({ start: string, end?: string })
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDateMention(dateInfo: any): string {
  if (!dateInfo || !dateInfo.start) {
    return '';
  }

  const startDate = new Date(dateInfo.start);
  const endDate = dateInfo.end ? new Date(dateInfo.end) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 요일 배열 (한국어)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 상대적 날짜 확인
  const startDateOnly = new Date(startDate);
  startDateOnly.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((startDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 상대적 날짜 표시
  if (diffDays === 0 && !endDate) {
    return '오늘';
  } else if (diffDays === 1 && !endDate) {
    return '내일';
  } else if (diffDays === -1 && !endDate) {
    return '어제';
  }

  // 날짜 포맷팅
  const formatDate = (date: Date, includeTime: boolean = false): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    let formatted = `${year}년 ${month}월 ${day}일 (${weekday})`;

    // 시간이 포함된 경우 (ISO 8601 형식에 T가 있으면)
    if (includeTime && dateInfo.start.includes('T')) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      formatted += ` ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return formatted;
  };

  // 단일 날짜
  if (!endDate) {
    return formatDate(startDate, true);
  }

  // 기간
  const startFormatted = formatDate(startDate, true);
  const endFormatted = formatDate(endDate, true);

  // 같은 날인 경우 (시간만 다른 경우)
  if (startDate.toDateString() === endDate.toDateString()) {
    return startFormatted;
  }

  return `${startFormatted} ~ ${endFormatted}`;
}
