import { Card, Cards } from 'fumadocs-ui/components/card';
import { Download } from 'lucide-react';

import {
  checksums,
  platforms,
  released,
  releases,
  repository,
} from '../release';

/**
 * The released zips, one card per platform, with where each goes. `centered`
 * centers the notes, as under the landing page's centered heading; the docs
 * keep them aligned with their text.
 */
export function Downloads({
  centered = false,
}: {
  readonly centered?: boolean;
}) {
  const align = centered ? 'text-center' : '';
  if (!released) {
    return (
      <p className={`text-fd-muted-foreground ${align}`}>
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
      <p className={`mt-4 text-sm text-fd-muted-foreground ${align}`}>
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
