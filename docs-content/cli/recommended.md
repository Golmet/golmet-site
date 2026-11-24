<p align="center">English | <a href="recommended.pt-br.md">Português (Brasil)</a></p>

# The recommended mode: Organization + FULL + Opencode

Golmet works in many combinations — and that is exactly why it is worth
carving out which one is **tested end to end**: **Organization + FULL
profile + Opencode**. The journey of the tutorials
([00](/docs/getting-started/00-por-que-golmet) through
[05](/docs/getting-started/05-maturity-and-knowledge)) follows exactly
this mode, and it is the mode where nothing is missing.

## What each choice gives you

**Organization** — the product is born inside a structure: the products
register in `products:`, the shared knowledge (norms, patterns, domains)
lives in the org and is inherited by every new project, and the kit zone
belongs to the root (in the `org-repo` model, the product doesn't even
carry its own zone). Without the Organization, each workspace is an island:
the validator works, but nothing accumulates across projects.

**FULL profile** — the 93 workflow components materialized into the engine.
With the essential, the 16 BASE skills versioned in the workspace zone give
you the basic cycle; with FULL, the AI enters with the primaries by domain,
the execution/QA subagents, the knowledge routing and the maintenance
skills — the whole workflow, not a cut. It is the difference between "the
AI helps me validate" and "the AI conducts the process".

**Opencode** — the engine where the kit's capabilities run without
reduction: MCP client, subagent spawn, parallelism, worktrees. Engines with
native skills (opencode, claude-code) accept the FULL; the others receive
the essential in the workspace zone — and they work, with the declared
cut.

## What you lose without each piece

Without the Organization: no catalog, no inherited norms, no knowledge
accumulating across projects. Without FULL: the workflow runs on the BASE
subset — the cycle exists, the primaries and the delegation don't. Without
an engine with native skills: FULL doesn't apply (fail-closed — the install
filters the list); the essential in the workspace zone is the path, with
the BASE workflow.

## How to set it up (the sequence)

```bash
npm install -g golmet-cli
golmet install --engine opencode --profile completo --yes   # FULL into the engine
golmet init        # the Organization (the wizard)
golmet init        # the project, inside the org
```

From here, the tutorials' journey assumes exactly this state.
