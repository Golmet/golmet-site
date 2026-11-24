<p align="center">English | <a href="FORMAT.pt-br.md">Português (Brasil)</a></p>


# FORMAT v1 — Normative Specification of the GOLMET Workspace

> **Status:** the normative spec v1 lives in
> [FORMAT.pt-br.md](FORMAT.pt-br.md) (Portuguese — 825 lines, the single
> source of truth). This page is the **English pointer**: the map of
> sections and what each one governs. The full English translation is its
> own wave (the scale of the spec); until it lands, this page is the index.

**Requirement convention** (RFC 2119 adapted): **MUST / MUST NOT** —
violation = hard error (`golmet validate` blocks CI). **WARNING** — reported
by `golmet doctor`, does not block. **MAY** — optional, unchecked.

## Section map (of FORMAT.pt-br.md)

| Section | What it governs |
|---|---|
| §1 Scope | declared truth vs. inferred — the format never claims "not implemented" |
| §2 Workspace layout | the canonical tree: `golmet.yaml`, `golmet.index.json`, `.golmet/` zone, entities, `analysis/`, `delivery/`, `specs/` |
| §2.1 Content layers | L0 embedded → L1 FULL → L2 packs → L3 local (precedence: local > pack > full > base) |
| §2.2 Stack-templates registry | the kit knows HOW, the organization defines WHAT (M15 pack-first) |
| §2.3 Organization container | container workspace: canonical structure and scoping |
| §2.4 `golmet init` | never silent: 3 options, wizard, guards (never the home root) |
| §2.5 Global org catalog | `~/.golmet/organizations.json` — adoption, uniqueness, prompt privacy |
| §2.6 Product documentation | outside the DAG — post-release output, not requirement |
| §2.7 Bilingual docs convention | EN base + `.pt-br.md`, alternation badge |
| §2.8 Wizard UX | confirm-frame per command, single cancellation pattern (RAW/COOKED) |
| §3 `golmet.yaml` | the manifest; §3.1 the pack contract (overlay and state archetypes) |
| §4 ID grammar | RN-NNN, PEND-NNN, CR-NNN, ADR-NNN, CAND-NNN, Feature/Task IDs |
| §5 Evidence grammar | what counts as declared evidence (hash ↔ HEAD) |
| §6 State directives | front matter accepted subset (normative, DR-018) |
| §7 Entities and state machine | Charter, RN, PEND, CR, Feature, Task, Spec, ADR, Candidate — one section per entity |
| §8 `golmet.index.json` | the state index — written ONLY by the kit |
| §9 Enforcement | two levels; **§9.1 `golmet lint`** — the deterministic sweep (L1-L14 checks table, canonical structures, declared anti-false-positive heuristics and allowlists) |
| §10 Skill contract | the capabilities front matter (requires/degrades/kit) |
| §10.1 Skill + subagent dual registration | same id by need, not symmetry — the criterion |
| §11 Structured errors | the error grammar of the checks |
| §12 Versioning | how the spec itself evolves |
| §13 Scope guard | what does NOT enter the format |
| §14 Minimal example | a conforming workspace, complete |

> Declared skip: the migration doc (`docs/migration*.md`) **describes the
> legacy model by nature** — dead paths and extinct components cited as
> past — so L1/L6 do not apply to it (enforced in the L1/L6 walkers).

**The normative contract is enforced by** `golmet validate` (H1-H10),
`golmet doctor` (S1-S5) and `golmet lint` (L1-L14) — see
[overview.md](overview.md) §6.