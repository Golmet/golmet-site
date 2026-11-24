<p align="center"><a href="decisions.pt-br.md">Português (Brasil) — versão integral</a> | <a href="../../README.md">English README</a></p>

# DECISIONS — Platform Design Records (ADRs)

> **Difference from WORKFLOW_IMPROVEMENTS.md:** this file records **design**
> decisions (why we chose X over Y). WORKFLOW_IMPROVEMENTS.md records
> **corrections** (what was wrong and how it was fixed).
>
> The normative PT-BR version is the full record (the source of truth); this
> English translation is faithful to it.

---

## ADR-001 - Layered Architecture: Primary → Subagent → Skill

- **Date:** 2026-04-22
- **Decider:** Operator
- **Status:** Accepted
- **Context:** OpenCode supports primary agents, subagents and skills. We
  needed an architecture that allowed: (1) clear delegation of
  responsibilities, (2) granular permissions, (3) knowledge reuse,
  (4) flexible orchestration.
- **Decision:** We adopted the `Primary Agent → Subagent → Skill` hierarchy:
  - **Primary Agent** (the GOLMET triad: `gm-req`, `gm-doc`, `gm-dev`): the
    active persona of the session, broad permissions, routes to subagents.
  - **Subagent** (`@gm-intake-orchestrator`, `@gm-figma-orchestrator`, etc.):
    domain orchestrator, scoped permissions, invokes skills of its domain.
  - **Skill** (`gm-requirements`, `gm-data-model`, etc.): reference
    knowledge, executable standalone, stateless.
- **Alternatives considered:**
  - _Skills directly from the primary_: simpler, but without granular
    permissions and without separation of responsibilities.
  - _Subagents without skills_: self-contained subagents, but with
    duplicated knowledge and hard to maintain.
  - _Microservices_: overkill for the context (local config, not deployed).
- **Consequences:**
  - ✓ Granular permissions per subagent (least privilege)
  - ✓ Skill reuse across subagents (e.g. `gm-task-spec` accessed by
    `@gm-quality-orchestrator` and `@gm-azure-orchestrator`)
  - ✓ Clear separation between orchestration (subagent) and execution (skill)
  - ✗ Initial complexity (3 layers to understand)
  - ✗ Need to keep ARCHITECTURE.md in sync

---

## ADR-002 - `Golmet-` Prefix on All Components

- **Date:** 2026-04-22
- **Decider:** Operator
- **Status:** Accepted
- **Context:** OpenCode allows free naming for skills and subagents. We
  needed a naming convention that: (1) identified GOLMET components
  instantly, (2) avoided conflicts with skills from other workflows,
  (3) made searches and references easy.
- **Decision:** Every GOLMET skill and subagent uses the `Golmet-` prefix
  (e.g. `gm-requirements`, `@gm-intake-orchestrator`). Primary agents follow
  the GOLMET triad (`gm-req`, `gm-doc`, `gm-dev`). External skills may keep
  their own prefix (organization project skills).
- **Alternatives considered:**
  - _`opencode-` prefix_: too generic, does not identify the domain.
  - _No prefix_: conflicts with skills from other workflows.
  - _Domain prefixes_ (`gm-intake-`, `gm-azure-`): too many prefixes,
    unnecessary complexity.
- **Consequences:**
  - ✓ Instant identification of GOLMET components
  - ✓ No conflicts with other workflows
  - ✓ Easy searches (`grep Golmet-`)
  - ✗ Slightly longer names
  - ✗ Requires consistency (already broken once - IMP-008)

---

## ADR-003 - Stable and Immutable IDs (RN-XXX, PEND-XXX)

- **Date:** 2026-04-22
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Requirements change over time. We needed a traceability
  mechanism that: (1) allowed referencing a requirement across multiple
  documents, (2) did not break references when the requirement was renamed,
  (3) supported incremental merge.
