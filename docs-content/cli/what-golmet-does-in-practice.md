# What Golmet does, in practice

A real journey, from zero to delivery. The analyst opens the company folder and
runs `golmet init`: the **Organization** is born — the `golmet.yaml` that
declares the products, the constitution, the index. Inside it he creates
the product's project, and the project is born with the right documents
already in place: the `PROJECT_CHARTER.md` (what the product is), the
`REQUIREMENTS.md` (the business rules, one per section, with state and
owner).

Not every project starts from zero. When the system already exists - in
production, with history - the journey starts with **reverse engineering**:
GOLMET freezes the source and turns it into documented truth (models,
contracts, business rules - every claim with its file, line and hash),
seeds the candidate queue and hands the human the guided reading of the
legacy. The new workflow is planned on documented truth, not on the model's
memory. See [reverse engineering](docs/concepts/reverse.md).

When the client asks for the feature "booking with slot confirmation", the
requirement enters REQUIREMENTS as a `## RN-001 — ...` section — and each
rule carries **evidence**: the file, the line and the hash of the code that
implements it. The technical spec descends into `specs/`, the task into
`delivery/`, the code ships. When anyone runs `golmet validate`, the kit
checks: does rule RN-001 point at code that exists? Does the hash match the
HEAD? Is the spec stale? What diverged shows up — and doesn't merge.

When the project ends, what remains is not a forgotten Word file: it's a
**knowledge package** — the norms of how that organization works, the
patterns its projects revealed, the researched domain foundation. The next
project starts with all of it already loaded.

**AI through the whole cycle.** Golmet is not a lonely validator: it ships
with a workflow of `gm-*` skills your AI executes - the AI elicits the
requirements (with you), the AI writes the spec, the AI writes the code
with green tests against the approved spec, the AI reviews the code
against the spec. Documentation stops being the thing nobody has time for.
