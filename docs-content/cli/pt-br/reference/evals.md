<p align="center"><a href="https://github.com/Golmet/golmet-cli/blob/main/README.md">English</a> | <a href="https://github.com/Golmet/golmet-cli/blob/main/README.md">Português (Brasil)</a> | <a href="/docs/reference/evals">versão base deste doc</a></p>

# O sistema de evals (golden set)

O `evals/` é o corpus de regressão do kit: toda skill carrega fixtures que
cravam seu comportamento contra cenários reais. O checador é
**determinístico em Go** (`internal/core/eval`) — o mesmo código valida
toda execução, sem juiz LLM.

## Anatomia da fixture

```
evals/gm-<skill>/fixture-N/
  input/            # o estado do workspace ANTES da skill rodar (obrigatório)
  criteria.yaml     # os checks (obrigatório) — validados pelo checador Go
  output-expected/  # o estado final golden (opcional — veja fixtures negativas)
```

A skill é invocada contra o `input/`; o checador valida o workspace
resultante contra o `criteria.yaml`. O contrato reforçado pela suíte Go
(`corpus_selfscore_test.go`): **toda fixture deve fechar self-score PASS** —
os checks valem contra o `input/` sobreposto pelo `output-expected/`.

**Fixtures negativas** (cenários de aborto/erro) omitem o `output-expected/`
de propósito e declaram `mode: manual`: os checks afirmam o que **não** pode
existir (`not_file_exists`, `not_contains`) contra o estado puro do input.

Fixture que ainda não fecha self-score carrega `.self-score-skip` **com o
motivo em uma linha** — marcador vazio falha a suíte.

## Os tipos de check

| Tipo | Afirma |
|---|---|
| `file_exists` / `not_file_exists` | artefato existe / não pode existir |
| `dir_has_files` | diretório não vazio |
| `contains` / `not_contains` | padrão presente / ausente no arquivo |
| `section_exists` | seção markdown (`## Título`) presente |
| `section_order` | seções na ordem declarada |
| `id_sequence` | IDs na sequência do regex (`allow_gaps` suportado) |
| `cross_ref` | IDs citados num arquivo rastreiam às sources declaradas |
| `line_count_range` | tamanho do arquivo entre min/max linhas |
| `table_has_columns` | tabela markdown declara as colunas esperadas |
| `no_todos` | nenhum TODO/FIXME no artefato |
| `frontmatter_valid` | front matter YAML parseia |
| `mermaid_valid` | bloco Mermaid não quebrado |
| `reference_match` | conteúdo casa com a referência declarada |

Severidade é `error` (bloqueia) ou `warning` (registra).

## Como rodar

- **Check determinístico**: `golmet eval <fixture-dir> --workspace <workspace>`
  (`--json` para saída de máquina) — roda o `criteria.yaml` contra o workspace.
- **Regressão dirigida por agent**: a skill `gm-skill-eval` / a tool `gm_eval`
  MCP invoca a skill alvo contra o `input/` e pontua o output com o mesmo
  checador, gravando um `EVAL_REPORT_*.md`.
- **CI**: a suíte Go (`go test ./...`) roda o selftest do checador mais o
  **corpus self-score** sobre a árvore `evals/` inteira — erro de autoria de
  fixture quebra o build, sem agent nenhum.

## golden-human

O `evals/golden-human/` guarda casos **mantidos por humanos**, coletados de
incidentes reais — a proteção contra circularidade (agent dando nota para o
próprio dever de casa). Agents nunca escrevem lá; veja o
[README](https://github.com/Golmet/golmet-cli/blob/main/evals/golden-human/README.md).
