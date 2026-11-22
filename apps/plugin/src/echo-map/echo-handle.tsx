import { formatters } from '@soundor/components';
import { useXYPad } from '@soundor/components/headless';
import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View } from '@soundor/react';

import { mapCoordinates } from './geometry';
import { beatLabel, milliseconds } from './timing';
import { levels, times, voices } from './voices';

const size = 42;

/**
 * One echo on the map: a numbered dot that sets its time when dragged
 * across and its level when dragged up or down, with its time under it.
 */
export function EchoHandle({
  index,
  bpm,
  sync,
  bypass,
}: {
  index: number;
  bpm: number;
  sync: boolean;
  bypass: boolean;
}) {
  const theme = useTheme();
  const c = theme.color;
  const voice = voices[index]!;
  const color = bypass ? c.displayMuted : voice.color;
  const time = times[index]!;
  const format = (value: number) =>
    sync ? beatLabel(value) : formatters.time(milliseconds(value, false, bpm));
  const handle = useXYPad(
    {
      parameter: time,
      format,
      // Tempo sync snaps to 1/32 notes.
      snap: sync ? (value) => Math.round(value * 8) / 8 : undefined,
      history: false,
    },
    { parameter: levels[index]!, history: false },
    {
      label: time.info.label,
      hint: 'Drag horizontally for time and vertically for level. Left and right change time; up and down change level.',
      keyStep: [0.125, 0.05],
      dragMode: 'relative',
      travel: [
        mapCoordinates.x.map(3) - mapCoordinates.x.map(0.125),
        mapCoordinates.rect.height,
      ],
      describeValue: (value, level) =>
        `${format(value)}, ${Math.round(level * 100)} percent level`,
    },
  );

  return (
    <View
      {...handle.handlers}
      style={{
        position: 'absolute',
        left: mapCoordinates.x.map(handle.x.value) - size / 2,
        top: mapCoordinates.y.map(handle.y.value) - size / 2,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size / 2,
        borderWidth: theme.size.borderHairline,
        borderColor: bypass ? c.displayAxis : color,
        outlineWidth: handle.focusVisible ? theme.size.focusRing : 0,
        outlineOffset: 2,
        outlineColor: c.focus,
        backgroundColor: bypass ? c.display : `${color}15`,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: bypass ? c.displayGrid : color,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          accessible={false}
          style={[
            textStyle(theme, 'value', bypass ? c.displayText : voice.ink),
            { fontWeight: 'bold' },
          ]}
        >
          {index + 1}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: size + 2,
          width: 100,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          accessible={false}
          style={[textStyle(theme, 'value', color), { fontSize: 10 }]}
        >
          {format(handle.x.value)}
        </Text>
      </View>
    </View>
  );
}
