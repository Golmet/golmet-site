<p align="center">English | <a href="/docs/pt-br/concepts/profile">Português (Brasil)</a></p>

# The `profile/` shelf and the norms

In the engine config (the operator's `~/.config/opencode`), there is a folder
that separates two worlds that usually get mixed: **the operation resources
the AI reads** and **the data that is only yours**. The `profile/` shelf is
the kit's answer to "where does the AI look for operation context without
me exposing personal data?".

## What lives there

Two kinds of content, different owners. The **kit-canonical resources** —
written by the kit, managed by the content manifest: the per-stack
boilerplate registry (`profile/stack-templates.yaml`, which
`gm-stack-boilerplate` uses to scaffold new projects) and the integrations
(the Context7 reference, for example — [context7.md](/docs/concepts/context7)). And the
**personal-by-design definitives**: `profile/client-profile.md` (the org,
the products, the client's preferences) and `profile/operator-profile.md`
(who you are, role, e-mail) — versioned NEVER: `personal.json` designates
what is personal and the kit never rematerializes them. The
`golmet template <client-profile>` emits the skeleton for you to fill —
templates live in the kit, the config carries only the definitives.

## The norms: the house way, with a trigger

The **norms** — how MinhaOrganizacao does deploy, how a new repo is created — do
not live in the config: they live IN-PLACE in the org's state pack
(`packs/<id>/rules/`), **one norm per file**, in the canonical format of
`gm-rule-keeper`: a title and an **explicit trigger** at the top.

```
# MinhaOrganizacao deploy

> Trigger: WHEN creating a deploy pipeline, read this file
```

The trigger is what makes the norm alive: the workflow's AGENTS.md indexes
the norms by trigger, and the AI reads them **at work time** — when it is
about to create the pipeline, the trigger fires and the norm arrives in
context. Not documentation to re-read: documentation that arrives at the
right time.

The cycle: edit the pack working copy → `golmet pack publish` (commit +
push) → the team runs `golmet pack update` and inherits. The kit never
discards local accumulation — the operator's learning is an organizational
asset (the full ecosystem in [knowledge.md](/docs/concepts/knowledge)).
