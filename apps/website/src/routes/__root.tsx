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
      { title: 'Orbit: a three-voice stereo delay' },
      {
        name: 'description',
        content:
          'Orbit is a free three-voice stereo delay for Linux and Windows. Try it in your browser, then download the VST3.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
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
