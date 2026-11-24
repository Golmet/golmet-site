
# Reverse engineering — the documented truth of what already exists

Not every project starts from zero. Systems in production, legacy code,
an ingestion pipeline that already works — the GOLMET **reverse-engineers
what exists** and turns it into documented truth, so the new workflow is
born from what **is** (never from the model's memory, never from guesses).

## What the reverse layer delivers

**The REVERSE_REPORT** — the documented analysis of the frozen source:
models, API contracts, business rules. Every claim carries its evidence
(`[file:line @hash]`) — the agent cites the source instead of trusting
itself.

**`reverse/CANDIDATES.md`** — the candidate knowledge queue (`CAND-NNN`):
what was discovered from the legacy enters the new workflow as a candidate,
not as an assumption. This is the bridge between what exists and what will
be built (see [artefatos.md](/docs/concepts/artefatos)).

**The human layer of the legacy** (`gm-legacy-guide`) — `reverse/guide/`:
OVERVIEW, IMPACT_MAP, GUIDES/<domain>, FORMS/<domain> — the guided reading
that lets a human validate what the AI documented, domain by domain, with
confirmation forms.

**The UI golden master** (`gm-ui-capture`) — the visual capture of the
legacy flows via the MCP Playwright browser: the old system also has an
appearance, and appearance is documented truth too.

## The principle: evidence, not memory

The reverse layer's discipline is the same as the knowledge shelf's, taken
further: every statement about the legacy carries the file, the line and
the commit hash. When the AI is unsure, it declares what it does not know
instead of guessing. The human reads, confirms or rejects, and the
confirmed truth becomes the foundation the new system builds on.

## Where it enters the journey

Brownfield projects start here: analyze the frozen source first, seed the
candidate queue, hand the human the guided reading — and only then plan
the new workflow on top of documented truth. See
[02-projeto.md](/docs/getting-started/02-projeto) (the candidate queue in
brownfield projects) and [05-maturity-and-knowledge.md](/docs/getting-started/05-maturity-and-knowledge)
(what remains when the project ends).
