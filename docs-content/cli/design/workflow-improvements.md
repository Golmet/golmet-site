<p align="center"><a href="workflow-improvements.pt-br.md">Português (Brasil) — versão integral</a> | <a href="../../README.md">English README</a></p>

# WORKFLOW_IMPROVEMENTS — The improvement history

> **The source of truth is the PT-BR integral version**
> ([workflow-improvements.pt-br.md](workflow-improvements.pt-br.md) — 2,774
> lines, **142 numbered improvements**, IMP-013 through IMP-153). This page
> is the **high-level English index**: the eras that shaped the kit and the
> anchor improvements of each one.

> **Difference from DECISIONS.md:** this archive records **corrections**
> (what was wrong and how it was fixed). DECISIONS.md records **design**
> (why we chose X over Y).

## The eras

| Era | Improvements | What it shaped |
|---|---|---|
| **Founding** | IMP-013..031 | The organizational pattern (unit = product), the GOLMET triad, the shielded reverse layer, transversal components, the EF Core migrations convention, the eval waves (leva 1-final), the delivery structure (analysis + delivery per feature), the PEND triage flow |
| **Performance & quality** | IMP-039..051 | `gm-perf-auditor`, read-only permissions by default, high-fidelity delegation, the pattern library v2 (EN taxonomy + consumption hooks), the workflow scorecard (14 segments), browser-in-the-loop in `gm-dev-frontend` |
| **Consistency & hygiene** | IMP-052..088 | The unconditional plan-first gate, legacy SDD skill removal, the lean global AGENTS.md with lazy `rules/` loading, DEC-XXX → ADR-NNN migration (MADR), Jev-validated sanitization, PR route canonicalization, Git worktrees for dev executors, the anti-idle rule, the branch gate, builders-aware stack commands |
| **Architectural analysis & open core** | IMP-089..119 | The architectural analysis lots (registry alignment, checklists), the open-core phases 1-5 (neutrality gate, Core/Pack/Profile contracts, Apache-2.0 + DCO, `gm-pack-scaffold`, public README, `.gitignore` in the public subset), the compliance layer (LGPD), core+packs decoupling, the GOLMET Quadri, the operator profile layer |
| **Reverse & depth** | IMP-125..153+ | The reverse engineering layer improvements (evidence strength, O/I/U triad, unknown ledger), the optional code graph (MCP codebase-memory), design-first for visual CRs, deterministic scanners, the operator layer, `gm-ui-capture`, anti-gigantism (Bounded Context sharding), decision-question communication, **L11-L13 of the lint** (Mermaid, encoding, language anchors) |

## Notable anchors

- **IMP-014** — the GOLMET triad and the shielded reverse layer (the origin
  of the reverse engineering capability).
- **IMP-039..051** — the eval waves that gave every skill a deterministic
  regression fixture.
- **IMP-043** — high-fidelity delegation (the primary passes inputs,
  decisions, expected output format and restrictions — never makes the
  subagent guess).
- **IMP-055** — the lean global AGENTS.md with lazy `rules/` loading (the
  lazy index pattern).
- **IMP-085** — the anti-idle rule on primary agents (no empty tool-call
  loops at the decision point).
- **IMP-088** — the branch gate in `gm-dev` (explicit base confirmation
  before implementing).
- **IMP-096** — trust propagation (legacy → specs) with CONFIDENCE_REPORT.
- **IMP-111..115** — the open-core phases: neutrality gate, the Core/Pack/
  Profile contracts, Apache-2.0 + DCO, `gm-pack-scaffold`, the public README.
- **IMP-145** — decision-question communication on primary agents (the
  `question` tool convention).
- **IMP-147..149** — the reverse layer discipline: O/I/U triad, the residual
  unknowns ledger, tool scopes as skill requirements, evidence strength
  (confirmed/inferred/gap).

## The convention

Each entry is immutable and incremental (never delete previous entries),
with the standardized format: Date, Target, Problem, Root cause, Fix,
Files, Status. The full PT-BR record is the archive; the CHANGELOG
documents each release wave with the real-world motivation.
