import { useTheme } from '@soundor/components/theme';
import { View, useParameter } from '@soundor/react';
import { parameters } from 'soundor:parameters';

import { BeatScale } from './beat-scale';
import { EchoCanvas } from './echo-canvas';
import { EchoHandle } from './echo-handle';
import { EchoMapTitle } from './echo-map-title';
import { mapSize } from './geometry';

/**
 * The echo map: the three echoes as handles over their drawn curves, time
 * across and level up, with the beats under them.
 */
export function EchoMap({ bpm, playing }: { bpm: number; playing: boolean }) {
  const theme = useTheme();
  const sync = useParameter(parameters.sync);
  const bypass = useParameter(parameters.bypass);
  return (
    <View
      style={{
        ...mapSize,
        borderRadius: theme.radius.radiusXl,
        overflow: 'hidden',
        backgroundColor: theme.color.display,
      }}
    >
      <EchoCanvas playing={playing} />
      <EchoMapTitle />
      {[0, 1, 2].map((index) => (
        <EchoHandle
          key={index}
          index={index}
          bpm={bpm}
          sync={sync}
          bypass={bypass}
        />
      ))}
      <BeatScale sync={sync} />
    </View>
  );
}
