/**
 * Builds the changelog page from release-please's CHANGELOG.md
 * (apps/plugin/CHANGELOG.md): no second release log to maintain.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const source = new URL('../../plugin/CHANGELOG.md', import.meta.url);
const output = new URL('../content/docs/changelog.mdx', import.meta.url);

// MDX treats braces and tags in prose as code. Keep fenced and inline code literal.
function mdxSafe(markdown: string): string {
  return markdown
    .split(/(```[\s\S]*?```|`[^`]*`)/g)
    .map((part, index) =>
      index % 2
        ? part
        : part
            .replaceAll('{', '&#123;')
            .replaceAll('}', '&#125;')
            .replaceAll('<', '&lt;'),
    )
    .join('');
}

/** release-please lists a release's breaking changes under their own heading. */
export function isBreaking(release: string): boolean {
  return /^### ⚠ BREAKING CHANGES\s*$/m.test(release);
}

/**
 * One release. release-please heads it with a compare link and a date:
 * `## [0.2.0](https://github.com/…/compare/v0.1.0...v0.2.0) (2026-12-01)`;
 * the page shows `## 0.2.0`, the date and the link under it.
 */
function releasePage(release: string): string {
  const [first = '', ...rest] = release.split('\n');
  const heading = /^## \[?([^\]\s]+)\]?(?:\(([^)]+)\))?(?: \(([^)]+)\))?/.exec(
    first,
  );
  if (!heading) return mdxSafe(release).trim() + '\n';
  const [, version, compare, date] = heading;
  const icon = isBreaking(release) ? ' <BreakingChangeIcon />' : '';
  const meta = [
    date,
    compare && `[Compare with the previous release](${compare})`,
  ]
    .filter(Boolean)
    .join('. ');
  const body = mdxSafe(rest.join('\n'))
    .replace(/^### ⚠ BREAKING CHANGES[ \t]*$/m, '### Breaking changes')
    .trim();
  return (
    [`## ${version}${icon}`, meta && `${meta}.`, body]
      .filter(Boolean)
      .join('\n\n') + '\n'
  );
}

/** The page: release-please's file without its own heading. */
export function changelogPage(history: string): string {
  const releases = history
    .replace(/^# .*\n+/, '')
    .split(/(?=^## )/m)
    .filter((release) => release.startsWith('## '));
  return [
    '---',
    'title: Changelog',
    'description: What changed in each release of Orbit.',
    '---',
    '',
    releases.length
      ? releases.map(releasePage).join('\n')
      : 'Orbit has no release yet. The first one will be listed here.',
    '',
  ].join('\n');
}

if (import.meta.main) {
  mkdirSync(new URL('./', output), { recursive: true });
  writeFileSync(
    output,
    changelogPage(existsSync(source) ? readFileSync(source, 'utf8') : ''),
  );
}
