import { createMarkdownProcessor } from '@astrojs/markdown-remark';

const processor = await createMarkdownProcessor();

// Empty bold spans become four stars after invisible characters are removed.
// Use explicit strong tags only where Markdown's punctuation rules prevent rendering.
export async function repairEmphasis(markdown) {
  let frontMatter = false;
  let fence = false;
  const lines = markdown.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const original = lines[index];
    if (index === 0 && original === '---') { frontMatter = true; continue; }
    if (frontMatter) { if (original === '---') frontMatter = false; continue; }
    if (/^\s*(```|~~~)/.test(original)) { fence = !fence; continue; }
    if (fence) continue;
    const citation = original.replace(/\\\*\\\*(\d+:)\\\*\\\*/g, '<strong>$1</strong>');
    if (!citation.includes('**')) { lines[index] = citation; continue; }
    if (/^\s*_?\*{4,}_?\s*$/.test(original)) { lines[index] = ''; continue; }
    let line = citation.replace(/\*{4,}/g, run => run.length % 4 === 2 ? '**' : '');
    const rendered = await processor.render(line);
    if (rendered.code.includes('**')) {
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }
    lines[index] = line;
  }
  return lines.join('\n');
}
