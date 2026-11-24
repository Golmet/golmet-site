# Releases

## v1.7.4 — 24/11/2026

### 🐛 Bug Fixes

- *(ci)* Push the bump commit without mutating the remote

### ⚙️ Miscellaneous Tasks

- *(release)* V1.7.4

## v1.7.3 — 24/11/2026

### 🐛 Bug Fixes

- *(ci)* Commit the version bump into the repo before tagging

### 📚 Documentation

- *(versioning)* The repo copy now carries the released version

### 🧪 Testing

- *(cli)* Assert version sync invariants instead of the 1.0.0 placeholder

### ⚙️ Miscellaneous Tasks

- *(release)* V1.7.3

## v1.7.2 — 23/11/2026

### 🐛 Bug Fixes

- *(release)* Guard the npm version stamp against silent truncation

## v1.7.1 — 23/11/2026

### 🐛 Bug Fixes

- *(release)* Sync optionalDependencies with the tag when publishing the main npm package

### 📚 Documentation

- *(versioning)* Record the v1.0.0 lightweight tag quirk

### ⚙️ Miscellaneous Tasks

- *(version)* Resolve the last tag from HEAD ancestry instead of the global sort

## v1.7.0 — 23/11/2026

### 🚀 Features

- *(pack)* Add pack mcp status/sync for state pack MCP servers

### 🐛 Bug Fixes

- *(install)* Treat empty engine MCP list in opencode parser

## v1.6.0 — 23/11/2026

### 🚀 Features

- *(lint)* L14 front matter YAML parseable check

### 🐛 Bug Fixes

- *(coredata)* Quote gm-dba description value
- *(lint)* Kit-mode walkers recurse into packs (L11/L12/L14)
- *(eval)* Check details reflect the real outcome
- *(lint)* Kit-mode pack walkers skip evals/testdata

### 📚 Documentation

- *(format)* Fix merged-fragment corruption, L1-L14 sweep, migration skip note
- *(lint)* L1 does not sweep pack .md files - align reference with code

### 🧪 Testing

- *(eval)* Detail assertions for not_file_exists and frontmatter_valid
- *(lint)* MdFilesDeep direct unit + local threat-model note

## v1.5.0 — 21/11/2026

### 🚀 Features

- *(dev-verdicts)* Calibrated gray-zone verdicts for QA and reviewer via Jev questions library

### 📚 Documentation

- *(review)* Inline default questions - core must not point at org pack paths

### 🧪 Testing

- Regenerate goldens for QA and reviewer agents after source edits

## v1.4.0 — 21/11/2026

### 🚀 Features

- *(setup)* Compose org rules lazy index from pack rule headers

### 🐛 Bug Fixes

- *(setup)* Org-pack block goes generic - rule inventory lives in the composed lazy index

## v1.3.0 — 21/11/2026

### 🚀 Features

- *(evals)* Fixture-002 de variante/erro nas 10 skills do ciclo diario
- *(knowledge-graph)* Implementa o script deterministico da gm-knowledge-graph (IMP-008)
- *(graph)* Porta do motor do grafo de conhecimento para Go — golmet graph + gm_graph (ADR-019)
- *(graph)* Setas direcionais escalaveis com fluxo animado + linker indice_lazy p/ registries yaml
- *(graph)* Painel de vizinhos agrupado por direcao e tipo de relacao

### 🐛 Bug Fixes

- *(graph)* Painel de vizinhos com direcao relativa e voz inversa
- *(graph)* Contraste dos prefixos do painel de vizinhos

### 📚 Documentation

- Referencia do sistema de evals bilíngue + runner correto no golden-human
- Retrospectiva do lançamento v1.0.0 - v1.1.1 (scorecard IMP-048: 8.3)

### 🚜 Refactor

- *(graph)* Convencao pertence_a (componente -> container) substitui agrega

### 🎨 Styling

- *(graph)* Gofmt nos arquivos do motor do grafo

### 🧪 Testing

- *(evals)* Re-baseline do golden fixture-001 (gm-knowledge-graph) - motor Go com setas, pertence_a e painel agrupado

## v1.2.2 — 21/11/2026

### 🐛 Bug Fixes

- *(lint)* L6/L1 resolvem gm-* contra kit + org, nao so o registry do binario