- **Decision:** IDs are assigned once and never renumbered:
  - `RN-XXX` for business rules (e.g. `RN-001`)
  - `PEND-XXX` for clarification pending items (e.g. `PEND-001`)
  - Removed IDs get a `[removed]` tag but keep the number (IMP-008)
- **Alternatives considered:**
  - _Timestamp-based IDs_: hard to remember, not human-readable.
  - _Renumberable IDs_: break references in downstream documents.
  - _UUIDs_: overkill, hard to work with manually.
- **Consequences:**
  - ✓ Stable references across documents
  - ✓ Incremental merge works without numbering conflicts
  - ✓ Easy to remember and reference in conversations
  - ✗ Gaps in numbering (removed IDs leave "holes")
  - ✗ Need to document the `[removed]` tag for IDs with external relevance

---

## ADR-004 - Document DAG with Integrity Validation

- **Date:** 2026-04-22
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Requirements and architecture documents reference each other.
  We needed: (1) a clear dependency order, (2) detection of orphan or stale
  artifacts, (3) controlled change propagation.
- **Decision:** Each module follows a DAG (Directed Acyclic Graph):
  ```
  PROJECT_CHARTER → REQUIREMENTS → [DATA_MODEL, API_CONTRACTS, UI_SPEC, ARCHITECTURE, GLOSSARIES, ACCEPTANCE_CRITERIA] → [TEST_STRATEGY, TRACEABILITY, VALIDATION_REPORT, TASKS]
  ```
  Validation is done by `gm-validate`; propagation by
  `@gm-cr-propagation-guard`.
- **Alternatives considered:** _Independent documents_: no traceability,
  inevitable drift. _Relational database_: overkill for markdown, loses Git
  versioning. _Wikis with links_: no automatic validation, depends on human
  discipline.
- **Consequences:**
  - ✓ Full traceability (RN → downstream artifact)
  - ✓ Automatic drift detection (PROPAGATION_STATUS.md)
  - ✓ Integrity validation (VALIDATION_REPORT.md)
  - ✗ DAG complexity (7+ documents per module)
  - ✗ Need to run `gm-validate` periodically

---

## ADR-005 - Manual Self-Update (No Hook/Plugin)

- **Date:** 2026-08-14
- **Decider:** Operator
- **Status:** Accepted
- **Context:** The GOLMET config is a git repo (`<config-repo>`). We needed
  a mechanism to update it without destroying local work.
- **Decision:** Self-update is **manual and controlled** via the
  `gm-self-update` skill:
  - Checks the working tree before pull (if dirty, ABORTS)
  - Uses `git pull --ff-only` (never automatic merge)
  - Warns to restart OpenCode (config is not hot-reloaded)
- **Alternatives considered and rejected:**
  - _Hook/plugin auto-pull on session.created_: pull does not apply at
    session start (config already loaded), may silently merge/overwrite
    WIP, plugins are not versioned.
  - _Cron job_: risky to overwrite local work, implementation complexity.
  - _File watch_: OpenCode does not support hot-reload of config.
- **Consequences:**
  - ✓ Never destroys local work (working tree lock)
  - ✓ Full operator control (decides when to update)
  - ✓ Simple to implement (pure skill, no hooks)
  - ✗ Requires manual action (forgetting = stale config)
  - ✗ Requires OpenCode restart after update

---

## ADR-006 - Publishing via Git Push (No CI/CD)

- **Date:** 2026-08-18
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Improvements applied by `@gm-workflow-improver` and
  `@gm-workflow-builder` were stuck on the local machine. We needed a
  publishing mechanism.
- **Decision:** Publishing via the `gm-self-publish` skill:
  - Atomic commit per theme (Conventional Commits)
  - `pull --ff-only` before push (never force)
  - Confirmation gate (never blind commit)
  - Versioning scope: `agents/Golmet-*.md`, `skills/Golmet-*/SKILL.md`,
    `ARCHITECTURE-*.md`, `WORKFLOW_IMPROVEMENTS.md`
