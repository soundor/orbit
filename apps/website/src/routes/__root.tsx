import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import DefaultSearchDialog, {
  type DefaultSearchDialogProps,
} from 'fumadocs-ui/components/dialog/search-default';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';

import styles from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Soundor Orbit: a three-voice stereo delay' },
      {
        name: 'description',
        content:
          'Soundor Orbit is a free three-voice stereo delay for Linux and Windows. Try it in your browser, then download the VST3.',
      },
      { property: 'og:title', content: 'Soundor Orbit' },
      {
        property: 'og:image',
        content: 'https://orbit.soundor.dev/social-preview.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootProvider search={{ SearchDialog }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}

function SearchDialog(props: DefaultSearchDialogProps) {
  return (
    <DefaultSearchDialog {...props} type="static" api="/search-index.json" />
  );
}
