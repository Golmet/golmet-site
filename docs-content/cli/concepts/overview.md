<p align="center">English | <a href="/docs/pt-br/concepts/overview">Português (Brasil)</a></p>

# What GOLMET delivers

GOLMET is the stone guardian of your product's documented truth: a CLI plus
an agent toolkit that turns requirements into governed, validated, versioned
knowledge — for a solo developer or for a whole company. This page lists
everything it delivers, layer by layer, in one place. Each item links the
deep-dive page.

## 1. A complete agent toolset — installed in one command

`golmet install` materializes the embedded toolset into your engine
(OpenCode, Claude Code and more): **4 primary agents** (Requirements,
Documentation, Dev, DevOps), **25 subagents**, **95 skills** — 124
components total. Interactive wizard for a machine, explicit flags for
scripts, and a final health report. See
[init.md](/docs/concepts/init).

## 2. Content layers — where every file comes from

Every file on your machine has a declared owner and precedence:
**L0 embedded** (inside the binary) → **L1 FULL** (materialized, kit is the
sole writer) → **L2 packs** (the organization's layer) → **L3 local**
(your creations). Precedence: local > pack > full > base. See
[layers.md](/docs/concepts/layers).

## 3. `profile/` — your personal layer

Your client and operator identity plus the kit's canonical behavior rules
(`context7`, stack templates). The templates live in the kit and are
**never installed**; the config carries only the definitives
(personal-by-design — never versioned, never overwritten). See
[profile.md](/docs/concepts/profile).

## 4. Packs — the organization's knowledge, distributed

A **state pack** is a Git working copy cloned into your engine config —
bidirectional: the team inherits it via `golmet pack add`/`update`, and you
publish accumulated maturity via `golmet pack publish`. Inside, three
shelves with canonical writers: **`rules/`** (norms with reading triggers),
**`domains/`** (domain foundations from primary sources) and
**`accumulation/`** (patterns, metrics, nuances). Tooling inside the pack
(skills/agents) is materialized into the engine; data is read in-place.
See [knowledge.md](/docs/concepts/knowledge).

## 5. Reverse engineering — the documented truth of what already exists

Not every project starts from zero: the frozen source of systems in
production is analyzed and turned into documented truth (models, API
contracts, business rules, the UI golden master) — every claim carrying
its evidence — and what is discovered enters the new workflow as
candidates, not assumptions. The guided reading lets a human validate
what the AI documented. See [reverse.md](/docs/concepts/reverse).

## 6. Organization — enterprise governance

A **container** workspace holds multiple product workspaces, with its own
golmet.yaml, a global catalog of organizations (`~/.golmet/organizations.json`)
and two versioning models (org-repo | products-repo). The company governs
norms once; every product inherits. See
[organization.md](/docs/concepts/organization).

## 7. Deterministic self-governance

Three validators with declared contracts: **`golmet validate`** (H1-H10 —
the workspace against the FORMAT), **`golmet doctor`** (S1-S5 + engine-config
state: managed / personal / pack) and **`golmet lint`** (L1-L12 — dead
references, orphans, stale manifest, canonical names, ghost components,
canonical structure, definitive↔template conformance, registry schema, pack
state, Mermaid diagrams, encoding). Runs in CI, CLI and MCP. The lint loads
the whole state; the agent fixes what it points. See
[self-governing.md](/docs/concepts/self-governing).

## 8. MCP server — 14 tools in the agent session

The kit serves itself via MCP: `gm_validate`, `gm_doctor`, `gm_next`,
`gm_status`, `gm_index`, `gm_eval`, `gm_eval_reports`, `gm_jev_classify`,
`gm_lint`, `gm_upgrade`, `gm_update`, `gm_pack_update`, `gm_pack_list`,
`gm_pack_publish`. The agent session validates, routes and fixes without
leaving the chat. Reference: [../reference/tools.pt-br.md](/docs/reference/tools)
(or `tools.pt-br.md`).

## 9. Self-update with verified releases

`golmet upgrade` fetches the latest GitHub release, verifies **SHA-256**
before touching the binary, swaps Windows-safe (`.old` rollback) and
re-materializes managed content. Cross-platform binaries + npm launcher.
See [self-governing.md](/docs/concepts/self-governing).

## 10. Quality gates from day one

The kit tests itself: **evals** (61+ fixtures scoring skills deterministically),
a **neutrality gate** (no organization/client identity in shipped content)
and **golden byte-equality** (source ↔ materialized). Every release runs the
lint against the kit itself in CI.

## 11. Clean exit

`golmet uninstall` removes the whole structure **layer by layer** with
real counts — everything selected by default except the packs (your local
working copy is deselected; the remote repo is never touched). See
[init.md](/docs/concepts/init).

## Docs in two languages

Every public doc ships in **English** + **Português (Brasil)** with an
alternation badge on top — including this page.

## The design in one diagram

The thesis the whole platform stands on:

> **The workflow is a documentary state machine of the product.** The
> format is the contract; the kit is the deterministic engine; the runtime
> is the agentic layer executing by capabilities.

Three layers split **by nature** (each with its own change cadence and
distribution channel — not by customer tier):

```
┌─────────────────────────────────────────────┐
│ 1. FORMAT — versioned spec                  │
│    workspace layout · artifact schemas ·    │
│    state transitions · evidence grammar     │
├─────────────────────────────────────────────┤
│ 2. KIT — deterministic CLI (no LLM)         │
│    init · validate · doctor · pack · mcp ·  │
│    upgrade · uninstall · template           │
├─────────────────────────────────────────────┤
│ 3. RUNTIME — agentic layer, by capabilities │
│    essential profile (any engine) · FULL    │
│    (reference runtime: OpenCode)            │
└─────────────────────────────────────────────┘
```

The normative contract lives in [docs/FORMAT.md](/docs/format); everything
this page lists is enforced by the validators of item 6.