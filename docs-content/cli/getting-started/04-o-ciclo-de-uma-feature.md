<p align="center">English | <a href="/docs/pt-br/getting-started/04-o-ciclo-de-uma-feature"Português (Brasil)</a></p>

# 04 — The cycle of one feature

This tutorial walks ONE feature from start to finish — MeuApp's slot
confirmation (RN-001) — with each document showing up at the moment it is
born. It is the best way to understand Golmet's artifact architecture: not
as a diagram, but as a work sequence. (The reference map, with the complete
who-feeds-whom table, is in
[docs/concepts/artefatos.md](/docs/concepts/artefatos).)

## 1. The requirement is already in REQUIREMENTS

Through tutorial 03, RN-001 was born in MeuApp's `REQUIREMENTS.md`, state
`confirmed`. It is the starting point of everything: **the business rule is
the anchor** — the document around which spec, task and code organize
themselves.

## 2. The technical spec descends into analysis

João asks in Opencode: "spec for RN-001". The `gm-taskspec` skill does two
things, in this order:

- the **functional analysis** — what the rule means as behavior (the
  acceptance criteria, given-when-then);
- the **technical analysis** — how it becomes code: affected entities,
  endpoints, contracts.

And it creates the folder `analysis/RN-001 — Booking with slot
confirmation/` with both documents, plus the Feature file in `delivery/`.
The feature is born with `anchor: RN-001` — the formal bond: this feature
exists FOR this rule. (A feature anchored to a PEND is a blocking error —
the FORMAT's H1: you never implement what was not confirmed.)

## 3. The tasks enter the delivery

Inside the Feature, the tasks (`### RN-001-1`, `RN-001-2`…) describe the
work with state and owner. Implementation starts from here: `gm-dev` picks
the task, delegates to the code executor, and the independent QA runs the
suite.

## 4. The code ships — and the evidence is born

The executor implements slot confirmation. At the commit, the evidence is
recorded on RN-001: `[BPro-API/src/Booking.cs:88 @a1b2c3d]` — the file, the
line and the hash. This is the moment documentation stops being a promise:
the rule now POINTS at the code.

## 5. The validation closes the cycle

```bash
golmet validate
```

The kit checks everything at once: does RN-001 point at code that exists
(H7)? Is the hash the current HEAD or is the evidence stale (S2)? Is the
feature ready and the RN active (H3)? Does the state index match the prose
(H8)? Do the cross-references resolve (H10)? All green:

```
ok — workspace conforme (FORMAT v1) — contexto: workspace-produto
0 erro(s), 0 aviso(s) — 57 arquivo(s), RN 14, PEND 1, CR 2, ADR 5, CAND 0, Feature 6, Task 21, Spec 12
```

All green. `golmet lint` (the L1–L10 structural sweep) passes clean — the
doc references resolve, the names are in the standard, nothing is orphan.

If something were diverging — a stale evidence, a spec without a change
reason — the validate would point at it **with the remediation**: what to
fix, and which skill is responsible. The AI fixes what the lint points at;
the lint carries the state. ([docs/concepts/self-governing.md](/docs/concepts/self-governing))

## 6. The delivery

The task rises to `done`, the feature to `done`, RN-001 stays `active` with
consolidated evidence. `golmet status` shows the board:

```
RN: 14 (12 active · 1 confirmed · 1 draft) · PEND: 1 · CR: 2 · Feature: 6 (5 done · 1 in progress)
```

And that's it — the full cycle. When the client asks "why does slot
confirmation have 15 minutes?", the answer is in nobody's head: it is in
RN-001, with the spec that details it, the feature that implemented it and
the code it points at.

The end of a project's story is not the trash: it is
[05 — what remains at the end](/docs/getting-started/05-maturity-and-knowledge).
