import { cpSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { defineConfig, type Plugin } from 'vite';

const root = resolve(import.meta.dirname, '../plugin');
/** Orbit's web build (turbo builds it first): the plugin and its host. */
const webBuild = join(root, '.soundor/dist/web');
const { version } = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8'),
) as { version: string };

const repository = 'https://github.com/soundor/orbit';

/** The platforms a release carries, as the release workflow names them. */
const platforms = [
  {
    name: 'Linux',
    arch: 'x86_64',
    asset: `Orbit-${version}-linux-x86_64.zip`,
    install: 'Unzip into <code>~/.vst3</code>.',
  },
  {
    name: 'Windows',
    arch: 'x64',
    asset: `Orbit-${version}-windows-x64.zip`,
    install: 'Unzip into <code>C:\\Program Files\\Common Files\\VST3</code>.',
  },
];

/**
 * The download section: the release this commit is (release-please bumps
 * package.json only in the release it makes, so main between releases still
 * names the last one), or a note before the first release.
 */
function downloads(): string {
  if (version === '0.0.0') {
    return `<p class="lede">Orbit has no release yet. Build it from
      <a href="${repository}">the source</a>, or watch the repository for the first one.</p>`;
  }
  const release = `${repository}/releases/download/v${version}`;
  const items = platforms
    .map(
      (p) => `<li class="platform">
        <a class="download" href="${release}/${p.asset}">
          <span class="download-os">${p.name}</span>
          <span class="download-arch">${p.arch}</span>
        </a>
        <p>${p.install} Then rescan plugins in your DAW.</p>
        <p class="file">${p.asset}</p>
      </li>`,
    )
    .join('\n');
  return `<ul class="platforms">${items}</ul>
    <p class="aside">macOS isn’t available yet. Check a download against
      <a href="${release}/SHA256SUMS">its checksum</a>, or see
      <a href="${repository}/releases">every release and its changes</a>.</p>`;
}

/**
 * `/embed/` is Orbit's web build itself, whose demo presentation fills any
 * frame: the plugin scaled to fit, with Play and the audio source under it.
 * Served from the build in development, copied into the site when built.
 */
function embed(): Plugin {
  const missing = () =>
    new Error(`No web build in ${webBuild}: run pnpm build:web.`);
  let outDir = '';
  return {
    name: 'orbit-embed',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      if (!existsSync(webBuild)) throw missing();
      server.middlewares.use('/embed', (req, res, next) => {
        const path = (req.url ?? '/').split('?')[0]!;
        const file = join(webBuild, path.endsWith('/') ? 'index.html' : path);
        if (!file.startsWith(webBuild) || !existsSync(file)) return next();
        if (file.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
        if (file.endsWith('.js'))
          res.setHeader('Content-Type', 'text/javascript');
        if (file.endsWith('.wasm'))
          res.setHeader('Content-Type', 'application/wasm');
        res.end(readFileSync(file));
      });
    },
    transformIndexHtml: (html) =>
      html
        .replaceAll('%ORBIT_VERSION%', version === '0.0.0' ? '' : version)
        .replace('<!-- downloads -->', downloads()),
    closeBundle() {
      if (!existsSync(webBuild)) throw missing();
      cpSync(webBuild, join(outDir, 'embed'), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [embed()],
  build: { outDir: 'dist' },
});
