/**
 * Notion 색상 유틸리티
 *
 * Notion의 색상을 Tailwind CSS 클래스로 변환하는 통합 유틸리티
 * renderer.ts의 중복된 색상 매핑 로직을 한 곳에서 관리
 */

/**
 * Notion 색상 타입
 */
export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

/**
 * Notion 배경 색상 타입
 */
export type NotionBackgroundColor =
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background';

/**
 * 배지(Badge) 스타일 색상 클래스 맵
 * select, multi-select, status 속성에서 사용
 */
const BADGE_COLOR_CLASSES: Record<NotionColor, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  gray: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  brown: 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-50',
  orange: 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-50',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200',
  green: 'bg-green-100 dark:bg-green-950/80 text-green-900 dark:text-green-50',
  blue: 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-50',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-900 dark:text-pink-200',
  red: 'bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-50',
};

/**
 * 텍스트 색상 클래스 맵
 */
const TEXT_COLOR_CLASSES: Record<NotionColor, string> = {
  default: '',
  gray: 'text-gray-600 dark:text-gray-400',
  brown: 'text-amber-700 dark:text-amber-400',
  orange: 'text-orange-600 dark:text-orange-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  red: 'text-red-600 dark:text-red-400',
};

/**
 * 인라인 배경 색상 클래스 맵 (inline code, highlight 등)
 */
const INLINE_BACKGROUND_COLOR_CLASSES: Record<NotionBackgroundColor, string> = {
  gray_background: 'not-prose bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-0.5 rounded',
  brown_background: 'not-prose bg-amber-100 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded',
  orange_background: 'not-prose bg-orange-100 dark:bg-orange-700 text-orange-900 dark:text-orange-100 px-2 py-0.5 rounded',
  yellow_background: 'not-prose bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded',
  green_background: 'not-prose bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-100 px-2 py-0.5 rounded',
  blue_background: 'not-prose bg-blue-100 dark:bg-blue-700 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded',
  purple_background: 'not-prose bg-purple-100 dark:bg-purple-700 text-purple-900 dark:text-purple-100 px-2 py-0.5 rounded',
  pink_background: 'not-prose bg-pink-100 dark:bg-pink-700 text-pink-900 dark:text-pink-100 px-2 py-0.5 rounded',
  red_background: 'not-prose bg-red-100 dark:bg-red-700 text-red-900 dark:text-red-100 px-2 py-0.5 rounded',
};

/**
 * 블록 배경 색상 상세 정보 타입 (quote, callout 등)
 */
export interface BlockBackgroundColorClasses {
  bg: string;
  text: string;
  border: string;
  borderClass: string;
}

/**
 * 블록 배경 색상 클래스 맵 (quote, callout 등)
 */
const BLOCK_BACKGROUND_COLOR_CLASSES: Record<NotionBackgroundColor, BlockBackgroundColorClasses> = {
  gray_background: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'rgb(156 163 175)', // gray-400
    borderClass: 'border-gray-400 dark:border-gray-500',
  },
  brown_background: {
    bg: 'bg-amber-100/50 dark:bg-amber-900/20',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'rgb(217 119 6)', // amber-600
    borderClass: 'border-amber-600 dark:border-amber-500',
  },
  orange_background: {
    bg: 'bg-orange-100/50 dark:bg-orange-900/20',
    text: 'text-orange-900 dark:text-orange-200',
    border: 'rgb(234 88 12)', // orange-600
    borderClass: 'border-orange-600 dark:border-orange-500',
  },
  yellow_background: {
    bg: 'bg-yellow-100/50 dark:bg-yellow-900/20',
    text: 'text-yellow-900 dark:text-yellow-200',
    border: 'rgb(202 138 4)', // yellow-600
    borderClass: 'border-yellow-600 dark:border-yellow-500',
  },
  green_background: {
    bg: 'bg-green-100/50 dark:bg-green-900/20',
    text: 'text-green-900 dark:text-green-200',
    border: 'rgb(22 163 74)', // green-600
    borderClass: 'border-green-600 dark:border-green-500',
  },
  blue_background: {
    bg: 'bg-blue-100/50 dark:bg-blue-900/20',
    text: 'text-blue-900 dark:text-blue-200',
    border: 'rgb(37 99 235)', // blue-600
    borderClass: 'border-blue-600 dark:border-blue-500',
  },
  purple_background: {
    bg: 'bg-purple-100/50 dark:bg-purple-900/30',
    text: 'text-purple-900 dark:text-purple-200',
    border: 'rgb(147 51 234)', // purple-600
    borderClass: 'border-purple-600 dark:border-purple-500',
  },
  pink_background: {
    bg: 'bg-pink-100/50 dark:bg-pink-900/20',
    text: 'text-pink-900 dark:text-pink-200',
    border: 'rgb(219 39 119)', // pink-600
    borderClass: 'border-pink-600 dark:border-pink-500',
  },
  red_background: {
    bg: 'bg-red-100/50 dark:bg-red-900/20',
    text: 'text-red-900 dark:text-red-200',
    border: 'rgb(220 38 38)', // red-600
    borderClass: 'border-red-600 dark:border-red-500',
  },
};

