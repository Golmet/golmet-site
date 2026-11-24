# GOLMET CLI — release v1.7.4

<p align="center">English | <a href="/docs/readme.pt-br">Português (Brasil)</a></p>

<p align="center">
  <a href="https://github.com/Golmet">
  </a>
</p>

<h1 align="center">golmet-cli</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/golmet-cli"><img src="https://img.shields.io/npm/v/golmet-cli.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/golmet-cli"><img src="https://img.shields.io/npm/dw/golmet-cli.svg" alt="npm downloads"></a>
  <a href="https://github.com/Golmet/golmet-site/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</p>

## The problem Golmet solves

Your requirements live in a document that nobody re-reads. The specs became a
diagram drawn at the start of the project and never updated again. The code
ships however it can, and when someone asks "why did this feature ship like
this?", the answer is "ask the analyst, they decided — I think". Three months
later, even the analyst doesn't remember.

The worst part isn't losing the requirement. It's that **nobody trusts the
documentation anymore** — it's always stale, always incomplete, always
somewhere else. So the team stops writing it, and the knowledge leaves when
the person leaves.

Golmet exists for that: to make documentation the trustworthy part of the
project again — because it is **machine-verified** against what the code
actually does, on every validation, before any merge.

## What Golmet does, in practice

A real journey, from zero to delivery. The analyst opens the company folder and
runs `golmet init`: the **Organization** is born — the `golmet.yaml` that
declares the products, the constitution, the index. Inside it he creates
the product's project, and the project is born with the right documents
already in place: the `PROJECT_CHARTER.md` (what the product is), the
`REQUIREMENTS.md` (the business rules, one per section, with state and
owner).

Not every project starts from zero. When the system already exists - in
production, with history - the journey starts with **reverse engineering**:
GOLMET freezes the source and turns it into documented truth (models,
contracts, business rules - every claim with its file, line and hash),
seeds the candidate queue and hands the human the guided reading of the
legacy. The new workflow is planned on documented truth, not on the model's
memory. See [reverse engineering](docs/concepts/reverse.md).

When the client asks for the feature "booking with slot confirmation", the
requirement enters REQUIREMENTS as a `## RN-001 — ...` section — and each
rule carries **evidence**: the file, the line and the hash of the code that
implements it. The technical spec descends into `specs/`, the task into
`delivery/`, the code ships. When anyone runs `golmet validate`, the kit
checks: does rule RN-001 point at code that exists? Does the hash match the
HEAD? Is the spec stale? What diverged shows up — and doesn't merge.

When the project ends, what remains is not a forgotten Word file: it's a
**knowledge package** — the norms of how that organization works, the
patterns its projects revealed, the researched domain foundation. The next
project starts with all of it already loaded.

**AI through the whole cycle.** Golmet is not a lonely validator: it ships
with a workflow of `gm-*` skills your AI executes - the AI elicits the
requirements (with you), the AI writes the spec, the AI writes the code
with green tests against the approved spec, the AI reviews the code
against the spec. Documentation stops being the thing nobody has time for.

## The recommended mode

> **To get the most out of Golmet: Organization + FULL profile + Opencode.**
> It is the tested path and the one this guide follows — the Organization
> gives you the structure and the shared knowledge, the FULL profile installs
> the complete workflow into your engine, and Opencode is the engine where
> the kit's capabilities run without reduction. Other engines work (with the
> essential profile, the kit lives versioned in the repo) — but it is this
> mode where nothing is missing. Details in
> [docs/recommended.md](docs/recommended.md).

## Getting started (5 minutes)

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

## The documentation

The public docs are written as a **journey** — start there:

| Doc                                                                | What                                                                                                                                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/getting-started/](docs/getting-started/)                     | **Start here.** Why Golmet exists, and the journey: the Organization, the project, working with AI, the cycle of one feature, what remains at the end |
| [docs/concepts/overview.md](docs/concepts/overview.md)             | **What GOLMET delivers** — the full map in one page: everything, layer by layer (the tutorials show the journey; this is the map)                     |
| [docs/concepts/artefatos.md](docs/concepts/artefatos.md)           | The artifact architecture: what each document is for, what feeds it, what it feeds                                                                    |
| [docs/recommended.md](docs/recommended.md)                         | The recommended mode (Organization + FULL + Opencode) — and what you lose without it                                                                  |
| [docs/concepts/](docs/concepts/)                                   | The concepts in depth: organization and versioning, content layers, profile, knowledge, self-governing                                                |
| [docs/FORMAT.md](docs/FORMAT.md)                                   | The normative spec (v1) — the contract every check enforces                                                                                           |
| [docs/reference/compatibility.md](docs/reference/compatibility.md) | The real MCP x engine compatibility matrix - verified cell by cell, locked by tests (honest "unverified" marks)                                       |
| [docs/reference/](docs/reference/)                                 | Reference: the 18 commands, the 14 MCP tools                                                                                                          |
| [docs/reference/lint.md](docs/reference/lint.md)                   | The lint layers in depth: what each check (L1-L14) validates, why it exists, its finding example and the test that locks it                           |
| [CHANGELOG.md](CHANGELOG.md)                                       | Wave by wave, with the real-world motivation                                                                                                          |
| [LICENSE](LICENSE)                                                 | MIT                                                                                                                                                   |

The public site renders this documentation tree after the
release — the repo is the source, the site is a render.

## Uninstall

`golmet uninstall` removes the global Golmet structure layer by layer, with
dynamic discovery of the real state (manifest + personal.json + engine
config). Everything is selected by default EXCEPT packs — the pack's remote
repository is never touched. Flags: `--only <csv> --yes`
(non-interactive) · `--dry-run` · `--json`.

## Development

The CLI is written in **Go 1.22+** (module `github.com/Golmet/golmet-cli`),
with [spf13/cobra](https://github.com/spf13/cobra) as the only external
dependency. **639 Go tests** (unit + integration + binary e2e) back the
current state.

```bash
go build ./...                    # build
go build -o golmet ./cmd/golmet   # local binary
go test ./...                     # tests
go vet ./... && gofmt -l .        # mandatory before committing
```

## Roadmap · Contributing · License

The milestone plan lives in [ROADMAP.md](ROADMAP.md) (F1 = this release; F2
= the docs site; F3 = the contribute flow and workspace migration).
Contributing: [CONTRIBUTING.md](CONTRIBUTING.md) — table-driven tests and
`gofmt` are mandatory. License [MIT](LICENSE).
