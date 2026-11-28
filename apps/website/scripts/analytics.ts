import type { Plugin } from 'vite';

/**
 * Umami's website ID in the built pages: `UMAMI_WEBSITE_ID`, the Soundor
 * organization's Actions variable, which the Website workflow passes to the
 * build, becomes `__UMAMI_WEBSITE_ID__` (`<Analytics>` reads it). Without it,
 * and always under `vite dev`, it is null and the pages have no tracker.
 */
export function analytics(): Plugin {
  return {
    name: 'soundor:analytics',
    config: (_, { command }) => ({
      define: {
        __UMAMI_WEBSITE_ID__: JSON.stringify(
          command === 'build' ? websiteId(process.env.UMAMI_WEBSITE_ID) : null,
        ),
      },
    }),
  };
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The website ID `value` holds, or null when it is unset or empty. Anything
 * but a UUID (what Umami's IDs are) fails the build rather than reach the
 * page.
 */
export function websiteId(value: string | undefined): string | null {
  const id = value?.trim();
  if (!id) {
    return null;
  }
  if (!uuid.test(id)) {
    throw new Error(
      'UMAMI_WEBSITE_ID is not an Umami website ID: expected a UUID.',
    );
  }
  return id;
}
