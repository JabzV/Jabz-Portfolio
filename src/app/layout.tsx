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
  description: "Portfolio of Jabez Joshua Vestidas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sdDystopian.variable} ${glitchGoblin.variable} ${generalSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
