declare const __UMAMI_WEBSITE_ID__: string | null;

/** The site's production hostname: Umami counts visits to it alone. */
const hostname = 'orbit.soundor.dev';

/**
 * Umami's tracker, when the build had a website ID (`scripts/analytics.ts`).
 * It sets no cookies, leaves out query strings and fragments, and does
 * nothing in a browser that sends Do Not Track.
 */
export function Analytics() {
  const id = __UMAMI_WEBSITE_ID__;
  if (id === null) {
    return null;
  }
  return (
    <script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={id}
      data-domains={hostname}
      data-exclude-search="true"
      data-exclude-hash="true"
      data-do-not-track="true"
    />
  );
}
