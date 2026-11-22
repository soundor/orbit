import { Button } from '@soundor/components';
import { useTheme } from '@soundor/components/theme';
import { ChevronLeft, ChevronRight } from '@soundor/icons/lucide';

/** A small ghost button that steps to the previous or the next preset. */
export function PresetArrow({
  direction,
  onPress,
}: {
  direction: 'previous' | 'next';
  onPress: () => void;
}) {
  const { color } = useTheme();
  const previous = direction === 'previous';
  const Icon = previous ? ChevronLeft : ChevronRight;
  return (
    <Button
      variant="ghost"
      size="sm"
      accessibilityLabel={previous ? 'Previous preset' : 'Next preset'}
      style={{ width: 28, height: 28, paddingHorizontal: 0 }}
      onPress={onPress}
    >
      {/* Decorative: the button's label names it. */}
      <Icon size={14} strokeWidth={2} color={color.textSecondary} />
    </Button>
  );
}
