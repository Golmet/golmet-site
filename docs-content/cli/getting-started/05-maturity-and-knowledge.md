<p align="center">English | <a href="05-maturity-and-knowledge.pt-br.md">Português (Brasil)</a></p>

# 05 — What remains when the project ends: the pack cycle

Tutorial [04](/docs/getting-started/04-o-ciclo-de-uma-feature) closed MeuApp's RN-001
delivered and validated. The project is done — features delivered, validate
green, the client satisfied. And now? What MeuApp leaves behind is not just
code: it is **maturity** — the patterns that worked, the metrics the evals
measured, the fine lessons the team learned, the domain knowledge that was
researched. This tutorial asks a single question: **where does that
maturity live, and how does it reach the next project?**

The answer has a name: the **pack**. And a complete cycle, which this doc
walks from start to end: the project closes → the retrospective extracts →
the pack accumulates → the publish pushes → the org repo keeps → the next
project inherits.

## 1. Create the pack repo in the organization (once per org)

Maturity is an organizational asset — so it lives in a **Git repository of
its own owned by the org**, not in a loose folder on your computer. Create
the private repo (on the GitHub UI or with the CLI):

```bash
gh repo create <org>/<pack-repo> --private
```

The name is up to you — what matters is: private repo, owned by the org,
with room to grow. This repo is the **source of truth of the
organization's maturity**: everything the projects reveal goes up here.

## 2. Create the pack (the first time)

With the repo created, the **`gm-pack-scaffold`** skill assembles the full
pack skeleton from the FORMAT §3.1 contract — the initial commit and the
canonical structure:

```
pack.yaml                    # the pack manifest (kind: state — bidirectional working copy)
README.md                    # the pack's purpose
skills/                      # skills/agents the org shares by overlay
rules/                       # the org's norms (one per file, with a trigger)
domains/                     # the domain foundation (KNOWLEDGE.md per domain)
accumulation/                # the accumulated learning:
├── patterns/                #   the reusable patterns (by type: code, process…)
├── metrics/                 #   the project metrics accumulated over time
└── nuances/                 #   the fine observations, one per theme
```

What each part is: `pack.yaml` declares what the pack provides and the
archetype (`kind: state` — the clone is a bidirectional working copy, not a
read-only cache). `rules/` and `domains/` are declarative knowledge — the
house way and the domain understanding. `accumulation/` is the accumulated
learning — every project deposits here and the pack keeps the history.

## 3. Link it on your machine

```bash
golmet pack add <repo-url> --engine opencode
```

The kit clones the repo into `<config>/packs/<id>/` — the **bidirectional
working copy**: it is linked to the repo (origin points at it) and the kit
knows that is a pack, not a loose file. From here, the org's maturity is
available on your machine: the triggered norms enter the AGENTS.md, the
patterns become visible to the skills.

## 4. The retrospective (every time a project closes)

MeuApp closed. Before archiving, run the **`gm-project-retrospective`** —
the skill that conducts the extraction of what the project revealed, with
the canonical writers recording **into the pack's working copy**:

- the patterns that worked → `accumulation/patterns/<type>/`, by the
  **`gm-pattern-extractor`** (a pattern = the problem, the solution and the
  code demonstrating it);
- the retrospective metrics (coverage, evals, what was measured) →
  `accumulation/metrics/`, by the **`gm-metrics-collector`**;
- the fine observations ("the scheduler drifts 2s against the confirmation
  database") → `accumulation/nuances/<theme>.md`, by the
  **`gm-nuance-collector`** — one nuance per theme, append-only;
- the domain knowledge the project researched → `domains/`, by
  **`gm-domain-research`** (when founded — primary sources with URL and
  access date).

Each writer has its own format and trigger — and the knowledge router
([docs/concepts/knowledge.md](/docs/concepts/knowledge)) decides the
destination when the artifact has no obvious one.

## 5. Push to the org repo

```bash
golmet pack publish
```

The publish performs the **WIP commit** (the working copy's uncommitted
changes) and the **push to the org repo** — the source of truth of the
maturity, updated. The rule is deliberate: **the publish is manual by
design** — the operator decides when the knowledge is ready to be shared
(nothing goes up without your hand; the kit never discards what the team
accumulated, but it also never publishes without a decision).

## 6. Inherit

The org's next project (or a new collaborator's fresh machine):
**`golmet pack add`** again — and the accumulated maturity is there
immediately: the house norms, the patterns MeuApp left, the domain
foundation. For those who already have the pack linked: **`golmet pack
update`** syncs the repo into the working copy (with auto-commit of the
local accumulation and rebase — never discarding what you have).

**Golmet matures with use: the first project teaches; the second inherits.**

## The cycle, from above

```
   project closes (validate green, deliveries done)
          │
          ▼
   gm-project-retrospective ── extracts (patterns · metrics · nuances · domains)
          │                          records INTO THE PACK'S WORKING COPY
          ▼
   golmet pack publish ── WIP commit + push (manual by design)
          │
          ▼
   organization repo (e.g. <org>/<pack-repo>) ── the source of truth
          │
          ▼
   golmet pack add (the next project · the new machine) ── inheriting
```

What this cycle buys the organization: the second project starts with the
house norms in place, the proven patterns available and the domain
foundation researched — the team's AI inherits the house way on day one.

## The journey ends — the cycle continues

[00 — why Golmet exists](/docs/getting-started/00-por-que-golmet) ·
[01 — the Organization](/docs/getting-started/01-organizacao) ·
[02 — the project](/docs/getting-started/02-projeto) ·
[03 — the AI in the cycle](/docs/getting-started/03-trabalhando-com-ia) ·
[04 — the cycle of one feature](/docs/getting-started/04-o-ciclo-de-uma-feature) ·
[05 — maturity](05-maturity-and-knowledge.pt-br.md).

For the concepts in depth: the whole knowledge ecosystem in
[docs/concepts/knowledge.md](/docs/concepts/knowledge).
