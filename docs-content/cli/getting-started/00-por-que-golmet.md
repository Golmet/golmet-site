<p align="center">English | <a href="/docs/pt-br/getting-started/00-por-que-golmet"Português (Brasil)</a></p>

# 00 — Why Golmet exists

Every software project starts with good intentions: someone writes the
requirements, someone draws the architecture, the team aligns the scope.
Then the deadline tightens. The requirement changes in a hallway
conversation and nobody updates the document. The spec drawn in Figma ends
up two sprints behind what the code does. Three months later, the
documentation is a museum of things that are no longer true — and the team
stops looking at it.

The operator, owner of **MinhaOrganizacao**, lived this in every project. The
company's scheduling product, **MeuApp**, had requirements in a Word file,
decisions scattered across chat messages, and a codebase that grew without
anyone knowing exactly which business rules were implemented. When a client
asked "why does slot confirmation work like this?", the answer lived in one
person's head — and people go on vacation, change companies, forget.

The problem is not a lack of will to document. It's that **documenting
never wins**: while the doc is an effort separate from the code, it always
loses priority, and while it is never verified, it always rots. Beautiful
documentation tools don't fix that — they just change where the museum
lives.

## What changes with Golmet

Golmet attacks both sides at once:

**Documentation becomes machine-verified.** The kit defines a contract (the
FORMAT v1): each business rule is a document section with state and owner,
and each rule carries **evidence** — the file, the line and the hash of the
code that implements it. `golmet validate` checks all of it on every run.
Stale documentation isn't "annoying", it's a **finding that blocks the
merge**.

**The AI does the work nobody had time for.** Golmet is not just the
validator: it ships with a workflow of skills (`gm-*`) your AI executes
inside the editor. The AI runs the elicitation with the product owner, the
AI writes the technical spec from the rules, the AI reviews the code
against the spec before the merge. Writing documentation stops being a
heroic end-of-sprint effort and becomes a byproduct of development
itself.

In practice, with Golmet installed and Opencode open in the workspace:

- you describe the requirement in plain language and the
  `gm-clarify`/`gm-req` skill turns it into a requirement section with
  score, state and owner;
- from the requirement, `gm-taskspec` generates the functional and
  technical analysis, and the delivery is born with its tasks;
- when the code ships, `gm-dev-qa` runs the suite and `golmet validate`
  checks the congruence — whatever diverged shows up with remediation.

The result the operator saw on MeuApp: when the client asks why slot confirmation
works like that, the answer is a requirement section with evidence pointing
at the code — and it is correct because the machine confirms it on every
validation.

## Where to start

The journey continues in the next tutorials:
[01 — create the Organization](/docs/getting-started/01-organizacao) ·
[02 — create the project](/docs/getting-started/02-projeto) ·
[03 — working with AI](/docs/getting-started/03-trabalhando-com-ia) ·
[04 — the cycle of one feature](/docs/getting-started/04-o-ciclo-de-uma-feature) ·
[05 — what remains at the end](/docs/getting-started/05-maturity-and-knowledge).