/**
 * 기본 블록 배경 색상
 */
const DEFAULT_BLOCK_BACKGROUND: BlockBackgroundColorClasses = {
  bg: 'bg-gray-50 dark:bg-gray-800/30',
  text: 'text-gray-700 dark:text-gray-300',
  border: 'currentColor',
  borderClass: 'border-gray-400 dark:border-gray-500',
};

/**
 * 배지(Badge) 스타일 색상 클래스 반환
 *
 * @param color - Notion 색상 이름
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * getBadgeColorClasses('blue') // 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-50'
 */
export function getBadgeColorClasses(color: string): string {
  return BADGE_COLOR_CLASSES[color as NotionColor] || BADGE_COLOR_CLASSES.default;
}

/**
 * 텍스트 색상 클래스 반환
 *
 * @param color - Notion 색상 이름
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * getTextColorClass('blue') // 'text-blue-600 dark:text-blue-400'
 */
export function getTextColorClass(color: NotionColor): string {
  return TEXT_COLOR_CLASSES[color] || TEXT_COLOR_CLASSES.default;
}

/**
 * 인라인 배경 색상 클래스 반환
 *
 * @param color - Notion 배경 색상 이름
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * getInlineBackgroundColorClass('blue_background') // 'not-prose bg-blue-100 dark:bg-blue-700 ...'
 */
export function getInlineBackgroundColorClass(color: NotionBackgroundColor): string {
  return INLINE_BACKGROUND_COLOR_CLASSES[color];
}

/**
 * 블록 배경 색상 클래스 반환
 * quote, callout 등 블록 레벨 요소에서 사용
 *
 * @param color - Notion 배경 색상 이름
 * @returns 배경, 텍스트, 테두리 색상 클래스 객체
 *
 * @example
 * getBlockBackgroundColorClasses('blue_background')
 * // { bg: 'bg-blue-100/50 ...', text: 'text-blue-900 ...', border: 'rgb(37 99 235)', borderClass: 'border-blue-600 ...' }
 */
export function getBlockBackgroundColorClasses(color: string): BlockBackgroundColorClasses {
  return BLOCK_BACKGROUND_COLOR_CLASSES[color as NotionBackgroundColor] || DEFAULT_BLOCK_BACKGROUND;
}

/**
 * Notion 색상을 Tailwind CSS 클래스로 변환 (통합 함수)
 *
 * 텍스트 색상과 배경 색상을 자동으로 구분하여 적절한 클래스 반환
 *
 * @param color - Notion 색상 이름
 * @returns Tailwind CSS 클래스 문자열
 *
 * @example
 * getNotionColorClass('blue') // 'text-blue-600 dark:text-blue-400'
 * getNotionColorClass('blue_background') // 'not-prose bg-blue-100 dark:bg-blue-700 ...'
 */
export function getNotionColorClass(color: string): string {
  // 배경 색상인 경우
  if (color.endsWith('_background')) {
    return getInlineBackgroundColorClass(color as NotionBackgroundColor);
  }

  // 텍스트 색상인 경우
  return getTextColorClass(color as NotionColor);
}
