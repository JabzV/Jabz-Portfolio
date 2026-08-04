---
description: Phase 1 — extract a Figma frame into a design spec
argument-hint: <figma-link-to-selection> [section-name]
---

Phase 1 of the pipeline. Target: $ARGUMENTS

If no Figma link was given, stop and ask for one copied via **right-click → Copy link to selection**. A bare file URL without a `node-id` targets nothing and produces an "invalid node ID" failure.

Dispatch the `figma-extractor` agent. Tell it:
- the Figma link
- the spec filename to write under `docs/design/`
- to save its reference screenshot to `docs/design/screens/`

When it returns, relay to me: the **token situation** (real variables vs flat hardcoded frames), what it specced, and every `UNKNOWN` it flagged. Do not proceed to Phase 2 — the token situation may change what I want to do.
