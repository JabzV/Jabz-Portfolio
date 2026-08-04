# Design specs

Written by `figma-extractor` at Phase 1. Read by every downstream agent. Not hand-edited — re-run the extractor if a spec is wrong, so the source of truth stays Figma.

```
docs/design/
├── <page-or-section>.md    one spec per page or major section
└── screens/
    └── <name>.png          Figma reference screenshots, diffed by visual-qa
```

Exported assets do **not** live here — they go to `public/`, since they ship with the site.

`screens/*.png` are reference images that `visual-qa` compares against. Keep them in git: without them, a later QA pass has nothing to diff and silently degrades into code-only review.
