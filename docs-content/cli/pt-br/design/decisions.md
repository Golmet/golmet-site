<p align="center"><a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"English</a> | <a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"Português (Brasil)</a> | <a href="/docs/design/decisions"English (pointer)</a></p>

# DECISIONS — ADRs do Workflow Golmet

Registro de Decisões Arquiteturais (Architecture Decision Records) do workflow Golmet.
Cada entrada documenta **o que foi decidido**, **por que foi decidido** e **quais consequências** decorrem da decisão.

> **Diferença do WORKFLOW_IMPROVEMENTS.md:** Este arquivo registra decisões de **design** (por que escolhemos X em vez de Y).
> O WORKFLOW_IMPROVEMENTS.md registra **correções** (o que estava errado e como foi corrigido).

---

## ADR-001 — Arquitetura em Camadas: Primary → Subagent → Skill

- **Data:** 22/04/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** O OpenCode suporta primary agents, subagents e skills. Precisávamos de uma arquitetura que permitisse: (1) delegação clara de responsabilidades, (2) permissões granulares, (3) reuso de conhecimento, (4) orquestração flexível.
- **Decisão:** Adotamos a hierarquia `Primary Agent → Subagent → Skill`:
  - **Primary Agent** (Tríade Golmet: `gm-req`, `gm-doc`, `gm-dev`): persona ativa da sessão, permissão ampla, roteia para subagents.
  - **Subagent** (`@gm-intake-orchestrator`, `@gm-figma-orchestrator`, etc.): orquestrador de domínio, permissão escopada, invoca skills do seu domínio.
  - **Skill** (`gm-requirements`, `gm-data-model`, etc.): conhecimento de referência, executável isoladamente, sem estado.
- **Alternativas avaliadas:**
  - _Skills diretas do primary_: mais simples, mas sem permissões granulares e sem separação de responsabilidades.
  - _Subagents sem skills_: subagents auto-contidos, mas com conhecimento duplicado e difícil de manter.
  - _Microserviços_: overkill para o contexto (config local, não deploy).
- **Consequências:**
  - ✅ Permissões granulares por subagent (menor privilégio)
  - ✅ Reuso de skills entre subagents (ex: `gm-task-spec` acessada por `@gm-quality-orchestrator` e `@gm-azure-orchestrator`)
  - ✅ Separação clara entre orquestração (subagent) e execução (skill)
  - ❌ Complexidade inicial (3 camadas para entender)
  - ❌ Necessidade de manter ARCHITECTURE.md sincronizado

---

## ADR-002 — Prefixo `Golmet-` em Todos os Componentes

- **Data:** 22/04/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** O OpenCode permite nomes livres para skills e subagents. Precisávamos de uma convenção de nomenclatura que: (1) identificasse componentes Golmet instantaneamente, (2) evitasse conflitos com skills de outros workflows, (3) facilitasse buscas e referências.
- **Decisão:** Todo skill e subagent Golmet usa o prefixo `Golmet-` (ex: `gm-requirements`, `@gm-intake-orchestrator`). Primary agents seguem a Tríade Golmet (`gm-req`, `gm-doc`, `gm-dev`). Skills externas podem manter seu prefixo próprio (skills de projeto da organização).
- **Alternativas avaliadas:**
  - _Prefixo `opencode-`_: genérico demais, não identifica o domínio.
  - _Sem prefixo_: conflitos com skills de outros workflows.
  - _Prefixo por domínio_ (`gm-intake-`, `gm-azure-`): muitos prefixos, complexidade desnecessária.
- **Consequências:**
  - ✅ Identificação instantânea de componentes Golmet
  - ✅ Sem conflitos com outros workflows
  - ✅ Facilita buscas (`grep Golmet-`)
  - ❌ Nomes um pouco mais longos
  - ❌ Exigência de consistência (já quebrada uma vez — IMP-008)

---

## ADR-003 — IDs Estáveis e Imutáveis (RN-XXX, PEND-XXX)

- **Data:** 22/04/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Requisitos mudam ao longo do tempo. Precisávamos de um mecanismo de rastreabilidade que: (1) permitisse referenciar um requisito em múltiplos documentos, (2) não quebrasse referências quando o requisito fosse renomeado, (3) suportasse merge incremental.
- **Decisão:** IDs são atribuídos uma vez e nunca renumerados:
  - `RN-XXX` para regras de negócio (ex: `RN-001`)
  - `PEND-XXX` para pendências de esclarecimento (ex: `PEND-001`)
  - IDs removidos recebem tag `[removido]` mas mantêm o número (IMP-008)
