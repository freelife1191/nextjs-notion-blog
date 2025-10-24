/**
 * Code Block Renderer
 *
 * Notion 코드 블록을 HTML로 변환하는 렌더러
 * Prism.js를 사용한 구문 강조 지원
 */

import { NotionBlock, NotionRichText } from '../renderer';
import { escapeHtml } from '@/lib/utils';

/**
 * 언어 코드를 Prism.js 클래스로 매핑
 */
const LANGUAGE_CLASS_MAP: Record<string, string> = {
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'python': 'python',
  'py': 'python',
  'java': 'java',
  'cpp': 'cpp',
  'c': 'c',
  'csharp': 'csharp',
  'cs': 'csharp',
  'php': 'php',
  'ruby': 'ruby',
  'go': 'go',
  'rust': 'rust',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'scala': 'scala',
  'html': 'markup',
  'xml': 'markup',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'sql': 'sql',
  'bash': 'bash',
  'shell': 'bash',
  'sh': 'bash',
  'powershell': 'powershell',
  'ps1': 'powershell',
  'dockerfile': 'dockerfile',
  'markdown': 'markdown',
  'md': 'markdown',
  'text': 'text',
  'plain': 'text'
} as const;

/**
 * 언어 코드를 사람이 읽을 수 있는 라벨로 매핑
 */
const LANGUAGE_LABEL_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'python': 'Python',
  'py': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'csharp': 'C#',
  'cs': 'C#',
  'php': 'PHP',
  'ruby': 'Ruby',
  'go': 'Go',
  'rust': 'Rust',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'scala': 'Scala',
  'html': 'HTML',
  'xml': 'XML',
  'css': 'CSS',
  'scss': 'SCSS',
  'sass': 'Sass',
  'less': 'Less',
  'json': 'JSON',
  'yaml': 'YAML',
  'yml': 'YAML',
  'sql': 'SQL',
  'bash': 'Bash',
  'shell': 'Shell',
  'sh': 'Shell',
  'powershell': 'PowerShell',
  'ps1': 'PowerShell',
  'dockerfile': 'Dockerfile',
  'markdown': 'Markdown',
  'md': 'Markdown',
  'text': 'Text',
  'plain': 'Plain Text'
} as const;

/**
 * 언어 코드를 Prism.js 클래스로 변환
 */
export function getLanguageClass(language: string): string {
  return LANGUAGE_CLASS_MAP[language.toLowerCase()] || 'text';
}

/**
 * 언어 코드를 표시용 라벨로 변환
 */
export function getLanguageLabel(language: string): string {
  return LANGUAGE_LABEL_MAP[language.toLowerCase()] || language.toUpperCase();
}

/**
 * 코드 블록을 HTML로 렌더링
 *
 * @param block - Notion 코드 블록
 * @param renderRichText - Rich text 렌더링 함수 (renderer에서 주입) - UNUSED, kept for compatibility
 * @returns HTML 문자열
 */
export function renderCodeBlock(
  block: NotionBlock,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderRichText: (richText: NotionRichText[]) => string
): string {
  // Extract plain text from rich_text array and escape HTML entities
  // This prevents HTML code in code blocks from being rendered as actual HTML
  const richTextArray = block.code?.rich_text || [];
  const plainText = richTextArray
    .map((rt: NotionRichText) => rt.plain_text || rt.text?.content || '')
    .join('');
  const escapedText = escapeHtml(plainText);

  const language = block.code?.language || 'text';

  // 언어별 클래스 매핑
  const languageClass = getLanguageClass(language);

  // 언어 표시명
  const languageLabel = getLanguageLabel(language);

  // 고유 ID 생성
  const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;

  return `<div class="code-block-wrapper relative my-6 group" data-code-block="${blockId}">
    <div class="code-block-header flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-100 text-xs font-mono rounded-t-lg border-b border-gray-700">
      <span class="language-label">${languageLabel}</span>
      <button
        class="copy-button opacity-0 group-hover:opacity-100 transition-all duration-200 px-2 py-1 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 hover:scale-105 rounded text-xs text-gray-100 dark:text-gray-100"
        data-copy-btn="${blockId}"
      >
        Copy
      </button>
    </div>
    <pre class="language-${languageClass} !mt-0 !rounded-t-none"><code class="language-${languageClass}">${escapedText}</code></pre>
  </div>`;
}
