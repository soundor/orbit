import { formatters } from '@soundor/components';
import { textStyle, useTheme } from '@soundor/components/theme';
import { Text } from '@soundor/react';

import { echoCoordinates } from './model';

/** The time axis under the echo map: beats in sync, else 500 ms steps. */
export function BeatScale({ sync }: { sync: boolean }) {
  const theme = useTheme();
  return [0, 1, 2, 3].map((beat) => (
    <Text
      key={beat}
      style={[
        textStyle(theme, 'value', theme.color.displayMuted),
        {
          position: 'absolute',
          left: echoCoordinates.x.map(beat) - 7,
          bottom: 14,
          fontSize: 9,
        },
      ]}
    >
      {sync
        ? `${beat} beat${beat === 1 ? '' : 's'}`
        : formatters.time(beat * 500)}
    </Text>
  ));
}
