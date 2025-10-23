export type RenderedContent = {
  html: string;
};

// Stub: 후속 작업에서 remark/rehype로 대체
export async function renderMarkdown(markdown: string): Promise<RenderedContent> {
  const escaped = markdown
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
  return { html: `<pre>${escaped}</pre>` };
}


