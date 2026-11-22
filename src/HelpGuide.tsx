import { ring, textStyle, useTheme } from '@soundor/components/theme';
import { QuestionMark, X } from '@soundor/icons/lucide';
import { Modal, Pressable, Text, View, useViewSize } from '@soundor/react';
import { useRef, useState, type Ref } from 'react';
import type { UiNode } from 'soundor:ui';

const guide = [
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

function GuideIconButton({
  icon,
  label,
  onPress,
  ref,
}: {
  icon: 'help' | 'close';
  label: string;
  onPress: () => void;
  ref?: Ref<UiNode>;
}) {
  const theme = useTheme();
  const c = theme.color;
  const Icon = icon === 'help' ? QuestionMark : X;
  return (
    <Pressable
      ref={ref}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ hovered, pressed, focusVisible }) => ({
        width: theme.size.controlHeightSm,
        height: theme.size.controlHeightSm,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.radiusFull,
        borderWidth: theme.size.borderHairline,
        borderColor: hovered ? c.borderStrong : c.border,
        backgroundColor: hovered ? c.surface : c.surfaceElevated,
        opacity: pressed ? theme.opacity.opacityPressed : 1,
        cursor: 'pointer',
        ...ring(theme, focusVisible),
      })}
    >
      {/* Decorative: the button's label names it. */}
      <Icon size={14} strokeWidth={2.2} color={c.textSecondary} />
    </Pressable>
  );
}

export function HelpGuide() {
  const theme = useTheme();
  const c = theme.color;
  const trigger = useRef<UiNode>(null);
  const [anchor, setAnchor] = useState<{ right: number; top: number } | null>(
    null,
  );
  const { safeArea, width, height } = useViewSize();
  const close = () => setAnchor(null);
  const panelWidth = 280;

  return (
    <>
      <GuideIconButton
        icon="help"
        ref={trigger}
        label="How to use Orbit"
        onPress={() => {
          const box = trigger.current?.getBoundingClientRect();
          if (box) {
            // Keep the anchor relative to the safe area so it follows the footer.
            setAnchor({
              right: box.x + box.width - safeArea.x,
              top: box.y - safeArea.y,
            });
          }
        }}
      />
      <Modal
        visible={anchor !== null}
        accessibilityLabel="Orbit controls guide"
        dismissOnBackdropPress
        onRequestClose={close}
      >
        {anchor && (
          <View
            style={{
              position: 'absolute',
              bottom:
                height - (safeArea.y + anchor.top) + theme.spacing.spaceSm,
              left: Math.max(
                8,
                Math.min(
                  safeArea.x + anchor.right - panelWidth,
                  width - panelWidth - 8,
                ),
              ),
              width: panelWidth,
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
              <GuideIconButton
                icon="close"
                label="Close guide"
                onPress={close}
              />
            </View>
            {guide.map(([title, detail]) => (
              <View key={title} style={{ gap: theme.spacing.spaceXxs }}>
                <Text style={textStyle(theme, 'title')}>{title}</Text>
                <Text style={textStyle(theme, 'body', c.textSecondary)}>
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Modal>
    </>
  );
}
