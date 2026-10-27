import { useState, useSyncExternalStore } from "react";

function createClock(intervalMs: number) {
  let now = Date.now();
  return {
    subscribe(onChange: () => void) {
      now = Date.now();
      const id = setInterval(() => {
        now = Date.now();
        onChange();
      }, intervalMs);
      return () => clearInterval(id);
    },
    getSnapshot: () => now,
  };
}

/**
 * The current time in milliseconds, refreshed every `intervalMs`, or null while
 * the page is still being rendered on the server. Anything drawn from it (which
 * sessions are still open today) therefore changes as time passes, and the
 * server's HTML never disagrees with the browser's.
 */
export function useNow(intervalMs = 15_000): number | null {
  const [clock] = useState(() => createClock(intervalMs));
  return useSyncExternalStore(clock.subscribe, clock.getSnapshot, () => null);
}
