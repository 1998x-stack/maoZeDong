import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const contents = path => readFileSync(resolve(root, path), 'utf8');
const works = JSON.parse(contents('data/works.json'));

test('the project starts with verified source-page URLs but not mirrored full texts', () => {
  assert.ok(works.length >= 10);
  for (const w of works) {
    const u = new URL(w.sourceUrl);
    assert.equal(u.hostname, 'www.marxists.org');
    assert.equal(w.reviewStatus, 'catalogued');
    assert.ok(!('fullText' in w), `unexpected mirrored body for ${w.id}`);
  }
});
test('the same work has one canonical ID and multiple legacy reports when applicable', () => {
  assert.equal(works.filter(w => w.title === '实践论').length, 1);
  assert.equal(works.find(w => w.title === '实践论').legacyReports.length, 4);
  assert.equal(works.filter(w => w.title === '矛盾论').length, 1);
  assert.ok(!works.some(w => w.title.includes('公务员')));
});
test('HTML is generated and includes essential actions', () => {
  const html = contents('index.html');
  assert.ok(html.includes('史境'));
  assert.ok(html.includes('works-data'));
  assert.ok(html.includes('aria-label'));
  assert.ok(html.includes('www.marxists.org'));
  assert.ok(!html.includes('__WORKS_JSON__'));
  for (const w of works) assert.ok(html.includes(w.sourceUrl), `${w.id} missing from built page`);
});
test('OpenCode skills have valid portable frontmatter', () => {
  const sample = contents('.opencode/skills/time-slice/SKILL.md');
  assert.match(sample, /^---\nname: time-slice\n/);
  assert.ok(contents('.opencode/skills/README.md').includes('decision-sandbox'));
});