- **Alternativas avaliadas:**
  - _IDs baseados em timestamp_: difíceis de lembrar, não human-readable.
  - _IDs renumeráveis_: quebram referências em documentos downstream.
  - _UUIDs_: overkill, difíceis de trabalhar manualmente.
- **Consequências:**
  - ✅ Referências estáveis entre documentos
  - ✅ Merge incremental funciona sem conflitos de numeração
  - ✅ Fácil de lembrar e referenciar em conversas
  - ❌ Lacunas na numeração (IDs removidos ficam "buracos")
  - ❌ Necessidade de documentar tag `[removido]` para IDs com relevância externa

---

## ADR-004 — DAG de Documentos com Validação de Integridade

- **Data:** 22/04/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Documentos de requisitos e arquitetura se referenciam mutuamente. Precisávamos de: (1) uma ordem de dependência clara, (2) detecção de artefatos órfãos ou desatualizados, (3) propagação de mudanças controlada.
- **Decisão:** Cada módulo segue um DAG (Directed Acyclic Graph):
  ```
  PROJECT_CHARTER → REQUIREMENTS → [DATA_MODEL, API_CONTRACTS, UI_SPEC, ARCHITECTURE, GLOSSARIES, ACCEPTANCE_CRITERIA] → [TEST_STRATEGY, TRACEABILITY, VALIDATION_REPORT, TASKS]
  ```
  A validação é feita por `gm-validate`; a propagação por `@gm-cr-propagation-guard`.
- **Alternativas avaliadas:**
  _Documentos independentes_: sem rastreabilidade, drift inevitável.
  _Banco de dados relacional_: overkill para markdown, perde versionamento Git.
  _Wikis com links_: sem validação automática, depende de disciplina humana.
- **Consequências:**
  - ✅ Rastreabilidade completa (RN → artefato downstream)
  - ✅ Detecção automática de drift (PROPAGATION_STATUS.md)
  - ✅ Validação de integridade (VALIDATION_REPORT.md)
  - ❌ Complexidade do DAG (7+ documentos por módulo)
  - ❌ Necessidade de executar `gm-validate` periodicamente

---

## ADR-005 — Auto-Update Manual (Sem Hook/Plugin)

- **Data:** 14/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** A config Golmet é um repo git (`<config-repo>`). Precisávamos de um mecanismo para atualizá-la sem destruir trabalho local.
- **Decisão:** Auto-update é **manual e controlada** via skill `gm-self-update`:
  - Verifica working tree antes de pull (se sujo, ABORTA)
  - Usa `git pull --ff-only` (nunca merge automático)
  - Avisa para reiniciar o OpenCode (config não é hot-reloaded)
- **Alternativas avaliadas e rejeitadas:**
  - _Hook/plugin de auto-pull em session.created_: pull não vale para a sessão em início (config já carregada), pode mesclar/sobrescrever WIP silenciosamente, plugins não são versionados.
  - _Cron job_: arriscado sobrescrever trabalho local, complexidade de implementação.
  - _Watch file_: OpenCode não suporta hot-reload de config.
- **Consequências:**
  - ✅ Nunca destrói trabalho local (trava de working tree)
  - ✅ Controle total do operador (decide quando atualizar)
  - ✅ Simples de implementar (skill pura, sem hooks)
  - ❌ Requer ação manual (esquecimento = config desatualizada)
  - ❌ Requer reinício do OpenCode após atualização

---

## ADR-006 — Publicação via Git Push (Sem CI/CD)

- **Data:** 18/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Melhorias aplicadas pelo `@gm-workflow-improver` e `@gm-workflow-builder` ficavam presas na máquina local. Precisávamos de um mecanismo para publicar.
- **Decisão:** Publicação via skill `gm-self-publish`:
  - Commit atômico por tema (Conventional Commits)
  - Pull `--ff-only` antes do push (nunca force)
  - Gate de confirmação (nunca commit cego)
  - Escopo de versionamento: `agents/Golmet-*.md`, `skills/Golmet-*/SKILL.md`, `ARCHITECTURE-*.md`, `WORKFLOW_IMPROVEMENTS.md`
