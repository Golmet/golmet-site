<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a> | <a href="/docs/migration"English (pointer)</a></p>

# MIGRATION — Migração para a arquitetura open core

Guia para operadores que usavam a abordagem antiga e precisam migrar para o modelo **CORE / PACK / PROFILE** (ver `README.md` §Arquitetura open core e `PACK_SCHEMA.md`).

> **Complementos:** o *que* quebrou entre majors está em `BREAKING-CHANGES.md`; problemas operacionais em `TROUBLESHOOTING.md`. Este guia cobre o *como migrar*.

## Mapa antes → depois

| Antes (config monolítica) | Depois (open core) | Onde vive |
|---------------------------|--------------------|-----------|
| Dados do cliente no `AGENTS.md` (blocos de org, tracker, paths) | `rules/client-profile.md` (gitignored) + regra da org no pack | PROFILE / PACK |
| Regra e conteúdo da org misturados no core | `packs/<id>/` — repo privado com `pack.yaml` | PACK |
| Padrões/métricas/reversas acumulados no core ou no repo de docs | `accumulation/` do pack (patterns, metrics, reverses) | PACK |
| Skills/agents genéricos com referências de cliente | Core neutro (neutrality gate — `evals/neutrality/scan.sh`) | CORE |
| `docs/projects/<nome>/` na raiz do repo de docs | `<modulo>/<projeto>/` com subpastas IMP-011 | Repo de docs |
| Delivery IMP-040 (pasta com 2 arquivos) | `analysis/RN-NNN — <título>/` + `delivery/<grupo>/RN-NNN — <título> — Feature.md` (IMP-092/093) | Repo de docs |

Precedência de conteúdo: **PROFILE > PACK > CORE**.

## Cenário A — Config local antiga → core + pack (repo novo)

Para quem tinha o core local com conteúdo da organização misturado (blocos de cliente no `AGENTS.md`, `rules/` de org, acúmulo) e agora tem um **repo de pack** separado.

1. **Inventarie o conteúdo de org** na config local: blocos de cliente no `AGENTS.md`, arquivos em `rules/` com dado de cliente, `accumulation/`, skills específicas da org.
2. **Crie o pack** com a skill **`gm-pack-scaffold`** — gera o esqueleto a partir do `PACK_SCHEMA.md` (`pack.yaml` + regra da org + acúmulo vazio), cria o repo privado (`gh repo create`), registra no perfil (`packs:` / `pack_repos` — sob confirmação) e instala no runtime.
3. **Mova o conteúdo de org** para o repo do pack:
   - Regra da organização → `rules/packs/<id>.md` (declarado em `provides`);
   - Patterns/métricas/reversas → `accumulation/` (versionado no pack, **nunca instalado** no runtime);
   - Defaults do cliente (tracker, org GitHub, paths) → preenchidos no `rules/client-profile.md` pelo `gm-setup`.
4. **Neutralize o core local**: reverta o `AGENTS.md` para o `AGENTS.template.md` (neutro) e remova conteúdo de cliente — o neutrality gate do CI rejeita PR com dado de cliente no core.
5. **Instale**: `gm-setup` clona o pack em `packs/<id>/`, copia os paths de `provides`, grava o lockfile `.Golmet/sources.yaml` (pin de commit) e a seção gerada do `.gitignore`.
6. **Valide o contrato do installer** (`PACK_SCHEMA.md`):
   - **no-override** — path de `provides` que colide com path do core rejeita a instalação;
   - **`requires-core`** — faixa validada contra a versão local do core (`registry.yaml`) + `BREAKING-CHANGES.md`.

## Cenário B — Repos de docs no layout antigo

Para módulos documentados na estrutura anterior. Tudo é feito pela skill **`gm-restructure`** (via `@gm-governance-orchestrator`), que move arquivos, atualiza referências cruzadas e gera `docs/MIGRATION_REPORT.md` — sem tocar no conteúdo semântico.

| Modo | De → Para |
|------|-----------|
| **legado** | `docs/projects/<nome>/` → `<modulo>/<projeto>/` |
| **IMP-011** | artefatos na raiz do módulo → subpastas (`specs/`, `quality/`, `delivery/`, `support/`, `glossaries/`, `docs/`) |
| **merge** | pastas por camada (`X-API/` + `X-FE/`) → pasta de produto única (`X/`) |
| **split-delivery** | delivery IMP-040 (pasta com `Analise-Funcional` + `Analise-Tecnica`) → `analysis/RN-NNN — <título>/` + `delivery/<grupo>/RN-NNN — <título> — Feature.md` |

Regras da migração:
- Suporta **lote** (múltiplos módulos em uma passada).
- Âncoras **PEND pré-IMP-094** em features são migradas como legado (legíveis) e sinalizadas no relatório — nunca promovidas sozinhas.
- IDs `DEC-XXX` pré-migração são **legado imutável** — nunca renumerar (`CONSTITUTION.md`).

> **Sem pressa:** os executores têm fallbacks de leitura para formatos antigos (`— Tasks.md` IMP-092, pasta IMP-040, arquivo flat pré-IMP-040, `delivery/RN-*.md` IMP-034, `TASKS.md` na raiz). A migração do repo de docs pode ser gradual.

## Cenário C — Máquina nova ou nova adoção

1. Clone o core: `git clone https://github.com/<operador>/Golmet-CORE.git ~/.config/opencode`
2. Rode **`gm-setup`** (wizard idempotente) — perfil do cliente, `AGENTS.md` a partir do template neutro, instalação dos packs declarados no perfil, validação do ambiente. Adoção sem tracker/infra usa o **modo core-only** (valida só `gh`/`git`).
3. Pack existente da org → declarar em `packs:` no perfil e deixar o `gm-setup` instalar; org nova → `gm-pack-scaffold`.

## Pós-migração (rotina de atualização)

Convenção `Golmet-<repo>-<action>` (IMP-124) — o par update/publish existe por repo:

| Repo | Atualizar | Publicar |
|------|-----------|----------|
| Core (config) | **`gm-core-update`** (git pull; aborta com WIP) | **`gm-core-publish`** (commit + push de tema único; nunca `git add -A`) |
| Pack(s) | **`gm-pack-update`** (pull; valida `requires-core` e no-override; reinstala `provides`; respeita o pin do lockfile) | **`gm-pack-publish`** (commit + push + reinstalação + move o pin) |

- Pin vs faixa: a faixa em `packs: [<id>@<faixa>]` do perfil **autoriza**; o pin em `.Golmet/sources.yaml` **garante reprodutibilidade** — só move sob pedido explícito.
- Mudança breaking no core → registrada em `BREAKING-CHANGES.md` com instrução de migração; packs incompatíveis falham com mensagem apontando para lá.
- Assumir um módulo existente → **`gm-handover`**; dúvida de próximo passo → **`gm-next`**.

## Checklist de migração

- [ ] Conteúdo de org inventariado na config local (Cenário A)
- [ ] Pack criado (`gm-pack-scaffold`) e conteúdo movido (regra da org, acúmulo)
- [ ] `AGENTS.md` local neutro (a partir do `AGENTS.template.md`)
- [ ] `rules/client-profile.md` preenchido pelo `gm-setup` (gitignored)
- [ ] `pack.yaml` com `provides` sem colisão (no-override) e `requires-core` compatível
- [ ] Lockfile `.Golmet/sources.yaml` gravado; `.gitignore` com seção gerada
- [ ] Módulos de docs migrados (ou planejados) via `gm-restructure` + `MIGRATION_REPORT.md`
- [ ] Neutrality gate verde (`evals/neutrality/scan.sh`) antes de qualquer PR no core
