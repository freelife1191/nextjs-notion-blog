/**
 * Code Block Rendering Tests
 *
 * Tests for renderCodeBlock function covering:
 * - Mermaid diagram rendering with Kroki API
 * - Regular code block rendering
 * - Language detection and formatting
 * - HTML escaping and XSS prevention
 * - Tab UI structure for Mermaid diagrams
 */

import { describe, it, expect, vi } from 'vitest';
import { renderCodeBlock } from '../code-block';
import type { NotionBlock, NotionRichText } from '../../renderer';
import pako from 'pako';

// Mock renderRichText function (unused but required by signature)
const mockRenderRichText = (richText: NotionRichText[]) =>
  richText.map(rt => rt.plain_text || '').join('');

describe('renderCodeBlock', () => {
  describe('Regular code blocks', () => {
    it('should render JavaScript code block with correct structure', () => {
      const block: NotionBlock = {
        id: 'test-block-1',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'const x = 1;' }, plain_text: 'const x = 1;', annotations: {} }
          ],
          language: 'javascript',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should contain code wrapper
      expect(result).toContain('class="code-block-wrapper');
      expect(result).toContain('data-code-block=');

      // Should contain header with language label
      expect(result).toContain('class="code-block-header');
      expect(result).toContain('JavaScript'); // Language label

      // Should contain copy button with data attribute
      expect(result).toContain('class="copy-button');
      expect(result).toContain('data-copy-btn=');

      // Should contain pre and code elements with correct language class
      expect(result).toContain('class="language-javascript');
      expect(result).toContain('<pre class="language-javascript');
      expect(result).toContain('<code class="language-javascript');

      // Should escape HTML in code content
      expect(result).toContain('const x = 1;');
    });

    it('should escape HTML special characters in code', () => {
      const block: NotionBlock = {
        id: 'test-block-2',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: '<div class="test">&</div>' }, plain_text: '<div class="test">&</div>', annotations: {} }
          ],
          language: 'html',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should escape HTML entities
      expect(result).toContain('&lt;div class=&quot;test&quot;&gt;&amp;&lt;/div&gt;');
      expect(result).not.toContain('<div class="test">'); // Should not contain unescaped HTML
    });

    it('should handle empty code block', () => {
      const block: NotionBlock = {
        id: 'test-block-3',
        type: 'code',
        code: {
          rich_text: [],
          language: 'text',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should still render structure
      expect(result).toContain('class="code-block-wrapper');
      expect(result).toContain('class="language-text');
    });

    it('should handle multiple rich text elements', () => {
      const block: NotionBlock = {
        id: 'test-block-4',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'const x = ' }, plain_text: 'const x = ', annotations: {} },
            { type: 'text', text: { content: '42;' }, plain_text: '42;', annotations: {} }
          ],
          language: 'javascript',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should concatenate all rich text elements
      expect(result).toContain('const x = 42;');
    });

    it('should use language class mapper for common aliases', () => {
      const block: NotionBlock = {
        id: 'test-block-5',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'print("hello")' }, plain_text: 'print("hello")', annotations: {} }
          ],
          language: 'py', // Alias for python
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should map 'py' to 'python'
      expect(result).toContain('class="language-python');
    });

    it('should default to "text" language when not specified', () => {
      const block: NotionBlock = {
        id: 'test-block-6',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'plain text' }, plain_text: 'plain text', annotations: {} }
          ],
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      expect(result).toContain('class="language-text');
    });
  });

  describe('Mermaid diagrams', () => {
    it('should render Mermaid diagram with Kroki API URL', () => {
      const mermaidCode = 'graph TD\n  A-->B';
      const block: NotionBlock = {
        id: 'test-mermaid-1',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: mermaidCode }, plain_text: mermaidCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should contain mermaid wrapper
      expect(result).toContain('class="mermaid-wrapper');
      expect(result).toContain('data-mermaid-block=');

      // Should contain Kroki API URL
      expect(result).toContain('https://kroki.io/mermaid/svg/');

      // Should contain tab buttons
      expect(result).toContain('다이어그램');
      expect(result).toContain('코드');

      // Should have tab structure with data attributes
      expect(result).toContain('data-tab="diagram"');
      expect(result).toContain('data-tab="code"');
      expect(result).toContain('class="mermaid-tab');
    });

    it('should generate correct Kroki URL with pako compression', () => {
      const mermaidCode = 'graph TD\n  A-->B';
      const block: NotionBlock = {
        id: 'test-mermaid-2',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: mermaidCode }, plain_text: mermaidCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Manually verify Kroki URL generation
      const compressed = pako.deflate(mermaidCode);
      const base64 = Buffer.from(compressed).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      const expectedUrl = `https://kroki.io/mermaid/svg/${base64}`;

      expect(result).toContain(expectedUrl);
    });

    it('should have onclick handlers for tab switching', () => {
      const block: NotionBlock = {
        id: 'test-mermaid-3',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'graph TD\n  A-->B' }, plain_text: 'graph TD\n  A-->B', annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should have onclick handlers that call window.switchMermaidTab
      expect(result).toContain('onclick="window.switchMermaidTab(');
      expect(result).toMatch(/onclick="window\.switchMermaidTab\('mermaid-[a-z0-9]+', 'diagram'\)"/);
      expect(result).toMatch(/onclick="window\.switchMermaidTab\('mermaid-[a-z0-9]+', 'code'\)"/);
    });

    it('should have two tab panels (diagram and code)', () => {
      const mermaidCode = 'graph TD\n  A-->B';
      const block: NotionBlock = {
        id: 'test-mermaid-4',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: mermaidCode }, plain_text: mermaidCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should have diagram panel
      expect(result).toContain('data-panel="diagram"');
      expect(result).toContain('class="mermaid-tab-panel active"');

      // Should have code panel (initially hidden)
      expect(result).toContain('data-panel="code"');
      expect(result).toContain('class="mermaid-tab-panel hidden"');

      // Code panel should contain escaped mermaid code
      expect(result).toContain('graph TD');
      expect(result).toContain('A--&gt;B'); // Escaped arrow
    });

    it('should have copy button with correct data attribute for mermaid', () => {
      const mermaidCode = 'graph TD\n  A-->B';
      const block: NotionBlock = {
        id: 'test-mermaid-5',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: mermaidCode }, plain_text: mermaidCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should have copy button
      expect(result).toContain('class="copy-button');
      expect(result).toContain('data-mermaid-copy=');
      expect(result).toContain('data-copy-text=');
    });

    it('should escape special characters in mermaid code for HTML attributes', () => {
      const mermaidCode = 'graph TD\n  A["Test\'s \\"Quote\\""]-->B';
      const block: NotionBlock = {
        id: 'test-mermaid-6',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: mermaidCode }, plain_text: mermaidCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should escape quotes for HTML attributes
      expect(result).toContain('&quot;');
      expect(result).toContain('&#039;');
    });

    it('should handle mermaid with case-insensitive language detection', () => {
      const block: NotionBlock = {
        id: 'test-mermaid-7',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'graph TD\n  A-->B' }, plain_text: 'graph TD\n  A-->B', annotations: {} }
          ],
          language: 'MERMAID', // Uppercase
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should still render as Mermaid diagram
      expect(result).toContain('class="mermaid-wrapper');
      expect(result).toContain('https://kroki.io/mermaid/svg/');
    });

    it('should generate unique block IDs for multiple mermaid diagrams', () => {
      const block1: NotionBlock = {
        id: 'test-mermaid-8',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: 'graph TD\n  A-->B' }, plain_text: 'graph TD\n  A-->B', annotations: {} }],
          language: 'mermaid',
          caption: []
        }
      };

      const block2: NotionBlock = {
        id: 'test-mermaid-9',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: 'graph TD\n  C-->D' }, plain_text: 'graph TD\n  C-->D', annotations: {} }],
          language: 'mermaid',
          caption: []
        }
      };

      const result1 = renderCodeBlock(block1, mockRenderRichText);
      const result2 = renderCodeBlock(block2, mockRenderRichText);

      // Extract block IDs using regex
      const id1Match = result1.match(/data-mermaid-block="(mermaid-[a-z0-9]+)"/);
      const id2Match = result2.match(/data-mermaid-block="(mermaid-[a-z0-9]+)"/);

      expect(id1Match).toBeTruthy();
      expect(id2Match).toBeTruthy();
      expect(id1Match![1]).not.toBe(id2Match![1]); // IDs should be different
    });
  });

  describe('Error handling', () => {
    it('should handle pako compression errors gracefully', () => {
      // Mock pako.deflate to throw an error
      const originalDeflate = pako.deflate;
      vi.spyOn(pako, 'deflate').mockImplementation(() => {
        throw new Error('Compression failed');
      });

      const block: NotionBlock = {
        id: 'test-error-1',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: 'graph TD\n  A-->B' }, plain_text: 'graph TD\n  A-->B', annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should show error message
      expect(result).toContain('다이어그램 인코딩 실패');
      expect(result).toContain('text-red-500');

      // Should show the mermaid code in error state
      expect(result).toContain('graph TD');
      expect(result).toContain('A--&gt;B');

      // Restore original function
      pako.deflate = originalDeflate;
    });
  });

  describe('XSS prevention', () => {
    it('should prevent XSS in code content', () => {
      const maliciousCode = '<script>alert("XSS")</script>';
      const block: NotionBlock = {
        id: 'test-xss-1',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: maliciousCode }, plain_text: maliciousCode, annotations: {} }
          ],
          language: 'javascript',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // Should escape script tags
      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&lt;/script&gt;');
      expect(result).not.toContain('<script>alert'); // Should not contain unescaped script
    });

    it('should prevent XSS in mermaid diagram code', () => {
      const maliciousCode = 'graph TD\n  A["<img src=x onerror=alert(1)>"]-->B';
      const block: NotionBlock = {
        id: 'test-xss-2',
        type: 'code',
        code: {
          rich_text: [
            { type: 'text', text: { content: maliciousCode }, plain_text: maliciousCode, annotations: {} }
          ],
          language: 'mermaid',
          caption: []
        }
      };

      const result = renderCodeBlock(block, mockRenderRichText);

      // In the code tab panel, should escape HTML
      expect(result).toContain('&lt;img');

      // Extract code panel content to check escaping
      const codePanelMatch = result.match(/<code class="language-mermaid text-gray-100">(.*?)<\/code>/s);
      expect(codePanelMatch).toBeTruthy();

      // Inside code panel, HTML should be escaped
      const codePanelContent = codePanelMatch![1];
      expect(codePanelContent).toContain('&lt;img src=x onerror=alert(1)&gt;');
      expect(codePanelContent).not.toContain('<img src=x'); // Should not have unescaped tag in code display
    });
  });
});
