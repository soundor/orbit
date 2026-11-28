import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { ExternalLink } from 'lucide-react';

// The repository's brand files, which the README and the plugin show too.
import logoDark from '../../../assets/brand/soundor-orbit-logo-on-dark.svg?url';
import logo from '../../../assets/brand/soundor-orbit-logo.svg?url';
import { repository } from './release';

export const soundor = 'https://soundor.dev';
export const soundorLink = {
  text: 'Soundor',
  url: `${soundor}/`,
  external: true,
};
/** The interactive example, on a page of its own. */
export const demoLink = { text: 'Demo', url: '/demo' };

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
    demoLink,
    { text: 'Changelog', url: '/docs/changelog' },
    {
      ...soundorLink,
      text: (
        <span className="inline-flex items-center gap-1">
          {soundorLink.text}
          <ExternalLink aria-hidden className="size-3" />
        </span>
      ),
    },
  ],
} satisfies BaseLayoutProps;

/** The header's links on the pages outside the docs. */
export const homeLinks: LinkItemType[] = [
  { text: 'Docs', url: '/docs' },
  ...layoutOptions.links,
];
