import { Toggle } from '@soundor/components';
import { textStyle, useTheme } from '@soundor/components/theme';
import {
  Text,
  View,
  useParameter,
  usePresetSelection,
  useStateValue,
} from '@soundor/react';
import { parameters } from 'soundor:parameters';
import { presets } from 'soundor:presets';
import { state } from 'soundor:state';

import { HelpGuide } from './help-guide';

/** Tempo sync and the tempo, what Orbit is doing, and the guide. */
export function Footer({ bpm }: { bpm: number }) {
  const theme = useTheme();
  const bypass = useParameter(parameters.bypass);
  const { factoryId } = usePresetSelection(presets);
  const description = useStateValue(state.presetDescription);
  const status = bypass
    ? 'Bypassed · original audio'
    : factoryId !== null
      ? description
      : 'Custom settings. Choose a preset to start again.';

  return (
    <View
      style={{
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.spaceLg,
        borderTopWidth: theme.size.borderHairline,
        borderColor: theme.color.divider,
        paddingVertical: theme.spacing.spaceLg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.spaceMd,
        }}
      >
        <Toggle
          parameter={parameters.sync}
          label="Sync"
          offLabel="Free"
          variant="chip"
          accessibilityLabel="Tempo sync"
        />
        <Text style={textStyle(theme, 'value')}>{bpm.toFixed(0)} BPM</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.spaceLg,
          flexShrink: 1,
        }}
      >
        <Text style={[textStyle(theme, 'caption'), { flexShrink: 1 }]}>
          {status}
        </Text>
        <HelpGuide />
      </View>
    </View>
  );
}
