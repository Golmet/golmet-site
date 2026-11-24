<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# MCP tools reference (`gm_*`)

> **Como esta referência é mantida:** sincronizada com o registro das tools
> (`internal/mcpserve/mcpserve.go`) — o guard de sincronismo do repo quebra
> sem atualizar esta página (um tool nasce/sumo sem estar aqui = falha de
> build). Os payload contracts são os mesmos shapes que os handlers
> devolvem (o param schema é declarado no registro da tool).

## Duas interfaces, um kit

Estas 15 tools são o **caminho da IA**: dentro do Opencode (com `golmet mcp`
registrado), os agentes atuam sobre o kit **por meio dessas tools** - os
guardas (confirm, dry-run) são aplicados nesse caminho. O **caminho humano**
é o CLI no terminal
([commands.pt-br.md](commands.pt-br.md)) - as mesmas operações, desenhadas
para gestão direta.

O servidor MCP (`golmet mcp`) expõe **15 tools** `gm_*` - o mesmo kit que as
skills agentic usam, direto pelo protocolo. Regra transversal de mutação: as
tools de MUTAÇÃO (`gm_update`, `gm_pack_update`, `gm_pack_publish`,
`gm_upgrade`) exigem `confirm=true` - sem o confirm elas falham com a
mensagem explícita ("exige confirm=true; nenhuma alteração foi aplicada") e
o preview lista sem aplicar.

| Tool | Escopo | Contrato |
| --- | --- | --- |
| `gm_validate` | workspace | O payload do `golmet validate` (erros/avisos §11 + contadores + o contexto: container/workspace-produto). Parâmetros: `workspace`, `home`. Read-only |
| `gm_doctor` | workspace + engine | O checklist de saúde + a seção `engine_config` (o estado classificado do config). Parâmetros: `workspace`, `engine` (default opencode), `home`. Read-only |
| `gm_graph` | base de conhecimento (T1-T5) | O payload do `golmet graph` - grafo de conhecimento deterministico (workflow/pack/docs via `what`, combinavel com `+`). Parametros: `workspace`, `projects_root`, `scope`, `out`, `max_nodes`, `from_json`, `what`. Read-only nas fontes; grava os 3 artefatos no destino |
| `gm_lint` | kit/config/packs/workspace | A varredura L1-L14 - findings com severidade + remediação. Parâmetros: `workspace`, `engine`, `home`. Read-only (nunca confirm) |
| `gm_status` | workspace | O dashboard de estados das entidades. Parâmetro: `workspace`. Read-only |
| `gm_next` | workspace | A próxima ação recomendada (p1..p9). Parâmetro: `workspace`. Read-only |
| `gm_index` | workspace | Recompõe o `golmet.index.json`. Parâmetro: `workspace`. ESCRITA (o índice é kit-gerido) |
| `gm_eval` | skill/fixture | O eval determinístico de uma fixture (`criteria.yaml`). Parâmetros: `skill`, `fixture`, `workspace`. Read-only |
| `gm_eval_reports` | evals | Lista os relatórios de eval mais recentes (`~/.golmet/eval-reports`). Read-only |
| `gm_jev_classify` | texto | O classificador Jev (TypeSafe System One) - respostas tipadas com probabilidades calibradas. Parâmetros: `text`, `questions` (JSON). Degradável: sem key/endpoint, erro claro |
| `gm_update` | engine/config | Materializa o conteúdo do kit (essencial/completo + packs). Parâmetros: `engine`, `confirm`, `dry_run`, `full`, `force`. **Mutaçâo - exige `confirm=true`** |
| `gm_pack_update` | pack | Sync + overlay do pack (nunca descarta acumulação). Parâmetros: `repo`, `engine`, `confirm`. **Mutaçâo - exige `confirm=true`** |
| `gm_pack_list` | packs | O inventário dos packs instalados (id, kind overlay/state). Read-only |
| `gm_pack_publish` | pack | Sobe a maturidade acumulada do state pack para o repo da organização (o commit do WIP + o push — manual por design, o SEU confirm aplica). Parâmetros: `message`, `confirm`, `pack`, `home`. **Mutaçâo - exige `confirm=true`** (sem confirm: o PREVIEW da subida proposta) |
| `gm_upgrade` | binário | O self-update do binário do kit: `check=true` read-only → `confirm=true` aplica. **Mutaçâo - exige `confirm=true`** (o binário sob gestão npm → orienta `npm update -g golmet-cli`) |

## Convenções transversais

- **Read-only vs mutação**: as tools read-only nunca pedem confirm; as
  tools de MUTAÇÃO sempre (o padrão das 4 listadas).
- **Contexto-aware**: `gm_validate`/`gm_doctor` resolvem o contexto
  (container/workspace-produto/engine-config) pelo dir dado.
- **Degradação**: `gm_jev_classify` degrada com erro claro sem key/endpoint
  (nunca fallback silencioso).
