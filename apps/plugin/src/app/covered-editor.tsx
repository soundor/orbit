import { ResizeGrip } from '@soundor/components';
import { useTheme } from '@soundor/components/theme';
import { useViewSize, View } from '@soundor/react';

import { App } from './app';

/**
 * Orbit's editor covers windows of another shape (`fit: 'cover'`): the view
 * spans the whole window, and the 800×600 Orbit is designed at, its safe
 * area, sits in the middle. Its background carries on around it, so a host
 * that ignores the aspect ratio shows a wider (or taller) Orbit, not bands.
 * Its resize grip is in the view's corner, outside the safe area: covering
 * the window, that is the window's corner, whatever its shape.
 */
export function CoveredEditor() {
  const { safeArea } = useViewSize();
  const { color } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <View
        style={{
          position: 'absolute',
          left: safeArea.x,
          top: safeArea.y,
          width: safeArea.width,
          height: safeArea.height,
        }}
      >
        <App />
      </View>
      <ResizeGrip />
    </View>
  );
}
