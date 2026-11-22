import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View, usePresetSelection } from '@soundor/react';
import { presets } from 'soundor:presets';

import { PresetArrow } from './preset-arrow';

/**
 * The factory preset in use, and arrows to the previous and next ones. After
 * an edit it is marked modified (`*`); settings no preset has are Custom.
 */
export function PresetPicker() {
  const theme = useTheme();
  const catalog = presets.factory.list();
  const selection = usePresetSelection(presets);
  const index = catalog.findIndex((entry) => entry.id === selection.factoryId);
  const selected = catalog[index];
  const load = (next: number) => {
    const count = catalog.length;
    presets.factory.load(catalog[(next + count) % count]!.id, {
      history: true,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.spaceSm,
      }}
    >
      <PresetArrow
        direction="previous"
        // From Custom, back to the last preset.
        onPress={() => load(index < 0 ? -1 : index - 1)}
      />
      <View style={{ width: 164, gap: theme.spacing.spaceXxs }}>
        <Text style={textStyle(theme, 'technical')}>
          PRESET / {index < 0 ? 'CUSTOM' : String(index + 1).padStart(2, '0')}
          {selection.modified ? ' *' : ''}
        </Text>
        <Text style={textStyle(theme, 'title')}>
          {selected?.name ?? 'Custom'}
        </Text>
      </View>
      <PresetArrow direction="next" onPress={() => load(index + 1)} />
    </View>
  );
}
