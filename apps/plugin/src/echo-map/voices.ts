import { parameters } from 'soundor:parameters';

/**
 * The three voices' colors, the logo's (assets/brand): counting from its
 * center, orange on the inner orbit, then lime and purple on the outer one,
 * as the echoes go from the shortest to the longest.
 */
export const voices = [
  { color: '#ff8f4d', ink: '#10121a' },
  { color: '#c4ec6f', ink: '#10121a' },
  { color: '#b8a3ff', ink: '#10121a' },
] as const;

/** Each voice's time and level parameters, in the voices' order. */
export const times = [
  parameters.time1,
  parameters.time2,
  parameters.time3,
] as const;
export const levels = [
  parameters.level1,
  parameters.level2,
  parameters.level3,
] as const;
