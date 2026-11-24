import { Image } from '@soundor/react';

// The repository's brand file (assets/brand), which the README and the
// website show too: the icon and the Soundor Orbit wordmark, for light
// backgrounds such as the editor's panel.
import logo from '../../../../assets/brand/soundor-orbit-logo.svg';

/**
 * The logo's own proportions: its viewBox is 338.1 × 136, with 8 units of
 * space above and below the 120 the drawing fills. The drawing fills the
 * header's 40 px, and the space overlaps the header's edges.
 */
const DRAWING = 40;
const HEIGHT = (DRAWING * 136) / 120;
const WIDTH = (HEIGHT * 338.1) / 136;
const OVERLAP = (DRAWING - HEIGHT) / 2;

/** The header's logo: the icon and Soundor Orbit. */
export function Logo() {
  return (
    <Image
      source={logo}
      accessibilityRole="header"
      accessibilityLabel="Soundor Orbit"
      style={{
        width: WIDTH,
        height: HEIGHT,
        marginVertical: OVERLAP,
        resizeMode: 'contain',
      }}
    />
  );
}
