import * as React from "react";

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Implemented via `useSyncExternalStore` to avoid the `setState`-in-effect
 * anti-pattern flagged by `react-hooks/set-state-in-effect`. This is the
 * recommended pattern for one-time client-only checks (e.g. reading
 * `localStorage`, computing "now", or showing client-only UI).
 *
 * During SSR and the first client render, returns `false`. After hydration,
 * returns `true`.
 */
export function useIsClient(): boolean {
  return React.useSyncExternalStore(
    // No real subscription needed — we just want a different value on client.
    () => () => {},
    () => true, // client snapshot
    () => false, // server snapshot
  );
}
