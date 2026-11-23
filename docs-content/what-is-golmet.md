# What is GOLMET

GOLMET is a CLI and a workflow that turn client agreements into **versioned requirements** — plain markdown files in your own git — and keep the documentation true after the code ships.

## The problem it solves

Teams lose decisions in meetings. Tribal knowledge lives in the heads of the people who leave. Documentation rots after the sprint ends. GOLMET stores the normative state of the product as numbered, versioned requirements, with specs derived from them and code citations as evidence.

## Three layers

- **FORMATO** — the contract: workspace layout, artifact schemas and legal state transitions.
- **KIT** — the deterministic engine: `golmet validate`, `status`, `doctor` — no LLM, no surprises.
- **RUNTIME** — the agentic layer: judgment through capabilities, on any engine that speaks the open standards (AGENTS.md, SKILL.md, MCP).

## Evidence, not vibes

Every requirement cites its code: `[src/app/landing/landing.ts:9 @1ed8b81]`. The kit parses that grammar, compares the hash against the repository HEAD and tells you exactly what drifted.
