<p align="center"><a href="/docs/format">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# FORMAT v1 — Especificação Normativa do Workspace GOLMET

> **Versão:** 1 (draft F1) · **Consumidores:** kit GOLMET (valida) · engines agênticos (executam transições) · ingestores externos futuros.
> Este documento é **o contrato** que terceiros implementam. Vive no repo público via snapshot.

**Convenção de requisitos** (RFC 2119 adaptado):
- **DEVE / DEVE-NÃO** — violação = erro **hard** (`golmet validate` exit ≠ 0, bloqueia CI).
- **AVISO** — violação reportada pelo `golmet doctor`, **não bloqueia**.
- **PODE** — opcional, sem verificação.

---

## 1. Escopo (D1 — verdade declarada vs. inferida)

O FORMAT governa apenas o **estado normativo** do produto: o que foi decidido e formalizado em documento. Estado de **implementação** é inferido por análise de código — nunca afirmado pelo formato. O kit detecta **evidência stale** (hash ≠ HEAD atual); nunca declara "não implementada".

## 2. Layout do workspace

```
<Produto>/                          # workspace (raiz versionada pelo usuário)
├── golmet.yaml                     # manifesto — DEVE existir
├── golmet.index.json               # Índice de Estados — ESCRITO SÓ PELO KIT (§8)
├── .golmet/                        # ZONA DO KIT — vendored (DR-008: update reescreve preservando modificados)
│   ├── skills/gm-*/SKILL.md        #   subset BASE embarcado
│   └── manifest.json               #   VERSION + SHA-256 por skill
├── PROJECT_CHARTER.md              # entidade Charter
├── REQUIREMENTS.md                 # entidades RN + PEND
├── CHANGE_REQUESTS.md              # entidade CR
├── DECISIONS.md                    # entidade ADR
├── analysis/<RN-NNN — <título>>/   # entidade Spec (funcional + técnica)
│   ├── RN-NNN — Analise-Funcional.md
│   └── RN-NNN — Analise-Tecnica.md
├── delivery/<grupo>/RN-NNN — <título> — Feature.md   # Feature + Tasks
├── reverse/CANDIDATES.md           # entidade Candidate (opcional)
│   └── guide/                        # camada humana do legado (gm-legacy-guide): OVERVIEW.md,
│                                   #   IMPACT_MAP.md, GUIDES/<domínio>.md, FORMS/<domínio>.md
│                                   #   (+ LEGACY_CONTEXT.md) — júri no topo, leitura em guia/
└── specs/                          # downstream técnico (DATA_MODEL, API_CONTRACTS, UI_SPEC…)
                                    #   agregado unitário (specs/DATA_MODEL.md) OU quebrado
                                    #   por micro-contexto (specs/data_model/ + INDEX.md — §7.7.1)
```

O `golmet init` cria esse layout **nunca silenciosamente** - pergunta o que
inicializar, confirma antes de criar e, em scripts, exige flags explicitos
(§2.4).
### 2.1 Camadas de conteúdo do GOLMET (DR-021)

O conteúdo instalado pelo kit segue quatro camadas, da mais fraca para a mais
forte: **L0 embedded** (BASE mínima no binário), **L1 FULL** (93 componentes
canônicos embarcados — o kit é o escritor único), **L2 packs** (camadas
de organização/comunidade) e **L3 local** (criações e customizações do
operador). A precedência é `local > pack > full > base`.

- `golmet install --full` materializa L1 no config do engine; o kit é o
  escritor único dos artefatos renderizados.
- O manifest registra `layer`, origem e SHA-256 por arquivo; manifests
  anteriores sem esses campos continuam válidos.
- `golmet update --full --engine <id>` aplica overlay com detecção 3-way:
  arquivo local divergente do último SHA é preservado e reportado como
  conflito; nunca é sobrescrito silenciosamente. `--force` é a exceção
  explícita para customizações locais, sem sobrescrever arquivos geridos por
  packs.
- **Evolução (M32):** o mecanismo de core externo (DR-021 — o aceite
  `--core` de fonte Git/local pelo CLI e pelas tools MCP) foi
  **supersedido pelo modelo de packs**: a variante de conteúdo é o **pack
  L2 montado sobre o FULL embarcado** (a decisão data da extinção do core
  repo — o termo "core" passou a designar só o embutido). O FULL embarcado
  é o único caminho L1.

> **NOTA (perfis do CLI):** os perfis do `golmet install` são `essencial`
> (L0+BASE na zona `.golmet/` do workspace — kit do repositório, versionado
> com o repo, qualquer engine) e `completo` (L1 FULL no engine com skills
> nativas — hoje só opencode e claude-code, critério derive via `SkillsDir`;
> engines sem skills nativas falham fail-closed nos pontos de entrada). Os
> nomes de **CAMADA** L0–L3 continuam os do DR-021 — perfil é contrato de
> experiência, camada é procedência de conteúdo; `base`/`full` seguem
> aceitos como aliases internos das flags.

- **Grupo de delivery** = subpasta livre (`2026-10`, `core`, …) — o kit não interpreta o nome.
- **Zona do kit (`.golmet/`)**: skills BASE vendored + manifest (DR-008) — os adapters do engine escritos pelo `init` (`.opencode/`, `.mcp.json`, `.cursor/`) apontam para cá; é o que torna o workspace multi-engine sem config global.
- **Variante legada tolerada no `golmet adopt`:** `delivery/<grupo>/<RN-NNN — <título>>/RN-NNN — <título> — Feature.md` (Feature dentro de pasta própria). O `adopt` não move arquivos; o `validate` aceita ambos e recomenda a normalização.
- **Container de organização** (opcional): raiz com `golmet.yaml` (`container: true`), `CONSTITUTION.md`, `INDEX.md` (gerado pelo kit) e workspaces como subpastas — estrutura canônica no §2.3.

### 2.2 Registry de stack-templates (kit-canônico — o kit sabe COMO, a org define O QUÊ)

O registry de boilerplates por stack é conteúdo KIT-CANÔNICO (asset do kit,
organização-neutra — IMP-105): a fonte vive em `coredata/rules/stack-templates.yaml`
e o install materializa em `<config>/profile/stack-templates.yaml` (camada
core). O kit sabe COMO bootstrapar (mecânica de clone, rename, env,
`post_setup_script`); a organização define O QUÊ via `boilerplate_org` do
`profile/client-profile.md` (IMP-103) — o campo `boilerplate` é RELATIVO à
org e os boilerplates em si vivem nos REPOS da organização: o kit nunca os
embute.

```yaml
boilerplate_org: <do client-profile — campo boilerplate_org (IMP-105)>  # placeholder <...> aceito
templates:
  <stack>:                # ex.: .NET, Angular, Rust — id usado nos playbooks e no detector
    boilerplate: <boilerplate_org>/<repo> | null   # null = stack sem boilerplate criado na org ainda
    detect: [<glob>, …]   # padrões de arquivo para detectar a stack
    description: …        # exigido quando boilerplate é não-null
    ref: <tag|branch>     # OPCIONAL — determinismo: clona um estado fixo (`git clone --branch <ref> --depth 1`)
                          #   em vez de HEAD/main, que pode mudar e quebrar o pós-clone; ausente = HEAD/main
    post_setup_script: <path rel. ao boilerplate>  # OPCIONAL — script que o PRÓPRIO boilerplate traz
                          #   (ex.: scripts/setup.ps1); presente → execução determinística pós-clone
                          #   (shell pela extensão: .ps1 → powershell, .sh → bash; falha = erro claro)
                          #   e `post_setup` (prosa) vira checklist de VERIFICAÇÃO; ausente → prosa guiada
    pre_setup: … | null   # prosa — o que fazer antes de clonar
    post_setup: … | null  # prosa guiada (sem script) ou checklist de verificação (com script)
    base_image / db_image / compose_ports / conventions: …   # metadados da stack
```

