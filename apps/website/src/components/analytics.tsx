import { useEffect } from 'react';

declare const __UMAMI_WEBSITE_ID__: string | null;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data: Record<string, string>) => Promise<void>;
    };
  }
}

function trackClick(event: MouseEvent) {
  if (!window.umami || !(event.target instanceof Element)) return;
  const target = event.target;
  const link = target.closest<HTMLAnchorElement>('a[href]');
  if (link) {
    if (link.protocol !== 'https:' && link.protocol !== 'http:') return;
    const { hostname, pathname } = link;
    const github =
      hostname === 'github.com' || hostname.endsWith('.github.com');
    const destination = hostname + pathname;

    // Send immediately: Umami uses keepalive, so the link need not wait.
    if (
      link.hasAttribute('download') ||
      (github && /\/releases\/download\/.*\.zip$/.test(pathname))
    ) {
      void window.umami.track('download_click', { destination });
    } else if (github) {
      void window.umami.track('github_click', { destination });
    }
    return;
  }

  if (event.type !== 'click') return;
  // Fumadocs uses the same copy button inside code blocks on the home and docs pages.
  const code = target
    .closest('button[aria-live="polite"]')
    ?.closest('figure.shiki')
    ?.querySelector<HTMLElement>('pre code');
  const install = code?.innerText.match(
    /^\s*(?:\$\s*)?(npm|pnpm)\s+(?:add|i|install|create)\b/m,
  );
  if (install?.[1])
    void window.umami.track('install_command_copy', { manager: install[1] });
}

/** The site's production hostname: Umami counts visits to it alone. */
const hostname = 'orbit.soundor.dev';

/**
 * Umami's tracker, when the build had a website ID (`scripts/analytics.ts`).
 * It sets no cookies, leaves out query strings and fragments, and does
 * nothing in a browser that sends Do Not Track.
 */
export function Analytics() {
  const id = __UMAMI_WEBSITE_ID__;
  useEffect(() => {
    if (id === null) return;
    const middleClick = (event: MouseEvent) => {
      if (event.button === 1) trackClick(event);
    };
    document.addEventListener('click', trackClick, true);
    document.addEventListener('auxclick', middleClick, true);
    return () => {
      document.removeEventListener('click', trackClick, true);
      document.removeEventListener('auxclick', middleClick, true);
    };
  }, [id]);

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
