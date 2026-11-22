import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { repository } from './release';

export const layoutOptions = {
  nav: {
    title: (
      <span className="inline-flex items-center gap-2 font-semibold">
        <img src="/favicon.svg" alt="" width={24} height={24} />
        Soundor Orbit
      </span>
    ),
  },
  githubUrl: repository,
  links: [
    { text: 'Changelog', url: '/docs/changelog' },
    { text: 'Soundor', url: 'https://soundor.dev/', external: true },
  ],
} satisfies BaseLayoutProps;
