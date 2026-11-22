import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { defineConfig } from 'vite';

import { serveFile } from './scripts/static.ts';

export default defineConfig({
  plugins: [
    {
      // public/embed/, which scripts/sync-embed.ts writes, served from disk
      // under `vite dev`: Vite's list of public files goes stale when it is
      // rewritten while it runs (the web build rebuilt, say).
      name: 'orbit:embed',
      configureServer(server) {
        const publicDir = new URL('./public', import.meta.url).pathname;
        server.middlewares.use((request, response, next) => {
          if (
            !(request.url ?? '').startsWith('/embed/') ||
            !serveFile(publicDir, request, response)
          ) {
            next();
          }
        });
      },
    },
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      pages: [{ path: '/search-index.json' }],
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
    }),
    react(),
  ],
});
