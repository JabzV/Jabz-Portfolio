@AGENTS.md

# Portfolio — design-to-code pipeline

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · **Tailwind v4 CSS-first** · GSAP · Figma MCP

## Stack facts that are easy to get wrong

- **No `tailwind.config.ts` exists and none should be created.** Tailwind v4 declares tokens in `src/app/globals.css` under `@theme`.
- Node is managed by **nvm-windows** (Herd's, root `~/.config/herd/bin/nvm`). `C:\Program Files\nodejs` is a *symlink* nvm repoints. Install Node with `nvm install <version>` — a Node MSI installs *through* the symlink and corrupts the active nvm folder.
- Figma access is **link-based**. There is no browse-by-filename: a frame link copied via *Copy link to selection* is required, and its `node-id` is what identifies the target.

## The two invariants

**1. The token gate is sequential.** No component work begins until `token-architect` has committed the theme. Parallel builders without a shared vocabulary each invent their own values, producing components that are individually correct and collectively inconsistent.

**2. Recreate and improve never share a phase.** Fidelity means matching the Figma; improvement means departing from it. Blended, every visual diff becomes ambiguous — bug or intent? — and QA stops being able to answer anything. Reach parity, commit it as a tagged baseline, then improve against that.

## Hierarchy

```
orchestrator (main thread — never delegates decisions, only work)
│
├── TIER 1 · foundation ─────────── strictly sequential
│     figma-extractor ──→ token-architect
│         (specs)            (theme)   ◄══ GATE: commit before Tier 2
│
├── TIER 2 · build ──────────────── parallel, one file owner each
│     component-builder ×N
│         └──→ motion-engineer      (only after components are verified)
│
├── TIER 3 · verify ─────────────── parallel, read-only
│     visual-qa  ║  perf-a11y-auditor
│         └──→ findings loop back to Tier 2
│
│   ══════ PARITY BASELINE · git tag ══════
│
└── TIER 4 · improve ───────────── proposes → user approves → re-enters Tier 2
      ux-critic
```

Parallelism happens *within* a tier, never across the gate.

## Rules for dispatching agents

- **Read-only agents are read-only by design.** `visual-qa`, `perf-a11y-auditor`, and `ux-critic` have no write tools. An agent that both judges and fixes rationalizes its own work — never grant them edit access to "save a round trip."
- **Every `component-builder` is told exactly which files it owns.** Concurrent builders sharing a file lose work. `globals.css`, `layout.tsx`, and `package.json` are never owned by a builder.
- **A builder that needs a missing token stops and reports.** It does not add one — `token-architect` owns that file.
- **Findings are triaged by the orchestrator, not applied by the reporter.** Auditors report; builders fix.
- **`visual-qa` needs an app screenshot on disk.** The orchestrator captures it and passes the path; the agent reads both images. Without one, its review is code-level only and must say so.

## Workflow

| Phase | Command | Agent | Gate |
|---|---|---|---|
| 0 · Recon | — | orchestrator | scope + breakpoints confirmed by user |
| 1 · Extract | `/extract <figma-link>` | `figma-extractor` | spec written, token situation reported |
| 2 · Foundation | `/foundation` | `token-architect` | **build passes, theme committed** |
| 3 · Build | `/build <sections>` | `component-builder` ×N | build passes |
| 4 · Motion | `/motion <section>` | `motion-engineer` | reduced-motion honored |
| 5 · Verify | `/verify` | `visual-qa` ‖ `perf-a11y-auditor` | no BLOCKER/MAJOR → **tag baseline** |
| 6 · Improve | `/improve` | `ux-critic` | each item approved individually |

Phase 5 loops back to 3 until diffs are intentional. Phase 6 re-enters 3 for approved items.
