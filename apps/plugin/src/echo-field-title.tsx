import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View, useParameter } from '@soundor/react';
import { parameters } from 'soundor:parameters';

import { voices } from './model';

/** The echo map's title and hint, which say when it is held or bypassed. */
export function EchoFieldTitle() {
  const theme = useTheme();
  const c = theme.color;
  const hold = useParameter(parameters.hold);
  const bypass = useParameter(parameters.bypass);
  const dot = bypass
    ? c.displayMuted
    : hold
      ? voices[1].color
      : voices[0].color;

  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 22,
          top: 17,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <View
          style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: dot }}
        />
        <Text style={textStyle(theme, 'section', c.displayText)}>
          {bypass ? 'ECHO MAP · BYPASSED' : hold ? 'LOOP HELD' : 'ECHO MAP'}
        </Text>
      </View>
      <Text
        style={[
          textStyle(theme, 'section', c.displayMuted),
          {
            position: 'absolute',
            top: 17,
            right: 22,
            letterSpacing: 0.8,
            pointerEvents: 'none',
          },
        ]}
      >
        {bypass ? 'DRY INPUT · ECHO SETTINGS' : 'DRAG TO SHAPE THE REPEATS'}
      </Text>
    </>
  );
}
