# The FORMAT

The FORMAT is the versioned contract of a GOLMET workspace: directory layout, artifact grammar and legal state transitions. It is the layer that survives engines, kits and releases.

## Entities

| Entity | What it holds |
|---|---|
| RN | A numbered business rule — the versioned agreement with your client |
| PEND | An open question that never silently becomes scope |
| CR | A change request against an already-approved requirement |
| Feature / Task | Delivery units anchored on an active RN |
| Spec | Technical translation of the rules (data model, contracts, screens) |
| ADR | The reason behind each decision |

## Evidence

Every requirement cites its implementation: `[src/path/file.ts:42 @1ed8b81]`. The grammar is parseable by machine — the kit compares the hash against the repository HEAD and reports exactly what drifted.

## Hard rules

Ten invariants (H1–H10) keep the workspace honest: a PEND never anchors a Feature, IDs are immutable, evidence must be parseable. `golmet validate` enforces them — exit code non-zero blocks CI.