- **Alternatives considered and rejected:**
  - _CI/CD (Azure Pipelines)_: too complex for a local config, maintenance
    overhead.
  - _Automatic sync_: risky (may publish incomplete work).
  - _Manual (git add/commit/push)_: no safety gates, error-prone.
- **Consequences:**
  - ✓ Safe publishing with confirmation gates
  - ✓ Clean history (atomic commits)
  - ✓ Compatible with `gm-self-update` (same repo, same branch)
  - ✗ Requires manual action (same cost as update)
  - ✗ No code review (direct push to master)

---

## ADR-007 - Broad Permission for Primary Agents

- **Date:** 2026-04-22
- **Decider:** Operator
- **Status:** Accepted (with caveats)
- **Context:** OpenCode does not support permission delegation from primary
  to subagent at invocation time. Primary agents need to coordinate
  subagents with different permissions.
- **Decision:** Primary agents (the GOLMET triad: `gm-req`, `gm-doc`,
  `gm-dev`) have broad permissions (read/write/edit/bash/webfetch).
  Subagents have scoped permissions (least privilege). The primary's
  blast-radius is accepted as controlled risk.
- **Alternatives considered:**
  - _Scoped permission on the primary_: OpenCode does not support
    delegation at invocation time.
  - _Self-contained subagents_: loss of centralized orchestration.
  - _Multi-primary_: unnecessary complexity for the context.
- **Consequences:**
  - ✓ Flexible orchestration (primary coordinates any subagent)
  - ✓ Works with the current OpenCode API
  - ✗ Elevated blast-radius (primary can edit anything)
  - ✗ Trust in the primary's behavior (mitigated by conventions)

---

## ADR-008 - Self-Contained vs. Orchestrated

- **Date:** 2026-08-14
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Some subagents only need to read artifacts and produce
  output (without invoking skills). Others need to orchestrate multiple
  skills.
- **Decision:** Two kinds of subagent:
  - **Self-contained** (`@gm-next`, `@gm-progress`,
    `@gm-cr-propagation-guard`): read artifacts directly, do not invoke
    skills, are lightweight.
  - **Orchestrated** (`@gm-intake-orchestrator`, `@gm-azure-orchestrator`,
    etc.): invoke skills of their domain, have routing logic.
- **Alternatives considered:** _All orchestrated_: unnecessary overhead for
  simple subagents. _All self-contained_: loss of skill reuse.
- **Consequences:**
  - ✓ Efficiency (self-contained are fast)
  - ✓ Skill reuse (orchestrated share knowledge)
  - ✓ Flexibility (each kind for its use case)
  - ✗ Two patterns to understand
  - ✗ Need to classify correctly when creating new subagents

---

## ADR-009 - WORKFLOW_IMPROVEMENTS.md as Immutable Log

- **Date:** 2026-08-13
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Workflow improvements needed traceability (what changed, why
  it changed, when it changed).
- **Decision:** `WORKFLOW_IMPROVEMENTS.md` is an immutable log:
  - Each entry is incremental (never delete previous entries)
  - Standardized format: Date, Target, Problem, Root cause, Fix, Files,
    Status
  - Numbered entries (IMP-001, IMP-002, ...)
- **Alternatives considered:** _Traditional changelog (CHANGELOG.md)_:
  mixes features with fixes, hard to filter. _Git log_: has no "why"
  context, only "what". _Wiki_: no structure, hard to query
  programmatically.
- **Consequences:**
  - ✓ Complete and immutable history
  - ✓ Standardized format (easy to query)
  - ✓ "Why" context preserved
  - ✗ File grows indefinitely (acceptable for the current volume)
  - ✗ Requires discipline to register (not automatic)

---

## ADR-010 - Task Title Convention `[<repo>] <description>`

