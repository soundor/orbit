import { Link } from '@tanstack/react-router';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  AudioWaveform,
  BookOpen,
  Code,
  ExternalLink,
  FileAudio,
  GitCompare,
  History,
  ListMusic,
  MousePointerClick,
  Play,
  Repeat,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
} from 'lucide-react';
import { useId, type ReactNode } from 'react';

import { soundor } from '../layout-options';

/**
 * On a phone, where every card takes the full width, a card puts its icon
 * beside its text rather than above it, so a list of them stays short.
 */
const row =
  'max-sm:grid max-sm:grid-cols-[auto_1fr] max-sm:gap-x-3 max-sm:[&>div:first-child]:row-span-2 max-sm:[&>div:first-child]:mb-0 max-sm:[&>div:first-child]:self-start';

/** A block of the home page, headed as the Download section is. */
function Block({
  id,
  title,
  lead,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly lead: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-20 pb-16 sm:pb-24">
      <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
        <h2
          id={id}
          className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 text-balance text-fd-muted-foreground">{lead}</p>
      </div>
      {children}
    </section>
  );
}

const features = [
  {
    icon: <AudioWaveform />,
    title: 'An echo map',
    href: '/docs/controls',
    text: 'Each repeat is a dot: drag it sideways for timing, up or down for level.',
  },
  {
    icon: <Timer />,
    title: 'In time or free',
    href: '/docs/controls#sync-and-free',
    text: 'Sync ties the echoes to your song’s tempo; Free lets their times move freely.',
  },
  {
    icon: <Repeat />,
    title: 'Hold',
    href: '/docs/controls#hold',
    text: 'Loop whatever the echoes carry right now, and keep playing over it.',
  },
  {
    icon: <GitCompare />,
    title: 'Original or Orbit',
    href: '/docs/controls#original-and-orbit',
    text: 'Compare the dry sound with the effect without losing your settings.',
  },
  {
    icon: <ListMusic />,
    title: 'Four presets',
    href: '/docs/presets',
    text: 'From short tape slaps to long drifting tails, in your DAW’s program list too.',
  },
  {
    icon: <SlidersHorizontal />,
    title: 'Five knobs',
    href: '/docs/controls#knobs',
    text: 'Feedback, Tone, Motion, Spread and Mix shape the tails between the dots.',
  },
];

export function Features() {
  return (
    <Block
      id="features"
      title="Three echoes, in your hands"
      lead="Every control shapes what you hear between your phrases."
    >
      <Cards className="sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon, title, href, text }) => (
          <Card
            key={title}
            className={row}
            icon={icon}
            title={title}
            href={href}
            description={text}
          />
        ))}
      </Cards>
    </Block>
  );
}

export function Questions() {
  return (
    <Block
      id="questions"
      title="Questions"
      lead="What people ask before they install it."
    >
      <Accordions className="mx-auto max-w-4xl">
        <Accordion title="Is Orbit free?">
          Yes. Its software is released under the GNU Affero General Public
          License v3, and the music you make with it is yours.
        </Accordion>
        <Accordion title="Which systems and DAWs does it run in?">
          Any DAW that loads VST3 effects, on 64-bit Linux and Windows.
        </Accordion>
        <Accordion title="Do my sessions keep working when I update?">
          Yes. Sessions and presets saved with an earlier version open as they
          were, within the same major version.
        </Accordion>
        <Accordion title="Does the browser demo upload my audio?">
          No. An audio file you choose stays on your device, and so does your
          microphone.
        </Accordion>
        <Accordion title="Can I build it myself?">
          Yes, with Node and Rust.{' '}
          <Link
            className="underline"
            to="/docs/$"
            params={{ _splat: 'building' }}
          >
            Build from source
          </Link>{' '}
          has the steps.
        </Accordion>
      </Accordions>
    </Block>
  );
}

export function Docs() {
  return (
    <Block
      id="docs"
      title="Documentation"
      lead="What every control does, what changed, and how to build Orbit."
    >
      <Cards className="sm:grid-cols-2 lg:grid-cols-4">
        <Card
          className={row}
          icon={<SlidersHorizontal />}
          title="Controls"
          href="/docs/controls"
          description="The echo map, the knobs, Hold and Sync."
        />
        <Card
          className={row}
          icon={<BookOpen />}
          title="Presets"
          href="/docs/presets"
          description="The four factory starting points."
        />
        <Card
          className={row}
          icon={<History />}
          title="Changelog"
          href="/docs/changelog"
          description="What changed in each release."
        />
        <Card
          className={row}
          icon={<Code />}
          title="Build the VST3"
          href="/docs/building"
          description="From source, for Linux and Windows."
        />
      </Cards>
    </Block>
  );
}

/**
 * Three echoes as the echo map draws them: a burst round each, quieter as
 * they go, in the voices' colours (orange, lime, purple).
 */
const signoffEchoes = [
  { x: 230, level: 0.8, color: 'var(--orbit-voice-1)' },
  { x: 520, level: 0.55, color: 'var(--orbit-voice-2)' },
  { x: 810, level: 0.35, color: 'var(--orbit-voice-3)' },
];
const BASE = 110;
const TALL = 85;
const height = (x: number) =>
  signoffEchoes.reduce(
    (sum, echo) =>
      sum +
      echo.level *
        Math.exp(-(((x - echo.x) / 38) ** 2)) *
        (0.65 + 0.35 * Math.cos((x - echo.x) / 9)),
    0,
  );
