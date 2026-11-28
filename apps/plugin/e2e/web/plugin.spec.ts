import { expect, test } from '@playwright/test';

import { openOrbit, saved } from './orbit';

test.beforeEach(async ({ page }) => {
  await openOrbit(page);
});

test('Hold holds, and says how to let sound in again', async ({ page }) => {
  const hold = page.getByRole('button', { name: 'Hold' });
  await expect(hold).toHaveAttribute('aria-pressed', 'false');

  await hold.click();

  await expect(hold).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Release to let sound in')).toBeVisible();
});

test('a preset sets the controls, and releases Hold', async ({ page }) => {
  await page.getByRole('button', { name: 'Hold' }).click();

  await page.getByRole('button', { name: 'Next preset' }).click();

  // The web host's toolbar lists the presets too: read the plugin's own.
  await expect(page.getByRole('main').getByText('Warm magnetic')).toBeVisible();
  await expect(page.getByText('FREE')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Hold' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(page.getByRole('slider', { name: 'Mix' })).toHaveAttribute(
    'aria-valuetext',
    '60%',
  );
});

test('Original and Orbit compare the dry sound with the effect', async ({
  page,
}) => {
  const original = page.getByRole('radio', { name: 'Original' });

  await original.click();

  await expect(original).toBeChecked();
  await expect(page.getByText('Bypassed · original audio')).toBeVisible();
  await page.getByRole('radio', { name: 'Orbit' }).click();
  await expect(page.getByRole('radio', { name: 'Orbit' })).toBeChecked();
  await expect(page.getByText('Bypassed · original audio')).toBeHidden();
});

test('the guide opens, and Escape closes it', async ({ page }) => {
  await page.getByRole('button', { name: 'How to use Orbit' }).click();
  const guide = page.getByRole('dialog', { name: 'Orbit controls guide' });
  await expect(guide).toBeVisible();
  await expect(guide.getByText('Shape the echoes')).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(guide).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'How to use Orbit' }),
  ).toBeVisible();
});

test('the settings come back after a reload', async ({ page }) => {
  const mix = page.getByRole('slider', { name: 'Mix' });
  await mix.click();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Hold' }).click();
  await expect(mix).toHaveAttribute('aria-valuetext', '100%');
  await expect
    .poll(async () => (await saved(page))?.parameters)
    .toMatchObject({ mix: 1, hold: true });

  await page.reload();

  await expect(mix).toHaveAttribute('aria-valuetext', '100%');
  await expect(page.getByRole('button', { name: 'Hold' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(
    page.getByText('Custom settings. Choose a preset to start again.'),
  ).toBeVisible();
});

test('Play starts the transport', async ({ page }) => {
  const host = page.getByRole('toolbar', { name: 'Host' });

  await host.getByRole('button', { name: 'Play' }).click();

  await expect(host.getByRole('button', { name: 'Pause' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('nothing is logged as an error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Soundor Orbit' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Play' }).click();
  await page.getByRole('button', { name: 'Next preset' }).click();

  expect(errors).toEqual([]);
});
