/**
 * Notion 블록을 HTML로 변환하는 렌더러
 * 다양한 Notion 블록 타입을 지원하며, 웹 호환 HTML로 변환
 */

import {
  getBadgeColorClasses,
  getNotionColorClass,
  getBlockBackgroundColorClasses,
} from '@/lib/color-utils';
import { generateId } from '@/lib/toc';
import { renderCodeBlock } from './renderers/code-block';
import { logger } from '@/lib/logger';

export interface NotionBlock {
  type: string;
  id?: string;
  [key: string]: any;
}

export interface NotionRichText {
  type: string;
  text?: {
    content: string;
    link?: { url: string };
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text?: string;
  href?: string;
}

export class NotionRenderer {
  private static instance: NotionRenderer;
  private notionClient?: any; // NotionClientApi 타입

  static getInstance(): NotionRenderer {
    if (!NotionRenderer.instance) {
      NotionRenderer.instance = new NotionRenderer();
    }
    return NotionRenderer.instance;
  }

  /**
   * Notion Client 설정 (링크드 데이터베이스 쿼리용)
   */
  setNotionClient(client: any) {
    this.notionClient = client;
  }

  /**
   * Notion 블록 배열을 HTML로 변환
   */
  renderBlocks(blocks: NotionBlock[]): string {
    if (!Array.isArray(blocks)) {
      return '';
    }

    const result: string[] = [];
    let i = 0;

    while (i < blocks.length) {
      const block = blocks[i];
      
      if (block.type === 'bulleted_list_item') {
        // 연속된 bulleted_list_item들을 찾아서 <ul>로 감싸기
        const listItems: string[] = [];
        while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
          listItems.push(this.renderBulletedListItem(blocks[i]));
          i++;
        }
        result.push(`<ul class="list-disc pl-12 mb-4 text-gray-700 dark:text-gray-300">${listItems.join('')}</ul>`);
      } else if (block.type === 'numbered_list_item') {
        // 연속된 numbered_list_item들을 찾아서 <ol>로 감싸기
        const listItems: string[] = [];
        while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
          listItems.push(this.renderNumberedListItem(blocks[i]));
          i++;
        }
        result.push(`<ol class="list-decimal pl-12 mb-4 text-gray-700 dark:text-gray-300">${listItems.join('')}</ol>`);
      } else {
        result.push(this.renderBlock(block));
        i++;
      }
    }

