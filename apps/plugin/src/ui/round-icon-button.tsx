import { ring, useTheme } from '@soundor/components/theme';
import type { IconComponent, StrokeIconProps } from '@soundor/icons/lucide';
import { Pressable } from '@soundor/react';
import type { Ref } from 'react';
import type { UiNode } from 'soundor:ui';

/** A small round button showing an icon alone; `label` names it. */
export function RoundIconButton({
  icon: Icon,
  label,
  onPress,
  ref,
}: {
  icon: IconComponent<StrokeIconProps>;
  label: string;
  onPress: () => void;
  ref?: Ref<UiNode>;
}) {
  const theme = useTheme();
  const c = theme.color;
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
