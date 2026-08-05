import { site } from "@/data/site";

/**
 * The three layered vertical "JABZ VESTIDAS" (Figma `11:8`, `15:3313`, `15:3315`).
 *
 * Each layer is an 85×777 box containing a −90°-rotated 116px line, so the
 * rotated text overflows its own box on both sides — that is the design. The
 * design's 482 / 567 / 652 left values are a clean 85px pitch, so this is one
 * flex row of three 85px items rather than three magic offsets.
 *
 * The stack is decorative (it repeats the accessible name already in the page):
 * `aria-hidden`, and hidden below `md` because overlapping 116px rotated type is
 * illegible in a narrow viewport. RESPONSIVE.md: layer 3 (6% opacity) appears at
 * `xl` only; layer 2 from `lg`.
 *
 * `inset-y-3` reproduces the design's `top: 12px` and, inside the 801px cover
 * layer, makes each `h-full` item exactly 777px.
 */
const layers = [
  { color: "text-display", visibility: "flex" },
  { color: "text-wordmark-layer-2", visibility: "hidden lg:flex" },
  { color: "text-wordmark-layer-3", visibility: "hidden xl:flex" },
] as const;

export function LayeredWordmark() {
  return (
    <div
      aria-hidden="true"
      // HeroMotion measures this box to work out where the pointer sits relative
      // to the wordmark itself, rather than to the whole hero band.
      data-hero-wordmark
      className="absolute inset-y-3 left-[35%] hidden md:flex lg:left-[482px]"
    >
      {layers.map((layer) => (
        <div
          key={layer.color}
          // The entrance staggers these on x. It is the one moment the 1.0 /
          // 0.49 / 0.06 depth relationship becomes legible — arriving together,
          // as they do now, it reads as a single blurred mark.
          data-hero-wordmark-layer
          className={`h-full w-[85px] items-center justify-center ${layer.visibility}`}
        >
          <span
            className={`text-wordmark text-shadow-display font-display block -rotate-90 whitespace-nowrap ${layer.color}`}
          >
            {site.wordmark}
          </span>
        </div>
      ))}
    </div>
  );
}