- **Alternativas avaliadas e rejeitadas:**
  - _CI/CD (Azure Pipelines)_: complexo demais para config local, overhead de manutenção.
  - _Sync automático_: arriscado (pode publicar trabalho incompleto).
  - _Manual (git add/commit/push)_: sem gates de segurança, propenso a erros.
- **Consequências:**
  - ✅ Publicação segura com gates de confirmação
  - ✅ Histórico limpo (commits atômicos)
  - ✅ Compatível com `gm-self-update` (mesmo repo, mesma branch)
  - ❌ Requer ação manual (mesmo custo do update)
  - ❌ Sem revisão de código (push direto na master)

---

## ADR-007 — Permissão Ampla para Primary Agents

- **Data:** 22/04/2026
- **Decisor:** Operador
- **Status:** Aceita (com ressalvas)
- **Contexto:** O OpenCode não suporta delegação de permissão do primary para subagent no momento da invocação. Primary agents precisam coordenar subagents com permissões diferentes.
- **Decisão:** Primary agents (Tríade Golmet: `gm-req`, `gm-doc`, `gm-dev`) têm permissão ampla (read/write/edit/bash/webfetch). Subagents têm permissão escopada (menor privilégio). O blast-radius do primary é aceito como risco controlado.
- **Alternativas avaliadas:**
  - _Permissão escopada no primary_: OpenCode não suporta delegação no momento da invocação.
  - _Subagents auto-contidos_: perda de orquestração centralizada.
  - _Multi-primary_: complexidade desnecessária para o contexto.
- **Consequências:**
  - ✅ Orquestração flexível (primary coordena qualquer subagent)
  - ✅ Funciona com a API atual do OpenCode
  - ❌ Blast-radius elevado (primary pode editar qualquer coisa)
  - ❌ Confiança no comportamento do primary (mitigado por convenções)

---

## ADR-008 — Auto-Contidos vs. Orquestrados

- **Data:** 14/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Alguns subagents precisam apenas ler artefatos e gerar saída (sem invocar skills). Outros precisam orquestrar múltiplas skills.
- **Decisão:** Dois tipos de subagent:
  - **Auto-contidos** (`@gm-next`, `@gm-progress`, `@gm-cr-propagation-guard`): lêem artefatos diretamente, não invocam skills, são lightweight.
  - **Orquestrados** (`@gm-intake-orchestrator`, `@gm-azure-orchestrator`, etc.): invocam skills do seu domínio, têm lógica de roteamento.
- **Alternativas avaliadas:**
  _Todos orquestrados_: overhead desnecessário para subagents simples.
  _Todos auto-contidos_: perda de reuso de skills.
- **Consequências:**
  - ✅ Eficiência (auto-contidos são rápidos)
  - ✅ Reuso de skills (orquestrados compartilham conhecimento)
  - ✅ Flexibilidade (cada tipo para seu caso de uso)
  - ❌ Dois padrões para entender
  - ❌ Necessidade de classificar corretamente ao criar novos subagents

---

## ADR-009 — WORKFLOW_IMPROVEMENTS.md como Log Imutável

- **Data:** 13/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Melhorias no workflow precisavam de rastreabilidade (o que mudou, por que mudou, quando mudou).
- **Decisão:** `WORKFLOW_IMPROVEMENTS.md` é um log imutável:
  - Cada entrada é incremental (nunca apagar entradas anteriores)
  - Formato padronizado: Data, Alvo, Problema, Causa raiz, Correção, Arquivos, Status
  - Entradas numeradas (IMP-001, IMP-002, ...)
- **Alternativas avaliadas:**
  _Changelog tradicional (CHANGELOG.md)_: mistura features com correções, difícil de filtrar.
  _Git log_: não tem contexto de "por que", apenas "o que".
  _Wiki_: sem estrutura, difícil de consultar programaticamente.
- **Consequências:**
  - ✅ Histórico completo e imutável
  - ✅ Formato padronizado (facilita consulta)
  - ✅ Contexto de "por que" preservado
  - ❌ Arquivo cresce indefinidamente (aceitável para o volume atual)
  - ❌ Requer disciplina ao registrar (não é automático)

---

## ADR-010 — Convenção de Título de Task `[<repo>] <descrição>`

