/**
 * The release this site describes: the version in apps/plugin/package.json,
 * which release-please bumps only in the release it makes, so main between
 * releases still names the last one. The release workflow deploys the site
 * from the release's tag.
 */
import plugin from '../../plugin/package.json' with { type: 'json' };

export const repository = 'https://github.com/soundor/orbit';
export const version = plugin.version;
/** Before the first release, package.json says 0.0.0. */
export const released = version !== '0.0.0';

const download = `${repository}/releases/download/v${version}`;

/** The platforms a release carries, as the release workflow names them. */
export const platforms = [
  {
    name: 'Linux',
    arch: 'x86_64',
    file: `Orbit-${version}-linux-x86_64.zip`,
    folder: '~/.vst3',
  },
  {
    name: 'Windows',
    arch: 'x64',
    file: `Orbit-${version}-windows-x64.zip`,
    folder: 'C:\\Program Files\\Common Files\\VST3',
  },
].map((platform) => ({ ...platform, url: `${download}/${platform.file}` }));

export const checksums = `${download}/SHA256SUMS`;
export const releases = `${repository}/releases`;
