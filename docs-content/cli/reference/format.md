<p align="center">English | <a href="format.pt-br.md">Português (Brasil)</a></p>

# The FORMAT — the normative spec

The kit's complete contract is [FORMAT.md](../../FORMAT.md) (v1) — the
single source of truth: every rule the checks enforce, the entity grammar,
the two enforcement levels (hard/soft) and the canonical structures. **This
page does not duplicate** — it points.

| What you are looking for | Where it is in the FORMAT |
| --- | --- |
| The workspace layout, the init wizard, the versioning models | §2 (with §2.1 layers, §2.2 stack-templates, §2.3 container) |
| `golmet.yaml` — the manifest | §3 (with §3.1 the pack contract) |
| ID and evidence grammars | §4 · §5 |
| States: directives and front matter | §6 (with §6.1 the YAML subset) |
| Entities and the state machine (Charter, RN, PEND, CR, Feature, Task, Spec, ADR, Candidate) | §7 (with §7.7.1 spec aggregates) |
| The States Index (`golmet.index.json`) | §8 |
| Enforcement — hard (`validate` H1–H10), soft (`doctor` S1–S5), the lint L1–L10, the execution context, the cancellation pattern | §9 (with §9.1 lint) |
| The skill contract (capability front matter) | §10 (with §10.1 the dual registration) |
| Structured errors (`--json`) | §11 |
| FORMAT versioning and the scope guard | §12 · §13 |

> Language note: the FORMAT.md normative spec is written in **Portuguese**
> (the working language of the org) — a full English translation is its own
> wave (declared in the FORMAT §2 roadmap; the section table above is the
> EN map while it doesn't exist).