- **Data:** 18/08/2026
- **Decisor:** Operador (baseado em prática do time)
- **Status:** Aceita
- **Contexto:** Tasks precisavam de um formato consistente que: (1) identificasse o repositório de destino, (2) fosse legível humanamente, (3) suportasse classificação por domínio.
- **Decisão:** Título de task segue o padrão `[{prefixo}] [<repo>] <descrição>`:
  - `[Database]` para DDL/DML
  - `[DevOps]` para pipelines/deploy
  - `{repo}` é obrigatório (ex: `[Rastreabilidade.API]`)
  - Uma task = um repositório/escopo
- **Alternativas avaliadas:**
  _Título livre_: inconsistente, difícil de filtrar.
  _Prefixo por área de negócio_: `[NF]-` é ilegível, não identifica o repo.
  _Múltiplos repos na mesma task_: viola o princípio de granularidade.
- **Consequências:**
  - ✅ Consistência visual e de filtragem
  - ✅ Rastreabilidade (repo identificado no título)
  - ✅ Compatível com a prática existente do time
  - ❌ Títulos mais longos
  - ❌ Exigência de disciplina (uma task = um repo)

---

## ADR-011 — Gate de Revisão: TASKS.md Antes do Azure

- **Data:** 18/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Tasks estavam sendo criadas no Azure DevOps sem revisão prévia, gerando trabalho duplicado e inconsistente.
- **Decisão:** Gate obrigatório:
  1. `gm-task-spec` gera `TASKS.md` (markdown revisável)
  2. Operador revisa e confirma (via `question`)
  3. `@gm-azure-orchestrator` só então cria work items no AzDO
- **Alternativas avaliadas:**
  _Criação direta_: rápido, mas sem revisão (já gerou duplicatas).
  _Revisão automática_: impossível sem contexto humano.
  _Dupla confirmação_: overhead desnecessário.
- **Consequências:**
  - ✅ Elimina criação acidental de tasks duplicadas
  - ✅ Permite revisão humana antes da escrita
  - ✅ Materializa o trabalho em markdown auditável
  - ❌ Um passo adicional (gate)
  - ❌ Requer que o módulo tenha `TASKS.md` antes de criar no AzDO

---

## ADR-012 — Detecção de Duplicidade Antes de Criar Tasks

- **Data:** 03/09/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Mesmo com o gate de revisão, tasks duplicadas eram criadas quando o operador re-executava um PBI que já tinha tasks filhas.
- **Decisão:** Gate de duplicidade obrigatório:
  1. Ler PBI com `expand: "Relations"` para obter tasks filhas existentes
  2. Comparar títulos das tasks existentes com as do `TASKS.md`
  3. Match exato → pular criação (informar ao operador)
  4. Match aproximado → perguntar ao operador
  5. Fail-open se MCP falhar (não bloqueia por erro de infraestrutura)
- **Alternativas avaliadas:**
  _Verificação manual_: propensa a erro, depende de memória.
  _ID como chave_: títulos mudam, IDs são mais estáveis mas menos legíveis.
  _Sem verificação_: aceitar duplicatas (inaceitável).
- **Consequências:**
  - ✅ Elimina 100% das duplicações acidentais
  - ✅ Transparência (operador é informado)
  - ✅ Fail-open (não bloqueia por erro de infraestrutura)
  - ❌ Chamada extra ao AzDO (expand: Relations)
  - ❌ Match aproximado pode gerar falsos positivos

---

## ADR-013 — Colunas de Auditoria Padrão

- **Data:** 03/09/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Tabelas novas estavam sendo criadas sem as colunas de auditoria padrão, gerando inconsistência com o legado e dificultando migração.
- **Decisão:** Toda tabela nova deve incluir as colunas de auditoria definidas na CONSTITUTION.md (ex: 6 colunas com prefixo `CTR_`). Nomes sempre em MAIÚSCULAS.
- **Alternativas avaliadas:**
  _Colunas camelCase_ (`dataHora`, `createdAt`): inconsistente com o legado, quebra migração.
  _Sem colunas de auditoria_: perda de rastreabilidade de quem criou/atualizou.
  _Auditoria via trigger_: complexo, overhead de performance.
