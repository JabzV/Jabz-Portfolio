---
description: Phase 3 — build sections as static React, in parallel
argument-hint: <section> [section ...]
---

Phase 3. Sections to build: $ARGUMENTS

**Refuse to run if the token gate hasn't passed.** Check that `src/app/globals.css` contains a real `@theme` block from `token-architect`. Building against a scaffold theme means rebuilding everything later.

For each section, dispatch one `component-builder` — **all in a single message so they run concurrently**. Each one's prompt must state:
- its spec path in `docs/design/` and reference screenshot
- **exactly which files it owns** (its own component files only)
- the **complete approved token list** from Phase 2 — it may use nothing outside this
- that `globals.css`, `layout.tsx`, and `package.json` are off-limits
- that a missing token means stopping and reporting, not adding one
- no animation — `motion-engineer` handles that in Phase 4

Assign non-overlapping file ownership. If two sections genuinely need the same shared component, build it in a separate serial step first rather than letting two builders race on it.

When they return, collect and relay: every missing token, every deviation or guess, and each `"use client"` with its justification. Confirm `npm run build` passes before reporting done.
