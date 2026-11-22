import { Toggle } from '@soundor/components';
import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View, useParameter } from '@soundor/react';
import { parameters } from 'soundor:parameters';

/** Hold, which loops what the echoes carry, and what pressing it does. */
export function HoldControl() {
  const theme = useTheme();
  const hold = useParameter(parameters.hold);
  return (
    <View
      style={{
        flex: 1,
        height: 132,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.spaceMd,
      }}
    >
      <Toggle
        parameter={parameters.hold}
        size="lg"
        style={{ width: 137, alignSelf: 'center' }}
      />
      <Text style={textStyle(theme, 'caption')}>
        {hold ? 'Release to let sound in' : 'Catch a moment'}
      </Text>
    </View>
  );
}