- **Consequências:**
  - ✅ Rastreabilidade de criação/atualização
  - ✅ Migração simplificada (legado usa o mesmo padrão)
  - ❌ Nomes longos (ex: 6 colunas com prefixo `CTR_`)
  - ❌ Exigência de disciplina em toda task DDL

---

## ADR-014 — Glossário de Negócio 100% em Português

- **Data:** 20/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** O glossário de negócio estava sendo gerado com termos em inglês entre parênteses, dificultando a compreensão por stakeholders não-técnicos.
- **Decisão:** BUSINESS_GLOSSARY.md é 100% em português:
  - Títulos em português (ex: `## Vacinação`)
  - Parênteses apenas para siglas/expansões em português (ex: `## GTA (Guia de Trânsito Animal)`)
  - Conceitos só existentes em inglês → traduzir título e explicar na definição
- **Alternativas avaliadas:**
  _Bilíngue_ (`## Vacinação (Vaccination)`): confuso para não-técnicos, polui o documento.
  _Inglês puro_: inacessível para stakeholders de negócio.
  _Português com glossário técnico separado_:冗余, difícil de manter.
- **Consequências:**
  - ✅ Acessível para stakeholders não-técnicos
  - ✅ Consistência com a convenção PT-BR do projeto
  - ✅ Siglas preservadas (GTA, PNIB, etc.)
  - ❌ Termos técnicos podem perder precisão na tradução
  - ❌ Exigência de tradução cuidadosa

---

## ADR-015 — Page-Breaks em Documentos

- **Data:** 26/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Documentos convertidos para PDF apareciam em texto corrido sem quebras de página.
- **Decisão:** Inserir `<div style="page-break-before: always;"></div>` antes das seções principais nos templates de fábrica externa.
- **Alternativas avaliadas:**
  _CSS separado_: depende do conversor PDF, não é portável.
  _Markdown puro_: não suporta page-breaks nativamente.
  _Configuração do conversor_: varies por ferramenta, não é robusto.
- **Consequências:**
  - ✅ PDFs com layout profissional
  - ✅ Compatível com a maioria dos conversores PDF
  - ✅ Não afeta o conteúdo (apenas formatação)
  - ❌ HTML inline no markdown (um pouco "sujo")
  - ❌ Pode quebrar em conversores que não suportam HTML

---

## ADR-016 — Variable Groups no Padrão `<repo>-<env>`

- **Data:** 28/08/2026
- **Decisor:** Operador
- **Status:** Aceita
- **Contexto:** Variable Groups de CI/CD estavam sendo nomeados de forma inconsistente, dificultando a identificação do repositório e ambiente.
- **Decisão:** Variable Groups seguem o padrão `<repo>-<env>`:
  - `<nome>.API-DES` (desenvolvimento)
  - `<nome>.API-HML` (homologação)
  - `<nome>.API-PRO` (produção)
- **Alternativas avaliadas:**
  _Nome livre_: inconsistente, difícil de filtrar.
  _Prefixo por projeto_: redundante (repo já identifica o projeto).
  _Sem ambiente_: não permite configuração por ambiente.
- **Consequências:**
  - ✅ Consistência e filtragem fácil
  - ✅ Identificação clara de repo + ambiente
  - ✅ Compatível com pipelines Helm
  - ❌ Nomes mais longos
  - ❌ Exigência de disciplina na criação

---

## ADR-017 — Tríade de Primary Agents Golmet (gm-req, gm-doc, gm-dev)

- **Data:** 17/09/2026
- **Decisor:** Operador / <org>
- **Status:** Aceita
- **Contexto:** O primary `gm-build` acumulava responsabilidades de descoberta de negócio (forward) e documentação de código legado (reverse). O usuário propôs alinhar cada letra da sigla **Golmet** diretamente a um Primary Agent especializado:
  - **R** -> `gm-req` (Requirements)
  - **D** -> `gm-doc` (Documentation)
  - **D** -> `gm-dev` (Development)
- **Decisão:** Substituímos o `gm-build` pela Tríade Golmet:
  - `gm-req`: focado em descoberta com cliente/PO, clarificação de ambiguidades, geração de `REQUIREMENTS.md`, alinhamento de escopo e Change Requests.
  - `gm-doc`: focado em engenharia reversa de código multi-repo (IMP-013), inspeção técnica isolada via `@gm-reverse-orchestrator` com blindagem DDD e evidências, e materialização de `specs/`.
  - `gm-dev`: focado em implementação de código e testes verdes a partir de tasks aprovadas.