- **Date:** 2026-08-18
- **Decider:** Operator (based on team practice)
- **Status:** Accepted
- **Context:** Tasks needed a consistent format that: (1) identified the
  target repository, (2) was human-readable, (3) supported domain
  classification.
- **Decision:** Task title follows the pattern `[{prefix}] [<repo>]
  <description>`:
  - `[Database]` for DDL/DML
  - `[DevOps]` for pipelines/deploy
  - `{repo}` is required (e.g. `[Traceability.API]`)
  - One task = one repository/scope
- **Alternatives considered:** _Free title_: inconsistent, hard to filter.
  _Business-area prefix_: `[NF]-` is unreadable, does not identify the
  repo. _Multiple repos in the same task_: violates the granularity
  principle.
- **Consequences:**
  - ✓ Visual consistency and filtering
  - ✓ Traceability (repo identified in the title)
  - ✓ Compatible with existing team practice
  - ✗ Longer titles
  - ✗ Requires discipline (one task = one repo)

---

## ADR-011 - Review Gate: TASKS.md Before Azure

- **Date:** 2026-08-18
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Tasks were being created in Azure DevOps without prior
  review, generating duplicated and inconsistent work.
- **Decision:** Mandatory gate:
  1. `gm-task-spec` generates `TASKS.md` (reviewable markdown)
  2. Operator reviews and confirms (via `question`)
  3. `@gm-azure-orchestrator` only then creates work items in AzDO
- **Alternatives considered:** _Direct creation_: fast, but without review
  (already generated duplicates). _Automatic review_: impossible without
  human context. _Double confirmation_: unnecessary overhead.
- **Consequences:**
  - ✓ Eliminates accidental creation of duplicate tasks
  - ✓ Allows human review before writing
  - ✓ Materializes the work in auditable markdown
  - ✗ One extra step (gate)
  - ✗ Requires the module to have `TASKS.md` before creating in AzDO

---

## ADR-012 - Duplicate Detection Before Creating Tasks

- **Date:** 2026-09-03
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Even with the review gate, duplicate tasks were created when
  the operator re-ran a PBI that already had child tasks.
- **Decision:** Mandatory duplicate gate:
  1. Read PBI with `expand: "Relations"` to get existing child tasks
  2. Compare existing task titles with the ones in `TASKS.md`
  3. Exact match → skip creation (inform the operator)
  4. Approximate match → ask the operator
  5. Fail-open if MCP fails (does not block on infrastructure error)
- **Alternatives considered:** _Manual verification_: error-prone, relies on
  memory. _ID as key_: titles change, IDs are more stable but less
  readable. _No check_: accept duplicates (unacceptable).
- **Consequences:**
  - ✓ Eliminates 100% of accidental duplicates
  - ✓ Transparency (operator is informed)
  - ✓ Fail-open (does not block on infrastructure error)
  - ✗ Extra call to AzDO (expand: Relations)
  - ✗ Approximate match may generate false positives

---

## ADR-013 - Standard Audit Columns

- **Date:** 2026-09-03
- **Decider:** Operator
- **Status:** Accepted
- **Context:** New tables were being created without the standard audit
  columns, generating inconsistency with the legacy and making migration
  harder.
- **Decision:** Every new table must include the audit columns defined in
  CONSTITUTION.md (e.g. 6 columns with the `CTR_` prefix). Names always in
  UPPER CASE.
- **Alternatives considered:** _camelCase columns_ (`dataHora`,
  `createdAt`): inconsistent with the legacy, breaks migration. _No audit
  columns_: loss of traceability of who created/updated. _Trigger-based
  audit_: complex, performance overhead.
- **Consequences:**
  - ✓ Create/update traceability
  - ✓ Simplified migration (legacy uses the same pattern)
  - ✗ Long names (e.g. 6 columns with the `CTR_` prefix)
  - ✗ Requires discipline in every DDL task

---

