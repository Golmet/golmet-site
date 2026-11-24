
# Self-governing: the lint carries the state

In tutorial [04](/docs/getting-started/04-o-ciclo-de-uma-feature), the
`golmet validate` checked the whole RN-001 cycle and came out green. This
page explains the philosophy behind those checks — and why Golmet works
where traditional processes rot.

## The principle

**The AI does not carry the whole state; the lint carries it — and the AI
fixes what the lint points at.** It sounds inverted, but it is what makes
the system operate: the lint (`golmet lint`) is a deterministic sweep —
same tree, same output, no judgment. It points at exactly what is broken,
with the remediation citing the skill responsible for the fix. No agent
needs to re-derive the project's state; nobody needs to remember to check
anything.

## The two levels — and what they watch

The **hard** level is `golmet validate`: the FORMAT's H1–H10 rules block —
a Feature is never born from a PEND (H1), a ready Feature requires an
active RN (H3), an active RN requires evidence (H4), the evidence resolves
in the code (H7), cross-references resolve (H10), the index state is
immutable history (H8). That is what blocks the merge.

The **soft** level is the rest: the doctor's S1–S5 warnings (stale
evidence, missing capabilities with declared degradation) and the lint
L1–L10 — the docs' dead refs (L1), orphans without provenance (L3), stale
manifest entries (L4), names off the standard (L5), cited ghost `gm-*`
components (L6), the canonical structure (L7), aggregate sizes (L7-size),
the definitive↔template conformance (L8), the registries schema (L9) and
the state packs' internal state (L10). None of it blocks on its own — but
everything shows up, always.

## Where it runs

The lint runs in the kit repo's CI (a doc with a dead ref = broken build),
via MCP (`gm_lint` — read-only for the agents), at the maintenance skills'
gates (`gm-setup` validates post-install, `gm-workflow-improver` requires a
green lint post-fix, the `gm-pack-*` validate post publish/update). The
`golmet validate` is the everyday gate — and `--json` is the contract for
CI and agents.

The practical consequence: MeuApp's documentation stays correct not because
someone has discipline — because **deviating from it is the hard path**.
