<p align="center">English | <a href="/docs/pt-br/concepts/artefatos">Português (Brasil)</a></p>

# The artifact architecture of Golmet

The whole structure of Golmet — the directories, the formats, the
validations — exists to sustain a chain of documents where **each one is
born from another and feeds the next ones**. This page tells that chain as
a story (the same journey as the
[tutorials](/docs/getting-started/00-por-que-golmet), seen from above) and
closes with the complete reference table.

## The story: the seed and the descent

**The charter is the seed.** The `PROJECT_CHARTER.md` declares what the
product is — and where its code comes from (the Repos table of §1).
Everything in the MeuApp workspace descends from the charter: it is the
first document, and that is why `golmet validate` complains when it is
missing or unreadable — no seed, no tree.

**REQUIREMENTS inherits and expands.** The product's business rules (the
`## RN-NNN` sections) are a refinement of the charter: the charter says
"it's a scheduling product", the RNs say "booking with slot confirmation,
15-minute window". Confirmed RNs are the **only** foundation of
implementation — a Feature can only be born anchored to an RN
(`anchor: RN-001`); anchoring to a PEND is a blocking error (H1). It is the
rule that keeps the team from implementing what nobody confirmed.

**Specs derive from the RNs.** Each RN with implementation ahead earns the
folder `analysis/RN-NNN — title/` with the functional and technical
analysis — the HOW. The spec is written from the rule (never the other way
around): when a spec diverges from its RN, either the spec is `stale` (and
must declare by which CR), or there was a derivation mistake. That is why
the FORMAT has section §7.7: the `specs/DATA_MODEL.md` aggregate grows with
maturity, and the break by micro-context exists so whoever implements one
RN doesn't have to load the whole bank.

**The delivery delivers.** The Feature in
`delivery/<group>/RN-NNN — title — Feature.md` is the moving part: tasks
with state and owner, execution coordinated by the dev skills. The feature
moving is what raises the RN to `active` — with evidence
(`[path:line @hash]`), the file+line+commit bond with the code.

**The evidence is the seal.** And here is Golmet's difference from any
traditional doc: RN-001 doesn't say "was implemented" — it **points** at
the code, and `golmet validate` confirms the pointing is real (the file
exists, the line exists, the hash is the HEAD — H7, S2). Documentation the
machine verifies is the only kind the team keeps trusting.

**The index is the memory of states.** The `golmet.index.json` keeps every
entity's state at the last good validation. When a confirmed rule changes,
the path is the CR (`CHANGE_REQUESTS.md` records the change, the RN
updates, the spec drops to `stale` with the reason); when a technical
decision is made, it becomes an ADR in `DECISIONS.md` — immutable, because
the history of "why" is what the team will re-read.

**And what closes the knowledge circle**: the TRACEABILITY (in `quality/`)
maps RN → generated documents; the knowledge pack (patterns, domains,
rules) inherits what the project revealed — the chain doesn't end at the
delivery, it ends by becoming an organizational asset.

## The reference table

| Document | Where it lives | Feeds | Is fed by | Produced by (`gm-*`) |
|---|---|---|---|---|
| `PROJECT_CHARTER.md` | workspace root | REQUIREMENTS, specs, everything | the founding conversation | `gm-charter` |
| `REQUIREMENTS.md` (RNs + PENDs) | root | specs, delivery (the anchors) | charter + elicitation with the owner | `gm-req` (via `gm-clarify`) |
| `CHANGE_REQUESTS.md` (CRs) | root | RNs (the update), specs (the staleness) | post-confirmation changes | `gm-req` (`gm-change-request`) |
| `DECISIONS.md` (ADRs) | root | the technical decisions of specs | the architecture discussion | `gm-decision-log` |
| `analysis/RN-NNN/` (functional + technical) | analysis/ | the Feature and the tasks | the RNs | `gm-taskspec` |
| `specs/DATA_MODEL.md` etc. | specs/ | implementation, db drift | the RNs | `gm-datamodel`, `gm-apicontracts`, `gm-arch`, `gm-uispec`, `gm-criteria` |
| `delivery/RN-NNN — Feature.md` | delivery/ | the code (the tasks) | the technical analysis | `gm-taskspec` |
| `golmet.index.json` | root | the validate comparisons | the prose (the kit writes) | the kit (`golmet validate`/`index`) |
| `quality/TRACEABILITY.md` | quality/ | the coverage audit | everything | `gm-traceability` |
| knowledge pack (`rules/`, `accumulation/`, `domains/`) | the org's pack | the next projects | retrospectives and decisions | `gm-rule-keeper`, `gm-pattern-extractor`, `gm-domain-research` |

## The rules that sustain the chain

The chain is only worth it if it's verified. The [FORMAT v1](/docs/format)
defines the checks that keep it from rotting: H1 (PEND never anchors a
Feature), H3 (a ready Feature requires an active RN), H4 (an active RN
requires evidence), H7 (the evidence resolves in the code), H10
(cross-references resolve), H8 (the state in the index is the history — an
accepted ADR doesn't change). The soft (S1–S5) and the lint (L1–L10) watch
the rest — the full discipline in [FORMAT §9](/docs/format).
