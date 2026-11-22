/**
 * Copies Orbit's web build (`apps/plugin/.soundor/dist/web`) into the site's
 * `public/embed/`: orbit.soundor.dev/embed/ is that build itself, whose demo
 * presentation fills any frame (the plugin scaled to fit, Play and the audio
 * source under it). The landing page embeds it, and so do the Soundor
 * websites; it is not a public feature.
 * Turborepo builds it first (`orbit#build:web`).
 */

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../../..', import.meta.url).pathname;
const built = join(root, 'apps/plugin/.soundor/dist/web');
const target = join(root, 'apps/website/public/embed');

if (!existsSync(join(built, 'index.html'))) {
  throw new Error(
    `No web build in ${built}: run pnpm build:web at the repository's root.`,
  );
}
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(built, target, { recursive: true });
console.log('Embed: copied the web build to apps/website/public/embed');
