import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { repository } from './release';

export const layoutOptions = {
  nav: {
    title: (
      <span className="orbit-nav-title">
        <img src="/favicon.svg" alt="" width={22} height={22} />
        Orbit
      </span>
    ),
  },
  githubUrl: repository,
  links: [
    { text: 'Docs', url: '/docs' },
    { text: 'Changelog', url: '/docs/changelog' },
  ],
} satisfies BaseLayoutProps;