- **Alternativas avaliadas:**
  - _Manter gm-build com sub-modos_: sobrecarga cognitiva e mistura de posturas (descoberta vs arqueologia).
  - _gm-retro em vez de gm-doc_: menos mnemônico, quebra a simetria da sigla Golmet.
- **Consequências:**
  - ✅ Clareza cognitiva absoluta para o operador (Tab entre R, D e D)
  - ✅ Isolamento de contexto no `gm-doc` via `@gm-reverse-orchestrator`
  - ✅ Separação clara entre elicitação de negócio e arqueologia de código

---

## ADR-018 — Quadri Golmet: Expansão com o Primary `gm-devops`

- **Data:** 18/10/2026
- **Decisor:** Operador / <org>
- **Status:** Aceita
- **Contexto:** O ADR-017 registrou a Tríade (`gm-req`, `gm-doc`, `gm-dev`). O domínio DevOps (setup de VPS, pipeline de deploy, troubleshooting e observabilidade — IMP-101) cresceu sem primary próprio, e o registry/ARCHITECTURE já tratavam o workflow como "Quadri" enquanto README, glossário e footers diziam "Tríade" — documentação divergente do estado real. A mesma revisão (IMP-106) constatou duplicidade de numeração no ADR-014 (Glossário × Tríade); a entrada da Tríade foi renumerada para ADR-017.
- **Decisão:** Formalizar a **Quadri Golmet**: `gm-req`, `gm-doc`, `gm-dev` e `gm-devops`. O `gm-devops` é primary com permissão ampla no mesmo padrão da Tríade original, delegando ao `@gm-devops-orchestrator`. ADRs anteriores que citam "Tríade" permanecem imutáveis como registro histórico; a partir desta entrada, a convenção é "Quadri Golmet".
- **Alternativas avaliadas:**
  - _Manter a Tríade e rotear DevOps pelo `gm-dev`_: mistura implementação com infraestrutura e perpetua a divergência documental.
  - _Quinto primary para integrações (GitHub/Figma)_: domínios de integração são bem servidos por subagents orquestradores.
- **Consequências:**
  - ✅ Documentação alinhada ao estado real do registry (ACHADO da análise arquitetural IMP-106).
  - ✅ Onboarding e roteamento entre primaries passam a incluir a rota DevOps.
  - ❌ Referências históricas à Tríade exigem leitura contextual (ADR-017 é a origem).
  - **Errata (18/10/2026):** a cláusula "permissão ampla no mesmo padrão da Tríade original" é imprecisa para o `gm-devops` — ele mantém o escopo do IMP-103 (`edit/write: deny`, modo guiado em que o operador executa na VPS; ver PERMISSIONS.md §Primary agents, status "ajustado"). A decisão de formalizar a Quadri permanece inalterada.

---

## ADR-019 - Motor do Grafo de Conhecimento em Go (CLI `golmet graph` + tool `gm_graph`)

- **Data:** 20/11/2026
- **Decisor:** Operador (Victor Souza)
- **Status:** Aceita
- **Contexto:** A skill `gm-knowledge-graph` foi concebida com um script determinístico externo (`scripts/build-knowledge-graph.mjs`) que o runtime agêntico executa via Node (IMP-148, Node ≥ 18). O componente chegou a nascer FANTASMA (IMP-008: SKILL.md documentando um script inexistente — a skill abortava no Passo 2), foi implementada em Node no ciclo anterior e validada com fixture de 38 checks com paridade byte-a-byte contra o paliativo da sessão (183 nós · 398 arestas). A porta para dentro do binário elimina a última dependência de runtime externo do kit para trabalho determinístico e aproxima o comando dos padrões já consagrados (`validate`/`doctor`/`lint`).
- **Decisão:** Portar o motor COMPLETO (parsers T1-T5, poda, saneamento, seletor de conteúdo, 3 emissores) para **Go dentro do binário**, com três superfícies:
  - **CLI `golmet graph`** — flags `--config-root --packs-root --projects-root --out --pack --scope --max-nodes --from-json --what --json`; mesmo contrato de artefatos (`graph.json`, `knowledge-graph.html`, `knowledge-graph.md`); strict SÓ no registry (exit 1); T1-T4 ausente = aviso + grafo parcial; saída integral ou nada; sem rede; HTML self-contained com template embutido no binário.
  - **Tool MCP `gm_graph`** (15ª tool) — wrapper fino da função Go interna (mesmo padrão de `gm_validate`/`gm_doctor`); read-only nas fontes; **SEM confirm** (grava apenas os 3 artefatos no destino).
  - **Skill `gm-knowledge-graph`** — Passo 2 passa a executar `golmet graph` (ou `gm_graph`); o julgamento de ruído (Passo 3) permanece AGÊNTICO.
  - **Princípio de arquitetura (registro normativo):** *determinístico mora no CLI; o que é da organização mora no PACK (dados read-only, sem lógica); o julgamento mora no RUNTIME (skill agêntica).*
  - **Seletor de conteúdo `--what`** (intenção da tool: "grafo visual do ecossistema Golmet" — estrutura do Golmet, o pack, a docs gerada, ou tudo ao mesmo tempo):

