import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const contentDir = path.join(root, 'src/content/posts');
const fixture = path.join(contentDir, '주소 검증용 원고.md');
const renamedFixture = path.join(contentDir, '제목을 바꾼 원고.md');
const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
const build = extra => execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, env: { ...env, ...extra }, stdio: 'pipe' });
const read = file => fs.readFileSync(path.join(root, 'dist', file), 'utf8');
for (const file of [fixture, renamedFixture]) assert(!fs.existsSync(file), 'Fixture must not overwrite user content');
try {
  const source = `---\ntitle: '빌드 검증 문서'\nslug: build-verification\nlegacySlugs: [previous-verification]\ndescription: '일시적인 렌더링 검증 자료'\ndate: 2026-11-08\ncategory: '감각-운동'\ntags: ['검증']\ndraft: false\n---\n\n## 본문\n\n수식 검증: $F = ma$.\n\n## 참고문헌\n\n빌드 내부 검증 자료다.\n`;
  fs.writeFileSync(fixture, source);
  build({ GITHUB_REPOSITORY: 'LukeKwon/base-path-check', BASE_PATH: '/base-path-check' });
  const article = read('posts/build-verification/index.html');
  assert(article.includes('class="katex"'));
  assert(article.includes('이 글의 목차'));
  assert(article.includes('참고문헌'));
  assert(article.includes('/base-path-check/'));
  assert(read('posts/previous-verification/index.html').includes('0;url=/base-path-check/posts/build-verification/'));
  assert(!fs.existsSync(path.join(root, 'dist/posts/new-article')));
  fs.renameSync(fixture, renamedFixture);
  fs.writeFileSync(renamedFixture, source.replace('빌드 검증 문서', '제목 변경 검증 문서'));
  build({ GITHUB_REPOSITORY: 'LukeKwon/LukeKwon.github.io', BASE_PATH: '/' });
  assert(read('posts/build-verification/index.html').includes('제목 변경 검증 문서'));
  assert(!fs.existsSync(path.join(root,'dist/posts/제목을-바꾼-원고')));
  console.log('PASS: stable URL after title/filename changes, redirect, subpath, math, TOC, draft exclusion');
} finally {
  for (const file of [fixture, renamedFixture]) if (fs.existsSync(file)) fs.unlinkSync(file);
}
build({ GITHUB_REPOSITORY: 'LukeKwon/LukeKwon.github.io', BASE_PATH: '/' });
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const htmlFiles = walk(path.join(root, 'dist')).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  assert(!/빌드 검증 문서|제목 변경 검증 문서|새 글의 제목/.test(html));
  const withoutCode = html.replace(/<pre\b[\s\S]*?<\/pre>/g, '').replace(/<code\b[\s\S]*?<\/code>/g, '');
  assert(!withoutCode.includes('**'), `Emphasis markers leaked: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const url = new URL(value, 'https://lukekwon.github.io');
    let target = path.join(root, 'dist', decodeURIComponent(url.pathname));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), `Broken internal link: ${value} in ${file}`);
  }
}
const articles = fs.readdirSync(contentDir).filter(file => file.endsWith('.md')).map(file => ({ file, text: fs.readFileSync(path.join(contentDir,file),'utf8') })).filter(item => /^draft:\s*false\s*$/m.test(item.text));
let aliases = 0;
for (const { file, text } of articles) {
  assert(/[가-힣]/.test(file), `Expected Korean filename: ${file}`);
  assert(!file.startsWith('naver-'));
  const slug = text.match(/^slug:\s*([a-z0-9-]+)\s*$/m)?.[1];
  assert(slug, `Missing permanent address: ${file}`);
  assert(read(`posts/${slug}/index.html`).includes(`https://lukekwon.github.io/posts/${slug}/`));
  const old = text.match(/^legacySlugs:\s*\[([^\]]*)\]/m)?.[1].split(',').map(x=>x.trim()).filter(Boolean) || [];
  for (const previous of old) {
    const redirect = read(`posts/${previous}/index.html`);
    assert(redirect.includes(`0;url=/posts/${slug}/`));
    assert(redirect.includes('noindex,follow'));
    assert(redirect.includes('location.search + location.hash'));
    aliases++;
  }
}
const categoryCount = (fs.readFileSync(path.join(root, 'src/lib/site.ts'),'utf8').match(/"naverId":/g)||[]).length;
assert.equal(htmlFiles.length, 5 + categoryCount + articles.length + aliases);
assert(!read('index.html').includes('href="/posts/naver-'));
assert(!read('search/index.html').includes('href="/posts/naver-'));
const injuryArticle = read('posts/neuromuscular-changes-after-joint-injury/index.html');
assert(injuryArticle.includes('<strong>생체역학적 불안정함(instability)</strong>'));
assert(injuryArticle.includes('<strong>근육과 관련된 근신경학적 변화</strong>'));
console.log(`PASS: ${articles.length} canonical articles, ${aliases} redirects, ${htmlFiles.length} pages, internal links/assets, emphasis`);
