<p align="center">English | <a href="evals.pt-br.md">Português (Brasil)</a></p>

# The eval system (golden set)

`evals/` is the kit's regression corpus: every skill carries fixtures that
pin its behavior against real scenarios. The checker is **deterministic Go**
(`internal/core/eval`) — the same code validates every run, no LLM judge.

## Fixture anatomy

```
evals/gm-<skill>/fixture-N/
  input/            # the workspace state BEFORE the skill runs (required)
  criteria.yaml     # the checks (required) — validated by the Go checker
  output-expected/  # the golden final state (optional — see negative fixtures)
```

The skill is invoked against `input/`; the checker validates the resulting
workspace against `criteria.yaml`. The contract enforced by the Go suite
(`corpus_selfscore_test.go`): **every fixture must self-score PASS** — the
checks must hold against `input/` overlaid with `output-expected/`.

**Negative fixtures** (abort/error scenarios) omit `output-expected/` on
purpose and declare `mode: manual`: the checks assert what must **not**
exist (`not_file_exists`, `not_contains`) against the bare input state.

A fixture that cannot self-score yet carries `.self-score-skip` **with a
one-line reason** — an empty marker fails the suite.

## The check types

| Type | Asserts |
|---|---|
| `file_exists` / `not_file_exists` | artifact exists / must not exist |
| `dir_has_files` | directory is non-empty |
| `contains` / `not_contains` | pattern present / absent in a file |
| `section_exists` | markdown section (`## Title`) present |
| `section_order` | sections appear in the declared order |
| `id_sequence` | IDs follow the regex sequence (`allow_gaps` supported) |
| `cross_ref` | IDs cited in a file trace back to declared sources |
| `line_count_range` | file size within min/max lines |
| `table_has_columns` | markdown table declares the expected columns |
| `no_todos` | no TODO/FIXME left in the artifact |
| `frontmatter_valid` | YAML front matter parses |
| `mermaid_valid` | Mermaid block is not broken |
| `reference_match` | content matches the declared reference |

Severity is `error` (blocks) or `warning` (records).

## How to run

- **Deterministic check**: `golmet eval <fixture-dir> --workspace <workspace>`
  (`--json` for machine output) — runs `criteria.yaml` against the workspace.
- **Agent-driven regression**: the `gm-skill-eval` skill / `gm_eval` MCP tool
  invokes the target skill against `input/` and scores the output with the
  same checker, writing an `EVAL_REPORT_*.md`.
- **CI**: the Go suite (`go test ./...`) runs the checker's selftest plus the
  **corpus self-score** over the whole `evals/` tree — fixture authoring
  mistakes fail the build, no agent needed.

## golden-human

`evals/golden-human/` holds **human-maintained** cases collected from real
incidents — the protection against circularity (agents grading their own
homework). Agents never write there; see its
[README](../golden-human/README.md).
