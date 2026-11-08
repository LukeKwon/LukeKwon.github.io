import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { repairEmphasis } from './repair-emphasis.mjs';
const processor = await createMarkdownProcessor();
const cases = [
  ['Peripheral joint injury는 종종 ******생체역학적 불안정함(instability)**를 야기하기도 한다.', '생체역학적 불안정함(instability)'],
  ['관절의 손상 이후에는 ******근육과 관련된 근신경학적 변화**가 흔하게 관찰된다.', '근육과 관련된 근신경학적 변화'],
  ['**움****직임이 건강하다는 것**은', '움직임이 건강하다는 것'],
  ['**“유사성 원리(principle of similarity)”**에', '“유사성 원리(principle of similarity)”'],
];
for (const [source, phrase] of cases) {
  const repaired = await repairEmphasis(source);
  const html = (await processor.render(repaired)).code;
  assert(!html.includes('**'), 'Emphasis markers must not appear as text');
  assert(html.includes(`<strong>${phrase}</strong>`), 'Intended emphasis must render');
  assert.equal(html.replace(/<[^>]+>/g, '').trim(), source.replaceAll('*', ''), 'Visible words must be unchanged');
}
assert.equal(await repairEmphasis('****\n_****_\n* * *'), '\n\n* * *');
assert.equal(await repairEmphasis('```md\n******example**\n```'), '```md\n******example**\n```');
console.log('PASS: empty emphasis, adjacent emphasis, Korean punctuation, text preservation, separators, fenced code');