Edição local do arquivo materializado `profile/stack-templates.yaml` =
customização detectada (o arquivo é gerido pelo manifest de conteúdo; o
install FULL rematerializa o canônico por cima).

**Registry da org IN-PLACE no pack (pack-first — M15):** o registry
PREENCHIDO da organização (boilerplates reais + `ref`s) mora no state pack
da org: `packs/<id>/rules/stack-templates.yaml` (convenção T3 da prateleira:
config `profile/*` · pack `packs/<id>/rules/*`) — aí a equipe herda os
boilerplates da org via `golmet pack add`/`pack update`, sem customização
local silenciosa. O `gm-stack-boilerplate` carrega PACK-FIRST com fallback:
registry do pack existente SOBREPOE o do kit por stack (mesma chave = o pack
manda; stacks só no kit = mantidas); múltiplos packs com registry → `ask`;
ausente → fallback para o canônico do kit em `profile/stack-templates.yaml`.

O lint valida o schema mínimo dos DOIS registries com a mesma regra
(check **L9** — §9.1): YAML parseável, `boilerplate_org` presente, cada
template com `detect` não-vazio e chave `boilerplate` presente (null aceito),
`description` presente quando `boilerplate` é não-null; arquivo ausente =
skip silencioso (o install materializa o do kit; pack sem registry é estado
legítimo).

**Release de boilerplate (ciclo da org, 4 passos):** (1) tagueie o
boilerplate (ex.: `v0.1.1` no repo `Boilerplate.*`) → (2) atualize o `ref` no
`rules/stack-templates.yaml` do pack → (3) commit + `golmet pack publish` →
(4) equipe: `golmet pack update`.

### 2.3 Container de organização — estrutura canônica e regra de scoping

A raiz de um container (`golmet.yaml` com `container: true`) NÃO é um
workspace-produto: não roda o pipeline de RNs (sem índice/charter/scan de
entidades — o doctor roda o checklist de hierarquia; o lint valida L7/L1
do container). Estrutura canônica da raiz:

```
<Container>/
├── golmet.yaml            # format: 1 · container: true · versioning: org-repo | produtos-repo · products: [<Produto>, …]
├── CONSTITUTION.md        # princípios da organização
├── INDEX.md               # navegação do container (IMP-012) — índice dos produtos
├── .gitignore             # a ORG (M29): .golmet/* (zona de trabalho) + SO/editor
├── .golmet/               # ZONA DE TRABALHO do kit na org — GITIGNORED (M19):
│   ├── meetings/          #   checkpoints transversais da org
│   ├── migrations/        #   histórico de processo da org (pilotos, auditorias, planos)
│   └── skills/            #   OPCIONAL (org-repo): a zona de KIT da org — o essencial org
│                          #   instala as skills BASE aqui e ganha a exceção !.golmet/skills/
│                          #   no .gitignore (a equipe da org herda tudo ao clonar)
├── <Produto>/…            # workspaces filhos — o layout §2 varia POR MODELO (abaixo)
└── .git/                  # meta (ocultos/ferramentais ficam fora do contrato)
```

**Os 2 modelos de versionamento de organização (`versioning:` no
golmet.yaml do container — M29):**

- **`org-repo`** (a realidade de orgs que versionam tudo num repo único —
  a org é o repo Git e os produtos são pastas dele): a ORGANIZAÇÃO é o
  repo — o `.gitignore` é da
  raiz da org (o `init --org` o cria: `.golmet/*` + SO/editor), a zona do
  kit é da ORG (opcional — o `golmet update` essencial na raiz instala
  `.golmet/skills/` e ganha a EXCEÇÃO `!.golmet/skills/` no gitignore:
  `.golmet/*` ignora o CONTEÚDO para a negação funcionar; sem update, a
  org fica sem zona de kit) e o **workspace-produto nasce SEM `.golmet/`
  própria** (golmet.yaml + charter + entidades + reverse/ + specs/ +
  golmet.index.json — o versionamento da org já cobre; `.gitignore`
  próprio do produto NÃO é criado).
- **`produtos-repo`** (o modelo DR-008 clássico — o default retroativo
  dos containers sem o campo): cada produto é repo próprio — a
  `.golmet/` de cada produto é o kit do repo DELE (versionada, a equipe
  do produto herda) e o `.gitignore` é de cada produto.

O `init --org` declara `versioning: org-repo` (o default do init --org —
o caso de orgs assim) e é idempotente (golmet.yaml/.gitignore existentes
nunca são sobrescritos). O `init --into` RESPEITA o modelo declarado e
reporta ("modelo de versionamento da organização: org-repo").

**A Organização `org-repo` é o repositório de versionamento: os produtos
versionam dentro do repo da org.** O init cria a estrutura e o
`.gitignore` (a zona de trabalho `.golmet/*` protegida); o `git init` e os
commits são **operação Git do operador** — o kit nunca roda git por conta
própria (a saída do `init --org` orienta o passo; a política de
versionamento é do CONSTITUTION de cada container).

**Semântica contextual da `.golmet/`** — a mesma pasta do kit em qualquer
contexto, com papéis distintos (M19): no **workspace-produto** é
VERSIONADA (DR-008 — o kit do repositório, vendored); no **CONFIG do
engine** é ESTADO do kit (manifest, personal.json); no **CONTAINER da
organização** é a zona de TRABALHO não-versionada (gitignored):
checkpoints (`meetings/`) e histórico de processo (`migrations/`) são
TRABALHO do kit, não conteúdo da organização.

- **`products:`** lista os workspaces filhos declarados — declarado sem
  dir no disco = error (stale); dir de produto na raiz fora da lista =
  warning (`golmet init <produto> --into <container>` declara e scaffalda).
- **Regra de scoping (M19):** *docs de produto → no produto · docs do
  projeto kit → no repo do kit · checkpoints e históricos → `.golmet/`
  (zona de trabalho, gitignored) · estratégia → privado da org.*
  Assuntos transversais (sem workspace) gravam na zona de trabalho
  (`.golmet/meetings/`, `.golmet/migrations/`) — nunca na raiz.
- **Válvula de escape (M19+):** *arquivo criado que não encaixa em
  nenhuma estrutura canônica → `.golmet/` do container (zona de
  trabalho, temporária). Ele nunca nasce solto na raiz — nasce na zona e
  é promovido por decisão do operador, ou morre ignorado pelo Git
  (`.golmet/` é gitignored).* **Promoção:** temporário que ganhou função
  → promovido à estrutura canônica pelo escritor canônico correspondente
  (`gm-datamodel` para specs, `gm-rule-keeper` para rules, `gm-doc` para
  documentação), com decisão do operador. O roteador de conhecimento
  (`gm-knowledge-route`, pergunta 5) é a porta de entrada da válvula; o
  `gm-agent-health-monitor` sugere promoção quando um temporário ganha
  sinais de função.
- **`meetings/`/`migrations/` na raiz do container = warning** (M19 —
  saíram da raiz canônica; confundiam com a camada de migração de dados
  de produto): mova para `.golmet/meetings/` / `.golmet/migrations/`.
