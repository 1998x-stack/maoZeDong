import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const works = JSON.parse(readFileSync(join(root, 'data/works.json'), 'utf8'));

check(Array.isArray(works) && works.length > 0, 'works.json must contain a non-empty array');
const ids = new Set();
const urls = new Set();
const levels = { year: /^\d{4}$/, month: /^\d{4}-\d{2}$/, day: /^\d{4}-\d{2}-\d{2}$/ };
const allowedStatus = new Set(['catalogued', 'in_review', 'verified']);
const pathSafe = (path) => typeof path === 'string' && path.length > 0 && !path.startsWith('/') && !path.includes('..') && !path.includes('\\');

for (const [i, work] of works.entries()) {
  const label = `work[${i}] (${work?.id ?? 'missing-id'})`;
  check(typeof work.id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id), `${label}: invalid id`);
  check(!ids.has(work.id), `${label}: duplicate id`); ids.add(work.id);
  check(typeof work.title === 'string' && work.title.length >= 2, `${label}: invalid title`);
  check(Number.isInteger(work.volume) && work.volume >= 1 && work.volume <= 5, `${label}: invalid volume`);
  check(typeof work.period === 'string' && work.period.trim(), `${label}: missing period`);
  check(levels[work.datePrecision]?.test(work.date), `${label}: mismatched date precision`);
  if (typeof work.date === 'string') {
    const parts = work.date.split('-').map(Number);
    check(!parts[1] || (parts[1] >= 1 && parts[1] <= 12), `${label}: invalid month`);
    check(!parts[2] || (parts[2] >= 1 && parts[2] <= 31), `${label}: invalid day`);
  }
  check(Array.isArray(work.topics) && work.topics.length >= 1 && work.topics.every(t => typeof t === 'string' && t.length), `${label}: topics invalid`);
  check(typeof work.question === 'string' && work.question.length > 8, `${label}: question missing`);
  check(typeof work.sourceLabel === 'string' && work.sourceLabel.length > 3, `${label}: sourceLabel missing`);
  check(allowedStatus.has(work.reviewStatus), `${label}: invalid reviewStatus`);
  try {
    const url = new URL(work.sourceUrl);
    check(url.protocol === 'https:' && url.hostname === 'www.marxists.org' && url.pathname.startsWith('/chinese/maozedong/') && url.pathname.endsWith('.htm'), `${label}: source URL outside verified archive`);
    check(!urls.has(work.sourceUrl), `${label}: duplicate source URL`); urls.add(work.sourceUrl);
  } catch { failures.push(`${label}: invalid sourceUrl`); }
  check(Array.isArray(work.legacyReports), `${label}: legacyReports must be array`);
  for (const p of work.legacyReports ?? []) {
    if (!pathSafe(p) || !/\.(html|md)$/.test(p)) { failures.push(`${label}: unsafe legacy path ${p}`); continue; }
    const abs = resolve(root, p);
    check(relative(root, abs) !== '..' && !relative(root,abs).startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`), `${label}: path traversal`);
    check(existsSync(abs), `${label}: legacy file missing ${p}`);
    if (existsSync(abs)) check(statSync(abs).size > 0, `${label}: legacy file is empty ${p}`);
  }
}
const skillRoot = join(root, '.opencode/skills');
const dirs = readdirSync(skillRoot, { withFileTypes:true }).filter(x => x.isDirectory());
check(dirs.length >= 8, 'expected professional skill suite (at least 8 skills)');
for (const dir of dirs) {
  const name = dir.name;
  const file = join(skillRoot, name, 'SKILL.md');
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name), `invalid skill folder ${name}`);
  check(existsSync(file), `missing SKILL.md in ${name}`);
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  check(!!fm, `invalid frontmatter: ${name}`);
  if (!fm) continue;
  const declared = fm[1].match(/^name:\s*([^\r\n]+)$/m)?.[1]?.trim();
  const description = fm[1].match(/^description:\s*([^\r\n]+)$/m)?.[1]?.trim();
  check(declared === name, `skill name and folder differ: ${name}`);
  check(!!description && description.length <= 1024, `missing or invalid description: ${name}`);
  check(text.slice(fm[0].length).length > 150, `skill is too short: ${name}`);
}
if (failures.length) {
  console.error(`Content validation failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Validation OK: ${works.length} works, ${dirs.length} skills, ${urls.size} source links.`);
}
