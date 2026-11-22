import {
  Canvas,
  useAnimationFrame,
  useParameter,
  useViewSize,
} from '@soundor/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { parameters } from 'soundor:parameters';
import type { UiNode } from 'soundor:ui';

import {
  createFieldRenderer,
  type FieldRenderer,
  type FieldState,
} from './field-renderer';
import { bufferDensity, echoField } from './model';

/**
 * The echoes' curves, drawn by the field renderer (WebGL, or a 2D canvas
 * where WebGL fails) whenever what they show changes, and every frame
 * while Motion moves them.
 */
export function EchoCanvas({ playing }: { playing: boolean }) {
  const canvas = useRef<UiNode>(null);
  const renderer = useRef<FieldRenderer | null>(null);
  const [fallback, setFallback] = useState(false);
  const state = useFieldState(playing);
  const lastDraw = useRef<FieldState | null>(null);
  // Device pixels per logical pixel, the editor's zoom included: the
  // buffer follows it so the map stays sharp at any size.
  const density = bufferDensity(useViewSize().scale);
  const lastDensity = useRef(density);

  const draw = (seconds: number) => {
    renderer.current?.draw(state, seconds);
    lastDraw.current = state;
    lastDensity.current = density;
  };

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
    if (density !== lastDensity.current) draw(performance.now() / 1000);
  });

  useAnimationFrame((time) => {
    const previous = lastDraw.current;
    const changed =
      !previous ||
      !sameState(state, previous) ||
      density !== lastDensity.current;
    const moving = state.playing && state.motion > 0 && !state.bypass;
    if (changed || moving) draw(time / 1000);
  });

  return (
    <Canvas
      key={String(fallback)}
      ref={canvas}
      width={Math.round(echoField.width * density)}
      height={Math.round(echoField.height * density)}
      style={{ ...echoField, position: 'absolute', pointerEvents: 'none' }}
    />
  );
}

/** What the curves show: every parameter they draw, and the transport. */
function useFieldState(playing: boolean): FieldState {
  return {
    times: [
      useParameter(parameters.time1),
      useParameter(parameters.time2),
      useParameter(parameters.time3),
    ],
    levels: [
      useParameter(parameters.level1),
      useParameter(parameters.level2),
      useParameter(parameters.level3),
    ],
    feedback: useParameter(parameters.feedback),
    motion: useParameter(parameters.motion),
    hold: useParameter(parameters.hold),
    bypass: useParameter(parameters.bypass),
    playing,
  };
}

function sameState(a: FieldState, b: FieldState): boolean {
  return (
    a.times.every((value, i) => value === b.times[i]) &&
    a.levels.every((value, i) => value === b.levels[i]) &&
    a.feedback === b.feedback &&
    a.motion === b.motion &&
    a.hold === b.hold &&
    a.bypass === b.bypass &&
    a.playing === b.playing
  );
}
