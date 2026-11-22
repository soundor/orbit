import { formatters } from '@soundor/components';
import { createCoordinates, viewport } from '@soundor/components/chart';
import { useXYPad } from '@soundor/components/headless';
import { textStyle, useTheme } from '@soundor/components/theme';
import {
  Canvas,
  Text,
  View,
  useAnimationFrame,
  useParameter,
  useViewSize,
} from '@soundor/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { parameters } from 'soundor:parameters';
import type { UiNode } from 'soundor:ui';

import { createFieldRenderer, type FieldRenderer } from './field-renderer';
import {
  beatLabel,
  bufferDensity,
  echoFieldY,
  voices,
  levels,
  milliseconds,
  times,
} from './model';

const coordinates = createCoordinates(
  viewport(752, 332, {
    left: 46,
    right: 46,
    top:
      ((echoFieldY.baseline - echoFieldY.levelTravel) * 332) /
      echoFieldY.height,
    bottom:
      ((echoFieldY.height - echoFieldY.baseline) * 332) / echoFieldY.height,
  }),
  { domain: [0, 3] },
  { domain: [0, 1] },
);

function Echo({
  index,
  bpm,
  sync,
  bypass,
}: {
  index: number;
  bpm: number;
  sync: boolean;
  bypass: boolean;
}) {
  const theme = useTheme();
  const voice = voices[index]!;
  const c = theme.color;
  const color = bypass ? c.displayMuted : c[voice];
  const timeParameter = times[index]!;
  const name = timeParameter.info.label;
  const format = (value: number) =>
    sync ? beatLabel(value) : formatters.time(milliseconds(value, false, bpm));
  const handle = useXYPad(
    {
      parameter: timeParameter,
      format,
      snap: sync ? (value) => Math.round(value * 8) / 8 : undefined,
      history: false,
    },
    { parameter: levels[index]!, history: false },
    {
      label: name,
      hint: 'Drag horizontally for time and vertically for level. Left and right change time; up and down change level.',
      keyStep: [0.125, 0.05],
      dragMode: 'relative',
      travel: [
        coordinates.x.map(3) - coordinates.x.map(0.125),
        coordinates.rect.height,
      ],
      describeValue: (time, level) =>
        `${format(time)}, ${Math.round(level * 100)} percent level`,
    },
  );
  return (
    <View
      {...handle.handlers}
      style={{
        position: 'absolute',
        left: coordinates.x.map(handle.x.value) - 21,
        top: coordinates.y.map(handle.y.value) - 21,
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 21,
        borderWidth: theme.size.borderHairline,
        borderColor: bypass ? c.displayAxis : color,
        outlineWidth: handle.focusVisible ? theme.size.focusRing : 0,
        outlineOffset: 2,
        outlineColor: theme.color.focus,
        backgroundColor: bypass ? c.display : `${color}15`,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: bypass ? c.displayGrid : color,
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          accessible={false}
          style={[
            textStyle(
              theme,
              'value',
              bypass ? c.displayText : c[`${voice}Foreground`],
            ),
            { fontWeight: 'bold' },
          ]}
        >
          {index + 1}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 44,
          width: 100,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          accessible={false}
          style={[textStyle(theme, 'value', color), { fontSize: 10 }]}
        >
          {format(handle.x.value)}
        </Text>
      </View>
    </View>
  );
}

export function EchoField({ bpm, playing }: { bpm: number; playing: boolean }) {
  const theme = useTheme();
  const c = theme.color;
  const canvas = useRef<UiNode>(null);
  const renderer = useRef<FieldRenderer | null>(null);
  const [fallback, setFallback] = useState(false);
  const time1 = useParameter(parameters.time1),
    time2 = useParameter(parameters.time2),
    time3 = useParameter(parameters.time3);
  const level1 = useParameter(parameters.level1),
    level2 = useParameter(parameters.level2),
    level3 = useParameter(parameters.level3);
  const feedback = useParameter(parameters.feedback),
    motion = useParameter(parameters.motion);
  const hold = useParameter(parameters.hold),
    bypass = useParameter(parameters.bypass),
    sync = useParameter(parameters.sync);
  const state = {
    times: [time1, time2, time3],
    levels: [level1, level2, level3],
    feedback,
    motion,
    hold,
    bypass,
    playing,
  };
  const lastDraw = useRef<typeof state | null>(null);
  // Device pixels per logical pixel, the editor's zoom included: the
  // buffer follows it so the map stays sharp at any size.
  const density = bufferDensity(useViewSize().scale);
  const lastDensity = useRef(density);
  useEffect(() => {
    lastDraw.current = null;
    if (!canvas.current) return;
    try {
      renderer.current = createFieldRenderer(canvas.current, fallback);
    } catch {
      // The renderer is an external resource; failure needs a fresh 2D canvas.
      // oxlint-disable-next-line react/set-state-in-effect
      setFallback(true);
    }
    return () => {
      renderer.current?.dispose();
      renderer.current = null;
    };
  }, [fallback]);
  // A resized buffer is cleared: drawn again before the frame is shown, not
  // at the next animation frame, so it never shows blank.
  useLayoutEffect(() => {
    if (density === lastDensity.current) return;
    renderer.current?.draw(state, performance.now() / 1000);
    lastDraw.current = state;
    lastDensity.current = density;
  });
  useAnimationFrame((time) => {
    const previous = lastDraw.current;
    const changed =
      !previous ||
      state.times.some((v, i) => v !== previous.times[i]) ||
      state.levels.some((v, i) => v !== previous.levels[i]) ||
      state.feedback !== previous.feedback ||
      state.motion !== previous.motion ||
      state.hold !== previous.hold ||
      state.bypass !== previous.bypass ||
      state.playing !== previous.playing ||
      // A resized buffer is cleared: draw it again.
      density !== lastDensity.current;
    if (changed || (state.playing && state.motion > 0 && !state.bypass)) {
      renderer.current?.draw(state, time / 1000);
      lastDraw.current = state;
      lastDensity.current = density;
    }
  });
  return (
    <View
      style={{
        width: 752,
        height: 332,
        borderRadius: theme.radius.radiusXl,
        overflow: 'hidden',
        backgroundColor: c.display,
      }}
    >
      <Canvas
        key={String(fallback)}
        ref={canvas}
        width={Math.round(752 * density)}
        height={Math.round(332 * density)}
        style={{
          width: 752,
          height: 332,
          position: 'absolute',
          pointerEvents: 'none',
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 22,
          top: 17,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: bypass
              ? c.displayMuted
              : hold
                ? c.lime
                : c.lavender,
          }}
        />
        <Text style={textStyle(theme, 'section', c.displayText)}>
          {bypass ? 'ECHO MAP · BYPASSED' : hold ? 'LOOP HELD' : 'ECHO MAP'}
        </Text>
      </View>
      {[0, 1, 2].map((index) => (
        <Echo key={index} index={index} bpm={bpm} sync={sync} bypass={bypass} />
      ))}
      <Text
        style={[
          textStyle(theme, 'section', c.displayMuted),
          {
            position: 'absolute',
            top: 17,
            right: 22,
            letterSpacing: 0.8,
            pointerEvents: 'none',
          },
        ]}
      >
        {bypass ? 'DRY INPUT · ECHO SETTINGS' : 'DRAG TO SHAPE THE REPEATS'}
      </Text>
      {[0, 1, 2, 3].map((beat) => (
        <Text
          key={beat}
          style={[
            textStyle(theme, 'value', c.displayMuted),
            {
              position: 'absolute',
              left: coordinates.x.map(beat) - 7,
              bottom: 14,
              fontSize: 9,
            },
          ]}
        >
          {sync
            ? `${beat} beat${beat === 1 ? '' : 's'}`
            : formatters.time(beat * 500)}
        </Text>
      ))}
    </View>
  );
}
