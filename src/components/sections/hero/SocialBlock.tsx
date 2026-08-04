import Image from "next/image";

/**
 * One block of the hero's right rail (Figma `15:3059` / `15:3060`): a 100×100
 * QR code with its caption underneath. The only auto-layout-like structure in
 * the hero (`flex-col items-center gap-[7px]`); the 7px gap is rounded to the
 * 8px spacing step.
 *
 * `social[].href` is `null` (U6 — no targets in the file) and the artwork is a QR
 * code, i.e. the scan *is* the affordance, so this is a `<figure>` rather than a
 * dead link. The caption is the accessible name, so the image is `alt=""`.
 *
 * Caption is SDDystopian, which appears to be an uppercase-only face: the data's
 * "Linkedin" / "instagram" render as LINKEDIN / INSTAGRAM, matching the
 * reference render.
 */
export function SocialBlock({ label, icon }: { label: string; icon: string }) {
  return (
    <figure className="flex w-[100px] flex-col items-center gap-2">
      <Image src={icon} alt="" width={100} height={100} className="size-[100px]" />
      <figcaption className="text-body text-fg font-display text-center">{label}</figcaption>
    </figure>
  );
}
