import { Link } from '@tanstack/react-router';

import { repository } from '../release';

/** The year the copyright starts, as in the repository's LICENSE. */
const firstYear = 2026;
/** The year the page was built: the site is rebuilt with every release. */
const year = new Date().getFullYear();
const years = year > firstYear ? `${firstYear}–${year}` : `${firstYear}`;

const link = 'hover:text-fd-foreground focus-visible:text-fd-foreground';

/**
 * The legal line every page ends with: the copyright, the software's
 * license, and the Soundor-wide Privacy Policy and Brand Guidelines.
 */
function Legal() {
  return (
    <div className="flex flex-col gap-2 text-xs text-fd-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p>
        © <span suppressHydrationWarning>{years}</span> Dmitrii Balakin. Orbit’s
        software is released under the{' '}
        <a
          className={`underline underline-offset-2 ${link}`}
          href={`${repository}/blob/main/LICENSE`}
        >
          GNU Affero General Public License v3
        </a>
        . Music you make with it is yours.
      </p>
      <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-1">
        <a className={link} href="https://soundor.dev/privacy">
          Privacy
        </a>
        <a className={link} href="https://soundor.dev/brand">
          Brand
        </a>
      </nav>
    </div>
  );
}

/** The home page's footer. */
export function SiteFooter() {
  return (
    <footer role="contentinfo" className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 text-sm text-fd-muted-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>A free three-voice stereo delay, built with Soundor.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className={link} to="/docs/$" params={{ _splat: '' }}>
              Docs
            </Link>
            <Link
              className={link}
              to="/docs/$"
              params={{ _splat: 'changelog' }}
            >
              Changelog
            </Link>
            <a className={link} href={repository}>
              GitHub
            </a>
            <a className={link} href="https://soundor.dev/">
              Soundor
            </a>
          </nav>
        </div>
        <div className="border-t pt-6">
          <Legal />
        </div>
      </div>
    </footer>
  );
}

/** The legal line under a documentation page, after its previous/next links. */
export function PageLegal() {
  return (
    <footer className="mt-10 border-t pt-6">
      <Legal />
    </footer>
  );
}
