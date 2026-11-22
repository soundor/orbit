import { soundor as integration } from '@soundor/vitest';
import { soundor as e2e } from '@soundor/vitest-e2e';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [integration()],
        test: {
          name: 'integration',
          environment: 'soundor',
          include: ['src/**/*.test.{ts,tsx}'],
          // Libraries that import soundor:* run through Vite, as
          // @soundor/react does, so the simulated runtime serves those
          // imports. @soundor/vitest 0.19 inlines only its own packages.
          server: {
            deps: { inline: ['@soundor/components', '@soundor/icons'] },
          },
        },
      },
      {
        plugins: [e2e({ vst3: '.soundor/debug/vst3/Orbit.vst3' })],
        test: { name: 'e2e', include: ['e2e/**/*.test.ts'] },
      },
    ],
  },
});
