import { useSyncExternalStore } from 'react';

/**
 * The visitor's system, as far as a release is concerned: one Orbit is built
 * for, macOS (not yet), or anything else (phones, tablets, ChromeOS).
 */
export type VisitorPlatform = 'linux' | 'windows' | 'macos' | 'other';

export function detectPlatform(
  userAgent: string,
  maxTouchPoints: number,
): VisitorPlatform {
  if (/Android|CrOS|iPhone|iPad|iPod/.test(userAgent)) return 'other';
  if (/Windows/.test(userAgent)) return 'windows';
  // iPadOS reports a Mac; only a tablet has more than one touch point.
  if (/Macintosh|Mac OS X/.test(userAgent)) {
    return maxTouchPoints > 1 ? 'other' : 'macos';
  }
  if (/Linux|X11/.test(userAgent)) return 'linux';
  return 'other';
}

/** Nothing to subscribe to: a visitor's system doesn't change. */
const subscribe = () => () => {};

/**
 * The visitor's platform in the browser; null when prerendered and while
 * hydrating, so the static page names no platform.
 */
export function useVisitorPlatform(): VisitorPlatform | null {
  return useSyncExternalStore(
    subscribe,
    () => detectPlatform(navigator.userAgent, navigator.maxTouchPoints),
    () => null,
  );
}
