<p align="center">English | <a href="/docs/pt-br/concepts/layers">Português (Brasil)</a></p>

# The content layers

The first question from anyone adopting the kit is "where does what my AI
carries come from?" — and the answer is a scale of four layers, weakest to
strongest: **L0 embedded** (the minimal BASE inside the binary — offline),
**L1 FULL** (the 93 workflow components, embedded), **L2 packs** (the
organization overlays and the knowledge state packs) and **L3 local** (the
operator's creations). When two layers provide the same component, the
precedence is: **local > pack > full > base** — your fine-tuning wins, the
embedded loses.

## The two profiles — and the operator's choice

When the operator ran `golmet install --engine opencode` (tutorial
[00](/docs/getting-started/00-por-que-golmet)), the wizard asked for the
**profile**. `essencial` installs L0+BASE into the workspace `.golmet/`
zone — the kit becomes versioned in the repository and the team inherits by
cloning; it works on any agentic engine. `completo` materializes L1 FULL
into the engine — the 93 components (agents, skills, profiles, templates)
live in Opencode, and it is the recommended mode because nothing is
missing: the AI enters the workspace with the whole workflow.

Local customization of a managed file is detected and **preserved** — the
content manifest knows every file's provenance and SHA-256; overwriting
what the operator modified requires an explicit `--force`.

## The `.golmet/` zone changes role

The same kit folder, different semantics by context — and that is by
design: in the **product workspace**, `.golmet/` is the repo-versioned kit
(DR-008); in the **engine config**, it's kit state (the content manifest
and the personal.json); in an **org-repo Organization**, it's the gitignored
work zone (checkpoints in `meetings/`, history in `migrations/`) — with the
versioned exception `.golmet/skills/` when the org essential runs at the
root (see [organization.md](/docs/concepts/organization)).

What it means in MeuApp's practice: the product carries no zone of its own —
the zone is MinhaOrganizacao'. If the org ever moved to `produtos-repo`, each
product would gain its own (`init --into` delivers the declared model — the
detail in [docs/reference/commands.md](/docs/reference/commands)).
