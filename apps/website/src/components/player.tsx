/**
 * Orbit, live: its web build at /embed/ (scripts/sync-embed.ts), whose demo
 * presentation fills the frame with the plugin and the host's Play bar.
 */
export function Player({ className }: { readonly className?: string }) {
  return (
    <iframe
      // index.html by name: Vite's dev server does not serve a folder's
      // index; every server serves this.
      src="/embed/index.html"
      title="Orbit, playable in the browser"
      allow="autoplay; microphone"
      className={`block aspect-[8/7] max-h-[80vh] w-full rounded-xl border bg-black ${className ?? ''}`}
    />
  );
}
