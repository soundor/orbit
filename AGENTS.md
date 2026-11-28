# AGENTS.md

This file provides guidance to coding agents (Claude Code, claude.ai/code and others) when working with code in this repository.

## What this is

Orbit, a three-voice stereo delay built with [Soundor](https://soundor.dev):
A pnpm workspace run by Turborepo. `apps/plugin` (package `orbit`) is the
plugin: `soundor.config.ts` declares it (parameters, presets, state, the
runtimes), `src/` is its React UI (portable Soundor UI: no DOM or browser
APIs), `lib/` its Rust processor and controller, `web/inputs.ts` the web
host's demo inputs. `apps/website` is orbit.soundor.dev (Fumadocs on
TanStack Start, prerendered for GitHub Pages): the landing page
(`src/routes/index.tsx`), the user docs in `content/docs/` (keep them in sync
when behaviour changes), the changelog page written from
`apps/plugin/CHANGELOG.md` by `scripts/changelog.ts`, and `/embed/`, the
web build itself, which the landing page and the Soundor websites put in an
iframe. Embedding is not a public feature: don't document or advertise it.
Soundor's own docs are at
https://soundor.dev/docs; the UI uses `@soundor/components` and
`@soundor/icons`. Umami's tracker is in the pages only when the build has `UMAMI_WEBSITE_ID`, the organization's Actions variable (never hardcoded or copied into the repository), which `website.yml` passes and requires; `vite dev`, local and pull-request builds have none (`scripts/analytics.ts`, `src/components/analytics.tsx`, which also names the site's hostname).

## Commands

```sh
pnpm install
pnpm check            # format + lint + typecheck + UI tests + Rust tests + site: what CI runs
pnpm --filter orbit exec vitest run --project integration src/app/__tests__/app.spec.tsx -t "<name>"
pnpm test:e2e         # the web build in Chromium (apps/plugin/e2e/web, Playwright)
xvfb-run -a pnpm test:vst3  # the Debug VST3 in Soundor's VST3 host (apps/plugin/e2e/vst3)
pnpm build:vst3       # release VST3 → apps/plugin/.soundor/dist/vst3/Soundor Orbit.vst3
pnpm build:web        # → apps/plugin/.soundor/dist/web
pnpm website          # the site, with the web build at /embed/
pnpm format:fix
```

## Conventions

- `apps/plugin/src/` is organized by module, a folder per part of the UI:
  `app/` (the editor, header, footer, logo), `echo-map/`, `controls/`,
  `presets/`, `help/`, and `ui/` for building blocks they share. One
  component per file, files in kebab-case named after what they export
  (`preset-picker.tsx` → `PresetPicker`); a module's tests are in its
  `__tests__/` as `*.spec.tsx`, and modules import each other's files
  directly. Icons come from `@soundor/icons`, not hand-drawn SVG.
- Soundor packages are pinned to exact versions; upgrade them together
  (the 0.21 packages, the VST3 runtime, the web runtime and the VST3 host
  are released together).
- Conventional Commits: release-please derives the next version and
  `apps/plugin/CHANGELOG.md` from the commits touching `apps/plugin`. Never
  edit its `version` or CHANGELOG.md by hand, and
  never merge the release PR without the user.
- Versioning is judged by saved sessions and presets (README, "Versions and
  releases"): a parameter's ID, range or meaning, or the state's shape,
  changing without a migration is breaking. `plugin.id` never changes.
- Built plugins are released only by `.github/workflows/release.yml`.
- `turbo.json`: every plugin task depends on `gen`, which writes
  `.soundor/generated` once so tasks after it never race on it; the site's
  `build` and `dev` depend on `orbit#build:web`, and so does `test:e2e`. CI
  calls the VST3 build and its tests through `pnpm --filter orbit`, outside
  turbo's strict environment.
