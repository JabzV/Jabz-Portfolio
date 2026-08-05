import Image from "next/image";

/**
 * One block of the hero's right rail (Figma `15:3059` / `15:3060`): a 100×100
 * QR code with its caption underneath. The only auto-layout-like structure in
 * the hero (`flex-col items-center gap-[7px]`); the 7px gap is rounded to the
 * 8px spacing step.
 *
 * Renders a real link when `href` is set and a plain `<figure>` when it is not.
 * Both paths are kept because `social[].href` starts as `null` (U6 — the Figma
 * defines no targets): an `<a>` without an href is unreachable by keyboard, so
 * the figure is the correct fallback rather than a dead anchor. Fill the URLs in
 * `src/data/site.ts` and these become links with no code change.
 *
 * Caption is SDDystopian, which appears to be an uppercase-only face: the data's
 * "Linkedin" / "instagram" render as LINKEDIN / INSTAGRAM, matching the
 * reference render.
 *
 * `data-cursor="scan"` is the one case element semantics cannot express when
 * there is no href: the figure genuinely is not interactive, yet the cursor
 * should acknowledge it, because the QR *is* the affordance. With an href the
 * anchor resolves on its own and the cursor expands normally.
 */

/** A scanline passing over the code — the hover echo of the boot sequence. */
function ScanSweep() {
  return (
    <span
      aria-hidden="true"
      // Reuses the loader's own `boot-sweep` keyframe rather than adding another:
      // same vocabulary, zero new tokens. `motion-safe:` so reduced motion gets
      // the brightness change without the sweep.
      className="via-fg/70 pointer-events-none absolute inset-x-0 top-0 h-1/3 -translate-y-full bg-gradient-to-b from-transparent to-transparent opacity-0 group-hover:opacity-100 motion-safe:group-hover:animate-[boot-sweep_0.9s_ease-in-out]"
    />
  );
}

type Props = { label: string; icon: string; href?: string | null };

export function SocialBlock({ label, icon, href }: Props) {
  const body = (
    <>
      {/* `overflow-hidden` clips the sweep to the code itself. */}
      <span className="relative block size-[100px] overflow-hidden">
        <Image
          src={icon}
          alt=""
          width={100}
          height={100}
          className="size-[100px] transition-[filter] duration-200 group-hover:brightness-125"
        />
        <ScanSweep />
      </span>
      <figcaption className="text-body text-fg font-display group-hover:text-shadow-glow-link text-center transition-[text-shadow] duration-(--duration-hover)">
        {label}
      </figcaption>
    </>
  );

  const shell = "group flex w-[100px] flex-col items-center gap-2";
  // Lift is `motion-safe:` only; the glow and brightness are not motion and stay.
  const lift = "motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1";

  if (!href) {
    return (
      <figure data-cursor="scan" className={shell}>
        {body}
      </figure>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      // `noreferrer` alongside `noopener`: these are outbound profile links, and
      // there is no reason to leak the referrer to a third party.
      rel="noopener noreferrer"
      // The caption already names the destination, so the accessible name is
      // "Linkedin"/"instagram"; adding "opens in a new tab" is the one thing a
      // screen-reader user cannot otherwise infer from `target`.
      aria-label={`${label} — opens in a new tab`}
      className={`${shell} ${lift} focus-ring`}
    >
      <figure className="contents">{body}</figure>
    </a>
  );
}
