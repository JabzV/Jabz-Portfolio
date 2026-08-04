---
description: Phase 4 — add GSAP animation over finished components
argument-hint: [section ...]
---

Phase 4. Scope: $ARGUMENTS (default: all built sections)

**Refuse to run on sections whose static layout hasn't passed `/verify`.** Animating unstable markup means redoing the work every time layout shifts — this ordering is the whole reason motion is its own phase.

Dispatch `motion-engineer`. Its prompt must state:
- which sections are in scope, and that their markup and token classes must not be restructured
- to install `gsap` and `@gsap/react` if missing
- to load the `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, and `gsap-performance` skills before writing animation code
- to check the spec for `get_motion_context` timing rather than inventing easing the design already specifies

Non-negotiables to restate: `useGSAP` from `@gsap/react` (never bare `useEffect`), `gsap.matchMedia()` for `prefers-reduced-motion`, `transform`/`opacity` only, and nothing animating first-paint content.

When it returns, relay each animation with its trigger and duration, the reduced-motion strategy, and anything it declined to animate. Then verify in the browser **with CPU throttled** — animation that's smooth on this machine can be unusable on a mid-range phone.
