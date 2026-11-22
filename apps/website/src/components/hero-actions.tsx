import { Link } from '@tanstack/react-router';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { ArrowRight, Download, Play } from 'lucide-react';

import { platforms, released, version } from '../release';
import { useVisitorPlatform } from './visitor-platform';

const primary = buttonVariants({
  variant: 'primary',
  className: 'gap-1.5 px-4 py-2.5',
});
const outline = buttonVariants({
  variant: 'outline',
  className: 'px-4 py-2.5',
});

/**
 * The hero's buttons. On Linux and Windows, the main one downloads that
 * platform's zip; on macOS, which has no release yet, and on systems that
 * run no VST3, it plays Orbit here. Prerendered, and before hydration, it
 * goes to the download section.
 */
export function HeroActions() {
  const visitor = useVisitorPlatform();
  const platform = platforms.find((entry) => entry.id === visitor);
  const docs = (
    <Link className={outline} to="/docs/$" params={{ _splat: '' }}>
      Read the docs
    </Link>
  );

  if (!released || visitor === null) {
    return (
      <Actions>
        <a className={primary} href="#download">
          {released ? `Download ${version}` : 'Download'}
          <ArrowRight aria-hidden className="size-4" />
        </a>
        {docs}
      </Actions>
    );
  }

  if (platform) {
    return (
      <Actions
        note={
          <>
            Version {version} for {platform.name} ({platform.arch}).{' '}
            <a className="underline" href="#download">
              Other downloads
            </a>
          </>
        }
      >
        <a className={primary} href={platform.url}>
          <Download aria-hidden className="size-4" />
          Download for {platform.name}
        </a>
        {docs}
      </Actions>
    );
  }

  return (
    <Actions
      note={
        <>
          {visitor === 'macos'
            ? 'Soundor Orbit isn’t available for macOS yet.'
            : 'Soundor Orbit runs in a DAW on Linux and Windows.'}{' '}
          <a className="underline" href="#download">
            Linux and Windows downloads
          </a>
        </>
      }
    >
      <a className={primary} href="#play">
        <Play aria-hidden className="size-4" />
        Play in your browser
      </a>
      {docs}
    </Actions>
  );
}

function Actions({
  children,
  note,
}: {
  readonly children: React.ReactNode;
  readonly note?: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
      {/* Always rendered, so the page doesn't move when it fills in. */}
      <p className="min-h-5 text-sm text-fd-muted-foreground">{note}</p>
    </div>
  );
}
