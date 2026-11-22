import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';

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

const features = [
  {
    title: 'Three echoes you can see',
    text: 'Each repeat is a dot on the echo map. Drag it sideways for timing, up or down for level. Sync snaps the times to your song’s tempo; Free lets them land anywhere.',
    page: 'controls',
    hash: undefined,
  },
  {
    title: 'Hold catches a moment',
    text: 'Hold loops whatever the echoes carry right now. Your playing goes on over it, and moving an echo while held bends the loop’s speed.',
    page: 'controls',
    hash: 'hold',
  },
  {
    title: 'Original or Orbit',
    text: 'Switch between the dry sound and the effect without losing your settings. Four presets give you somewhere to start.',
    page: 'presets',
    hash: undefined,
  },
] as const;

function Home() {
  return (
    <HomeLayout {...layoutOptions}>
      <main className="orbit-landing">
        <section className="orbit-hero" aria-labelledby="title">
          {/* The name, then its three repeats: each later, quieter and
              smaller, in the colors of the voices they stand for. */}
          <h1 id="title" className="orbit-wordmark">
            Orbit
            <span className="orbit-echo orbit-echo-1" aria-hidden>
              Orbit
            </span>
            <span className="orbit-echo orbit-echo-2" aria-hidden>
              Orbit
            </span>
            <span className="orbit-echo orbit-echo-3" aria-hidden>
              Orbit
            </span>
          </h1>
          <p className="orbit-lede">
            A three-voice stereo delay. Press Play, drag an echo to move it in
            time, and listen for it answering in the gaps.
          </p>
          <div className="orbit-actions">
            <a className="orbit-button orbit-button-primary" href="#download">
              {released ? `Download ${version}` : 'Download'}
            </a>
            <Link className="orbit-button" to="/docs/$" params={{ _splat: '' }}>
              Read the docs
            </Link>
          </div>
        </section>

        <figure className="orbit-stage">
          <Player />
          <figcaption>
            Play starts the demo phrase. The settings button beside it switches
            to your microphone, an audio file or an oscillator.
          </figcaption>
        </figure>

        <section
          id="download"
          className="orbit-section"
          aria-labelledby="download-title"
        >
          <h2 id="download-title">
            {released ? `Download Orbit ${version}` : 'Download Orbit'}
          </h2>
          <Downloads />
        </section>

        <section
          className="orbit-section orbit-features"
          aria-labelledby="features-title"
        >
          <h2 id="features-title">What it does</h2>
          {features.map((feature) => (
            <div key={feature.title} className="orbit-feature">
              <h3>
                <Link
                  to="/docs/$"
                  params={{ _splat: feature.page }}
                  hash={feature.hash}
                >
                  {feature.title}
                </Link>
              </h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </section>

        <section
          id="embed"
          className="orbit-section"
          aria-labelledby="embed-title"
        >
          <h2 id="embed-title">Put Orbit on your page</h2>
          <p>
            The player above works in any page. Give the frame room for the
            plugin and the bar under it; Orbit scales to fit.
          </p>
          <pre className="orbit-code">
            <code>{embedCode}</code>
          </pre>
        </section>

        <footer className="orbit-footer">
          <p>
            Orbit is open source under the MIT license, and built with{' '}
            <a href="https://soundor.dev">Soundor</a>: one React interface that
            runs as a VST3 plugin and in the browser.{' '}
            <Link to="/docs/$" params={{ _splat: 'changelog' }}>
              See what changed in each release
            </Link>
            .
          </p>
        </footer>
      </main>
    </HomeLayout>
  );
}
