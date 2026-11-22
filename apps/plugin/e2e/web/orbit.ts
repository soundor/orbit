import { expect, type Locator, type Page } from '@playwright/test';

/** Opens Orbit in the web host and waits for its UI. */
export async function openOrbit(page: Page, query = ''): Promise<void> {
  await page.goto(`/${query}`);
  await expect(
    page.getByRole('heading', { name: 'Soundor Orbit' }),
  ).toBeVisible();
}

/** The middle of a control, in page coordinates. */
export async function centreOf(
  control: Locator,
): Promise<{ x: number; y: number }> {
  const box = await control.boundingBox();
  if (!box) throw new Error('The control is not laid out');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Drags a control by (dx, dy) in steps, and lets go. */
export async function drag(
  page: Page,
  control: Locator,
  dx: number,
  dy: number,
): Promise<void> {
  const { x, y } = await centreOf(control);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
}

/**
 * The settings the web runtime last saved, from the plugin's IndexedDB
 * database. It saves 100 ms after the last change, so a test that reloads
 * waits for this first.
 */
export async function saved(
  page: Page,
): Promise<{ parameters: Record<string, unknown> } | undefined> {
  const text = await page.evaluate(
    () =>
      new Promise<unknown>((resolve, reject) => {
        const request = indexedDB.open('soundor/dev.soundor.orbit', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const get = request.result
            .transaction('storage', 'readonly')
            .objectStore('storage')
            .get('soundor:snapshot:v1');
          get.onerror = () => reject(get.error);
          get.onsuccess = () => {
            request.result.close();
            resolve(get.result);
          };
        };
      }),
  );
  return typeof text === 'string' ? JSON.parse(text) : undefined;
}