const signoffCurve = Array.from({ length: 193 }, (_, i) => {
  const x = i * 5;
  return `${i === 0 ? 'M' : 'L'}${x} ${(BASE - TALL * height(x)).toFixed(1)}`;
}).join(' ');
const signoffDots = signoffEchoes.map((echo) => ({
  ...echo,
  y: BASE - TALL * height(echo.x),
}));

function SignoffGraph() {
  const id = useId();
  return (
    <svg
      aria-hidden
      viewBox="0 0 960 130"
      preserveAspectRatio="none"
      className="block h-24 w-full sm:h-28"
    >
      <defs>
        <linearGradient id={`${id}-line`} x1="0" x2="1" y1="0" y2="0">
          {signoffEchoes.map((echo) => (
            <stop
              key={echo.x}
              offset={echo.x / 960}
              style={{ stopColor: echo.color }}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: 'var(--orbit-voice-2)', stopOpacity: 0.16 }}
          />
          <stop
            offset="1"
            style={{ stopColor: 'var(--orbit-voice-2)', stopOpacity: 0 }}
          />
        </linearGradient>
      </defs>
      <line
        x1="0"
        x2="960"
        y1={BASE}
        y2={BASE}
        className="stroke-fd-border"
        strokeDasharray="4 6"
        vectorEffect="non-scaling-stroke"
      />
      {signoffDots.map((dot) => (
        <line
          key={dot.x}
          x1={dot.x}
          x2={dot.x}
          y1={dot.y}
          y2={BASE}
          style={{ stroke: dot.color }}
          strokeOpacity={0.5}
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={`${signoffCurve} L 960 130 L 0 130 Z`}
        fill={`url(#${id}-fill)`}
      />
      <path
        d={signoffCurve}
        fill="none"
        stroke={`url(#${id}-line)`}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The page's sign-off: a panel that points to the other plugins, above three
 * echoes like the echo map's, so it reads as the end of the page rather than
 * one more card.
 */
export function MorePlugins() {
  return (
    <section aria-labelledby="more-plugins" className="pb-16 sm:pb-24">
      <div className="overflow-hidden rounded-2xl border bg-fd-card">
        <div className="flex flex-col items-start gap-6 px-6 pt-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pt-12">
          <div className="max-w-md">
            <h2
              id="more-plugins"
              className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            >
              More plugins built with Soundor
            </h2>
            <p className="mt-2 text-balance text-fd-muted-foreground">
              Orbit is one of them. The rest are listed on soundor.dev.
            </p>
          </div>
          <a
            href={`${soundor}/plugins`}
            className={buttonVariants({
              variant: 'primary',
              className: 'shrink-0 gap-1.5 px-4 py-2.5',
            })}
          >
            Browse plugins <ExternalLink aria-hidden className="size-4" />
          </a>
        </div>
        <div className="relative mt-6 sm:mt-8">
          <SignoffGraph />
          {/* Dots as HTML, so they stay round whatever the panel's width. */}
          {signoffDots.map((dot) => (
            <span
              key={dot.x}
              aria-hidden
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fd-card shadow-sm"
              style={{
                left: `${(dot.x / 960) * 100}%`,
                top: `${(dot.y / 130) * 100}%`,
                backgroundColor: dot.color,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const demoPoints = [
  {
    icon: <MousePointerClick />,
    text: 'Drag the echoes and turn the knobs as in your DAW',
  },
  {
    icon: <FileAudio />,
    text: 'Play the demo phrase, an audio file or your microphone',
  },
  {
    icon: <ShieldCheck />,
    text: 'Nothing is uploaded: your audio stays on your device',
  },
];

/**
 * The way into the interactive example, which has a page of its own so the
 * home page does not load the web runtime for a visitor who only reads.
 */
export function TryIt() {
  return (
    <section aria-labelledby="try-it" className="pb-16 sm:pb-24">
      <div className="grid gap-8 rounded-2xl border bg-fd-card p-6 sm:p-10 md:grid-cols-2 md:items-center md:gap-12">
        <div className="flex flex-col items-start">
          <h2
            id="try-it"
            className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
          >
            Try it in your browser
          </h2>
          <p className="mt-2 text-balance text-fd-muted-foreground">
            The same Orbit as the plugin, running on this site. No download, no
            sign-up.
          </p>
          <Link
            to="/demo"
            className={buttonVariants({
              variant: 'primary',
              className: 'mt-6 gap-2 px-5 py-3 text-base',
            })}
          >
            <Play aria-hidden className="size-4" /> Open the demo
          </Link>
        </div>
        <ul className="flex flex-col divide-y rounded-xl border bg-fd-background text-sm">
          {demoPoints.map(({ icon, text }) => (
            <li key={text} className="flex items-center gap-3 px-4 py-3.5">
              <span
                aria-hidden
                className="shrink-0 text-fd-muted-foreground [&>svg]:size-4"
              >
                {icon}
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
