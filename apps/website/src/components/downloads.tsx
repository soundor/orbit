import { Card, Cards } from 'fumadocs-ui/components/card';
import { Download } from 'lucide-react';

import {
  checksums,
  platforms,
  released,
  releases,
  repository,
} from '../release';

/** The released zips, one card per platform, with where each goes. */
export function Downloads() {
  if (!released) {
    return (
      <p className="text-fd-muted-foreground">
        Orbit has no release yet. Build it from{' '}
        <a className="underline" href={repository}>
          the source
        </a>
        , or watch the repository for the first one.
      </p>
    );
  }
  return (
    <div>
      <Cards className="sm:grid-cols-2">
        {platforms.map((platform) => (
          <Card
            key={platform.name}
            icon={<Download />}
            title={`${platform.name} (${platform.arch})`}
            href={platform.url}
            external
            description={
              <>
                {platform.file}. Unzip it into <code>{platform.folder}</code>,
                then rescan plugins in your DAW.
              </>
            }
          />
        ))}
      </Cards>
      <p className="mt-4 text-sm text-fd-muted-foreground">
        macOS isn’t available yet. Check a download against{' '}
        <a className="underline" href={checksums}>
          its checksum
        </a>
        , or see{' '}
        <a className="underline" href={releases}>
          every release
        </a>
        .
      </p>
    </div>
  );
}
