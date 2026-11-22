import { expect, test } from '@playwright/test';

import { centreOf, drag, openOrbit } from './orbit';

// The same gestures as e2e/vst3/ui.test.ts, with the browser's input.

test.beforeEach(async ({ page }) => {
  await openOrbit(page);
});

test('dragging a knob up raises its parameter', async ({ page }) => {
  const feedback = page.getByRole('slider', { name: 'Feedback' });
  await expect(feedback).toHaveAttribute('aria-valuetext', '48%');

  // 160 pixels are the knob's whole range.
  await drag(page, feedback, 0, -40);

  await expect(feedback).toHaveAttribute('aria-valuetext', '71%');
});

test('the wheel turns a knob', async ({ page }) => {
  const mix = page.getByRole('slider', { name: 'Mix' });
  const { x, y } = await centreOf(mix);

  await page.mouse.move(x, y);
  await page.mouse.wheel(0, -100);

  await expect
    .poll(async () => Number(await mix.getAttribute('aria-valuenow')))
    .toBeGreaterThan(0.6);
});

test('a knob takes the keyboard, and Home restores its default', async ({
  page,
}) => {
  const mix = page.getByRole('slider', { name: 'Mix' });

  await mix.click();
  await page.keyboard.press('ArrowUp');
  await expect(mix).toBeFocused();
  await expect(mix).toHaveAttribute('aria-valuetext', '61%');
  await page.keyboard.press('Home');
  await expect(mix).toHaveAttribute('aria-valuetext', '60%');
});

test('dragging an echo changes its time and its level', async ({ page }) => {
  const echo = page.getByRole('slider', { name: 'Echo 1 time' });
  await expect(echo).toHaveAttribute(
    'aria-valuetext',
    '1/8 D, 80 percent level',
  );

  await drag(page, echo, 110, 45);

  // Tempo sync snaps time to 1/32 notes: 0.75 + 110 / 660 * 3 beats.
  await expect(echo).toHaveAttribute(
    'aria-valuetext',
    '1.25 beats, 55 percent level',
  );
});
