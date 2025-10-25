/**
 * Text Rendering Utilities Tests
 *
 * Tests for renderRichText, renderTextElement, and formatDateMention
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderRichText, renderTextElement, formatDateMention } from '../text';
import type { NotionRichText } from '../../renderer';

describe('renderRichText', () => {
  it('should return empty string for empty array', () => {
    expect(renderRichText([])).toBe('');
  });

  it('should return empty string for non-array input', () => {
    expect(renderRichText(null as any)).toBe('');
    expect(renderRichText(undefined as any)).toBe('');
  });

  it('should render single plain text', () => {
    const richText: NotionRichText[] = [
      {
        type: 'text',
        text: { content: 'Hello World' },
        plain_text: 'Hello World',
        annotations: {},
      },
    ];
    expect(renderRichText(richText)).toBe('Hello World');
  });

  it('should render multiple text elements', () => {
    const richText: NotionRichText[] = [
      { type: 'text', text: { content: 'Hello ' }, plain_text: 'Hello ', annotations: {} },
      { type: 'text', text: { content: 'World' }, plain_text: 'World', annotations: {} },
    ];
    expect(renderRichText(richText)).toBe('Hello World');
  });

  it('should escape HTML special characters', () => {
    const richText: NotionRichText[] = [
      {
        type: 'text',
        text: { content: '<script>alert("xss")</script>' },
        plain_text: '<script>alert("xss")</script>',
        annotations: {},
      },
    ];
    const result = renderRichText(richText);
    expect(result).toContain('&lt;script&gt;');
    expect(result).toContain('&quot;');
  });
});

describe('renderTextElement', () => {
  describe('basic text rendering', () => {
    it('should return empty string for null/undefined', () => {
      expect(renderTextElement(null as any)).toBe('');
      expect(renderTextElement(undefined as any)).toBe('');
    });

    it('should render plain text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Hello' },
        plain_text: 'Hello',
        annotations: {},
      };
      expect(renderTextElement(text)).toBe('Hello');
    });

    it('should escape HTML in plain text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: '<div>&</div>' },
        plain_text: '<div>&</div>',
        annotations: {},
      };
      expect(renderTextElement(text)).toBe('&lt;div&gt;&amp;&lt;/div&gt;');
    });
  });

  describe('text annotations', () => {
    it('should render bold text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Bold' },
        plain_text: 'Bold',
        annotations: { bold: true },
      };
      expect(renderTextElement(text)).toBe('<strong>Bold</strong>');
    });

    it('should render italic text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Italic' },
        plain_text: 'Italic',
        annotations: { italic: true },
      };
      expect(renderTextElement(text)).toBe('<em>Italic</em>');
    });

    it('should render strikethrough text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Strike' },
        plain_text: 'Strike',
        annotations: { strikethrough: true },
      };
      expect(renderTextElement(text)).toBe('<del>Strike</del>');
    });

    it('should render underlined text', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Underline' },
        plain_text: 'Underline',
        annotations: { underline: true },
      };
      expect(renderTextElement(text)).toBe('<u>Underline</u>');
    });

    it('should render inline code', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'const x = 1' },
        plain_text: 'const x = 1',
        annotations: { code: true },
      };
      const result = renderTextElement(text);
      expect(result).toContain('<code class="bg-gray-100');
      expect(result).toContain('const x = 1</code>');
    });

    it('should combine multiple annotations', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Bold Italic' },
        plain_text: 'Bold Italic',
        annotations: { bold: true, italic: true },
      };
      const result = renderTextElement(text);
      expect(result).toBe('<em><strong>Bold Italic</strong></em>');
    });
  });

  describe('text colors', () => {
    it('should apply text color class', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Blue text' },
        plain_text: 'Blue text',
        annotations: { color: 'blue' },
      };
      const result = renderTextElement(text);
      expect(result).toContain('<span class="');
      expect(result).toContain('Blue text</span>');
    });

    it('should not apply color for default color', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Default' },
        plain_text: 'Default',
        annotations: { color: 'default' },
      };
      expect(renderTextElement(text)).toBe('Default');
    });
  });

  describe('links', () => {
    it('should render link with href', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Click here', link: { url: 'https://example.com' } },
        plain_text: 'Click here',
        annotations: {},
      };
      const result = renderTextElement(text);
      expect(result).toContain('<a href="https://example.com"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
      expect(result).toContain('Click here</a>');
    });

    it('should render bold link', () => {
      const text: NotionRichText = {
        type: 'text',
        text: { content: 'Bold Link', link: { url: 'https://example.com' } },
        plain_text: 'Bold Link',
        annotations: { bold: true },
      };
      const result = renderTextElement(text);
      expect(result).toContain('<a href="https://example.com"');
      expect(result).toContain('<strong>Bold Link</strong></a>');
    });
  });

  describe('mentions', () => {
    it('should render page mention', () => {
      const text: NotionRichText = {
        type: 'mention',
        plain_text: 'Page Title',
        annotations: {},
        mention: {
          type: 'page',
          page: { id: '12345678-1234-1234-1234-123456789012' },
        },
      } as any;
      const result = renderTextElement(text);
      expect(result).toContain('https://www.notion.so/123456781234123412341234567890');
      expect(result).toContain('Page Title');
      expect(result).toContain('<svg');
    });

    it('should render user mention', () => {
      const text: NotionRichText = {
        type: 'mention',
        plain_text: '@John',
        annotations: {},
        mention: {
          type: 'user',
          user: { id: 'user-123' },
        },
      } as any;
      const result = renderTextElement(text);
      expect(result).toContain('<span class="text-gray-700');
      expect(result).toContain('@John</span>');
    });

    it('should render link preview mention', () => {
      const text: NotionRichText = {
        type: 'mention',
        plain_text: 'Example',
        annotations: {},
        mention: {
          type: 'link_preview',
          link_preview: { url: 'https://example.com' },
        },
      } as any;
      const result = renderTextElement(text);
      expect(result).toContain('<a href="https://example.com"');
      expect(result).toContain('Example</a>');
    });
  });
});

describe('formatDateMention', () => {
  // Mock current date for consistent testing
  const mockToday = new Date('2024-01-15T12:00:00Z');
  const originalDate = global.Date;

  beforeEach(() => {
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockToday);
        } else {
          super(...args);
        }
      }
      static now() {
        return mockToday.getTime();
      }
    } as any;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  it('should return empty string for null/undefined', () => {
    expect(formatDateMention(null)).toBe('');
    expect(formatDateMention(undefined)).toBe('');
    expect(formatDateMention({})).toBe('');
  });

  it('should format today as "오늘"', () => {
    const dateInfo = { start: '2024-01-15' };
    expect(formatDateMention(dateInfo)).toBe('오늘');
  });

  it('should format tomorrow as "내일"', () => {
    const dateInfo = { start: '2024-01-16' };
    expect(formatDateMention(dateInfo)).toBe('내일');
  });

  it('should format yesterday as "어제"', () => {
    const dateInfo = { start: '2024-01-14' };
    expect(formatDateMention(dateInfo)).toBe('어제');
  });

  it('should format absolute date with Korean weekday', () => {
    const dateInfo = { start: '2024-01-10' };
    const result = formatDateMention(dateInfo);
    expect(result).toContain('2024년 1월 10일');
    expect(result).toContain('(수)'); // Wednesday in Korean
  });

  it('should include time when T is present in ISO string', () => {
    const dateInfo = { start: '2024-01-10T14:30:00Z' };
    const result = formatDateMention(dateInfo);
    expect(result).toContain('2024년 1월 10일');
    expect(result).toMatch(/\d{2}:\d{2}/); // Time format HH:MM
  });

  it('should format date range', () => {
    const dateInfo = {
      start: '2024-01-10',
      end: '2024-01-12',
    };
    const result = formatDateMention(dateInfo);
    expect(result).toContain('2024년 1월 10일');
    expect(result).toContain('~');
    expect(result).toContain('2024년 1월 12일');
  });

  it('should handle same day range (only show start)', () => {
    const dateInfo = {
      start: '2024-01-10T00:00:00',
      end: '2024-01-10T23:59:59',
    };
    const result = formatDateMention(dateInfo);
    expect(result).toContain('2024년 1월 10일');
    expect(result).not.toContain('~');
  });

  it('should handle all Korean weekdays correctly', () => {
    // Use dates far from "today" (2024-01-15) to avoid relative date formatting
    const weekdays = [
      { date: '2024-01-07', expected: '(일)' }, // Sunday
      { date: '2024-01-08', expected: '(월)' }, // Monday
      { date: '2024-01-09', expected: '(화)' }, // Tuesday
      { date: '2024-01-10', expected: '(수)' }, // Wednesday
      { date: '2024-01-11', expected: '(목)' }, // Thursday
      { date: '2024-01-12', expected: '(금)' }, // Friday
      { date: '2024-01-13', expected: '(토)' }, // Saturday
    ];

    weekdays.forEach(({ date, expected }) => {
      const result = formatDateMention({ start: date });
      expect(result).toContain(expected);
    });
  });
});
