/// <reference lib="dom" />

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium, type Page } from 'playwright';

// The home page's gallery: screenshots of the web build that sync-embed copied
// into public/embed, taken in Chromium at every dev and build, so they always
// show the interface as it is. Each shot is of the plugin's editor alone,
// without the web host around it, and saved twice, as WebP from the browser's
// own encoder: the whole editor, and a 4:3 crop of the part that matters,
// which a phone shows instead.
//
// Each is rendered afresh at every width it is saved at, the editor drawn at
// that pixel ratio, rather than shrunk from one large shot: text and thin
// lines resampled, and then resampled again by the page, turn soft. They are
// taken again only when the web build or this script changes.
const embed = new URL('../public/embed/', import.meta.url);
const out = new URL('../src/assets/gallery/', import.meta.url);
/** The demo's window, in CSS pixels: room for the editor at its own size and the host's dock. */
const WIDTH = 1000;
const HEIGHT = 800;
/** The editor's own size (soundor.config.ts lays it out at 800×600). */
const EDITOR_WIDTH = 800;
/** The web host's view of the editor, without its frame, dock or resize handle. */
const EDITOR = '.soundor-viewport';
/**
 * The gallery's widest image, in CSS pixels (gallery.tsx). A desktop screen
 * shows it that wide, so these widths, one and two pixels to each of its
 * pixels, show at their own size. Each is a multiple of four, so the editor's
 * 4:3 edges fall on whole device pixels.
 */
const SLIDE = 896;
/** The widths the whole editor is saved at, in pixels; a crop is saved at the same ratios. */
const WIDTHS = [600, SLIDE, 1200, SLIDE * 2];

type Box = { x: number; y: number; width: number; height: number };

interface Shot {
  readonly id: string;
  readonly title: string;
  /** What it shows, for a visitor who cannot see it. */
  readonly alt: string;
  /** Puts the demo in the state to show, after the common setup. */
  readonly setup?: (page: Page) => Promise<void>;
  /** The part a phone shows, inside the editor; the echo map by default. */
  readonly detail?: (page: Page, editor: Box) => Promise<Box>;
}

