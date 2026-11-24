<p align="center">English | <a href="/docs/pt-br/reference/commands">Português (Brasil)</a></p>

# Commands reference (`golmet`)

> **How this reference is maintained:** MANUAL, synced with the cobra help
> (the source is `golmet <command> --help`). Generating it from the registry
## Two interfaces, one kit

The same kit runs through two surfaces, by audience:

| Surface | Who uses it | What it runs |
| --- | --- | --- |
| **The CLI in your terminal** | you (the human operator) | all **19 commands** below - direct management |
| **the 15 MCP tools** (`golmet mcp` inside Opencode) | the AI agents in the session | the `gm_*` tools - the native interface of the AI (mutation tools require `confirm=true`) |
| The CLI via shell inside the session | the AI, when no tool covers it | commands without an MCP equivalent (`init`, `adopt`, `uninstall`, `upgrade`, `tools`) |

Never mix audiences: when the operator runs a command, the CLI is the surface; when the AI acts, the MCP tools are - the mutation guards (confirm, dry-run) are enforced on the AI path.

> would require an extra command outside the 19-command contract — KISS: the
> doc is manual, the **lint L6 watches the cited `gm-*` components** and the
> repo's sync-guard test breaks if a binary command appears/disappears
> without this page (`internal/cli/docs_sync_test.go`). For the detailed
> living contract, run `golmet <command> --help`.

19 commands, one binary. The short table lives in the
[README](../../README.md#commands); below, the per-command contract
(flags, inputs/outputs, exit codes):

| Command | Contract |
| --- | --- |
| `golmet validate [workspace]` | Validates the workspace against FORMAT v1 (H1–H10 hard, S1–S5 soft). **Context-aware** (§2.3/§9): container → validates the ORG DECLARATION (C1); product workspace → the full grammar; no `golmet.yaml` → a clear error with the init paths. Flags: `--json` (§11) · `--tolerant`/`--strict` (H4/H7) · `--fix` (rebuilds the index post-merge). Exit 0 conforming · 1 hard findings · 2 usage/config |
| `golmet init [produto]` | Interactive wizard with no flags (FORMAT §2 — always confirms before creating; fail-closed in scripts); `--org` (org container, declares `versioning: org-repo`, creates the org `.gitignore`, registers in the global catalog) · `--into <container>` (respects the versioning model) · `--yes` · `--plain`. Exit 0 created/cancelled · 2 error |
| `golmet install` | One-command onboarding: engine + `gm-*` skills + MCP catalog + doctor (the wizard asks for the `essencial`/`completo` profile first). Flags: `--engine <id>` (required non-interactively) · `--profile essencial|completo` · `--mcp csv` · `--yes` · `--plain` · `--json` · `--force` · `--no-banner` |
| `golmet update` | Installs the embedded BASE skill subset into the workspace `.golmet/` zone (SHA-256 per skill, DR-008 preserving customizations). Flags: `--check` (read-only). On `org-repo` org roots, adds the `!.golmet/skills/` exception to the `.gitignore` |
| `golmet status [workspace]` | Read-only dashboard of entity states (RN/PEND/CR/ADR/Feature/Task/Spec). `--json` |
| `golmet next [workspace]` | Recommends the next action (priorities p1..p9) from the real state. `--json` |
| `golmet doctor [workspace]` | Health checks (S1–S5 + index + manifest + capabilities + machine) — context-aware: product workspace / org container (the §2.3 hierarchy checklist) / engine config root (the FULL engine-config state as the main body). Flags: `--engine <id>` (the engine-config check) · `--network`/`--no-network` (the kit.jev smoke is default with a key) · `--json` |
| `golmet adopt [workspace]` | Adopts FORMAT v1 in an existing workspace: classified dry-run first, then deterministic `--apply` preserving legacy layouts. Flags: `--apply` · `--charter-status draft|confirmed` · `--json` |
| `golmet eval` | Deterministic eval checker: scores `criteria.yaml` fixtures against the workspace; writes the per-fixture markdown report into `~/.golmet/eval-reports` (50-report retention). `--json` |
| `golmet tools` | Kit-native tool installation with supply-chain verification (SHA-256 + attestation): `tools install codegraph` (the code graph — DR-016) |
| `golmet mcp` | Serves the kit as an MCP server over stdio — the 15 `gm_*` tools (see [tools.md](/docs/reference/tools)). No flags |
| `golmet index [workspace]` | Rebuilds `golmet.index.json` from the prose (the prose is canonical; the index is a cache — post-merge/corruption) |
| `golmet pack add <repo>` | L2 packs: `pack add` (clone + overlay) · `pack update <repo>` (sync + overlay, engine required, never discards accumulation) · `pack publish <origin>` (state packs: commit + push) · `pack list`. Flags per subcommand (e.g. `--engine`, `--yes`) |
| `golmet db drift [workspace]` | The database layer (`gm-dba`): compares the DATA_MODEL entities against the migrations snapshot — deterministic drift |
| `golmet template <target>` | Emits the kit template straight from the embed (`agents` · `client-profile` · `operator-profile`). `--out <path>` writes to a file. Templates are construction artifacts: they live in the kit, NEVER installed into the config |
| `golmet uninstall` | Removes the global Golmet structure layer by layer, with dynamic discovery of the real state (manifest + personal.json + engine). Interactive; `--only <csv> --yes` for non-interactive · `--dry-run` · `--json`. The pack is DESELECTED by default (the remote repo is never touched) |
| `golmet upgrade` | Self-update of the binary from the latest GitHub release (SHA-256 verified). `--check` read-only · rollback via `<bin>.old` |
| `golmet graph` | The deterministic knowledge-graph engine (T1-T5, ADR-019): writes `graph.json` + self-contained HTML + MD summary; selector `--what workflow|pack|docs|all` (combinable with `+`); `--scope` (docs delta), `--max-nodes`, `--from-json` (frozen graph), `--json`. Strict ONLY on the registry (exit 1); missing T1-T4 = warning + partial graph; all-or-nothing output. Exit 0 ok - 1 registry strict - 2 usage |
| `golmet lint` | The deterministic structural sweep L1–L10 (+L7-size) over the kit/config/packs/workspace — findings with severity + PT-BR remediation. Exit 0 clean · 2 with findings · `--json`. The remediation cites the responsible canonical writer |

## Transversal conventions

- **Exit codes**: 0 = ok/cleanly cancelled · 1 = blocking findings
  (validate/lint) · 2 = usage/config error.
- **`--json`** on the query commands — the MCP tools contract uses the same
  payloads.
- **Interactive wizards** share the cancellation pattern: ESC/CTRL+C = clean
  cancel (exit 0, nothing modified); the script/CI message only outside a
  TTY (FORMAT §2).
