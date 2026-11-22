import { View } from '@soundor/react';

import { CompareControl } from './compare-control';
import { Logo } from './logo';
import { PresetPicker } from './preset-picker';

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
