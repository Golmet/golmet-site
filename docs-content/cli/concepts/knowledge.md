<p align="center">English | <a href="/docs/pt-br/concepts/knowledge">Português (Brasil)</a></p>

# The knowledge ecosystem

Tutorial [05](/docs/getting-started/05-maturity-and-knowledge) told what
remains when the project ends. This page opens the ecosystem: where the
knowledge lives, who writes into it, and how an artifact finds its place.

## The three shelves of the state pack

MinhaOrganizacao' knowledge lives in a **state pack** — a Git repository cloned at
`packs/<id>/` in the engine config, inherited by the team via
`golmet pack update`. Inside it, three shelves with defined owners and
formats: **`domains/`** (the foundation — domain knowledge researched from
primary sources, with URL and access date, written by `gm-domain-research`
BEFORE any component consumes the domain), **`accumulation/`** (the
learning — patterns extracted by `gm-pattern-extractor`, metrics by
`gm-metrics-collector`, nuances by `gm-nuance-collector`) and **`rules/`**
(the norms with triggers, written by `gm-rule-keeper` — see
[profile.md](/docs/concepts/profile)).

The separation isn't bureaucracy — each shelf has a different life cycle:
the foundation changes slowly (the domain doesn't change every week), the
learning grows with every project, the norms consolidate when the team
decides.

## The router: where it goes

Mid-work, an artifact appears with no obvious destination — the discovery
"we deploy this way" could be a nuance, a pattern or a norm. The question
is not the operator's: the router (the `gm-knowledge-route` skill, guided by
the AGENTS.md T1–T5 table) classifies the fit and **delegates to the
canonical writer** — each shelf has ONE writer, never two. The central
rule: **route, never replicate** — each shelf has its own index, and
copying content between them is the road to knowledge rotting into two
different versions.

**The escape valve** covers what fits nothing: the artifact is born in the
work zone (`.golmet/`) — never loose — and is promoted when it gains a
function, with the canonical writer responsible for the promotion.

## Why a pack and not a loose folder

A state pack is a Git repository of its own: `pack publish` pushes to the
remote, `pack update` pulls for the team — with auto-commit of the local
accumulation and rebase, and the kit **never discards** what the team
accumulated. That is the difference between knowledge living in a file
nobody versions and knowledge living in a versioned organizational asset.
