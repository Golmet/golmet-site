# Getting started (5 minutes)

```bash
# install (npm — the primary channel; the launcher dispatches your
# platform's native binary)
npm install -g golmet-cli

# onboard: engine + skills + MCP catalog + doctor, one command
golmet install --engine opencode

# initialize (the wizard asks what to create)
golmet init

# the first commands, in order
golmet validate   # the workspace against FORMAT v1 — exit ≠ 0 blocks CI
golmet lint       # the deterministic structural sweep (L1-L14)
golmet doctor     # environment health (S1–S5, machine checks)
golmet status     # the entity-state dashboard
```

> Updating by channel: `golmet upgrade` (self-update) updates **Go/binary**
> installations; via npm, update with `npm update -g golmet-cli`.
