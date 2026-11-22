import { SegmentedControl, type SegmentOption } from '@soundor/components';
import { useParameter } from '@soundor/react';
import { parameters } from 'soundor:parameters';

type Comparison = 'original' | 'processed';

const options: readonly SegmentOption<Comparison>[] = [
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

/** Original or Orbit: the bypass parameter, as a choice between two sounds. */
export function CompareControl() {
  const bypass = useParameter(parameters.bypass);
  return (
    <SegmentedControl
      options={options}
      value={bypass ? 'original' : 'processed'}
      label="Compare audio"
      onChange={(value) =>
        parameters.bypass.set(value === 'original', { history: true })
      }
    />
  );
}
