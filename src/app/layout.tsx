import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Display face — every heading (116/112/92/72/48/38/28/22px).
 * Fallback is a condensed/heavy stack because the headings are very large and
 * a default sans fallback would reflow dramatically.
 */
const sdDystopian = localFont({
  src: "../fonts/SDDystopian-Regular.otf",
  variable: "--font-sd-dystopian",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: [
    "Impact",
    "Haettenschweiler",
    "Arial Narrow Bold",
    "Arial Black",
    "sans-serif",
  ],
});

/** Accent face — nav items, accent paragraphs, button labels. */
const glitchGoblin = localFont({
  src: "../fonts/GlitchGoblin-Regular.ttf",
  variable: "--font-glitch-goblin",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Impact", "Arial Black", "Arial Narrow Bold", "sans-serif"],
});

/** Body face — body copy, BIO card, quotes, katakana, footer. 400 + 600. */
const generalSans = localFont({
  src: [
    {
      path: "../fonts/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Jabez Vestidas — Portfolio",
  description:
    "Full-stack developer, designer, and engineer. Selected work, services, and experience.",
  /**
   * Icons live in `public/assets/` as top-level images rather than using the
   * App Router's `src/app/icon.*` convention, so every image on the site is
   * reachable under one predictable root.
   */
  icons: {
    icon: [
      { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/assets/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Jabez Vestidas — Portfolio",
    description:
      "Full-stack developer, designer, and engineer. Selected work, services, and experience.",
    type: "website",
  },
};

/**
 * Sets `--app-scale` to viewport / 1600 so the page scales proportionally above
 * the design width instead of reflowing (see `.app-scale` in globals.css).
 *
 * The width divisor is 1600, not the 1440 design width: 1440 / 0.9 = 1600, which
 * renders everything ~10% smaller. It MUST match `width` on `.app-scale`.
 *
 * The scale is then capped by HEIGHT as well, so the hero band — whose bottom
 * edge is the BIO card's bottom edge — always fits the viewport without
 * scrolling, on any screen. 800 is the 793px band plus a few px of headroom.
 * Width alone was not enough: hero height scales with width, so a wide-but-short
 * window still clipped the BIO card.
 *
 * When the height cap wins, the canvas is narrower than the viewport and leaves
 * gutters. They are invisible in practice because <body> is already
 * --color-bg, the same colour the design's own page background uses.
 *
 * Inline and in <head> so it runs before first paint — a client component would
 * render the unscaled 1440 canvas for a frame first. CSS cannot compute this:
 * `zoom` needs a unitless ratio and calc() cannot divide a length by a length.
 *
 * `clientWidth`, not `innerWidth`, so the scrollbar is excluded — otherwise the
 * canvas is scaled slightly too wide and induces a horizontal scrollbar.
 *
 * It re-measures after layout as well as before paint. In <head> there is no
 * body and no layout yet, so clientWidth reports the full viewport regardless of
 * `scrollbar-gutter`, which yields a canvas ~15px too wide and a horizontal
 * scrollbar. The first-paint value is therefore treated as an estimate and
 * corrected on DOMContentLoaded/load and by a ResizeObserver; the delta is under
 * 1%, so the correction is imperceptible while removing the overflow.
 */
const APP_SCALE_SCRIPT = `(function(){
var d=document.documentElement;
d.style.scrollbarGutter='stable';
function s(){var w=d.clientWidth,h=d.clientHeight;
d.style.setProperty('--app-scale',w>=1440?String(Math.min(w/1600,h/800)):'1');}
s();
addEventListener('resize',s,{passive:true});
addEventListener('DOMContentLoaded',s);
addEventListener('load',s);
if(window.ResizeObserver)new ResizeObserver(s).observe(d);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* The inline script below writes `--app-scale` to this element's style
         attribute before React hydrates, which React would otherwise report as
         a server/client attribute mismatch. Scoped to <html> only. */
      suppressHydrationWarning
      className={`${sdDystopian.variable} ${glitchGoblin.variable} ${generalSans.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: APP_SCALE_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
