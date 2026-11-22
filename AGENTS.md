# AGENTS.md

This file provides guidance to coding agents (Claude Code, claude.ai/code and others) when working with code in this repository.

## What this is

Orbit, a three-voice stereo delay built with [Soundor](https://soundor.dev):
`soundor.config.ts` declares the plugin (parameters, presets, state, the
runtimes), `src/` is its React UI (portable Soundor UI: no DOM or browser
APIs), `lib/` its Rust processor and controller, `web/inputs.ts` the web
host's demo inputs, and `website/` orbit.soundor.dev, whose `/embed/` is the
web build itself, for iframes. Soundor's own docs are at
https://soundor.dev/docs; the UI uses `@soundor/components` and
`@soundor/icons`.

## Commands

```sh
pnpm install
pnpm check            # format + lint + typecheck + UI tests + Rust tests: what CI runs
pnpm exec vitest run --project integration src/App.test.tsx -t "<name>"
xvfb-run -a pnpm test:e2e   # the Debug VST3 in Soundor's VST3 host
pnpm build:vst3       # release VST3 → .soundor/dist/vst3/Orbit.vst3
pnpm build:web        # → .soundor/dist/web
pnpm website          # the site, with the web build at /embed/
pnpm format:fix
```

## Conventions

- Soundor packages are pinned to exact versions; upgrade them together
  (the 0.19 packages, the VST3 runtime, the web runtime and the VST3 host
  are released together).
- Conventional Commits: release-please derives the next version and
  CHANGELOG.md from them. Never edit `version` or CHANGELOG.md by hand, and
  never merge the release PR without the user.
- Versioning is judged by saved sessions and presets (README, "Versions and
  releases"): a parameter's ID, range or meaning, or the state's shape,
  changing without a migration is breaking. `plugin.id` never changes.
- Built plugins are released only by `.github/workflows/release.yml`.
