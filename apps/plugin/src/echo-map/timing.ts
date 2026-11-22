const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// Times are quarter-note beats in sync mode, or multiples of 500 ms in free mode.
export function milliseconds(
  beats: number,
  sync: boolean,
  bpm: number,
): number {
  return beats * (sync ? 60000 / clamp(bpm, 20, 400) : 500);
}

/** A time in beats as a note value where it is one (`1/8 D`), else beats. */
export function beatLabel(beats: number): string {
  const names: Record<number, string> = {
    0.125: '1/32',
    0.25: '1/16',
    0.5: '1/8',
    0.75: '1/8 D',
    1: '1/4',
    1.5: '1/4 D',
    2: '1/2',
    3: '1/2 D',
  };
  return names[beats] ?? `${beats.toFixed(2)} beats`;
}
