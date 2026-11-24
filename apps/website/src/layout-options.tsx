import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

// The repository's brand files, which the README and the plugin show too.
import logoDark from '../../../assets/brand/soundor-orbit-logo-on-dark.svg?url';
import logo from '../../../assets/brand/soundor-orbit-logo.svg?url';
import { repository } from './release';

export const layoutOptions = {
  nav: {
    title: (
      <>
        {/* The wordmark is drawn in the theme's ink: one file per theme. */}
        <img
          src={logo}
          alt="Soundor Orbit"
          width={90}
          height={36}
          className="h-9 w-auto dark:hidden"
        />
        <img
          src={logoDark}
          alt="Soundor Orbit"
          width={90}
          height={36}
          className="hidden h-9 w-auto dark:block"
        />
      </>
    ),
  },
  githubUrl: repository,
  links: [
    { text: 'Changelog', url: '/docs/changelog' },
    { text: 'Soundor', url: 'https://soundor.dev/', external: true },
  ],
} satisfies BaseLayoutProps;
