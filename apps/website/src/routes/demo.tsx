import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { homeLinks, layoutOptions } from '../layout-options';

export const Route = createFileRoute('/demo')({
  head: () => ({
    meta: [
      { title: 'Demo | Soundor Orbit' },
      {
        name: 'description',
        content:
          'Soundor Orbit, playable in your browser: drag the echoes, pick presets, play the demo phrase or your own audio.',
      },
    ],
  }),
  component: Demo,
});

/** The web build, as large as the window allows below the site's header. */
function Demo() {
  return (
    <HomeLayout {...layoutOptions} links={homeLinks}>
      <main className="flex h-[calc(100dvh-3.5rem)] min-h-96 flex-col">
        <iframe
          // index.html by name: Vite's dev server does not serve a folder's
          // index; every server serves this.
          src="/embed/index.html"
          title="Soundor Orbit, playable in the browser"
          allow="autoplay; microphone"
          className="block w-full flex-1 border-t bg-black"
        />
      </main>
    </HomeLayout>
  );
}
