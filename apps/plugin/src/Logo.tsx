import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View } from '@soundor/react';
import { Circle, Rect, Svg } from '@soundor/react/svg';

/**
 * Orbit's icon, as the website's favicon (apps/website/public/favicon.svg):
 * the three echoes, each later, smaller and in its voice's color.
 */
function OrbitIcon({ size }: { readonly size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessible={false}
      style={{ pointerEvents: 'none' }}
    >
      <Rect width={32} height={32} rx={7} fill="#10121a" />
      <Circle cx={9} cy={13} r={4} fill="#b7a3ff" />
      <Circle cx={17} cy={17} r={3.2} fill="#c3e879" />
      <Circle cx={24} cy={20} r={2.4} fill="#f09f87" />
    </Svg>
  );
}

/** The header's wordmark: the icon, then Soundor Orbit. */
export function Logo() {
  const theme = useTheme();
  const display = textStyle(theme, 'display');
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel="Soundor Orbit"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.spaceMd,
      }}
    >
      <OrbitIcon size={30} />
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <Text style={[display, { color: theme.color.textMuted }]}>Soundor</Text>
        <Text style={display}>Orbit</Text>
      </View>
    </View>
  );
}
