import {
  ControlGroup,
  Divider,
  Knob,
  formatters,
  type RangeParameter,
} from '@soundor/components';
import { useTheme } from '@soundor/components/theme';
import { parameters } from 'soundor:parameters';

import { HoldControl } from './hold-control';

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

/** The five knobs that shape every echo, and Hold. */
export function KnobRow() {
  const { spacing } = useTheme();
  return (
    <ControlGroup gap={0} style={{ marginTop: spacing.spaceLg, height: 132 }}>
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
        style={{ marginLeft: spacing.spaceMd, marginRight: 20, marginTop: 14 }}
      />
      <HoldControl />
    </ControlGroup>
  );
}
