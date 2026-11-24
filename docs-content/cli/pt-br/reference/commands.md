<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# Referência de comandos (`golmet`)

> **Como esta referência é mantida:** MANUAL, sincronizada com o help do
> cobra (a fonte é `golmet <command> --help`). A geração automática da
> registry viria por cima de um comando extra que não existe no contrato
> de 19 commands - KISS: o doc é manual, o **lint L6 vigia os comandos
> `gm-*` citados** e o teste de sincronismo do repo quebra se um comando
> do binário sumir ou nascer sem estar nesta página
> (`internal/cli/docs_sync_test.go`). Para o contrato detalhado e vivo,
> rode `golmet <command> --help`.

## Duas interfaces, um kit

O mesmo kit roda por duas superfícies, por audiência:

| Superfície | Quem usa | O que roda |
| --- | --- | --- |
| **O CLI no seu terminal** | você (o operador humano) | todos os **19 comandos** abaixo - gestão direta |
| **As 15 tools MCP** (`golmet mcp` dentro do Opencode) | os agentes de IA na sessão | as `gm_*` - a interface nativa da IA (as tools de mutação exigem `confirm=true`) |
| O CLI via shell dentro da sessão | a IA, quando nenhuma tool cobre | os comandos sem equivalente MCP (`init`, `adopt`, `uninstall`, `upgrade`, `tools`) |

Nunca misture as audiências: quando o operador roda um comando, o CLI é a
superfície; quando a IA atua, as tools MCP são - os guardas de mutação
(confirm, dry-run) são aplicados no caminho da IA.

19 commands, um binário. A tabela curta vive no
[README](../../README.pt-br.md#comandos); abaixo o contrato por comando
(flags, entradas/saídas, exit codes):

| Command | Contrato |
| --- | --- |
| `golmet validate [workspace]` | Valida o workspace contra o FORMAT v1 (H1-H10 hard, S1-S5 soft). **Contexto-aware** (§2.3/§9): container → valida a DECLARAÇÃO da org (C1); workspace-produto → a gramática integral; sem `golmet.yaml` → erro claro com os caminhos de init. Flags: `--json` (§11) · `--tolerant`/`--strict` (H4/H7) · `--fix` (recompõe o índice pós-merge). Exit 0 conforme · 1 findings hard · 2 uso/config |
| `golmet init [produto]` | Wizard interativo sem flags (FORMAT §2 - sempre confirma antes de criar; fail-closed em script); `--org` (container de org, declara `versioning: org-repo`, cria o `.gitignore` da org, registra no catálogo global) · `--into <container>` (respeita o modelo de versionamento) · `--yes` · `--plain`. Exit 0 criado/cancelado · 2 erro |
| `golmet install` | Onboarding em um comando: engine + skills `gm-*` + catálogo de MCPs + doctor (o wizard pergunta o perfil `essencial`/`completo` primeiro). Flags: `--engine <id>` (não-interativo exige) · `--profile essencial|completo` · `--mcp csv` · `--yes` · `--plain` · `--json` · `--force` · `--no-banner` |
| `golmet update` | Instala o subset BASE embarcado na zona `.golmet/` do workspace (SHA-256 por skill, DR-008 preservando customizações). Flags: `--check` (read-only). Nas raízes de org `org-repo`, acrescenta a exceção `!.golmet/skills/` ao `.gitignore` |
| `golmet status [workspace]` | Dashboard read-only dos estados das entidades (RN/PEND/CR/ADR/Feature/Task/Spec). `--json` |
| `golmet next [workspace]` | Recomenda a próxima ação (prioridades p1..p9) a partir do estado real. `--json` |
| `golmet doctor [workspace]` | Checks de saúde (S1-S5 + índice + manifest + capacidades + máquina) - contexto-aware: workspace-produto / container de org (checklist de hierarquia §2.3) / config root do engine (o estado INTEGRAL do config como corpo principal). Flags: `--engine <id>` (o check de engine-config) · `--network`/`--no-network` (o smoke do kit.jev é default com key) · `--json` |
| `golmet adopt [workspace]` | Adoção do FORMAT v1 em workspace existente: dry-run classificado primeiro, depois `--apply` determinístico preservando layouts legados. Flags: `--apply` · `--charter-status draft|confirmed` · `--json` |
| `golmet eval` | Verificador determinístico de evals: pontua fixtures (`criteria.yaml`) contra o workspace; escreve o relatório markdown por fixture em `~/.golmet/eval-reports` (retenção de 50). `--json` |
| `golmet tools` | Instalação de ferramentas nativas do kit com verificação de supply-chain (SHA-256 + attestation): `tools install codegraph` (o grafo de código - DR-016) |
| `golmet mcp` | Serve o kit como servidor MCP over stdio - as 15 tools `gm_*` (ver [tools.md](tools.pt-br.md)). Sem flags |
| `golmet index [workspace]` | Recompõe o `golmet.index.json` a partir da prosa (a prosa é canônica; o índice é cache - pós-merge/corrupção) |
| `golmet pack add <repo>` | Packs L2: `pack add` (clone + overlay) · `pack update <repo>` (sync + overlay, engine obrigatório, nunca descarta acumulação) · `pack publish <origem>` (state packs: commit + push) · `pack list`. Flags por subcomando (ex.: `--engine`, `--yes`) |
| `golmet db drift [workspace]` | A camada de banco (`gm-dba`): compara as entidades do DATA_MODEL contra o snapshot de migrations - drift determinístico |
| `golmet template <alvo>` | Emite o template do kit direto do embed (`agents` → `client-profile` → `operator-profile`). `--out <path>` grava em arquivo. Templates são artefatos de construção: vivem no kit, NUNCA se instalam no config |
| `golmet uninstall` | Remove a estrutura global do Golmet por camadas, com descoberta dinâmica do estado real (manifest + personal.json + engine). Interativo; `--only <csv> --yes` para não-interativo · `--dry-run` · `--json`. O pack é DESELECIONADO por default (o repo remoto nunca é tocado) |
| `golmet upgrade` | Self-update do binário da última release GitHub (SHA-256 verificado). `--check` read-only · rollback via `<bin>.old` · o binário sob gestão npm → orienta `npm update -g golmet-cli` |
| `golmet graph` | O motor deterministico do grafo de conhecimento (T1-T5, ADR-019): grava `graph.json` + HTML self-contained + resumo MD; seletor `--what workflow|pack|docs|all` (combinavel com `+`); `--scope` (delta docs), `--max-nodes`, `--from-json` (grafo congelado), `--json`. Strict SO no registry (exit 1); T1-T4 ausente = aviso + grafo parcial; saida integral ou nada. Exit 0 ok - 1 strict de registry - 2 uso |
| `golmet lint` | Varredura estrutural determinística L1-L14 (+L7-size) sobre o kit/config/packs/workspace - findings com severidade + remediação PT-BR. Exit 0 limpo · 2 com findings · `--json`. A remediação cita o escritor canônico responsável |

## Convenções transversais

- **Exit codes**: 0 = ok/cancelado limpo · 1 = findings bloqueantes
  (validate/lint) · 2 = erro de uso/config.
- **`--json`** nos comandos de consulta - o contrato das tools MCP usa os
  mesmos payloads.
- **Wizards interativos** compartilham o padrão de cancelamento:
  ESC/CTRL+C = cancelado limpo (exit 0, nada modificado); a mensagem de
  script/CI só fora de TTY (FORMAT §2).
