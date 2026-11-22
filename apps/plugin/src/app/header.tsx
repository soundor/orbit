import { View } from '@soundor/react';

import { CompareControl } from '../controls/compare-control';
import { PresetPicker } from '../presets/preset-picker';
import { Logo } from './logo';

/** The logo, the preset and the Original / Orbit comparison. */
export function Header() {
  return (
    <View
      style={{
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Logo />
      <PresetPicker />
      <CompareControl />
    </View>
  );
}
