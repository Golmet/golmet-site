<p align="center">English | <a href="/docs/pt-br/getting-started/03-trabalhando-com-ia"Português (Brasil)</a></p>

# 03 — Working with the AI

Up to here, everything the kit did could have been done by hand (and it
was — that's why nobody did it). The difference starts now: the MeuApp
workspace is prepared for an AI to work inside it, conducting the
workflow. This tutorial opens **Opencode** in the workspace and runs the
first real cycle.

## Opening Opencode in the workspace

```bash
cd MinhaOrganizacao\MeuApp
opencode
```

What the AI sees when opening is not the bare workspace. The `golmet
install --engine opencode` (tutorial 00) materialized the **complete
workflow** into the engine config — and the engine, opening in the
workspace, loads:

- the **AGENTS.md** — the workflow page the AI reads first: the primaries
  by domain (who conducts requirements, who conducts docs, who conducts
  dev), the `gm-*` skills by trigger ("WHEN eliciting requirements, read
  this"), the organization's rules and the knowledge router;
- the **delegation architecture** — the AI knows `gm-req` conducts business
  discovery, that `gm-dev` coordinates implementation with executors and
  QA, that nothing edits REQUIREMENTS.md without going through the
  requirement cycle.

That is why the recommended mode is **FULL + Opencode**: in FULL, the 93
workflow components (agents, skills, profiles, templates) are in the
engine. With the essential profile, the 16 BASE skills live versioned in
the workspace's `.golmet/` zone — the workflow works on any engine, with
the base subset.

## The first requirement, with the AI

The client asked: *"the booking needs slot confirmation — the client
reserves, has 15 minutes to confirm, or the slot is released"*. João, the
dev, opens Opencode and talks:

> "The slot-confirmation requirement needs to enter MeuApp — reservation
> with a 15-minute confirmation window."

The `gm-clarify` skill steps in. It doesn't swallow the request: it
**questions** — what's the no-show policy? What happens to the payment if
the slot is released? The 15 minutes count from which mark? Each ambiguity
becomes a scored question; what the client confirms becomes a requirement,
what stays open becomes a PEND with a dated follow-up.

When the score closes, `gm-req` writes the section into `REQUIREMENTS.md`:

```markdown
## RN-001 — Booking with slot confirmation

state: confirmed

The client confirms the reservation within 15 minutes ...
```

Born `confirmed` — because it came from the product owner. When the code
implements it, the state rises to `active` **with evidence**: the file,
the line and the commit hash.

## The real cycle

From here the journey continues on its own — and that is the next
tutorial: [04 — the cycle of one feature](/docs/getting-started/04-o-ciclo-de-uma-feature)
walks a whole feature (requirement → spec → task → code → validation →
delivery) with each document showing up at the moment it is created. The
full map of who is born from whom is in
[docs/concepts/artefatos.md](/docs/concepts/artefatos).

What matters here: **the AI doesn't invent the process — it executes it**.
The skills have a contract (FORMAT §10): they know what they may write,
what needs operator confirmation, and when to degrade. The project's state
remains declared in documents humans read — the AI is the engine, not the
owner.
