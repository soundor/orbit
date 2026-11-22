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
          include: ['src/**/__tests__/*.spec.{ts,tsx}'],
          // Libraries that import soundor:* run through Vite, as
          // @soundor/react does, so the simulated runtime serves those
          // imports. @soundor/vitest 0.19 inlines only its own packages.
          server: {
            deps: { inline: ['@soundor/components', '@soundor/icons'] },
          },
        },
      },
      // The Debug VST3 in the VST3 host, its editor open: `pnpm test:vst3`
      // builds it first.
      {
        plugins: [e2e({ vst3: '.soundor/debug/vst3/Soundor Orbit.vst3' })],
        test: { name: 'vst3', include: ['e2e/vst3/**/*.test.ts'] },
      },
    ],
  },
});
