import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  ArrowRight,
  AudioWaveform,
  Code,
  ExternalLink,
  GitCompare,
  Globe,
  ListMusic,
  Repeat,
} from 'lucide-react';

import { Downloads } from '../components/downloads';
import { Player } from '../components/player';
import { layoutOptions } from '../layout-options';
import { released, version } from '../release';

export const Route = createFileRoute('/')({ component: Home });

const embedCode = `<iframe
  src="https://orbit.soundor.dev/embed/"
  title="Orbit, a three-voice stereo delay"
  allow="autoplay; microphone"
  width="800" height="640"
></iframe>`;

function Home() {
  return (
    <HomeLayout
      {...layoutOptions}
      links={[
        { text: 'Docs', url: '/docs' },
        ...layoutOptions.links.map((link) =>
          link.external
            ? {
                ...link,
                text: (
                  <span className="inline-flex items-center gap-1">
                    {link.text}
                    <ExternalLink aria-hidden className="size-3" />
                  </span>
                ),
              }
            : link,
        ),
      ]}
    >
      <main className="relative isolate w-full overflow-hidden">
        {/* A faint grid behind the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] [background-image:linear-gradient(to_right,var(--color-fd-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fd-border)_1px,transparent_1px)] [background-size:48px_48px] opacity-60 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_0%,black,transparent)]"
        />

        <div className="mx-auto max-w-6xl px-6">
          <section className="flex flex-col items-center pt-20 pb-14 text-center sm:pt-28">
            <a
              href="https://soundor.dev/"
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-fd-card/80 px-3 py-1 text-xs text-fd-muted-foreground backdrop-blur transition-colors hover:text-fd-foreground"
            >
              <AudioWaveform aria-hidden className="size-3.5 text-fd-primary" />
              Built with Soundor · VST3 and the web
              <ArrowRight aria-hidden className="size-3" />
            </a>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Orbit,{' '}
              <span className="bg-gradient-to-r from-fd-primary to-fd-foreground/60 bg-clip-text text-transparent">
                a three-voice stereo delay
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-balance text-fd-muted-foreground">
              Drag three echoes in time and level, hold them in a loop, and hear
              them answer in the gaps. Free for Linux and Windows, and playable
              right here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                className={buttonVariants({
                  variant: 'primary',
                  className: 'gap-1.5 px-4 py-2.5',
                })}
                href="#download"
              >
                {released ? `Download ${version}` : 'Download'}
                <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'px-4 py-2.5',
                })}
                to="/docs/$"
                params={{ _splat: '' }}
              >
                Read the docs
              </Link>
            </div>
          </section>

          <section aria-labelledby="live" className="pb-24">
            <div className="mx-auto max-w-[960px] rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40">
              <Player />
            </div>
            <p
              id="live"
              className="mx-auto mt-5 max-w-2xl text-center text-sm text-fd-muted-foreground"
            >
              Orbit, running live in the web runtime. Press Play under the
              plugin and drag an echo; the settings button beside Play switches
              to your microphone, an audio file or an oscillator.
            </p>
          </section>

          <section id="download" className="scroll-mt-20 pb-24">
            <Heading
              eyebrow="Download"
              title={released ? `Orbit ${version}` : 'Orbit'}
              text="A VST3 plugin for any DAW that loads VST3 effects."
            />
            <div className="mx-auto max-w-3xl">
              <Downloads />
            </div>
          </section>

          <section className="pb-24">
            <Heading
              eyebrow="What it does"
              title="Three echoes, in your hands"
              text="Every control shapes what you hear between your phrases."
            />
            <Cards className="sm:grid-cols-2 lg:grid-cols-3">
              <Card
                icon={<AudioWaveform />}
                title="An echo map"
                href="/docs/controls"
                description="Each repeat is a dot: drag it sideways for timing, up or down for level, synced to your tempo or free."
              />
              <Card
                icon={<Repeat />}
                title="Hold"
                href="/docs/controls#hold"
                description="Loop whatever the echoes carry right now, and keep playing over it."
              />
              <Card
                icon={<GitCompare />}
                title="Original or Orbit"
                href="/docs/controls#original-and-orbit"
                description="Compare the dry sound with the effect without losing your settings."
              />
              <Card
                icon={<ListMusic />}
                title="Four presets"
                href="/docs/presets"
                description="Starting points from short tape slaps to long drifting tails, in your DAW's program list too."
              />
              <Card
                icon={<Globe />}
                title="In the browser"
                href="/docs/browser"
                description="The same plugin on this page, with your microphone or an audio file."
              />
              <Card
                icon={<Code />}
                title="Open source"
                href="/docs/building"
                description="React for the interface, Rust for the sound, built with Soundor. MIT licensed."
              />
            </Cards>
          </section>

          <section className="grid gap-10 pb-28 lg:grid-cols-[2fr_3fr] lg:items-center">
            <Heading
              align="left"
              eyebrow="Embed"
              title="Put Orbit on your page"
              text="The player above works in any page. Give the frame room for the plugin and the bar under it; Orbit scales to fit."
            />
            <CodeBlock title="index.html" className="my-0">
              <Pre>
                {/* Each line in its own span, as the code block lays out
                    highlighted code. */}
                <code>
                  {embedCode.split('\n').map((line, index) => (
                    <span key={index} className="line">
                      {line}
                    </span>
                  ))}
                </code>
              </Pre>
            </CodeBlock>
          </section>

          <section className="mb-24 overflow-hidden rounded-2xl border bg-fd-card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Put Orbit on a track
            </h2>
            <p className="mx-auto mt-3 max-w-md text-fd-muted-foreground">
              Install it in a minute, then learn the controls in five.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                className={buttonVariants({
                  variant: 'primary',
                  className: 'gap-1.5 px-4 py-2.5',
                })}
                href="#download"
              >
                Download
              </a>
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'gap-1.5 px-4 py-2.5',
                })}
                to="/docs/$"
                params={{ _splat: 'changelog' }}
              >
                What’s new
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </HomeLayout>
  );
}

function Heading({
  eyebrow,
  title,
  text,
  align = 'center',
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly align?: 'center' | 'left';
}) {
  return (
    <div className={align === 'center' ? 'mb-8 text-center' : 'mb-6'}>
      <p className="mb-2 font-mono text-xs tracking-wider text-fd-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-fd-muted-foreground">{text}</p>
    </div>
  );
}
