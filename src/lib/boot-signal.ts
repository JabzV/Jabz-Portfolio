/**
 * The handoff between the boot overlay and anything that wants to animate once
 * the page becomes visible.
 *
 * Deliberately a plain module, not a React context: a provider would force
 * `page.tsx` into a client boundary and break the invariant that every section
 * is a Server Component — which is the whole reason the motion layer is built
 * from null-rendering client leaves driven by data attributes.
 *
 * There are TWO mechanisms because they solve different problems and neither is
 * sufficient alone:
 *
 *  - The `data-boot` attribute on <html> solves the RACE. A client leaf that
 *    hydrates after the reveal already happened can read the current state and
 *    correctly decide to skip its entrance. An event alone cannot do this — a
 *    listener attached late hears nothing and would hide already-visible content.
 *  - The event solves the TIMING. No polling, no rAF loop watching an attribute.
 */

export const BOOT_ATTR = "boot";
export const BOOT_REVEAL_EVENT = "boot:reveal";

/** `loading` → overlay covering; `revealing` → signal-lock running; `done` → gone. */
export type BootPhase = "loading" | "revealing" | "done";

/** SSR-safe. Returns undefined on the server and before the script runs. */
export function bootPhase(): BootPhase | undefined {
  if (typeof document === "undefined") return undefined;
  return document.documentElement.dataset[BOOT_ATTR] as BootPhase | undefined;
}

export function setBootPhase(phase: BootPhase): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset[BOOT_ATTR] = phase;
}

/**
 * True once the reveal has started. Consumers use this to skip an entrance
 * rather than hide content the reader can already see.
 *
 * Note the `undefined` case reads as NOT revealed, which is correct: the
 * attribute is absent only before BootSequence's effect runs, i.e. the overlay
 * is still up.
 */
export function bootRevealed(): boolean {
  const p = bootPhase();
  return p === "revealing" || p === "done";
}

/**
 * Calls `cb` when the reveal starts — SYNCHRONOUSLY and immediately if it has
 * already happened, so a late subscriber is never stranded waiting for an event
 * that has been and gone. Returns a disposer.
 */
export function onBootReveal(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (bootRevealed()) {
    cb();
    return () => {};
  }

  const handler = () => cb();
  window.addEventListener(BOOT_REVEAL_EVENT, handler, { once: true });
  return () => window.removeEventListener(BOOT_REVEAL_EVENT, handler);
}

export function dispatchBootReveal(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOT_REVEAL_EVENT));
}
