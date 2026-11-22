import { createCoordinates, viewport } from '@soundor/components/chart';

/** The echo map's size, in the 800×600 Orbit is laid out at. */
export const mapSize = { width: 752, height: 332 };

// The renderer and the interactive handles share this vertical scale.
export const curveScale = { height: 244, baseline: 202, levelTravel: 133 };

/**
 * The echo map's axes: time in beats across (0 to 3), level up (0 to 1),
 * where the handles sit and the beat labels are.
 */
export const mapCoordinates = createCoordinates(
  viewport(mapSize.width, mapSize.height, {
    left: 46,
    right: 46,
    top:
      ((curveScale.baseline - curveScale.levelTravel) * mapSize.height) /
      curveScale.height,
    bottom:
      ((curveScale.height - curveScale.baseline) * mapSize.height) /
      curveScale.height,
  }),
  { domain: [0, 3] },
  { domain: [0, 1] },
);

/**
 * Device pixels per logical pixel for a canvas buffer at the view's `scale`
 * (the editor's zoom included), at most 4. Exactly that, so each pixel of the
 * buffer is one of the display's: anything else is resampled, and soft. A resized
 * buffer is cleared and drawn again, as often as an editor being dragged changes
 * the scale.
 */
export const bufferDensity = (scale: number) => Math.min(4, scale);
