/**
 * Code Block Renderer
 *
 * Notion 코드 블록을 HTML로 변환하는 렌더러
 * Prism.js를 사용한 구문 강조 지원
 */

import { NotionBlock, NotionRichText } from '../renderer';
import { escapeHtml } from '@/lib/utils';
import { getLanguageClass, getLanguageLabel } from '@/lib/languages';
import pako from 'pako';

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

  const language = block.code?.language || 'text';

  // Mermaid 다이어그램을 Kroki API로 렌더링 (탭 UI 포함)
  if (language.toLowerCase() === 'mermaid') {
    const blockId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    const escapedForAttribute = plainText.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    const escapedCode = escapeHtml(plainText);

    // Kroki API를 사용한 이미지 URL 생성
    // pako로 deflate 압축 후 base64 인코딩, URL-safe 변환
    try {
      const compressed = pako.deflate(plainText);
      const base64 = Buffer.from(compressed).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const krokiUrl = `https://kroki.io/mermaid/svg/${base64}`;

      return `<div class="mermaid-wrapper relative my-6 group" data-mermaid-block="${blockId}">
        <div class="code-block-header flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-100 text-xs font-mono rounded-t-lg border-b border-gray-700">
          <div class="flex items-center gap-2">
            <button
              class="mermaid-tab px-3 py-1 rounded transition-colors active"
              data-tab="diagram"
              data-block-id="${blockId}"
              onclick="window.switchMermaidTab('${blockId}', 'diagram')"
            >
              다이어그램
            </button>
            <button
              class="mermaid-tab px-3 py-1 rounded transition-colors"
              data-tab="code"
              data-block-id="${blockId}"
              onclick="window.switchMermaidTab('${blockId}', 'code')"
            >
              코드
            </button>
          </div>
          <button
            class="copy-button opacity-0 group-hover:opacity-100 transition-all duration-200 px-2 py-1 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 hover:scale-105 rounded text-xs text-gray-100 dark:text-gray-100"
            data-mermaid-copy="${blockId}"
            data-copy-text="${escapedForAttribute}"
          >
            Copy
          </button>
        </div>
        <div class="mermaid-content-wrapper">
          <!-- 다이어그램 탭 -->
          <div class="mermaid-tab-panel active" data-panel="diagram" data-block-id="${blockId}">
            <div class="mermaid-diagram bg-white dark:bg-gray-800 p-6 rounded-b-lg border border-gray-200 dark:border-gray-700 overflow-x-auto flex justify-center items-center" id="${blockId}">
              <img
                src="${krokiUrl}"
                alt="Mermaid Diagram"
                class="max-w-full h-auto"
                loading="lazy"
                onerror="this.parentElement.innerHTML='<div class=\\'text-red-500 p-4\\'>다이어그램 로드 실패</div>'"
              />
            </div>
          </div>
          <!-- 코드 탭 -->
          <div class="mermaid-tab-panel hidden" data-panel="code" data-block-id="${blockId}">
            <pre class="language-mermaid !mt-0 !rounded-t-none bg-gray-900 dark:bg-gray-950 p-6 rounded-b-lg border border-gray-200 dark:border-gray-700 overflow-x-auto"><code class="language-mermaid text-gray-100">${escapedCode}</code></pre>
          </div>
        </div>
        <script>
          if (!window.switchMermaidTab) {
            window.switchMermaidTab = function(blockId, tab) {
              const wrapper = document.querySelector('[data-mermaid-block="' + blockId + '"]');
              if (!wrapper) return;

              // 탭 버튼 전환
              wrapper.querySelectorAll('.mermaid-tab').forEach(btn => {
                if (btn.dataset.tab === tab) {
                  btn.classList.add('active');
                  btn.classList.add('bg-gray-700');
                  btn.classList.add('dark:bg-gray-800');
                } else {
                  btn.classList.remove('active');
                  btn.classList.remove('bg-gray-700');
                  btn.classList.remove('dark:bg-gray-800');
                }
              });

              // 패널 전환
              wrapper.querySelectorAll('.mermaid-tab-panel').forEach(panel => {
                if (panel.dataset.panel === tab) {
                  panel.classList.remove('hidden');
                  panel.classList.add('active');
                } else {
                  panel.classList.add('hidden');
                  panel.classList.remove('active');
                }
              });
            };
          }
        </script>
      </div>`;
    } catch (error) {
      console.error('Mermaid Kroki encoding error:', error);
      return `<div class="mermaid-wrapper relative my-6">
        <div class="text-red-500 p-4 border border-red-300 rounded">
          <p class="font-bold mb-2">다이어그램 인코딩 실패</p>
          <pre class="text-sm">${escapeHtml(plainText)}</pre>
        </div>
      </div>`;
    }
  }

  // 일반 코드 블록 (기존 로직)
  const escapedText = escapeHtml(plainText);
  const languageClass = getLanguageClass(language);
  const languageLabel = getLanguageLabel(language);
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
    <pre class="language-${languageClass} !mt-0 !rounded-t-none border border-t-0 border-gray-700 dark:border-gray-600"><code class="language-${languageClass}">${escapedText}</code></pre>
  </div>`;
}