    return result.filter(Boolean).join('\n');
  }

  /**
   * 단일 Notion 블록을 HTML로 변환
   */
  private renderBlock(block: NotionBlock): string {
    if (!block || !block.type) {
      return '';
    }

    try {
      switch (block.type) {
        case 'paragraph':
          return this.renderParagraph(block);
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
          return this.renderHeading(block);
        case 'bulleted_list_item':
        case 'numbered_list_item':
          // 이 블록들은 renderBlocks에서 그룹화되어 처리됨
          return '';
        case 'to_do':
          return this.renderTodo(block);
        case 'toggle':
          return this.renderToggle(block);
        case 'code':
          return this.renderCode(block);
        case 'quote':
          return this.renderQuote(block);
        case 'callout':
          return this.renderCallout(block);
        case 'divider':
          return this.renderDivider();
        case 'image':
          return this.renderImage(block);
        case 'video':
          return this.renderVideo(block);
        case 'audio':
          return this.renderAudio(block);
        case 'file':
          return this.renderFile(block);
        case 'table':
          return this.renderTable(block);
        case 'column_list':
          return this.renderColumnList(block);
        case 'column':
          return this.renderColumn(block);
        case 'bookmark':
          return this.renderBookmark(block);
        case 'embed':
          return this.renderEmbed(block);
        case 'pdf':
          return this.renderPdf(block);
        case 'link_preview':
          return this.renderLinkPreview(block);
        case 'synced_block':
          return this.renderSyncedBlock(block);
        case 'child_page':
          return this.renderChildPage(block);
        case 'child_database':
          return this.renderChildDatabase(block);
        case 'table_of_contents':
          return this.renderTableOfContents(block);
        case 'equation':
          return this.renderEquation(block);
        case 'breadcrumb':
          return this.renderBreadcrumb(block);
        case 'template':
          return this.renderTemplate(block);
        case 'link_to_page':
          return this.renderLinkToPage(block);
        default:
          logger.warn(`Unsupported block type: ${block.type}`);
          return this.renderUnsupportedBlock(block);
      }
    } catch (error) {
      logger.error(`Error rendering block type ${block.type}:`, error);
      return '';
    }
  }

  /**
   * Rich Text 배열을 HTML로 변환
   */
  private renderRichText(richText: NotionRichText[]): string {
    if (!Array.isArray(richText)) {
      return '';
    }

    return richText
      .map(text => this.renderTextElement(text))
      .join('');
  }

  /**
   * 단일 Rich Text 요소를 HTML로 변환
   */
  private renderTextElement(text: NotionRichText): string {
    if (!text) return '';

    let content = text.plain_text || text.text?.content || '';
    const annotations = text.annotations || {};
    const link = text.text?.link || text.href;

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
    if (annotations.code) {
      content = `<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">${content}</code>`;
    }

    // Mention 타입 처리 (링크 멘션) - 가장 나중에 처리
    if (text.type === 'mention' && (text as any).mention) {
      const mention = (text as any).mention;

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
          <span class="font-medium">${this.escapeHtml(content)}</span>
          <svg class="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </a>`;
      }
      // User mention
      else if (mention.type === 'user' && mention.user) {
        content = `<span class="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">${content}</span>`;
      }
      // Date mention
      else if (mention.type === 'date' && mention.date) {
        content = `<span class="text-gray-700 dark:text-gray-300">${content}</span>`;
      }
      // Link preview mention
      else if (mention.type === 'link_preview' && mention.link_preview) {
        const url = mention.link_preview.url;
        content = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">${content}</a>`;
      }
    }
    // 일반 링크 처리 - 가장 나중에 처리
    else if (link) {
      const href = typeof link === 'string' ? link : link.url;
      content = `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">${content}</a>`;
    }

    return content;
  }

  private renderParagraph(block: NotionBlock): string {
    const richText = block.paragraph?.rich_text || [];

    // link_mention이 포함된 경우 특별 처리
    const linkMention = richText.find((text: any) =>
      text.type === 'mention' && text.mention?.type === 'link_mention'
    );

    if (linkMention) {
      const mention = (linkMention as any).mention.link_mention;
      const url = mention.href || mention.url;
      const description = mention.description;
      const provider = mention.link_provider;
      const author = mention.link_author;
      const iconUrl = mention.icon_url;

      // description의 첫 줄을 제목으로 사용 (YouTube 제목)
      const title = description ? description.split('\n')[0].trim() : ((linkMention as any).plain_text || url);

      // 노션 스타일의 간단한 링크 멘션 (인라인)
      // 아이콘 + 저자(회색) + 타이틀(밑줄)
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-mention-inline">
        ${iconUrl && iconUrl.endsWith('.png') && !iconUrl.includes('og-image') ?
          `<img src="${iconUrl}" alt="${provider}" class="link-mention-inline-icon" />` :
          `<svg class="link-mention-inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>`}
        ${author ? `<span class="link-mention-author-inline">${this.escapeHtml(author)}</span>` : ''}
        <span class="link-mention-title-inline">${this.escapeHtml(title)}</span>
      </a>`;
    }

    // 블록 레벨 배경색 확인
    const paragraphData = block.paragraph;
    const blockColor = paragraphData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';

    // rich_text 내부 개별 색상 확인
    const hasTextColor = richText.some((text: NotionRichText) =>
      text.annotations?.color && text.annotations.color !== 'default'
    );

    let colorClass = '';
    let wrappedText = '';

    if (hasBlockColor) {
      // 블록 전체에 배경색이 있으면 p 태그에 직접 적용
      const bgColorClass = getNotionColorClass(blockColor);
      colorClass = `${bgColorClass}`;
      wrappedText = this.renderRichText(richText);
    } else if (hasTextColor) {
      // 텍스트 개별 색상은 renderRichText에서 처리됨
      colorClass = 'text-gray-700 dark:text-gray-300';
      wrappedText = this.renderRichText(richText);
    } else {
      // 색상이 없으면 기본 색상
      colorClass = 'text-gray-700 dark:text-gray-300';
      wrappedText = this.renderRichText(richText);
    }

    return `<p class="${colorClass} leading-relaxed mb-4">${wrappedText}</p>`;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  private renderHeading(block: NotionBlock): string {
    const level = parseInt(block.type.split('_')[1]);
    const headingData = block[block.type];
    const richText = headingData?.rich_text || [];
    const isToggleable = headingData?.is_toggleable;
    const children = headingData?.children || [];
    const blockColor = headingData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';

    // Extract plain text for ID generation (to match TOC generation)
    const plainText = richText.map((text: NotionRichText) => text.plain_text || '').join('');
    const id = generateId(plainText);

    // Render HTML for display
    const htmlText = this.renderRichText(richText);

    const sizeClasses = {
      1: 'text-3xl font-bold mb-6 mt-8',
      2: 'text-2xl font-semibold mb-4 mt-6',
      3: 'text-xl font-semibold mb-3 mt-5'
    };

    // 블록 레벨 색상 클래스 적용
    let colorClass = '';
    if (hasBlockColor) {
      colorClass = getNotionColorClass(blockColor);
    } else {
      colorClass = 'text-gray-900 dark:text-white';
    }

    // 토글 가능한 제목인 경우
    if (isToggleable) {
      return `<details class="toggle-heading-block group" style="list-style: none; margin: 1rem 0;">
      <summary class="cursor-pointer select-none list-none flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 -mx-2 transition-colors" style="list-style: none;">
        <svg class="toggle-arrow w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
        <h${level} id="${id}" class="${sizeClasses[level as keyof typeof sizeClasses]} ${colorClass}" style="margin: 0;">${htmlText}</h${level}>
      </summary>
      <div class="toggle-content" style="margin-left: calc(0.75rem + 0.5rem + 0.5rem); margin-top: 0.5rem;">
        ${this.renderBlocks(children)}
      </div>
    </details>
    <style>
      details.toggle-heading-block[open] > summary > svg {
        transform: rotate(90deg);
      }
      .toggle-heading-block .toggle-content > * {
        margin-top: 0 !important;
        margin-bottom: 0.5rem !important;
      }
      .toggle-heading-block .toggle-content > *:last-child {
        margin-bottom: 0 !important;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::marker {
        display: none;
      }
    </style>`;
    }

    // 일반 제목
    return `<h${level} id="${id}" class="${sizeClasses[level as keyof typeof sizeClasses]} ${colorClass}">${htmlText}</h${level}>`;
  }

  private renderBulletedListItem(block: NotionBlock): string {
    const bulletedListData = block.bulleted_list_item;
    const richText = bulletedListData?.rich_text || [];
    const blockColor = bulletedListData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';
    const children = bulletedListData?.children || [];
    const childrenHtml = children.length > 0 ? this.renderBlocks(children) : '';

    let colorClass = '';
    if (hasBlockColor) {
      colorClass = getNotionColorClass(blockColor);
    } else {
      colorClass = 'text-gray-700 dark:text-gray-300';
    }

    const text = this.renderRichText(richText);
    return `<li class="${colorClass} leading-relaxed mb-2">${text}${childrenHtml}</li>`;
  }

  private renderNumberedListItem(block: NotionBlock): string {
    const numberedListData = block.numbered_list_item;
    const richText = numberedListData?.rich_text || [];
    const blockColor = numberedListData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';
    const children = numberedListData?.children || [];
    const childrenHtml = children.length > 0 ? this.renderBlocks(children) : '';

    let colorClass = '';
    if (hasBlockColor) {
      colorClass = getNotionColorClass(blockColor);
    } else {
      colorClass = 'text-gray-700 dark:text-gray-300';
    }

    const text = this.renderRichText(richText);
    return `<li class="${colorClass} leading-relaxed mb-2">${text}${childrenHtml}</li>`;
  }

  private renderTodo(block: NotionBlock): string {
    const text = this.renderRichText(block.to_do?.rich_text || []);
    const checked = block.to_do?.checked ? 'checked' : '';
    return `<div class="mb-2 text-gray-700 dark:text-gray-300" style="padding-left: 3rem;">
      <div class="flex items-start leading-relaxed">
        <input type="checkbox" ${checked} class="mt-1 mr-2 flex-shrink-0" disabled style="margin-left: -2.3rem;">
        <span>${text}</span>
      </div>
    </div>`;
  }

  private renderToggle(block: NotionBlock): string {
    const toggleData = block.toggle;
    const richText = toggleData?.rich_text || [];
    const blockColor = toggleData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';
    const children = toggleData?.children || [];

    let colorClass = '';
    if (hasBlockColor) {
      colorClass = getNotionColorClass(blockColor);
    } else {
      colorClass = 'font-medium text-gray-900 dark:text-gray-100';
    }

    const text = this.renderRichText(richText);

    return `<details class="toggle-block my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <summary class="toggle-summary cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
        <svg class="toggle-arrow w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="${colorClass}">${text}</span>
      </summary>
      <div class="toggle-content px-4 py-3 bg-white dark:bg-gray-900">
        ${this.renderBlocks(children)}
      </div>
    </details>`;
  }

  private renderCode(block: NotionBlock): string {
    return renderCodeBlock(block, this.renderRichText.bind(this));
  }

  private renderQuote(block: NotionBlock): string {
    const quoteData = block.quote;
    const richText = quoteData?.rich_text || [];
    const blockColor = quoteData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';

    let colorClass = '';
    let bgColorClass = '';

    if (hasBlockColor) {
      // 블록 색상이 배경색(_background)인 경우
      if (blockColor.endsWith('_background')) {
        const bgClasses = getBlockBackgroundColorClasses(blockColor);
        bgColorClass = bgClasses.bg;
        colorClass = bgClasses.text;
      } else {
        // 텍스트 색상만 있는 경우
        colorClass = getNotionColorClass(blockColor);
        bgColorClass = 'bg-gray-50 dark:bg-gray-800/30';
      }
    } else {
      // 기본 색상 - Tailwind Typography 기본 스타일 사용
      bgColorClass = '';
      colorClass = '';
    }

    const text = this.renderRichText(richText).trim();

    // Tailwind Typography의 기본 blockquote 스타일 사용
    // prose에서 자동으로 왼쪽 border, 패딩, 이탤릭 등이 적용됨
    const additionalClasses = hasBlockColor ? `${colorClass} ${bgColorClass} px-4 py-2 rounded` : '';

    return `<blockquote class="whitespace-pre-wrap ${additionalClasses}">${text}</blockquote>`;
  }

  private renderCallout(block: NotionBlock): string {
    const calloutData = block.callout;
    const richText = calloutData?.rich_text || [];
    const blockColor = calloutData?.color;
    const hasBlockColor = blockColor && blockColor !== 'default';
    const icon = calloutData?.icon?.emoji || '💡';
    const children = calloutData?.children || [];
    const childrenHtml = children.length > 0 ? this.renderBlocks(children) : '';

    let colorClass = '';
    if (hasBlockColor) {
      colorClass = getNotionColorClass(blockColor);
    } else {
      colorClass = '';
    }

    const text = this.renderRichText(richText);

    return `<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 my-6 ${colorClass}">
      <div class="flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">${icon}</span>
        <div class="flex-1">
          ${text ? `<div class="text-sm leading-relaxed mb-2">${text}</div>` : ''}
          ${childrenHtml}
        </div>
      </div>
    </div>`;
  }

  private renderDivider(): string {
    return '<hr class="my-8 bg-border shrink-0 h-px w-full">';
  }

  private renderImage(block: NotionBlock): string {
    const image = block.image;
    const url = image?.external?.url || image?.file?.url;
    const caption = this.renderRichText(image?.caption || []);

    if (!url) return '';

    return `<figure class="my-6" style="max-width: 100%; margin-left: auto; margin-right: auto;">
      <img
        src="${url}"
        alt="${caption || 'Post image'}"
        class="rounded-lg shadow-md"
        style="display: block; max-width: 100%; height: auto; object-fit: contain;"
        loading="lazy"
        decoding="async"
      >
      ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${caption}</figcaption>` : ''}
    </figure>`;
  }

  private renderVideo(block: NotionBlock): string {
    const video = block.video;
    const url = video?.external?.url || video?.file?.url;
    const caption = this.renderRichText(video?.caption || []);

    if (!url) return '';

    // YouTube URL 처리
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        return `<figure class="video-embed">
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              class="w-full h-full">
            </iframe>
          </div>
          ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
        </figure>`;
      }
    }

    // Vimeo URL 처리
    if (url.includes('vimeo.com')) {
      const videoId = this.extractVimeoId(url);
      if (videoId) {
        return `<figure class="video-embed">
          <div class="video-container">
            <iframe
              src="https://player.vimeo.com/video/${videoId}"
              frameborder="0"
              allowfullscreen
              allow="autoplay; fullscreen; picture-in-picture"
              class="w-full h-full">
            </iframe>
          </div>
          ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
        </figure>`;
      }
    }

    // 일반 비디오 파일
    return `<figure class="my-6">
      <video controls class="w-full h-auto rounded-lg shadow-md">
        <source src="${url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${caption}</figcaption>` : ''}
    </figure>`;
  }

  private renderAudio(block: NotionBlock): string {
    const audio = block.audio;
    const url = audio?.external?.url || audio?.file?.url;
    const caption = this.renderRichText(audio?.caption || []);

    if (!url) return '';

    return `<figure class="my-6">
      <audio controls class="w-full rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
        <source src="${url}" type="audio/mpeg">
        <source src="${url}" type="audio/ogg">
        <source src="${url}" type="audio/wav">
        Your browser does not support the audio element.
      </audio>
      ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${caption}</figcaption>` : ''}
    </figure>`;
  }

  private renderFile(block: NotionBlock): string {
    const file = block.file;
    const url = file?.external?.url || file?.file?.url;
    const name = file?.name || 'Download File';
    
    if (!url) return '';
    
    return `<div class="file-download">
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="flex items-center">
        <div class="file-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="file-content">
          <div class="file-name">${name}</div>
        </div>
      </a>
    </div>`;
  }

  private renderTable(block: NotionBlock): string {
    const table = block.table;
    const hasColumnHeader = table?.has_column_header || false;

    // Children에서 table_row 블록들을 가져옴
    const rows = table?.children || table?.table_rows || [];

    if (rows.length === 0) return '';

    const headerRow = hasColumnHeader ? rows[0] : null;
    const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

    let html = '<div class="relative w-full overflow-auto my-6">';
    html += '<table class="w-full caption-bottom text-sm">';

    // 헤더 (has_column_header가 true인 경우에만)
    if (headerRow) {
      html += '<thead class="border-b">';
      html += '<tr class="border-b transition-colors hover:bg-muted/50">';
      headerRow.table_row?.cells?.forEach((cell: any) => {
        const cellText = this.renderRichText(cell || []);
        html += `<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">${cellText}</th>`;
      });
      html += '</tr>';
      html += '</thead>';
    }

    // 바디
    if (bodyRows.length > 0) {
      html += '<tbody class="[&_tr:last-child]:border-0">';
      bodyRows.forEach((row: any) => {
        html += '<tr class="border-b transition-colors hover:bg-muted/50">';
        row.table_row?.cells?.forEach((cell: any) => {
          const cellText = this.renderRichText(cell || []);
          html += `<td class="p-4 align-middle">${cellText}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';
    }

    html += '</table>';
    html += '</div>';

    return html;
  }

  private renderColumnList(block: NotionBlock): string {
    const children = block.column_list?.children || [];
    const columnCount = children.length;

    // 동적으로 grid-cols 클래스 결정
    const gridClass = columnCount === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnCount === 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : columnCount === 4
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2';

    return `<div class="column-layout grid ${gridClass} gap-6 my-6">
      ${children.map((child: NotionBlock) => this.renderColumn(child)).join('')}
    </div>`;
  }

  private renderColumn(block: NotionBlock): string {
    const children = block.column?.children || [];
    return `<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow duration-200 space-y-4">
      ${this.renderBlocks(children)}
    </div>`;
  }

  private renderBookmark(block: NotionBlock): string {
    const bookmark = block.bookmark;
    const url = bookmark?.url;
    const caption = this.renderRichText(bookmark?.caption || []);

    if (!url) return '';

    // YouTube 북마크인 경우 풍부한 카드 형태로 표시
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : '';

      // caption에서 제목과 설명 추출
      // HTML 태그 제거
      const captionText = (caption || '').replace(/<[^>]*>/g, '');
      const lines = captionText.split('\n').filter(line => line.trim());

      // caption이 있으면 사용, 없으면 URL을 제목으로 사용
      const title = lines[0] || url;
      // 설명은 여러 줄 포함 (높이 32px에 맞게 자연스럽게 잘림)
      const description = lines.slice(1).join('\n').trim();

      return `<div class="not-prose youtube-bookmark">
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="youtube-bookmark-card">
          <div class="youtube-bookmark-content">
            <div class="youtube-bookmark-title">${this.escapeHtml(title)}</div>
            ${description ? `<div class="youtube-bookmark-description">${this.escapeHtml(description)}</div>` : ''}
            <div class="youtube-bookmark-footer">
              <img src="https://www.youtube.com/s/desktop/3d178601/img/favicon_144x144.png" alt="YouTube" class="youtube-bookmark-icon" />
              <span class="youtube-bookmark-url">${url}</span>
            </div>
          </div>
          ${thumbnailUrl ? `<div class="youtube-bookmark-thumbnail" style="background-image: url('${thumbnailUrl}'); background-size: cover; background-position: center;"></div>` : ''}
        </a>
      </div>`;
    }

    // 일반 북마크 - Notion 스타일
    const domain = this.extractDomain(url);

    return `<div class="not-prose regular-bookmark">
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="regular-bookmark-card">
        <div class="regular-bookmark-content">
          <div class="regular-bookmark-title">${this.escapeHtml(domain)}</div>
          <div class="regular-bookmark-url">${this.escapeHtml(url)}</div>
        </div>
      </a>
    </div>`;
  }

  private renderEmbed(block: NotionBlock): string {
    const embed = block.embed;
    const url = embed?.url;
    const caption = this.renderRichText(embed?.caption || []);

    if (!url) return '';

    // 이미지 URL 확인 (jpg, jpeg, png, gif, webp, svg, bmp)
    // URL에서 쿼리 파라미터와 해시를 제거하고 확장자 확인
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/i;
    const isImage = imageExtensions.test(url);

    if (isImage) {
      return `<figure class="my-6" style="max-width: 100%; margin-left: auto; margin-right: auto;">
        <img
          src="${url}"
          alt="${caption || 'Embedded image'}"
          class="rounded-lg shadow-md"
          style="display: block; max-width: 100%; height: auto; object-fit: contain;"
          loading="lazy"
          decoding="async"
        >
        ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${caption}</figcaption>` : ''}
      </figure>`;
    }

    // YouTube URL 처리
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      if (videoId) {
        return `<figure class="video-embed">
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              class="w-full h-full">
            </iframe>
          </div>
          ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
        </figure>`;
      }
    }

    // Vimeo URL 처리
    if (url.includes('vimeo.com')) {
      const videoId = this.extractVimeoId(url);
      if (videoId) {
        return `<figure class="video-embed">
          <div class="video-container">
            <iframe
              src="https://player.vimeo.com/video/${videoId}"
              frameborder="0"
              allowfullscreen
              allow="autoplay; fullscreen; picture-in-picture"
              class="w-full h-full">
            </iframe>
          </div>
          ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
        </figure>`;
      }
    }

    // 일반 임베드 (비디오나 기타 임베드 가능한 콘텐츠)
    return `<figure class="video-embed">
      <div class="video-container">
        <iframe
          src="${url}"
          frameborder="0"
          allowfullscreen>
        </iframe>
      </div>
      ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
    </figure>`;
  }

  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  private extractVimeoId(url: string): string | null {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  private renderPdf(block: NotionBlock): string {
    const pdf = block.pdf;
    const url = pdf?.external?.url || pdf?.file?.url;
    const caption = this.renderRichText(pdf?.caption || []);

    if (!url) return '';

    // 이미지 URL인 경우 img 태그로 렌더링
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/i;
    if (imageExtensions.test(url)) {
      return `<figure class="my-6" style="max-width: 100%; margin-left: auto; margin-right: auto;">
        <img
          src="${url}"
          alt="${caption || 'PDF image'}"
          class="rounded-lg shadow-md"
          style="display: block; max-width: 100%; height: auto; object-fit: contain;"
          loading="lazy"
          decoding="async"
        >
        ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${caption}</figcaption>` : ''}
      </figure>`;
    }

    // 실제 PDF 파일만 iframe으로 렌더링
    return `<figure class="video-embed">
      <div class="video-container" style="padding-bottom: 100% !important;">
        <iframe
          src="${url}#view=FitH"
          frameborder="0"
          allowfullscreen
          class="w-full h-full">
        </iframe>
      </div>
      ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">${caption}</figcaption>` : ''}
    </figure>`;
  }

  private renderLinkPreview(block: NotionBlock): string {
    const linkPreview = block.link_preview;
    const url = linkPreview?.url;

    if (!url) return '';

    return `<div class="bookmark">
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="flex items-center">
        <div class="bookmark-icon">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
        <div class="bookmark-content">
          <div class="bookmark-url">${url}</div>
        </div>
      </a>
    </div>`;
  }

  /**
   * 동기화 블록 렌더링
   */
  private renderSyncedBlock(block: NotionBlock): string {
    // synced_block은 자식 블록을 직접 포함하지 않으므로
    // 별도로 처리되어야 함 (NotionClient에서 처리)
    // 여기서는 자식 블록이 이미 포함된 경우만 렌더링
    const children = (block as any).children || [];

    if (children.length === 0) {
      // 자식이 없으면 빈 컨테이너 표시
      return `<div class="synced-block my-4 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r">
        <p class="text-sm text-gray-500 dark:text-gray-400">🔗 동기화 블록 (내용이 로드되지 않음)</p>
      </div>`;
    }

    // 동기화 블록의 하위 블록들을 렌더링
    return `<div class="synced-block my-4 border-l-4 border-blue-500 pl-4">
      ${this.renderBlocks(children)}
    </div>`;
  }

  /**
   * 하위 페이지 렌더링
   */
  private renderChildPage(block: NotionBlock): string {
    const childPage = block.child_page;
    const title = childPage?.title || 'Untitled';
    const pageId = block.id || 'unknown';

    // Notion 페이지 URL 생성
    const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

    // 하위 페이지를 Notion 링크로 렌더링 (새 탭에서 열기)
    return `<div class="child-page my-4">
      <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <div class="flex-1">
          <span class="font-medium text-gray-900 dark:text-gray-100">${this.escapeHtml(title)}</span>
          <svg class="w-4 h-4 text-gray-400 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </div>
      </a>
    </div>`;
  }

  /**
   * 하위 데이터베이스 렌더링
   */
  private renderChildDatabase(block: NotionBlock): string {
    const childDatabase = block.child_database;
    const title = childDatabase?.title || 'Database';
    const databaseId = block.id || 'unknown';
    const databaseRows = childDatabase?.database_rows || [];
    const propertyNames = (childDatabase?.property_names || []).reverse();

    // Notion 데이터베이스 URL 생성
    const notionUrl = `https://www.notion.so/${databaseId.replace(/-/g, '')}`;

    // 데이터베이스 데이터가 없으면 빈 테이블 표시
    if (databaseRows.length === 0 || propertyNames.length === 0) {
      return `<div class="child-database my-6">
        <div class="mb-4 flex items-center gap-2">
          <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">${this.escapeHtml(title)}</h3>
          <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </a>
        </div>
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <tbody class="[&_tr:last-child]:border-0">
              <tr class="border-b transition-colors">
                <td class="p-4 align-middle text-center text-gray-500 dark:text-gray-400">
                  데이터가 없습니다
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }

    // 데이터베이스 데이터를 테이블로 렌더링
    let tableHtml = `<div class="child-database my-6">
      <div class="mb-4 flex items-center gap-2">
        <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">${this.escapeHtml(title)}</h3>
        <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </a>
      </div>
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="border-b">
            <tr class="border-b transition-colors hover:bg-muted/50">`;

    // 테이블 헤더 렌더링
    propertyNames.forEach((propName: string) => {
      tableHtml += `<th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">${this.escapeHtml(propName)}</th>`;
    });

    tableHtml += `</tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">`;

    // 테이블 행 렌더링
    databaseRows.forEach((row: any) => {
      tableHtml += '<tr class="border-b transition-colors hover:bg-muted/50">';

      propertyNames.forEach((propName: string) => {
        const property = row.properties?.[propName];
        let cellContent = '';

        if (property) {
          cellContent = this.renderDatabaseProperty(property);
        }

        tableHtml += `<td class="p-4 align-middle">${cellContent}</td>`;
      });

      tableHtml += '</tr>';
    });

    tableHtml += `</tbody>
        </table>
      </div>
    </div>`;

    return tableHtml;
  }

  /**
   * 데이터베이스 속성을 HTML로 렌더링
   */
  private renderDatabaseProperty(property: any): string {
    if (!property || !property.type) {
      return '';
    }

    const type = property.type;
    const value = property[type];

    switch (type) {
      case 'title':
        return this.renderRichText(value || []);

      case 'rich_text':
        return this.renderRichText(value || []);

      case 'number':
        return value !== null ? String(value) : '';

      case 'select':
        if (value && value.name) {
          const color = value.color || 'default';
          const colorClasses = getBadgeColorClasses(color);
          return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClasses}">${this.escapeHtml(value.name)}</span>`;
        }
        return '';

      case 'multi_select':
        if (Array.isArray(value)) {
          const tags = value.map((item: any) => {
            const color = item.color || 'default';
            const colorClasses = getBadgeColorClasses(color);
            return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClasses}">${this.escapeHtml(item.name)}</span>`;
          }).join('');
          return `<div class="flex flex-wrap gap-2">${tags}</div>`;
        }
        return '';

      case 'date':
        if (value && value.start) {
          const startDate = new Date(value.start).toLocaleDateString();
          if (value.end) {
            const endDate = new Date(value.end).toLocaleDateString();
            return `${startDate} → ${endDate}`;
          }
          return startDate;
        }
        return '';

      case 'checkbox':
        return value ? '✓' : '';

      case 'url':
        if (value) {
          return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${this.escapeHtml(value)}</a>`;
        }
        return '';

      case 'email':
        if (value) {
          return `<a href="mailto:${value}" class="text-blue-600 dark:text-blue-400 hover:underline">${this.escapeHtml(value)}</a>`;
        }
        return '';

      case 'phone_number':
        return value ? this.escapeHtml(value) : '';

      case 'status':
        if (value && value.name) {
          const color = value.color || 'default';
          const colorClasses = getBadgeColorClasses(color);
          return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorClasses}">${this.escapeHtml(value.name)}</span>`;
        }
        return '';

      default:
        return '';
    }
  }

  /**
   * Table of Contents 렌더링
   * Note: Notion의 TOC는 자동으로 생성되지만, 여기서는 간단한 플레이스홀더를 반환
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderTableOfContents(block: NotionBlock): string {
    // TOC는 페이지의 모든 헤딩을 자동으로 수집하여 표시해야 하지만,
    // 서버 사이드 렌더링에서는 전체 블록 컨텍스트에 접근할 수 없으므로
    // 클라이언트 사이드에서 처리하거나 플레이스홀더를 표시
    return `
      <div class="my-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📑 목차</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          이 페이지의 제목들로부터 목차가 자동으로 생성됩니다. 목록은 상단에 있습니다.
        </div>
      </div>
    `.trim();
  }

  /**
   * 수학 방정식 렌더링 (LaTeX)
   * KaTeX를 사용하여 클라이언트 사이드에서 렌더링
   */
  private renderEquation(block: NotionBlock): string {
    const equation = block.equation;
    if (!equation || !equation.expression) {
      return '';
    }

    const expression = equation.expression;
    // LaTeX 표현식을 HTML 엔티티로 이스케이프
    const escapedExpression = this.escapeHtml(expression);

    // KaTeX가 클라이언트 사이드에서 렌더링할 수 있도록 data 속성에 원본 LaTeX 저장
    return `
      <div class="my-8 flex justify-center w-full">
        <div class="katex-equation w-full max-w-4xl px-8 py-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto text-center text-gray-900 dark:text-gray-100" data-latex="${escapedExpression}">
          <span class="katex-display text-2xl">$$${escapedExpression}$$</span>
        </div>
      </div>
    `.trim();
  }

  /**
   * Breadcrumb 블록 렌더링
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderBreadcrumb(_block: NotionBlock): string {
    // Breadcrumb은 페이지 경로를 표시하는 네비게이션
    // 정적 사이트에서는 의미가 제한적이므로 간단한 표시만
    return `<div class="breadcrumb my-4 text-sm text-gray-500 dark:text-gray-400">
      <span>📍 Breadcrumb</span>
    </div>`;
  }

  /**
   * Template 블록 렌더링
   */
  private renderTemplate(block: NotionBlock): string {
    const template = block.template;
    const richText = template?.rich_text || [];
    const title = this.renderRichText(richText) || 'Template';

    // Template 버튼은 새 블록을 생성하는 기능이지만
    // 정적 사이트에서는 버튼으로만 표시
    return `<div class="template-block my-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
        <span class="font-medium">${title}</span>
      </div>
    </div>`;
  }

  /**
   * Link to Page 블록 렌더링
   */
  private renderLinkToPage(block: NotionBlock): string {
    const linkToPage = block.link_to_page;

    // page_id 타입인 경우
    if (linkToPage?.type === 'page_id' && linkToPage.page_id) {
      const pageId = linkToPage.page_id;
      const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

      return `<div class="link-to-page my-4">
        <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
          <svg class="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div class="flex-1">
            <span class="font-medium text-gray-900 dark:text-gray-100">Linked Page</span>
            <svg class="w-4 h-4 text-gray-400 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </div>
        </a>
      </div>`;
    }

    // database_id 타입인 경우
    if (linkToPage?.type === 'database_id' && linkToPage.database_id) {
      const databaseId = linkToPage.database_id;
      const notionUrl = `https://www.notion.so/${databaseId.replace(/-/g, '')}`;

      return `<div class="link-to-page my-4">
        <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
          <svg class="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
          </svg>
          <div class="flex-1">
            <span class="font-medium text-gray-900 dark:text-gray-100">Linked Database</span>
            <svg class="w-4 h-4 text-gray-400 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </div>
        </a>
      </div>`;
    }

    return '';
  }

  /**
   * 지원되지 않는 블록 렌더링
   * Notion 링크와 블록 타입을 표시 (하위 페이지 스타일)
   */
  private renderUnsupportedBlock(block: NotionBlock): string {
    const blockType = block.type;
    const blockId = block.id || 'unknown';

    // 블록 타입을 사람이 읽기 쉬운 이름으로 변환
    const blockTypeMap: Record<string, string> = {
      'breadcrumb': '브레드크럼',
      'template': '템플릿',
      'link_to_page': '페이지 링크',
      'table_row': '테이블 행',
      'unsupported': '지원되지 않는 블록',
    };

    const displayName = blockTypeMap[blockType] || blockType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Notion 블록 URL 생성
    const notionUrl = `https://www.notion.so/${blockId.replace(/-/g, '')}`;

    // 하위 페이지와 동일한 스타일 적용
    return `<div class="unsupported-block my-4">
      <a href="${notionUrl}" target="_blank" rel="noopener noreferrer" class="flex flex-col gap-2 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div class="flex-1">
            <span class="font-medium text-gray-900 dark:text-gray-100">${this.escapeHtml(displayName)}</span>
            <svg class="w-4 h-4 text-gray-400 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" x2="21" y1="14" y2="3"></line>
            </svg>
          </div>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 pl-8">
          ⚠️ 이 블록은 현재 지원되지 않습니다. Notion에서 확인하세요.
        </div>
      </a>
    </div>`;
  }

}

// 싱글톤 인스턴스 내보내기
export const notionRenderer = NotionRenderer.getInstance();
