import { textStyle, useTheme } from '@soundor/components/theme';
import { X } from '@soundor/icons/lucide';
import { Text, View, useViewSize } from '@soundor/react';

import { RoundIconButton } from '../ui/round-icon-button';

const sections = [
  ['Shape the echoes', 'Drag a dot sideways for timing, up or down for level.'],
  [
    'Adjust the knobs',
    'Drag up or down, or scroll. Hold Shift for fine adjustments.',
  ],
  [
    'Use the keyboard',
    'Tab to a control. Arrow keys move dots and turn knobs; Home resets a knob.',
  ],
  [
    'Hold and compare',
    'Use Hold to loop the echoes. Switch between Original and Orbit to compare.',
  ],
] as const;

const width = 280;

/**
 * The guide to Orbit's controls, above the button that opened it (`anchor`,
 * its top right corner in the safe area), kept inside the view.
 */
export function GuidePanel({
  anchor,
  onClose,
}: {
  anchor: { right: number; top: number };
  onClose: () => void;
}) {
  const theme = useTheme();
  const c = theme.color;
  const view = useViewSize();
  const { safeArea } = view;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: view.height - (safeArea.y + anchor.top) + theme.spacing.spaceSm,
        left: Math.max(
          8,
          Math.min(safeArea.x + anchor.right - width, view.width - width - 8),
        ),
        width,
        padding: theme.spacing.spaceXl,
        gap: theme.spacing.spaceLg,
        borderRadius: theme.radius.radiusXl,
        borderWidth: theme.size.borderHairline,
        borderColor: c.borderStrong,
        backgroundColor: c.surfaceElevated,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={textStyle(theme, 'title')}>How to use Orbit</Text>
        <RoundIconButton icon={X} label="Close guide" onPress={onClose} />
      </View>
      {sections.map(([title, detail]) => (
        <View key={title} style={{ gap: theme.spacing.spaceXxs }}>
          <Text style={textStyle(theme, 'title')}>{title}</Text>
          <Text style={textStyle(theme, 'body', c.textSecondary)}>
            {detail}
          </Text>
        </View>
      ))}
    </View>
  );
}
