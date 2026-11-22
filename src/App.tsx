import {
  Button,
  ControlGroup,
  Divider,
  Knob,
  SegmentedControl,
  Toggle,
  formatters,
  type RangeParameter,
  type SegmentOption,
} from '@soundor/components';
import { textStyle, useTheme } from '@soundor/components/theme';
import {
  Text,
  View,
  useHostState,
  useParameter,
  usePresetSelection,
  useStateValue,
} from '@soundor/react';
import { Path, Svg } from '@soundor/react/svg';
import { parameters } from 'soundor:parameters';
import { presets } from 'soundor:presets';
import { state } from 'soundor:state';

import { EchoField } from './EchoField';
import { HelpGuide } from './HelpGuide';

const compare: readonly SegmentOption<'original' | 'processed'>[] = [
  {
    value: 'original',
    label: 'Original',
    hint: 'Hear the input without Orbit',
  },
  {
    value: 'processed',
    label: 'Orbit',
    hint: 'Hear the current Orbit settings',
  },
];

const knobs: readonly {
  parameter: RangeParameter;
  hint: string;
  format?: (value: number) => string;
}[] = [
  { parameter: parameters.feedback, hint: 'Length of the echo tail' },
  {
    parameter: parameters.tone,
    hint: 'Brightness of the repeats',
    format: (value) => formatters.frequency(400 * 30 ** value),
  },
  { parameter: parameters.motion, hint: 'Pitch and timing drift' },
  { parameter: parameters.spread, hint: 'Stereo width of the echoes' },
  { parameter: parameters.mix, hint: 'Balance between original and echoes' },
];

function PresetArrow({
  direction,
  onPress,
}: {
  direction: 'previous' | 'next';
  onPress: () => void;
}) {
  const { color } = useTheme();
  const previous = direction === 'previous';
  return (
    <Button
      variant="ghost"
      size="sm"
      accessibilityLabel={previous ? 'Previous preset' : 'Next preset'}
      style={{ width: 28, height: 28, paddingHorizontal: 0 }}
      onPress={onPress}
    >
      <Svg
        width={12}
        height={12}
        viewBox={[0, 0, 12, 12]}
        accessible={false}
        style={{ pointerEvents: 'none' }}
      >
        <Path
          d={
            previous ? 'M 7.5 2.5 L 4 6 L 7.5 9.5' : 'M 4.5 2.5 L 8 6 L 4.5 9.5'
          }
          fill="none"
          stroke={color.textSecondary}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Button>
  );
}

export function App() {
  const theme = useTheme();
  const c = theme.color;
  const catalog = presets.factory.list();
  const selection = usePresetSelection(presets);
  const preset = catalog.findIndex((entry) => entry.id === selection.factoryId);
  const selected = catalog[preset];
  const description = useStateValue(state.presetDescription);
  const host = useHostState();
  const hold = useParameter(parameters.hold);
  const bypass = useParameter(parameters.bypass);
  const bpm = host.transport?.bpm ?? 120;
  const choose = (index: number) => {
    presets.factory.load(catalog[index]!.id, { history: true });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.background,
        paddingHorizontal: theme.spacing.spaceXxl,
        paddingTop: 20,
      }}
    >
      <View
        style={{
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={textStyle(theme, 'display')}>Orbit</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.spaceSm,
          }}
        >
          <PresetArrow
            direction="previous"
            onPress={() =>
              choose(
                preset < 0
                  ? catalog.length - 1
                  : (preset + catalog.length - 1) % catalog.length,
              )
            }
          />
          <View style={{ width: 164, gap: theme.spacing.spaceXxs }}>
            <Text style={textStyle(theme, 'technical')}>
              PRESET /{' '}
              {preset < 0 ? 'CUSTOM' : String(preset + 1).padStart(2, '0')}
              {selection.modified ? ' *' : ''}
            </Text>
            <Text style={textStyle(theme, 'title')}>
              {selected?.name ?? 'Custom'}
            </Text>
          </View>
          <PresetArrow
            direction="next"
            onPress={() => choose((preset + 1) % catalog.length)}
          />
        </View>
        <SegmentedControl
          options={compare}
          value={bypass ? 'original' : 'processed'}
          label="Compare audio"
          onChange={(value) =>
            parameters.bypass.set(value === 'original', { history: true })
          }
        />
      </View>
      <View style={{ marginTop: 14 }}>
        <EchoField bpm={bpm} playing={host.transport?.playing ?? false} />
      </View>
      <ControlGroup
        gap={0}
        style={{ marginTop: theme.spacing.spaceLg, height: 132 }}
      >
        {knobs.map(({ parameter, hint, format }) => (
          <Knob
            key={parameter.info.label}
            parameter={parameter}
            size="lg"
            style={{ width: 113 }}
            format={format ?? formatters.percent}
            history={{ label: `Adjust ${parameter.info.label}` }}
            resetOnHome
            wheelStep={0.02}
            accessibilityHint={`${hint}. Drag vertically, scroll, or use arrow keys. Home resets.`}
          />
        ))}
        <Divider
          length={85}
          style={{
            marginLeft: theme.spacing.spaceMd,
            marginRight: 20,
            marginTop: 14,
          }}
        />
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
      </ControlGroup>
      <View
        style={{
          marginTop: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.spaceLg,
          borderTopWidth: theme.size.borderHairline,
          borderColor: c.divider,
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
            {bypass
              ? 'Bypassed · original audio'
              : selected
                ? description
                : 'Custom settings. Choose a preset to start again.'}
          </Text>
          <HelpGuide />
        </View>
      </View>
    </View>
  );
}