## ADR-014 - Business Glossary 100% in Portuguese

- **Date:** 2026-08-20
- **Decider:** Operator
- **Status:** Accepted
- **Context:** The business glossary was being generated with English terms
  in parentheses, making it hard for non-technical stakeholders to
  understand.
- **Decision:** BUSINESS_GLOSSARY.md is 100% in Portuguese:
  - Titles in Portuguese (e.g. `## Vacinação`)
  - Parentheses only for acronyms/expansions in Portuguese (e.g.
    `## GTA (Guia de Trânsito Animal)`)
  - Concepts that only exist in English → translate the title and explain
    in the definition
- **Alternatives considered:** _Bilingual_ (`## Vacinação (Vaccination)`):
  confusing for non-technical stakeholders, pollutes the document. _Pure
  English_: inaccessible to business stakeholders. _Portuguese with a
  separate technical glossary_: ?, hard to maintain.
- **Consequences:**
  - ✓ Accessible to non-technical stakeholders
  - ✓ Consistent with the project's PT-BR convention
  - ✓ Acronyms preserved (GTA, PNIB, etc.)
  - ✗ Technical terms may lose precision in translation
  - ✗ Requires careful translation

---

## ADR-015 - Page Breaks in Documents

- **Date:** 2026-08-26
- **Decider:** Operator
- **Status:** Accepted
- **Context:** Documents converted to PDF appeared as running text without
  page breaks.
- **Decision:** Insert `<div style="page-break-before: always;"></div>`
  before the main sections in the factory-external templates.
- **Alternatives considered:** _Separate CSS_: depends on the PDF
  converter, not portable. _Pure Markdown_: does not support page breaks
  natively. _Converter configuration_: varies by tool, not robust.
- **Consequences:**
  - ✓ PDFs with professional layout
  - ✓ Compatible with most PDF converters
  - ✓ Does not affect content (formatting only)
  - ✗ Inline HTML in markdown (a bit "dirty")
  - ✗ May break in converters that do not support HTML

---

## ADR-016 - Variable Groups in the `<repo>-<env>` Pattern

- **Date:** 2026-08-28
- **Decider:** Operator
- **Status:** Accepted
- **Context:** CI/CD Variable Groups were being named inconsistently,
  making it hard to identify the repository and environment.
- **Decision:** Variable Groups follow the `<repo>-<env>` pattern:
  - `<name>.API-DES` (development)
  - `<name>.API-HML` (staging)
  - `<name>.API-PRO` (production)
- **Alternatives considered:** _Free name_: inconsistent, hard to filter.
  _Project prefix_: redundant (the repo already identifies the project).
  _No environment_: does not allow per-environment configuration.
- **Consequences:**
  - ✓ Consistency and easy filtering
  - ✓ Clear repo + environment identification
  - ✓ Compatible with Helm pipelines
  - ✗ Longer names
  - ✗ Requires discipline at creation

---

## ADR-017 - The GOLMET Triad of Primary Agents (gm-req, gm-doc, gm-dev)

- **Date:** 2026-09-17
- **Decider:** Operator / <org>
- **Status:** Accepted
- **Context:** The `gm-build` primary accumulated responsibilities of
  business discovery (forward) and legacy code documentation (reverse). The
  user proposed aligning each letter of the **GOLMET** acronym directly to
  a specialized Primary Agent:
  - **R** → `gm-req` (Requirements)
  - **D** → `gm-doc` (Documentation)
  - **D** → `gm-dev` (Development)
- **Decision:** We replaced `gm-build` with the GOLMET triad:
  - `gm-req`: focused on discovery with client/PO, clarification of
    ambiguities, generation of `REQUIREMENTS.md`, scope alignment and
    Change Requests.
  - `gm-doc`: focused on multi-repo code reverse engineering (IMP-013),
    isolated technical inspection via `@gm-reverse-orchestrator` with DDD
    shielding and evidence, and materialization of `specs/`.
  - `gm-dev`: focused on code implementation and green tests from approved
    tasks.