| `what` | Stores | Conteúdo |
|---|---|---|
| `workflow` | T5 | registry (primaries, subagents, domains, skills), AGENTS.md, fundado_em |
| `pack` | T1+T2+T3 | domínios de conhecimento (staleness), patterns, rules + índice lazy |
| `docs` | T4 | módulos de produto (RNs/PENDs, ADRs, TRACEABILITY, features, specs) — combinável com `--scope <módulo>` |
| `all` (default) | T1-T5 | tudo (comportamento histórico da skill) |

Combinável com `+` (ex.: `what: workflow+pack`). **Arestas cruzadas** (`indice_lazy` T5→T3, `fundado_em` T5→T1, `aplica_em` T2→T4) só entram quando origem E destino estão selecionados.
- **Paridade:** o fixture de 38 checks da `gm-knowledge-graph` é o critério de paridade — o `graph.json` e o HTML do comando Go são **byte-idênticos** aos do extrator Node de referência (exceto `gerado_em`, normalizado; precisão de MINUTO para idempotência de saída), incluindo contagens por tipo, avisos na mesma ordem e o embed JSON do HTML. `knowledge-graph.md` diverge só na linha de proveniência ("Gerado por golmet graph (motor determinístico do kit — ADR-019)"); o baseline do md no fixture é congelado do próprio Go.
- **Alternativas avaliadas:**
  - _Híbrido MCP→node (a tool spawna `node build-knowledge-graph.mjs`)_: **REJEITADA** — contradiz o princípio acima (determinístico mora no CLI, não em um runtime externo orquestrado pelo MCP), mantém a dependência Node ≥ 18 (IMP-148) e a fragilidade de caminho de script materializado; a experiência do IMP-008 (skill documentando um script que não existia — componente fantasma) é a evidência histórica de que a indireção runtime→script é ponto único de falha silenciosa.
  - _Manter o .mjs como referência e o Go como mirror_: dois motores para manter = drift garantido; o fixture com baseline congelado do .mjs já cumpre o papel de referência sem código duplo.
  - _Skill 100% agêntica (sem motor)_: parse manual em escala pelo runtime — proibido pelo próprio modo de erro da skill (R4/IMP-148) e causa raiz do IMP-008.
- **Consequências:**
  - ✓ Node ≥ 18 deixa de ser requisito DESTA skill (IMP-148 segue válido para outros consumers, se houver)
  - ✓ 15ª tool MCP (`gm_graph`) com o mesmo contrato de confiança das demais (JSON estruturado, degradação declarada)
  - ✓ Determinismo auditável byte-a-byte entre CLI e MCP (mesma função Go)
  - ✓ A infraestrutura `files:` do renderer (ciclo anterior) permanece como capacidade genérica para skills futuras com scripts
  - ✗ O `.mjs` é REMOVIDO na mesma release — o baseline de paridade no fixture é o registro do comportamento de referência
  - ✗ Port exige disciplina de paridade a cada evolução do motor (o eval do fixture é o gate)

---

_Este arquivo é mantido pela Quadri Golmet (gm-req, gm-doc, gm-dev, gm-devops) e atualizado quando novas decisões arquiteturais são tomadas. Cada ADR é imutável após registro - decisões revistas recebem nova entrada com referência à anterior._
