---
description: Phase 6 — propose improvements beyond the Figma (requires parity baseline)
argument-hint: [area]
---

Phase 6. Scope: $ARGUMENTS (default: whole site)

**Check for the parity baseline tag first and stop if it's missing.** Improving a build that doesn't yet match its design produces changes nobody can evaluate — if parity isn't reached, the right command is `/verify`.

Dispatch `ux-critic` (read-only, proposes only). Give it the built site, the specs, and the Figma reference. Remind it this is a **portfolio**: every proposal is judged by whether it helps a stranger decide to hire or contact me — not by generic design taste.

When it returns, present the ranked list with each item's:
- reader-facing problem (not just the proposed change)
- affected files and S/M/L effort
- whether it **contradicts** or **extends** the Figma

Items that contradict the Figma need me to consciously overrule my own design — surface those separately and never bundle them with gap-filling changes.

I approve items **individually**. Approved ones re-enter Phase 3 via `/build`. Nothing gets implemented off the back of this command directly.

If a refinement is worth keeping in the design too, offer to push it back into Figma via `use_figma` so design and code don't drift apart.