- **`docs/` na raiz do container = warning** (não-canônico desde M18):
  "docs de produto vão no produto; docs do kit vão no repo do kit;
  históricos em `.golmet/migrations/`".
- **Artefato org-level solto na raiz** (`*.md` fora do canônico, ex.:
  auditorias/relatórios avulsos) = warning — mova para `.golmet/` (zona
  de trabalho do kit) ou declare allowlist. `CONSTITUTION.md`/`INDEX.md`
  ausentes = warning (o stub vem do `golmet init --org` — idempotente).
- **Dir desconhecido na raiz** = warning (mesma política do config §9.1).

### 2.4 Iniciar um workspace — `golmet init`

O `golmet init` cria um workspace **nunca silenciosamente**: pergunta o que
inicializar e **confirma antes de criar** (nome e destino exibidos; nada é
escrito antes da confirmação final).

**O que pode inicializar (3 opções):**

1. **Organização** (termo do usuário; internamente `golmet.yaml` com
   `container: true` — §2.3).
2. **Workspace-produto dentro de uma Organização existente.**
3. **Workspace-produto raiz livre.**

**Wizard.** Visual com setas quando TTY (`↑/↓ move · enter confirma · esc
cancela`; itens com detail curto ao lado e a descrição contextual do item
ativo embaixo do frame — o mesmo padrão do install); numerado como fallback
(`--plain` ou terminal sem VT). Campos de texto e confirmação final são
linha-a-linha. **Sem jargão de implementação no menu** — `golmet.yaml`/
`container: true`/`CONSTITUTION.md` são consequências da escolha, exibidas
no resumo de confirmação.

**Scripts e CI** exigem flags explícitos (`--org` ou `--into <container>`)
com `--yes`; sem TTY e sem flags → fail-closed com o comando a rodar
(exit 2, nada escrito).

**Guardas:**

- Detecção de Organização existente: o diretório **pai** do cwd, quando é
  container, vira a sugestão do wizard — o disco **não** é globado (o
  operador aponta caminhos explícitos).
- **O init nunca cria na raiz do home** — `~/.golmet/` é a zona global do
  kit (o caso real que motivou: um init bare no HOME criou um workspace
  misturado com a instalação global — os 333 MB do codegraph quase apagados
  junto; subpastas do home são legítimas).

### 2.5 Catálogo global de organizações

`~/.golmet/organizations.json` — a zona global do kit (junto de `skills/`
e `tools/`) — lista as organizações que o kit criou ou adotou:
`{organizations: [{name, path, created}]}`.

- **Fonte da verdade**: o `golmet.yaml` do container (estrutura + products).
  O catálogo serve ao wizard. O kit nunca cria organização sem registrar;
  organizações fora do kit entram no catálogo **por adoção** (`golmet init
  --org` sobre diretório existente — reporta "(adoção)", idempotência do
  scaffold intacta).