- **Alternatives considered:**
  - _Keep gm-build with sub-modes_: cognitive overload and mixing postures
    (discovery vs. archaeology).
  - _gm-retro instead of gm-doc_: less mnemonic, breaks the acronym
    symmetry.
- **Consequences:**
  - ✓ Absolute cognitive clarity for the operator (Tab between R, D and D)
  - ✓ Context isolation in `gm-doc` via `@gm-reverse-orchestrator`
  - ✓ Clear separation between business elicitation and code archaeology

---

## ADR-018 - The GOLMET Quadri: Expansion with the `gm-devops` Primary

- **Date:** 2026-10-18
- **Decider:** Operator / <org>
- **Status:** Accepted
- **Context:** ADR-017 registered the Triad (`gm-req`, `gm-doc`, `gm-dev`).
  The DevOps domain (VPS setup, deploy pipeline, troubleshooting and
  observability — IMP-101) grew without its own primary, and the
  registry/ARCHITECTURE already treated the workflow as "Quadri" while the
  README, glossary and footers said "Triad" — documentation diverging from
  the real state. The same review (IMP-106) found duplicate numbering in
  ADR-014 (Glossary → Triad); the Triad entry was renumbered to ADR-017.
- **Decision:** Formalize the **GOLMET Quadri**: `gm-req`, `gm-doc`,
  `gm-dev` and `gm-devops`. The `gm-devops` is a primary with broad
  permission in the same pattern as the original Triad, delegating to
  `@gm-devops-orchestrator`. Previous ADRs citing "Triad" remain immutable
  as historical record; from this entry on, the convention is "GOLMET
  Quadri".
- **Alternatives considered:**
  - _Keep the Triad and route DevOps through `gm-dev`_: mixes
    implementation with infrastructure and perpetuates the documentation
    divergence.
  - _A fifth primary for integrations (GitHub/Figma)_: integration domains
    are well served by orchestrator subagents.
- **Consequences:**
  - ✓ Documentation aligned to the real registry state (ACHIEVEMENT of the
    architectural analysis IMP-106)
  - ✓ Onboarding and routing between primaries now include the DevOps route
  - ✗ Historical references to the Triad require contextual reading
    (ADR-017 is the origin)
  - **Errata (2026-10-18):** the clause "broad permission in the same
    pattern as the original Triad" is imprecise for `gm-devops` — it keeps
    the IMP-103 scope (`edit/write: deny`, guided mode where the operator
    executes on the VPS; see PERMISSIONS.md, Primary agents, status
    "adjusted"). The decision to formalize the Quadri remains unchanged.

---

## ADR-019 - Knowledge Graph Engine in Go (CLI `golmet graph` + `gm_graph` tool)

- **Date:** 2026-11-20
- **Decider:** Operator (Victor Souza)
- **Status:** Accepted
- **Context:** The `gm-knowledge-graph` skill was designed around an external deterministic script (`scripts/build-knowledge-graph.mjs`) executed via Node by the agentic runtime (IMP-148, Node ≥ 18). The component was born a GHOST (IMP-008: SKILL.md documenting a script that did not exist — the skill aborted at step 2), was implemented in Node in the previous cycle and validated with a 38-check fixture with byte-for-byte parity against the session palliative (183 nodes · 398 edges). Porting the engine into the binary removes the kit's last external runtime dependency for deterministic work and aligns the command with established patterns (`validate`/`doctor`/`lint`).
- **Decision:** Port the COMPLETE engine (T1-T5 parsers, pruning, sanitation, content selector, 3 emitters) to **Go inside the binary**, with three surfaces:
  - **CLI `golmet graph`** — flags `--config-root --packs-root --projects-root --out --pack --scope --max-nodes --from-json --what --json`; same artifact contract (`graph.json`, `knowledge-graph.html`, `knowledge-graph.md`); strict ONLY on the registry (exit 1); missing T1-T4 = warning + partial graph; all-or-nothing output; no network; self-contained HTML with the template embedded in the binary.
  - **MCP tool `gm_graph`** (15th tool) — thin wrapper over the internal Go function (same pattern as `gm_validate`/`gm_doctor`); read-only on sources; **NO confirm** (only writes the 3 artifacts to the destination).
  - **Skill `gm-knowledge-graph`** — step 2 now runs `golmet graph` (or `gm_graph`); noise judgment (step 3) remains AGENTIC.
  - **Architecture principle (normative record):** *deterministic work lives in the CLI; organization knowledge lives in the PACK (read-only data, no logic); judgment lives in the RUNTIME (agentic skill).*
  - **Content selector `--what`** (tool intent: "visual graph of the Golmet ecosystem" — the Golmet structure itself, the pack, the generated docs, or all three at once):

