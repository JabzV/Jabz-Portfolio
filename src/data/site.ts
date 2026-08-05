/**
 * Site-wide content: identity, navigation, contact, and the hero's fixed copy.
 * Kept out of components so every string has one home.
 *
 * `href: null` anywhere means the design defines no target (docs/design/00-overview.md U6).
 */

export const site = {
  name: "Jabez Vestidas",
  fullName: "Jabez Joshua Vestidas",
  /** Vertical layered wordmark in the hero. */
  wordmark: "JABZ VESTIDAS",
  headline: ["FULL-STACK", "DEVELOPER", "/DESIGNER", "/ENGINEER"],
  role: "Computer Engineer",
  location: "Philippines",
  copyright: "© Jabez Joshua Vestidas",
  /** Katakana columns in the hero: "jabesu" and "supiido". */
  katakana: { name: "ジャベス", speed: "スピード" },
} as const;

export const nav: { label: string; href: string }[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const bio = {
  heading: "BIO",
  name: "Jabez Vestidas",
  degree: "BS in Computer Engineering",
  honors: "Graduated Cum Laude",
  year: "2025",
  yearLabel: "Graduated",
  email: "vestidas.jabezjoshua@gmail.com",
  locationLabel: "LOCATION",
  location: "Philippines",
  // No destination exists yet (U6). The intro section is itself the "about"
  // anchor, so pointing here would link to the thing the reader is already on.
  cta: { label: "About Me", href: null as string | null },
} as const;

export const heroCopy = {
  warningLabel: "WARNING",
  warning:
    "Hiring this person might improve your company's productivity. Side effects may include cleaner code, sleeker design, faster releases, and fewer production issues. Proceed only if you're ready to raise the bar.",
  resume: { label: ">  DOWNLOAD MY RESUME", href: null as string | null },
  // Points at the /light route, which currently holds a work-in-progress
  // placeholder. Light mode is a separate design, not a recolour.
  lightModeLink: {
    label: "View it in light mode\n(Professional Mode)",
    href: "/light",
  },
  quotes: [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Quality means doing it right when no one is looking.",
      author: "Henry Ford",
    },
  ],
} as const;

export const marqueeItems = [
  "I AM A FUTURE DEVELOPER.",
  "I AM A FUTURE DESIGNER.",
  "I AM A FUTURE ENGINEER.",
] as const;

export const intro = {
  statement:
    "I help brands rise above the noise in the digital age. Together, we'll push creative boundaries and build experiences that leave a lasting impression.",
  // Was "#about", which is this section's own id — the CTA linked to itself.
  // No further "about" destination exists (U6), so it renders as a button.
  cta: { label: "More About me", href: null as string | null },
} as const;

export const featuredWork = {
  title: "Featured Work",
  subtitle:
    "View some of my projects. Combining elegant design with structured architecture",
  cta: { label: "View Portfolio", href: null as string | null },
} as const;

export const experiencesCopy = {
  title: "Experiences",
  subtitle:
    "Here are some of my experiences and qualifications. See if I am fit to be a part of your team.",
} as const;

export const servicesCopy = { title: "Services" } as const;

export const social: { label: string; href: string | null; icon: string }[] = [
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/vestidas-jabez-953a572bb/",
    icon: "/assets/hero/social-linkedin.svg",
  },
  {
    label: "instagram",
    href: "https://www.instagram.com/jabz.vest/",
    icon: "/assets/hero/social-instagram.svg",
  },
];

export const contact = {
  title: ["Let's work", "Together"],
  tagline: "Let's create a unique experience together!",
  cta: {
    label: "Contact me directly",
    href: "mailto:vestidas.jabezjoshua@gmail.com",
  },
  rows: [
    {
      label: "Email",
      value: "vestidas.jabezjoshua@gmail.com",
      href: "mailto:vestidas.jabezjoshua@gmail.com",
    },
    { label: "Contact", value: "+639552591223", href: "tel:+639552591223" },
    { label: "Alt Contact", value: "+639917123144", href: "tel:+639917123144" },
  ],
} as const;