/** Drags a control by (dx, dy), as a hand would. */
async function drag(page: Page, name: string, dx: number, dy: number) {
  const box = (await page
    .getByRole('slider', { name, exact: true })
    .boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}

/** A 4:3 crop round a control, `height` tall. */
const near =
  (name: string, role: 'button', height: number) =>
  async (page: Page, editor: Box) => {
    const box = (await page.getByRole(role, { name }).first().boundingBox())!;
    return around(
      editor,
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      height,
    );
  };

// In the order the gallery shows them; it opens on the middle one, the echo
// map, with a shot either side.
const shots: Shot[] = [
  {
    id: 'presets',
    title: 'Four presets',
    alt: 'Orbit with the Drifting space preset: three echoes spread across three beats over long tails.',
    setup: async (page) => {
      await page.getByRole('button', { name: 'Next preset' }).click();
      await page.getByRole('button', { name: 'Next preset' }).click();
    },
  },
  {
    id: 'hold',
    title: 'Hold',
    alt: 'Hold pressed, looping what the echoes carry, with the hint to release it to let sound in.',
    setup: (page) => page.getByRole('button', { name: 'Hold' }).click(),
    detail: near('Hold', 'button', 380),
  },
  {
    id: 'map',
    title: 'Echo map',
    alt: 'Soundor Orbit with the Dotted satellites preset: three echoes on the echo map, the knobs under it, and Hold.',
  },
  {
    id: 'shape',
    title: 'Drag the echoes',
    alt: 'The three echoes dragged to new times and levels on the echo map.',
    setup: async (page) => {
      await drag(page, 'Echo 1 time', -60, -40);
      await drag(page, 'Echo 2 time', 90, -70);
      await drag(page, 'Echo 3 time', 120, 30);
    },
  },
  {
    id: 'guide',
    title: 'Built-in guide',
    alt: 'The guide open over the echo map: how to shape the echoes, adjust the knobs, use the keyboard, and hold and compare.',
    setup: async (page) => {
      await page.getByRole('button', { name: 'How to use Orbit' }).click();
      await page.waitForTimeout(400);
    },
    detail: near('Close guide', 'button', 360),
  },
];

/** A 4:3 box `height` tall centred on `focus`, kept inside `bounds`. */
function around(
  bounds: Box,
  focus: { x: number; y: number },
  height: number,
): Box {
  const h = Math.min(height, bounds.height, (bounds.width * 3) / 4);
  const w = (h * 4) / 3;
  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  return {
    x: clamp(focus.x - w / 2, bounds.x, bounds.x + bounds.width - w),
    y: clamp(focus.y - h / 2, bounds.y, bounds.y + bounds.height - h),
    width: w,
    height: h,
  };
}

/** The echo map: across from its middle echo, its whole height and the top of the knobs. */
async function mapDetail(page: Page, editor: Box) {
  const echo = (await page
    .getByRole('slider', { name: 'Echo 2 time' })
    .boundingBox())!;
  return around(editor, { x: echo.x + echo.width / 2, y: editor.y + 270 }, 420);
}

async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

const root = fileURLToPath(embed);
const hash = createHash('sha256');
hash.update(await readFile(fileURLToPath(import.meta.url)));
for (const file of await files(root))
  hash.update(file.slice(root.length)).update(await readFile(file));
const key = hash.digest('hex');
const stamp = new URL('.hash', out);
if (existsSync(stamp) && (await readFile(stamp, 'utf8')) === key) {
  console.log('screenshots: up to date');
  process.exit(0);
}

// The editor as the demo serves it, but fixed in size: a resizable editor
// draws its resize grip in its corner, which in a screenshot reads as a flaw.
// Only these screenshots get it; the demo itself stays resizable.
const RESIZABLE = 'resizable:!0,resize:`scale`';
const FIXED = 'resizable:!1,resize:`scale`';
let fixed = false;
for (const file of await files(root)) {
  if (
    file.endsWith('.js') &&
    (await readFile(file, 'utf8')).includes(RESIZABLE)
  )
    fixed = true;
}
if (!fixed) {
  throw new Error(
    `screenshots: no ${RESIZABLE} in public/embed: the editor would show its grip; update RESIZABLE`,
  );
}

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};
const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  const path = fileURLToPath(
    new URL(`.${pathname === '/' ? '/index.html' : pathname}`, embed),
  );
  try {
    if (!path.startsWith(root)) throw new Error('outside');
    let body: Buffer | string = await readFile(path);
    if (extname(path) === '.js' && body.includes(RESIZABLE)) {
      body = body.toString('utf8').replaceAll(RESIZABLE, FIXED);
    }
    response.writeHead(200, {
      'content-type': types[extname(path)] ?? 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;

interface Image {
  readonly width: number;
  readonly webp: Uint8Array;
}

/** The shot rendered at `scale` device pixels to a CSS pixel: the window, and the crop. */
async function take(
  shot: Shot,
  scale: number,
): Promise<Record<'full' | 'detail', Image>> {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: scale,
  });
  try {
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Soundor Orbit' }).waitFor();
    // The editor alone, square and in the page's top-left corner. The host
    // rounds its corners over a dark page and centres it, and at a fractional
    // pixel ratio an edge between device pixels blends into that page: the
    // gallery's frame would show both as dark slivers. From the corner, every
    // edge falls on a whole device pixel, the widths being multiples of five.
    await page.addStyleTag({
      content: `.soundor-frame { position: fixed !important; left: 0 !important; top: 0 !important; }
        .soundor-frame, .soundor-viewport, .sd-surface { border-radius: 0 !important; box-shadow: none !important; }`,
    });

    // The demo phrase playing, so the echo map shows the repeats moving.
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await page.waitForTimeout(1500);
    await shot.setup?.(page);
    await page.mouse.move(WIDTH - 1, HEIGHT - 1);
    await page.evaluate(() => {
      const focused = document.activeElement as HTMLElement | null;
      if (focused?.getAttribute('role') !== 'menuitem') focused?.blur();
    });
    await page.waitForTimeout(300);

    const view = page.locator(EDITOR);
    const editor = (await view.boundingBox())!;
    if (
      editor.x !== 0 ||
      editor.y !== 0 ||
      Math.round(editor.width) !== EDITOR_WIDTH
    ) {
      throw new Error(
        `the editor is ${editor.width} px wide at ${editor.x}, ${editor.y}, not ${EDITOR_WIDTH} at 0, 0`,
      );
    }
    const detail = await (shot.detail ?? mapDetail)(page, editor);
    const encode = (png: Buffer) =>
      page.evaluate(async (data) => {
        const bitmap = await createImageBitmap(
          await (await fetch(`data:image/png;base64,${data}`)).blob(),
        );
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
        // A little above the usual 0.8: below it text and thin lines blur,
        // and lossless (1) is three times the size.
        const blob = await canvas.convertToBlob({
          type: 'image/webp',
          quality: 0.92,
        });
        return {
          width: bitmap.width,
          webp: [...new Uint8Array(await blob.arrayBuffer())],
        };
      }, png.toString('base64'));
    const image = async (png: Buffer): Promise<Image> => {
      const { width, webp } = await encode(png);
      return { width, webp: Uint8Array.from(webp) };
    };
    return {
      full: await image(await view.screenshot()),
      detail: await image(await page.screenshot({ clip: detail })),
    };
  } finally {
    await page.close();
  }
}

const browser = await chromium.launch({
  args: ['--autoplay-policy=no-user-gesture-required'],
});
try {
  // Written over in place, not emptied first: a dev server watching the
  // folder would lose it.
  await mkdir(out, { recursive: true });
  const written = new Set(['gallery.json', '.hash']);
  const manifest: {
    id: string;
    title: string;
    alt: string;
    full: number[];
    detail: number[];
  }[] = [];
  for (const shot of shots) {
    // Every width at once, each in a page of its own.
    const taken = await Promise.all(
      WIDTHS.map((width) => take(shot, width / EDITOR_WIDTH)),
    );
    const sizes: Record<'full' | 'detail', number[]> = { full: [], detail: [] };
    for (const images of taken) {
      for (const [name, image] of Object.entries(images) as [
        'full' | 'detail',
        Image,
      ][]) {
        const file = `${shot.id}${name === 'detail' ? '-detail' : ''}-${image.width}.webp`;
        await writeFile(new URL(file, out), image.webp);
        written.add(file);
        sizes[name].push(image.width);
      }
    }
    manifest.push({
      id: shot.id,
      title: shot.title,
      alt: shot.alt,
      full: sizes.full,
      detail: sizes.detail,
    });
    console.log(`screenshots: ${shot.id}`);
  }
  await writeFile(
    new URL('gallery.json', out),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await writeFile(stamp, key);
  for (const name of await readdir(out)) {
    if (!written.has(name)) await rm(new URL(name, out), { force: true });
  }
} finally {
  await browser.close();
  server.close();
}