- **Unicidade**: mesmo nome + mesmo path = idempotente; mesmo nome + path
  diferente = erro claro **antes** de criar ("use outro nome ou remova a
  entrada").
- **Privacidade do prompt (M24)**: o exemplo do caminho manual é placeholder
  genérico (`C:\Projetos\MinhaOrganizacao`) — **nunca** um path do catálogo
  (não expõe username/estrutura de pastas do usuário). O catálogo alimenta
  apenas a lista de seleção e o aviso de paths mortos, onde o path é
  funcional.
- O wizard da opção "dentro de uma Organização" lista as organizações com o
  path **vivo** (path morto = pulado com aviso discreto) e "Outra — caminho
  manual" por último; catálogo vazio → direto ao caminho manual com aviso de
  criação. O caminho manual **valida com re-pergunta**: pasta inexistente →
  "verifique o caminho"; sem `golmet.yaml` → "não é uma Organização
  declarada — rode `golmet init --org` nela"; `golmet.yaml` sem
  `container: true` → "é um workspace-produto, não uma Organização". `esc`
  cancela o wizard inteiro.

### 2.6 Documentação de produto — fora da DAG

A documentação é **output pós-release, não requisito**:

- A doc pública do **kit** vive no repo do kit (README rico +
  `docs/concepts/`, `docs/getting-started/`, `docs/reference/` — o site
  público renderiza depois; o repo é a fonte).
- A doc de **produto** pós-release vive no produto (`docs/howto/` — o
  `gm-howto` roda por design quando uma feature é marcada done; modo de
  erro continue — não bloqueia).
- A DAG/`validate` **não varejam documentação**: o que é requisito de
  verdade entra como RN normal (a doc que DEVE existir é definida em
  requisito); a doc não gera findings do validate.
- O lint do kit vigia a **doc do kit** (L1 refs mortas; L6 `gm-*` citados
  que não existem no registry). A referência pública
  (`docs/reference/commands` + `tools`) é sincronizada com o registry e
  vigiada pelo L6 + teste de sincronismo.

### 2.7 Convenção bilíngue da doc pública

O idioma base é **inglês** (o arquivo sem sufixo — o padrão internacional,
consistente com o `README.md` EN); a tradução PT-BR usa o sufixo
**`.pt-br.md`**. Cada doc público carrega o **badge de alternância no topo**
(`English | Português (Brasil)`) com os links cruzados; o conteúdo PT é
PT-BR natural (não tradução de robô). O FORMAT e o
`docs/ARQUITETURA_GOLMET_V2.md` são specs técnicas integrais em PT — a
tradução EN integral é **onda própria** (a escala da spec; o
`docs/reference/format.md` aponta o mapa de seções EN enquanto não existe).
Cross-links internos linkam o **mesmo idioma** (o doc PT linka pares
`.pt-br.md`; o EN linka os bases). O sync da árvore é vigiado por teste
(`internal/cli/docs_sync_test.go` — par PT↔EN + badges).

### 2.8 UX dos wizards do CLI (padrão único — init, install, uninstall)

**Confirm-frame (M28).** O frame `?` fica **isolado embaixo do resumo**
(linha em branco entre eles — nunca colado) e **re-renderiza a cada
re-pergunta**. Comportamento por comando:

| Comando | ENTER | `n` | `s` | esc/ctrl-c |
|---|---|---|---|---|
| **init** | confirma e cria (default) | voltam a editar (M27) | confirma como alias | cancelam tudo |
| **install** | confirma | cancelam | — | cancelam |
| **uninstall** | cancela (destrutivo) | cancelam | confirma | cancelam |

**Cancelamento único (M24/25/26).** No modo **RAW** (TTY+VT — o wizard do
init inteiro é raw: menus e campos), **esc de teclado e CTRL+C cancelam em
qualquer passo** (o esc nunca vaza como caractere no input). No fallback
**COOKED** (sem VT / `--plain`): o cancelamento é **CTRL+C** (a leitura
retorna EOF = cancelado limpo) **ou** a linha literal `esc` (o esc de
teclado não é entregável em cooked no console do Windows). Cancelamento
limpo = *"cancelado — nada foi criado | aplicado | removido"*, exit 0;
EOF verdadeiro fora de TTY = a mensagem de script com o comando a rodar.
Cancelar em qualquer passo = **nada modificado** (os wizards só criam após
a confirmação final). O padrão vive em helpers únicos (`readWizardLine`
cooked + `rawEditLine` raw — fonte única dos wizards).
## 3. `golmet.yaml`

```yaml
format: 1                # DEVE — versão do FORMAT suportada
container: false         # true na raiz de container de organização
versioning: produtos-repo # só quando container: true — org-repo | produtos-repo (§2.3/M29; ausente = produtos-repo)
products: [MeuApp]        # só quando container: true
packs: []                # [{id, repo, pin}] — overlays da organização (§Pack)
```

### 3.1 Contrato de pack (L2) — arquétipos overlay e state

Um pack compartilhável é um repositório Git com `pack.yaml` na raiz. O campo
`kind` escolhe o arquétipo (default: `overlay` — omitir o campo mantém o
comportamento original):

```yaml
id: community-accessibility
version: 1.0.0
name: Helpers de acessibilidade
kind: overlay            # opcional — overlay é o default
requires-core: ">=0.1"
no-override: true
provides:
  - skills/gm-a11y/SKILL.md
  - agents/gm-a11y-reviewer.md
```

| Semântica | `overlay` (padrão) | `state` |
|---|---|---|
| Conteúdo | arquivos declarados em `provides` | o próprio working copy Git (tudo exceto `pack.yaml`) |
| Cópia local | cache somente-leitura em `~/.golmet/packs/<slug>` | working copy bidirecional em `<config>/packs/<id>` (clone completo) |
| `provides` | obrigatório, restrito a `agents/` e `skills/` | **proibido** (erro — em state o conteúdo é o clone) |
| Materialização | overlay 3-way de `provides` no config do engine | overlay 3-way de `skills/` e `agents/` do working copy (posse do pack substitui o render do core para o mesmo caminho) — nada mais é copiado para o config |
| `knowledge/`, `accumulation/` e `rules/` | - | **não materializadas - lidas IN-PLACE do working copy**; os leitores (gm-domain-research, pattern library, lazy index) apontam para `packs/<id>/...` (ex.: norma da org em `packs/<id>/rules/<assunto>.md` — **uma norma por arquivo, cada uma com gatilho de leitura próprio** no lazy index) |
| Sync (`pack update`) | `pull --ff-only` no cache (cache sujo = erro) | commit do WIP local (`"sync: acumulação local <UTC>"` — o dado nunca se perde) + `fetch` + `rebase origin/<branch>`; conflito = FALHA com remediação (`git rebase --continue/--abort` e rode de novo) |
| Push | — | manual por design: `golmet pack publish <fonte>` (commit do WIP `"publish: <mensagem>"` + `push origin <branch>`) |
| Working copy pré-existente | n/a | **adotado** (`pack add`/`pack update` com `.git` e `origin` igual à fonte — nunca reclone nem sobrescreve; origem divergente = erro claro) |
| Doctor | cache/manifest do config | arquivos do working copy são seguros (versionados no repo do pack); só mudanças não-commitadas contam como risco |

`provides` só pode apontar para `agents/` ou `skills/` dentro do pack; path
	traversal é rejeitado. `golmet pack add <source> --engine <id>` sincroniza o
	repo, valida o contrato e aplica o overlay; `golmet pack update <source>
--engine <id>` repete a sincronização (o `--engine` é obrigatório nos dois).
Arquivos locais divergentes são
preservados e reportados; `no-override: true` impede colisões mesmo quando o
arquivo anterior foi instalado por outra camada. O pack é fixado pelo SHA
resolvido no manifest de conteúdo.

`requires-core` aceita apenas o formato `>=X.Y` (ex.: `">=0.3"`) — ranges
(ex.: `">=X <Y"`) e outros operadores são rejeitados com erro citando o
formato aceito, nos dois arquétipos. O pack central da organização (remoto)
distribui o arquétipo `state` para todos os colaboradores; forks ramificam a
partir dele. **A subida é `publish` — manual por design:** o commit do WIP do
working copy (`"publish: <mensagem>"`) + `git push origin <branch>` — o kit
nunca publica por conta própria (o sync do `pack update` nunca sobe). O
caminho da IA: a tool MCP **`gm_pack_publish`** (o mesmo core do
`golmet pack publish` — sem `confirm=true` devolve o PREVIEW da subida
proposta: working copy, WIP, commit e push alvo; o `confirm=true` do
operador aplica — o padrão confirm das mutações `gm_update`/
`gm_pack_update`/`gm_pack_publish`/`gm_upgrade`).

## 4. Gramática de IDs

| Entidade | Forma | Exemplo | Sequência |
|---|---|---|---|
| Charter | (sem ID — arquivo único) | — | — |
| RN | `RN-NNN` | `RN-109` | por workspace |
| PEND | `PEND-NNN` | `PEND-007` | por workspace |
| CR | `CR-NNN` | `CR-013` | por workspace |
| ADR | `ADR-NNN` | `ADR-021` | por workspace |
| IMP | `IMP-NNN` | `IMP-143` | **global do workflow** (nunca por workspace) |
| Candidate | `CAND-NNN` | `CAND-044` | por workspace |
| Task | `RN-NNN-M` | `RN-109-3` | M sequencial dentro da Feature |

- `NNN` = 1–4 dígitos, zero-padding recomendado (3). IDs são **únicos e imutáveis** (H2) — renomear ID quebra o `validate` (hash de seção no índice) e reescreve história.
- Cabeçalho de RN/Feature usa em-dash: `## RN-109 — <título>`.

## 5. Gramática de evidência

Forma canônica **parseável**:

```
[caminho/relativo.ext:NNN @hash]
```

- Regex de reconhecimento: `\[[^\[\]:\n]+:\d{1,6}\s+@[0-9a-f]{7,40}\]`
- `caminho` é relativo à raiz do repo registrado no **charter §1**.
- `hash` (SHA-1, mínimo 7 chars) resolve **por pertencimento** contra o registry de repos do charter §1: o kit consulta cada repo (`git cat-file`) e o hash DEVE existir em exatamente 1 repo — ambiguidade = erro (H7).
- Evidência sem hash (`[arquivo:linha]`) é aceita como **legado** no `adopt`, mas é **AVISO** permanente até refresh.
- O `doctor` compara cada hash vs HEAD do repo e emite **worklist de refresh** (S2). O kit NUNCA re-pin de hash sem o agente (§Quem escreve).

## 6. Estado: diretivas e front matter

Dois mecanismos, escolhidos por granularidade (D2 — sem YAML por seção, sem HTML comments):

| Nível | Mecanismo | Entidades |
|---|---|---|
| **Arquivo inteiro** | YAML front matter `status:` | Charter, Feature |
| **Seção dentro de arquivo** | Diretiva em blockquote `> estado: <valor>` | RN, PEND, CR, ADR, CAND, Task, Spec |

**Gramática da diretiva:**

```
> estado: active                          # estado simples
> estado: superseded → RN-142             # transição com destino (RN/ADR/Spec)
> estado: resolved → CR-013               # resolução de PEND cita o destino
> estado: stale · reason: CR-021          # Spec stale — reason OBRIGATÓRIA (H9)
```

- Diretiva ausente = **estado default** da entidade (§7). O `golmet adopt` escreve as diretivas iniciais.
- Estado **nunca** é mantido pelo agente direto no índice — o agente edita a diretiva na prosa; o kit recompõe o índice.

### 6.1 Subset YAML aceito (normativo — DR-018)

O kit implementa **parser próprio** (zero deps). O FORMAT aceita APENAS:

- **Chaves:** escalares simples (`status`, `anchor`, `name`) — sem aninhamento além de 1 nível
- **Valores:** escalares (`draft`, `true`, `42`, `RN-109`) ou **array inline de escalares em chaves de topo** (`[file, ask, kit.jev]`)
- **Mapas de 1 nível** (`kit:`, `degrades:`): valores **sempre escalares** — sem arrays, sem multiline e sem dois-pontos internos; notação de capacidade com dot (`kit.jev`) é válida como **item de array** em `requires`, nunca como chave
- **Strings:** bare ou entre aspas simples/duplas — **sem multiline** (`|`, `>`) nesta versão
- **Sem** anchors/aliases (`&`, `*`) e sem tags (`!!`) — rejeitados com erro estruturado (§11)
- **Comentários** `#` tolerados em qualquer linha e ignorados
- Front matter delimitado por `---` na primeira linha e na linha de fechamento

Qualquer constructo fora do subset = erro de parse com correção sugerida — o `doctor` reporta (S-level) e o `validate` bloqueia front matters obrigatórios ilegíveis (H5).

## 7. Entidades e máquina de estados

**Estados default (ausência de diretiva/front matter — §6):** `RN=draft · PEND=open · CR=pending · ADR=proposed · CAND=pending · Task=todo · Spec=current` · Charter/Feature não têm default — front matter obrigatório (H5).

### 7.1 Charter — `PROJECT_CHARTER.md`

| | |
|---|---|
| Front matter | `status: draft \| confirmed` (+ `compliance`, `legado`, `sistema_existente` opcionais) |
| Estados | `draft → confirmed` |
| Pré-condição de `confirmed` | §1 registra cada repo do produto: path + branch + **HEAD congelado** |

### 7.2 RN — `REQUIREMENTS.md`, seções `## RN-NNN — <título>`

| | |
|---|---|
| Estados | `draft · active · superseded · dropped` |
| Transições legais | `draft→active` · `active→superseded` (→RN-XXX) · `active→dropped` |
| Pré-condições | `draft→active`: **≥1 evidência parseável** na seção (H4) · `superseded`: cita a RN sucessora · `dropped`: motivo no corpo |
| Invariante | `dropped` **nunca reverte** |

### 7.3 PEND — `REQUIREMENTS.md`, seções `## PEND-NNN — <título>`

| | |
|---|---|
| Estados | `open · deferred · resolved · dropped` |
| Transições legais | `open→resolved` (cita destino RN/CR/ADR) · `open→deferred` · `→dropped` (ADR cita o fechamento) |
| Invariante **hard** | PEND **NUNCA** ancora Feature (H1) — PEND não é requisito; só RN ancora |

### 7.4 CR — `CHANGE_REQUESTS.md`, seções `## CR-NNN — <título>`

| | |
|---|---|
| Estados | `pending · approved · rejected · implemented` |
| Transições legais | `pending→approved` · `pending→rejected` · `approved→implemented` |
| Pré-condição de `approved` | decisão registrada com `{dono, data}` |
| AVISO | `implemented` com Spec ainda `stale` = propagação devedora (S1) |

### 7.5 Feature — `delivery/<grupo>/RN-NNN — <título> — Feature.md`

| | |
|---|---|
| Front matter obrigatório | `status: draft \| ready \| in_progress \| done \| cancelled` · `anchor: RN-NNN` |
| Transições | sequenciais entre vizinhos; `→cancelled` de qualquer não-final |
| Pré-condições | `ready` exige anchor RN **`active`** (H3) · `done` exige todas as Tasks `done` |
| Corpo | `### RN-NNN-M. [repo] <título>` — uma seção por Task; tabela de campos livre |

### 7.6 Task — seção `### RN-NNN-M` dentro da Feature

| | |
|---|---|
| Estados | `todo · in_progress · done · blocked` |
| Transições | **livre** entre estados não-finais |
| Estado | diretiva `> estado:` por seção — BASE funciona **sem tracker externo**; Tracking ID (issue/PR) é metadata opcional para usuários FULL |

### 7.7 Spec — `analysis/RN-NNN — <título>/*.md`

| | |
|---|---|
| Estados | `current · stale` (↔) |
| Escritor | **o kit escreve `stale`** quando CR `implemented` invalida (única diretiva com escritor não-agêntico) |
| Invariante **hard** | `stale` DEVE carregar `reason: CR-XXX` (H9) |

### 7.7.1 Agregados técnicos de `specs/` — unitário e quebrado por micro-contexto

Agregados downstream (`DATA_MODEL`, `API_CONTRACTS`, `UI_SPEC`) aceitam **duas formas canônicas, válidas simultaneamente** — nenhum workspace é obrigado a quebrar:

| Forma | Layout | Regra |
|---|---|---|
| **Unitário** | `specs/DATA_MODEL.md` | válido para workspaces pequenos — continua canônico |
| **Quebrado** | `specs/data_model/` | `INDEX.md` **OBRIGATÓRIO** — o mestre (visão geral, ER global, índice dos escopos; o leitor começa por ele) + `<escopo>.md` micro-contextos **auto-contidos** (entidades, relacionamentos e RNs *daquele escopo* — nenhuma leitura cruzada obrigatória) |

- **Genérico:** o padrão vale para qualquer agregado (`specs/api_contracts/`, `specs/ui_spec/`) — a implantação começa no DATA_MODEL.
- **Corte de escopo é decisão de conteúdo** (gm-datamodel + operador: agregados/domínios identificados no conteúdo) — nunca mecânico.
- **Traceability mais fina:** a matriz mapeia RN → caminho de escopo específico (ex.: `RN-012 → data_model/agendamento.md`), não o agregado inteiro.
- **Enforcement (L7):** agregado quebrado sem `INDEX.md` = **error**; agregado unitário acima do limiar de quebra (**800 linhas** — constante declarada no lint, compartilhada com o gm-datamodel) = **warning** recomendando o split. Os próximos candidatos (`DECISIONS`, `ERROR_CATALOG`, `KNOWN_ERRORS`, `GLOSSARY`) recebem **aviso precoce de tamanho** (categoria `L7-size`) — detecção sem gramática: dispara o planejamento com o gm-doc; a gramática quebrada de cada artefato será declarada aqui quando o volume justificar (detalhe no §9.1).

### 7.8 ADR — `DECISIONS.md`, seções `## ADR-NNN — <título>`

| | |
|---|---|
| Estados | `proposed · accepted · superseded` (→ADR-XXX) |
| Invariante | conteúdo de ADR aceito é **append-only** — modificação detectada por hash de seção no índice (H8) |

### 7.9 Candidate — `reverse/CANDIDATES.md`, entradas `### CAND-NNN — <título>`

| | |
|---|---|
| Estados | `pending · approved · rejected · promoted` |
| Pré-condição de transição | registro `{dono, data}` |
| `promoted` | cita a RN que formalizou o candidato |

## 8. Índice de Estados — `golmet.index.json` (D2)

Cache **commitado**, com **único escritor = kit** (padrão registry-render: canônico = prosa, cache = índice):

```jsonc
{
  "format": 1,
  "generated_at": "2026-11-08T12:00:00Z",
  "workspace": "MeuApp",
  "entities": {
    "rn":     { "RN-109": { "estado": "active", "secao_hash": "…", "evidencia": [{"path": "…", "line": 42, "hash": "a1b2c3d", "head_ok": true}] } },
    "feature":{ "RN-109": { "status": "in_progress", "anchor": "RN-109", "tasks": {"RN-109-1": "done"} } }
  },
  "counts": { "rn": 12, "pend_open": 3, "cr_pending": 1, "features_done": 7 }
}
```

- `golmet validate` recomputa e compara; divergência prosa↔índice sem transição registrada = erro (H6).
- Conflito pós-merge = mecânico: `golmet validate --fix` recompõe (conflito de prosa é humano).
- NUNCA editado à mão; NUNCA fonte de verdade de conteúdo.

## 9. Enforcement (D3 — dois níveis)

**Hard — `validate` exit ≠ 0 (bloqueia done/CI):**

| Regra | Enunciado |
|---|---|
| H1 | PEND nunca ancora Feature (`anchor: PEND-XXX` = erro) |
| H2 | IDs únicos e imutáveis (duplicado ou renome de seção com ID = erro) |
| H3 | Feature `ready`/`done` exige anchor RN `active` |
| H4 | RN `active` exige ≥1 evidência parseável |
| H5 | Front matter obrigatório presente e parseável (Charter, Feature, `golmet.yaml`) |
| H6 | Estados no vocabulário da entidade; só transições legais (índice é a história) |
| H7 | Toda evidência DEVE parsear; hash resolve em exatamente 1 repo do charter §1 |
| H8 | ADR aceito é imutável (hash de seção ≠ índice = erro) |
| H9 | Spec `stale` exige `reason: CR-XXX` |
| H10 | Referências cruzadas resolvem — todo `RN/PEND/CR/ADR/CAND/IMP` citado existe |

**Soft — `doctor` reporta (AVISO, não bloqueia):**

| Regra | Enunciado |
|---|---|
| S1 | CR `implemented` com Spec `stale` (propagação devedora — tolerada por prática) |
| S2 | Hash de evidência ≠ HEAD do repo (worklist de refresh) |
| S3 | `requires` de skill não satisfeita pelo engine detectado |
| S4 | Evidência legado sem hash |
| S5 | Capacidade de kit (`kit.jev`/`kit.graph`) declarada e ausente no ambiente — `doctor` emite AVISO com remediação (DR-015/016) |

**Contexto de execução (M21) — `validate` e `doctor` são contexto-aware.**
O modo é detectado pelo dir dado (o `golmet.yaml` dele, ou o match com o
config root do engine — `--engine`/home) e orienta quais checks se aplicam;
a gramática de workspace-produto NUNCA se aplica fora dela:

| Contexto | Detectado por | `golmet validate` | `golmet doctor` |
|---|---|---|---|
| container | `golmet.yaml` com `container: true` | valida a **declaração da org** — regra **C1**: produto declarado no `products:` sem dir no disco = erro (exit 0 ⇔ declaração íntegra) — e reporta o estado de adoção: produto filho com `golmet.yaml` próprio = **adotado** (validate de produto disponível via `golmet validate <produto>`), com dir sem `golmet.yaml` = **não-adotado** (estado legítimo, sem finding). Relatório: `container <nome>: N produto(s) — Y adotado(s) · Z não-adotado(s)` | checklist de hierarquia do container (§2.3) + checks de máquina |
| workspace-produto | `golmet.yaml` sem `container` | como sempre — gramática integral (H1–H10/S1–S5) + índice §8 | como sempre — índice + S1–S5 + manifest + capacidades + máquina (engine-config compacto) |
| engine-config | dir == config root do engine (resolvido por `--engine`/home; sem `golmet.yaml` por natureza) | não se aplica — validate exige `golmet.yaml` (erro do contexto "nenhum") | **estado INTEGRAL do config do engine como corpo principal** (geridos por camada, pessoal-por-design listado, não-reconstrutíveis com arquivos, state packs) + SOMENTE os checks de máquina (git/kit.jev/kit.graph) — os checks de workspace-produto não se aplicam (o config não é workspace; antes do M21 o doctor aqui relatava "0 ok, 0 aviso, 1 falha" inválida — a falha era o `golmet.yaml` ausente, que não é doença do config) |
| nenhum | sem `golmet.yaml` e sem match de config root | erro claro (exit 2): "não é workspace nem container — rode `golmet init` no dir, ou `golmet init <produto> --into <container>` para criar dentro de um container existente" | erro claro (exit 2): workspace não inicializado (rode `golmet init`) |

O relatório humano carrega a mensagem de contexto: `contexto: container |
workspace-produto` (validate) e `contexto: engine-config | container |
workspace-produto` (doctor, na 1ª linha junto à versão do kit).

### 9.1 `golmet lint` — varredura estrutural determinística (read-only)

O lint carrega o estado todo e APONTA inconsistências; a correção é do
agent/operador. Executor: os checks L1-L9 rodam via **CLI `golmet lint`**
(ou **MCP `gm_lint`** — read-only, sem confirm). Skills de manutenção que o
invocam: gm-agent-health-monitor (saúde estrutural), gm-setup (validação
pós-install), gm-workflow-improver (gate pós-correção),
gm-pack-orchestrator (pós publish/update). Exit 0 limpo, 2 com findings.
Sem check de vocabulário legado (L2 fora do escopo por decisão do operador).

| Check | Severidade | Enunciado |
|---|---|---|
| L1 | error | Referência morta: path citado em `` `backticks` ``/link de `*.md` (kit, config, rules) não existe em raiz conhecida |
| L3 | warning | Órfão: arquivo do config sem proveniência no manifest, sem designação pessoal, fora de state pack, fora da allowlist e não citado |
| L4 | error | Entrada stale no manifest de conteúdo (arquivo não existe no disco) |
| L5 | warning | Nome estrutural fora de kebab-case ASCII (dirs/temas canônicos; nomes com extensão isentos) |
| L6 | error/warning | Componente fantasma: `gm-*` citado que não existe no registry — **error** em `coredata/sources`, `coredata/rules`, `skills/` (BASE), `coredata/registry.yaml` (descrições e `invokes`) e goldens de render (`internal/core/content/testdata/`), **warning** em docs/AGENTS.md (histórico) |
| L6-allowlist | warning | Exceção da ghostAllowlist **em uso**: o nome silenciado ainda aparece no conteúdo varrido — 1 finding agregado por nome (1ª ocorrência + contagem) para revisão periódica. Allowlist não é silêncio perpétuo: a entrada sai quando o nome deixa de ser citado, ou é mantida com o motivo atualizado (referência de IMP) |
| L7 | error | Estrutura fora do padrão canônico (declarado abaixo) |
| L7-size | warning | Aviso de tamanho de agregado unitário do workspace: DATA_MODEL acima do limiar de quebra (gramática §7.7.1 declarada — split do gm-datamodel) e os 4 candidatos precoces (DECISIONS 800 · ERROR_CATALOG 600 · KNOWN_ERRORS 400 · GLOSSARY 300 linhas) acima do limiar de aviso — **detecção sem gramática**: o aviso só recomenda planejar a quebra com o gm-doc; a gramática quebrada de cada artefato será declarada no FORMAT quando o volume justificar |
| L8 | warning | Conformidade estrutural definitivo ↔ template: o definitivo (AGENTS.md, perfis) perdeu o MÍNIMO estrutural declarado (blocos marcadores/seções/campos). Conteúdo extra = OK (evolução); definitivo ausente = skip; template depositado no config = L7 warning |
| L9 | error | Schema do registry de stack-templates — o materializado do kit (`profile/stack-templates.yaml`) E os registries da org in-place nos packs (`packs/*/rules/stack-templates.yaml` — M15 pack-first, mesma regra, contrato §2.2): YAML parseável, `boilerplate_org` presente (placeholder `<...>` aceito), cada template com `detect` não-vazio, chave `boilerplate` presente (`null` aceito) e `description` presente quando `boilerplate` é não-null. Arquivo ausente = skip silencioso (o install materializa o do kit; pack sem registry é estado legítimo). Check separado do L7 de propósito: L7 é estrutura de diretórios; L9 é schema de conteúdo — o by_check diagnostica com precisão |
| L10 | error/warning | Estado interno dos state packs em `packs/<id>/` (M20 — o lint aponta, o escritor canônico corrige): `rules/*.md` sem gatilho explícito no topo (warning/arquivo — formato `gm-rule-keeper`: H1 + "> Gatilho: AO …", uma norma por arquivo); `accumulation/patterns/<tipo>/` fora da taxonomia EN `process\|architecture\|code\|ui\|test\|data` (warning/dir — `gm-pattern-extractor` define a taxonomia; era PT até a uniformização); `domains/` sem INDEX.md ou `domains/<domínio>/` sem KNOWLEDGE.md (warning — `gm-domain-research`); working copy com `.git` sem `pack.yaml` (**error** — a fonte da verdade do pack sumiu). Dir sem pack.yaml e sem `.git` não é working copy — fica para os checks existentes, sem duplicar |
| L11 | warning | Diagrama Mermaid quebrado/mal formatado em `*.md` dos alvos (kit, config, packs, workspace): bloco ```mermaid``` sem tipo de diagrama válido na 1ª linha (`flowchart`, `sequenceDiagram`, `erDiagram`, `stateDiagram`, `gantt`, `pie`, `mindmap`, `C4*`... - lista declarada), delimitadores `\[ \] \( \) \{ \}` desbalanceados **no bloco** (fora de aspas - o padrão ER de atributos abre e fecha em linhas diferentes), aspas em número ímpar, seta sem origem/destino, `subgraph` sem `end`, fence aberto sem fechamento. **Heurística determinística sem parser/Node** - pega os erros comuns que quebram o render (o mostrador exibe o código cru); falso-positivo é pior que falso-negativo: construções exóticas válidas passam (sequenceDiagram `->>` sem validação de pontas). É qualidade de render, não bloqueia fluxo |
| L12 | error (BOM = warning) | Encoding e texto quebrado nos arquivos de conteúdo (`*.md` + `*.yaml`): UTF-8 inválido (bytes Latin-1/Windows-1252 crus), replacement character U+FFFD (o conteúdo JÁ está corrompido no arquivo), padrões de dupla codificação de acentuação PT-BR (UTF-8 lido como Latin-1 e regravado — os acentos viram pares ilegíveis; os bigramas exemplificados NÃO são citados neste doc para o L12 não flagá-lo), BOM UTF-16 (**error**), BOM UTF-8 (**warning** - IMP-096: sem BOM). Evals ficam fora (fixtures podem conter conteúdo proposital) |

**Template é etapa de construção — vive no kit, não se instala; o config
carrega só os definitivos.** O render emite os templates (byte-equality do
golden/docs), mas o materialize NÃO os deposita (`nonDepositTemplates`);
quem precisa do esqueleto usa `golmet template <agents|client-profile|
operator-profile>` (`--out` grava em arquivo). Política anti-ruído do L8:
o mínimo estrutural é DECLARADO no lint (l8*) — se o template ganhar seção
nova numa release, definitivos antigos NÃO flagam (evolução retroativa não
obriga); só a PERDA/ausência do mínimo declarado flaga.

**Estrutura canônica declarada (fonte única em código — `internal/core/lint`):**

- **State pack** (`packs/<id>/`): `pack.yaml` + qualquer subconjunto de
  {`skills/`, `agents/`, `rules/`, `domains/`, `accumulation/`, `mcp/`}; dentro de
  `accumulation/` só {`patterns/`, `metrics/`, `nuances/`};
  `accumulation/patterns/<tipo>/<slug>/PATTERN.md` com tipo em
  {process, architecture, code, ui, test, data}; dentro de `mcp/` só
  {`tools/`} (convenção do server MCP próprio do pack — `golmet pack mcp`:
  `mcp/server.js` é o server stdio Node e `mcp/tools/*.js` é o registry
  dinâmico de tools; arquivos diretos em `mcp/` são canônicos).
- **Config engine** (1º nível): dirs {agents, skills, profile, packs,
  plugins, knowledge (legado), .golmet} + files {AGENTS.md, opencode.jsonc}
  — dir desconhecido = warning; template depositado no config
  (AGENTS.template.md) = L7 warning (template vive no kit — M12).
  **Convenção T3 (M13):** o perfil de operação do agente vive em
  `profile/` do config (recursos do kit kit-canônicos — context7,
  stack-templates — e dados de operação pessoais-por-design — client/
  operator; o DONO está no manifest/personal.json); as normas da ORG
  permanecem IN-PLACE no pack (`packs/<id>/rules/`, uma por arquivo com
  gatilho). T3 = "config: `profile/*` · pack: `packs/<id>/rules/*`".
- **Kit repo**: `coredata/{sources/, rules/, templates/, registry.yaml}` com sources
  FLAT (`*.md` + `*.agent.md`); rules canônicas do kit = `rules/*.md` +
  `rules/*.yaml` (context7, templates de perfil client/operator — IMP-103/136,
  registry de boilerplates stack-templates.yaml — M14); `skills/` raiz = exatamente 16
  skills (`skills/<gm-x>/SKILL.md`); golden `testdata/golden-opencode/` espelha o
  render ({agents, skills, profile} + AGENTS.template.md — destino `profile/` desde o M13).
- **Workspace de produto — agregados de specs (§7.7.1):** `specs/` aceita o
  agregado unitário (`specs/DATA_MODEL.md`) ou quebrado (`specs/data_model/`
  COM `INDEX.md` obrigatório — idem `api_contracts/`, `ui_spec/`);
  quebrado sem INDEX = L7 error; unitário acima do limiar de quebra
  (`DataModelSplitLines` = 800 linhas, constante declarada no lint e
  compartilhada com o gm-datamodel) = **L7-size** warning.
- **Container de organização (§2.3):** o doctor roda o checklist de
  hierarquia (products ↔ disco, base canônica, artefatos org-level soltos,
  zona de trabalho `.golmet/`; `docs/` não-canônico desde M18 e
  `meetings/`/`migrations/` na raiz migram para `.golmet/` desde M19 —
  mensagens próprias) no lugar dos checks de workspace-produto; o lint
  valida a mesma estrutura (L7) e varre a camada de navegação do container
  com o L1 (CONSTITUTION.md/INDEX.md/README.md da raiz + `docs/` legado
  durante a transição — **a zona `.golmet/` NÃO é varrida** (skip
  declarado: trabalho temporário do kit) e os `*.md` org-level soltos na
  raiz ficam fora (o L7 já aponta a movimentação para `.golmet/`)). Refs
  ancoradas no container legado (`docs/`) são verificáveis; as demais
  stores de workspace de produto — incl. `meetings/`/`migrations/`, agora
  dentro da zona — permanecem isentas (mesma política do kit). O L1 do
  container resolve TAMBÉM o config root do engine quando conhecido
  (`--engine`/`--home`): docs do container citam o runtime do agente
  (ex.: `profile/client-profile.md` existe em `~/.config/opencode/profile/`)
  — ref que resolve no config não é finding; sem config conhecido, a ref
  volta a ser reportada.
- **Aviso precoce dos candidatos à quebra (L7-size):** `DECISIONS.md` (800
  linhas — ADRs auto-contidos; quebrado `decisions/` será planejado),
  `specs/ERROR_CATALOG.md` (600, fallback raiz), `support/KNOWN_ERRORS.md`
  (400, fallback raiz) e `GLOSSARY.md` (300) disparam o aviso ANTES de
  existir gramática quebrada para eles — o warning não aponta layout
  nenhum: recomenda PLANEJAR a quebra com o gm-doc, e a gramática de cada
  artefato entra no FORMAT quando o volume justificar (nenhum workspace é
  obrigado a quebrar).

**Heurísticas anti-falso-positivo (declaradas):** URLs/âncoras/`<placeholders>`/
wildcards/braces não são candidatos; paths SEM `/` (nome solto) não são
verificados quando não resolvem (família aberta de marcadores de repo de
produto: `angular.json`, `Cargo.toml`, `LEGACY_CONTEXT.md`); paths de store
de workspace de produto (`delivery/`, `specs/`, `accumulation/`, `docs/`,
`evals/`, `scripts/`, `config/`, `~/`, `$ENV`, `.opencode/`, `guide/`,
`howto/`, `migration/`, `quality/`, `ci/`, `.vscode/` e os nomes em
`moduleStoreNames`) são runtime por design — o L1 não opina; blocos de
código marcados `​```exemplo`/`​```example` não são verificados; `*.md` de
packs não são varridos pelo L1 v0.1 (docs de negócio citam paths de
produto por design). Allowlists declarativas e versionadas no lint:
`orphanAllowlist` (plugins/, quality/health, .github/, settings raiz,
AGENTS.md, .gitignore), `ghostAllowlist` (nomes legados/exemplos com
motivo), `refAllowlist` (refs mortas com pendência declarada — ex.:
`AGENTS.template.md`, wave do template). `packs/` do config é excluído do
L3 (proveniência própria do pack). Match `gm-x` seguido de `*`/`{`/`-`/`/`
é prefixo de família em prosa — não é fantasma.

## 10. Contrato de skill (front matter de capacidades)

```yaml
---
name: gm-requirements          # DEVE ser único; prefixo gm- no BASE
description: Uma frase — é o que o roteamento BASE lê.   # escalar — sem multiline
requires: [file, ask, kit.jev] # arrays inline em chaves de TOPO
degrades:                      # mapa 1 nível — valores SEMPRE escalares
  ask: chat-stop               # pergunta no chat e PARA — nunca adivinhar
kit:                           # mapa 1 nível — valores SEMPRE escalares
  jev: heuristic               # degradação de capacidade de kit (dot-key é item de array, não chave)
  checkpoints: post-write validate   # "<momento> <o-quê>" — sem dois-pontos interno
---
```

**Vocabulário de capacidades:** `file · shell · mcp · ask · kit · subagent · parallel · workspace-ops · db-introspect`. — `kit` = presença do binário golmet (checkpoints §10, `golmet update`); provida pelo próprio kit quando instalado no workspace (`.golmet/manifest.json`).

**Capacidades de ambiente providas pelo kit:** `kit.jev` (classificação calibrada — DR-015) · `kit.graph` (grafo de código — DR-016, política **graph-first** — DR-020). Declaradas em `requires`, checadas pelo `doctor` (S5), degradação heurística sempre declarada. **Graph-first (DR-020):** com `kit.graph` presente e índice fresco, navegação estruturada é a PRIMEIRA instância — grep/glob ficam para literais e para o que o grafo não resolve; a disciplina é obrigatória, a infra nunca é pré-condição: índice stale exige re-indexação antes do uso (grafo velho responde com confiança errada — pior que grep); sem grafo, degradação `grep-fallback` declarada no relatório (observável, nunca bloqueante). MCPs de serviço NÃO são capacidades do kit — ficam sob gestão do runtime (DR-016).

**Escadas de degradação:** `ask`: nativo → chat+stop → checklist async · `subagent`: spawn → inline sequencial → desabilitado com recomendação FULL · `parallel`/`background`: sequencial/síncrono.

**Perfis:** `BASE = file + shell (+mcp recomendado, +ask com degradação)` · `FULL = BASE + ask nativo + subagent + parallel + workspace-ops`. O `doctor` compara `requires` vs capacidades do engine detectado (S3).

## 10.1 Duplo registro skill + subagent (mesmo id)

Skill e subagent com o mesmo id **coexistem por necessidade, não por simetria** — a **skill é o contrato** (o procedimento: gatilho, Lê/Gera, formato, modo de erro, portátil a qualquer engine); o **subagent é o executor especializado** (sessão filha isolada, temperatura e permissões próprias, contexto do primary preservado).

**Critério para criar o subagent do par** — existe quando pelo menos um vale:

- **Trabalho denso** que gastaria o contexto do primary (ex.: `gm-pattern-extractor` processando retrospectiva longa);
- **Delegação orquestrada** — um orquestrador abre o executor isolado (ex.: `gm-project-retrospective` → `@gm-pattern-extractor`);
- **Disponibilidade cross-engine** para o mesmo id em qualquer engine (ex.: pares de navegação `gm-next`, `gm-progress`).

**Skill-only** quando o trabalho é **leve, imediato e conversado** (o contexto da sessão dá o valor) — ex.: `gm-nuance-collector` (captura na hora), `gm-rule-keeper` (norma decidida com o operador, com confirmações no fluxo). O par pode ser completado depois, quando um dos critérios passar a valer.

## 11. Erros estruturados

`golmet validate --json` emite array consumível pelo agente no loop:

```jsonc
[{ "file": "REQUIREMENTS.md", "entity": "RN", "id": "RN-042",
   "rule": "H4", "message": "RN active sem evidência parseável",
   "fix": "adicione [caminho:linha @hash] ao corpo da seção" }]
```

## 12. Versionamento

`format: 1` no `golmet.yaml`. Kit versão X suporta formatos `1..X`. Mudança de formato = nova versão + `golmet update` migra (idempotente, preserva prosa). A spec do formato versiona por semântica: campo novo opcional = minor; quebra de parse = major.

## 13. Guarda de escopo — o que NÃO entra

Lifecycle de produto comercial · severidade como estado (fica label) · assignees/prazos · estados de compliance · validação de qualidade de conteúdo (território do clarify). Critério de entrada: só formaliza o que os **três consumidores** precisam — kit (validar), engines (executar transições), ingestores (exportar).

## 14. Exemplo mínimo de workspace conforme

```markdown
<!-- golmet.yaml -->
format: 1

<!-- PROJECT_CHARTER.md -->
---
status: confirmed
---
# Charter — MeuApp
## 1. Repos
| Repo | Branch | HEAD |
|---|---|---|
| ../MeuApp-API | main | a1b2c3d |

<!-- REQUIREMENTS.md (trecho) -->
## RN-001 — Agendamento com confirmação
> estado: active
O sistema DEVE confirmar agendamentos em até 24h `[src/Agenda.cs:88 @a1b2c3d]`.

## PEND-001 — Definir política de no-show
> estado: open
Cliente não definiu a política de cobrança.

<!-- delivery/2026-11/RN-001 — Agendamento — Feature.md -->
---
status: ready
anchor: RN-001
---
### RN-001-1. [BPro-API] Endpoint de confirmação
> estado: done
```