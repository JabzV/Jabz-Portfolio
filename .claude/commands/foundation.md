---
description: Phase 2 — build the Tailwind v4 theme from extracted tokens (blocking gate)
---

Phase 2 — **the gate**. Nothing downstream runs until this is committed.

Preconditions, checked before dispatching:
- at least one spec exists in `docs/design/`
- no component work has already been done against ad-hoc values

Dispatch `token-architect`. Remind it that this project is **Tailwind v4 CSS-first** — tokens go in `src/app/globals.css` under `@theme`, and no `tailwind.config.ts` should be created.

If the extractor reported the Figma has **no variables** (flat frames, hardcoded values), the agent must propose a scale and stop rather than inventing one. Bring that proposal to me for approval.

When it returns:
1. Confirm `npm run build` passes.
2. Relay the **full list of token names** it created — this becomes the styling vocabulary every builder is restricted to.
3. Commit the foundation before any Phase 3 work begins.
