---
description: Phase 5 — visual fidelity + a11y/perf audit in parallel
argument-hint: [section ...]
---

Phase 5. Scope: $ARGUMENTS (default: everything built so far)

**Capture app screenshots first** — `visual-qa` cannot screenshot anything itself. Start the dev server, capture each section in the browser, and save the images to disk. Without them, the review silently degrades to code-only.

Then dispatch **both** agents in a single message so they run concurrently:
- `visual-qa` — pass the app screenshot path, the Figma reference at `docs/design/screens/`, the spec, and **the builders' reported deviations** so it doesn't re-file intentional choices as bugs
- `perf-a11y-auditor` — scope only

Neither can edit files. When they return:
1. Merge findings, drop duplicates, sort by severity. Keyboard and screen-reader blockers outrank every performance number.
2. Present the triaged list to me. Do not auto-fix.
3. Approved fixes go back through `/build` to the owning `component-builder`.

Once no BLOCKER or MAJOR findings remain, this is the **parity baseline** — commit and tag it. That tag is what makes Phase 6 evaluable, so don't skip it.
