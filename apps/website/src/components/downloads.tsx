import {
  checksums,
  platforms,
  released,
  releases,
  repository,
} from '../release';

/** The released zips, one per platform, with where each goes. */
export function Downloads() {
  if (!released) {
    return (
      <p className="orbit-aside">
        Orbit has no release yet. Build it from{' '}
        <a href={repository}>the source</a>, or watch the repository for the
        first one.
      </p>
    );
  }
  return (
    <div className="orbit-downloads">
      <ul>
        {platforms.map((platform) => (
          <li key={platform.name}>
            <a className="orbit-download" href={platform.url}>
              <span>{platform.name}</span>
              <span className="orbit-download-arch">{platform.arch}</span>
            </a>
            <p>
              Unzip into <code>{platform.folder}</code>. Then rescan plugins in
              your DAW.
            </p>
            <p className="orbit-file">{platform.file}</p>
          </li>
        ))}
      </ul>
      <p className="orbit-aside">
        macOS isn’t available yet. Check a download against{' '}
        <a href={checksums}>its checksum</a>, or see{' '}
        <a href={releases}>every release</a>.
      </p>
    </div>
  );
}
