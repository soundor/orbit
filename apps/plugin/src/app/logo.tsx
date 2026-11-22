import { Image } from '@soundor/react';

// The repository's brand file (assets/brand), which the README and the
// website show too: the icon and the Soundor Orbit wordmark, for light
// backgrounds such as the editor's panel.
import logo from '../../../../assets/brand/soundor-orbit-logo.svg';

/** The logo's own proportions: its viewBox is 338.1 × 120. */
const HEIGHT = 40;
const WIDTH = (HEIGHT * 338.1) / 120;

/** The header's logo: the icon and Soundor Orbit. */
export function Logo() {
  return (
    <Image
      source={logo}
      accessibilityRole="header"
      accessibilityLabel="Soundor Orbit"
      style={{ width: WIDTH, height: HEIGHT, resizeMode: 'contain' }}
    />
  );
}
