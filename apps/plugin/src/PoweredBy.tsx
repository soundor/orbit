import { textStyle, useTheme } from '@soundor/components/theme';
import { Text, View } from '@soundor/react';
import { G, Line, Polyline, Rect, Svg } from '@soundor/react/svg';

/** Soundor's icon (assets/brand/soundor-icon.svg in soundor/soundor). */
function SoundorIcon({ size }: { readonly size: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="6 6 108 108"
      accessible={false}
      style={{ pointerEvents: 'none' }}
    >
      <Rect x={6} y={6} width={108} height={108} rx={30} fill="#0E0F12" />
      <G fill="none" strokeLinecap="round" strokeLinejoin="round">
        <Polyline points="38,42 24,60 38,78" stroke="#F2F4F7" strokeWidth={7} />
        <Polyline points="82,42 96,60 82,78" stroke="#F2F4F7" strokeWidth={7} />
        <G stroke="#FF5A1F" strokeWidth={4.5}>
          <Line x1={48} y1={64} x2={48} y2={56} />
          <Line x1={54} y1={69} x2={54} y2={51} />
          <Line x1={60} y1={74} x2={60} y2={46} />
          <Line x1={66} y1={68} x2={66} y2={52} />
          <Line x1={72} y1={63} x2={72} y2={57} />
        </G>
      </G>
    </Svg>
  );
}

/** Beside the wordmark: what Orbit is built with. */
export function PoweredBy() {
  const theme = useTheme();
  const c = theme.color;
  return (
    <View
      accessible
      accessibilityLabel="Powered by Soundor"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.spaceSm,
        paddingLeft: theme.spacing.spaceMd,
        borderLeftWidth: theme.size.borderHairline,
        borderColor: c.divider,
      }}
    >
      <SoundorIcon size={20} />
      <View style={{ gap: 1 }}>
        <Text style={textStyle(theme, 'technical')}>POWERED BY</Text>
        <Text style={textStyle(theme, 'technical', c.text)}>SOUNDOR</Text>
      </View>
    </View>
  );
}
