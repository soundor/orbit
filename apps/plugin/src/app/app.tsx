import { useTheme } from '@soundor/components/theme';
import { View, useHostState } from '@soundor/react';

import { KnobRow } from '../controls/knob-row';
import { EchoMap } from '../echo-map/echo-map';
import { Footer } from './footer';
import { Header } from './header';

/** Orbit at the 800×600 it is laid out at: header, echo map, knobs, footer. */
export function App() {
  const { color, spacing } = useTheme();
  const { transport } = useHostState();
  const bpm = transport?.bpm ?? 120;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.background,
        paddingHorizontal: spacing.spaceXxl,
        paddingTop: 20,
      }}
    >
      <Header />
      <View style={{ marginTop: 14 }}>
        <EchoMap bpm={bpm} playing={transport?.playing ?? false} />
      </View>
      <KnobRow />
      <Footer bpm={bpm} />
    </View>
  );
}