| `what` | Stores | Content |
|---|---|---|
| `workflow` | T5 | registry (primaries, subagents, domains, skills), AGENTS.md, fundado_em |
| `pack` | T1+T2+T3 | knowledge domains (staleness), patterns, rules + lazy index |
| `docs` | T4 | product modules (RNs/PENDs, ADRs, TRACEABILITY, features, specs) — combinable with `--scope <module>` |
| `all` (default) | T1-T5 | everything (historical skill behavior) |

Combinable with `+` (e.g. `what: workflow+pack`). **Cross-store edges** (`indice_lazy` T5→T3, `fundado_em` T5→T1, `aplica_em` T2→T4) only appear when BOTH source and destination stores are selected.
- **Parity:** the `gm-knowledge-graph` 38-check fixture is the parity criterion — the Go command's `graph.json` and HTML are **byte-identical** to the reference Node extractor (except `gerado_em`, normalized; MINUTE precision for output idempotence), including per-type counts, warnings in the same order, and the HTML JSON embed. `knowledge-graph.md` diverges only in the provenance line ("Generated by golmet graph (kit deterministic engine — ADR-019)"); the fixture md baseline is frozen from Go itself.
- **Alternatives considered:**
  - _Hybrid MCP→node (tool spawns `node build-knowledge-graph.mjs`)_: **REJECTED** — contradicts the principle above (deterministic work lives in the CLI, not in an external runtime orchestrated by the MCP), keeps the Node ≥ 18 dependency (IMP-148) and the fragility of a materialized script path; the IMP-008 experience (a skill documenting a script that did not exist — ghost component) is the historical evidence that the runtime→script indirection is a silent single point of failure.
  - _Keep the .mjs as reference and Go as mirror_: two engines to maintain = guaranteed drift; the fixture with the frozen .mjs baseline already serves as the reference without duplicated code.
  - _Fully agentic skill (no engine)_: manual parsing at scale by the runtime — forbidden by the skill's own error mode (R4/IMP-148) and the root cause of IMP-008.
- **Consequences:**
  - ✓ Node ≥ 18 is no longer a requirement for THIS skill (IMP-148 remains valid for other consumers, if any)
  - ✓ 15th MCP tool (`gm_graph`) with the same trust contract as the others (structured JSON, declared degradation)
  - ✓ Byte-for-byte auditable determinism between CLI and MCP (same Go function)
  - ✓ The `files:` renderer infrastructure (previous cycle) remains as a generic capability for future skills with scripts
  - ✗ The `.mjs` is REMOVED in the same release — the parity baseline in the fixture is the record of the reference behavior
  - ✗ The port requires parity discipline on every engine evolution (the fixture eval is the gate)

---

_This file is maintained by the GOLMET Quadri (gm-req, gm-doc, gm-dev,
gm-devops) and updated when new architectural decisions are made. Each ADR
is immutable after registration - revised decisions get a new entry
referencing the previous one._
