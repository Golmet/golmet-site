<p align="center">English | <a href="lint.pt-br.md">Português (Brasil)</a></p>

# The lint layers (L1-L13)

`golmet lint` is the deterministic structural sweep of the kit, the engine
config and the packs. It is read-only, never guesses, and carries the whole
state — because the agent cannot: **the lint loads everything, the agent
fixes what it points**. The cycle it enables: the lint detects → explains
with a file, a line and a PT-BR remediation → the agent corrects → the lint
confirms.

Where it runs: **CI** (the kit runs the lint against itself before any
release), **CLI** (`golmet lint`) and **MCP** (`gm_lint` — the agent session
sweeps and fixes). The maintenance skills also call it:
[gm-agent-health-monitor](https://github.com/Golmet/golmet-cli) (structural
health check), `gm-setup` (post-install validation), `gm-workflow-improver`
(post-fix gate) and `gm-pack-orchestrator` (pack structure after
publish/update).

Severity convention: **error** = breaks the contract or the render;
**warning** = quality/UX drift that does not block flow.

## The layers

| Check | Severity | One-liner |
|---|---|---|
| L1 | error | dead references: path cited in backticks/link that exists in no known root |
| L3 | warning | orphans: config files with no provenance (manifest / personal / pack / allowlist / cited) |
| L4 | error | stale content-manifest entries (the file no longer exists on disk) |
| L5 | warning | structural names outside kebab-case ASCII |
| L6 | error/warning | ghost `gm-*` components cited that are not in the registry (error in sources; warning in historical docs) |
| L7 | error | folder structure outside the declared canonical tree (+ `L7-size` warnings for oversized single aggregates) |
| L8 | warning | definitives that lost the minimal structural skeleton declared by their kit templates |
| L9 | error | stack-templates registry schema (the materialized one and the org's in-pack registries) |
| L10 | error/warning | state-pack internals: rules without a trigger header, pattern types outside the EN taxonomy, `domains/` without INDEX/KNOWLEDGE, working copy without `pack.yaml` |
| L11 | warning | broken or malformed Mermaid diagrams |
| L12 | error (BOM = warning) | encoding and broken text: non-UTF-8 bytes, U+FFFD, double-encoded accents, UTF-16/BOM |
| L13 | warning | language anchors: a PT-BR doc linking an EN destination when the PT counterpart exists on disk |
| L14 | error | front matter YAML parseable: an opening `---` whose block fails YAML parsing (the unquoted `X: Y` value pattern) |

## L1 — dead references (error)

Every path cited in `` `backticks` `` or markdown links of the swept
`*.md` files (kit sources/docs; `AGENTS.md` + `profile/` of the config)
must resolve in a known root (the file's dir, the kit root, the config
root). Pack `*.md` files are NOT swept in v0.1 — pack business docs cite
PRODUCT paths by design (a product repo's deploy.yml, for example), a
structural false positive; pack-internal refs belong to L5/L7. Known
false positives are handled with declared roots
(`profile/x` resolves the kit-canonical `coredata/rules/x`; module-store
refs and `skills/<id>` resolve against the registry).

**Example finding:** `` L1 AGENTS.md:6 — referência morta: `rules/client-profile.template.md` não existe `` →
fix: point the citation at the right path (the template is emitted by
`golmet template client-profile` — not stored in the config).

Tests: `TestL1DeadRefsAndFalsePositives`, `TestL1RuntimeViewConfig`,
`TestL1ContainerResolvesEngineConfigRoot`.

## L3 — orphans (warning)

Config files that no mechanism claims: not in the manifest, not
personal-by-design, not inside a state pack, not on the declared orphan
allowlist, not cited. The fix is a decision: move to the canonical place,
designate personal-by-design, delete, or extend the **declared orphan
allowlist** if it is a legitimate orphan.

Tests: `TestL3OrphansWithAllowlistAndCited`.

## L4 — stale manifest entries (error)

A provenance entry in `.golmet/manifest.json` whose file no longer exists
on disk. The kit removed or moved the file but the inventory kept the row —
the classic signal after a refactor or an uninstall wave.

**Example finding:** `L4 rules/packs/<pack-id>.md — entrada stale` →
fix: re-materialize (`golmet pack update`) or drop the stale entry.

Tests: `TestL4ManifestStale`.

## L5 — names outside the pattern (warning)

Structural names (config first level, pack folders, skill dirs) outside
kebab-case ASCII. Filenames with extensions are exempt; business content is
not descended into.

Tests: `TestL5NamesPTAndNonKebab`.

## L6 — ghost components (error in sources / warning in docs)

A `gm-*` mention that is not in the registry. **Error** in
`coredata/sources` (the live contract), **warning** in docs (historical
prose). The first real run caught ten misspelled component names across the
kit sources (e.g. `gm-task-spec` → `gm-taskspec`) plus broken registry
`invokes`.

Tests: `TestL6GhostsByContext`.

## L7 — canonical structure (error) + L7-size (warning)

The declared canonical trees: the config root (`agents/`, `skills/`,
`profile/`, `packs/`, `plugins/`, `.golmet/`, root settings), the state
pack (`pack.yaml` + `skills/ agents/ rules/ domains/ accumulation/` with
`accumulation/` restricted to `patterns metrics nuances`), the kit repo
(`coredata/` incl. `templates/`). Unknown dirs = findings; the fix is move
or declare an exception.

`L7-size` warns when a workspace aggregate (DATA_MODEL, DECISIONS,
ERROR_CATALOG, GLOSSARY) grows past the declared split thresholds — the
lint detects without grammar; the split plan belongs to `gm-doc`.

Tests: `TestL7CanonicalStructure`, `TestL7TemplateDepositFlag`,
`TestL7SpecAggregatesUnitaryAndBroken`, `TestL7SizeWarningsEarlyCandidates`,
`TestL7L1Container`.

## L8 — definitives vs. templates (warning)

The config's definitives (AGENTS.md, the profiles) must keep the **minimal
structural skeleton** their kit templates declare: the marker blocks, the
canonical sections. Extra content is legitimate evolution (never a
finding); only **structural loss** flags. Definitive absent (fresh machine
before setup) = silent skip; a template deposited into the config = L7
warning (templates live in the kit — M12).

Tests: `TestL8StructuralConformance`, `TestL7TemplateDepositFlag`.

## L9 — stack-templates registry schema (error)

Both registries the reader consumes (the kit-materialized
`profile/stack-templates.yaml` and the org's in-pack
`packs/*/rules/stack-templates.yaml` — pack-first, M15) must parse as YAML
with the minimal schema: `boilerplate_org` present, every template with
`detect`, `description` present when `boilerplate` is set.

Tests: `TestL9StackTemplatesSchema`, `TestL9PackRegistrySchema`.

## L10 — state-pack internals (error/warning)

Inside `packs/<id>/` state packs: `rules/*.md` without an explicit trigger
header (the `gm-rule-keeper` format: H1 + "> Gatilho: AO ...", one norm per
file), pattern folders outside the EN taxonomy
(`process|architecture|code|ui|test|data`), `domains/` without INDEX or
`domains/<domain>/` without KNOWLEDGE, and a working copy carrying `.git`
without `pack.yaml` (**error** — the pack's source of truth is gone). The
lint points; the canonical writer corrects (`gm-rule-keeper`,
`gm-pattern-extractor`, `gm-domain-research`).

Tests: `TestL10PackState` and siblings.

## L11 — Mermaid diagrams (warning)

Deterministic heuristic, no Node: valid diagram type on the first
significant line (declared list), balanced delimiters **per block** (the ER
attribute-block pattern opens `{` on one line and closes on another —
judging per line breaks valid syntax), quoted labels in pairs, arrows with
both ends, `subgraph`/`end` pairing, closed fence. Broken Mermaid fails the
render silently (the viewer shows raw code) — the lint makes it loud.

Tests: `TestL11Mermaid`.

## L12 — encoding and broken text (error; BOM = warning)

Text broken by encoding is invisible in structure and only breaks at
render: non-UTF-8 bytes (Latin-1/Windows-1252 saved raw), replacement
character U+FFFD (the content is already corrupted in the file),
double-encoded accents (the classic "Ã©/Ã£/Ã§" pairs — UTF-8 read as
Latin-1 and re-saved), UTF-16 BOM (**error**), UTF-8 BOM (**warning** —
IMP-096: no BOM). evals are excluded (fixtures may carry intentional
content).

Tests: `TestL12Encoding`.

## L13 — language anchors (warning)

A link in a `*.pt-br.md` doc pointing an EN destination **when the PT
counterpart exists on disk**. The real find: the PT README navigating into
EN docs — the link resolved in L1 but taught the wrong language. Only PT
docs are validated (an EN base linking a PT counterpart is legitimate:
badge, cross-links). The remediation swaps to the PT counterpart and warns
to check the `#section` anchor in the new language.

Tests: `TestL13Anchors`.

## L14 — front matter YAML parseable (error)

A `*.md` file whose front matter block (opening `---` on the first line,
closed by the next `---`) fails YAML parsing (`gopkg.in/yaml.v3`). The
real find: a value containing a colon-plus-space (`X: Y`) written
unquoted — the parser reads it as a nested mapping ("Nested mappings are
not allowed in compact mappings") and every YAML consumer of the doc
fails with it. Quote the whole value with double quotes. Files without a
front-matter opener skip silently; a lone `---` stays a legitimate
horizontal rule.

Tests: `TestL14FrontMatter`.

## The anti-false-positive policy

A finding that flags valid content trains people to ignore the lint. Every
heuristic follows: **ffalse-positive is worse than false-negative**. The
proof ran on L11's first day: three real false positives (per-line
delimiters vs. the ER attribute-block pattern, the erDiagram cardinality
tokens, the sequenceDiagram `alt...end` blocks) were caught on the first
sweep and turned into heuristic fixes **plus regression tests**. Declared
allowlists and per-check heuristics live in the FORMAT §9.1 and in code.

## The normative contract

The checks enforce [FORMAT §9.1](../FORMAT.pt-br.md) — the lint is the
executor, the FORMAT is the contract. Reference: [commands](commands.pt-br.md)
(`golmet lint`) and [tools](tools.pt-br.md) (`gm_lint`).
