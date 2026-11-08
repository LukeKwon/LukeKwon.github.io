import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Verify real generated HTML, including a project-site base path and a rendered post.
const root = path.resolve(import.meta.dirname, '..');
const fixture = path.join(root, 'src/content/posts/build-verification.md');
const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
const build = extra => execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, env: { ...env, ...extra }, stdio: 'pipe' });
const read = file => fs.readFileSync(path.join(root, 'dist', file), 'utf8');
assert(!fs.existsSync(fixture), 'Verification fixture must not replace a user file');
try {
  fs.writeFileSync(fixture, `---\ntitle: '빌드 검증 문서'\ndescription: '일시적인 렌더링 검증 자료'\ndate: 2026-11-08\ncategory: '감각-운동'\ntags: ['검증']\ndraft: false\n---\n\n## 본문\n\n수식 검증: $F = ma$.\n\n## 참고문헌\n\n빌드 내부 검증 자료다.\n`);
  build({ GITHUB_REPOSITORY: 'LukeKwon/base-path-check', BASE_PATH: '/base-path-check' });
  const article = read('posts/build-verification/index.html');
  assert(article.includes('class="katex"'), 'Math must render');
  assert(article.includes('이 글의 목차'), 'Article must have a table of contents');
  assert(article.includes('참고문헌'), 'Markdown headings must render');
  assert(article.includes('/base-path-check/'), 'Project base path must be preserved');
  assert(!fs.existsSync(path.join(root, 'dist/posts/writing-template')), 'Draft must never create a route');
  console.log('PASS: published Markdown, math, table of contents, project base path, draft exclusion');
} finally {
  if (fs.existsSync(fixture)) fs.unlinkSync(fixture);
}
build({ GITHUB_REPOSITORY: 'LukeKwon/LukeKwon.github.io', BASE_PATH: '/' });
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const htmlFiles = walk(path.join(root, 'dist')).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  assert(!html.includes('빌드 검증 문서'), 'Verification article must not ship');
  assert(!html.includes('새 글의 제목'), 'Draft title must not ship');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const url = new URL(value, 'https://lukekwon.github.io');
    let target = path.join(root, 'dist', decodeURIComponent(url.pathname));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), `Broken internal asset/link: ${value} in ${file}`);
  }
}
assert.equal(htmlFiles.length, 8, 'Expected public pages');
console.log(`PASS: ${htmlFiles.length} production pages, all internal links/assets, no draft or verification content`);
