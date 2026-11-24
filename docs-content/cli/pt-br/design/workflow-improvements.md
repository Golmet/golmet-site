<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a> | <a href="/docs/design/workflow-improvements">English (pointer)</a></p>

# WORKFLOW_IMPROVEMENTS.md

> Registro de melhorias aplicadas no workflow Golmet.
> Última atualização: 05/11/2026

## Formato da entrada (IMP-XXX)

Campos canônicos do cabeçalho `## IMP-NNN — <título>`:

- **Data:** DD/MM/AAAA
- **Autor:** <nome do operador — fonte: campo Nome de `rules/operator-profile.md` (IMP-136); perfil ausente → quem registrou>
- **Origem:** contexto/gatilho da melhoria
- **Arquivos:** arquivos criados/editados
- **Status:** aplicada | proposta

(O corpo é livre — Problema/Correção, Entrega, Validação, Notas, Lições.)

---

## IMP-013 — Padrão Organizacional: Unidade é o Produto

**Data:** 17/09/2026
**Origem:** Reestruturação do <docs-repo> — merge de <projeto-api> + <projeto-fe> → <cliente>, etc.
**Status:** ✅ Aplicado

### Problema

O workflow Golmet (skills, agents, AGENTS.md) assumia implicitamente que cada pasta
de projeto era uma camada técnica isolada. Isso causou:

1. Charters criados por camada (<projeto-api> e <projeto-fe> separados)
2. RNs duplicadas entre API e FE
3. INDEX.md com coluna "Tipo" (Backend/Frontend) em vez de listar repos
4. Skills de intake não perguntavam se há componentes adicionais

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `AGENTS.md` | Adicionada seção "Padrão Organizacional — Unidade é o Produto" com regras explícitas |
| `gm-project-intake/SKILL.md` | Regra de escopo: criar UM charter por produto, não por camada. Campo "Repositórios" (plural). Exemplos atualizados. |
| `gm-init/SKILL.md` | Template INDEX.md: coluna "Tipo" → coluna "Repos". Template CONSTITUTION.md: coluna "Repositórios" adicionada. |
| `gm-restructure/SKILL.md` | Novo modo "merge" para unificar pastas por camada (API/FE) em produto único. Workflow completo com 9 passos. |

### Regra Fundamental

> Crie UM charter por **produto**, não por **camada técnica**.
> Um produto pode ter N repos (API, FE, CORE, BATCHS, etc.), mas as regras
> de negócio são do produto inteiro.

### Compatibilidade

- Projetos existentes no formato antigo (<projeto-api>, <projeto-fe>) continuam
  funcionando — são projetos isolados sem par
- O modo merge do gm-restructure pode ser usado para migrar projetos que ainda
  estejam no formato antigo

---

## IMP-014 — Tríade Golmet e Engenharia Reversa Blindada

**Data:** 17/09/2026
**Origem:** Redefinição dos primary agents para Requirements, Documentation e Development.
**Status:** ✅ Aplicado

### Problema

O antigo `gm-build` acumulava descoberta de requisitos, documentação de sistemas
existentes e coordenação de specs. A documentação reversa de código também não
possuía isolamento de contexto nem exigência formal de evidências.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `agents/gm-req.md` | Novo primary para requisitos, discovery, intake, escopo e CRs. |
| `agents/gm-doc.md` | Novo primary para documentação técnica e engenharia reversa multi-repo. |
| `agents/gm-dev.md` | Escopo ajustado para Development e roteamento para `gm-req`/`gm-doc`. |
| `agents/gm-reverse-orchestrator.md` | Novo subagent read-only para varredura isolada de código, dados, APIs, UI e regras. |
| `registry.yaml` | Tríade registrada e delegações redistribuídas; reverse registrado sob `gm-doc`. |
| `ARCHITECTURE.md` | Views atualizadas com os 3 primaries e o subagent reverse. |
| `AGENTS.md`, `README.md`, `GLOSSARY.md` | Governança e onboarding atualizados para a Tríade Golmet. |
| `gm-registry-render` | Views passam a considerar `gm-req.md` e `gm-doc.md`. |

### Guardrails Anti-Alucinação

- Varredura reversa em contexto isolado via `@gm-reverse-orchestrator`.
- Processamento fatiado: stack/contextos, dados/agregados, API/UI e regras/eventos.
- DDD usado como filtro estrutural: Bounded Contexts, Aggregate Roots, Domain Events e Linguagem Ubíqua.
- Toda RN candidata exige evidência verificável no formato `[arquivo:linha]`.
- Achados sem evidência são classificados como `PEND-XXX`, nunca como fato.

### Compatibilidade

- `gm-build.md` foi removido e substituído por `gm-req.md`, `gm-doc.md` e `gm-dev.md`.
- O fluxo de implementação continua no `gm-dev`; requisitos e documentação agora têm fronteiras explícitas.

---

## IMP-015 — Componentes Transversais da Tríade Golmet

**Data:** 17/09/2026
**Origem:** Análise das fronteiras dos primaries `gm-req`, `gm-doc` e `gm-dev`.
**Status:** ✅ Aplicado

### Decisão

Os seguintes subagents ficam disponíveis para os três primaries:

- `gm-next`
- `gm-progress`
- `gm-cr-propagation-guard`
- `gm-workflow-builder`
- `gm-workflow-improver`

### Motivo

Esses componentes não representam uma fase específica do Golmet:

- `gm-next` recomenda a próxima ação em qualquer fase;
- `gm-progress` consolida o estado de qualquer produto;
- `gm-cr-propagation-guard` verifica staleness após mudanças em qualquer fluxo;
- `gm-workflow-builder` cria componentes para qualquer domínio;
- `gm-workflow-improver` diagnostica falhas em qualquer primary, subagent ou skill.

### Limite da mudança

O campo `registered_by` continua indicando o owner administrativo legado.
O schema `owner` + `available_to` foi introduzido pela IMP-016, com migração
compatível e validações no registry-render.

---

## IMP-016 — Separação entre Owner e Disponibilidade

**Data:** 17/09/2026
**Origem:** Evolução da IMP-015 para distinguir ownership administrativo de disponibilidade operacional.
**Status:** ✅ Aplicado em migração compatível

### Decisão

Cada subagent passa a ter dois campos explícitos:

- `owner`: primary responsável pela manutenção administrativa;
- `available_to`: primaries autorizados a delegar o subagent.

O campo `registered_by` permanece temporariamente como legado e deve coincidir
com `owner` durante esta fase de migração.

### Validações adicionadas

- Owner precisa existir em `primary_agents`.
- Cada item de `available_to` precisa existir em `primary_agents`.
- Todo subagent delegado deve estar disponível para o primary que o delega.
- Nenhum subagent pode ficar sem owner ou sem disponibilidade declarada.

---

## IMP-017 — Auditoria dos Componentes contra Ownership

**Data:** 17/09/2026
**Origem:** Auditoria global de agents e skills após a introdução de `owner` e `available_to`.
**Status:** ✅ Aplicado

### Adaptações

- `gm-registry-render` passou a considerar os três primary agents e a renderizar
  owner/disponibilidade nas views.
- `gm-wiki-lint` passou a validar owner, `available_to` e delegações compatíveis.
- `gm-agent-health-monitor` passou a verificar ownership e disponibilidade durante
  o health check dos agents.
- `gm-primary-agent-creator`, `gm-subagent-creator` e `gm-workflow-builder`
  passaram a considerar `gm-dev.md` e o novo modelo de registry.
- A relação `accessed_by`, que não existe no schema atual, foi removida das
  instruções do builder para evitar referência a campo inexistente.

### Resultado da auditoria

- Nenhum agent Golmet dependia operacionalmente de `gm-build`.
- Nenhuma skill Golmet precisava de ownership próprio no modelo atual.
- Skills continuam sendo catalogadas por domínio; ownership/disponibilidade
  permanece aplicável aos subagents.

---

## IMP-018 — Skill de Sincronização de AGENTS.md por Produto

**Data:** 17/09/2026
**Origem:** Substituição da referência órfã `agents-md-sync` por uma capacidade implementada.
**Status:** ✅ Aplicado

### Decisão

Foi criada a skill `gm-agents-md-sync`, roteada pelo `gm-doc`, para auditar e
sincronizar instruções `AGENTS.md` entre os repos de um mesmo produto.

### Guardrails

- Auditoria read-only antes de qualquer edição;
- classificação entre regras comuns, específicas, conflitantes, ausentes e ambíguas;
- evidência da origem de cada regra comum proposta;
- diffs separados por repositório;
- confirmação explícita antes de editar;
- preservação de regras específicas de API, FE, CORE e demais repos;
- nunca sobrescrever um `AGENTS.md` inteiro automaticamente.

### Migração

- Removida a referência inexistente `agents-md-sync` do registry e das views;
- adicionada `gm-agents-md-sync` ao domínio transversal;
- `gm-doc` passou a invocar a nova skill diretamente;
- a skill usa o prefixo Golmet e possui arquivo físico validável.

---

## IMP-019 — Convenção de Migrações EF Core no Playbook .NET

**Data:** 19/09/2026
**Origem:** Incidente <cliente> — migrações hand-written silenciosamente ignoradas pelo EF Core (bloqueio de geração e risco de quebra de deploy em ambiente novo).
**Status:** ✅ Aplicado

### Problema

O playbook `gm-stack-dotnet-csharp` documentava comandos de migrações, mas não a
convenção crítica de descoberta. Incidente real (<cliente>):

1. Migrações escritas à mão sem `[DbContext(typeof(...))]` eram **silenciosamente
   ignoradas** pela descoberta do EF Core (`MigrationsAssembly.AddMigrationsFromAssembly`
   filtra por `GetDbContextType(t) == _contextType` **antes** de qualquer log — sem
   `[DbContext]`, a migração nunca é vista por `Database.MigrateAsync()`,
   `dotnet ef migrations list` nem pelo designer).
2. Migrações órfãs (`AddIngestionJobs`, `AddChunkOrder`) existiam apenas no histórico
   `__EFMigrationsHistory` — sem fonte no repo. Um deploy em ambiente novo quebraria.
3. Snapshot defasado mascarado por `Ignore(RelationalEventId.PendingModelChangesWarning)`
   em `DependencyInjection.cs` — supressão que escondia drift modelo ↔ snapshot.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `gm-stack-dotnet-csharp/SKILL.md` | Seção "Convenção de migrações (crítica)" após "Pré-verificação de ambiente" (EF Core — Migrações): dois atributos obrigatórios, pasta única, `has-pending-model-changes` antes de commit, proibição de suprimir `PendingModelChangesWarning`, rebuild de `dotnet watch` via `dotnet build` no container. |
| `gm-stack-dotnet-csharp/SKILL.md` | Pitfall 13: migrações órfãs no `__EFMigrationsHistory` — cruzar `dotnet ef migrations list` com o histórico do banco antes de deploy em ambiente novo. |

### Regra Fundamental

> Migrações EF Core **sempre** via `dotnet ef migrations add`. Toda migração
> hand-written exige `[DbContext(typeof(...))]` **e** `[Migration("id")]` —
> sem o primeiro o EF Core silenciosamente ignora a migração na descoberta.

### Aplicação de referência

- Repo <cliente>: `AGENTS.md` (seção "Migrações (EF Core)"), migrações hand-written
  corrigidas com ambos os atributos, fontes órfãs recriadas, snapshot regenerado,
  `PendingModelChangesWarning` deixado de ser suprimido.
- Fonte técnica: `dotnet/efcore` — `MigrationsAssembly.cs`
  (filtro `GetDbContextType(t) == _contextType` no `where` + warning para
  `[Migration]` ausente).

### Avaliações

- `gm-skill-eval`: **executado em 21/09/2026** — fixture criada: `evals/gm-stack-dotnet-csharp/fixture-001/` (9/9 PASS). Cobre: atributos `[DbContext(typeof(...))]` e `[Migration("<id>")]` na migração corrigida, ausência de `PendingModelChangesWarning` em código, e seção "## Migrações (EF Core)" no AGENTS.md com `dotnet ef migrations add`, `has-pending-model-changes` e proibição de supressão.

---

## IMP-019b — Pendências da Sessão (1/2 fechada em 21/09/2026)

- [x] Criar fixtures de eval para `gm-stack-dotnet-csharp` cobrindo a convenção de migrações — **fechada em 21/09/2026**: `evals/gm-stack-dotnet-csharp/fixture-001/` (9/9 PASS), junto com `evals/mcp-postgres-setup/fixture-001/` (11/11 PASS) e `evals/gm-setup/fixture-001/` (8/8 PASS); incluiu correção de descoberta no runner para skills sem prefixo `Golmet-` (ver IMP-023).
- [ ] Reiniciar sessão do OpenCode para carregar a SKILL.md atualizada (ação do usuário).

---

## IMP-020 — Sincronização de Fonte antes da Engenharia Reversa

**Data:** 19/09/2026
**Origem:** Dúvida do usuário durante a documentação do <produto-hub> ("antes de documentar, você entra na main e dá pull?").
**Status:** ✅ Aplicado

### Problema

O fluxo de documentação (`gm-doc` → `@gm-reverse-orchestrator`) não exigia sincronização
dos repositórios de código antes da varredura reversa. Documentar sem `git pull` analisa
uma instância possivelmente desatualizada: RNs induzidas de regras já removidas ou
alteradas, evidências `[arquivo:linha]` inválidas no HEAD e `LEGACY_CONTEXT.md` descrevendo
arquitetura defasada. Sem registro do commit hash, a evidência não é congelada.

### Causa raiz

Instrução ausente (categoria: passo faltante no Workflow):
- `agents/gm-doc.md`: a Etapa 2 ia direto à convocação do subagent, sem passo de sincronização.
- `agents/gm-reverse-orchestrator.md`: lia código sem exigir referência de commit — e não
  poderia sincronizar, pois tem `bash: deny` no front matter.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `agents/gm-doc.md` | Etapa 2: novo Passo 0 "Sincronização de Fonte (obrigatória)" — `git fetch origin` + checkout da branch principal + `pull --ff-only` (nunca force/reset) em cada repo; working tree sujo/divergente → NÃO forçar, perguntar via `question`; registrar HEAD (`rev-parse --short HEAD`) e passar os hashes ao subagent. Explicitado que sincronização é leitura/atualização e NÃO viola a regra de nunca editar repos de código. |
| `agents/gm-reverse-orchestrator.md` | Novo Princípio 6 "Fonte congelada": análise corresponde aos commits informados no prompt; subagent não executa git (`bash: deny`); hashes ausentes → sinalizar no relatório. §1 do formato de saída: linha obrigatória "Commits de referência" com aviso ⚠️ quando ausentes. |

### Regra Fundamental

> Nenhuma análise de engenharia reversa é executada sobre código não sincronizado.
> Toda varredura reversa registra os commit hashes analisados — evidência congelada.

### Compatibilidade

- Nenhuma mudança de delegação: `registry.yaml`, `ARCHITECTURE.md` e views intocados.
- Evals não aplicáveis: mudanças em agents (não em skills).

---

## IMP-021 — Suporte a Configuração Global de MCP PostgreSQL

**Data:** 19/09/2026
**Origem:** Pedido do usuário — transformar a experiência do MCP PostgreSQL do <cliente> em skill de setup global ("configurar para qualquer outro projeto só que globalmente no opencode").
**Status:** ✅ Aplicado (revertido para escopo por projeto — ver Decisão)

### Decisão

Após aplicar o suporte global, o usuário reverteu a decisão: **MCP de banco deve ficar sempre no escopo do projeto** (`.opencode/opencode.json`), nunca global. Justificativa: MCP global fica ativo em todas as sessões do OpenCode — inclusive em projetos que não usam banco — consumindo tokens de contexto desnecessariamente. A skill agora documenta essa regra como padrão (nota no Passo 4, item em "Nunca edita" e caso de borda orientando a explicar o trade-off se o usuário pedir global).

### Problema

A skill `mcp-postgres-setup` não incorporava o caso de referência validado (<cliente>) e não seguia o padrão Golmet de seções (Lê/Gera/Nunca edita, Modo de erro, Casos de borda).

### Causa raiz

Skill sem as seções padrão Golmet e sem exemplo de referência validado.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `skills/mcp-postgres-setup/SKILL.md` | Passo 4 mantido por projeto, com nota explicando por que NÃO configurar global (economia de tokens — MCP ativo em todas as sessões). |
| `skills/mcp-postgres-setup/SKILL.md` | Nova seção "Exemplo de referência validado (<cliente>)" com lições de segurança (ro default, keyring, tabelas-chave no AGENTS.md). |
| `skills/mcp-postgres-setup/SKILL.md` | Novas seções padrão Golmet: Lê/Gera/Nunca edita (com "nunca edita config global"), Modo de erro, Casos de borda (inclui tratamento de pedido de MCP global). Marcador de exemplo generalizado para `<!-- postgres-mcp -->`. |

### Compatibilidade

- Nenhuma mudança de delegação: registry.yaml e ARCHITECTURE.md intocados.
- A config global `opencode.jsonc` NÃO é alterada pela skill — e agora a skill explicitamente proíbe editá-la para MCP de banco.

### Evals

- `gm-skill-eval`: **executado em 21/09/2026** — fixture criada: `evals/mcp-postgres-setup/fixture-001/` (11/11 PASS). Cobre: `.opencode/opencode.json` no escopo do projeto (não global — `not_contains` de `.config/opencode` e de `password`), `--access-mode ro`, e bloco `<!-- postgres-mcp -->` no AGENTS.md com `access_mode: ro`, `postgres_mcp_query` e `postgres_mcp_modify`. Exigiu correção no runner (ver IMP-023).

## IMP-022 — Validação do Runtime Jev no gm-setup

**Data:** 21/09/2026
**Origem:** Sessão de publicação da config — o agente `gm-jev-classifier` e as skills que o invocam (`gm-decision-audit`, `gm-quality-gates`) são versionados no repo, mas a tool `jev_classify` é runtime da instalação do OpenCode (não vive em `opencode.jsonc` nem `settings.json`). Máquinas novas recebem o agente via `gm-self-update`, porém sem garantia de que o runtime existe — a classificação falharia em produção do fluxo.
**Status:** ✅ Aplicado

### Problema

O wizard `gm-setup` validava mvn/ng/JDK/git mas não detectava a ausência do runtime Jev — o onboarding reportava sucesso com a camada semântica do Golmet silenciosamente quebrada.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-setup/SKILL.md` | Passo 6 (Validar ambiente): nova linha na tabela — "Jev runtime": confirmação da tool `jev_classify` disponível na sessão. |
| `skills/gm-setup/SKILL.md` | Caso de borda: Jev ausente **não bloqueia** o setup — pendência registrada no relatório com aviso de degradação ("skills de calibração semântica degradam para opinião do modelo"). |

### Compatibilidade

- Nenhuma mudança de delegação: registry.yaml e ARCHITECTURE.md intocados.
- Skills consumidoras (`gm-decision-audit`, `gm-quality-gates`) intocadas — já possuem fallback sem Jev.

### Evals

- `gm-skill-eval`: **executado em 21/09/2026** — fixture criada: `evals/gm-setup/fixture-001/` (8/8 PASS). Cobre os artefatos persistidos (bloco `<!-- projeto-padrao -->` no AGENTS.md, `external_directory` + overrides `gm-dev-backend`/`gm-dev-frontend` no opencode.jsonc). A validação Jev vive no relatório textual (não persiste arquivo) — não verificável por check de arquivo, por design.

## IMP-023 — Descoberta de Fixtures para Skills sem Prefixo Golmet-

**Data:** 21/09/2026
**Origem:** Criação das fixtures do IMP-019b — a fixture `evals/mcp-postgres-setup/fixture-001/` executava 0 checks: o `run-evals.ps1` filtra diretórios por `-like 'Golmet-*'` e a skill `mcp-postgres-setup` (única sem o prefixo) ficava invisível. O twin `run-evals.sh` já era genérico.
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/run-evals.ps1` | Descoberta: filtro passa a aceitar também `mcp-postgres-setup`. |
| `evals/run-evals.ps1` | Flag `-Changed`: regexes de `evals/` e `skills/` generalizados para qualquer skill com fixture (targets continuam filtrados por existência de fixture, alinhado ao comportamento do `.sh`). |

### Compatibilidade

- Nenhuma mudança de schema de criteria.yaml nem de checks — fixtures Golmet-* existentes não são afetadas.
- Suite completa validada após a correção: 296/296 PASS (268 antes + 28 das 3 fixtures novas).

### Evals

- O próprio runner é o objeto desta melhoria — validado com suite completa `--all` verde.

## IMP-024 — Cobertura de Evals dos Stack Playbooks (angular, java-quarkus, rust)

**Data:** 21/09/2026
**Origem:** Auditoria de cobertura de evals — 55 skills versionadas, 24 com fixtures (44%). Os 3 stack playbooks restantes ficaram sem cobertura após a fixture do dotnet-csharp (IMP-019b), apesar de serem os que previnem incidentes da mesma categoria (convenções críticas de build/schema por stack).
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/gm-stack-angular/fixture-001/` | 10 checks: Reactive Forms (FormBuilder/Validators.required), sem `alert()` no component, `formControlName` no template sem `[(ngModel)]`, seção "## Formulários (Angular)" no AGENTS.md com referência a UI_SPEC. |
| `evals/gm-stack-java-quarkus/fixture-001/` | 7 checks: migração `V2__add_status_to_pedidos.sql` criada em db/migration, DDL manual removida (`not_file_exists`), V1 preservado, seção "## Migrações (Flyway)" com "nunca DDL manual" e `mvn verify`. |
| `evals/gm-stack-rust/fixture-001/` | 9 checks: `tokio::sync::Mutex` (sem `std::sync::Mutex`), `anyhow::Result` com `.lock().await`, sem `.unwrap()`, seção "## Qualidade (Rust)" com `cargo clippy -- -D warnings` e `thiserror`. |

### Compatibilidade

- Nenhuma mudança de skills/runner — fixtures seguem o schema e o molde da IMP-019b.
- Suite: 296 → 322 checks, 322/322 PASS em run-evals.ps1 e run-evals.sh.

### Evals

- O próprio objeto desta melhoria. Cobertura global: 27/55 skills (49%).

## IMP-025 — Leva 2 de Evals: decision-log, governance e figma-prompt

**Data:** 21/09/2026
**Origem:** Continuação da auditoria de cobertura iniciada na IMP-024 — três skills de baixo esforço de fixture (formatos análogos aos já cobertos) elevam a cobertura de 27/55 para 30/55 skills (55%).
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/gm-decision-log/fixture-001/` | 8 checks: DEC-002 adicionada com merge incremental (DEC-001 preservada), template completo (Status active, Alternativas consideradas, Justificativa), id_sequence de DEC e cross_ref de RN contra REQUIREMENTS. |
| `evals/gm-governance/fixture-001/` | 7 checks: princípio defasado (pastas por camada) substituído por "Unidade é o Produto" (IMP-013), listagem de repos preservada, e PRODUCT_GOAL.md ausente permanece ausente (`not_file_exists` — skill só revisa, não cria). |
| `evals/gm-figma-prompt/fixture-001/` | 7 checks: specs/FIGMA_PROMPTS.md com front matter e seção "## Prompt — " (modo: completo), instrução "Não incluir" presente, sem vazamento de endpoint técnico (`not_contains` "POST /api"), line_count_range. |

### Compatibilidade

- Nenhuma mudança de skills/runner — fixtures seguem o schema existente.
- Suite: 322 → 344 checks, 344/344 PASS em run-evals.ps1 e run-evals.sh.

### Evals

- O próprio objeto desta melhoria. Cobertura global: 30/55 skills (55%).

## IMP-026 — Convenção de Avaliação de Skills de Estado e --save no gm-next

**Data:** 21/09/2026
**Origem:** Leva 3 da auditoria de cobertura — skills de estado/orquestração eram consideradas "não avaliáveis" por serem (ou parecerem) read-only. Auditoria dos contratos mostrou dois casos distintos: skills que já persistem relatório (`gm-cr-propagation-guard` → `quality/PROPAGATION_STATUS.md`; `gm-progress --save` → `quality/PROGRESS_REPORT.md`) são avaliáveis diretamente; e `gm-next` era read-only puro ("nunca escreve arquivos"), sem forma de verificação determinística.
**Status:** ✅ Aplicado

### Decisão de Design

Skills de estado são avaliáveis pelo schema existente quando possuem artefato persistido. Para skills de consulta read-only, adota-se a convenção de **persistência opcional por flag `--save`** (precedente: `gm-progress`), que não altera o comportamento default e dá à recomendação valor autônomo (histórico e diff entre execuções).

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-next/SKILL.md` | Flag `--save` opcional: grava `quality/NEXT_RECOMMENDATION.md` (front matter com generated_at, seção Recomendação em tabela Prioridade/Skill/Motivo, Estado analisado). Passo 8 no workflow e template. Default inalterado: sem `--save`, nada é escrito. |
| `evals/gm-cr-propagation-guard/fixture-001/` | 9 checks: PROPAGATION_STATUS.md com Pendentes (DATA_MODEL stale) e Resolvidos (API_CONTRACTS), table_has_columns, cross_ref contra CHANGE_REQUESTS. |
| `evals/gm-progress/fixture-001/` | 7 checks: PROGRESS_REPORT.md (--save) com 4 blocos, fase Quality 3/4 apontando VALIDATION_REPORT ausente, cross_ref de RNs. |
| `evals/gm-next/fixture-001/` | 7 checks: NEXT_RECOMMENDATION.md (--save, IMP-026) recomendando gm-data-model como próximo passo natural da DAG. |

### Compatibilidade

- `gm-next` sem `--save`: comportamento idêntico ao anterior (zero risco para chamadas existentes).
- Nenhuma mudança de registry ou delegação. Suite: 344 → 367 checks, 367/367 PASS em ambos os runners.

### Evals

- O próprio objeto desta melhoria. Cobertura global: 30/55 → 33/55 skills (60%).

## IMP-027 — Check registry_consistency no Runner de Evals

**Data:** 21/09/2026
**Origem:** Leva 4 da auditoria — a consistência entre `registry.yaml` (fonte da verdade) e os arquivos em `agents/`/`skills/` só era verificável via `gm-agent-health-monitor` em sessão interativa. Passa a rodar no runner determinístico e no CI, junto com a suite de fixtures.
**Status:** ✅ Aplicado

### Decisão de Design

Consistência de registry não é conceito de fixture — é validação do próprio repo. Por isso virou um **modo** dos runners (`-Registry` / `--registry`), não um tipo de check em criteria.yaml. Emite pelos mesmos canais (RESULTS/CKS, relatório, trends, exit code) com Skill=`_registry`.

### Checks (5)

| Check | Valida |
|-------|--------|
| `registry:referencias_resolvem` | Toda referência (`delegates`, `invokes_direct`, `invokes`, `available_to`, `owner`, `registered_by`, `orchestrator`) resolve para um id registrado; `orchestrator: null` é legítimo (domains sem orquestrador) |
| `registry:agentes_em_disco_registrados` | Todo `agents/Golmet-*.md` em disco tem id em primary_agents/subagents |
| `registry:agentes_registrados_tem_arquivo` | Todo id de agente tem `agents/<id>.md` |
| `registry:skills_em_disco_registradas` | Todo dir `skills/Golmet-*/` tem id na seção skills |
| `registry:skills_registradas_tem_skill_md` | Todo id de skill tem `skills/<id>/SKILL.md` |

### Achado Imediato (prova de valor)

Na primeira execução o check reprovou 3 componentes com **dupla natureza não registrada**: `gm-next`, `gm-progress` e `gm-cr-propagation-guard` existem como subagent E como skill em disco, mas constavam apenas em `subagents:`. Registry corrigido com duplo registro (seção Meta). Também documentado no `gm-skill-eval` e no CI (passo próprio).

### Compatibilidade

- Nenhuma fixture afetada — suite completa segue 367/367. Modo opt-in (`--registry`), default dos outros modos inalterado.
- Paridade ps1/sh validada: mesmos 5 resultados nos dois runners.

## IMP-028 — Leva 5 de Evals: Suporte Reativo (6 skills)

**Data:** 21/09/2026
**Origem:** Meta de 80% de cobertura (44/55). A auditoria anterior subestimou o grupo "reativo/evento": relendo os contratos, quase todas essas skills persistem artefato com nome ou local fixo, sendo plenamente avaliáveis pelo schema existente.
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/gm-known-error/fixture-001/` | 8 checks: KE-002 em merge incremental (KE-001 preservado), Workaround + Status workaround, referência a ERR-001 do catálogo (regra "referencie, não duplique"), id_sequence. |
| `evals/gm-incident-postmortem/fixture-001/` | 5 checks: arquivo com timestamp verificado por contains em diretório (Post-Mortem, Timeline, Impacto, front matter). |
| `evals/gm-drift-detector/fixture-001/` | 7 checks: baseline atualizado com medição #3 (histórico #1 preservado), table_has_columns das métricas, report com seção Recomendações/Skill corretiva. |
| `evals/gm-metrics-collector/fixture-001/` | 6 checks: linha CONTATOS adicionada, histórico CATALOGO preservado, colunas da tabela, front matter. |
| `evals/gm-handover/fixture-001/` | 7 checks: HANDOVER_LOG.md append-only com veredito "em andamento" e justificativa. |
| `evals/gm-howto/fixture-001/` | 8 checks: howto em docs/howto/ com Objetivo/Passo a Passo, linguagem de usuário (not_contains "endpoint"). |

### Compatibilidade

- Nenhuma mudança de skills/runner. Artefatos com timestamp no nome (INCIDENT_*, DRIFT_REPORT_*) verificados via contains em diretório — o schema existente comporta.
- Suite: 367 → 408 checks, 408/408 PASS em run-evals.ps1 e run-evals.sh.

### Evals

- O próprio objeto desta melhoria. Cobertura global: 33/55 → 39/55 skills (71%).

## IMP-029 — Leva 6 de Evals: Ciclo de Vida e Criadores (5 skills)

**Data:** 21/09/2026
**Origem:** Meta de 80% de cobertura (44/55). Skills de ciclo de vida de projeto (retrospectiva, padrões, migração, init) e criação de subagent — todas persistem artefato com nome/lugar fixo, avaliáveis pelo schema existente.
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/gm-project-retrospective/fixture-001/` | 7 checks: RETROSPECTIVE.md com O que funcionou, O que não funcionou, Padrões extraídos. |
| `evals/gm-pattern-extractor/fixture-001/` | 7 checks: 2 padrões criados (telefone-normalizado, remocao-explicita) com PATTERN.md + INDEX.md atualizado (histórico preservado). |
| `evals/gm-migration/fixture-001/` | 7 checks: MIGRATION.md com Escopo, UP, DOWN, Rollback. |
| `evals/gm-init/fixture-001/` | 7 checks: CONSTITUTION.md + INDEX.md com CONTATOS adicionado, CATALOGO preservado. |
| `evals/gm-subagent-creator/fixture-001/` | 7 checks: agents/gm-coverage-auditor.md com front matter, Tools, Modo de erro. |

### Compatibilidade

- Suite: 408 → 443 checks, 443/443 PASS em run-evals.ps1 e run-evals.sh.

### Evals

- O próprio objeto desta melhoria. Cobertura global: **39/55 → 44/55 skills (80%)**.

## IMP-030 — Leva Final: Health Monitor, Primary/Skill Creator e Registry Render

**Data:** 21/09/2026
**Origem:** Pergunta do usuário "podemos aumentar a cobertura?" — análise das 11 skills restantes mostrou 4 avaliáveis (as demais 7 são por design não determinísticas: git ops, meta-circular, SDK-dependente, human-in-loop).
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/gm-agent-health-monitor/fixture-001/` | 5 checks: relatório com scores de saúde, checklist (front matter, registro cruzado, portabilidade). |
| `evals/gm-primary-agent-creator/fixture-001/` | 7 checks: agents/gm-coverage-auditor.md com front matter, Subagents e roteamento, Modo de erro. |
| `evals/gm-skill-creator/fixture-001/` | 8 checks: skills/gm-coverage-audit/SKILL.md com Lê/Gera/Nunca edita, Modo de erro. |
| `evals/gm-registry-render/fixture-001/` | 6 checks: ARCHITECTURE.md regenerado com flowchart Mermaid e tabelas a partir de registry.yaml minimal. |

### Compatibilidade

- Suite: 443 → 469 checks, 469/469 PASS em ambos os runners.

### Evals

- Cobertura global: **44/55 → 48/55 skills (87%)**.
- Skills sem cobertura (7, 13%): agents-md-sync, quality-gates, restructure, self-publish, self-update, skill-eval, skill-evolution — todas por design não avaliáveis deterministicamente.

---

## IMP-031 — Fluxo de Triagem de PENDs no gm-clarify + Guardrail de Classificação Explícita

**Data:** 21/09/2026
**Origem:** Incidente durante triagem de PENDs do <cliente> — 13 PENDs classificados como "dev direto" sem aprovação explícita do usuário (inferência por omissão).
**Status:** ✅ Aplicado

### Problema

A skill `gm-clarify` foi projetada exclusivamente para scoring de ambiguidade em **novos requisitos**. Quando usada para triar PENDs já existentes, não havia fluxo dedicado — o agente recorreu à inferência por omissão (PENDs não selecionados = dev direto), violando o princípio de Ambiguidade Zero.

### Causa raiz

1. **Instrução ausente** — `gm-clarify/SKILL.md`: sem workflow de triagem de PENDs existentes
2. **Instrução ausente** — `agents/gm-req.md`: sem princípio contra inferência por omissão
3. **Visibilidade** — `AGENTS.md`: sem regra global visível para todos os agents

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-clarify/SKILL.md` | +Novo fluxo "Triagem de PENDs Existentes" com 7 passos: cada PEND apresentado individualmente, classificação explícita (dev direto / aguarda decisão / já resolvido / outro), confirmação obrigatória, rastreabilidade com timestamp e responsável. +Template de seção "Triagem de PENDs" no checkpoint. |
| `agents/gm-req.md` | +Princípio 5 "Classificação Explícita de PENDs": nunca classificar como dev direto sem aprovação explícita; inferência por omissão proibida. |
| `AGENTS.md` | +Regra global na descrição do `gm-req`: "nunca classifica PENDs como dev direto sem aprovação explícita do usuário. Cada PEND é apresentado individualmente com opções de destino. Inferência por omissão é proibida." |

### Regra Fundamental

> Toda classificação de PEND deve ser explícita. Nenhum PEND pode ser classificado sem que o usuário tenha visto e escolhido seu destino. Inferência por omissão é proibida.

### Pendências

- [ ] Re-executar triagem dos PENDs do <cliente> com o fluxo corrigido (checkpoint `2026-09-21-03.md`)
- [ ] Publicar as alterações do workflow via `gm-self-publish`

---

## IMP-032 — Tasks por Sprint: subpastas `delivery/<YYYY-MM>/`

**Data:** 22/09/2026
**Origem:** Solicitação do usuário Michel — mudança de convenção estrutural: tasks organizadas em subpastas de sprint dentro de `delivery/`, nomeadas `YYYY-MM` (ano com 4 dígitos + hífen + mês com 2 dígitos, ex.: janeiro → `2026-01`; setembro de 2026 → `2026-09`).
**Status:** ✅ Aplicado — ⚠️ SUPERADA pela IMP-034 (22/09/2026): tasks não vivem mais em subpastas de sprint; ordem de resolução substituída; leitura de legado preservada como fallback.

### Decisão (convenção canônica)

- **Tasks:** `delivery/<YYYY-MM>/TASKS.md` (e variantes `TASKS-*.md`/`TASKS_*.md` da sprint). `YYYY-MM` = mês da sprint corrente.
- **Ordem de resolução para LEITORES de TASKS.md:** (1) `delivery/<YYYY-MM corrente>/TASKS.md`; (2) pasta de sprint mais recente existente em `delivery/` (glob `delivery/[0-9][0-9][0-9][0-9]-[0-9][0-9]/`); (3) fallback legado `delivery/TASKS.md`; (4) raiz do módulo.
- **Permanecem na raiz de `delivery/`:** TASKS_AZURE_CONSOLIDADO.md, SCOPE_AGREEMENT.md, CLIENT_REQUIREMENTS.md, CLIENT_REPORT_*.md, HANDOVER_LOG.md — artefatos vivos/consolidados, não por sprint.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-task-spec/SKILL.md` | Gera em `delivery/<YYYY-MM>/TASKS.md`; inventário IMP-011 dividido (`delivery/<YYYY-MM>/` × raiz de `delivery/`); novo parágrafo "Pasta de sprint (IMP-032)" com ordem de resolução; Fase 3 deriva a sprint do mês corrente (sem pergunta extra); "Nunca edita" protege tasks de sprints anteriores; Modo de erro e Casos de Borda atualizados; commit message menciona a sprint. |
| `skills/gm-gh-issue-creator/SKILL.md` | Nova seção "Localização do TASKS.md (IMP-032)" com ordem de resolução; Lê/Gera, Modo de erro e Passos 2 e 6 atualizados; ISSUES_CREATED.md na mesma pasta de sprint do TASKS.md lido. |
| `skills/gm-init/SKILL.md` | Árvores de estrutura (seção IMP-011 e template INDEX.md) com `delivery/<YYYY-MM>/TASKS*`; nota "Tasks por sprint (IMP-032)" com o formato. |
| `skills/gm-restructure/SKILL.md` | Mapeamento IMP-011 dividido: tasks da sprint → `delivery/<YYYY-MM>/` (mês corrente ou inferível, confirmado no preview); nota "Subpastas de sprint (IMP-032)"; reescrita de links `](TASKS.md` → `](delivery/<YYYY-MM>/TASKS.md`; caso de borda para sprint indeterminável. |
| `agents/gm-dev.md` | Início de sessão lê `delivery/<YYYY-MM>/TASKS.md` com fallback (sprint corrente → mais recente → legado). |
| `agents/gm-dev-backend.md` | Lê (upstream): `delivery/<YYYY-MM>/TASKS.md` com fallback. |
| `agents/gm-dev-frontend.md` | Idem ao backend (prefixo `[<repo>.MFE]`). |
| `agents/gm-progress.md` | Lê (upstream) e Bloco E localizam tasks conforme IMP-032 (corrige também referência antiga `<module-root>/TASKS.md`, pré-IMP-011). |
| `agents/gm-github-orchestrator.md` | Parâmetro de caminho do TASKS.md documentado como `delivery/<YYYY-MM>/TASKS.md` (sprint corrente). |
| `agents/gm-req.md` | Menção a tasks atualizada para `delivery/<YYYY-MM>/TASKS*.md`. |

### Pendências (não bloqueantes)

- **Linha de inventário boilerplate:** ~28 skills read-only repetem a linha descritiva `- **delivery/:** TASKS.md, TASKS_*.md, TASKS_AZURE_CONSOLIDADO.md, ...` (herdada da IMP-011) sem lógica de resolução de caminho — impacto apenas documental, nenhuma delas escreve ou resolve TASKS.md. Lista: gm-acceptance-criteria, gm-agent-health-monitor, gm-api-contracts, gm-architecture, gm-change-request, gm-client-requirements, gm-cr-propagation-guard, gm-data-model, gm-decision-audit, gm-decision-log, gm-drift-detector, gm-figma-prompt, gm-glossary, gm-handover, gm-howto, gm-incident-postmortem, gm-known-error, gm-legacy-context, gm-migration, gm-next, gm-progress (skill), gm-requirements, gm-scope-agreement, gm-test-strategy, gm-traceability, gm-ui-spec, gm-validate, gm-wiki-lint. Substituição canônica sugerida (batch futuro): `- **delivery/:** tasks por sprint em subpastas YYYY-MM (ex.: 2026-09/TASKS.md — IMP-032); TASKS_AZURE_CONSOLIDADO.md, SCOPE_AGREEMENT.md, CLIENT_REQUIREMENTS.md, CLIENT_REPORT_*.md, HANDOVER_LOG.md na raiz`.

### Compatibilidade

- **Retrocompatibilidade de leitura garantida:** todo leitor resolve sprint corrente → sprint mais recente → `delivery/TASKS.md` legado → raiz. Módulos existentes com tasks flat em `delivery/` continuam funcionando sem migração.
- **Módulos existentes no <docs-repo>** com tasks em `delivery/` (ex.: `<cliente>/delivery/TASKS-M4-COMANDAS.md`) podem ser migrados para subpastas de sprint via `gm-restructure` (mapeamento atualizado) — migração sob demanda, não automática.
- Nenhuma mudança de delegação: registry.yaml e ARCHITECTURE.md intocados.
- Evals: `gm-task-spec` (3 fixtures) e `gm-init` (1 fixture) são afetados pelo novo caminho de saída — rodar `gm-skill-eval --skill gm-task-spec` e `--skill gm-init` na próxima leva; se os `output-expected` referenciarem caminho flat, atualizar baseline somente com diff aprovado pelo usuário.
- **Baselines atualizados (22/09/2026, diff aprovado pelo usuário Michel):** fixtures 1 e 2 de `gm-task-spec` tiveram `output-expected/delivery/TASKS.md` movido para `output-expected/delivery/2026-09/TASKS.md`; `criteria.yaml` das 3 fixtures atualizado (`path: "delivery/2026-09/TASKS.md"`); `reference_match` da fixture-001 agora aponta explicitamente para `output-expected/delivery/2026-09/TASKS.md` (antes caía no fallback trivial). Validação: `run-evals.ps1 --skill gm-task-spec` → 23 PASS / 0 FAIL. Observação: o runner determinístico valida em baseline-mode (não executa a skill) — baselines fixam a sprint `2026-09` como referência; levas futuras em mês diferente exigirão re-pinagem do baseline ou execução via sandbox de agente.

---

## IMP-033 — Invariante de IDs de Regras (RN-NNN) contra Prefixos Paralelos

> **Nota de renumeração (22/09/2026):** registrada localmente como IMP-031 em paralelo à publicação do IMP-031 "Triagem de PENDs" no remote (colisão de ID entre máquinas). Renumerada para IMP-033 — o IMP-031 publicado permanece canônico. Referências internas `(IMP-031)` nas skills/agents afetados foram atualizadas para `(IMP-033)`.

**Data:** 22/09/2026
**Origem:** Pergunta do usuário "porque criou a tasks-m4 com prefixo com e nao o padrão rn?" — o artefato `<docs-repo>/<cliente>/delivery/TASKS-M4-COMANDAS.md` (header "Gerado por gm-req") referenciava as regras do M4 como `COM-01..COM-11` (coluna "**COM**"), alegando fonte `REQUIREMENTS.md (COM-01 a COM-11)`. Mas REQUIREMENTS.md do <cliente> vai até RN-062 e **não contém nenhum COM-**: as regras do milestone Comandas nunca foram registradas; os IDs foram inventados na geração das tasks.
**Status:** ✅ Aplicado

### Problema

Tasks geradas referenciando regras inexistentes (`COM-01..COM-11`), coluna "COM" em vez de "RNs" do template, e requisitos do M4 sem registro na DAG — quebrando a rastreabilidade RN → TASKS e a invariante de que a única unidade formal de regra de negócio é `RN-NNN` em REQUIREMENTS.md.

### Causa raiz

Instrução ausente (categoria: falta de validação/invariante não explicitada) em dois pontos:
- `agents/gm-req.md` (Comportamento): proibia **renumerar** IDs estáveis, mas não proibia **inventar prefixos paralelos** nem gerar artefatos downstream referenciando regras não registradas. Com `write: allow` e "gere e edite artefatos livremente", o primary produziu `delivery/TASKS-*.md` diretamente, pulando `gm-clarify` → `gm-requirements` → `gm-task-spec`.
- `skills/gm-task-spec/SKILL.md` (Modo de erro): checava "nenhuma RN confirmada → abortar", mas não validava se os IDs referenciados pelas tasks existem em REQUIREMENTS.md com prefixo correto.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `agents/gm-req.md` | 2 novos bullets em Comportamento: (1) regra de negócio só existe formalmente como `RN-NNN` (próximo sequencial) em REQUIREMENTS.md — proibido inventar prefixos paralelos (COM-, REQ-, REG-) ou referenciar regras não registradas; formalizar antes via `gm-clarify` → `gm-requirements`; (2) tasks (`delivery/TASKS*.md`) não são artefato próprio do gm-req — se gerar rascunho, referenciar apenas `RN-XXX`/`PEND-XXX` existentes (coluna **RNs**). |
| `skills/gm-task-spec/SKILL.md` | Fase 2: parágrafo "Validação de IDs (IMP-033)" — conferir existência e prefixo (`RN-XXX`/`PEND-XXX`) de todo ID referenciado antes de mapear; Modo de erro: nova condição "RN referenciada inexistente ou prefixo inválido → abortar e instruir registro via gm-requirements". |

### Regra Fundamental

> Toda regra de negócio só existe formalmente como `RN-NNN` (sequencial) em `REQUIREMENTS.md`.
> Artefatos downstream só referenciam IDs existentes — nunca inventam prefixos paralelos.

### Artefato afetado (pendente de decisão do usuário)

`<docs-repo>/<cliente>/delivery/TASKS-M4-COMANDAS.md` — correção proposta (não aplicada automaticamente): registrar as 11 regras do M4 em REQUIREMENTS.md como `RN-063..RN-073` (via `gm-requirements`, a partir da discussão do M4) e trocar as referências das tasks (coluna "COM" → "RNs"). Não é renumeração de IDs estáveis: COM-01..11 nunca existiram em artefato canônico — a substituição é de conformidade.

### Compatibilidade

- Nenhuma mudança de delegação: registry.yaml e ARCHITECTURE.md intocados.
- Evals: `gm-task-spec` possui 3 fixtures; a mudança é aditiva (condição de aborto para cenário não exercido — inputs das fixtures têm RNs válidas), os baselines `output-expected` permanecem válidos. Rodar `gm-skill-eval --skill gm-task-spec` na próxima leva de evals para confirmação.

---

## IMP-034 — Tasks por RN: `delivery/RN-NNN.md` (substitui IMP-032)

**Data:** 22/09/2026
**Origem:** Solicitação do usuário Michel — convenção de tasks por RN substituindo IMP-032.
**Status:** ✅ Aplicado — ⚠️ SUPERADA pela IMP-035 (22/09/2026): arquivo de tasks volta para a pasta da sprint; um arquivo por FEATURE (RN-âncora), não um por RN.

### Decisão (convenção canônica)

- **Tasks:** `delivery/RN-NNN.md` na raiz de `delivery/` — um arquivo por RN/feature/correção, com tasks ID `RN-NNN-M` (M sequencial a partir de 1, dentro do arquivo). Cabeçalho `# RN-NNN — <título da RN/feature>`.
- **A RN sempre existe em REQUIREMENTS.md** (nunca inventar — IMP-033); RN alvo inexistente → abortar.
- **Ordem de resolução para leitores:** (1) `delivery/RN-NNN.md` exato (quando a RN é conhecida); (2) glob `delivery/RN-*.md` (sem RN específica: lista todos os arquivos, ou o mais recente conforme o pedido); (3) legado IMP-032: sprint mais recente `delivery/<YYYY-MM>/TASKS*.md`; (4) `delivery/TASKS.md`; (5) `TASKS.md` na raiz do módulo.
- **ISSUES_CREATED.md volta para a raiz de `delivery/`.** TASKS_AZURE_CONSOLIDADO/SCOPE_AGREEMENT/CLIENT_REQUIREMENTS/CLIENT_REPORT_*/HANDOVER_LOG permanecem na raiz.
- **Batch multi-RN:** um arquivo por RN; nunca misturar features no mesmo arquivo (referências cruzadas a outras RNs na descrição são permitidas).

### Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-task-spec/SKILL.md` | Description, parágrafo de geração e inventário IMP-011 atualizados para `delivery/RN-NNN.md`; bloco "Tasks por RN (IMP-034)" substitui "Pasta de sprint (IMP-032)" com a nova ordem de resolução; Gera → `delivery/RN-NNN.md` (batch multi-RN → N arquivos); "Nunca edita" protege arquivos de outras RNs e tasks legado; Fase 3 pergunta a RN alvo (nunca derivar por omissão) e não pergunta o nome do arquivo; Fase 4/template com IDs `RN-NNN-M` (cabeçalho `# RN-NNN`, título da issue `[tracking] RN-NNN — <título>`, resumo `\| Task \| Tipo \| Repo \| Descrição \| RNs \|`, regras de título com nova row "ID de task"); Modo de erro estendido (RN alvo inexistente → abortar; RN-NNN.md já existe → sobrescrever/merge); commit message e Casos de Borda atualizados (batch multi-RN, legado pré-IMP-034). |
| `skills/gm-gh-issue-creator/SKILL.md` | Seção renomeada para "Localização do arquivo de tasks (IMP-034)" com a nova ordem de resolução (RN-NNN.md exato → glob RN-*.md → sprint legado mais recente → delivery/TASKS.md → TASKS.md na raiz); Lê aponta para `delivery/RN-NNN.md`; ISSUES_CREATED.md na raiz de `delivery/`; Modo de erro e Passos 2/6 com o novo nome de seção. |
| `skills/gm-init/SKILL.md` | Árvores de estrutura (IMP-011 e template INDEX.md) com `RN-*.md (IMP-034)`; nota "Tasks por RN (IMP-034)" — pasta de sprint NÃO é mais criada. |
| `skills/gm-restructure/SKILL.md` | Mapeamento: `TASKS*.md` legado (pré-IMP-034) → raiz de `delivery/`; nota "Tasks por RN (IMP-034)" (NÃO dividir automaticamente — regeneração via gm-task-spec sob demanda); reescrita de links `](TASKS.md` → `](delivery/TASKS.md` (sem sprint); caso de borda "Colisão de nome (IMP-034)" substitui "sprint indeterminável". |
| `agents/gm-dev.md` | Início de sessão lê `delivery/RN-NNN.md` da RN da task em contexto (glob `delivery/RN-*.md` sem RN específica; fallbacks legado pré-IMP-034); menção aos artefatos de spec atualizada. |
| `agents/gm-dev-backend.md` | Lê (upstream): `delivery/RN-NNN.md` (ID `RN-NNN-M`, prefixo `[<repo>.API]`) com resolução e fallbacks legado pré-IMP-034. |
| `agents/gm-dev-frontend.md` | Idem ao backend (prefixo `[<repo>.MFE]`). |
| `agents/gm-progress.md` | Lê (upstream) e Bloco E avaliam todos os `delivery/RN-*.md` via glob; fallback legado preservado. |
| `agents/gm-github-orchestrator.md` | Parâmetro de caminho documentado como arquivo de tasks `delivery/RN-NNN.md` (IMP-034). |
| `agents/gm-req.md` | Menção a tasks atualizada (`delivery/RN-NNN.md` — IMP-034; legado: `TASKS*.md`). |
| `evals/gm-task-spec` (3 fixtures) | Baselines re-pinados para IMP-034: fixture-001 → `delivery/RN-010.md` + `RN-011.md` + `RN-012.md` (conteúdo técnico verbatim redistribuído por RN, IDs `RN-NNN-M`, Dependências em IDs: RN-011-1 depende de RN-010-1); fixture-002 → `delivery/RN-001.md` (tasks RN-001-1 `[Bloqueios.API]` e RN-001-2 `[Bloqueios.MFE]`); fixture-003 → `not_file_exists delivery/RN-010.md`. Criteria atualizados (paths → `delivery/RN-NNN.md`, file_exists de RN-011/RN-012, contains por arquivo + "RN-010-1", line_count 40–300 e section_order por arquivo, reference_match → baseline novo, REQUIREMENTS.md copiado para output-expected como fonte do cross_ref). |
| `evals/gm-gh-issue-creator/fixture-001` | Input renomeado para `input/delivery/RN-010.md` (header de arquivo por RN + IDs RN-010-1/RN-010-2), copiado para `output-expected/delivery/` como fonte do cross_ref (`sources: ["delivery/RN-010.md"]`); criteria com `inputs_required: [delivery/RN-010.md]`; baseline ISSUES_CREATED.md com IDs nos títulos (`RN-010-1 —`). |

### Compatibilidade

- Registry e ARCHITECTURE.md intocados — nenhuma mudança de delegação.
- Fallbacks legado preservados em todos os leitores (sprint mais recente → `delivery/TASKS.md` → raiz) — módulos pré-IMP-034 continuam legíveis.
- IMP-032 marcada como SUPERADA nesta data; sua ordem de resolução é substituída pela desta entrada.

### Pendências

- **Módulos legados:** `<cliente>/delivery/2026-09/TASKS-M4-COMANDAS.md` e `<cliente>/delivery/TASKS.md` (e `<produto-hub>/delivery/TASKS.md`) permanecem no formato pré-IMP-034 — migração/conversão via `gm-restructure` sob demanda.
- **Boilerplate read-only:** ~28 skills repetem a linha de inventário de `delivery/` herdada da IMP-032 sem lógica de resolução — substituição em batch futuro (impacto apenas documental).
- **Baselines re-pinados:** fixtures de `gm-task-spec` e `gm-gh-issue-creator` atualizadas nesta leva; levas futuras exigem re-pinagem do baseline com diff aprovado ou execução via sandbox de agente.

---

## IMP-035 — Tasks por Feature na Sprint: `delivery/<YYYY-MM>/RN-NNN.md` (corrige IMP-034)

**Data:** 22/09/2026
**Origem:** Correção do usuário Michel após a aplicação da IMP-034 no <cliente> — a implementação de comandas é UMA feature (RN-063..073) e a IMP-034 a fragmentaria em 11 arquivos RN-*.md na raiz de delivery/, além de ter abolido a pasta de sprint. Decisão canônica: sprint volta (IMP-032 restaurada) + um arquivo por FEATURE nomeado pela RN-âncora (IMP-034 corrigida).
**Status:** ✅ Aplicado — ⚠️ Ajustada pela IMP-037 (22/09/2026): nome do arquivo de tasks passa a incluir o título da feature (`delivery/<YYYY-MM>/RN-NNN — <título da feature>.md`); leitores resolvem por glob prefixo `RN-NNN*.md`. Sem renumeração.

### Decisão (convenção canônica)

- Tasks vivem em `delivery/<YYYY-MM>/RN-NNN.md` — pasta da sprint corrente (YYYY-MM = mês corrente, ex.: 2026-09), **um arquivo por FEATURE** nomeado pela **RN-âncora** (primeira RN do escopo ou a indicada pelo usuário), tasks ID `RN-NNN-M` (M sequencial a partir de 1).
- Feature pode realizar 1..N RNs; as não-âncoras aparecem SÓ na coluna RNs das tasks — PROIBIDO criar RN-064.md, RN-065.md... para dividir feature.
- RN-âncora sempre existe em REQUIREMENTS.md (IMP-033). Sprint derivada do mês corrente (sem pergunta); RN-âncora perguntada na Fase 3.
- **Ordem de resolução de leitores:** (1) `delivery/<YYYY-MM corrente>/RN-NNN.md` exato; (2) glob na sprint corrente `delivery/<YYYY-MM>/RN-*.md`; (3) sprints anteriores; (4) legado IMP-034: `delivery/RN-*.md` na raiz de `delivery/`; (5) legado IMP-032: sprint mais recente `delivery/<YYYY-MM>/TASKS*.md`; (6) `delivery/TASKS.md`; (7) `TASKS.md` na raiz do módulo.
- ISSUES_CREATED.md na pasta da sprint do arquivo lido.

### Arquivos Alterados

| Arquivo | Mudança |
|---------|---------|
| `skills/gm-task-spec/SKILL.md` (27 edições) | Description e parágrafo de geração → `delivery/<YYYY-MM>/RN-NNN.md` (IMP-035), um arquivo por FEATURE; inventário IMP-011 em duas linhas (sprint + legado); bloco "Tasks por feature na sprint (IMP-035)" substitui "Tasks por RN (IMP-034)" com ordem de resolução de 7 passos; Gera/Nunca edita/Tools/Fluxo atualizados; novo bloco "Feature e RN-âncora (IMP-035)" na Fase 2 (proibido dividir feature em RN-064.md...); Fase 3 pergunta a RN-âncora e deriva a pasta da sprint sem pergunta; Fase 4 cria a pasta da sprint; template/cabeçalho `# RN-NNN — <título da feature>`, coluna RNs inclui não-âncoras; modo de erro, commit format e Casos de Borda (batch multi-feature, legado pré-IMP-035). |
| `skills/gm-gh-issue-creator/SKILL.md` (7 edições) | Seção "Localização do arquivo de tasks (IMP-035)" com ordem de resolução de 7 passos; Lê → `delivery/<YYYY-MM>/RN-NNN.md`; ISSUES_CREATED.md na pasta da sprint do arquivo lido; Modo de erro e Passos 2/6 com o novo nome de seção. |
| `skills/gm-init/SKILL.md` (3 edições) | Árvores de estrutura (IMP-011 e template INDEX.md) com `<YYYY-MM>/RN-NNN.md (IMP-035)`; nota "Tasks por feature na sprint (IMP-035)" — pasta de sprint volta a ser criada pelo gm-task-spec. |
| `skills/gm-restructure/SKILL.md` (4 edições) | Mapeamento: `RN-*.md` na raiz de delivery/ (IMP-034) → pasta da sprint `<YYYY-MM>/`; nota "Tasks por feature na sprint (IMP-035)"; reescrita de links `](delivery/RN-NNN.md` → `](delivery/<YYYY-MM>/RN-NNN.md`; caso de borda "Colisão de nome (IMP-035)" cobrindo homônimos na sprint. |
| `agents/gm-dev.md` (2 edições) | Menção a specs e passo 2 do início de sessão com sprint corrente e fallbacks legado (IMP-035). |
| `agents/gm-dev-backend.md` (1 edição) | Lê (upstream): `delivery/<YYYY-MM>/RN-NNN.md` com resolução sprint → sprints anteriores → legado raiz (IMP-035). |
| `agents/gm-dev-frontend.md` (1 edição) | Idem ao backend (prefixo `[<repo>.MFE]`). |
| `agents/gm-progress.md` (2 edições) | Lê (upstream) e Bloco E avaliam a sprint corrente `<YYYY-MM>/RN-*.md`, depois sprints anteriores; fallbacks legado preservados. |
| `agents/gm-github-orchestrator.md` (1 edição) | Parâmetro de caminho `delivery/<YYYY-MM corrente>/RN-NNN.md` (IMP-035). |
| `agents/gm-req.md` (1 edição) | Menção a tasks atualizada (`delivery/<YYYY-MM>/RN-NNN.md` — um arquivo por feature/RN-âncora; legado: raiz e `TASKS*.md`). |
| `evals/gm-task-spec` (4 fixtures movidos + 3 criteria) | Baselines re-pinados para IMP-035: RN-010.md, RN-011.md, RN-012.md → `output-expected/delivery/2026-09/`; RN-001.md → `output-expected/delivery/2026-09/`; fixture-003 com `not_file_exists` duplo (`delivery/2026-09/RN-010.md` + legado `delivery/RN-010.md`); criteria com paths `delivery/2026-09/...` e reference_match → `output-expected/delivery/2026-09/...`. |
| `evals/gm-gh-issue-creator` (3 arquivos movidos + 1 criteria) | Input → `input/delivery/2026-09/RN-010.md`; output-expected RN-010.md e ISSUES_CREATED.md → `output-expected/delivery/2026-09/`; criteria com `inputs_required: [delivery/2026-09/RN-010.md]`, ISSUES_CREATED paths em `delivery/2026-09/`, cross_ref `sources: ["delivery/2026-09/RN-010.md"]` e reference_match → `output-expected/delivery/2026-09/ISSUES_CREATED.md` (corrige caminho que nunca existiu). |

### Compatibilidade

- Registry e ARCHITECTURE.md intocados — nenhuma mudança de delegação.
- IMP-032 SUPERADA no formato de arquivo, mas a pasta de sprint RESTAURADA pela IMP-035; IMP-034 marcada como SUPERADA nesta data.
- Fallbacks legado preservados em todos os leitores (sprint corrente → sprints anteriores → `delivery/RN-*.md` na raiz → `TASKS*.md` → `TASKS.md` na raiz) — módulos pré-IMP-035 continuam legíveis.
- Baselines pinados em 2026-09 (sprint do mês corrente na data da aplicação).

### Pendências

- **Aplicação no <cliente> (executor separado):** consolidar as tasks de comandas (RN-063..073) em `<cliente>/delivery/2026-09/RN-063.md` (um arquivo por feature, RN-âncora RN-063) — não migrado neste changeset.
- **Boilerplate read-only:** ~28 skills repetem a linha de inventário de `delivery/` herdada das levas anteriores sem lógica de resolução — substituição em batch futuro (impacto apenas documental).
- **Módulos legados:** `<cliente>/delivery/2026-09/TASKS-M4-COMANDAS.md`, `<cliente>/delivery/TASKS.md` e `<produto-hub>/delivery/TASKS.md` permanecem no formato pré-IMP-034 — migração via `gm-restructure` sob demanda.

---

## IMP-036 — Remoção da coluna "RNs" do Resumo das tasks

- **Data:** 22/09/2026
- **Alvo:** `gm-task-spec` (+ texto de convenção em `agents/gm-req.md`)
- **Problema:** coluna "RNs" no "Resumo das tasks" duplicava a rastreabilidade RN→task, que já vive no campo `**RNs**` de cada task; gera manutenção dupla e tabelas largas.
- **Origem:** solicitação do usuário Michel.
- **Decisão:** rastreabilidade RN→task vive EXCLUSIVAMENTE no campo `**RNs**` da task (âncora + não-âncoras). O Resumo passa a ter 4 colunas: `| Task | Tipo | Repo | Descrição |`. Menções correntes a "coluna RNs" substituídas por "campo **RNs** de cada task". Registros IMP-033/034/035 (histórico) intocados.
- **Correção:** template do Resumo sem a coluna; row de regra de título ajustada (rastreabilidade única no campo); textos do bloco "Feature e RN-âncora" e caso de borda batch multi-feature atualizados; `agents/gm-req.md` atualizado; baselines de eval fixture-001 (RN-010/011/012) e fixture-002 (RN-001) sem a coluna. Criteria sem mudança (nenhum check dependia da coluna; `line_count_range` não é afetado — remoção é de células, não linhas).
- **Arquivos:** `skills/gm-task-spec/SKILL.md` (4 edições), `agents/gm-req.md` (1), `evals/gm-task-spec/fixture-001/output-expected/delivery/2026-09/RN-010|011|012.md` (baseline), `evals/gm-task-spec/fixture-002/output-expected/delivery/2026-09/RN-001.md` (baseline)
- **Aplicação no módulo <cliente>:** executada nesta sessão — `<cliente>/delivery/2026-09/RN-063.md` Resumo 5→4 colunas (20 tasks); os 20 campos `**RNs**` das tasks permanecem.
- **Status:** ✅ Aplicada (config + módulo <cliente>)

---

## IMP-037 — Nome do arquivo de tasks com título da feature: `RN-NNN — <título>.md`

- **Data:** 22/09/2026
- **Alvo:** `gm-task-spec` (+ leitores: `gm-gh-issue-creator`, `gm-init`, `gm-restructure`, agents gm-dev/gm-dev-backend/gm-dev-frontend/gm-progress/gm-github-orchestrator/gm-req)
- **Origem:** solicitação do usuário Michel — o arquivo de tasks passa a carregar o título da feature no nome (ex.: `RN-063 — Comandas e Controle de Consumo.md`).
- **Problema:** `delivery/<YYYY-MM>/RN-NNN.md` não descreve a feature no nome do arquivo — navegação e leitura exigem abrir o arquivo para saber de que trata.
- **Decisão (convenção canônica):**
  - **Nome:** `delivery/<YYYY-MM>/RN-NNN — <título da feature>.md` (RN-âncora + espaço + em-dash U+2014 + espaço + título; ex.: `RN-063 — Comandas e Controle de Consumo.md`). O H1 do arquivo coincide com o nome sem extensão.
  - **Sanitização do título:** substituir `/ \ : * ? " < > |` por espaço; colapsar espaços duplicados; remover espaços/pontos finais. O em-dash é o separador válido — nunca hífen.
  - **Geração (gm-task-spec):** título da feature é obrigatório para o nome; derivável do contexto → sem pergunta; não derivável → perguntar APENAS o título (exceção estreita ao "não perguntar" da Fase 3).
  - **Resolução de leitores:** SEMPRE por glob de prefixo `RN-NNN*.md` (nunca construir nome exato). Glob com RN conhecida deve retornar exatamente 1 arquivo; >1 → ambiguidade → perguntar/abortar; 0 → próximo fallback. Ordem de 7 passos da IMP-035 preservada.
  - **Colisão:** `RN-NNN*.md` já existente na sprint → sobrescrever/merge (pergunta).
- **Correção:** todos os caminhos/lógicas atualizados; gm-gh-issue-creator proibido de construir nome exato (só glob); árvores do gm-init e mapeamento/link-rewrite/colisão do gm-restructure atualizados; 6 agents com resolução por glob prefixo.
- **Arquivos:** `skills/gm-task-spec/SKILL.md` (15 edições), `skills/gm-gh-issue-creator/SKILL.md` (3), `skills/gm-init/SKILL.md` (3), `skills/gm-restructure/SKILL.md` (4), `agents/gm-dev.md` (2), `agents/gm-dev-backend.md` (1), `agents/gm-dev-frontend.md` (1), `agents/gm-progress.md` (1), `agents/gm-github-orchestrator.md` (1), `agents/gm-req.md` (1), evals renames (6 arquivos) + criteria (4 arquivos).
- **Aplicação no módulo <cliente>:** rename `<cliente>/delivery/2026-09/RN-063.md` → `RN-063 — Comandas e Controle de Consumo.md` + `<cliente>/REQUIREMENTS.md` (delta M4) atualizado — executado nesta sessão.
- **Status:** ✅ Aplicada (config + módulo <cliente>)

---

## IMP-038 — Regra das 4 Colunas do Resumo das tasks (exclusividade obrigatória)

- **Data:** 22/09/2026
- **Alvo:** `gm-task-spec` (+ reforço em `@gm-req`)
- **Problema:** o arquivo `<cliente>/delivery/2026-09/RN-028 — Autenticação Segura com Dual-Token e CSRF.md` (migrado pelo `gm-req` do legado `delivery/TASKS.md`) trouxe a seção "## Resumo das tasks" com **7 colunas** (`Task | Tipo | Repo | Descrição | RN/PEND | Prioridade | Status`) — o canônico são **4** (`Task | Tipo | Repo | Descrição`).
- **Causa raiz:** instrução ambígua/restritiva demais. A IMP-036 fixou o template de 4 colunas e proibiu explicitamente só a coluna "RNs" (a menção "o Resumo NÃO tem coluna RNs" vivia na tabela "Regras de título", longe do template do Resumo). Nada proibia colunas extras em geral (Prioridade, Status, etc.) nem ditava o comportamento na migração de tabelas legadas — o agente copiou a tabela do TASKS.md legado em vez de convertê-la.
- **Correção:**
  - `skills/gm-task-spec/SKILL.md` — seção "Tabela de tarefas (resumo)": novo bloco **"Regra das 4 colunas (exclusividade obrigatória)"** imediatamente após o template: a tabela contém SOMENTE E APENAS `Task | Tipo | Repo | Descrição`; proibido qualquer coluna extra (RNs/PENDs, prioridade, status, data ou qualquer outra); rastreabilidade RN→task no campo **RNs** de cada task; status/prioridade pertencem à task individual ou ao cabeçalho; ao migrar de formato legado, CONVERTA a tabela (nunca copie). Row "RNs" da tabela "Regras de título" generalizada de "NÃO tem coluna RNs" para "Resumo tem SOMENTE as 4 colunas canônicas".
  - `agents/gm-req.md` — Comportamento, bullet de tasks: rascunho de tasks segue o template da `gm-task-spec`; seção `## Resumo das tasks` tem SOMENTE E APENAS as colunas `Task | Tipo | Repo | Descrição` (Regra das 4 colunas; migração de `TASKS.md` legado → converter, não copiar).
  - Artefato corrigido nesta sessão: `<cliente>/delivery/2026-09/RN-028 — Autenticação Segura com Dual-Token e CSRF.md` — Resumo 7→4 colunas (15 tasks RN-028-1..15 sem renumeração). Informações preservadas: RN/PEND já existe no campo **RNs** de cada task individual; Status ✅ já está no cabeçalho e na Issue principal; Prioridade P0/P1 descartada sem perda (feature inteira já implementada — criticidade preservada na seção "Ordem de Execução", intocada).
- **Arquivos:** `skills/gm-task-spec/SKILL.md` (2 edições), `agents/gm-req.md` (1), `<docs-repo>/<cliente>/delivery/2026-09/RN-028 — Autenticação Segura com Dual-Token e CSRF.md` (1)
- **Evals:** `gm-task-spec` — verificação por grep dos baselines: os 4 `output-expected` (fixture-001 ×3, fixture-002 ×1) já possuem o Resumo com exatamente as 4 colunas canônicas e nenhum contém `RN/PEND`/`Prioridade | Status` — a regra nova é aditiva e não quebra nenhum golden set; atualização de baseline não necessária. Run completo `run-evals` pendente de shell (validar na próxima leva).
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados. Outros geradores de tasks (`gm-gh-issue-creator`, `github-issues-from-plan`) não produzem a seção "Resumo das tasks" — intocados.
- **Status:** ✅ Aplicada (config + módulo <cliente>)

---
## IMP-039 — Workaround `bash: deny` → `bash: ask` no free tier do OpenCode (subagents falhavam)

- **Data:** 26/09/2026
- **Alvo:** 12 subagents Golmet (frontmatter `permission`)
- **Origem:** sessão de melhoria do `@gm-workflow-improver` — toda invocação dele falhava com `Error from provider (Console): OpenCode's free tier can only be used from within OpenCode`.
- **Problema:** subagents com `bash: deny` no frontmatter falhavam 100% das vezes ao iniciar stream no provider `opencode` (modelo `mimo-v2.6-flash-free`), com erro do gate de free tier do provedor. Em 26/09: 7/7 falhas no improver; agentes de controle passaram (`gsd-planner` sem bloco permission ✅, `gm-jev-classifier` com `bash: allow` ✅, `gm-dev-backend` com `bash: ask` ✅, `explore` built-in ✅) enquanto `gm-progress`, `gm-next`, `gm-translation-orchestrator`, `gm-reverse-orchestrator` (todos `bash: deny`) falharam ❌ — correlação perfeita.
- **Causa raiz:** bug upstream do OpenCode/gate do free tier (issues [anomalyco/opencode#49680](https://github.com/anomalyco/opencode/issues/49680) e [#50806](https://github.com/anomalyco/opencode/issues/50806)) — a requisição da sessão-filha não carrega a flag "from within OpenCode"; workaround documentado é permitir `bash`/`glob`/`grep`/`read` no subagent. Regressão a partir de ~20/09/2026 (log `~/.local/share/opencode/log/opencode.log`: 24 ocorrências; intermitente nos primeiros dias, 100% determinístico em 26/09).
- **Correção:** `bash: deny` → `bash: ask` em: `gm-workflow-improver`, `gm-workflow-builder`, `gm-reverse-orchestrator`, `gm-translation-orchestrator`, `gm-requirements-orchestrator`, `gm-quality-orchestrator`, `gm-support-orchestrator`, `gm-intake-orchestrator`, `gm-governance-orchestrator`, `gm-cr-propagation-guard`, `gm-next`, `gm-progress`. Menor privilégio preservado: `ask` exige confirmação humana para qualquer comando (zero execução silenciosa). Texto de apoio do `gm-reverse-orchestrator` (menção a `bash: deny`) atualizado.
- **Arquivos:** `agents/*.md` (12 frontmatters + 1 corpo).
- **Validação:** ⚠️ **pendente de restart do OpenCode** — as definições de agent não são hot-reloadadas no processo vivo (teste com agentes novos `zzz-test-*` retornou `Unknown agent type`; re-invocações pós-edição no mesmo processo ainda falharam por cache). Smoke test pós-restart: invocar `gm-workflow-improver` e `gm-reverse-orchestrator` e confirmar stream OK.
- **Riscos/mitigações:** workaround de bug upstream — se o opencode corrigir, `ask` continua semanticamente correto (não há motivo para `deny` em subagent Golmet que já não executa nada); se a issue mudar o gatilho, reavaliar. Verificado por grep após aplicação: 0 ocorrências de `bash: deny` em frontmatter de agents.
- **Status:** ✅ Aplicada (config) — ⏳ validação pós-restart pendente

---
## IMP-040 — Delivery por pasta de feature: `RN-NNN — <título>/` com Analise-Funcional.md + Analise-Tecnica.md

- **Data:** 25/09/2026
- **Alvo:** `gm-task-spec` (+ leitores: `gm-gh-issue-creator`, `gm-init`, `gm-restructure`, agents gm-dev/gm-dev-backend/gm-dev-frontend/gm-req/gm-progress/gm-github-orchestrator)
- **Origem:** solicitação do operador via gm-req — cada feature passa a ter uma PASTA em `delivery/<YYYY-MM>/RN-NNN — <título da feature>/` (nome idêntico ao antigo .md, sem extensão) contendo SEMPRE exatamente 2 arquivos: `RN-NNN — Analise-Funcional.md` (análise 100% funcional, linguagem de negócio, sem endpoints/tabelas/frameworks) e `RN-NNN — Analise-Tecnica.md` (conteúdo que hoje vive no arquivo único — IMP-035/037/039 preservados integralmente no técnico).
- **Decisão (convenção canônica):** pasta + 2 arquivos (IMP-040); grafia fixa `Analise-Funcional`/`Analise-Tecnica` (sem acento); em-dash U+2014 preservado; gm-task-spec gera AMBOS os arquivos (funcional derivada da RN-âncora + RNs do escopo em REQUIREMENTS.md, template próprio "Formato da análise funcional"); leitores resolvem pasta por glob prefixo `RN-NNN*` e leem o `Analise-Tecnica.md`; ordem de resolução de 8 passos (pasta sprint corrente → sprint corrente sem RN → sprints anteriores → flat pré-IMP-040 → IMP-034 → IMP-032 → delivery/TASKS.md → raiz); fallbacks legados preservados.
- **Arquivos:** `skills/gm-task-spec/SKILL.md` (16 edições), `skills/gm-gh-issue-creator/SKILL.md` (5), `skills/gm-init/SKILL.md` (3), `skills/gm-restructure/SKILL.md` (5), `agents/gm-dev.md` (2), `agents/gm-dev-backend.md` (1), `agents/gm-dev-frontend.md` (1), `agents/gm-req.md` (1), `agents/gm-progress.md` (2), `agents/gm-github-orchestrator.md` (1); migração <cliente>: `delivery/2026-09/RN-028 — .../` e `RN-063 — .../` com 2 arquivos cada + 5 referências cruzadas (REQUIREMENTS ×2, TRACEABILITY ×3) + exclusão dos 2 flats.
- **Evals:** fixtures do `gm-task-spec` e `gm-gh-issue-creator` com baselines flat ficarão desatualizados — exigem re-pin de baseline + novo golden para o `Analise-Funcional.md`.
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados. ~28 skills read-only repetem a linha de inventário boilerplate de `delivery/` (pendência documental pré-existente desde a IMP-032).
- **Status:** ✅ Aplicada (config + módulo <cliente>) — ⚠️ Ajustada em 25/09/2026 (refinamento do operador): a coluna "Regra" da tabela `## Regras de negócio` do `Analise-Funcional.md` usa numeração sequencial simples 1..N (sem IDs RN — numeração MERAMENTE cosmética/não-rastreável); IDs RN permanecem exclusivos do `Analise-Tecnica.md` (campo **RNs**) e do REQUIREMENTS.md. Arquivos do ajuste: `skills/gm-task-spec/SKILL.md` (template da tabela + parágrafo "Regras:"), `<cliente>/delivery/2026-09/RN-028 — Autenticação Segura com Dual-Token e CSRF/RN-028 — Analise-Funcional.md` (RN-028 → 1), `<cliente>/delivery/2026-09/RN-063 — Comandas e Controle de Consumo/RN-063 — Analise-Funcional.md` (RN-063..073 → 1..11).
- **Ajuste 2 (25/09/2026):** issues do GitHub passam a ser criadas com o CORPO vindo do `RN-NNN — Analise-Funcional.md` (linguagem de negócio: "O que esta entrega faz" + "Comportamento esperado" + "Regras de negócio" 1..N + "O que fica de fora"); o `Analise-Tecnica.md` permanece fonte da ESTRUTURA (issue principal, IDs `RN-NNN-M`, labels por prefixo, milestone, repos) e da referência "Especificação completa". Origem: solicitação do operador após a IMP-040. Arquivos: `skills/gm-gh-issue-creator/SKILL.md` (7 edições: description, intro, Localização, Lê, Passo 2, template do body no Passo 5, Modo de erro com fallback quando funcional ausente), `agents/gm-github-orchestrator.md` (1 edição: parâmetros da invocação leem os 2 arquivos da pasta). Aplicação no acervo: `<org>/<projeto-api>#41` ([<cliente>] RN-063) atualizada com o conteúdo funcional, preservando tasks RN-063-1..20, waves, labels, milestone e assignees; RN-028 não possui issue (Tracking ID "#pendente" no Analise-Tecnica — feature já implementada/mergeada; criação retroativa pendente de decisão do operador). Evals de `gm-gh-issue-creator` pendentes: fixture-001 já estava desatualizada desde a IMP-040 (flat → pasta); após aplicar o change-set, re-pin de baseline + novo golden cobrindo o corpo funcional, com diff aprovado.
## IMP-041 - Skill `gm-perf-auditor` — auditoria de performance do runtime OpenCode

- **Data:** 26/09/2026
- **Alvo:** `~/.config/opencode/skills/gm-perf-auditor/` (nova), `registry.yaml`, `ARCHITECTURE.md`, `agents/gm-quality-orchestrator.md`, `evals/gm-perf-auditor/`.
- **Origem:** pedido do operador — "mensurar o tempo de resposta do OpenCode na interação com a IA para detectar gaps de performance causados por excesso de contexto ou outras causas no Golmet". Grafo de delegação aprovado na sessão ("Aprovar grafo completo").
- **Problema:** não existia forma no Golmet de medir latência de resposta do runtime OpenCode (turn_ms, user→primeira resposta) nem de detectar context bloat. `gm-metrics-collector` cobre métricas de projeto, `gm-drift-detector` qualidade de artefatos e `gm-agent-health-monitor` conformidade de componentes — nenhum cobre performance do runtime; a lentidão era percebida apenas subjetivamente.
- **Escopo decidido (com o usuário):** somente skill auditora read-only pós-hoc — **NÃO** plugin de telemetria em tempo real. Fonte: SQLite local do OpenCode (`~/.local/share/opencode/opencode.db`) acessado exclusivamente via `opencode db "<SELECT>" --format json` (sqlite3 externo não instalado; **nunca** escrever no banco). Destino: relatório `quality/PERF_REPORT_<timestamp>.md` + bloco `## Performance do Runtime (OpenCode)` entregue via hand-off à skill `gm-metrics-collector` para append em `docs/METRICS.md` (schema do METRICS.md é do coletor — não duplicado).
- **Criação:**
  - `skills/gm-perf-auditor/SKILL.md` — domínio `qualidade`; thresholds: p95 > 30.000 ms ⚠️ / > 120.000 ms ❌; flag context bloat = razão tok_in final/inicial > 3× **E** p95 2ª metade > 2× p95 1ª metade (sessões ≥ 4 turnos); percentis nearest-rank (`ceiling(p/100 × N)`) calculados no script; Modo de erro `warn`.
  - `skills/gm-perf-auditor/scripts/get-perf-metrics.ps1` — PowerShell 5.1, somente cmdlets com nome completo (aliases nativos `ri`/`rd`/`gc`/`iex` proibidos por colisão destrutiva); coleta SELECT com cutoff por `--days` (default 7), agrega p50/p95/max por dia/agente/modelo, top-N lentos, flags de bloat e latência de interação; saída JSON agregado.
  - **Bugs de robustez encontrados e corrigidos no smoke test:** (1) `@($List[object])` lança "Os tipos de argumento não correspondem" no PS 5.1 → corrigido com `List[pscustomobject]` + `.ToArray()`; (2) variável local `$topSlow` colidia com o parâmetro `[int]$TopSlow` (PowerShell é case-insensitive) → atribuição de array ao slot `Int32` lançava "Object[] → Int32" → renomeada para `$topSlowRows`.
  - Registro: `registry.yaml` (skill no domínio `qualidade` + `invokes` do `gm-quality-orchestrator` + lista do domínio); tabela "Skills disponíveis" e roteamento do `agents/gm-quality-orchestrator.md`; `ARCHITECTURE.md` re-renderizado (54 skills, nó `P52`, aresta `QUAL`, `S_QUAL` 7 skills, §4 linha QUAL, §5.4 regenerada com as 12 skills do domínio, §5.9 completada com `gm-stack-dotnet-csharp`, §6 taxonomia).
  - Fixture L0: `evals/gm-perf-auditor/fixture-001/` com `input/perf-metrics.json` (JSON real da smoke test), `criteria.yaml` (19 checks) e `output-expected/quality/PERF_REPORT_2026-09-26-1200.md` (golden).
- **Arquivos:** `skills/gm-perf-auditor/SKILL.md` (novo), `skills/gm-perf-auditor/scripts/get-perf-metrics.ps1` (novo), `evals/gm-perf-auditor/fixture-001/**` (novo), `registry.yaml`, `ARCHITECTURE.md`, `agents/gm-quality-orchestrator.md`, `WORKFLOW_IMPROVEMENTS.md` (este).
- **Riscos/mitigações:** leitura indevida do banco → apenas SELECT com WHERE de cutoff, convenção "NUNCA escrever" no SKILL.md; p95 inflado por turnos extremos (max 16.319 s) → veredito por dia + Top-10 separam outliers; user anterior ao cutoff subestima amostras de interação → limitação documentada; TTFT indisponível (`time.first` = null na fonte) → documentado nas limitações do relatório; relatório pode conter dados sensíveis de sessão → IDs truncados a 8 chars no script.
- **Validação:** ✅ smoke test real (`get-perf-metrics.ps1 -Days 7`): exit 0 — 2.437+ turnos, 64 sessões, p50 13,9 s, p95 88,7 s, veredito WARNING; 7 dias/17 agentes/5 modelos agregados; top-10 gerado; 0 flags de bloat; interação n=188 (p50 18,9 s, p95 328,5 s). ✅ Checklist "Nova Skill" do CHECKLISTS.md: PASS (front matter `name`==pasta, description com triggers, sem campo `tools:`, seções obrigatórias, PT-BR, sem paths de máquina hardcoded). ✅ evals: `run-evals.ps1 -Skill gm-perf-auditor` **19/19 PASS** (exit 0); `run-evals.ps1 -Registry` **5/5 PASS** (exit 0).
- **Revisão pós-criação (`gm-doc`, 26/09/2026):** verificação independente dos artefatos (skill 353→linhas, registry 3 ocorrências, ARCHITECTURE 3, eval 19/19) e re-run do smoke real (2.469 turnos/64 sessões, p50 14,0 s, p95 88,8 s, WARNING; `interaction` p50_first 18,9 s / p95_first 328,5 s). **Correção metodológica aplicada:** `turn_ms` é wall-clock de turno (tools + subagentes `task` + esperas do `question` + suspensão da máquina), não latência pura de modelo — tabela `permission` está vazia no banco (asks não persistem), logo não há como subtrair espera humana por SQL. SKILL.md atualizado: §Metodologia (novo parágrafo) e §Casos de Borda (outlier > 10 min → etiqueta "wall-clock inflado (verificar causa)" em vez de crítico direto; veredito crítico só pelo p95 da janela/dia).
- **Status:** ✅ Aplicada — reiniciar o OpenCode para a skill valer; publicação via `gm-self-publish` pendente.

---
## IMP-042 — P0 de performance: permissões read-only por padrão, batch de perguntas e detector de contexto runaway

- **Data:** 27/09/2026
- **Alvo:** `agents/*.md` (12 subagents), `AGENTS.md` global, `skills/gm-perf-auditor/` (SKILL.md + script + fixture).
- **Origem:** análise profunda de performance (`gm-perf-auditor`) — decomposição do wall-clock de 7 dias revelou que a lentidão NÃO é latência de modelo nem contexto médio.
- **Evidência (7 dias, 2.501 turnos):** espera humana do `question` = **5,08 h somadas** (60 perguntas, média 5,1 min); tools de leitura com média inflada por espera de permissão (`read` 19,6 s vs <1 s normal, `write` 42,8 s, `bash` 21,5 s) — os 12 subagents com `bash: ask` (workaround IMP-039) pagavam ask humano por comando; 53 invocações de `task` × média 8,6 min = 7,6 h; cache efetivo (582M tokens em cache vs 29,7M input — 95% hit); caso runaway real: sessão com turnos de **~888.000 tok_in** não detectada pelo flag de bloat (que mede crescimento, não tamanho absoluto).
- **Correções P0 (aprovadas pelo usuário — "implemente toda a P0"):**
  1. **Permissões read-only por padrão (12 subagents):** `bash: ask` → objeto com padrões glob — `"*": ask` primeiro + 19 allows read-only (`git status/log/diff/show`, `Test-Path`, `Get-ChildItem`, `Get-Content`, `Get-Item`, `Get-Date`, `Select-String`, `Select-Object`, `Sort-Object`, `Measure-Object`, `Group-Object`, `Compare-Object`, `Format-Table`, `Format-List`, `Out-String`, `rg`). Segurança verificada na documentação oficial: tree-sitter separa comandos compostos (`;`, `&&`, `|`) e avalia cada lado individualmente — lado destrutivo continua em ask; última regra vence (`*` primeiro, específicos depois). `Where-Object`/`ForEach-Object` deliberadamente FORA do allow (scriptblock pode esconder código destrutivo). `git branch*` fora (tem variantes destrutivas `-D`). Idempotente via script temporário com preservação de BOM/EOL por arquivo (10 LF, 2 CRLF, 0 BOM).
  2. **Regra de batch de perguntas (AGENTS.md):** nova seção "Regras de Interação (custo de wall-clock)" — agrupar TODAS as decisões pendentes numa única chamada de `question` + minimizar pontos confirmáveis (fazer + reportar > pedir permissão para ação segura/reversível). AGENTS.md é local por máquina; carregado também pelos subagents.
  3. **Detector de contexto runaway (`gm-perf-auditor`):** novo parâmetro `-RunawayTokIn` (default 200.000) no `get-perf-metrics.ps1`; saída nova `context_runaway[]` (session, agent, turns, turns_over, max_tok_in, flag) + `summary.runaway_sessions`; SKILL.md com linha na tabela de thresholds, seção do relatório ("### Contexto Runaway (tamanho absoluto — IMP-042)" dentro de Context Bloat), fórmula e contrato JSON.
- **Arquivos:** `agents/{12}.md`, `AGENTS.md`, `skills/gm-perf-auditor/SKILL.md`, `skills/gm-perf-auditor/scripts/get-perf-metrics.ps1`, `evals/gm-perf-auditor/fixture-001/` (golden + criteria +2 checks), `WORKFLOW_IMPROVEMENTS.md` (este).
- **Validação:** ✅ evals `gm-perf-auditor` **21/21 PASS** (2 checks novos de runaway); ✅ smoke real com `-Days 12`: **6 sessões runaway detectadas** — `ses_f98d` (build, 3.625 turnos, **91 acima de 200k, pico 888.691 tok_in**), `ses_f443` (gm-req, 466 turnos, 453k), `ses_f451` (gm-req, 498 turnos, 363k), `ses_f4fc` (build, 17 over), `ses_f589` (build, 15 over), `ses_f35f` (gm-dev, 316k); ✅ front matter YAML dos 12 verificado (1 ocorrência substituída por arquivo, estrutura íntegra).
- **Riscos/mitigações:** allow por prefixo poderia burlar comando composto → mitígado pela avaliação por nó do tree-sitter (documentação oficial); regex de padrão não exige espaço (ex.: `rg*` casa `rgfoo`) → inofensivo (todos os prefixos são read-only); scripts PS com pipeline ainda pedem ask quando o tail não está na lista (ex.: `Where-Object`) → comportamento seguro por padrão; efeito real nas esperas só observável pós-restart — re-auditar com `gm-perf-auditor` em ~3-7 dias e comparar média de `read`/`write`/`bash` e tempo de `question`.
- **Pendências (P1, não aprovado ainda):** menos rodadas de subagente, modelo por agente, podar índice de skills.
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode + re-auditar pós-período para medir ganho; publicação via `gm-self-publish` pendente.

---
## IMP-043 — Delegação de alta fidelidade (P1, reenquadrada)

- **Data:** 27/09/2026
- **Alvo:** `AGENTS.md` global, 5 orquestradores (`agents/gm-requirements-orchestrator.md`, `gm-translation-orchestrator.md`, `gm-quality-orchestrator.md`, `gm-support-orchestrator.md`, `gm-intake-orchestrator.md`).
- **Origem:** discussão da P1 "menos rodadas por subagente" com o operador — **reenquadramento acordado:** perguntas de decisão não são o problema (são o Golmet funcionando); o alvo é a delegação de baixa fidelidade (subagente que adivinha, re-priming redundante em chain) e rodadas de exploração cega. Nome final: delegação de alta fidelidade, não "menos perguntas".
- **Evidência (7 dias, `gm-perf-auditor`):** 53 invocações de `task` × média 8,6 min = 7,6 h; chains sequenciais (improver → builder → resume) re-primam contexto completo a cada estágio; o smoke test do IMP-041 rodou sem retornar detalhes (delegação cega) e exigiu turnos de verificação do orquestrador; sessões runaway (3.625/498 turnos) mostram drift de objetivo crescendo com o nº de turnos — menos rodadas melhora foco, não só latência.
- **Correções (regras R1-R5):**
  - **R1 (AGENTS.md + orquestradores):** todo prompt de `task` carrega insumos (paths), decisões já tomadas, formato de retorno esperado e restrições — colar só o essencial, resto o subagente lê (read é barato, 95% cache hit). Nunca delegar esperando que o subagente adivinhe.
  - **R2:** continuação do mesmo trabalho = resume via `task_id` (memória do subagente retomada); sessão nova só para trabalho novo.
  - **R3:** tasks independentes em paralelo (uma message, N calls) — guardrail: nunca escrita concorrente no mesmo arquivo.
  - **R4:** script determinístico apenas para lista fechada (evals, registry render, SQL de stats) — julgamento permanece agêntico (guardrail anti-degradação de qualidade).
  - **R5:** subagente pergunta livremente o que for decisão de negócio; o que o orquestrador já sabe vai no prompt, não vira pergunta.
  - **Redação P0-2 corrigida** (pedido do operador): seção do AGENTS.md renomeada para "Regras de Interação e Delegação"; acrescentada distinção **pedágio ≠ pergunta** — o que se minimiza é espera mecânica de permissão de tool; decisão de negócio/arquitetura nunca é suprimida.
- **Arquivos:** `AGENTS.md` (seção reescrita, ~44 → 47 linhas), 5 `agents/Golmet-*-orchestrator.md` (nova seção "## Política de delegação (IMP-043)" antes de "## Tools disponíveis"), `WORKFLOW_IMPROVEMENTS.md` (este).
- **Riscos/mitigações:** R1 com insumo colado demais inflaria o prompt do task → regra "colar só o essencial" (≤ ~50 linhas; arquivos grandes por path); R2 com resume infinito acumularia contexto → sessão nova quando o trabalho muda; R4 mal aplicado degradaria julgamento → lista fechada explícita; paralelismo com colisão de escrita → guardrail explícito; qualidade das perguntas preservada (batch agrupa, não elimina).
- **Validação:** ⏳ pendente nesta execução: `run-evals.ps1 -Registry` + grep de consistência nos 5 agents; efeito real (média de duração por `task`) re-auditável via `gm-perf-auditor` pós-período. ⚠️ Aprendizado de encoding registrado: PowerShell 5.1 lê `.ps1` sem BOM como ANSI — literais com acento em script temporário corrompem os próprios padrões de busca (causa do primeiro `SEM-ANCORA` nesta execução); correção aplicada via Edit tool (encoding-safe).
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode; publicação via `gm-self-publish` pendente (acumulada com IMP-040/041/042).

---

## IMP-050 — Resolução de colisão de numeração IMP-044..048 (sessões paralelas)

- **Data:** 27/09/2026
- **Origem:** durante o `gm-self-publish`, detectou-se que a sessão paralela (fork "Performance Golmet") registrou melhorias com números IMP-044..048, colidindo com os IMP-044..048 da numeração principal. Nenhuma perda de conteúdo (diff +96/−0 vs HEAD).
- **Mapping:** fork 044 (verificação visual Antigravity no dev-frontend) → **IMP-051** · fork 045 (improver silent death) → **IMP-052** · fork 046 (gate plan-first) → **IMP-053** · fork 047 (remoção SDD) → **IMP-054** (mesma entrega de IMP-044 — execução paralela duplicada) · fork 048 (AGENTS.md lazy) → **IMP-055** (mesma entrega de IMP-040).
- **Correção de citações:** `agents/gm-workflow-improver.md` (IMP-046→IMP-053); citações de lazy loading que o fork renumerou para "IMP-048" restauradas para **IMP-040** (`gm-setup`, `gm-agent-health-monitor`, `gm-agents-md-sync`).
- **Regra reforçada:** sessões paralelas (forks) não alocam números IMP novos sem sincronizar com o log principal — a validação de sequencialidade fica a cargo do `gm-skill-eval --registry` e do improver.

---
## IMP-044 — Remoção das skills legadas do workflow SDD

- **Data:** 27/09/2026
- **Alvo:** `~/.agents/skills/sdd-*` (20 skills), em complemento ao IMP-040 (que já havia removido o bloco `sdd-advisor` do AGENTS.md).
- **Origem:** pedido do operador — "remover as skills e subagents do antigo sdd que não usamos mais". O Golmet substituiu integralmente o SDD (cada skill `sdd-X` tem equivalente `Golmet-X` em `~/.config/opencode/skills/`).
- **Inventário pré-remoção:** 20 skills `sdd-*` (acceptance-criteria, api-contracts, architecture, change-request, clarify, data-model, glossary, governance, howto, known-error, legacy-context, migration, project-intake, requirements, scope-agreement, test-strategy, traceability, ui-spec, user-stories, validate); **0 subagents SDD** (`~/.agents/agents/` vazio, nenhum `sdd-*` em `~/.config/opencode/agents/`); 0 referências ativas a `sdd-` em `agents/`, `skills/`, `registry.yaml` e `ARCHITECTURE.md` (o Golmet não depende dos legados); `~/.agents` NÃO é repo git (remoção local, sem impacto de versionamento).
- **Correção:** remoção das 20 pastas. Skills não-SDD preservadas e verificadas intactas: cavecrew, caveman, caveman-commit, caveman-compress, caveman-help, caveman-review, caveman-stats, find-docs, find-skills.
- **Ganho:** ~20 descrições de skill deixam de ser carregadas no índice de skills do system prompt em toda sessão (estimativa ~800-1.000 tokens/turno de contexto fixo a menos; complementa o IMP-040).
- **Arquivos:** 20 diretórios removidos de `~/.agents/skills/` (fora do escopo do repo <config-repo> — sem publish).
- **Riscos/mitigações:** perda de histórico dos IMPs que citam skills `sdd-*` (ex: IMP-013) → WORKFLOW_IMPROVEMENTS.md é registro histórico e permanece intocado; algum fluxo externo ainda invocar `sdd-*` → equivalente `Golmet-*` cobre a função (mapa 1:1 no índice de skills).
- **Validação:** ✅ pós-remoção: 0 diretórios `sdd-*` restantes; 9 skills restantes listadas e íntegras.
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode para o índice de skills recarregar sem os legados.

---

## IMP-045 — Cadência de aprendizado contínuo (retrospectiva por milestone + perf-auditor semanal)

- **Data:** 27/09/2026
- **Alvo:** processo — registro de prática; nenhum arquivo de skill/agent alterado.
- **Origem:** questão do operador — "o Golmet tem algo que analise as nuances dos projetos e use cada experiência para melhorar o workflow?". Diagnóstico: o ciclo existe (retrospective → pattern-extractor → metrics-collector → skill-evolution → skill-eval → self-publish) mas é manual e concentrado no fim de projeto — nuances do meio se perdem.
- **Prática acordada:**
  1. **`gm-project-retrospective` por milestone/feature grande** (não só fim de projeto) — primeira aplicação real: <cliente> milestone RN-063..088 (mesma data), que gerou RETROSPECTIVE.md, o padrão `adaptacao-produto-irmao` (1º da pattern library) e a linha <cliente> no METRICS.md.
  2. **Ritual semanal:** `gm-perf-auditor` + leitura de `docs/METRICS.md` (~5 min) — tendências de latência/veredito no radar antes de virarem dor.
- **Arquivos:** `WORKFLOW_IMPROVEMENTS.md` (este); artefatos da 1ª aplicação: `<cliente>/docs/RETROSPECTIVE.md`, `docs/patterns/adaptacao-produto-irmao/PATTERN.md` + `INDEX.md`, `docs/METRICS.md` (linha <cliente>).
- **Riscos/mitigações:** retrospectiva de milestone pode virar burocracia → escopo curto (só o delta do milestone); ritual semanal esquecido → o `gm-perf-auditor` no METRICS.md torna a ausência visível (gap na tabela).
- **Validação:** ✅ ciclo completo executado end-to-end pela 1ª vez nesta data (retro → pattern → métricas).
- **Status:** ✅ Aplicada — prática em vigor.

---

## IMP-046 — Portão de cobertura downstream por lote de RNs

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-requirements/SKILL.md` (Algoritmo, novo passo 7).
- **Origem:** retrospectiva do <cliente> milestone RN-063..088 (IMP-045) — o lote Comandas (RN-063..073) foi formalizado em REQUIREMENTS mas saiu sem seção dedicada em DATA_MODEL/API_CONTRACTS/UI_SPEC, e ninguém re-invocou `gm-traceability`/`gm-validate` para detectar. Aprovação do usuário no Passo 7 da retrospectiva.
- **Problema:** a detecção de gap já existe (`gm-traceability` §Gaps Detectados; `gm-validate`), mas roda apenas se alguém lembrar de invocar — o lote encerrava "cego".
- **Correção:** novo passo obrigatório no fechamento de lote do `gm-requirements`: lote com ≥ 3 RNs novas exige verificação de downstream (`gm-traceability`) antes de encerrar; RN nova sem destino downstream declarado (ou justificativa explícita) = pendência do lote, não encerra a sessão.
- **Arquivos:** `skills/gm-requirements/SKILL.md`, `WORKFLOW_IMPROVEMENTS.md` (este). Retrospectiva de origem: `<cliente>/docs/RETROSPECTIVE.md`.
- **Riscos/mitigações:** portão pode atrapalhar lotes legítimos sem downstream (ex: RNs de decisão) → a regra aceita justificativa explícita por RN; dependência de rodar outra skill no fechamento → verificação pode ser leitura direta da matriz de gaps existente.
- **Validação:** ✅ passo inserido no Algoritmo do gm-requirements (encoding íntegro); efeito real no próximo lote de RNs do <cliente> (delta Comandas).
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode; publicação pendente (acumulada).

---

## IMP-047 — Pattern Library v2: taxonomia de tipos + ganchos de consumo

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-pattern-extractor/SKILL.md`, `docs/patterns/**`, `AGENTS.md`, `skills/gm-project-intake/SKILL.md`, `skills/gm-clarify/SKILL.md`, `skills/gm-task-spec/SKILL.md`, `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md`.
- **Origem:** operador — "à medida que surgirem outros patterns futuramente, que podem ser padrões de código, exemplo de solução para um cenário específico, etc.". Diagnóstico prévio (grep): a library só tinha lado de oferta (extractor/retrospective); **nenhuma skill de consumo** (requirements/clarify/data-model/api/ui/architecture/task-spec) lia o INDEX — recuperação era manual.
- **Correções:**
  1. **Taxonomia de 6 tipos:** `processo | arquitetura | codigo | ui | teste | dados` — campo `**Tipo:**` no template; caminho físico `docs/patterns/<tipo>/<slug>/PATTERN.md` (padrão existente movido para `processo/adaptacao-produto-irmao/`).
  2. **Template para padrões de código:** seção `## Cenário` (o gatilho específico) + `**Evidência:**` (repo/PR/DEC — alimenta maturidade) + implementação por stack obrigatória para Tipo `codigo`.
  3. **Fronteira com stack playbooks** (seção nova no extractor): convenção geral de stack → playbook (sempre lido); solução de cenário → pattern (sob demanda).
  4. **Ganchos de consumo (fecham o gap de recuperação):** **A** — AGENTS.md índice lazy +1 linha (gatilho universal, sempre visível); **C** — intake + clarify consultam o INDEX no levantamento (Tipo `processo`/produto-irmão); **D** — dev-backend/frontend consultam Tipos `codigo/dados/arquitetura/teste` e `ui/codigo` no princípio "Reuse sobre invente"; **E** — task-spec consulta Tipos `codigo/ui/dados/teste` e cita padrões na Analise-Tecnica.
- **Arquivos:** extractor (template+fluxo+INDEX por Tipo+fronteira), padrão movido + header (Tipo/Evidência), INDEX.md real (coluna Tipo + link novo), AGENTS.md (+1 linha), intake/clarify/task-spec (+1 linha Lê cada), dev-backend/dev-frontend (princípio 4 ampliado).
- **Riscos/mitigações:** leitura eager da library inflaria contexto → todos os ganchos são **condicionais** ("quando domínio já tratado/cenário recorrente"), INDEX é 1 página; tipos mal atribuídos → extractor normaliza no Passo 2 e o INDEX agrupa por Tipo; fronteira playbook/pattern ambígua → regra explícita ("sempre → playbook; cenário → pattern").
- **Validação:** ⏳ evals das skills com cobertura (pattern-extractor, task-spec, clarify, project-intake) + registry check; efeito real = próximo cenário recorrente de código consumindo um pattern.
- **Status:** ✅ Aplicada — ⏳ validação + reiniciar OpenCode + publicação (acumulada).

---

## IMP-048 — Scorecard do Workflow: taxonomia de 14 segmentos + prática na retrospectiva

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-project-retrospective/SKILL.md` (novo Passo 4b + seção no template), `docs/METRICS.md` (§Scorecard do Workflow), `WORKFLOW_IMPROVEMENTS.md` (este — contém o baseline).
- **Origem:** operador pediu nota 0-10 por segmento; antes de registrar, questionou se os 10 segmentos iniciais abrangiam todo o workflow. Cruzeiro com o pipeline completo revelou **fases inteiras fora**: Intake, Alinhamento com cliente, Entrega/tasks, Suporte & pós, Onboarding/portabilidade, Segurança de artefatos, Integrações externas. Taxonomia de **14 segmentos** aprovada ("Adotar 14 segmentos").
- **Taxonomia:** **Fases** (Intake · Requisitos & cliente · Tradução técnica · Entrega/tasks · Desenvolvimento · Verificação & qualidade · Suporte & pós) + **Transversais** (Governança da config · Meta-melhoria · Observabilidade & eficiência · Padrões & aprendizado · Segurança · Integrações externas · Portabilidade & onboarding). Regras: **nota só com evidência do período (sem uso = N/A, nunca chute)**; toda nota cita o fato; nota geral = média das fases com evidência; tendência append-only no METRICS.md via coletor.
- **Baseline (27/09/2026, milestone <cliente> RN-063..088):**
  - Fases: Intake N/A · Requisitos & cliente **6,0** (PEND-030/031 acumuladas; SCOPE_AGREEMENT/CLIENT_REQUIREMENTS ausentes) · Tradução **7,0** (deltas RN-074..088 fluíram; gap Comandas) · Entrega **7,0** (task-spec 52/52; gh-issue-creator não exercitado) · Dev N/A · Verificação **8,0** (137 checks PASS; IMP-046; VALIDATION stale = ferida origem) · Suporte N/A → **geral fases: 7,0**
  - Transversais: Governança **8,0** · Meta-melhoria **8,5** · Observabilidade **8,0** · Padrões **6,5** (estrutura pronta, consumo não demonstrado) · Segurança **7,5** · Integrações N/A · Portabilidade **7,5**
  - **Leitura do baseline:** forte onde pressionado (meta-workflow), fraco onde não houve uso real (cliente, dev, consumo de padrões) — o sistema aprende sob demanda e não prova valor sem uso.
- **Arquivos:** `skills/gm-project-retrospective/SKILL.md` (seção no template + Passo 4b), `docs/METRICS.md` (§Scorecard do Workflow, linha baseline), `WORKFLOW_IMPROVEMENTS.md` (este).
- **Riscos/mitigações:** scorecard vira burocracia → N/A explícito mantém custo proporcional ao uso; notas subjetivas → evidência obrigatória por linha; inflação de notas → tendência append-only expõe drift.
- **Validação:** ⏳ eval de gm-project-retrospective; próximas notas só em milestone com uso real.
- **Status:** ✅ Aplicada — baseline registrado.

---

## IMP-049 — PERF_REPORT sai do domínio de documentação e passa ao domínio do workflow

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-perf-auditor/SKILL.md`, repos de docs (limpeza).
- **Origem:** operador — "os documentos de PERF são coisas relevantes para a melhoria do Workflow Golmet somente, não faz sentido colocar ele na doc". Os relatórios estavam caindo em `<docs-repo>/quality/` (repo de documentação de produtos) pelo fallback "sem módulo" do IMP-041 — poluição de domínio: telemetria do runtime não é artefato de produto.
- **Correção:**
  1. Destino fixo do relatório: `~/.config/opencode/quality/` (ao lado de `WORKFLOW_IMPROVEMENTS.md` e `docs/METRICS.md` — domínio do workflow).
  2. **Passo 1 eliminado** (descoberta de módulo + pergunta quando múltiplos): a telemetria é global do runtime — uma pergunta a menos por auditoria (alinhado com IMP-043/pedágio).
  3. Exceção documentada para sandbox de eval (runner fornece module root → `<sandbox>/quality/`), preservando os evals determinísticos.
  4. 2 relatórios existentes movidos de `<docs-repo>/quality/` → `~/.config/opencode/quality/`; pasta vazia removida do repo de docs.
- **Arquivos:** `skills/gm-perf-auditor/SKILL.md` (Resolução de caminhos, Passo 1, Tools, Casos de Borda, template front matter `project: WORKFLOW_RUNTIME`), 2 PERF_REPORTs movidos, `WORKFLOW_IMPROVEMENTS.md` (este).
- **Riscos/mitigações:** evals dependem de caminho relativo no sandbox → exceção explícita na skill mantém os checks verdes; hábito antigo de escrever no workspace → destino fixo documentado em 3 seções da skill.
- **Validação:** ✅ eval `gm-perf-auditor` reexecutado — 1 fixture, 21/21 PASS (report 2026-09-27-043351).
- **Persistência verificada (27/09/2026 — auditoria `@gm-workflow-improver`):** decisão confirmada ativa nos pontos de execução da skill — §Resolução de caminhos (L49–57: destino fixo `~/.config/opencode/quality/` + exceção sandbox `<sandbox>/quality/`), §Gera (L68), Tools `write` (L88), Algoritmo Passo 1 (L120–125: destino fixo, sem descoberta de módulo nem pergunta), template front matter `project: WORKFLOW_RUNTIME` (L235) e Caso de borda "Múltiplos módulos" (L373–374). Na auditoria foi corrigido o último residual ativo: título do template (L245) `# Perf Report — <modulo|workspace>` → `# Perf Report — Runtime OpenCode` — contradizia o Passo 1 (sem descoberta de módulo) e o front matter `module: perf-report`. Demais pontos auditados sem conflito: `gm-metrics-collector` (não menciona destino de PERF_REPORT; hand-off é só o bloco METRICS.md), `CHECKLISTS.md` (0 menções), evals `fixture-001` (criteria.yaml com paths relativos ao sandbox `quality/`, checks independentes de módulo/título — golden mantido como está), agents (`gm-quality-orchestrator` L77/L106 apenas roteia, sem destino), `gm-next`/`AGENTS.md`/`registry.yaml`/`ARCHITECTURE.md` (0 menções). Caminho relativo `quality/PERF_REPORT_...` na description (L7) e no Passo 5 (L166) mantido — neutro, compatível com destino fixo e sandbox. Registros históricos (este log, health-monitor IMP-011) inalterados.
- **Status:** ✅ Aplicada — persistência auditada (27/09); ⏳ reiniciar OpenCode; publicação (acumulada, 9 IMPs).
---
## IMP-051 — Verificação visual browser-in-the-loop no gm-dev-frontend (inspirado no Antigravity)

- **Data:** 27/09/2026
- **Alvo:** `agents/gm-dev-frontend.md` + `skills/gm-stack-angular/SKILL.md`
- **Origem:** pedido do operador — elevar o Golmet ao nível de processo do Google Antigravity, cujo diferencial é o browser-in-the-loop: o agente abre a app num browser real, interage e verifica a própria UI (fontes: antigravity.google/use-cases/frontend — "browser-in-the-loop testing of its own code"; docs/ide/browser — Browser Subagent com screenshots; docs/artifacts — artifacts como evidência revisável; docs/getting-started — Best Practices: "verification loops").
- **Problema:** o executor frontend encerrava a task em testes unitários verdes — nenhuma etapa validava a UI renderizada contra a UI_SPEC; verificação visual adiada para homologação (caso de borda do playbook).
- **Causa raiz:** instrução ausente — o processo invariante do agente não tinha passo de verificação visual e o playbook não documentava dev server para inspeção. As ferramentas já existiam (MCP Playwright via `mcp-playwright-setup`; MCP Figma; FIGMA_PROMPTS.md como referência de protótipo) — faltava o loop.
- **Correção (opção A — edição mínima, pré-aprovada):**
  1. `gm-dev-frontend`: novo **Passo 7.5 "Verificação visual (browser-in-the-loop)"** — pré-condições (dev server + MCP Playwright; falta → `visual: not-verified (motivo)`, sem configurar infra por conta própria), percorrer a tela como usuário (screenshot por estado + console do browser), comparação item a item com a UI_SPEC (e protótipo Figma quando houver), iteração com teto de 3 ciclos (anti-runaway, lição IMP-042), evidência durável = relatório. + Princípio 6, tools `playwright_browser_*` listadas, linha `visual:` no formato de saída, 2 casos de borda novos (`needs-playwright-mcp`; MFE sem shell).
  2. `gm-stack-angular`: seção "Verificação visual (browser-in-the-loop)" — o "como" Angular: `ng serve` em background via `Start-Process`, porta por `angular.json`, subir o **shell** em MFE, tools playwright de navegar/aguardar/capturar.
- **Alternativas avaliadas (trade-offs):** B) skill dedicada `gm-visual-verify` — reuso maior, mas único consumidor hoje + custo de registry/render/evals; reavaliar quando entrar 2ª stack (React). C) subagent auditor visual — rodada extra de `task`, contra o espírito do IMP-043 (menos rodadas); descartada.
- **Arquivos:** `agents/gm-dev-frontend.md` (7 edições; front matter/permissões intactos), `skills/gm-stack-angular/SKILL.md` (1 seção nova), `WORKFLOW_IMPROVEMENTS.md` (este). **Registry inalterado** — nenhum componente novo; delegação permanece agent → playbook (MCP Playwright é tool de projeto, não skill de fluxo), sem necessidade de `gm-registry-render`.
- **Evals:** ✅ `gm-stack-angular` fixture-001 — **10/10 PASS** pós-edição (relatório EVAL_REPORT_runner_skill-gm-stack-angular_2026-09-27-022934.md).
- **Dependência prática:** o loop só roda em projetos com MCP Playwright configurado (`mcp-playwright-setup`) e dev server disponível; caso contrário o relatório carrega `visual: not-verified (motivo)` — degradação explícita, nunca silenciosa.
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode para valer; publicação via `gm-self-publish` pendente (acumulada com IMP-040..043).
- **Ratificação:** ✅ ratificado pelo usuário em 27/09/2026 — mudanças **MANTIDAS**, nada a reverter (decisão coletada pelo primary via `question`; cumpre o gate Plan-first do IMP-046).
## IMP-052 — Sessão do improver morre em silêncio + percepção de loop de narração (free-tier glm-5.3-flash)

- **Data:** 27/09/2026
- **Alvo:** `@gm-workflow-improver` (próprio prompt)
- **Problema:** na sessão `ses_f1eb40a7fffe0JwgbdvINU9uOR` ("Melhoria Golmet: verificação visual estilo Antigravity") o agente repetiu narrações curtas de plano por 9 turnos e parou sem erro nem entrega — reportado pelo operador como "repetiu a mesma coisa várias vezes e parou do nada".
- **Evidência (opencode.db, read-only):** 9 voltas assistant com textos DISTINTOS e progressivos (35–143 tok/turno; 8 delas apenas narrando "vou fazer X"); 21 tool calls com inputs todos distintos (zero repetição literal — dump completo de text parts e tool parts); turno final real: 7.696 tok de reasoning (~166s) e um bash trivial preso 51,7s em status `running` (tools paralelos: 46–190ms); mensagem final `msg_0e15204d5001` criada com 0 tok in/0 out, sem `completed`, sem texto e sem tool — stream do provider (`zai-coding-plan`/`glm-5.3-flash`, free tier) que nunca produziu token. Zero eventos `asking`/`cancel`; log da janela não preservado (`opencode.log` contém só o run corrente).
- **Causa raiz:** (1) morte silenciosa = falha de infra — stream vazio do provider free-tier no 10º turno, sem retry/handler no runtime; o bash preso em `running` (51,7s) esticou o turno e foi o gatilho provável. (2) percepção de "repetição" = estilo: 8 turnos de narração de plano no mesmo formato antes de qualquer entrega — não é loop literal.
- **Refutado:** permissão `doom_loop` (doc do OpenCode: dispara só com 3+ tool-calls consecutivos IDÊNTICOS — mesmo tool + mesmo input JSON; não cobre este modo de falha); plugin `falcode.js` (arquivo inexistente); gate do IMP-039 e padrões bash do IMP-042 (zero eventos na janela).
- **Correção (aplicada):** 2 princípios novos no prompt do próprio improver — #6 "Batch de coleta" (leituras independentes num único turno; máx. 2 turnos de coleta sem publicar saída; menos turnos = menos exposição a stream vazio) e #7 "Anti-loop de narração" (narração só com resultado novo; repetir plano 2× sem progresso → entregar diagnóstico parcial).
- **Arquivos:** `agents/gm-workflow-improver.md`, `WORKFLOW_IMPROVEMENTS.md` (este).
- **Pendências para o operador (fora do escopo seguro do improver):** (a) fallback/modelo pago para subagents longos — blocos `provider`/`model` do opencode.jsonc são "nunca edita" (tradeoff: custo vs. confiabilidade; única correção que ataca a causa 1 de frente); (b) retry on empty stream é feature de core do OpenCode, não config — sugerir upstream; (c) `doom_loop` NÃO recomendada para este caso (não cobre stream vazio).
- **Riscos/mitigações:** #6 pode partir o diagnóstico cedo em módulos grandes — mitigação: no 3º turno publica-se diagnóstico PARCIAL, não final; #7 é comportamental (sem guard duro no runtime).
- **Validação:** re-leitura do arquivo editado (front matter intacto; LF/no-BOM preservados). Evals NÃO aplicáveis (correção em agent, não em skill — Passo 5.5 não se aplica).
- **Nota de numeração:** IMP-051 reservado à task interrompida (verificação visual Antigravity) — re-executá-la para gerar o registro; este IMP usa o próximo número livre para não colidir.
- **Status:** ⚠️ Aplicada — reiniciar OpenCode; publicação via `gm-self-publish` pendente (acumulada com IMP-040..043).
## IMP-053 — Gate Plan-first incondicional no @gm-workflow-improver

- **Data:** 27/09/2026
- **Alvo:** `@gm-workflow-improver` (próprio prompt)
- **Problema:** na sessão do IMP-051, o pedido original do operador sinalizava intenção de planejamento ("algo a se ponderar **no planejamento** dessa melhoria"), mas o improver diagnosticou, escolheu a opção A e **aplicou as edições sem nenhuma pergunta** — e seguiu a pré-autorização ampla do prompt de delegação ("pode aplicar direto") em vez da intenção do usuário.
- **Causa raiz (composta):** (1) instrução fraca — o princípio 3 ("Confirme antes de editar") e o Passo 4 não instituíam ponto de parada obrigatório nem formato de plano; a decisão de aplicar ficou na discricionariedade de quem delegou. (2) Aprovação tratada como delegável — nada no prompt impedia que pré-autorização do delegador substituísse a aprovação do usuário. Categoria: instrução ausente + instrução ambígua.
- **Correção:** gate incondicional "Plan-first", propriedade do componente (imune a pré-autorização de delegação): (a) princípio 3 reescrito como gate incondicional; (b) nova seção "Gate Plan-first (incondicional)" com 3 regras — plan-first por padrão (plano e PARA), aprovação não-delegável (só o usuário, na sessão corrente; em conflito delegador × usuário prevalece o usuário; padrão é perguntar), única exceção (correção trivial pedida na mesma frase — ainda assim registrada) + formato obrigatório do plano (diagnóstico → tabela de opções com trade-offs → recomendação → arquivos afetados → pergunta: continuar/ajustar/só registrar); (c) Passo 4 reescrito como ponto de parada obrigatório ("nenhum edit/write antes daqui") com checklist da origem da aprovação; Passo 5 retitulado "somente após aprovação do gate"; (d) linha do tool `question` atualizada; (e) novo caso de borda "Pré-autorização do delegador".
- **Arquivos:** `agents/gm-workflow-improver.md` (5 edições; front matter/permissões intactos; UTF-8 sem BOM preservado), `WORKFLOW_IMPROVEMENTS.md` (este).
- **Evidência relacionada — IMP-051:** as mudanças dele (Passo 7.5 no `gm-dev-frontend`, seção no `gm-stack-angular`) foram aplicadas SEM consulta e **AGUARDA RATIFICAÇÃO do operador** (manter ou reverter — decisão dele; quem pergunta é o primary, não o improver). O registro do IMP-051 permanece válido como documentação técnica da correção.
- **Coerência:** materializa o IMP-043 no improver — "pedágio ≠ pergunta": decisão de negócio/arquitetura nunca é suprimida; o gate é pergunta de decisão, não pedágio.
- **Evals:** N/A (correção em agent — Passo 5.5 não se aplica). **Fixture criada em 27/09/2026** (ratificação do operador): `evals/gm-workflow-improver/fixture-001` — input com pedido original de planejamento + delegação "pode aplicar direto" + skill alvo fictícia; runner determinístico (baseline-mode): **11/11 PASS** (plano registrado no formato do gate, pré-autorização do delegador rejeitada, skill alvo intocada — `not_contains "Passo 8"`). Execução agêntica em sandbox (Passo 2c da `gm-skill-eval`) permanece disponível como fluxo de agente.
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode para valer; publicação via `gm-self-publish` pendente (acumulada com IMP-040..045).

---
## IMP-054 — Remoção das skills SDD legadas (20 dirs em `~/.agents/skills/`)

- **Data:** 27/09/2026
- **Alvo:** `~ (20 diretórios) — **removidos**.
- **Origem:** pedido do operador ("remover as skills e subagents do antigo sdd que não usamos mais") — o SDD foi o predecessor do Golmet; todas as 20 skills têm equivalente `Golmet-*` ativo em `~/.config/opencode/skills/` (mesma numeração de função: intake, clarify, requirements, data-model, api-contracts, ui-spec, architecture, glossary, acceptance-criteria, test-strategy, traceability, validate, change-request, scope-agreement, governance, howto, known-error, legacy-context, migration + `sdd-user-stories`, coberto pelos fluxos `gm-req`).
- **Inventário pré-remoção (evidência):** 20 dirs `sdd-*` em `~/.agents/skills/`; **zero** subagents SDD (`~/.agents/agents/` vazio; `~/.config/opencode/agents/` sem `sdd-*`); **zero** skills `sdd-*` em `~/.config/opencode/skills/` e `~/.claude/skills/`; **zero** referências ativas nos docs da config (CHECKLISTS.md, registry.yaml, ARCHITECTURE.md, opencode.jsonc, AGENTS.md — grep `sdd-[a-z]` = 0 em todos); `~/.agents` **não é** repo git (remoção sem impacto de versionamento). Menções históricas em `WORKFLOW_IMPROVEMENTS.md` (IMPs 013+) preservadas — são registro histórico, não referência ativa.
- **Benefício:** remove 20 descrições do índice de skills carregado em TODO turno (line item do P1 "podar índice de skills" do IMP-042 — reduz o custo fixo de tok_in/turno) e elimina ambiguidade de roteamento SDD × Golmet.
- **Efeito:** visível no próximo restart (índice de skills é montado no boot — warn de "duplicate skill name" do log é sobre caveman/find-docs, não sdd).
- **Validação:** ✅ pós-remoção: 0 dirs `sdd-*` restantes; 9 skills remanescentes em `~/.agents/skills/` (cavecrew/caveman/find-docs/find-skills — fora do escopo SDD, intocadas).
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode para o índice recarregar.
## IMP-055 — AGENTS.md Global enxuto com lazy loading de referências (`rules/`)

- **Data:** 26/09/2026
- **Alvo:** `~/.config/opencode/AGENTS.md` (global) + novo diretório `~/.config/opencode/rules/`
- **Origem:** sessão de melhoria do `@gm-workflow-improver` — suspeita do operador de que o AGENTS.md global estava grande demais e de que deveria usar "poucos detalhes + referência sob demanda".
- **Problema:** AGENTS.md global tinha 95 linhas / 6.782 chars (~1.696 tokens) carregados em **toda sessão, para todo agente**, mas só ~40% era invariante. Blocos condicionais pesados ocupavam o contexto sempre: `context7` (~495 tokens, só em perguntas de lib), `<org>`-produto (~450 tokens, só ao editar `<docs-repo>`), `<cliente>-postgres` (~156 tokens, só no repo <cliente>). Achados adicionais: bloco `sdd-advisor` referenciava agente **inexistente** (equivalente real = skill `gm-next`); bloco `lean-ctx` descrevia tools `ctx_*` **não instaladas**; `diretorio_projetos` apontava `C:\Users\Michel\Desktop\Projects` (path de outra máquina); seção "Hierarquia de Convenções" era referenciada por `agents/gm-dev.md` e `skills/gm-primary-agent-creator` mas **não existia** no arquivo.
- **Técnica:** lazy loading manual de instruções — padrão **oficialmente documentado pelo OpenCode** ("Manual Instructions in AGENTS.md": *load on a need-to-know basis, do NOT preemptively load*). Verificado: `AGENTS.local.md`/includes de AGENTS.md **não** existem; `instructions[]` no `opencode.jsonc` é **eager** (não reduz tokens). Opção escolhida: arquivos `.md` modulares por tema + índice de 1 linha por tema no AGENTS.md.
- **Correção (prova de conceito — escopo acordado com o usuário):**
  - **Criado** `rules/context7.md`, `rules/<org>-produto.md`, `rules/<cliente>-postgres.md` — conteúdo movido fielmente, cada um com gatilho "ler ANTES/AO..." no topo.
  - **Reescrito** `AGENTS.md`: 95 → **39 linhas** (6.782 → 2.275 chars; ~1.696 → ~569 tokens, **−66%**). Mantidos: bloco `azure-devops` intacto (compat com `gm-setup`/evals), invariantes <org> (org, naming, tríade, PEND IMP-031), seção `OUTPUT STYLE: concise` (decisão do usuário), Hierarquia de Convenções (repara referência quebrada), marcadores `<!-- projeto-padrao -->`/`<!-- azure-devops -->`, e novo **Índice de Referências — lazy loading** (3 entradas + instrução imperativa CRITICAL).
  - **Removidos:** `sdd-advisor` (agente inexistente → 1 linha "o que fazer agora → `gm-next`"), `lean-ctx-rules`/shadow mode (não instalado), blocos movidos para `rules/`.
  - **Corrigido:** `diretorio_projetos` → `~
- **Fase 2 (aplicada em 26/09/2026):** `gm-setup` (Passo 1 diagnostica índice+rules, Passo 3.2 repõe índice, relatório e caso de borda), `gm-agents-md-sync` (precedência global inclui `rules/*.md`), `gm-agent-health-monitor` (nova **Verificação G**: índice ↔ arquivos existentes, refs quebradas, rules órfãos, seção Hierarquia, teto de linhas, marcadores gm-setup), `CHECKLISTS.md` (regra "não remove conteúdo" → "não remove sem destino (IMP-040)" + item pós-edição do índice lazy).
- **Arquivos:** `AGENTS.md` (reescrito), `rules/context7.md`, `rules/<org>-produto.md`, `rules/<cliente>-postgres.md` (novos), `skills/gm-setup/SKILL.md`, `skills/gm-agents-md-sync/SKILL.md`, `skills/gm-agent-health-monitor/SKILL.md`, `CHECKLISTS.md`.
- **Riscos/mitigações:** IA não saber que a referência existe → índice sempre visível (1 linha/tema); IA não ler o arquivo → instrução CRITICAL + gatilho ANTES DE + smoke test; perda de regra crítica → invariantes (org, PEND, naming) permanecem no AGENTS.md. ⚠️ `AGENTS.md` é gitignored (local por máquina) — `rules/` versionável; índice re-gerado por `gm-setup` em outras máquinas.
- **Validação:** ✅ marcadores `azure-devops`/`projeto-padrao`/`<org>` preservados; ✅ 3 arquivos em `rules/`; ✅ pós-restart: novo AGENTS.md carregado, lazy read de `rules/context7.md` funcionou, invariantes visíveis; ✅ evals: `gm-setup` 8/8, `mcp-postgres-setup` 11/11, `gm-agent-health-monitor` 5/5 (**24/24 PASS**, exit 0).
- **Pendente:** publicação da config via `gm-self-publish` (rules/ + skills + CHECKLISTS versionados).
- **Status:** ✅ Aplicada (config + fase 2) — ⏳ publicação pendente

## IMP-056 — Sincronização desc↔corpo nos orquestradores + schema Jev validado (auditoria AGENT_QUALITY 2026-09-27)

- **Data:** 27/09/2026
- **Alvo:** `agents/gm-jev-classifier.md`, `agents/gm-github-orchestrator.md`, `agents/gm-support-orchestrator.md`, `agents/gm-quality-orchestrator.md`, `agents/gm-translation-orchestrator.md`
- **Problema:** auditoria Jev (quality/AGENT_QUALITY_2026-09-27.md) apontou os 5 piores scores da frota Golmet: fidelidade description↔corpo baixa (15–55), gm-jev-classifier sem estrutura padrão e com formato de `questions` divergente do schema real, gm-github-orchestrator sem seções padrão, e rota para skill fantasma `gm-gerar-especificacao-us`.
- **Causa raiz:** drift de manutenção — descriptions não acompanharam a evolução das skills roteadas; jev-classifier documentava `noul` sem `criteria` (schema validado contra API jev-1.13.0: `instructions` + `criteria` dict `true`/`false`).
- **Correção:** (1) jev-classifier: formato Noul corrigido para `instructions` + `criteria` dict `true`/`false` (validado com chamada real à API; criteria obrigatório em toda question como convenção Golmet, mais estrito que a API) + seções Quando invocar/Lê/Gera/Formato de saída. (2) github-orchestrator: seções Quando invocar/Princípios/Lê/Gera/Formato de saída/Casos de Borda + fluxo de milestones documentado (a skill de issues vincula a milestone e cria no repo se inexistente). (3) support-orchestrator: description agora lista `gm-incident-postmortem`. (4) quality-orchestrator: description agora lista lint documental (`gm-wiki-lint`) e auditoria de performance (`gm-perf-auditor`) — existências confirmadas via glob; `gm-azure-tasks-ingestor` NÃO anunciada (skill inexistente). (5) translation-orchestrator: rota fantasma `gm-gerar-especificacao-us` removida (nenhuma skill de user stories existe); "histórias de usuário" removida da description e USER_STORIES do Gera — description/tabela/rotas consistentes em 6 domínios.
- **Arquivos:** os 5 agents acima — nenhum outro arquivo tocado; grafo (registry.yaml/ARCHITECTURE.md) não muda.
- **Validação:** re-avaliação Jev (jev-1.13.0, mesmos critérios/schemas do relatório): fidelidade desc↔corpo subiu nos 5 (jev 55→65 · github 41→77 · support 15→61 · quality 15→68 · translation 43→62); estrutura jev 35,5→97,5 e github 51→98,5; severidade atenção→ok nos 5. Aggregados (sensíveis ao digest): jev 69,8→81,4 · github 67,8→82,9 · support 76,4→76,1 · quality 77,1→74,5 · translation 82,0→75,6 — deltas negativos concentrados em acionabilidade, efeito de compressão do digest desta re-avaliação vs auditoria original (nenhum gatilho real removido além da rota fantasma).
- **Pendências (fora do escopo autorizado):** (1) `gm-azure-tasks-ingestor` roteada no corpo de gm-quality-orchestrator mas inexistente em skills/ — criar a skill ou remover a rota (mudaria roteamento); (2) domínio user stories sem skill geradora — criar se o domínio voltar ao escopo; (3) H3 "Skills Transversais" aninhado no bloco BEGIN_REGISTRY está em `gm-dev.md` (não no github-orchestrator, como sugerido no relatório) — corrigir via gm-registry-render em task própria.
- **Status:** ✅ Aplicada — ⏳ reiniciar OpenCode para valer.
## IMP-057 — Sanitização I→M e completude estrutural (auditoria Jev de 57 skills)

- **Data:** 27/09/2026
- **Alvo:** `gm-agent-health-monitor`, `gm-self-publish`, `gm-agents-md-sync`, `gm-setup`, `gm-metrics-collector`, `gm-migration`, `gm-quality-gates`
- **Problema:** auditoria Jev (`quality/SKILL_QUALITY_2026-09-27.md`): corrupção sistemática I→M deixando globs/marcadores inexecutáveis (`SKMLL.md`, `CHECKLMSTS.md`, `PROPAGATMON_STATUS.md`, `TRACEABMLMTY.md`, `MMP-0XX`, `BEGMN`, `CANDMDATE`, `CONFLMCT`, `MMSSMNG`, `AMBMGUOUS`, `SPECMFMC`, `REPOSMTORMES.md`, `PMA`, `CLM`, `CRMTMCAL`, `Mdempotente`, `REQUMREMENTS`, `CONSTMTUTMON`, `MNDEX`, `FMXME`, `泛型`, "não happened"); linha "dd-setup" sem prefixo (`gm-self-publish`); `gm-migration` sem triggers na description; `gm-metrics-collector` sem contrato de hand-off do perf-auditor e sem Modo de erro; `gm-quality-gates` sem Modo de erro.
- **Causa raiz:** corrupção de token na geração das skills (categoria transversal) + seções padrão ausentes (instrução ausente/template incompleto).
- **Correção:** 53 pares de token corrigidos (104 ocorrências) preservando a intenção original — 27 pares no health-monitor, 13 no agents-md-sync, 9 no setup, 2 no quality-gates, 1 regex no self-publish (`via gm-setup`), 1 description no migration (triggers "migração de dados"/"estratégia de corte"/"MIGRATION"); seção `## Hand-off do gm-perf-auditor (contrato)` + `## Modo de erro` + item 4 do Passo 2 no metrics-collector; `## Modo de erro` no quality-gates. Sem mudança de comportamento/função de nenhuma skill.
- **Arquivos:** `skills/gm-agent-health-monitor/SKILL.md`; `skills/gm-self-publish/SKILL.md`; `skills/gm-agents-md-sync/SKILL.md`; `skills/gm-setup/SKILL.md`; `skills/gm-metrics-collector/SKILL.md`; `skills/gm-migration/SKILL.md`; `skills/gm-quality-gates/SKILL.md`
- **Validação:** re-avaliação Jev (jev-1.13.0, mesmo questionário e fórmula do relatório; texto compacto por skill): health-monitor 75.6→82.0 (severidade critico→atencao); self-publish 85.4→73.8 (choice ok; score amostral com confidence 0 — ressalva de amostra); agents-md-sync 74.3→88.0; metrics-collector 60.9→85.0; migration 70.5→89.8; quality-gates 72.1→81.5; setup 87.9→85.8 (empate técnico). Nenhum veredito critico pós-correção; nenhuma skill abaixo de 70. Re-grep global em `skills/`: zero corrupções I→M remanescentes. Globs do health-monitor referenciam arquivos existentes (`SKILL.md`, `CHECKLISTS.md`, `registry.yaml` verificados por glob).
- **Pendências (registradas, fora do escopo deste IMP):** (1) mesmo "dd-setup" em `gm-self-update` (L23); (2) token `基于` em `gm-skill-evolution`; (3) emoji `�` nos templates de `gm-wiki-lint` e `gm-decision-audit`; (4) unificação do formato de DEC: DEC-XXX (`gm-decision-log`) vs ADR-NNN MADR (`gm-requirements`) — divergência estrutural, exige decisão de design (campos Decisor/Responsável, vocabulário de status e ID divergem); (5) `question` ausente nas Tools de `gm-metrics-collector` e `gm-agent-health-monitor` (ambas usam no Passo 1); (6) evals frescos pendentes para as 4 skills com fixture (health-monitor, metrics-collector, migration, setup) — exigidos pelo Golden Set Gate no próximo `gm-self-publish`.
- **Status:** aplicada

## IMP-058 — Pendências mecânicas pós-auditoria (fixes pontuais dos ciclos IMP-056/057)

- **Data:** 27/09/2026
- **Alvo:** `gm-self-update`, `gm-metrics-collector` (editados); `gm-agent-health-monitor`, `gm-skill-evolution`, `gm-wiki-lint`, `gm-quality-orchestrator` (verificados, já conformes)
- **Problema:** pendências do IMP-057 (itens 1, 2, 3, 5) e do IMP-056 (item 1): "dd-setup" sem prefixo em gm-self-update (L23); token CJK "基于" em gm-skill-evolution (Formato de commit); emoji replacement char (U+FFFD) nos templates de gm-wiki-lint; `question` ausente nas Tools de gm-metrics-collector e gm-agent-health-monitor; rota para a skill inexistente `gm-azure-tasks-ingestor` em gm-quality-orchestrator (decisão do operador: remover rota, não criar a skill).
- **Causa raiz:** resíduos de corrupção de token da geração (categoria I→M do IMP-057) + declaração de Tools incompleta + rota para skill nunca criada.
- **Correção:** (1) `skills/gm-self-update/SKILL.md` L23: quebra corrompida "via dd-setup)" (linha partida em duas) unificada como "via gm-setup)" — nota: o prompt de delegação apontava `agents/gm-self-update.md`, caminho inexistente; o defeito reside na skill (pendência 1 do IMP-057). (2) `skills/gm-metrics-collector/SKILL.md`: tool `question` adicionada à seção Tools (usada no Passo 1). Verificados sem necessidade de edição: gm-skill-evolution L168 já usa "baseado em"; gm-wiki-lint sem U+FFFD (emojis ✅/⚠️/❌/ℹ️ válidos nos templates); gm-agent-health-monitor já declara `question` nas Tools (L77); gm-quality-orchestrator com zero ocorrências de gm-azure-tasks-ingestor (limpo no ciclo IMP-056). Referências remanescentes a gm-azure-tasks-ingestor em `TROUBLESHOOTING.md` (L156) e `ROADMAP.md` (R-021) ficam FORA deste escopo (arquivos não autorizados na sessão).
- **Arquivos:** `skills/gm-self-update/SKILL.md`; `skills/gm-metrics-collector/SKILL.md` — apenas estes 2 editados. Nenhum artefato de módulo, registry.yaml, ARCHITECTURE.md ou gm-decision-audit tocado.
- **Status:** aplicada
## IMP-059 — Migração do esquema de decisões: DEC-XXX → ADR-NNN (MADR)

- **Data:** 27/09/2026
- **Alvo:** `gm-decision-log`, `gm-decision-audit` + referências em 9 arquivos da config
- **Problema:** dois esquemas concorrentes — `gm-requirements` gravava `ADR-NNN` MADR e `gm-decision-log` gravava `## [DEC-XXX]` (Status active/superseded, Responsável), gerando DECISIONS.md híbrido que quebrava o `gm-decision-audit`
- **Causa raiz:** convenção conflitante — skill de decision-log anterior ao padrão ADR adotado no gm-requirements
- **Correção:** decisão do operador — ADR-NNN/MADR é o padrão único da config. decision-log reescrito (template MADR, geração de ID ADR-NNN, supersede `Superseded by ADR-YYY`, campo Decisor, commit, triggers com mapeamento "DEC-XXX"→ADR); decision-audit valida sequência ADR e trata DEC-XXX como legado imutável (seção própria no relatório, não falha); IDs estáveis nos primaries/CONSTITUTION.md atualizados com nota de legado; validators (validate, drift-detector, traceability, restructure, pattern-extractor) reconhecem ADR-NNN ativo + DEC-XXX legado. **Política histórica: entradas DEC-XXX existentes em módulos de produto NUNCA são renumeradas nem migradas.**
- **Arquivos:** `skills/gm-decision-log/SKILL.md`, `skills/gm-decision-audit/SKILL.md`, `agents/gm-req.md`, `agents/gm-requirements-orchestrator.md`, `skills/gm-drift-detector/SKILL.md`, `skills/gm-validate/SKILL.md`, `skills/gm-traceability/SKILL.md`, `skills/gm-restructure/SKILL.md`, `skills/gm-pattern-extractor/SKILL.md`, `docs/patterns/processo/adaptacao-produto-irmao/PATTERN.md`, `<docs-repo>/CONSTITUTION.md`
- **Pendências:** baselines de eval regenerados na mesma sessão (decision-log, decision-audit, requirements) — golden set agora valida o formato pós-migração; re-render do registry não necessário (zero ocorrências DEC- nele; edições fora dos blocos BEGIN/END_REGISTRY).
- **Status:** aplicada

## IMP-060 — Investigação do 400 "noul" no eval do decision-audit

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-decision-audit/SKILL.md` (seção Segunda Camada Semântica)
- **Problema:** no eval golden-set (17:18), a camada Jev do decision-audit falhou 3x com erro 400 ("rejeitou `noul` mesmo com criteria DICT") e foi omitida do relatório.
- **Causa raiz:** investigação reproduziu o payload documentado na skill de 3 formas (MCP tool com instructions; payload combinado; snippet PowerShell verbatim via Invoke-RestMethod) — **todas 200 na 1ª chamada**. O schema da skill está correto; a falha foi construção ad-hoc do chamador no eval (payload exato perdido — sandbox destruída). Uma questão malformada envenena a chamada inteira e o erro da API aponta para o primeiro campo problemático, nem sempre o real. A lição do dia estava simplificada demais ("criteria obrigatório em toda question"): `noul` aceita 3 formas — `instructions` sozinho, `criteria` DICT sozinho, ou ambos (gm-jev-classifier já documentava isso corretamente).
- **Correção:** regra anti-improvisação adicionada à seção Segunda Camada: snippet verbatim em retentativa, capture o payload exato antes de retentar, 3 formas válidas de noul documentadas com data de verificação.
- **Arquivos:** `skills/gm-decision-audit/SKILL.md` — apenas este editado.
- **Status:** aplicada

## IMP-061 — Destino de METRICS.md e patterns/ sai da config e vai ao repo de docs do produto

- **Data:** 27/09/2026
- **Alvo:** `gm-metrics-collector`, `gm-pattern-extractor` (escrita); `gm-project-retrospective`, `gm-skill-evolution`, `gm-perf-auditor`, `gm-task-spec`, `gm-project-intake`, `gm-clarify`, `@gm-dev-backend`, `@gm-dev-frontend`, `AGENTS.md` (referências)
- **Problema:** `docs/METRICS.md` e `docs/patterns/**` (conteúdo de negócio <org>) eram gravados em `~/.config/opencode/docs/` — repo de config genérica/portável (<config-repo>) — em vez do repo de docs do produto (<docs-repo>).
- **Causa raiz:** Instrução com path fixo — as skills de escrita não definiam mecanismo de resolução de destino e os consumidores referenciavam `~/.config/opencode/docs/patterns/INDEX.md` hardcoded.
- **Correção:** (1) novo bloco `<!-- gm-docs-repo -->` no AGENTS.md global com `repo_docs: ~ (2) seção "Resolução de destino (IMP-061)" nas skills de escrita — destino = `<repo_docs>/docs/...`, bloco ausente → `question` (nunca `~/.config/opencode/docs/`), exceção sandbox de eval com paths relativos; (3) consumidores read-only atualizados de path absoluto da config para `<repo_docs>/docs/patterns/INDEX.md`; (4) títulos dos templates (METRICS/INDEX) passam a usar `<repo_docs>`. Nomes finais em <docs-repo>: `docs/patterns/` (mantém a referência do lazy index do AGENTS.md, que já apontava `docs/patterns/INDEX.md`) e `docs/METRICS.md` (métrica cross-projeto → raiz do repo de docs, consistente com patterns). Migração dos artefatos existentes de `~/.config/opencode/docs/` proposta ao operador (fora do escopo desta sessão).
- **Arquivos:** `AGENTS.md`; `skills/gm-metrics-collector/SKILL.md`; `skills/gm-pattern-extractor/SKILL.md`; `skills/gm-project-retrospective/SKILL.md`; `skills/gm-skill-evolution/SKILL.md`; `skills/gm-perf-auditor/SKILL.md`; `skills/gm-task-spec/SKILL.md`; `skills/gm-project-intake/SKILL.md`; `skills/gm-clarify/SKILL.md`; `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`; `WORKFLOW_IMPROVEMENTS.md` (este)
- **Status:** aplicada

## IMP-062 — gm-perf-auditor: dedupe de turnos de forks + session_id 12 chars no get-perf-metrics.ps1

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-perf-auditor/scripts/get-perf-metrics.ps1`
- **Problema:** forks de sessão duplicam turnos nas métricas — o mesmo turno era contado em 2+ session_ids (evidência: ses_f5d4/ses_f98d guardam turnos com timestamps idênticos), inflando totais e percentis e repetindo sessões no Top-N; session_id aparecia truncado em 8 chars no campo `session` (colisões visuais, ex.: ses_f1eb 3x no Top-10).
- **Causa raiz:** Instrução ausente — a coleta não deduplicava turnos e `Get-ShortId` truncava a 8 chars. Nota de verificação: a prescrição original era dedupe por `message.id`, mas o banco prova que forks copiam mensagens com ids NOVOS (COUNT(*) = COUNT(DISTINCT id)); a chave efetiva é a assinatura temporal `t_created|t_completed|role`.
- **Correção:** (1) dedupe de rows pela assinatura `t_created|t_completed|role` (HashSet, 1ª ocorrência vence — rows já ordenados por session_id, t_created) logo após a coleta; (2) `Get-ShortId` 8 → 12 chars nos campos `session`; (3) cabeçalho do script documenta a evidência. Interface preservada (`$Days`, `$TopSlow`, `$RunawayTokIn = 200000`, `$OutFile`) e contrato do JSON mantido. Disciplina PS 5.1 mantida (cmdlets com nome completo, sem Invoke-Expression, sem path de máquina).
- **Verificação:** smoke `-Days 2 -TopSlow 5 -RunawayTokIn 200000 -OutFile $env:TEMP\perf-smoke.json` → exit 0, JSON válido, has_data=true. Com `-Days 30`: 24.429 → 16.926 turnos (−7.503 duplicados, −31%) e 249 → 246 sessões; Top-10 sem repetição do mesmo turno.
- **Arquivos:** `skills/gm-perf-auditor/scripts/get-perf-metrics.ps1` — apenas este.
- **Status:** aplicada

## IMP-063 — gm-api-contracts: numeração duplicada na Fase 2 (dois passos "11.")

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-api-contracts/SKILL.md` (Fase 2 — Modelar contratos)
- **Problema:** dois passos consecutivos numerados "11." (registro de erro em ERROR_CATALOG.md e escrita de API_CONTRACTS.md/ERROR_CATALOG.md).
- **Causa raiz:** erro de numeração manual no Workflow.
- **Correção:** passo de escrita renumerado para "12." — sequência 5..12 contínua.
- **Arquivos:** `skills/gm-api-contracts/SKILL.md` — apenas este.
- **Status:** aplicada

## IMP-064 — gm-clarify: triagem de PENDs apontava §3 em vez de §11 (Pendências)

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-clarify/SKILL.md` (Workflow de Triagem, passo 1)
- **Problema:** a triagem de PENDs instrui extrair PENDs de "REQUIREMENTS.md (seção §3 — Pendências)", mas o template canônico de REQUIREMENTS.md usa §11 para Pendências (a própria skill referencia §11 na seção "Compatibilidade com gm-requirements").
- **Causa raiz:** referência de seção defasada (convenção conflitante com o template canônico).
- **Correção:** referência alinhada para "§11 — Pendências".
- **Arquivos:** `skills/gm-clarify/SKILL.md` — apenas este.
- **Status:** aplicada

## IMP-065 — gm-governance: caminhos obsoletos docs/CONSTITUTION.md e docs/SKILL_REGISTRY.md

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-governance/SKILL.md`
- **Problema:** a skill referenciava `docs/CONSTITUTION.md`, `docs/PRODUCT_GOAL.md` e `docs/SKILL_REGISTRY.md` — CONSTITUTION.md vive na RAIZ do repo de docs do produto (<docs-repo>) e SKILL_REGISTRY.md não existe mais (substituído pelo registry.yaml, fonte da verdade — IMP-027).
- **Causa raiz:** convenção conflitante — skill anterior à migração de estrutura (CONSTITUTION na raiz do repo de docs, IMP-059) e à adoção do registry.yaml.
- **Correção:** 10 referências atualizadas — CONSTITUTION.md/PRODUCT_GOAL.md na raiz do repo de docs (resolvidos via bloco `<!-- gm-docs-repo -->` do AGENTS.md); SKILL_REGISTRY.md → `registry.yaml` (Referências, Lê, Gera, Tools, Workflow passo 2). Assertion de zero resíduos dos caminhos antigos.
- **Arquivos:** `skills/gm-governance/SKILL.md` — apenas este.
- **Status:** aplicada

## IMP-066 — gm-pattern-extractor: tool `question` usada mas ausente das Tools

- **Data:** 27/09/2026
- **Alvo:** `skills/gm-pattern-extractor/SKILL.md` (seção Tools)
- **Problema:** a skill usa `question` (caso de borda "padrão muito similar a existente → pergunte ao usuário" e resolução de destino do repo de docs — IMP-061), mas a ferramenta não constava da seção Tools.
- **Causa raiz:** declaração de Tools incompleta.
- **Correção:** `question` adicionada à lista de Tools com os dois gatilhos de uso.
- **Arquivos:** `skills/gm-pattern-extractor/SKILL.md` — apenas este.
- **Status:** aplicada

## IMP-067 — gm-dev: "### Skills Transversais" dentro do bloco BEGIN_REGISTRY (pendência IMP-056)

- **Data:** 27/09/2026
- **Alvo:** `agents/gm-dev.md` (bloco registry)
- **Problema:** o heading "### Skills Transversais" e suas entradas estavam DENTRO dos marcadores `<!-- BEGIN_REGISTRY -->` / `<!-- END_REGISTRY -->` — a view do registry (tabela de subagents) não deve conter seções narrativas; pendência do IMP-056 e achado do AGENT_QUALITY_2026-09-27.
- **Causa raiz:** conteúdo narrativo inserido dentro da seção renderizada a partir do registry.yaml.
- **Correção:** seção movida para fora do bloco (após `<!-- END_REGISTRY -->`, antes de "Invocação detalhada"), com heading e entradas idênticos — estrutura agora análoga aos siblings (gm-req "### Invocação de Skills Transversais Diretas", gm-doc "### Componentes Transversais", ambos fora do bloco). Skill `gm-registry-render` carregada para execução canônica; como a tabela já está em sync com registry.yaml e o render é agêntico, aplicada a normalização mecânica prevista como fallback, sem regenerar views.
- **Arquivos:** `agents/gm-dev.md` — apenas este.
- **Status:** aplicada

## IMP-068 — ROADMAP R-021: referência residual a gm-azure-tasks-ingestor

- **Data:** 27/09/2026
- **Alvo:** `ROADMAP.md` (item R-021); `TROUBLESHOOTING.md` (verificado, já resolvido)
- **Problema:** R-021 listava como dependência "nova skill `gm-azure-tasks-ingestor`" — skill inexistente, rota removida no commit 7d10f51 (limpeza documentada no IMP-056/IMP-058, que deixou os 2 arquivos fora do escopo daquela sessão).
- **Causa raiz:** referência residual a skill nunca criada.
- **Correção:** dependência de R-021 atualizada para a rota atual (verificada no registry.yaml: geração de tasks via `gm-task-spec`; operações de tracking via `@gm-github-orchestrator` — issues/PRs). TROUBLESHOOTING.md L156 NÃO exigiu edição: a seção "Tasks duplicadas criadas" já foi reescrita (gate de duplicidade IMP-023 + MCP Azure DevOps), sem referência ao ingestor — zero ocorrências de `gm-azure` no arquivo.
- **Arquivos:** `ROADMAP.md` — apenas este.
- **Status:** aplicada

## IMP-069 — Rota morta @gm-azure-orchestrator/gm-azure-pbi-creator → @gm-github-orchestrator (mini-lote pós IMP-062..068)

- **Data:** 27/09/2026
- **Alvo:** `agents/gm-dev.md` (Comportamento); `skills/gm-task-spec/SKILL.md` (abertura, Nunca edita, diagrama de Fluxo)
- **Problema:** referências a componentes inexistentes — gm-dev.md dizia "PRs seguem `@gm-azure-orchestrator` com work item vinculado" e gm-task-spec.md instruía usar `@gm-azure-orchestrator` (skill `gm-azure-pbi-creator`) para criar work items no Azure DevOps (3 zonas: L17-18, L93, L111). O `@gm-azure-orchestrator` foi substituído pelo `@gm-github-orchestrator` (cf. agents/gm-github-orchestrator.md L32) e nunca teve skill de PBI registrada no registry.yaml. Pendência herdada do AGENT_QUALITY_2026-09-27 (item 4) e sinalizada no relatório do lote IMP-062..068.
- **Causa raiz:** referência residual a rota removida — migração azure → github não propagou para estes 2 arquivos.
- **Correção:** (1) gm-dev.md: "PRs seguem `@gm-github-orchestrator` com issue vinculada" (work item → issue, vocabulário GitHub coerente com `gm-gh-pr-creator`); (2) gm-task-spec.md: rota de criação apontada para `@gm-github-orchestrator` (skill `gm-gh-issue-creator`) com adaptação de vocabulário ("work items no Azure DevOps" → "issues no GitHub") nas 3 zonas + descrição (front matter) e H1 — que carregavam a mesma narrativa stale "antes de criar no Azure DevOps" — atualizados por coerência do texto. Preservados intocados: menções legítimas a Azure Pipelines como conteúdo de task (L230/239), gatilho "especificar PBI e tasks" (L9) e nome legado de artefato TASKS_AZURE_CONSOLIDADO.md. Rota confirmada no registry.yaml e ARCHITECTURE.md L291 antes da edição; assertion de zero resíduos nos 2 arquivos.
- **Arquivos:** `agents/gm-dev.md`; `skills/gm-task-spec/SKILL.md` — apenas estes 2.
- **Status:** aplicada

---
## IMP-070 — Rota PR do gm-dev legitimada no registry (github-orchestrator disponível ao gm-dev) + render de views

- **Data:** 28/09/2026
- **Alvo:** `registry.yaml`, views renderizadas (`ARCHITECTURE.md`, `agents/gm-dev.md`)
- **Problema:** gm-dev.md (Comportamento) dizia "PRs seguem `@gm-github-orchestrator`", mas o `available_to` do github-orchestrator no registry.yaml era só `gm-req` — rota morta (mesma família do IMP-069) para o único primary que cria PRs. Drift associado: views com aresta `D_DEV → JEV` ausente, contagem de subagents (16 vs 17 nós) e linhas de delegação incompletas em §2.
- **Causa raiz:** convenção conflitante (agent × registry) + views desatualizadas — a rota foi escrita no agent sem registrar a delegação no manifesto canônico.
- **Correção (Opção A aprovada pelo operador):** (1) `registry.yaml`: `available_to` do `gm-github-orchestrator` += `gm-dev`; (2) render das views: §1 arestas `D_DEV --> GITHUB` + `JEV` a partir dos 3 primaries (convenção: arestas/coluna "Delega para" = delegates ∪ available_to, como já na linha do gm-req) e contagem L4 16→17; §2 linhas `DOC_P`/`DEV_P` completadas com os delegates reais do registry; §3 linhas gm-doc/gm-dev += `@gm-jev-classifier` e gm-dev += `@gm-github-orchestrator`; §4 linha github-orchestrator "Disponível para" += `gm-dev`; View G do gm-dev.md += linha `@gm-github-orchestrator`. ARCHITECTURE.md editado via render — nunca à mão fora dos marcadores.
- **Arquivos:** `registry.yaml`; `ARCHITECTURE.md` (§1/§2/§3/§4); `agents/gm-dev.md` (View G).
- **Evals:** ✅ `run-evals.ps1 -Registry` — 5/5 PASS.
- **Status:** aplicada

---
## IMP-071 — gm-gh-pr-creator atualizado para o pós-IMP-040 (pasta da feature) e base dinâmica

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-gh-pr-creator/SKILL.md`
- **Problema:** a skill ainda era pré-IMP-040 — Lê citava `TASKS.md` sem resolução de pasta/sprint, o body do PR não consumia os 2 arquivos da pasta da feature e o `--base main` fixo conflitava com a determinação de branch target (main vs dev por data de commit) que os executors fazem no Passo 8.
- **Causa raiz:** referência órfã/desatualizada — a migração IMP-032→040 não propagou para esta skill (as primas `gh-issue-creator` e `task-spec` já foram migradas).
- **Correção:** (1) Lê: resolução da pasta da feature por glob de prefixo `RN-NNN*` (sprint corrente → anteriores → fallbacks legados, mesma ordem da gh-issue-creator); (2) body do PR passa a consumir `Analise-Funcional.md` (seção "O que esta entrega faz") e `Analise-Tecnica.md` (campo RNs da issue principal); (3) Passo 3 renomeado para "Determinar branch target e confirmar" — mesma regra dos executors (`git log -1 --format=%ci main|dev`, mais recente vence; sem `dev`, `main`) com proibição explícita de fixar `main`; (4) `gh pr create --base "<target determinada no Passo 3>"`.
- **Arquivos:** `skills/gm-gh-pr-creator/SKILL.md`.
- **Evals:** N/A (sem fixture — IMP-030).
- **Status:** aplicada

---
## IMP-072 — prj-test-generator qualificada como project-local (stack-angular + dev-frontend)

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-stack-angular/SKILL.md` (4 zonas); `agents/gm-dev-frontend.md` (tabela de skills)
- **Problema:** `prj-test-generator` era tratada como carregável incondicional no Lê, Tools, seção Testes e Algoritmo 2 do playbook — mas a skill não existe na config global (é project-local, presente só em projetos que a fornecem). O dev-frontend já qualificava "quando existir" no Passo 6, porém não na tabela de skills.
- **Causa raiz:** referência a componente não garantido (família IMP-067/069) — skill de projeto citada como se fosse da config.
- **Correção:** qualificação "(quando existir no projeto; ausente → convenções de spec do próprio repo / specs existentes + AGENTS.md)" nas 4 zonas do playbook e na tabela do dev-frontend.
- **Arquivos:** `skills/gm-stack-angular/SKILL.md`; `agents/gm-dev-frontend.md`.
- **Evals:** ✅ re-run `gm-stack-angular/fixture-001` (lote -Changed: 36/36 PASS — nenhum check dependia da menção).
- **Status:** aplicada

---
## IMP-073 — Paridade IMP-042/051 nos executors de dev: allow-list bash read-only + teto de ciclos no verify

- **Data:** 28/09/2026
- **Alvo:** `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md`, `agents/gm-dev.md` (1 bullet)
- **Problema:** os 2 executors ficaram de fora do P0 de performance (IMP-042) — `bash: ask` simples gera pedágio humano por comando (evidência 7d: bash 21,5 s médio por espera de permissão; a sessão runaway `ses_f35f`, 316k tok_in, era do gm-dev). O Passo 7 dos dois tinha loop "corrija e repita até verde" sem teto (o frontend só tinha teto no loop visual, IMP-051).
- **Causa raiz:** instrução ausente (guardas) + inconsistência entre componentes da mesma geração.
- **Correção:** (1) front matter dos 2 executors: `bash: ask` → objeto `"*": ask` + 19 allows read-only do IMP-042 (tree-sitter avalia cada lado de comando composto; `Where-Object`/`ForEach-Object`/`git branch*` seguem fora por segurança); (2) bullet de Tools atualizado (read-only sem pedágio; build/verify continua em ask); (3) Passo 7 dos 2: teto de 3 ciclos correção→verify, excedido → `not-verified (loop-cap)` com diagnóstico do último erro; (4) gm-dev.md: bullet de economia de contexto em sessões longas (~200k+ tokens → fechar ciclo e retomar em sessão nova, R2).
- **Arquivos:** `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`; `agents/gm-dev.md`.
- **Evals:** N/A (agents não têm fixtures).
- **Status:** aplicada

---
## IMP-074 — gm-quality-gates: WARN no formato §H, G2 exequível por executor e seção Angular

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-quality-gates/SKILL.md`; `agents/gm-dev-frontend.md` (integração)
- **Problema:** (1) template §H só tinha `quality-gate:<PASS|FAIL>`, contradizendo a própria tabela de interpretação (que define WARN) e o formato do dev-backend; (2) G2 oferecia caminho "via task ao @gm-jev-classifier" inexequível dentro de subagent (sem tool `task`); (3) escopo declarava "qualquer stack backend" — sem gate frontend.
- **Causa raiz:** template incompleto + inconsistência interna + escopo aquém do uso real.
- **Correção (decisões do operador: WARN alinhado + ganha seção Angular):** (1) §H template e exemplo com `<PASS|WARN|FAIL>` + nota do formato frontend; (2) G2 qualificado — caminho via `task` só para quem tem a tool (primary inline); subagents usam o curl; (3) description e seção F ganham escopo frontend Angular (`ng lint`, `ng test` headless, `ng build` para tsc strict + budgets; budgets excedido = warning, erro tsc = error, componente sem spec = warning); (4) dev-frontend: `gm-quality-gates` na tabela de skills, novo Passo 7.1 e linha `métricas:` com `quality-gate:<PASS|WARN|FAIL>` no formato de saída.
- **Arquivos:** `skills/gm-quality-gates/SKILL.md`; `agents/gm-dev-frontend.md`.
- **Evals:** N/A (sem fixture — IMP-030).
- **Status:** aplicada

---
## IMP-075 — gm-stack-java-quarkus: passo 5.1 (ALL_TAB_COLUMNS) condicional a client SQL disponível

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-stack-java-quarkus/SKILL.md` (Algoritmo 5.1)
- **Problema:** o passo mandava validar coluna via `ALL_TAB_COLUMNS` sem definir com que ferramenta executar a query — o playbook só tem read/glob/grep/bash-mvn, nenhum client SQL.
- **Causa raiz:** instrução ambígua — ferramenta pressuposta mas não disponível ao executor.
- **Correção:** passo condicional — com client/MCP de banco disponível → query Oracle; sem client → validar pelos artefatos do repo (migrations Flyway + seed H2 `import.sql`) e registrar `schema: not-verified (sem client SQL)` no relatório, sem bloquear a task.
- **Arquivos:** `skills/gm-stack-java-quarkus/SKILL.md`.
- **Evals:** ✅ re-run `gm-stack-java-quarkus/fixture-001` (lote -Changed: 36/36 PASS).
- **Status:** aplicada

---
## IMP-076 — gm-gh-issue-creator: pré-condição no vocabulário pós-IMP-040

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-gh-issue-creator/SKILL.md` (Pré-condições)
- **Problema:** pré-condição ainda dizia "TASKS.md existente e revisado" — terminologia pré-IMP-040, quando a fonte passou a ser a pasta da feature com 2 arquivos.
- **Causa raiz:** instrução ambígua (cosmética) — o corpo da skill já estava migrado (IMP-040), só a pré-condição ficou para trás.
- **Correção:** 1 linha — "Pasta da feature com os 2 arquivos revisados (`RN-NNN — Analise-Funcional.md` + `RN-NNN — Analise-Tecnica.md` — IMP-040; fallbacks legados da seção abaixo)".
- **Arquivos:** `skills/gm-gh-issue-creator/SKILL.md`.
- **Evals:** ✅ re-run `gm-gh-issue-creator/fixture-001` (lote -Changed: 36/36 PASS — mudança não afeta checks).
- **Status:** aplicada

---
## IMP-077 — Fonte única de comandos de automação: quality-gates aponta para os stack playbooks

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-quality-gates/SKILL.md` (§F, Algoritmo, description); `agents/gm-dev-backend.md` + `gm-dev-frontend.md` (Passo 7.1)
- **Problema:** comandos de automação quality existiam em 5 lugares — §F da quality-gates duplicava a seção Quality Checks/Comandos de cada stack playbook. O Passo 7.1 re-injetava ~40% do que o playbook já tinha trazido, e o drift já havia ocorrido (IMP-074 adicionou `ng` à quality-gates enquanto o playbook angular tem tabela própria).
- **Causa raiz:** DRY violado entre skills transversal e playbooks — duas fontes para o mesmo conhecimento.
- **Correção:** §F da quality-gates virou ponteiro ("fonte única: playbook da stack carregado; sem playbook → só checklist manual"), preservando a interpretação de resultados Angular (budget=warning, tsc=error, sem spec=warning); description e Algoritmo 2 alinhados; Passo 7.1 dos 2 executors apontam para a seção do playbook em vez de listar comandos. `gm-quality-gates` cai de 458 para ~420 linhas e deixa de crescer a cada stack nova.
- **Arquivos:** `skills/gm-quality-gates/SKILL.md`; `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`.
- **Evals:** N/A (sem fixture — IMP-030).
- **Status:** aplicada

---
## IMP-078 — gm-stack-dotnet-csharp enxugado para o padrão dos irmãos (585 → ~240 linhas)

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-stack-dotnet-csharp/SKILL.md`
- **Problema:** o playbook .NET era 3× maior que angular/quarkus/rust (585 linhas/24KB vs ~200/9,6KB) — sessão .NET carregava ~51KB de instruções antes do 1º read de código.
- **Causa raiz:** exemplos C# verbosos (handlers, validators, behaviors completos), árvore de estrutura com comentário por arquivo e tabela de comandos inflada — conhecimento de tutorial, não de playbook.
- **Correção:** reescrita mantendo a estrutura canônica dos irmãos; exemplos de código condensados em padrões + micro-snippets; árvore de estrutura resumida; tabela de comandos fundida (17 → 6 linhas + EF). **Preservado integralmente:** bloco "Convenção de migrações (crítica)" (fixture `gm-stack-dotnet-csharp/fixture-001` valida via checks agênticos: `[DbContext]`/`[Migration]`, `has-pending-model-changes`, proibição de suprimir `PendingModelChangesWarning`, migrações órfãs), os 13 pitfalls, tabela de automação (agora fonte única — IMP-077) e limites.
- **Arquivos:** `skills/gm-stack-dotnet-csharp/SKILL.md`.
- **Evals:** ✅ re-run `gm-stack-dotnet-csharp/fixture-001` (9 checks agênticos — lote -Changed: 50/50 PASS; convenção de migrações intacta).
- **Status:** aplicada

---
## IMP-079 — PR com rota canônica única: executors terminam no push

- **Data:** 28/09/2026
- **Alvo:** `agents/gm-dev-backend.md` + `gm-dev-frontend.md` (Passo 8, item 5)
- **Problema:** dois caminhos canônicos para criar PR — executor criava via gh CLI com parâmetros manuais (incluindo remanescente Azure `work-item:`) e existia a rota `gm-dev → @gm-github-orchestrator → gm-gh-pr-creator` (template padronizado, base dinâmica pós-IMP-071, issue vinculada; legitimada ao gm-dev no IMP-070).
- **Causa raiz:** convenção duplicada — responsabilidade de PR em dois componentes com regras que podem divergir.
- **Correção:** Passo 8 dos 2 executors termina no push; item 5 virou "PR — rota canônica": o PR é do `gm-gh-pr-creator` (body a partir da pasta da feature, base pela mesma regra do passo 1); rota indisponível → pendência com branch pronta. Remanescente `work-item:` eliminado.
- **Arquivos:** `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`.
- **Evals:** N/A (agents não têm fixtures).
- **Status:** aplicada

---
## IMP-080 — Health monitor ganha check determinístico de referências órfãs e drift de views

- **Data:** 28/09/2026
- **Alvo:** `skills/gm-agent-health-monitor/SKILL.md` (Passo 2, Passo 7 item 8, description)
- **Problema:** 3 das últimas 6 IMPs (067, 069, 072) eram o mesmo defeito — skill citada mas inexistente/project-local sem qualificação — achadas só por auditoria manual. O check existente ("Skills invocadas existem") era vago: não definia onde procurar citações nem o escape project-local.
- **Causa raiz:** falta de validação — verificação não determinística não pega a família de defeitos recorrente.
- **Correção:** item 8 do Passo 7 virou procedimento determinístico (IMP-080): extrair citações `Golmet-*`/`mcp-*` de tabela de skills/Lê/Tools/Algoritmo/Skills Transversais de subagents E primaries; inexistente + sem qualificação project-local = ❌ órfã; inexistente + qualificada = ⚠️ dependência externa; existente fora do registry (ou vice-versa) = ❌ drift. Passo 2 ganhou item 6 (arestas primário→subagent do ARCHITECTURE.md coerentes com registry — drift JEV do IMP-070 como exemplo). Description atualizada.
- **Arquivos:** `skills/gm-agent-health-monitor/SKILL.md`.
- **Evals:** ✅ re-run `gm-agent-health-monitor/fixture-001` (5 checks — termos obrigatórios do relatório preservados; lote -Changed: 50/50 PASS).
- **Status:** aplicada

---
## IMP-081 — gm-dev não duplica leitura de contratos que o executor vai reler

- **Data:** 28/09/2026
- **Alvo:** `agents/gm-dev.md` (Início de sessão, passo 3)
- **Problema:** o primary lia API_CONTRACTS/UI_SPEC/ACCEPTANCE_CRITERIA integralmente no início da sessão, e o executor relia tudo no Passo 2 — contexto do primary crescia à toa (a sessão runaway `ses_f35f`, 316k tok_in, era do gm-dev).
- **Causa raiz:** ordem errada de responsabilidade de leitura — R1 diz "colar só o essencial", mas o passo mandava o primary absorver specs inteiras.
- **Correção:** passo 3 — primary lê apenas as RNs referenciadas pela task em `REQUIREMENTS.md`; contratos ficam para o executor; trecho específico sob demanda.
- **Arquivos:** `agents/gm-dev.md`.
- **Evals:** N/A (agents não têm fixtures).
- **Status:** aplicada
---
## IMP-082 — gm-dev: escopo de leitura de specs, pattern check no Passo 4 e métricas best-effort (performance)

- **Data:** 29/09/2026
- **Alvo:** `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md` (queixa de performance do ciclo do `gm-dev`)
- **Problema:** ciclo de dev demora muito e gasta tokens demais: (1) Passo 2 mandava ler API_CONTRACTS/UI_SPEC/ACCEPTANCE_CRITERIA inteiros (docs module-wide) — o IMP-081 escopou o primary, mas o executor relia tudo; (2) Passo 7.1 do backend exigia complexidade/duplicação/smell-count sem comando definido em nenhum playbook → o modelo improvisava descoberta de ferramentas a cada task (latência dominante; a seção G da skill ainda referencia mutation testing); (3) pattern library (`_docs/patterns/INDEX.md`, IMP-047/061) citada só como Princípio, fora do Algoritmo — nunca consultada antes de desenvolver.
- **Causa raiz:** instrução ambígua (leitura de specs sem escopo de seção), falta de validação (métricas sem fonte de comando definida) e instrução ausente (pattern check fora do fluxo de passos).
- **Correção:** Passo 2 dos dois executors escopado às seções da task (grep do endpoint/tela + RNs citadas — espelha o IMP-081 do primary); Passo 4 ganhou sub-passo de consulta à pattern library (INDEX.md ~50 linhas → PATTERN.md específico só se aplicável; sem match → segue); Passo 7.1 — métricas best-effort apenas com comandos já definidos no playbook (fonte única — IMP-077), `N/A` quando ausente, improvisação de ferramentas proibida, mutation testing nunca por padrão; micro-fixes: dedupe da description do backend e "Passo 2.5" → "Passo 3" (referência inexistente). Checks `error`, automação do playbook e semântica `quality-gate:<PASS|WARN|FAIL>` intactos.
- **Arquivos:** `agents/gm-dev-backend.md` (description, Passos 2/4/7.1), `agents/gm-dev-frontend.md` (Passos 2/4/7.1).
- **Evals:** N/A (agents não têm fixtures) — validação recomendada: 1 task real pós-restart + `gm-agent-health-monitor`.
- **Status:** aplicada
---
## IMP-083 — gm-dev: paralelismo com worktrees Git (Opção A — gerenciado pelo primary)

- **Data:** 29/09/2026
- **Alvo:** `agents/gm-dev.md`, `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md`
- **Problema:** o primary pode delegar N tasks em paralelo (R3/IMP-043), mas os executors trabalham no mesmo clone — working tree compartilhado ("working tree suja de outra feature", item 4 do gm-dev) e `git checkout -b` do Passo 8 mutando estado compartilhado invalidam verify em andamento e forçam execução sequencial de fato.
- **Causa raiz:** instrução ausente — nenhum mecanismo de isolamento de código por task; o fluxo assumia paralelismo sem base de isolamento.
- **Correção (design fechado pelo operador — Opção A):** primary ganha seção "Paralelismo com worktrees": plano de ondas antes de delegar (agrupar tasks sem conflito de repo/BD/porta de dev server) + gate único de paralelização agrupado com as demais decisões do lote (IMP-043; opções (a) conforme plano (b) só a onda N (c) tudo sequencial; default sequencial, inferência por omissão proibida; lote com 1 task ou sem onda paralela não pergunta); criação de 1 worktree por task (`<repo>.wt-<RN-NNN-M>` irmão do repo dentro de `<raiz-de-projetos>/`, `git worktree list` antes, nunca recriar sobre path existente, cópia de untracked locais (.env etc.), `core.longpaths true` para Angular, teto 2 concorrentes/repo cap 3); delegação R1 com `worktree:`/`wave:`/`porta:`; cleanup só com PR MERGED (`gh pr view --json state`), worktree REUSADO na retomada de PR com review pendente, remoção antecipada só com aprovação explícita. Executors: Passo 1 reconhece `worktree:` (trabalho dentro do path, branch já ativa, sem checkout); novo Passo 7.2 — code review do diff pré-PR (`git diff origin/<target>...HEAD`: KISS/YAGNI/DRY/SOLID, código morto, naming, erros engolidos, leftovers de debug, gaps de teste) com re-run dos testes afetados; Passo 8 pula passos 1-2 e commita/pusha da branch do worktree — rota de PR IMP-079 preservada; frontend Passo 7.5 sobe dev server na porta dedicada; relatório ganha linha `review:` (achados/correções + URL do PR quando existente). IMP-082 intacto (Passos 2/4/7.1 não tocados); gates, testes e PR flow sem mudança de corretude.
- **Arquivos:** `agents/gm-dev.md` (item 4 do Início de sessão, nova seção, invocação de executors), `agents/gm-dev-backend.md` (Passos 1/7.2/8, relatório), `agents/gm-dev-frontend.md` (Passos 1/7.2/7.5/8, relatório).
- **Evals:** N/A (agents não têm fixtures) — validação recomendada: onda paralela real pós-restart (2 tasks no mesmo repo sem migração sobreposta) + `gm-agent-health-monitor`.
- **Status:** aplicada
---
## IMP-084 — Comandos builder-aware no gm-stack-angular + regra anti-hang no verify do gm-dev-frontend

- **Data:** 29/09/2026
- **Alvo:** `skills/gm-stack-angular/SKILL.md`; `agents/gm-dev-frontend.md` (Passo 7)
- **Problema:** `ng test` com flags do Karma em projeto com builder Vitest (`@angular/build:unit-test`) falha ou fica preso em watch — o Vitest builder roda single-run e exita por padrão; `--watch=false`/`--browsers=ChromeHeadless` não se aplicam — processo nunca termina e a sessão trava; dev server que não sobe esperava indefinidamente (sem teto nem degradação explícita); Passo 7 do executor sem regra para verify que não termina (watch aberto, build sem exit) nem para falha ambiental (verify repetido).
- **Causa raiz:** instrução ausente — playbook prescrevia `ng test --watch=false --browsers=ChromeHeadless` incondicional (sem checar o builder em `angular.json`) e espera de dev server sem timeout; executor sem regra anti-hang no Passo 7.
- **Correção:** (1) `gm-stack-angular`: tabela builder-aware (checar `architect.test.builder` em `angular.json`: Karma → `ng test --watch=false --browsers=ChromeHeadless`; Vitest `@angular/build:unit-test` → `ng test`, single-run e exita por padrão, flags do Karma não se aplicam), espera do dev server com teto ~60s (não subiu → `Stop-Process` + `visual: not-verified (dev-server timeout)`), pitfall 6 novo (`ng test` preso em watch) e Algoritmo 5 alinhado; (2) `gm-dev-frontend` Passo 7: regra anti-hang — ordem do ciclo implementar → commitar → verificar 1× → relatar (commit antes do verify ambiental quando faz parte da task), verify ambiental 1× (processo que não termina → abortar + `not-verified (hang)`), nunca deixar watch aberto, falha ambiental → `not-verified (motivo)` sem repetir; teto de 3 ciclos para falha real de teste (IMP-073) preservado.
- **Arquivos:** `skills/gm-stack-angular/SKILL.md` (4 edições); `agents/gm-dev-frontend.md` (1 edição, Passo 7); `WORKFLOW_IMPROVEMENTS.md` (este).
- **Evals:** ✅ re-run `gm-stack-angular/fixture-001` pós-edição — **10/10 PASS** (exit 0; relatório EVAL_REPORT_runner_skill-gm-stack-angular_2026-09-29-183536.md). Nenhum check dependia da tabela de comandos alterada.
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados. Front matter dos 2 arquivos intacto (UTF-8 sem BOM preservado).
- **Status:** aplicada

---
## IMP-085 — Regra anti-idle nos primary agents (loop de tool calls vazias no ponto de `question`)

- **Data:** 29/09/2026
- **Alvo:** `agents/gm-dev.md`, `agents/gm-req.md`, `agents/gm-doc.md`; `AGENTS.md` (bloco IMP-043)
- **Problema:** no fechamento da sprint <cliente> (29/09/2026), com todo o trabalho concluído e restando apenas 2 decisões do operador (commit dos docs do módulo + re-propagação downstream de 5 skills), o primary entrou em loop degenerado: 50+ chamadas bash triviais (`Write-Output "ok"`) consecutivas em vez de emitir a `question` agrupada e parar; voltou a loopar mesmo após responder ao operador.
- **Causa raiz:** instrução ausente (H1) + contrafundo ausente (H2) — nenhum primary agent tem regra de encerramento de turno ("só resta decisão do operador → `question` e PARAR"), e a regra IMP-043 do AGENTS.md só prescreve agrupar decisões numa única `question`, sem proibir tool calls de preenchimento enquanto se aguarda a resposta. H3 (instrução que induz "sempre executar comando antes de perguntar") refutada — o estado-antes-de-agir está confinado ao Início de sessão, não é regra generalizada.
- **Correção:** (1) AGENTS.md: bullet novo na seção IMP-043 — após `question` o turno ENCERRA; tool calls de preenchimento/idle proibidas; responder no chat e parar é ação válida e completa; (2) nova seção "Encerramento de turno (anti-idle, IMP-085)" nos 3 primary agents com o mesmo contrato (redundância defensiva na camada mais específica da hierarquia).
- **Arquivos:** `AGENTS.md`; `agents/gm-dev.md`; `agents/gm-req.md`; `agents/gm-doc.md`; `WORKFLOW_IMPROVEMENTS.md` (este).
- **Evals:** N/A (correção em primary agents — `gm-skill-eval` cobre apenas skills; sem fixtures para agents). Validação recomendada: sessão real pós-restart que termine em decisão pendente do operador — verificar 1 `question` agrupada e fim de turno sem tool calls de preenchimento; complementar com `gm-agent-health-monitor` (padrão IMP-084).
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados; front matter dos 4 arquivos intacto (UTF-8 sem BOM).
- **Status:** aplicada


### Recorrência pós-aplicação (29/09)

- **Fato:** o primary voltou a loopar (dezenas de bash triviais `Write-Output "ok"`) DEPOIS da aplicação deste IMP, inclusive logo após reconhecer a regra em texto.
- **Causa estrutural:** config do OpenCode não é hot-reloaded — a sessão viva continua sob as instruções carregadas no início (contexto da sessão); a edição em disco não afeta o turno corrente. IMP-085 vale a partir da próxima sessão (pós-restart).
- **Implicação:** IMP-085 é necessário mas não suficiente para a sessão corrente; nenhuma mudança em prompts/config cura a sessão já iniciada. Mitigação imediata = restart do OpenCode.
- **Salvaguarda mecânica recomendada (só recomendação — não implementada; decisão do operador):** plugin do OpenCode que monitore o stream de tool calls e, ao detectar N (ex.: 5) chamadas bash triviais consecutivas (mesmo comando/assinatura repetida + output descartável, ex.: echo/print sem efeito em disco), injete um aviso de sistema no turno ou interrompa o loop exigindo decisão do operador.
  - **Viabilidade:** alta — hooks de plugin (`tool.execute.before`/`after`) permitem contador em memória por sessão e injeção de system message sem tocar nos prompts. Preferir **plugin** a hook de shell (frágil, acoplado ao ambiente).
  - **Riscos:** falsos positivos em comandos legítimos repetidos (ex.: poll de `git status`) — mitigar exigindo no critério output descartável + nenhum efeito em disco; latência desprezível; manutenção segue o ciclo `gm-self-publish`.
  - **Onde implementaria:** `~/.config/opencode/plugin/anti-idle-detector.ts`, registrado no opencode.jsonc; detecção heurística local e determinística (padrão R4 — sem modelo).

### Implementação da salvaguarda mecânica (29/09, aprovada pelo operador)

- **Arquivo:** `plugins/anti-idle-detector.ts` (convenção local: pasta `plugins/` plural + registro explícito no `opencode.jsonc` — não `plugin/` singular como sugerido na recomendação original).
- **Registro:** `"plugin": ["./plugins/falcode.js", "./plugins/anti-idle-detector.ts"]` em `opencode.jsonc`.
- **Comportamento:** hook `tool.execute.before` com contador em memória por `sessionID`; qualquer tool não-bash ou bash não-trivial reinicia o contador. Considera trivial apenas `echo`/`printf`/`Write-Output`/`Write-Host` com literal curto (≤80 chars), sem `$var`/`$()`/pipe/redireção/`;`/`&` (falso-positivo ~zero em polls legítimos, que usam variáveis/redireção). Ao atingir 5 chamadas idênticas consecutivas: a execução falha com erro orientando o agente a encerrar o turno com UMA pergunta agrupada; contador reinicia.
- **Limitações conhecidas:** interrupção é soft (a chamada falha e o modelo vê o erro — não trava a sessão); assinaturas triviais variadas (comandos echo diferentes em sequência) não contam como streak, por decisão de reduzir falsos positivos; `import type` do `@opencode-ai/plugin` é apagado em runtime (sem dependência).
- **Status:** implementada — requer restart do OpenCode para carregar.

---
## IMP-086 — Tool `question` indisponível no `gm-req`: front matter com delimitador quebrado (` --`) derrubava a config do agente

- **Data:** 29/09/2026 — **rev. 2 (30/09/2026):** causa da rev. 1 rejeitada pelo operador e refutada por evidência de runtime; correção real aplicada.
- **Alvo:** `agents/gm-req.md` (linha 24 — delimitador de front matter); diagnóstico de runtime.
- **Problema:** executando `gm-clarify` no primary `gm-req` (workspace <docs-repo>/<cliente>), o runtime não registrava o tool `question` — front matter declarava `question: allow` (linha 18), mas o conjunto efetivo do agente não o tinha. Workaround aplicado: perguntas agrupadas como texto no chat (não bloqueia, degrada UX).
- **Causa raiz (confirmada pela config resolvida do runtime — `opencode debug agent gm-req`):** delimitador de FECHAMENTO de front matter quebrado — a linha 24 do `gm-req.md` era ` --` (espaço + 2 hífens) em vez de `---`, introduzido no commit `4a058aa` (27/09/2026 17:25, "prompt-gate + auditoria Jev + IMP-056..059 + migração ADR/MADR"; blame: linhas adjacentes do commit `edb2f447` de 17/09). Sem fechamento válido, o OpenCode não parseia o front matter: o agente resolvia com o YAML cru dentro de `"prompt"`, `mode: all` (default), `temperature` ausente e permissões default do runtime — incluindo `question: deny` (preset para primary custom sem declaração) — e o mapa de tools resolvia `question: false`. A tool SEMPRE existiu no runtime 1.18.33: a config resolvida referencia explicitamente a chave `question`, e os logs (`~/.local/share/opencode/log/opencode.log`) registram uso em 19-21/06/2026 (`message=asking id=que_... questions=1..4`) na linha 1.x — os runs de junho precedem o `gm-req` (criado 17/09, IMP-014), explicando por que o sintoma só apareceu pós-27/09.
- **Causa da rev. 1 — REJEITADA:** "tool inexistente na linha 1.x, presente só na v2". Refutada por: (a) enumeração pela config resolvida do runtime (não por string-scan em binário); (b) logs históricos de uso em junho/2026; (c) fragilidade do método da rev. 1 — a descrição da tool varia entre gerações e ausência de string em binário Bun não prova ausência de tool (o negativo dependia de premissa não testada).
- **Correção:** linha 24 do `agents/gm-req.md`: ` --` → `---` (1 linha; CRLF e UTF-8 sem BOM preservados). Pós-fix, `opencode debug agent gm-req` resolve `mode: primary`, `temperature: 0.3`, permissões com `question = allow` (última regra vence o default `deny`) e `tools.question: true`.
- **Arquivos:** `agents/gm-req.md` (1 linha); `WORKFLOW_IMPROVEMENTS.md` (esta).
- **Evals:** N/A (agents não têm fixtures). Varredura de replicação: nenhum outro agente (`agents/*.md`) com delimitador quebrado; templates de `gm-primary-agent-creator`/`gm-subagent-creator`/`gm-skill-creator` limpos.
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados.
- **Prevenção — IMPLEMENTADA (29/09/2026, aprovada pelo operador):** check de integridade estrutural de front matter no `skills/gm-agent-health-monitor/SKILL.md` (Passo 7/Verificação F, itens 10-13, transversal a `agents/*.md` e `skills/*/SKILL.md`): delimitadores íntegros (abre E fecha exatamente `---`; malformado (` --`, `—`, trailing space, ausente) = ❌ FINDING crítico), YAML parseável (sem tabs/indentação quebrada), `permission:` declarado (agents) e prova definitiva em runtime via `opencode debug agent <nome>` (prompt começando com YAML cru = front matter não parseado). Validado com fixture temporária corrompida (` --` → FINDING crítico detectado, com apontamento da linha malformada) e 3 controles íntegros = PASS (fixture agente, `gm-req.md` pós-fix, a própria SKILL.md monitorada); fixtures apagadas após o teste. `gm-skill-eval` N/A (agentes não têm fixtures).
- **Status:** aplicada — requer restart do OpenCode para valer em sessões novas.

---

## IMP-087 — Wire automático do health monitor: Health Gate pré-push no gm-self-publish + validação pós-edição no improver

- **Data:** 29/09/2026
- **Alvo:** `skills/gm-self-publish/SKILL.md`; `agents/gm-workflow-improver.md` (Passo 7 + Formato de saída)
- **Origem:** IMP-086 + decisão do operador de 29/09/2026 (aprovação em bloco das duas opções de wire)
- **Problema:** o defeito da IMP-086 só foi pego por diagnóstico ad hoc — nenhuma barreira automática impediria a publicação de um componente com front matter quebrado (o caso real estava a um `gm-self-publish` de ir para o remote), e o próprio improver podia encerrar uma edição deixando front matter quebrado (autocorrupção não detectada).
- **Correção:** (a) `gm-self-publish` — novo **Passo 3.5 "Health Gate"** entre a montagem do commit (Passo 3) e o push (Passo 4): roda o fluxo do `gm-agent-health-monitor` restrito aos arquivos alterados no commit (no mínimo Verificação F itens 10-13 — IMP-086); **fail-closed** — qualquer FINDING crítico ABORTA o push, reporta os findings e orienta correção via `@gm-workflow-improver`; push só prossegue com 0 findings críticos; resultado reportado na sessão (não persiste relatório — a skill não grava artefatos; seção Gera intocada). Workflow renumerado (Health Gate = item 7 de 9); Modo de erro ganhou a condição "finding crítico no Health Gate"; caso de borda "Health Gate bloqueia" novo. Gates existentes intocados (confirmação explícita 3×, `git pull --ff-only` antes do push, nunca force). (b) `gm-workflow-improver` — Passo 7 (Validar) ganhou **Health check pós-edição obrigatório**: após QUALQUER edição em `agents/*.md`/`skills/*/SKILL.md`, rodar o check F.10-13 do monitor sobre os arquivos editados e reportar na devolutiva; FINDING crítico pós-edição = a própria correção está quebrada → corrigir antes de encerrar; explicitado que o check é textual/estrutural (leitura em disco, NÃO depende de reload — vale inclusive quando o agent acabou de se editar) e que a edição vale para a próxima sessão. Formato de saída com linha `🧪 Health check (F.10-13)`.
- **Arquivos:** `skills/gm-self-publish/SKILL.md` (Passo 3.5, Workflow, Modo de erro, Casos de Borda); `agents/gm-workflow-improver.md` (Passo 7, Formato de saída); `WORKFLOW_IMPROVEMENTS.md` (esta).
- **Validação:** front matter dos 2 componentes editados íntegro (check F.10-12 = PASS; fechamento na linha 12 e na linha 58 resp.); fluxo do self-publish conferido na íntegra (gate entre Passo 3 e Passo 4, sem conflito com os 3 gates existentes); Evals — `gm-agent-health-monitor/fixture-001`: criteria.yaml = 5 checks `contains` sobre o relatório gerado; verificação estática confirmou os 5 padrões presentes no template pós-edição da IMP-086 (a edição não altera o output) → equivalente-PASS por construção; runner completo N/A nesta IMP (monitor não editado aqui). `gm-self-publish` e `gm-workflow-improver` não têm fixtures — N/A.
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados (o gate invoca o fluxo de skill já registrada; o improver já tinha `skill: allow`).
- **Status:** aplicada — gates valem pós-restart do OpenCode; publicação via `gm-self-publish` é decisão do operador.

---

## IMP-088 — Gate de branch no gm-dev: confirmação explícita da base antes de implementar

- **Data:** 06/10/2026
- **Alvo:** `@gm-dev`, `@gm-dev-backend`, `@gm-dev-frontend`, `gm-gh-pr-creator`
- **Origem:** pedido literal do operador — "o gm-dev, sempre antes de implementar uma task deve questionar se a branch que ele deve ramificar é a main/master e após isso deve dar git pull na branch em questão e ramificar para uma nova branch".
- **Problema:** a implementação iniciava sobre a branch que estivesse checkoutada (frequentemente main), sem `git pull` prévio; a branch feature só nascia no Passo 8 (commit/PR) e a branch target era INFERIDA comparando datas dos últimos commits (`git log -1 --format=%ci main` vs `dev`).
- **Causa raiz:** instrução errada (inferência automática por datas onde o operador quer confirmação) + ordem errada (branch criada após a implementação) + instrução ausente (sem gate `question`, sem pull na base).
- **Decisão registrada:** a confirmação explícita do operador prevalece sobre qualquer inferência automática — a pergunta pode pré-selecionar a sugestão (main/master) como default, mas nunca inferir por omissão.
- **Correção:** (1) `agents/gm-dev.md` — nova seção "Gate de branch (obrigatório antes de implementar — IMP-088)": ① `question` confirmando a base (sugestão pré-selecionada como default) ② `git checkout <base>` + `git pull --ff-only` (nunca force; divergência → perguntar, padrão IMP-020) ③ `git checkout -b feature/<task-slug>` ④ `branch-base:`/`branch-feature:` no prompt do executor (R1); gate aplicável também a micro-edição inline e ao fluxo de worktrees (IMP-083 — base confirmada alimenta o `worktree add -b`); bullet "Comportamento" sem a inferência por datas. (2) `agents/gm-dev-backend.md` / `gm-dev-frontend.md` — Passo 1 valida branch ativa = `branch-feature` informada (proibido implementar em main/master/dev; divergência → perguntar ao `gm-dev`); Passo 8 sem inferência por datas (base = confirmada no gate) e base do PR herda a `branch-base`. (3) `skills/gm-gh-pr-creator` — Passo 3 usa `branch-base` confirmada como fonte preferencial (regra legada por datas só como fallback se o campo estiver ausente).
- **Arquivos:** `agents/gm-dev.md`, `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md`, `skills/gm-gh-pr-creator/SKILL.md`, `WORKFLOW_IMPROVEMENTS.md` (este).
- **Status:** ✅ Aplicada — ⏳ reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente (não executada, por ordem do operador).

---

## IMP-089 — Design brief e figma-prompt sem stack de implementação

- **Data:** 06/10/2026
- **Alvo:** `gm-design-brief`, `gm-figma-prompt`
- **Origem:** pedido do operador — "vamos melhorar a skill de briefing, não precisamos especificar stack e tecnologias nela" + decisão do operador nesta sessão de estender a correção ao `gm-figma-prompt` (opção C do plano aprovado).
- **Problema:** o DESIGN_BRIEF.md (contexto de produto para o Figma Make) especificava stack de implementação (item "Componentes base: shadcn/ui, Angular Material" na seção "Stack visual") e o prompt do Figma derivava a instrução de estilo de stack ("React, shadcn/ui, Tailwind") — domínio de ARCHITECTURE.md/gm-stack-*, não de design.
- **Causa raiz:** instrução errada — front matter/Passo 3/template §4 da gm-design-brief e item 7 do modo completo da gm-figma-prompt mandavam derivar estilo de libs de implementação.
- **Correção:** (1) `gm-design-brief` — "stack de design" removida da description do front matter; Passo 3 "Identidade visual e stack visual" → "Identidade visual"; template §4 renomeada "Design system / padrões visuais" (mantém padrões de layout de UI_SPEC §2 e regras de UI globais §5; item "Componentes base" removido); Composição futura atualizada (a gm-figma-prompt agora consome DESIGN_BRIEF.md — saiu do "NÃO implementado"). (2) `gm-figma-prompt` — item 7 do modo completo: instrução de estilo derivada de UI_SPEC.md §5 e DESIGN_BRIEF.md (quando existirem), NUNCA de stack de implementação; DESIGN_BRIEF.md adicionado ao Lê (opcional, fallback: raiz). (3) Evals — fixture `gm-design-brief/fixture-001`: baseline §4 espelha o template novo (sem "Componentes base") e criteria.yaml ganha `not_contains: "Angular Material"` (severity error) como trava de regressão; fixture `gm-figma-prompt/fixture-001`: baseline já conforme (instrução de estilo descritiva, sem libs) — sem edição, apenas re-run.
- **Arquivos:** `skills/gm-design-brief/SKILL.md`, `skills/gm-figma-prompt/SKILL.md`, `evals/gm-design-brief/fixture-001/output-expected/specs/DESIGN_BRIEF.md`, `evals/gm-design-brief/fixture-001/criteria.yaml`, `WORKFLOW_IMPROVEMENTS.md` (este).
- **Validação:** health check F.10-13 — 2/2 SKILL.md íntegros (delimitadores L1→L17 e L1→L16, estrutura YAML ok, name+description presentes); evals re-runados — gm-design-brief: 12/12 PASS (exit 0), gm-figma-prompt: 7/7 PASS (exit 0).
- **Compatibilidade:** nenhuma mudança de delegação — registry.yaml e ARCHITECTURE.md intocados (descriptions não citavam stack; relações inalteradas; o consumo DESIGN_BRIEF→figma-prompt é opcional e intra-domínio figma).
- **Status:** ✅ Aplicada — ⏳ reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente (não executada, por ordem do operador).

## IMP-090 — gm-self-publish: 3 gates de confirmação viram decisão única híbrida (fluxo feliz 0 perguntas)

- **Data:** 06/10/2026
- **Alvo:** `gm-self-publish`
- **Origem:** pedido do operador — "ela pede muitas confirmações desnecessárias, o que torna meio burocrático e lento um processo que deveria ser simples: organizar as mudanças, commitar e dar push sob aprovação"; escolha da Opção C (híbrido) pelo operador entre 3 opções apresentadas no Gate Plan-first.
- **Problema:** publish típico exigia 3 aprovações `question` para 1 única decisão — Gate 1 (conteúdo, Passo 1), Gate 2 (mensagem, Passo 3), Gate 3 (push, Passo 4); agrupamento por tema e redação de mensagem (trabalho da skill) estavam no caminho da pergunta.
- **Causa raiz:** design de interação — as 3 confirmações eram consequências mecânicas de uma única decisão ("publicar"); pedágio ≠ pergunta (IMP-043). Nota do IMP-087 ("gates existentes intocados") era escopo daquela IMP, não convenção — sem conflito com AGENTS.md; IMP-020/053 (gate Plan-first de EDIÇÃO) fora do escopo.
- **Correção:** contrato híbrido — (1) Passo 1 sem Gate 1: classificação de escopo automática alimenta a decisão única (fora-de-escopo detectado = anomalia); (2) Passo 3 sem Gate 2: a skill agrupa temas, redige mensagens Conventional Commits e commita com paths explícitos sem question; (3) Passo 4 = decisão única: **fluxo feliz** (pedido explícito de publicação sem ressalva + tema único + nada fora do escopo + Golden Set/Health/sync verdes) → `pull --ff-only` + `push origin main` direto, 0 questions, pacote exibido no relatório final; **anomalia** (≥2 temas, fora-de-escopo, eval stale/regressão, health finding a decidir, divergência decidível, pedido ambíguo/parcial) → 1 `question` consolidada com o pacote completo (temas + arquivos + mensagens + push), opções aprovar/ajustar/cancelar — antes do commit quando detectada antes de commitar; entre commit e push vale o Modo de erro (abort + orientação); (4) "nunca commit cego" redefinido: aprovação do PACOTE, não 3× o mesmo commit; (5) Tools `question` com propósito novo; Workflow renumerado (9→8 itens); description do front matter atualizada; Modo de erro com a regra de anomalia; Casos de Borda com menções a Gate 1 atualizadas. Segurança preservada: nunca `git add -A`/`git add .` (paths explícitos), nunca force push, `pull --ff-only` antes do push, abort em divergência/rede/credencial/repo sem remote/finding crítico no Health Gate; Golden Set Gate e Health Gate continuam automáticos e bloqueantes.
- **Arquivos:** `skills/gm-self-publish/SKILL.md`; `CHECKLISTS.md` ("Durante a Publicação"); `WORKFLOW_IMPROVEMENTS.md` (este).
- **Referências cruzadas verificadas:** `registry.yaml` e `ARCHITECTURE.md` intocados (descriptions não citavam gates; nenhuma mudança de delegação); `agents/gm-workflow-builder.md` cita apenas o Golden Set Gate (intocado); histórico (DECISIONS.md, IMPs anteriores) não reescrito.
- **Evals:** `gm-self-publish` não tem fixture (por design não avaliável deterministicamente — METRICS/IMP-087) → warning documentado, sem runner de regressão.
- **Validação:** health check F.10-13 (IMP-086/087) no SKILL.md editado — PASS, 0 findings (front matter abre L1 / fecha L16, YAML ok, name+description presentes, 0 tabs; F.13 `permission:` n/a para skill); grep "Gate 1|Gate 2|Gate 3|3 gates" — único remanescente é o histórico imutável da IMP-087; CHECKLISTS.md estrutura íntegra (seção reescrita in place, UTF-8 preservado).
- **Status:** ✅ Aplicada — ⏳ reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente, por decisão do operador (será o 1º uso do fluxo novo).

---

## IMP-091 — Nova skill gm-tasks-pending: tasks pendentes/em andamento por sistema

- **Data:** 07/10/2026
- **Alvo:** `gm-tasks-pending` (nova skill + novo subagent), `registry.yaml`, `ARCHITECTURE.md`, `agents/gm-req.md`, `agents/gm-dev.md`
- **Origem:** pedido do operador — skill read-only que lista as tasks pendentes/em andamento do pipeline Golmet por sistema, com roteamento Ambiguidade Zero (IMP-031): sistema informado de antemão → lista direto; sistema não informado → UMA `question` antes de listar (cada sistema detectado no repo de docs + "Todos os sistemas"), nunca assumir escopo por omissão.
- **Motivação:** entre `gm-task-spec` (gera as análises) e `gm-gh-issue-creator` (cria as issues) não existia visão de "o que falta concluir"; `gm-next` responde "o que fazer agora" (skill da DAG) e `gm-progress` responde "onde estamos" (não task-level) — veredito de duplicidade: sem cobertura existente, skill nova aprovada.
- **Criação:** (1) `skills/gm-tasks-pending/SKILL.md` — front matter `name`/`description` com triggers ("tasks pendentes", "listar tasks", "o que falta fazer", "backlog de tasks"); Diferenciação com gm-next/gm-progress/gm-task-spec/gm-gh-issue-creator; fontes em prioridade: Analise-Tecnicas IMP-040 (front matter `status` + `## Resumo das tasks` + headings `### RN-NNN-M.`) → TASKS*.md / TASKS.md / RN-*.md legados → PEND-XXX de REQUIREMENTS.md §11 → issues gh (opcional, não-bloqueante, matching por token `RN-NNN-M`); modo de erro `warn`; Casos de Borda (feature done/implemented não lista; gh indisponível não bloqueia; IMP-037 — nunca construir nome de pasta; IMP-011 fallback). (2) `agents/gm-tasks-pending.md` — mode: subagent, read-only (edit/write/task: deny), bash com allowlist de leitura (gh issue list/view, gh repo view, gh auth status, git status/log; demais ask), `skill: allow` invocando a skill (cadeia primary → subagent → skill fechada). (3) `registry.yaml` — subagent `gm-tasks-pending` (owner gm-req; `available_to`: gm-req, gm-dev — decisão explícita do operador, NÃO gm-doc; `invokes`: gm-tasks-pending), skill `gm-tasks-pending` (domain: meta, grupo Navegação/Estado), `delegates` em gm-req e gm-dev.
- **Arquivos:** `skills/gm-tasks-pending/SKILL.md`; `agents/gm-tasks-pending.md`; `registry.yaml`; `ARCHITECTURE.md` (views §1-§4 regeneradas: 18 subagents, 60 skills, delega 11/8); `agents/gm-req.md`; `agents/gm-dev.md` (tabelas de subagents); `evals/gm-tasks-pending/fixture-001/` (input sintético <cliente>-demo: feature IMP-040 confirmed com RN-082-1 [done] + RN-082-2/3/4 pendentes, feature RN-074 done, TASKS.md legado, REQUIREMENTS §11 com PEND-007; `criteria.yaml` com 12 checks; `output-expected/TASKS_PENDING_REPORT.md` snapshot); `WORKFLOW_IMPROVEMENTS.md` (este).
- **Checklist "Nova Skill" (CHECKLISTS.md):** PASS — front matter `name` == pasta, description com triggers, SEM campo `tools:`; seções obrigatórias presentes (Lê/Gera/Nunca edita/Tools/Modo de erro/Algoritmo/Formato de commit/Casos de Borda); read-only menor privilégio; sem path de máquina hardcoded (`repo_docs` resolvido do AGENTS.md global); PT-BR; registrada no registry com fixture L0 (Golden Set Gate).
- **Validação:** `run-evals.ps1 -Registry` 5/5 PASS (exit 0); `run-evals.ps1 -Skill gm-tasks-pending` 12/12 PASS (exit 0); smoke sandbox `%TEMP%/opencode-eval/gm-tasks-pending/fixture-001` 5/5 True (front matter parseável; 4 tasks RN-082 com marcador done; RN-074 done; legado parseável; PEND-007 aberto) — sandbox destruído após o smoke. Sem commit/push (por ordem do operador).
- **Compatibilidade:** nenhuma skill/agent existente alterada além das views regeneradas; `gm-doc` não recebe o novo subagent (decisão do operador); IDs existentes não renumerados.
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente (não executada, por ordem do operador).

## IMP-092 — Disassociação das camadas de análise e tasks + estilos configuráveis de delivery + skill Azure DevOps

- **Data:** 09/10/2026
- **Alvo:** `gm-task-spec`, `gm-restructure`, `gm-init`, `gm-gh-issue-creator`, `gm-tasks-pending`, `gm-figma-tasks`, `gm-azure-workitem-creator` (nova skill), `registry.yaml` (domínio `azure`), `ARCHITECTURE.md` (render), `agents/gm-req.md`, `agents/gm-doc.md`, `agents/gm-dev.md`, `AGENTS.md`, `CONSTITUTION.md` dos repos de docs (nova §9 — artefato do `gm-req`)
- **Origem:** pedido do operador — a pasta de delivery misturava doc das RNs com tasks ("disassociar as duas camadas mantendo relação direta"); a camada de tasks deve oferecer múltiplos estilos de organização à escolha do operador, persistidos como padrão da DOC; destino das tasks passa a ser GitHub OU Azure DevOps. Design fechado em 4 rodadas de `question` (disassociação, camada das análises, menu de estilos — com pesquisa Scrum/XP/Kanban/Shape Up/SAFe/Now-Next-Later/Jira-Azure —, naming e formato do item de task).
- **Problema:** IMP-040 acumulava doc e tasks na mesma pasta (`delivery/<YYYY-MM>/RN-NNN — <título>/` com Analise-Funcional + Analise-Tecnica que continha Issue principal/Resumo/Ordem/tasks `RN-NNN-M`); organização fixa por sprint mensal; tracker único (GitHub).
- **Correção:** (1) **Nova camada `analysis/`** — `<produto>/analysis/RN-NNN — <título>/` com `RN-NNN — Analise-Funcional.md` (negócio, como antes) + `RN-NNN — Analise-Tecnica.md` que muda de papel para **spec técnica pura** (mapa RN→repo/endpoints/telas, decisões, contratos, tabelas, riscos — PROIBIDO conter Issue principal/Resumo/Ordem/tasks/menção a sprint ou delivery). (2) **Camada `delivery/` só de tasks** — `delivery/<grupo>/RN-NNN — <título> — Tasks.md` como ARQUIVO DIRETO (sem subpasta por feature), herdando o canônico IMP-039 inteiro + linha de proveniência `> Análise: ../../analysis/RN-NNN — <título>/`. (3) **Regra de ouro:** dependência UNIDIRECIONAL tasks→análise — reorganizar/mover/apagar tasks nunca invalida a doc. (4) **7 estilos de delivery** persistidos na **CONSTITUTION §9 "Organização de Delivery e Análise"**: `monthly` (YYYY-MM, compat legado), `sprint` (YYYY-MM-DD = data de início, sem prefixo + `sprint_weeks` 1..6), `release` (nome livre: v2.1/Q1-2027/Cycle 4), `flow` (backlog — kanban), `horizon` (now|next|later — Now/Next/Later), `epic` (temático), `custom` (template com placeholders persistido); `tracker`: github|azure. Fallback: §9 ausente → pergunta ao operador + oferece persistir; default de escrita `monthly`. Leitura agnóstica: glob recursivo `delivery/**/RN-NNN — *` + fallbacks legados IMP-040/034/032 preservados. (5) **`gm-azure-workitem-creator`** (nova skill): work items Azure Boards via MCP — corpo do Analise-Funcional, estrutura do Tasks.md, issue principal → Feature/User Story (pergunta), tasks RN-NNN-M → Tasks filhas (parent link), dry-run + nunca duplica, AreaPath/IterationPath por pergunta (defaults <setor>/PRJ.AMA com override); domínio `azure` sem orquestrador, invocável direto pelo `gm-req`; fixture L0. (6) **`gm-restructure` ganha modo `split-delivery`** — migra pastas legado IMP-040 para o novo formato (Funcional copiado; Técnica dividido entre spec pura e Tasks.md), em lote, sem renumerar IDs.
- **Execução:** paralelizada em 3 workers `gm-workflow-builder` com arquivos disjuntos (A: task-spec/restructure/init; B: gh-issue-creator/tasks-pending/figma-tasks; C: registry/render/agents/AGENTS.md + validação da skill azure) + `gm-req` com WORKFLOW_IMPROVEMENTS.md (este) e agentes complementares (github-orchestrator, dev-backend, dev-frontend, progress, tasks-pending). Piloto de migração manual: <cliente> RN-030 (analysis/ + delivery/2026-09/— Tasks.md, pasta legado removida).
- **Arquivos:** `skills/gm-azure-workitem-creator/SKILL.md` (criada); `evals/gm-azure-workitem-creator/fixture-001/` (criada); `skills/gm-task-spec/SKILL.md`; `skills/gm-restructure/SKILL.md`; `skills/gm-init/SKILL.md`; `skills/gm-gh-issue-creator/SKILL.md`; `skills/gm-tasks-pending/SKILL.md`; `skills/gm-figma-tasks/SKILL.md`; `registry.yaml`; `ARCHITECTURE.md` (render); `agents/gm-req.md`; `agents/gm-doc.md`; `agents/gm-dev.md`; `agents/gm-github-orchestrator.md`; `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`; `agents/gm-progress.md`; `agents/gm-tasks-pending.md`; `AGENTS.md`; `WORKFLOW_IMPROVEMENTS.md` (este).
- **Evals:** 120/120 PASS — azure-workitem-creator 13/13 (baseline, fixture L0), task-spec 52/52 (3 fixtures), restructure 25/25, gh-issue-creator 11/11, tasks-pending 12/12, init 7/7; relatórios em `evals/reports/EVAL_REPORT_runner_skill-*_2026-10-09-*.md`.
- **Compatibilidade:** formatos legados (IMP-040 pasta com 2 arquivos, flat pré-IMP-040, IMP-034, TASKS*.md) continuam legíveis como fallback; §9 é persistida por produto/repo de docs pelo operador via skills (não pela config); IDs estáveis preservados; WIP figma pré-existente na config preservado (render delta-only).
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente (não executada, por ordem do operador).

---

## IMP-093 — Arquivo de feature renomeado: — Tasks.md → — Feature.md (desambiguação via Jev)

- **Data:** 09/10/2026
- **Alvo:** skills `gm-task-spec`, `gm-gh-issue-creator`, `gm-azure-workitem-creator`, `gm-tasks-pending`, `gm-restructure`, `gm-figma-tasks`, `gm-init` (worker de skills) + `registry.yaml` + `ARCHITECTURE.md` (render) + agents `gm-req`, `gm-dev`, `gm-github-orchestrator`, `gm-dev-backend`, `gm-dev-frontend`, `gm-progress`, `gm-tasks-pending` (worker de registry/views) + CONSTITUTION §9 dos repos de docs + 15 arquivos renomeados.
- **Origem:** operação apontou confusão do nome do arquivo de feature com as tasks internas; análise Jev 1.13.0 confirmou — confusão alta 1.0, fonte "arquivo Tasks.md vs tasks internas" 0.83, termo "task" 1.0, risco alto 0.96; hipótese alternativa (hierarquia feature/RN ambígua) absolvida 0.02; operador escolheu renomear o arquivo (opção B) em vez de reestruturar seções.
- **Correção:** rename do arquivo de feature `delivery/<grupo>/RN-NNN — <título> — Tasks.md` → `— Feature.md`; seções internas, canônico IMP-039, H1 e linha `> Análise:` INALTERADOS; tasks `### RN-NNN-M` inalteradas — coerentes com o tracker (issue/task). Cadeia de leitura nos leitores: (1) `— Feature.md` vigente (globs `delivery/**/RN-NNN — * — Feature.md` e varredura `delivery/**/* — Feature.md`); (2) fallback `— Tasks.md` IMP-092 pré-rename — legível, NUNCA gerado; (3+) legados IMP-040/034/032/TASKS.md preservados. Registry: 4 descriptions atualizadas (subagent `gm-tasks-pending`; skills `gm-task-spec`, `gm-tasks-pending`, `gm-azure-workitem-creator`). Render delta-only no `ARCHITECTURE.md` (§4, §5.4, §5.9) — WIP pré-existente do bloco preservado. `AGENTS.md` global verificado — não cita o formato vigente, sem edição.
- **Arquivos:** `registry.yaml`; `ARCHITECTURE.md`; `agents/gm-req.md`; `agents/gm-dev.md`; `agents/gm-github-orchestrator.md`; `agents/gm-dev-backend.md`; `agents/gm-dev-frontend.md`; `agents/gm-progress.md`; `agents/gm-tasks-pending.md`; `AGENTS.md` (verificado, sem mudança); `WORKFLOW_IMPROVEMENTS.md` (este); `skills/**`, `evals/**` e a renomeação dos 15 arquivos — worker de skills.
- **Evals:** 129/129 PASS pós-rename — task-spec 52/52 · restructure 25/25 · azure-workitem-creator 13/13 · tasks-pending 12/12 · gh-issue-creator 11/11 · figma-tasks 9/9 · init 7/7; fixtures atualizadas (azure fixture-001 input/criteria/output-expected → `— Feature.md`); relatórios em `evals/reports/EVAL_REPORT_runner_skill-*_2026-10-09-*.md`. Repo de docs: 15/15 arquivos renomeados (<cliente> 7, <cliente> 6, <produto-hub> 1, <cliente> 1), 0 `— Tasks.md` remanescente; menções restantes na config = fallbacks documentados.
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente.
---

## IMP-094 — Ciclo PEND/RN/CR: PEND nunca ancora feature; promoção formal; CR com gate de score

- **Data:** 09/10/2026
- **Alvo:** skills `gm-clarify`, `gm-requirements`, `gm-change-request`, `gm-task-spec`, `gm-restructure`, `gm-tasks-pending`, `gm-azure-workitem-creator` (worker de skills) + `registry.yaml` + `ARCHITECTURE.md` (render) + agents `gm-req`, `gm-dev`, `gm-github-orchestrator`, `gm-dev-backend`, `gm-dev-frontend`, `gm-progress`, `gm-tasks-pending` + `AGENTS.md` + <cliente> (REQUIREMENTS/features — promoção retroativa).
- **Origem:** decisão do operador na sessão de arquitetura de delivery — feature = promessa de entrega e exige RN confirmada como âncora; corrigido o design que aceitava PEND-âncora de feature.
- **Correção:** regras do ciclo — (R1) PEND nunca ancora Feature: a âncora é sempre a RN-NNN; PEND sai por promoção a RN (resolvida) ou vira CR; (R2) PEND pode virar CR quando a resolução altera RN confirmada; (R3) CR direto exige score ≥ 70 — abaixo disso nasce PEND via `gm-clarify`. Âncoras PEND pré-existentes são legado pré-IMP-094: legíveis em leitura, nunca criadas. Promoção retroativa: as 6 PEND-âncoras do <cliente> → RN-053..RN-058 com renomeação de pastas/análises/`— Feature.md`/IDs de task. Registry: 6 descriptions atualizadas (subagent `gm-tasks-pending`; skills `gm-clarify`, `gm-requirements`, `gm-change-request`, `gm-task-spec`, `gm-tasks-pending`). Render delta-only no `ARCHITECTURE.md` (§4 + §5.2 Requisitos e §5.4 Qualidade do bloco registry — WIP pré-existente preservado). `agents/gm-req.md`: âncora só RN no bloco de regras de Tasks + regra R1/R2/R3 resumida. `AGENTS.md` e demais agents verificados: só leitura de PEND/IDs estáveis (IMP-031 intocado), sem regra de ancoragem — sem edição.
- **Arquivos:** `registry.yaml`; `ARCHITECTURE.md`; `agents/gm-req.md`; `AGENTS.md` (verificado, sem mudança); `agents/gm-dev.md`, `agents/gm-github-orchestrator.md`, `agents/gm-dev-backend.md`, `agents/gm-dev-frontend.md`, `agents/gm-progress.md`, `agents/gm-tasks-pending.md` (verificados, sem mudança); `WORKFLOW_IMPROVEMENTS.md` (este); `skills/**`, `evals/**` e REQUIREMENTS/features do <cliente> — worker de skills.
- **Evals:** 145/145 PASS pós-IMP-094 — task-spec 52/52 · restructure 25/25 · requirements 23/23 · azure-workitem-creator 13/13 · tasks-pending 12/12 · change-request 11/11 · clarify 9/9 (nenhum criteria testava âncora PEND válida; os que citam PEND são bloqueio/legado — coerentes). Repo de docs: REQUIREMENTS do <cliente> com RN-053..058 + 6 PENDs marcadas "Promovida"; 18 arquivos de features re-ancorados (zero âncoras PEND vivas; PENDs subjacentes 005/007/013/014 preservadas como referência/história).
- **Compatibilidade:** nenhuma mudança de delegação — `delegates`/`invokes`/`available_to` inalterados; PEND continua legível como pendência (gm-next/gm-progress/gm-tasks-pending, leitura de REQUIREMENTS §11); IDs estáveis preservados fora da promoção retroativa documentada.
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente.

## IMP-095 — Camada analysis/ + delivery/ no roteamento: gm-next recomenda gm-task-spec; handoffs de fechamento no gm-req e nas skills terminais

- **Data:** 09/10/2026
- **Alvo:** skills `gm-next` e `gm-progress` (estado); agent `gm-req`; skills de fechamento `gm-ui-spec`, `gm-architecture`, `gm-traceability`, `gm-test-strategy`, `gm-figma-prompt` (handoffs).
- **Origem:** sessão <produto-ui> (<docs-repo>) — nenhum ponto do fluxo citou proativamente a camada analysis/ + delivery/ (IMP-092/093) após fechar as specs; o operador precisou pedir "a camada de analysis com as RNs" por conta própria. Suspeita do operador confirmada: a camada de analysis não estava referenciada no roteamento do workflow.
- **Problema:** `gm-next` nunca recomendava `gm-task-spec` — inventário de caminhos sem `analysis/` e com `delivery/` só-legado (pré-IMP-092/093) e Prioridades 1-7 sem condição para features (estado "specs completas sem features" caía em "Nada pendente"). `gm-req` citava analysis/delivery apenas como restrição no Comportamento ("não são artefato próprio deste agente"), sem passo de roteamento. Grep `gm-task-spec` = 0 hits nas 5 skills de fechamento. `gm-progress` não exibia features no Bloco D (Fase 3 com 4 artefatos).
- **Causa raiz:** Instrução ausente — o roteador de estado (`gm-next`) e o orquestrador do fluxo (`gm-req`) não conheciam a camada de features como passo da DAG; o handoff é papel deles, não das skills de fechamento.
- **Correção:** `gm-next` — inventário ganha `analysis/` + `— Feature.md` em `delivery/<grupo-do-estilo>/`; linha "Features (análise + delivery)" na Fase 3 do Passo 2; nova **Prioridade 5 — Features ausentes → `gm-task-spec`** (condição: RNs confirmadas + nenhuma feature em `analysis/`/`delivery/`; fallbacks legados contam como cobertura; specs ausentes não bloqueiam — tasks "sujeitas a revisão"); antigas P5-P7 renumeradas P6-P8; guarda no caso de borda "Todos os artefatos completos". `agents/gm-req.md` — nova seção "Fechamento do ciclo — specs → features (analysis/ + delivery/)": nunca encerrar sessão de specs sem oferecer `gm-task-spec` (direta ou via `@gm-quality-orchestrator`), `gm-next` como verificador e encaminhamento para issues (GitHub/Azure conforme §9). Handoff de 1 passo (precedente: design-brief Passo 5.3 "Aponte o próximo passo natural") no fim do Workflow/Algoritmo das 5 skills terminais, apontando `gm-task-spec` (IMP-092/093) + `gm-next`. `gm-progress` — inventário + linha "Features" na Fase 3 do Bloco D (4→5 artefatos; exemplos e template --save atualizados).
- **Arquivos:** `skills/gm-next/SKILL.md`; `agents/gm-req.md`; `skills/gm-ui-spec/SKILL.md`; `skills/gm-architecture/SKILL.md`; `skills/gm-traceability/SKILL.md`; `skills/gm-test-strategy/SKILL.md`; `skills/gm-figma-prompt/SKILL.md`; `skills/gm-progress/SKILL.md`; `WORKFLOW_IMPROVEMENTS.md` (este).
- **Evals:** 72/72 PASS (runner determinístico, baseline-mode) — gm-next 7/7 · gm-progress 7/7 · ui-spec 18/18 · architecture 13/13 · traceability 9/9 · test-strategy 11/11 · figma-prompt 7/7. Baselines `output-expected` intocados (mudanças aditivas em instruções, não em templates de saída).
- **Health check (IMP-086/087):** verificação F.10-13 textual nos 8 arquivos editados — delimitadores `---` íntegros, YAML parseável, `permission:` presente no agent — 8/8 OK.
- **Compatibilidade:** nenhuma mudança de delegação — `registry.yaml`/`ARCHITECTURE.md` intocados (`gm-task-spec` segue no domínio Qualidade; `gm-req` invoca a skill diretamente, como já faz com as demais skills de fase). Regra PEND/RN/CR da IMP-094 intocada (a recomendação nova dispara só para RNs confirmadas).
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente.
## IMP-096 — Propagação de confiança (legado → specs), CONFIDENCE_REPORT no gm-validate e persistência do relatório reverso com checkpoint (tema: camada doc)

- **Data:** 14/10/2026
- **Alvo (tema: camada doc):** skills `gm-requirements`, `gm-data-model`, `gm-api-contracts`, `gm-ui-spec`, `gm-architecture`, `gm-validate` + agents `gm-reverse-orchestrator`, `gm-doc`.
- **Origem:** análise do framework Reversa (sandeco/reversa @ 524c64e) — o grau de confiança (Alta/Média/Baixa) que o `gm-reverse-orchestrator` já atribui às RNs induzidas (Princípio 8) não sobrevivia à materialização dos artefatos: REQUIREMENTS.md e as specs perdiam a marca, e o relatório reverso existia só no texto do turno (sem checkpoint para retomada).
- **Correção:** (1) **Propagação de confiança** — `gm-requirements` registra `**Confiança:** Alta | Média | Baixa` no corpo de cada RN induzida de engenharia reversa (módulo `sistema_existente: true`); escala Alta→🟢 CONFIRMADO, Média→🟡 INFERIDO, Baixa→🔴 GAP; regra de ouro "na dúvida, nível mais baixo"; RN Baixa sem validação humana segue IMP-094 (PEND, nunca ancora feature). As 4 skills de spec ganham a seção "Propagação de confiança (legado)": afirmações derivadas de RN induzida herdam a marca da RN de origem; evidência `[arquivo:linha]` ou `@<hash>` quando disponível — afirmação sem evidência nunca recebe 🟢. (2) **CONFIDENCE_REPORT** — `gm-validate` gera `quality/CONFIDENCE_REPORT.md` (novo item em "Gera", passo 4 do Workflow, seção com template e caso de borda): contagem por documento, percentual geral `(🟢 + 0,5×🟡)/total`, lista dos 🔴/Baixa com link para os PEND-XXX; módulo sem marcadores → aviso "sem calibração de confiança (análise reversa não aplicada)" — nunca falha o gate. (3) **Persistência + checkpoint** — `gm-reverse-orchestrator` troca o `write: deny` absoluto por escrita restrita (glob) a `<produto>/quality/REVERSE_REPORT_<timestamp>.md` e `<produto>/quality/REVERSE_STATE.md` no repositório de documentação (<docs-repo>) — nada mais; ao final de cada fatia/Bounded Context atualiza REVERSE_STATE.md com JSON `{"contexts_analyzed": [...], "contexts_pending": [...], "head_per_repo": {...}, "report_path": "..."}` e grava o relatório completo com evidências; retomada: REVERSE_STATE.md existente → modo delta natural (Princípio 7) com `contexts_pending` como escopo. `gm-doc` (Etapa 2, novo passo 3): registra o caminho do REVERSE_REPORT_<ts>.md e usa o arquivo como insumo (`Lê`) nas skills da Etapa 4 — nunca cola o relatório inteiro no prompt (proteção de contexto).
- **Arquivos:** `skills/gm-requirements/SKILL.md`; `skills/gm-data-model/SKILL.md`; `skills/gm-api-contracts/SKILL.md`; `skills/gm-ui-spec/SKILL.md`; `skills/gm-architecture/SKILL.md`; `skills/gm-validate/SKILL.md`; `agents/gm-reverse-orchestrator.md`; `agents/gm-doc.md`; `WORKFLOW_IMPROVEMENTS.md` (este).
- **Compatibilidade:** nenhuma mudança de delegação — `registry.yaml`/`ARCHITECTURE.md` intocados; marcadores de confiança são aditivos (artefatos de módulos greenfield ficam sem marcadores e o CONFIDENCE_REPORT apenas avisa); `edit: deny` do orquestrador preservado (só `write` com glob restrito); REVERSE_REPORT é novo artefato em `quality/` (IMP-011), não colide com artefatos existentes.
- **Status:** ✓. Aplicada — requer reiniciar o OpenCode (config não é hot-reloaded); publicação via `gm-self-publish` pendente.
  - **Integração Jev (14/10/2026, sub-iteração):** segunda camada semântica opcional (TypeSafe `jev_classify`, via subagent `@gm-jev-classifier`) acoplada à propagação de confiança da IMP-096 em 3 pontos: (1) `gm-requirements` passo 8 — seção "Segunda camada Jev (opcional)": RN induzida de legado submetida ao Jev (`text` = corpo da RN + evidência `[arquivo:linha]`/`@hash`; criteria {confirmada, inferida, lacuna}); `confirmada` com p<0.7 ou `inferida`/`lacuna` → **rebaixa** 1 nível (Alta→Média→Baixa) e anota `Jev: <resposta> (p=…)` no corpo — só rebaixa, nunca eleva; chamadas agrupadas em lote (1 sessão por lote, nunca 1 por RN). (2) `gm-validate` (CONFIDENCE_REPORT) — seção "Auditoria anti-🟢 disfarçado (Jev, opcional)": afirmações 🟢 (ou amostra se >20) auditadas (criteria {evidencia_direta, linguagem_inferencia, sem_evidencia}); resultado vira coluna `🟢⤵ sugestão Jev: rebaixar (p=…)` no relatório — nunca edita o artefato de origem (reclassificação cabe a re-execução humana/reverse). (3) `gm-requirements` passo 3 (merge incremental) — seção "Contradição semântica no merge (Jev, opcional)": par (texto antigo, texto novo) de RN nova que toque domínio de RN confirmada auditado (criteria {consistente, contraditoria, incomparavel}); `contraditoria` com p≥0.7 → NÃO sobrescrever silenciosamente: registra candidato a CR em `support/CHANGE_REQUESTS.md` + sinaliza no CHANGELOG.md (fluxo de CR existente). **Regras transversais:** Jev é opcional (nunca gate bloqueante), só rebaixa grau de confiança, registra a probabilidade ao lado do grau, indisponível/falha → segue sem ele com aviso. **Arquivos:** `skills/gm-requirements/SKILL.md`; `skills/gm-validate/SKILL.md`; `WORKFLOW_IMPROVEMENTS.md` (este).

## IMP-097 - Guard anti-BOM em front matter (health monitor + self-publish)

- **Data:** 14/10/2026
- **Alvo:** skill `gm-agent-health-monitor` (Verificação F).
- **Origem:** durante o publish da IMP-096, o `gm-self-publish` detectou que o runtime reescreveu os 3 primaries (`gm-dev`, `gm-doc`, `gm-req`) com **BOM UTF-8** (U+FEFF antes do `---` do front matter) ao instalar a skill `gm-detect-onboarding`. BOM na 1ª linha pode não ser reconhecido como delimitador pelo parser - mesma classe de falha silenciosa do IMP-086 (front matter descartado sem erro: `permission:`, `mode`, `temperature` caem nos defaults).
- **Correção:** novo item **10b** na Verificação F (front matter): BOM no início do arquivo = FINDING crítico; verificação barata via 3 primeiros bytes (`[IO.File]::ReadAllBytes` - `Get-Content` mascara o BOM). O `gm-self-publish` (Health Gate, Passo 3.5) já herda o check ao reusar os itens 10-13.
- **Arquivos:** `skills/gm-agent-health-monitor/SKILL.md`.
- **Status:** V. Aplicada - requer reiniciar o OpenCode; publicação via `gm-self-publish` pendente.

## IMP-098 — Correção pós-auditoria: BOM UTF-8, front matter ausente, names fora do padrão e registro do gm-stack-boilerplate

- **Data:** 17/10/2026
- **Alvo:** `gm-azure-orchestrator` (agent), skills `gm-azure-setup`, `gm-cicd-workflow`, `gm-observability`, `create-github-issues`, `gm-restructure`, `gm-traceability`, `registry.yaml`
- **Problema:** 7 findings críticos + 5 warnings do `gm-agent-health-monitor`: (1) BOM UTF-8 em 4 arquivos (agent + 3 skills) quebrava o parse do front matter; (2) `create-github-issues/SKILL.md` sem front matter YAML; (3) `name:` fora do padrão lowercase-hyphen em `gm-restructure` e `gm-traceability`; (4) `gm-stack-boilerplate` ausente do registry.yaml; (5) warnings de decisão (seções ausentes em `gm-pattern-extractor`/`gm-stack-rust`; 6 skills não-Golmet fora do registry) — NÃO corrigidos, pendentes de decisão.
- **Causa raiz:** Ferramentas de escrita em PowerShell gravam UTF-8 COM BOM por default (`Out-File`/`Set-Content -Encoding UTF8` no Windows PowerShell 5.1) — skills/agents criados por subagentes nesta máquina herdaram o BOM; skill utilitária copiada sem front matter; typos de `name`; skill criada pelo builder sem atualizar o registry.
- **Correção:** Reescrita dos 4 arquivos em UTF-8 SEM BOM (`WriteAllText` + `UTF8Encoding($false)`); front matter mínimo adicionado ao `create-github-issues` (name + description com triggers pt/en); `name` corrigido para `gm-restructure`/`gm-traceability` (YAML preservado); `gm-stack-boilerplate` registrado em `skills` (domínio dev) e em `domains.dev.skills`.
- **Validação:** 3 primeiros bytes dos 4 arquivos = `2D 2D 2D` (`---`, não BOM); F.10-13 health check manual — 7/7 arquivos com delimitadores e YAML válidos; `run-evals.ps1 -Registry` — 5 PASS / 0 FAIL.
- **Arquivos:** `agents/gm-azure-orchestrator.md`, `skills/gm-azure-setup/SKILL.md`, `skills/gm-cicd-workflow/SKILL.md`, `skills/gm-observability/SKILL.md`, `skills/create-github-issues/SKILL.md`, `skills/gm-restructure/SKILL.md`, `skills/gm-traceability/SKILL.md`, `registry.yaml`, `WORKFLOW_IMPROVEMENTS.md`
- **Prevenção:** o checklist do health monitor (F.10-13) já cobre BOM/front matter; sugerir hook/lint no `gm-skill-creator`/`gm-subagent-creator` que force gravação UTF-8 sem BOM e cheque `name` lowercase-hyphen na criação.
- **Pendências de decisão:** resolvidas em 17/10/2026 (sub-iteração): (1) `## Modo de erro` adicionado a `gm-pattern-extractor` (modo `warn`, strict na escrita) e `gm-stack-rust` (modo `warn`, repo prevalece sobre playbook, strict na verificação); (2) as 6 skills utilitárias não-Golmet (`mcp-postgres-setup`, `create-github-issues`, `github-issues-from-plan`, `split-commits-by-diff`, `sync-gsd-from-issues`, `typesafe-ai`) permanecem FORA do registry por exceção documentada: não fazem parte do pipeline Golmet, não são referenciadas por nenhum agent/skill Golmet (IMP-080 só exige registro de dependências citadas) — reavaliar se algum componente Golmet passar a invocá-las.
- **Status:** aplicada
### Sub-iteração (17/10) - exceção substituída por registro pleno (delta disco <-> registry = 0)

- **Data:** 17/10/2026
- **Alvo:** `registry.yaml`
- **Contexto:** o Jev mantinha veredito `atencao` (0.73) porque o disco tinha 76 skills e o registry 70 - a exceção das 6 skills não-Golmet (item 5 dos warnings do IMP-098) era a última ressalva ativa da config. O operador decidiu zerar o delta.
- **Correção:** novo domínio `utilitarios` (orchestrator: null, description: "Skills utilitárias do ambiente - fora do pipeline Golmet; demanda direta do operador") com as 6 skills `mcp-postgres-setup`, `create-github-issues`, `github-issues-from-plan`, `split-commits-by-diff`, `sync-gsd-from-issues`, `typesafe-ai` - descriptions copiadas dos front matter reais dos SKILL.md.
- **Validação:** primeiros bytes preservados (`23 20 52 65 67 69` = "# Regi", sem BOM novo); sem mojibake novo; ids sem duplicatas; delta disco <-> registry = 0 (76 == 76); `run-evals.ps1 -Registry` 5/5 PASS; views regeneradas via `gm-registry-render`.
- **Arquivos:** `registry.yaml`, `WORKFLOW_IMPROVEMENTS.md`, `ARCHITECTURE.md` (views)

## IMP-099 — Métricas de resultado (outcome): origem de CR, Bloco Resultado no dashboard, roll-up heurístico por feature e Outcome Metrics

- **Data:** 17/10/2026
- **Alvo:** `gm-change-request`, `gm-clarify`, `gm-progress`, `gm-perf-auditor`, `gm-metrics-collector`
- **Problema:** o workflow media apenas processo (cobertura, drift, latência) — não media resultado: quantos CRs eram retrabalho de requisitos mal capturados, taxa de resolução de PENDs, custo tempo/tokens por feature entregue e features sem drift-check pós-entrega.
- **Causa raiz:** instrução ausente — nenhuma skill capturava a origem da mudança nem agregava saída por feature/resultado.
- **Correção (desenho aprovado pelo operador — opção a + 2 campos novos; zero skills novas, registry inalterado):**
  1. `gm-change-request`: campo `**Origem:** requisito-mal-capturado | evolucao | bug | decisao-cliente` no corpo do CR (pergunta/classifica via `question`; não-interativo infere e registra a inferência). CR sem origem = registro incompleto (agregação trata como N/A, nunca inventa).
  2. `gm-clarify`: PENDs nascidos de ambiguidade carregam proveniência; promoção PEND→RN e PEND→CR carregam a origem `requisito-mal-capturado`.
  3. `gm-progress`: novo Bloco E "Resultado" (5 blocos no total): PENDs abertos vs. resolvidos por feature/RN-âncora, CRs por origem (fração `requisito-mal-capturado` = retrabalho de requisitos), features `entregue_em` há >14 dias sem drift-check. Dado ausente → `N/A (sem dados)` declarado, nunca número estimado.
  4. `gm-perf-auditor`: roll-up de tempo/tokens por feature (RN-âncora), primary e tier de modelo via join heurístico (diretório/título da sessão) — declarado heurístico/aproximado; sessões não mapeadas excluídas e contadas, nunca atribuídas.
  5. `gm-metrics-collector`: seção `## Outcome Metrics` em _docs/METRICS.md com as 4 métricas, cada uma com fonte e período declarados; métrica sem fonte = não coletada (`N/A (sem dados)`, nunca zero fingido).
- **Arquivos:** skills/`gm-change-request`/SKILL.md, skills/`gm-clarify`/SKILL.md, skills/`gm-progress`/SKILL.md, skills/`gm-perf-auditor`/SKILL.md, skills/`gm-metrics-collector`/SKILL.md; fixtures novas: evals/gm-change-request/fixture-003, evals/gm-clarify/fixture-003, evals/gm-progress/fixture-002, evals/gm-perf-auditor/fixture-002, evals/gm-metrics-collector/fixture-002.
- **Validação:** evals baseline das 5 skills — 17/17, 12/12, 14/14, 28/28, 12/12 PASS (0 FAIL error). Bytes iniciais `2D 2D 2D` (UTF-8 sem BOM) verificados em todos os SKILL.md editados.
- **Origem:** sugestão do operador.
- **Status:** aplicada

## IMP-100 — Anti-circularidade do ciclo de auto-evolução: golden set humano, evals negativos, calibração Jev e gate de piloto

- **Data:** 17/10/2026
- **Alvo:** agents `gm-workflow-improver`, `gm-workflow-builder`; skills `gm-skill-eval`, `gm-self-publish`, `gm-skill-evolution`; runner `evals/run-evals.ps1`.
- **Problema:** o ciclo de auto-evolução é circular — builder cria → eval valida → improver corrige, tudo no mesmo sistema; fixtures escritas pelos mesmos agents que elas validam; 100% PASS não prova que o runner discrimina (runner que aprova tudo também daria 100%); Jev é usado sem rastro de calibração.
- **Causa raiz:** ausência de (1) baseline humano protegido contra escrita de agents, (2) evals negativos (pratos quebrados) que forcem o runner a falhar, (3) log de calibração do modelo semântico, (4) gate de confirmação empírica.
- **Correção:**
  1. **Golden set humano** — `evals/golden-human/` criado com README de proteção e 2 casos seed `status: seed-nao-revisado` (recusa de gravação sem confirmação → `not_file_exists`; CR sem origem → `N/A (sem dados)` declarado). Regra nova em "Nunca edita" do improver, builder e skill-eval: intocado por agents (escrita só do operador; exceção do seed já consumida). O `gm-self-publish` NÃO exige golden verde no Golden Set Gate, mas rejeita path explícito em `evals/golden-human/` num commit publicado por ele.
  2. **Evals negativos** — runner suporta `expect: fail` em check (o check DEVE falhar; PASS = "runner não discriminou" = FAIL do eval), modo `-Golden` (só golden-human) e selftest `evals/runner-selftest/` com 5 pratos quebrados (front matter `-- `; RN alucinada cross_ref; número inventado vs N/A declarado; file_exists faltante; id_sequence fora de ordem). `-All` inclui golden + selftest e reporta "Discriminação do runner: N/N pratos pegos".
  3. **Calibração Jev** — `evals/jev-calibration.md` (append-only: data | decisão | julgamento | veredito humano | Y/N | nota), seed com 4 julgamentos reais da sessão (exceção registry×2; ref órfã menor; saúde atencao 0.73→saudavel 0.98 após correção de causa = discordância-que-virou-concordância). `gm-skill-evolution` ganhou passo periódico "Revisão de calibração Jev" (taxa de concordância + tendência over/under-confidence; concordância < 0.7 → reavaliar prompts/criteria, nunca o modelo).
  4. **Gate de piloto** — status desta IMP é "aplicada — PENDENTE DE PILOTO": nenhuma afirmação "todas as camadas fracas resolvidas" é considerada confirmada sem 1 ciclo completo req→doc→dev em módulo real com as métricas da IMP-099 ligadas. O operador escolherá o módulo do piloto.
- **Arquivos:** `agents/gm-workflow-improver.md`; `agents/gm-workflow-builder.md`; `skills/gm-skill-eval/SKILL.md`; `skills/gm-self-publish/SKILL.md`; `skills/gm-skill-evolution/SKILL.md`; `evals/run-evals.ps1`; `evals/golden-human/` (README + case-001 + case-002); `evals/runner-selftest/` (case-001..005); `evals/jev-calibration.md`; fixtures novas: `evals/gm-workflow-improver/fixture-002`, `evals/gm-workflow-builder/fixture-001`, `evals/gm-skill-eval/fixture-002`, `evals/gm-self-publish/fixture-002`; `WORKFLOW_IMPROVEMENTS.md` (este).
- **Validação:** `-Golden` 3/3 PASS; `-All` 708/708 PASS com "Discriminação do runner: 6/6 pratos pegos"; baselines das 4 skills/agents com fixtures novas — 14/14, 3/3, 2/2, 3/3 PASS; UTF-8 sem BOM verificado (bytes iniciais) em todos os arquivos criados/editados.
- **Status:** aplicada — **PENDENTE DE PILOTO** (1 ciclo req→doc→dev em módulo real com métricas IMP-099 ligadas, módulo a escolher pelo operador).

## IMP-101 - Reestruturação de domínios: aposentadoria de skills de issue, rebalanceamento Qualidade, orquestradores Dev/DevOps e realocação de utilitárias

- **Data:** 17/10/2026
- **Alvo:** registry.yaml, ARCHITECTURE.md (views), agents/gm-dev-orchestrator.md (novo), agents/gm-devops-orchestrator.md (novo), agents/gm-quality-orchestrator.md, agents/gm-translation-orchestrator.md, agents/gm-onboarding-orchestrator.md, agents/gm-dev.md, agents/gm-devops.md, agents/gm-doc.md, skills/create-github-issues/ (removida), skills/github-issues-from-plan/ (removida), evals/gm-dev-orchestrator/fixture-001/ (nova), evals/gm-devops-orchestrator/fixture-001/ (nova).
- **Problema:** 4 skills com domínio incorreto em Qualidade (task-spec/gera specs de tradução; howto/gera docs; perf-auditor e skill-evolution/são meta do próprio workflow); skills de issue genéricas (create-github-issues, github-issues-from-plan) redundantes com gm-gh-issue-creator; domínios Dev e DevOps sem orquestrador (assimetria com GitHub/Azure/Intake/Requisitos); skills utilitárias sem camada definida.
- **Correção:**
  1. **Aposentadoria (Decisão 1):** removidas `skills/create-github-issues/` e `skills/github-issues-from-plan/` (pastas + entradas no registry + views) — `gm-gh-issue-creator` é a canônica para delivery Golmet. Referências históricas neste arquivo foram preservadas (registro imutável).
  2. **Rebalanceamento Qualidade → 6 skills genuínas (Decisão 2):** `gm-task-spec` → traducao (invoke movido do quality-orchestrator para o translation-orchestrator); `gm-howto` → documentacao (invoke: `gm-doc` invokes_direct — o reverse-orchestrator tem escrita restrita a REVERSE_REPORT/STATE); `gm-perf-auditor` e `gm-skill-evolution` → meta (invokes do workflow-builder). Qualidade fica com: quality-gates, retrospective, pattern-extractor, metrics-collector, test-strategy, validate (traceability já estava em documentacao).
  3. **Orquestradores de simetria (Decisão 4):** criados `gm-dev-orchestrator` (roteia boilerplate → executor → QA → revisão → PR; invoca gm-stack-boilerplate e gm-quality-gates; delegação de executores/QA/revisor permanece no primary gm-dev) e `gm-devops-orchestrator` (roteia vps-setup/vps-troubleshoot/cicd-workflow/observability; padrão github/azure — roteia, não executa). Ambos mode: subagent, UTF-8 sem BOM, menor privilégio, fixtures de eval criadas. Domínios dev e devops ganharam `orchestrator`; primaries ganharam o delegate.
  4. **Utilitárias realocadas (Decisão 3, análise + aprovação do operador):** `typesafe-ai` → meta (backbone Jev/System One do próprio workflow); `split-commits-by-diff` → dev (commits lógicos por task/RN no fechamento do dev); `mcp-postgres-setup` → transversal (mesmo contrato dos irmãos mcp-playwright/figma-setup); `sync-gsd-from-issues` → permanece em utilitarios (GSD é workflow externo; read-back de issues no Golmet é do @gm-tasks-pending).
  5. **Reparo estrutural do registry.yaml:** blocos dos subagents `gm-dev-qa` e `gm-dev-reviewer` estavam espiados dentro da seção `domains:` (YAML inválido) e a lista do domínio dev tinha linha duplicada — blocos movidos para `subagents:`, lista corrigida (faltavam stack-rust e stack-dotnet-csharp).
- **Validação:** parse YAML ok (js-yaml); 0 referências quebradas (invokes, domain skills, delegates, invokes_direct, available_to); 0 duplicatas; re-render das views (ARCHITECTURE.md + tabelas de subagents dos primaries) a partir do registry; run-evals --all: 745/745 PASS, selftest 6/6; 16 arquivos tocados sem BOM.

## IMP-102 - Dominio Compliance (LGPD) e gm-client-report: camada de verificacao formal de dado pessoal + fechamento do artefato orfao CLIENT_REPORT

- **Data:** 18/10/2026
- **Alvo:** skills `gm-compliance-check` (nova), `gm-client-report` (nova), `gm-project-intake`, `gm-validate`; agents gm-compliance-orchestrator (novo), gm-dev-reviewer, gm-requirements-orchestrator; registry.yaml; ARCHITECTURE.md (views) + tabelas de gm-req.md/gm-doc.md; 30 skills com a lista IMP-011 da pasta specs/; fixtures: evals/gm-compliance-check/fixture-001, evals/gm-client-report/fixture-001, evals/gm-dev-reviewer/fixture-002.
- **Origem:** sugestao do operador sobre LGPD/conformidade.
- **Problema:** a LGPD era praticada de fato nos produtos (<cliente>: aceite versionado ToU/PP com sync offline — PEND-008; <projeto-web>: RN-007 paginas legais, RN-024 trust panel compliance) mas a taxonomia nao tinha camada de verificacao formal: o intake nao perguntava sobre dado pessoal, o gm-dev-reviewer nao tinha eixo compliance, e gm-validate/wiki-lint nao cobravam artefato legal. Alem disso, CLIENT_REPORT_*.md` existia na estrutura IMP-011 (lista de delivery/) mas nenhuma skill o gerava — artefato orfao.
- **Correcao:**
  1. **Skill gm-compliance-check** (dominio compliance, owner gm-req): checklist LGPD pragmatico (Lei 13.709/2018) com 10 eixos — levantamento (categorias, sensiveis, menor), base legal por tratamento (Art. 7/11), consentimento (versionado/granular/revogavel — padrao <cliente>), minimizacao e finalidade, retencao e descarte, direitos do titular (Art. 18), seguranca (Art. 46), registros (RTD/RIPD), terceiros/DPO, internacionalizacao. Gera `specs/COMPLIANCE.md` com status por eixo (conforme/parcial/lacuna/a decidir/N-A), plano de lacunas e candidatos a RN/CR. Nao assessora juridicamente: duvida razoavel de base legal vira "A decidir" para o DPO/juridico do cliente.
  2. **Ganchos:** gm-project-intake — pergunta "trata dado pessoal?" nos 2 modos (completo e simplificado) + campo compliance: true no template do charter (gatilho do dominio); gm-dev-reviewer — 5o eixo de review: itens aplicaveis de specs/COMPLIANCE.md quando a task toca dado pessoal (so se o modulo tiver o artefato E compliance: true; artefato ausente e cobranca do gm-validate, nao do reviewer); gm-validate — categoria 7 "Compliance obrigatorio ausente" (severity error): charter compliance: true sem specs/COMPLIANCE.md.
  3. **Orquestrador gm-compliance-orchestrator** (owner gm-req, available_to gm-req + gm-doc): roteia o compliance-check e cita os ganchos sem duplica-los; engenharia reversa pode induzir RNs legais e chama o checklist. gm-req ganha o delegate.
  4. **Skill gm-client-report** (dominio requisitos, owner gm-req): gera `delivery/CLIENT_REPORT_<periodo>.md` (default yyyy-MM) em linguagem de negocio — "Precisamos de voce" (PENDs que aguardam o cliente), entregas/andamentos/mudancas de escopo sem IDs tecnicos no corpo executivo, apendice tecnico com rastreabilidade. Fontes read-only: SCOPE_AGREEMENT.md, bloco Resultado do gm-progress (IMP-099), CLIENT_REQUIREMENTS.md, metadados das Feature.md (status, entregue_em) e CHANGE_REQUESTS.md (Origem). Invoke adicionado ao requirements-orchestrator.
  5. **Lista IMP-011 em massa (decisao: aplicada):** a linha canonica de specs/ era identica em 30 skills — atualizacao mecanica de baixo risco: COMPLIANCE.md adicionado as 31 listas (30 existentes + a nova compliance-check). Mencoes incidentes isoladas ficaram intocadas.
- **Registro no repo de docs (PENDENCIA):** o CONSTITUTION.md do <docs-repo> NAO foi tocado (fora do escopo desta IMP — vive no repo de docs). Pendencia registrada: atualizar a estrutura IMP-011 do CONSTITUTION.md com specs/COMPLIANCE.md (e manter delivery/CLIENT_REPORT_<periodo>.md, que ja constava como orfao) na proxima revisao de governanca (gm-governance).
- **Validacao:** evals baseline — gm-compliance-check 9/9, gm-client-report 8/8, gm-dev-reviewer 14/14 (2 fixtures) PASS; run-evals -All 769/769 PASS com selftest 6/6 ("Discriminacao do runner: 6/6 pratos pegos"); -Registry 5/5 PASS; UTF-8 sem BOM verificado em 103 arquivos tocados/criados; registry parse com 0 duplicatas novas (duplo-registro gm-next/progress/guard/tasks-pending preexistente e intencional).
- **Status:** aplicada — requer reiniciar o OpenCode (config nao e hot-reloaded); publicacao via gm-self-publish pendente.

## IMP-103 - Portabilidade e governança operacional: perfil por cliente, política de concorrência, matriz de permissões e manifest de integridade

- **Data:** 18/10/2026
- **Alvo:** `gm-setup`, `gm-azure-setup`, `@gm-azure-orchestrator`, `@gm-devops`, `gm-self-publish`, `gm-self-update`, `gm-agent-health-monitor` (verificação H)
- **Problema:** (1) defaults de cliente (<setor>/PRJ.AMA, usurio, repos) hardcoded na base publicada (skills/agents Azure), quebrando portabilidade para outros clientes; (2) sem política de concorrência no <docs-repo>; (3) permissões sem matriz documentada e allows amplos injustificados (bash de orquestradores, edit/write do @gm-devops); (4) sem manifest de integridade para detectar tampering/divergência local no ciclo publish/pull.
- **Causa raiz:** Instruo ausente + conveno ausente: as skills Azure liam defaults fixados no AGENTS.md (que é gitignored/local) em vez de um perfil portvel; no havia artefato canônico de permissões nem passo de integridade no ciclo de publicao.
- **Correo:**
  1. **Perfil por cliente sobre core neutro:** criados `rules/client-profile.template.md` (versionado) e `rules/client-profile.md` (gitignored no .gitignore; rules/ era indexado); gm-setup ganhou Passo 2b (coleta defaults do cliente e grava o perfil); AGENTS.md ganhou entrada no índice lazy (IMP-048) com regra "ler ANTES de qualquer operação Azure/tracker"; gm-azure-setup e @gm-azure-orchestrator neutralizados (org/projeto do perfil, sem hardcode; front matter description includa). Blocos `azure-devops` do AGENTS.md local continuam por compatibilidade, mas a fonte de verdade do wizard passa a ser o perfil.
  2. **Poltica de concorrência:** nova§ 10 no CONSTITUTION.md do <docs-repo> (atomicidade por tema; pull --ff-only antes de push; >1 dev no mesmo módulo = branch+PR; pós-merge de mudação na DAG exige gm-wiki-lint + gm-validate; numeração de RNs por módulo com lock lgico).
  3. **PERMISSIONS.md:** matriz agent x permissões com justificativa e status na raiz da config; correes de menor privilgio: @gm-devops edit/write deny; bash allow -> ask (git read-only) em azure/dev/devops/github-orchestrator; vps-setup/vps-troubleshoot confirmados guided (conforme); primaries e executores dev intocados.
  4. **MANIFEST de integridade:** gm-self-publish regenera MANIFEST.sha256 (sha256 dos arquivos versionados, paths relativos) e commita antes do push; gm-self-update verifica os hashes aps o pull e reporta divergências como warning listado (nunca auto-corrigido).
- **Arquivos:** rules/client-profile.template.md (novo), rules/client-profile.md (novo, gitignored), .gitignore, AGENTS.md (lazy index), skills/gm-setup/SKILL.md, skills/gm-azure-setup/SKILL.md, agents/gm-azure-orchestrator.md, agents/gm-devops.md, agents/Golmet-{azure,dev,devops,github}-orchestrator.md, PERMISSIONS.md (novo), skills/gm-agent-health-monitor/SKILL.md (Verificao H), skills/gm-self-publish/SKILL.md, skills/gm-self-update/SKILL.md, evals/{gm-azure-setup,gm-self-publish,gm-self-update}/fixture-*/criteria.yaml; CONSTITUTION.md do <docs-repo> (§ 10).
- **Status:** aplicada

### Sub-iteração 1 (18/10/2026) — 3ª auditoria de saúde: neutralidade, MANIFEST, COMPLIANCE.md, detect-onboarding, PERMISSIONS

- **Data:** 18/10/2026
- **Origem:** 3ª auditoria de saúde do workflow (`gm-agent-health-monitor`); correções executadas pelo `@gm-workflow-improver` como sub-iteração da IMP-103 (não é IMP nova).
- **F1 (alto) — neutralidade cliente em 4 pontos vivos:** (a) bloco `azure-devops` do AGENTS.md sem valores do cliente — referencia `rules/client-profile.md` (IMP-103); marcadores `<!-- azure-devops -->` mantidos (compat gm-setup); (b) description do `gm-azure-setup` no registry.yaml → "org/projeto do perfil do cliente (rules/client-profile.md)"; (c) view E do ARCHITECTURE.md re-renderizada a partir do registry; (d) `gm-azure-workitem-creator`: defaults apontam ao perfil e tabela de parâmetros com placeholders `<org-do-perfil>`/`<projeto-do-perfil>`. Validação: `git grep -i` <setor>/PRJ.AMA com hits restritos a WORKFLOW_IMPROVEMENTS.md (histórico) e evals/ (fixtures/reports — histórico de teste); 0 hits em skills/, agents/, registry, views, PERMISSIONS; AGENTS.md (gitignored) com 0 hits; `rules/client-profile.md` segue gitignored.
- **F2 (médio) — MANIFEST.sha256 com 19 labels corrompidos (`?`):** causa raiz: regeneração anterior com `Out-File -Encoding ascii` (mangle não-ASCII → `?`). Regenerado com `[IO.File]::WriteAllLines` + `UTF8Encoding($false)`, `[Console]::OutputEncoding` UTF-8, `git -c core.quotepath=false`, unescape octal e `-LiteralPath` nos hashes: 834/834 entradas (= `git ls-files`), 0 `?`, paths com em-dash/acentos intactos (ex.: "RN-030 — Cadastro de Ordens de Serviço"), amostra de 5 hashes confere. `gm-self-publish` Passo 3.7 reforçado: proibição explícita de `Out-File -Encoding ascii` com o bug como evidência.
- **F3 (baixo) — COMPLIANCE.md ausente em 4 listas IMP-011:** adicionado à lista de specs de `gm-restructure` (mapeamento canônico IMP-011), `gm-stack-rust` (passo 3 do Algoritmo), `gm-stack-dotnet-csharp` e `gm-stack-java-quarkus` ("Artefatos de spec Golmet") — mesma linha canônica das outras 29 skills.
- **F5 (baixo) — delta views↔registry (detect-onboarding):** a skill É invocada no 1º turno pelos primaries (citada nos 4 .md) → registrada no `invokes_direct` de gm-req/gm-doc/gm-dev/gm-devops no registry.yaml (realidade > view); views coerentes pós-render.
- **F6 (baixo) — PERMISSIONS.md:** linha do `gm-github-orchestrator` alinhada ao front matter: "gh-issue-creator e gh-pr-creator + próprio md (gh-setup fora do allow)".
- **F4 (baixo) — residual de seções (formato canônico Lê/Gera/Nunca edita) em 6+ skills:** PENDENTE documentado — correção cosmética posterior, skill a skill, em sub-iteração futura; não bloqueia.
- **Arquivos:** AGENTS.md, registry.yaml, ARCHITECTURE.md, PERMISSIONS.md, skills/gm-azure-workitem-creator/SKILL.md, skills/gm-self-publish/SKILL.md, skills/gm-restructure/SKILL.md, skills/gm-stack-rust/SKILL.md, skills/gm-stack-dotnet-csharp/SKILL.md, skills/gm-stack-java-quarkus/SKILL.md, MANIFEST.sha256 (regenerado).
- **Status:** aplicada (sub-iteração da IMP-103)

## IMP-104 - Migração da fonte de dados do gm-perf-auditor para o schema v2 do OpenCode (node:sqlite)

- **Data:** 18/10/2026
- **Alvo:** gm-perf-auditor (SKILL.md + scripts)
- **Origem:** breaking change OpenCode v2.0.26 — o CLI removeu o subcomando opencode db (evidência: ERROR Unrecognized flag: --format), quebrando o coletor oficial get-perf-metrics.ps1. Solução node:sqlite validada em produção por coletor emergencial (9.675 turnos; relatório quality/PERF_REPORT_2026-10-18-0230.md).
- **Problema:** a única fonte de dados da skill era opencode db — inexistente no v2; a skill não coletava nada.
- **Causa raiz:** dependência de CLI interno removido upstream.
- **Correção:** (1) coletor oficial v2 scripts/get-perf-metrics-v2.mjs (ESM, node:sqlite DatabaseSync readOnly, Node >= 22.5): interface --days/--top-slow/--runaway-tok-in/--out-file, mesmo contrato JSON (+rollup_099, cutoff_ms), invariantes mantidos (nearest-rank, dedupe IMP-062, bloat >=4 turnos, IMP-099, wall-clock >10min etiquetado, UTF-8 sem BOM, read-only absoluto); detecção v1/v2 via sqlite_master — banco v1 sai com exit 2 orientando o fallback .ps1; correção sobre o emergencial: 1ª resposta = latência até a CONCLUSÃO (p50 11,6s vs 24ms sem valor antes), user/assistant pela coluna type. (2) get-perf-metrics.ps1 mantido como fallback v1. (3) SKILL.md atualizada (fonte v2/v1, tools, algoritmo, queries, fórmulas, casos de borda). (4) fixture-003 nova (12 checks) com cópia byte-idêntica do script.
- **Arquivos:** skills/gm-perf-auditor/SKILL.md, scripts/get-perf-metrics-v2.mjs (novo), scripts/get-perf-metrics.ps1 (fallback), evals/gm-perf-auditor/fixture-003/ (novo).
- **Validação:** script v2 --days 7 contra DB real: exit 0, has_data=true, 9.006 turnos / 139 sessões (dedupe removeu 669 de forks), p50 7.724ms / p95 80.515ms / verdict WARNING, interaction.samples_first=392 (p50 11.605ms), rollup 24 features / 0 unmapped — coerente com o relatório de 18/10 (p95 ~78-80s WARNING). UTF-8 sem BOM em todos os arquivos (hash da cópia da fixture = hash do script).
- **Status:** aplicada — requer reiniciar o OpenCode (config não é hot-reloaded).

## IMP-105 - Migração core+packs: desacoplamento do conteúdo <org>/<setor> (base licenciável)

**Data:** 18/10/2026
**Origem:** Objetivo de licenciamento do Golmet para outras empresas/times; auditoria de desacoplamento (18/10) mapeou menções <org>/<setor> na base publicada.
**Status:** ✅ Aplicado

### Problema

A base publicada (`~/.config/opencode/`) misturava invariante de método com conteúdo de organização: AGENTS.md versionado com bloco <org> e paths locais, skills DevOps/GitHub/init/intake com org/registry/DNS/canal/OS/tracker hardcoded, runbooks com valores da org embutidos e perfil de cliente sem campos de infraestrutura. Qualquer outro time herdaria a identidade <org> ou teria que caçar menções à mão.

### Princípio

A base publicada fica 100% neutra: org/registry/DNS/canal/OS/tracker vêm de `rules/client-profile.md` (IMP-103) ou de `question` agrupada quando ausente. O conteúdo <org> migra para o pack lazy `rules/<org>.md` (referenciado, nunca duplicado). Histórico (WORKFLOW_IMPROVEMENTS, evals, MANIFEST) NÃO é alvo — menções como evidência/teste são aceitáveis.

### Correções Aplicadas (4 frentes)

| Frente | Arquivo | Mudança |
|---------|---------|---------|
| F1 | `AGENTS.template.md` (NOVO) | Template versionado e NEUTRO do AGENTS.md — blocos marcadores (`<!-- azure-devops -->`, `<!-- org-pack -->` (renomeado de `<org>`), `<!-- projeto-padrao -->`, `<!-- gm-docs-repo -->`) com placeholders `<preenchido pelo gm-setup>` |
| F1 | `AGENTS.md` | Untracked (`git rm --cached`) — nasce do template + client-profile em cada máquina. **Migração pós-update:** máquinas antigas terão o AGENTS.md DELETADO pelo pull (estava versionado) → rodar `gm-setup` para recriar o local |
| F1 | `gm-setup/SKILL.md` | Passo 3 cria/repara o AGENTS.md a partir de `AGENTS.template.md` + client-profile; bloco `org-pack` só quando o cliente tiver pack |
| F1 | `gm-self-update/SKILL.md` | Caso de borda: pull que deleta o AGENTS.md (saída do versionamento) → avisar "execute gm-setup", nunca recriar por conta própria |
| F2 | `rules/<org>.md` (NOVO) | Pack lazy da organização: §1 identidade/repos, §2 unidade-produto, §3 setores (<setor> PRJ.*), §4 valores de perfil <org>, §5 §infra-cicd + §6 §infra-vps-setup + §7 §infra-observability (runbooks MOVIDOS, não duplicados) |
| F2 | `rules/<org>-produto.md` | Stub de 2 linhas apontando pro pack (mantido por compatibilidade do lazy-load IMP-048) |
| F2 | `rules/<cliente>-postgres.md` → `rules/projeto-<cliente>.md` | Renomeado — padrão de regra de PROJETO, não de empresa; índice atualizado |
| F2 | `rules/stack-templates.yaml` | Campo `boilerplate_org` (do client-profile); `.NET.boilerplate` = `<boilerplate_org>/Boilerplate.NET-API`; exemplo <org> comentado |
| F3 | `gm-cicd-workflow` | SKILL = fluxo neutro (build → registry do perfil → ssh-action → deploy.sh); runbook movido pro pack §infra-cicd |
| F3 | `gm-vps-setup` | Fases neutras; OS (`infra_os`), e-mail (`deploy_email`), domínio (`dns_domain`), canal (`alert_channel`), registry = perfil; runbook movido pro pack §infra-vps-setup |
| F3 | `gm-vps-troubleshoot` | SKILL + runbook MANTIDOS na skill (sintomas 100% genéricos — decisão), neutralizados (`<org>.net.br` → `<dns_domain do perfil>`); lições de produção no pack |
| F3 | `gm-observability` | Canal = parâmetro (`alert_channel: telegram|slack|email`); receita Telegram movida pro pack §infra-observability (exemplo do perfil <org>); runbook movido |
| F3 | `gm-devops.md`, `gm-devops-orchestrator.md`, `gm-github-orchestrator.md`, `gm-azure-orchestrator.md` | Identidade neutra — infra/org/tracker do perfil |
| F3 | `gm-gh-setup` | Org do perfil (`org_github`) |
| F3 | `gm-self-publish`, `gm-self-update` | Remote derivado de `git remote get-url origin` — zero hardcode de org/repo |
| F3 | `gm-init` | Sponsor/cliente/remote com placeholders `<CLIENTE>`/`<ORG>` do perfil |
| F3 | `gm-project-intake` | `<docs-repo>` → `repo_docs` do perfil (exemplos <cliente> permanecem ilustrativos) |
| F3 | `rules/client-profile.template.md` + `client-profile.md` | Novos campos: `org_github`, `ghcr_registry`, `dns_domain`, `deploy_email`, `alert_channel`, `infra_os`, `tracker_repos`, `boilerplate_org`, `repo_docs`, pack da organização; local preenchido com valores <org> |
| F4 | `registry.yaml` | Descrições dos componentes tocados neutralizadas; views re-renderizadas (ARCHITECTURE.md) — saneamento de mojibake Latin-1 no ARCHITECTURE.md |
| F4 | `README.md` | Branding <org> MANTIDO (decisão: o repo da config é da <org>; a neutralidade exigida é da BASE — skills/agents/registry — não do README do dono do repositório) |
| F4 | `gm-requirements`, `gm-stack-angular`, `gm-stack-boilerplate` | LEVE: evidência <cliente> → genérica; título "PRJ" → neutro; "convenções <org>" → `boilerplate_org` do perfil. Demais exemplos ilustrativos permanecem |
| F4 | evals (cicd, vps-setup, gh-setup, observability) | Fixtures alinhadas (criteria descrevem registry/org/canal como parâmetros do perfil) — alinhamento IMP-105, não regressão |

### Migração pós-update (AGENTS.md)

Máquinas que rodarem `gm-self-update` após esta publicação: o AGENTS.md (antes versionado) será **deletado** pelo pull. Ação: rodar `gm-setup` — ele recria o AGENTS.md local a partir de `AGENTS.template.md` + `rules/client-profile.md`. O `gm-self-update` avisa explicitamente (caso de borda documentado).

### Notas de encoding

Durante o render do ARCHITECTURE.md foram encontradas 61 ocorrências de mojibake Latin-1 pré-existente (em-dash e acentos duplo-codificados); saneadas para UTF-8 na mesma passada.

---

## IMP-106 — Consistência arquitetural pós-análise: Quadri Golmet, prefixo `Golmet-` universal, domínios do registry e runner de evals

**Data:** 18/10/2026
**Origem:** Análise arquitetural read-only da config (sessão de 18/10/2026) com 7 achados + 2 descobertos durante a implementação
**Status:** ✅ Aplicado

### Problema

1. **Tríade × Quadri:** registry/ARCHITECTURE tratavam o workflow como Quadri (4 primaries), mas README, GLOSSARY, footers de docs vivos e o roteamento entre primaries diziam "Tríade" — o `gm-devops` não existia para quem lia os docs vivos.
2. **ADR-014 duplicado:** "Glossário de Negócio" (linha 302) e "Tríade de Primary Agents" (linha 368) compartilhavam o número; ROADMAP R-016 referencia o primeiro.
3. **Domínio flat divergente no registry:** `gm-task-spec`, `gm-howto`, `gm-perf-auditor` e `gm-skill-evolution` com `domain:` que não batia com `domains.*.skills` (tradução/documentacao/meta) — sem check de CI que pegasse isso.
4. **Skills registradas sem prefixo `Golmet-` e sem versionamento:** `mcp-figma-setup`, `mcp-playwright-setup`, `mcp-postgres-setup`, `split-commits-by-diff`, `sync-gsd-from-issues` e `typesafe-ai` eram registradas no registry; 4 delas fora do whitelist `!skills/Golmet-*/` do `.gitignore` — clone novo ficava incompleto e o check `registry:skills_registradas_tem_skill_md` falharia em máquina fresca.
5. **Render incompleto:** `gm-registry-render` não cobria `agents/gm-devops.md` (marcadores BEGIN/END_REGISTRY presentes mas fora dos alvos); aresta mermaid vazia (`TP --> ` de self-invoke); numeração `### 5.x` da §5 fora de ordem de exibição; mojibake residual em header/footer e células da §5.
6. **Self-invoke inconsistente:** `gm-tasks-pending` (subagent) listava a si mesmo em `invokes:` — os 3 irmãos de duplo registro usam `invokes: []`.
7. **`@gm-jev-classifier` sem rota:** nó presente no grafo sem nenhuma aresta de delegação — nenhum primary o alcançava.
8. **Runner bash (descoberto na validação):** `frontmatter_valid` rejeitava `---\r\n` (6 falsos FAIL em fixtures com CRLF) e o parser de seções do modo registry não tolerava CRLF — `registry:skills_em_disco_registradas` falhava em falso localmente.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `registry.yaml` | 4 `domain:` normalizados (task-spec→traducao, howto→documentacao, perf-auditor/skill-evolution→meta); 6 ids renomeados com prefixo `Golmet-` (+ espelho em `domains.*.skills`); `gm-jev-classifier` adicionado ao `delegates` de gm-req/doc/dev; self-invoke do gm-tasks-pending → `invokes: []`; comentário Tríade→Quadri; 368 mojibake de separador saneados |
| `skills/` | 6 pastas renomeadas (`gm-mcp-figma-setup`, `gm-mcp-playwright-setup`, `gm-mcp-postgres-setup`, `gm-split-commits-by-diff`, `gm-sync-gsd-from-issues`, `gm-typesafe-ai`) — as 4 não versionadas passam a entrar pelo whitelist `!skills/Golmet-*/` sem tocar no `.gitignore` |
| SKILL.md das 6 | front matter `name:` + headings alinhados ao novo nome de pasta (CHECKLISTS) |
| `evals/` | fixture `mcp-postgres-setup/` → `gm-mcp-postgres-setup/` (git mv); `run-evals.ps1` sem caso especial de skill sem prefixo; `run-evals.sh` com check novo `registry:dominios_consistentes` (flat × `domains.*.skills`, duplo registro isento), parser tolerante a CRLF e `frontmatter_valid` aceitando `---\r\n` (alinhado ao ps1) |
| `ARCHITECTURE.md` | views atualizadas: JEV com arestas/contagens (15/11/13), aresta vazia removida, §5 renumerada em ordem de exibição, renames refletidos em §1/§2/§5/§6, mojibake de header/footer/células saneado, tasks-pending com `—` |
| `agents/gm-req.md`, `gm-doc.md`, `gm-dev.md` | tabela de subagents com linha `@gm-jev-classifier`; seção "Roteamento entre Primary Agents (Quadri Golmet)" com rota DevOps; refs de skill renomeada atualizadas |
| `agents/gm-dev-frontend.md`, `gm-figma-orchestrator.md`, `gm-workflow-builder.md`, `gm-progress.md`, `gm-onboarding-orchestrator.md` | refs renomeadas + Quadri |
| `README.md`, `GLOSSARY.md`, `CHECKLISTS.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `TROUBLESHOOTING.md` | "Tríade Golmet" → "Quadri Golmet" com `gm-devops` incluído; typo de referência duplicada no CONTRIBUTING corrigido |
| `DECISIONS.md` | ADR-014 duplicado renumerado → **ADR-017**; novo **ADR-018 — Quadri Golmet: Expansão com o Primary `gm-devops`**; footer Quadri |
| `skills/gm-registry-render/SKILL.md` | `agents/gm-devops.md` vira alvo (Lê/Gera/Passos 3-5); templates com 4 primaries; regras novas: duplo registro sem nó em L5, self-invoke → `—` e jamais aresta vazia, numeração §5 sequencial por exibição, UTF-8 sem BOM com saneamento de mojibake na passada |
| `WORKFLOW_IMPROVEMENTS.md` | título do IMP-103 com mojibake ("governaãa") corrigido |

### Decisões do operador (18/10/2026)

1. Skills de infra do próprio workflow recebem prefixo `Golmet-` (princípio ADR-002) — resolve o versionamento pelo whitelist existente, sem editar `.gitignore`.
2. `@gm-jev-classifier` entra como delegação dos primaries `gm-req`, `gm-doc` e `gm-dev`.
3. Renumerar o ADR-014 duplicado para ADR-017 e formalizar a Quadri no ADR-018 (ADRs antigos permanecem imutáveis como registro histórico).

### Validação

- ✅ `bash evals/run-evals.sh --all`: **772/772 PASS**, exit 0 (antes: 766/772 — 6 falsos FAIL de CRLF).
- ✅ `bash evals/run-evals.sh --registry`: **6/6 PASS**, exit 0 — inclui o novo check `registry:dominios_consistentes`.
- ✅ `powershell evals\run-evals.ps1 -Skill gm-task-spec`: 52/52 PASS (paridade bash × ps1).
- ✅ Grep de resíduos: zero referências de código a nomes antigos de skills; zero mojibake em `ARCHITECTURE.md`; zero arestas mermaid vazias; "Tríade" restante só em registros históricos (ADRs antigos e IMPs).
- ⚠️ Smoke de runtime: OpenCode resincronizou as 6 skills renomeadas (ids `Golmet-*` disponíveis; antigos descontinuados).

---

## IMP-107 — Blindagem do trends.json: parse com BOM nunca mais reseta o histórico

**Data:** 18/10/2026
**Origem:** 2ª análise arquitetural da config — detectado dano real causado pelos runs de validação do IMP-106
**Status:** ✅ Aplicado

### Problema

O runner bash (`run-evals.sh`) fazia `json.load(open(path, encoding="utf-8"))` no `trends.json`; o runner PS (`run-evals.ps1`) grava o mesmo arquivo com `Set-Content -Encoding UTF8`, que no PS 5.1 emite UTF-8 **com BOM**. Com BOM presente, o `json.load` explode → o `except Exception: trends = {}` do bloco python **resetava o histórico inteiro** e regravava só a entrada da execução corrente. Os 6 runs de validação do IMP-106 (18/10) destruíram 143 entradas acumuladas desde 21/09/2026 (8450 linhas → 26 linhas), e o estado destruído foi publicado no commit `202d360`.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/trends/trends.json` | Histórico restaurado de `HEAD~1` (143 entradas, 21/09 → 18/10 17:37Z) e BOM eliminado — arquivo regravado em UTF-8 sem BOM pelo próprio runner blindado |
| `evals/run-evals.sh` | Leitura com `utf-8-sig` (tolera BOM do twin PS); `FileNotFoundError` → dicionário vazio (primeira execução legítima); demais exceções de parse → **aborta sem escrever** (nunca mais reseta o histórico); `datetime.utcnow()` (deprecado) → `datetime.now(timezone.utc)` |

O twin PS já era seguro (`try/catch` com aviso, sem escrita em falha) — intocado.

### Validação

- ✅ `bash evals/run-evals.sh --all`: **772/772 PASS**, exit 0 — e o trends saiu com **144 entradas** (histórico preservado + entrada nova), BOM `False`.
- ✅ Cadeia causal reproduzida e documentada: BOM (PS 5.1) × `json.load(utf-8)` × `except: trends = {}`.
- ⚠️ Precedente registrado: runners que fazem merge de estado acumulado devem ser fail-closed — erro de parse aborta a escrita, nunca zera a base.

---

## IMP-108 — Lote 2 da análise arquitetural: rotas legitimadas, §7/§8, cobertura de evals 76/76 e retenção de relatórios

**Data:** 18/10/2026
**Origem:** 2ª análise arquitetural da config (5 achados em aberto pós-IMP-107)
**Status:** ✅ Aplicado

### Problema

1. **Drift View G × registry delegates:** as tabelas de subagents de `gm-doc.md` (12 linhas) e `gm-dev.md` (14 linhas) listavam `@gm-compliance-orchestrator` e `@gm-azure-orchestrator` sem correspondência no `delegates:` do registry — views internas divergentes entre si (tabelas × ARCHITECTURE §3).
2. **README §Versionamento:** escopo factualmente desatualizado (listava 6 itens; o repo trackea 857+ arquivos).
3. **ARCHITECTURE §7/§8 fantasmas:** o sumário linkava "Regras de inferência" e "Fluxo de artefatos (DAG)" — seções inexistentes.
4. **Bloat de `evals/reports/`:** 278 arquivos versionados (~32% do repo), full-runs de ~84 KB cada.
5. **5 skills sem fixture de eval** (as renomeadas no IMP-106): cobertura de regressão incompleta (71/76).

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `registry.yaml` | Rotas legitimadas no `delegates:` (precedente IMP-070): gm-doc + `gm-compliance-orchestrator`; gm-dev + `gm-azure-orchestrator` — tabelas e views convergem |
| `ARCHITECTURE.md` | Views §1-§3 atualizadas (contagens 12/14, arestas `& COMPO`/`& AZUREO`); **§7 Regras de inferência** e **§8 Fluxo de artefatos (DAG)** escritas (narrativas fora do bloco gerado, como manda o render) |
| `agents/gm-dev.md` | Texto client-specific `(repos PRJ.*/PRJ.*)` neutralizado → "(repos do tracker do perfil — IMP-105)" |
| `README.md` | §Versionamento reescrita com o escopo real de versionamento. Nota de honestidade: o "mojibake" apontado na análise era **artefato de leitura** (UTF-8 lido como CP1252) — verificado em 3 níveis (ripgrep, decodificação, bytes crus): o arquivo já era íntegro; só o escopo foi corrigido |
| `evals/reports/` | Retenção top-3 por tipo: **278 → 176 arquivos** (102 `git rm`; histórico recuperável via git; 35 arquivos de 18/10 intocados) |
| `evals/gm-mcp-figma-setup/`, `gm-mcp-playwright-setup/`, `gm-split-commits-by-diff/`, `gm-sync-gsd-from-issues/`, `gm-typesafe-ai/` | 5 fixtures novas (fixture-001, 7-8 checks cada) — **cobertura de evals fecha em 76/76 skills** |

### Decisões do operador (18/10/2026)

- Rotas extras das View G legitimadas no registry (não removidas das tabelas) — a tabela documenta o que o primary realmente invoca.
- Retenção de relatórios no próprio repo (top-3 por tipo) — o histórico git já é o arquivo frio; sem espelho em <docs-repo>.
- Execução em 4 subagents paralelos com partições de arquivos disjuntas (IMP-043/R3); MANIFEST, IMP e commit serializados no primary.

### Validação

- ✅ `bash evals/run-evals.sh --all`: **810/810 PASS**, exit 0 (772 + 38 checks das 5 fixtures novas).
- ✅ `bash evals/run-evals.sh --registry`: **6/6 PASS** (rotas legitimation refletidas nas views).
- ✅ Fixtures individuais: 8/8, 8/8, 7/7, 8/8, 7/7 PASS.
- ✅ `trends.json`: BOM `False`, append funcionando (fail-closed do IMP-107) — 150+ entradas preservadas.
- ✅ README: grep de mojibake 0; 6 seções `##` preservadas; escopo conferido contra `git ls-files`.

---

## IMP-109 — Lote 3 da análise arquitetural: conformidade CHECKLISTS 76/76, errata ADR-018 e higiene de gitignore

**Data:** 18/10/2026
**Origem:** 3ª análise arquitetural da config (3 achados, nenhum estrutural)
**Status:** ✅ Aplicado

### Problema

1. **7 skills fora do padrão de seções da CHECKLISTS.md**, em dois graus: (a) heading não-canônico com conteúdo existente — `gm-agents-md-sync` (`## Lê`/`## Gera` sem os sufixos `(upstream)`/`(downstream)`) e as 3 mcp-setup com seção combinada `## Lê / Gera / Nunca edita`; (b) seções ausentes — as 3 skills herdadas em inglês (`gm-split-commits-by-diff`, `gm-sync-gsd-from-issues`, `gm-typesafe-ai`) sem estrutura Golmet nenhuma.
2. **Imprecisão textual no ADR-018** (introduzida no IMP-108): "permissão ampla no mesmo padrão da Tríade original" descreve mal o `gm-devops`, que é deliberadamente `edit/write: deny` (modo guiado — IMP-103, PERMISSIONS.md §Primary status "ajustado").
3. **`cli.json`/`service.json`** untracked e fora do `.gitignore` — ruído permanente no `git status`.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `gm-agents-md-sync` | Headings renomeados para o canônico (`## Lê (upstream)`, `## Gera (downstream)`); conteúdo intacto |
| 3× `gm-mcp-*-setup` | Seção combinada dividida nas 3 canônicas, redistribuindo os bullets existentes |
| 3× skills herdadas | 4 seções canônicas em PT-BR adaptadas à natureza de cada uma (split-commits: Lê=git status/diff, Gera=commits atômicos; sync-gsd: Lê=issues via gh + `.planning/`, Gera=INDEX/PLAN; typesafe-ai: consultiva, não persiste artefato) — corpo original preservado |
| `DECISIONS.md` | **Errata** no ADR-018 (acrésimo, sem reescrita — política de imutabilidade respeitada): gm-devops mantém escopo do IMP-103; decisão da Quadri inalterada |
| `.gitignore` | `cli.json` + `service.json` ignorados |

### Validação

- ✅ Conformidade estrutural: **76/76 skills** com as 4 seções canônicas (`## Lê (upstream)`, `## Gera (downstream)`, `## Nunca edita`, `## Modo de erro`), cada heading exatamente 1× por arquivo, UTF-8 sem BOM.
- ✅ `bash evals/run-evals.sh --all`: **810/810 PASS**, exit 0.
- ✅ DECISIONS.md: 18 headings `## ADR-` antes == depois (errata é bullet, não nova entrada); `git status` sem `??` para cli/service; `git check-ignore` cobre ambos.
- Execução: 2 subagents paralelos com arquivos disjuntos (7 SKILL.md × DECISIONS/.gitignore); validação e publicação serializadas no primary.

---

## IMP-110 — gm-setup trata skill opcional de pack como pendência não bloqueante (IMP-080)

**Data:** 18/10/2026
**Origem:** 4ª análise arquitetural da config — única violação real de referência órfã (varredura determinística: 39 hits triados, 38 falsos positivos)
**Status:** ✅ Aplicado

### Problema

O `gm-setup` referenciava uma skill opcional de pack como passo real (3 pontos: visão geral, Tools e o Passo 5 com instrução **incondicional** "carregue e aguarde a conclusão") + front matter `description:` — mas a skill não existe na base, registry ou runtime (resíduo do desacoplamento IMP-105; deve viver em pack). O `@gm-onboarding-orchestrator` já documentava o padrão correto: "podem não existir na config — trate como ⚠️ pendência, nunca como falha bloqueante".

### Correções Aplicadas

| Local | Mudança |
|-------|---------|
| `skills/gm-setup/SKILL.md` (description) | Delegação à skill opcional marcada como condicional ("quando presente na instalação — skill de pack opcional, IMP-105") |
| `skills/gm-setup/SKILL.md` (Tools) | Idem |
| `skills/gm-setup/SKILL.md` (Passo 5) | Ramo "Sim" agora **verifica a existência** da skill: existe → carrega e aguarda; não existe → registra ⚠️ pendência (padrão do onboarding-orchestrator, IMP-080) e segue para o Passo 5b |

### Validação

- ✅ 4/4 referências restantes com hedge/condicional (a 4ª, no template de relatório, já era "pendência opcional").
- ✅ `bash evals/run-evals.sh --skill gm-setup`: **8/8 PASS**.
- Runtime: OpenCode resincronizou a description com o hedge na mesma sessão.

---

## IMP-111 — Fase 1 Open Core: neutrality gate, contratos Core/Pack/Profile e installer de packs

**Data:** 20/10/2026
**Origem:** Remodelagem arquitetural decidida com o operador (open core Apache-2.0+DCO; separação CORE/PACK/PROFILE; plano em `.opencode/plan/gm-open-core-fase-1.md`)
**Status:** ✅ Aplicado

### Decisões congeladas

Open core **Apache 2.0 + DCO** (sem CLA); por empresa **2 repos** — CORE (público, neutro) + PACK privado (instalável `provides` + acúmulo `patterns/metrics/retros` nunca instalado; <docs-repo> aposentado na Fase 2); runtime em 1 raiz (`packs/<id>/` aninhado gitignored + instalados por cópia + `.Golmet/sources.yaml` como lockfile de pin); pack **nunca sobrescreve** path do core; `requires-core` validado com `BREAKING-CHANGES.md`; `.gitignore` é convenção → **pre-push hook** cobre o `git add -f` acidental.

### Correções Aplicadas

| Entrega | Conteúdo |
|---------|----------|
| **Neutrality gate** (primeira entrega) | `evals/neutrality/scan.sh` (escopo fechado: agents/skills/registry/stack-templates/AGENTS.template/evals; exclusões documentadas: histórico IMP/ADR, quality, reports, trends, golden-human, pack da org — migra Fase 2); flag `--neutrality` no runner; step novo no CI ANTES dos evals; pre-push hook versionado (`evals/neutrality/git-hooks/pre-push`, instalação via `core.hooksPath` no gm-setup) |
| **Sanitização** | **202 hits em 90 arquivos** generalizados com placeholders neutros (<org>→Acme, orgao cliente→<setor>, <cliente>→<cliente>, prefixo interno→PRJ, <cliente>→"projeto legado", <docs-repo>→`<REPO_DOCS>`, `rules/<org>.md`→`rules/<pack-da-organizacao>.md`) — input/criteria/output-expected das fixtures mantidos consistentes |
| **Schemas** | `PACK_SCHEMA.md` (contrato pack.yaml v1: id/version/requires-core/provides/acumulo + contrato do installer) · `BREAKING-CHANGES.md` · `.Golmet/sources.yaml` documentado como lockfile |
| **Installer** | `gm-setup` ganha Passo 6b (packs do perfil: clone → requires-core → no-override → cópia de `provides` → pin em sources.yaml → gitignore gerado; falha isolada não bloqueia) e 6c (hardening: `core.hooksPath` com checagem prévia) |
| **Skill nova** | `gm-pack-update` (meta, 77ª skill): pull dos clones, respeita o pin (só move sob pedido explícito), valida compat, reinstala `provides`, reporta delta |
| **Docs** | README `## Open Core` (+1 seção) e convenção de regras de projeto no produto; ROADMAP ganha Fase 2 planejada (F2-001..003, F3-001..002, F4-001) |
| **Resíduos** | `rules/projeto-<cliente>.md` migrada para `<cliente>/.opencode/rules/` do produto (git rm no core); índice lazy do AGENTS.md local atualizado; exemplo dos creators padronizado (`gm-coverage-audit`) |

### Validação

- ✅ `bash evals/neutrality/scan.sh`: **OK (573 arquivos varridos)** após sanitização; selftest de injeção falha/passa corretamente; hook de pre-push bloqueia árvore contaminada.
- ✅ `bash evals/run-evals.sh --all`: **810/810 PASS** (sanitização não quebrou fixtures).
- ✅ `bash evals/run-evals.sh --registry`: **6/6 PASS** (gm-pack-update resolve em domains.meta).
- ✅ 77ª skill com 4 seções canônicas, sem BOM; render das views atualizado (L5=77, Meta=14).

### Pendências Fase 2 (ROADMAP F2-001..003)

Extrair `rules/<org>.md` + runbooks para o repo do pack; migrar acúmulo do <docs-repo> para `acumulo/` e aposentar o repo; ativar installer no perfil.

---

## IMP-112 — Fase 2 Open Core: pack <pack-repo> criado, acúmulo migrado e core renomeado

**Data:** 20/10/2026
**Origem:** Execução da Fase 2 do plano open core (após IMP-111)
**Status:** ✅ Aplicado

### Descoberta material (ajuste de escopo)

O inventário do <docs-repo> revelou que ele **não é só acúmulo**: é o **workspace de produtos** da org (15 produtos com specs/analysis/delivery/glossaries — <cliente>, <cliente>, <cliente>, <cliente>, <produto-ui>, <produto-hub>, <cliente> etc.). A aposentadoria do repo prevista no plano foi **CANCELADA** — o docs repo continua vivo como workspace de produtos. Só o **acúmulo** (patterns/metrics/reverses) migrou para o pack. Invariante do IMP-061 segue preservado (acúmulo fora do core).

### Entregas

| Entrega | Conteúdo |
|---------|----------|
| **Pack <pack-repo> criado** (privado, <org>) | `pack.yaml` v1.0.0 (requires-core `>=1 <2`; `provides: [rules/packs/<org>.md]`; `acumulo: [patterns/, metrics/, reverses/]`) · `rules/packs/<org>.md` (identidade + runbooks §infra-* ex-`rules/<org>.md`) · `acumulo/patterns/` (migrado do docs repo) · README |
| **Core: extração** | `rules/<org>.md` removido (`git rm`); scanner comenta instalados de pack como fora de escopo (nota futura: excluir skills de pack instaladas via `sources.yaml`) |
| **Perfil** | `client-profile.md` ganha `packs: [<org>@^1]` + `pack_repos`; template documenta os campos; `repo_docs` re-rotulado como workspace de produtos |
| **Instalação real (Passo 6b)** | clone em `packs/<org>/` · `provides` instalado em `rules/packs/<org>.md` · `.Golmet/sources.yaml` com pin `58f155c` · `.gitignore` com seção gerada (`packs/`, `rules/packs/`, `.Golmet/`) · **core.hooksPath ativo** (pre-push neutrality) |
| **Escritoras → acumulo** | `gm-metrics-collector` (`acumulo/metrics/`), `gm-pattern-extractor` (`acumulo/patterns/`), `gm-perf-auditor` (redação), `gm-reverse-orchestrator` (front matter write → `acumulo/reverses/`), `PERMISSIONS.md`, `AGENTS.template.md` (bloco `gm-docs-repo` → `gm-pack-acumulo`) — 8 exemplos concretos generalizados para `<pack-ativo>` (pego pelo próprio gate) |
| **Rename** | core `<config-repo>` → **`<core-repo>`** (gh rename; remote atualizado; README título) — refs históricas em IMP/ADR mantêm o nome antigo (imutáveis) |
| **AGENTS.md local** | índice lazy aponta `rules/packs/<org>.md`; bloco `gm-pack-acumulo` no lugar de `gm-docs-repo` |

### Validação

- ✅ `neutrality`: **OK (573 arquivos)** — após extração e generalização dos 8 exemplos `<pack-ativo>`.
- ✅ `--all`: **810/810 PASS** · `--registry`: **6/6 PASS**.
- ✅ Pack instalado: `rules/packs/<org>.md` presente; `sources.yaml` pin `58f155c`; `hooksPath` ativo.
- ℹ️ <docs-repo> permanece vivo (workspace de produtos); `_docs/patterns/` antigo fica como cópia histórica — escritoras agora gravam no `acumulo/` do pack.

---

## IMP-113 — Fase 3 Open Core: LICENSE Apache-2.0, DCO, guia de contribuição e primeira release pública (gm-core)

**Data:** 20/10/2026
**Origem:** Fase 3 do plano open core (decisões: snapshot em repo público `gm-core`; subset essencial; IMP/ADR/quality privados)
**Status:** ✅ Aplicado

### Modelo de publicação (resolvido por construção)

Desenvolvimento continua no `<core-repo>` (privado, com histórico IMP/ADR). Releases públicas são **snapshots limpos do subset essencial** publicados no repo **público `<org>/gm-core`** — o público não contém histórico interno, o que elimina a sanitização de histórico prevista (F3-002 resolvida por construção). Externos contribuem via PR no `gm-core` com **DCO** (sign-off, sem CLA) + neutrality gate; mantenedores portam para o interno e publicam a próxima release.

### Entregas

| Entrega | Conteúdo |
|---------|----------|
| `LICENSE` | Apache-2.0 canônico completo, `Copyright 2026 <org>` |
| `CONTRIBUTING.md` | Seções novas no topo: modelo open core, fluxo de contribuição externa, **checklist objetivo de anonimização** (clientes/orgs/produtos, URLs/e-mails, pessoas, números de processo/CNPJ, codinomes/PREFIXOS de repo, rede/credenciais, marca, datas+fatos) e **DCO** (`git commit -s`; certificação developercertificate.org) |
| `PUBLISH.md` | Processo de release: pré-condições (evals verdes + neutrality OK + MANIFEST), subset essencial explícito, regras (gate vermelho aborta; IMP/ADR/quality/reports/trends/golden-human/client-profile/packs nunca entram), tag `vYYYY-MM-DD` no público |
| `publish/publish-core.sh` | Release determinístico: monta copy do subset em tmpdir → **roda o neutrality scan dentro do copy** (falha aborta sem publicar) → espelha no clone de `gm-core` → commit `release: snapshot <core-repo>@<sha> (<data>)` → push |
| **Primeira release** | `<org>/gm-core` criado **PÚBLICO**; snapshot `af3da4a` (`<core-repo>@9f08538`, 584 arquivos) publicado em `main` |
| README/ROADMAP | README §Open Core documenta o modelo e a LICENSE; ROADMAP F3-001/F3-002 → 🔴 Concluídas (20/10/2026) |

### Validação

- ✅ LICENSE canônico (Apache License / Version 2.0, January 2004 / Copyright 2026 <org>).
- ✅ `publish-core.sh` testado com target novo: scan OK dentro do copy, commit criado, idempotente na 2ª execução ("nada a commitar"); repositório público confirmado PUBLIC/main.
- ✅ Subset essencial no snapshot: 584 arquivos — sem IMP/ADR/quality/reports/trends/golden-human/client-profile/packs/MANIFEST.
- ✅ Greps: CONTRIBUTING com DCO + scan pré-PR; PUBLISH com a lista do subset.

### Notas

- `rules/stack-templates.yaml` (neutralização Acme do IMP-111) entrou neste lote — havia ficado sem staging no IMP-111.
- Fase 4 (`gm-pack-scaffold`) pendente — validará a genericidade do contrato `pack.yaml`.

---

## IMP-114 — Fase 4 Open Core: gm-pack-scaffold (onboarding de empresa) e genericidade do pack.yaml validada

**Data:** 20/10/2026
**Origem:** Fase 4 do plano open core — teste de fogo da genericidade do contrato
**Status:** ✅ Aplicado

### Entregas

| Entrega | Conteúdo |
|---------|----------|
| **Skill nova `gm-pack-scaffold`** (meta, 78ª) | Onboarding de nova organização: coleta agrupada (nome, id, org GitHub, repo — default `<org>.Golmet.PACK.<ID-MAIÚSCULO>`, visibilidade, regra) → esqueleto do pack 100% derivado do `PACK_SCHEMA.md` (pack.yaml v0.1.0, regra da org com seções-guia, `acumulo/` com READMEs) → `git init` + primeiro commit → repo remoto privado via `gh repo create` (sob confirmação) → registro no perfil `packs:`/`pack_repos` (sob confirmação) → instalação no runtime (no-override + pin no `sources.yaml` + gitignore gerado) |
| **Registry + views** | Skill registrada (domain meta) e views renderizadas (L5=78, Meta=15, §5.12/§6) |
| **ROADMAP** | F4-001 → 🔴 Concluída (20/10/2026) — **todas as 4 fases do open core concluídas** |

### Teste de genericidade (aceite da Fase 4)

Esqueleto para empresa fictícia "Nimbus" (id `nimbus`) derivável **inteiramente** do contrato + respostas do operador: zero nomes hardcoded, regra nasce como template de seções-guia, únicos insumos são `PACK_SCHEMA.md`, versão do core (para `requires-core`) e as respostas. **PASSA** — o `pack.yaml` não carrega suposição da <org>.

### Validação

- ✅ 4 headings canônicos + Tools/Workflow/Casos de borda, 1× cada, UTF-8 sem BOM.
- ✅ `neutrality`: OK (574 arquivos — skill nova no escopo, zero nomes de org).
- ✅ Runtime resincronizou a skill (`gm-pack-scaffold` disponível).

---

## IMP-115 — Lote de acabamento open core: runner robusto em clones frescos, ROADMAP atualizado, KNOWN_ERRORS e glossário

**Data:** 20/10/2026
**Origem:** Auditoria "faltou algo?" pós-Fase 4 — 6 pontas soltas, 5 mecânicas (fixture de skill interativa ficou como decisão à parte)
**Status:** ✅ Aplicado

### Problema

1. ROADMAP: F2-001..003 ainda 🟢 apesar de concluídas no IMP-112. 2. Runner de evals sem `mkdir -p` — em clone fresco (gm-core público), escrita de reports/trends falha silenciosamente (`set -u` sem `-e` engole; CI verde enganoso). 3. Quirk do push WSL no `publish-core.sh` ocorreu 2× sem registro em KNOWN_ERRORS. 4. `gm-setup` não substituía o placeholder `rules/<pack-da-organizacao>.md` ao regenerar o AGENTS.md. 5. GLOSSARY sem os termos da arquitetura nova.

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `ROADMAP.md` | F2-001/F2-003 🔴 Concluídas (IMP-112); F2-002 🔴 Concluída **ajustada** (aposentadoria do docs repo cancelada por descoberta de inventário) |
| `evals/run-evals.sh` | `mkdir -p reports/ trends/` antes da escrita — clones frescos e o repo público passam a persistir relatórios/trends de verdade |
| `KNOWN_ERRORS.md` (novo) | **KE-001**: push do `publish-core.sh` trava via WSL (credencial interativa) — workaround: push pelo lado Windows; fix definitivo pendente no script |
| `skills/gm-setup/SKILL.md` | `## Gera` documenta a substituição do placeholder `rules/<pack-da-organizacao>.md` pelo campo "Regra da organização" do perfil ao regenerar o AGENTS.md |
| `GLOSSARY.md` | Termos novos: **Acúmulo**, **Neutrality gate** (seção N), **Pack**, **sources.yaml** |

### Validação

- ✅ `neutrality` OK (574) · `--registry` 6/6 · `--all` 810/810 · runner grava reports/trends em diretórios recém-criados.
- ℹ️ Cobertura de evals: 76/78 skills (`gm-pack-update`/`gm-pack-scaffold` interativas sem fixture — desenho de fixture para skill com `question` fica como decisão à parte).

---

## IMP-116 — Padronização estrutural em inglês: `acumulo/` → `accumulation/` (pack v1.1.0)

**Data:** 21/10/2026
**Origem:** Revisão do operador — nomes estruturais (paths, campos de contrato) seguem o padrão em inglês; conteúdo/documentação permanece PT-BR
**Status:** ✅ Aplicado

### Problema

O diretório `acumulo/` e o campo `acumulo:` do `pack.yaml` estavam em português, quebrando a convenção estrutural do projeto (`agents/`, `skills/`, `evals/`, `provides`, `patterns/`... — todos em inglês).

### Correções Aplicadas

| Camada | Mudança |
|--------|---------|
| **Pack <pack-repo>** (v1.0.0 → **v1.1.0**) | diretório `acumulo/` → `accumulation/`; campo do contrato `acumulo:` → `accumulation:`; READMEs atualizados · commit `a20ae07` |
| **Contrato** | `PACK_SCHEMA.md` com `accumulation:`/`accumulation[]`; `BREAKING-CHANGES.md` anota o rename do campo (sem impacto no core instalado) |
| **Core (13 arquivos)** | skills escritoras (`metrics-collector`, `pattern-extractor`, `perf-auditor`, `pack-update`, `pack-scaffold`, `setup`), `agents/gm-reverse-orchestrator.md` (globs de write), `PERMISSIONS.md`, `AGENTS.template.md` (marcador `gm-pack-accumulation`), `PACK_SCHEMA.md`, `GLOSSARY.md`, `README.md`, AGENTS.md local — 134 ocorrências substituídas, **0 resíduo** |
| **Runtime** | `packs/<org>/` espelhado; `sources.yaml` repinado (`a20ae07`, v1.1.0) |

### Validação

- ✅ `neutrality` OK (574) · `--registry` 6/6 · resíduo `acumulo` = 0 no core e no pack.
- ℹ️ Histórico (IMP-111/112/114/115) mantém `acumulo/` como registro imutável — o nome vigente é `accumulation/`.

---

## IMP-117 — Fecho de pendências: cobertura de evals 78/78, KE-001 resolvido e teto do trends

**Data:** 21/10/2026
**Origem:** Fecho das 3 pendências conscientes listadas no IMP-116
**Status:** ✅ Aplicado

### Entregas

| Pendência | Resolução |
|-----------|-----------|
| **Fixtures das 2 skills interativas** | `evals/gm-pack-update/fixture-001/` (9 checks: pin movido 0.9.0→1.0.0, sources.yaml atualizado, DELTA.md, not_contains `--force`) e `evals/gm-pack-scaffold/fixture-001/` (9 checks: esqueleto Nimbus — pack.yaml com `accumulation:`, regra-guia com seções, READMEs do acúmulo). **Cobertura de evals: 78/78 skills** |
| **KE-001** (push WSL trava) | `publish-core.sh` com `GIT_TERMINAL_PROMPT=0` (nunca travar: falha fast), orientação de push pelo lado Windows com `wslpath -w`, linha de push no resumo, KNOWN_ERRORS → status resolvido |
| **trends sem teto** | merge do `run-evals.sh` trunca para as **200 entradas mais recentes** |

### Validação

- ✅ `--all`: **828/810+18 = 828/828 PASS**, exit 0 (18 checks novos das 2 fixtures).
- ✅ Fixtures individuais: 9/9 + 9/9 PASS.
- ✅ `--registry` 6/6 · `neutrality` OK (590 arquivos).
- ✅ Script de release: guard de push aplicado (KE-001).

---

## IMP-124 — Convenção `Golmet-<repo>-<action>`: renames gm-core-update/publish + nova gm-pack-publish (79ª skill)

**Data:** 21/10/2026
**Origem:** Decisão do operador — padronizar o ciclo de vida dos repositórios do open core (`Golmet-<repo>-<action>`) e fechar o gap de publicação do pack (opção B da discussão IMP-117)
**Status:** ✅ Aplicado

### Entregas

| Entrega | Conteúdo |
|---------|----------|
| **Renames** | `gm-self-update` → **`gm-core-update`** · `gm-self-publish` → **`gm-core-publish`** — pastas de skills, front matters, fixtures (`evals/gm-core-{update,publish}/`), registry (ids + domains.meta), refs vivas em 10 arquivos |
| **Skill nova `gm-pack-publish`** (meta, **79ª**) | Publica o pack da organização: valida working tree do clone `packs/<id>/`, commit + push (GIT_TERMINAL_PROMPT=0 — KE-001), reinstala `provides` (requires-core + no-override), move o pin do `sources.yaml`, reporta delta. **Teste de genericidade PASSA** — parametrizado por `<id>` do perfil, zero hardcode |
| **Convenção documentada** | README (Convenções) + registry: `Golmet-<repo>-<action>` — gm-core-update/publish (core), gm-pack-update/publish (packs) |

### Validação

- ✅ `grep gm-self-` escopo vivo: **0 ocorrências** (histórico IMP/DECISIONS/quality imutável mantém nomes antigos).
- ✅ `--registry` 6/6 (3 skills meta novas/renomeadas resolvem) · `--all` **828/828** · `neutrality` OK (591).
- ✅ Fixtures renomeadas: `gm-core-update` (manual SKIPPED) · `gm-core-publish` (3 PASS determinísticos).

### Nota

Refs históricas (63 em IMP/DECISIONS/quality) mantêm os nomes antigos — imutáveis por política (ADR-009). A convenção vale a partir do IMP-124.

---

## IMP-120 — Fase 5.1: modo core-only no gm-setup (adoção sem tracker/infra)

**Data:** 21/10/2026
**Origem:** Fase 5 (Adoção) — o `gm-setup` pressupunha ambiente <org> (tracker Azure, REPOSITORIES.md, stack mvn/ng/JDK), bloqueando o adotador externo
**Status:** ✅ Aplicado

### Problema

O wizard de primeira configuração pressupunha o ambiente da <org>: coletava defaults de Azure/repos `PRJ.*`/`PRJ.*` como obrigatórios, lia `<raiz>/<config-repo>/REPOSITORIES.md` (nome antigo do repo) e validava stack de dev (mvn/ng/JDK) — um adotador externo sem esse ambiente não completava o setup.

### Correções Aplicadas

| Mudança | Conteúdo |
|---------|----------|
| **Passo 0 — Perfil de adoção** | primeira `question` (agrupada com o diagnóstico): **core-only** (só o workflow — perfil com tracker/infra `<não configurado>`, pula Azure e validações de stack marcando "não aplicável") ou **completo** (fluxo integral). Sugestão automática de core-only quando o MCP azure-devops não está habilitado. Modo registrado no perfil |
| **Passo 2b** | core-only coleta só usuário + diretório + org_github (necessários para packs/gh); campos de tracker ficam `<não configurado — core-only>` |
| **Resíduos neutralizados** | `<config-repo>/REPOSITORIES.md` → opcional e genérico (só perfil completo); "repos PRJ" → "seus projetos"; `PRJ.*`/`PRJ.*` → `PROD.*` como exemplo genérico |
| **Validação de ambiente** | core-only valida só gh/git; completo mantém a suíte atual |

### Validação

- ✅ Front matter com os dois perfis; workflow com Passo 0 e fluxo atualizado.
- ✅ Resíduo "PRJ"/nome antigo de repo removido do skill; neutrality OK.
- ℹ️ Próximo da Fase 5: ensaio de instalação limpa (F5-003) seguindo o Getting Started do README — valida o core-only na prática.

---

## IMP-121 — `.gitignore` ancorado: fixtures fantasma trackeadas, fim do SKIP silencioso e convenção de fixtures manuais

**Data:** 21/10/2026
**Origem:** Revisão da estrutura de pastas — `.gitignore` com padrões sem âncora de raiz casavam em qualquer profundidade e engoliam arquivos de fixtures (que simulam runtimes)
**Status:** ✅ Aplicado

### Problema (crítico, com prova)

Padrões soltos (`AGENTS.md`, `packs/`, `.Golmet/`, `package.json`) capturavam **14 arquivos de fixtures** em qualquer profundidade: scaffold (6), pack-update (4), mcp-playwright (3), mcp-figma (1) — existiam só no disco, nunca versionados. Em clone fresco (CI, adotador, outro operador) o runner **pulava os checks silenciosamente** (sem `output-expected` → SKIPPED, não FAIL) — CI verde validando nada. A partir da próxima release o `.gitignore` (dentro do snapshot desde o IMP-118) propagaria o bug para o gm-core. A "cobertura 76/78" media pasta de fixture, não `output-expected` — 13 fixtures eram rubricas incompletas invisíveis.

### Correções Aplicadas

| Camada | Mudança |
|--------|---------|
| `.gitignore` | **Todos os padrões ancorados na raiz** (`/AGENTS.md`, `/packs/`, `/.Golmet/`, `/package.json`, `/plugins/`, ...); `evals/reports/` deixa de ser trackeado (operacional; trends mantém o histórico) |
| **Fixtures** | 14 arquivos trackeados (scaffold 9/9, pack-update 7/7, mcp-figma 4/4, mcp-playwright 6/6 — disco == git) |
| **Runner** | Guard novo: fixture com criteria, sem `output-expected` e sem marca = **FAIL** (nunca SKIP silencioso); convenção `mode: manual` → SKIPPED visível ("rubrica manual") |
| **13 fixtures** | Marcadas `mode: manual` — rubricas de revisão (checks `structural`/`semantic`) executadas por agente/humano contra a skill real |
| `evals/README.md` | Convenção de tipos de fixture (baseline / manual / module-mode) + dívida registrada |

### Validação

- ✅ `--all`: **823 PASS / 0 FAIL / 13 skipped (rubricas manuais visíveis no TOTAL)** — honesto antes e depois.
- ✅ Ancoragem: fixtures não ignoradas; runtime da org (`/packs/`, `/.Golmet/`, `/rules/packs/`) continua ignorado; `check-ignore -v` limpo.
- ✅ `neutrality` OK (590) · `--registry` 6/6.

### Dívidas registradas (evals/README)

1. Automatizar as 4 rubricas com checks parseáveis pendentes de `output-expected` (change-request/f002, self-publish, skill-eval, task-spec/f003). 2. Mojibake em títulos de fixtures antigas (ex.: change-request/f002) — corrigir ao automatizar. 3. KE-001 fix definitivo (push WSL) já resolvido no IMP-117; relançar release a cada lote pelo próprio script.

---

## IMP-122 — Guard anti-recorrência: fixture sob `.gitignore` aborta o runner

**Data:** 21/10/2026
**Origem:** Fecho do IMP-121 — o ancoragem resolve o caso conhecido, mas nada impedia um padrão futuro não-ancorado de recriar arquivos fantasma em silêncio
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `evals/run-evals.sh` | Guard no início de toda execução: `git status --porcelain --ignored -- evals` — qualquer arquivo ignorado sob `evals/` (exceto `evals/reports/`, operacional) = **ERRO + exit 1** com a lista e a orientação de correção |

### Validação

- ✅ Caminho normal: `--registry` 6/6 PASS, exit 0 (guard silencioso).
- ✅ Simulação de fantasma: regra temporária + arquivo não-trackeado sob `evals/` → **ERRO com o arquivo listado, exit 1**.
- ✅ Limpeza: regra removida → 6/6 PASS novamente.

---

## IMP-118 — `.gitignore` entra no subset público (primeiro item da Fase 5 — Adoção)

**Data:** 21/10/2026
**Origem:** Gap de adoção (P1): o clone do `gm-core` por um adotador externo nascia sem `.gitignore` — os primeiros runs (evals, packs) deixariam o runtime sujo de arquivos gerados
**Status:** ✅ Aplicado

### Correções Aplicadas

| Arquivo | Mudança |
|---------|---------|
| `publish/publish-core.sh` | `.gitignore` adicionado ao SUBSET |
| `PUBLISH.md` | tabela do subset atualizada |

### Validação

- ✅ Release `c55c87e` publicada: 602 arquivos rastreados, `.gitignore` presente no `gm-core` — o adotador clona o runtime já limpo (`evals/reports|trends`, `packs/`, `rules/packs/`, `.Golmet/`, `opencode.jsonc`, `AGENTS.md` locais ignorados).
- ℹ️ Fase 5 (Adoção) segue em aberto: Getting Started público, modo core-only no `gm-setup` e ensaio de instalação limpa.

---

## IMP-119 — README reescrito com foco no adotador (Getting Started público)

**Data:** 21/10/2026
**Origem:** Fase 5 (Adoção) — o README descrevia o modelo, mas o caminho de adoção misturava referências a repos privados e não tinha ciclo completo documentado
**Status:** ✅ Aplicado

### Problema

O README era escrito da perspectiva de quem desenvolve o Golmet: título com o nome do repo privado (`<core-repo>`), seção de versionamento com inventário de arquivos que **não existem no snapshot público** (WORKFLOW_IMPROVEMENTS, DECISIONS, quality/...) e sem um Getting Started — o adotador externo não tinha um caminho documentado de ponta a ponta.

### Correções Aplicadas

| Seção | Mudança |
|-------|---------|
| Título | repo-agnóstico: `Golmet — Workflow Golmet (Open Core)` (o nome do repo de desenvolvimento não é identidade pública) |
| **Getting Started (novo, primeiro)** | ciclo completo do adotador: clone do `gm-core` → primary via Tab → `gm-setup` → `gm-pack-scaffold` → primeiro fluxo (`gm-req`/`gm-doc`/`gm-dev`) → atualização por `git pull` — **sem citar nenhum repo privado** |
| Open Core / Releases | modelo snapshot documentado do ponto de vista do adotador (pull) e do contribuidor (PR + DCO + gate); inventário interno de arquivos removido — docs públicos citados são só os que existem no snapshot |
| Arquitetura | ASCII das 3 camadas e do runtime reescrito (`rules/packs/<id>.md`, `sources.yaml`, precedência) |
| Convenções | nova convenção: nomes estruturais em inglês, conteúdo PT-BR (consolida IMP-116) |

### Validação

- ✅ Nenhuma referência a `<core-repo>`/`<pack-repo>` no caminho de adoção (grep).
- ✅ Documentos citados pelo README existem todos no subset público.
- ✅ Neutrality: README fora do escopo por decisão consciente (branding do mantenedor — IMP-105), texto mantido limpo mesmo assim.

### Nota

Pendências de adoção que o Getting Started revela e a Fase 5 trata: modo core-only no `gm-setup` (tracker/infra opcionais de primeira classe) e ensaio de instalação limpa.

## IMP-106 - Pattern library obrigatória no ciclo de dev (consultar antes de implementar)

- **Data:** 19/10/2026
- **Alvo:** agents gm-dev (Passo 5 do Início de sessão), gm-dev-backend (Passo 4b), gm-dev-frontend (Passo 4b).
- **Origem:** falha de processo real — a migração Gemini→OpenRouter do <cliente> (18/10, CR-001) reimplementou do zero o que o <cliente> já tinha validado (OpenRouterGenerationService/ImageGenerationService + unit tests). A regra da pattern library existia no AGENTS.md global e no index, mas subagents NÃO leem o AGENTS.md — o contrato tinha que estar nos executores e no primary.
- **Correção:** (1) Passo 4b nos 2 executores: consultar <repo_docs>\_docs\patterns\INDEX.md antes de implementar; padrão aplicável → seguir e citar no relatório; domínio novo → sinalizar como candidato a pattern. (2) gm-dev: item 5 do Início de sessão — verificar a pattern library ANTES de delegar e referenciar o PATTERN.md no prompt (R1) quando aplicável. (3) Pattern extraída: _docs/patterns/codigo/ai-provider-openrouter/PATTERN.md (<cliente> + <cliente>, maturidade validado).
- **Validação:** build/testes do <cliente> intocados (0 erros, 13/13); headers HTTP-Referer/X-Title e log acionável aplicados ao OpenRouterClient (321186e).
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-125 — Melhorias da camada de engenharia reversa ancoradas na base knowledge/reverse-engineering (P1/P3/P4/P5)

- **Data:** 23/10/2026
- **Alvo:** `@gm-reverse-orchestrator`
- **Origem:** pesquisa 2024-2026 sobre RE assistida por IA (survey arXiv:2509.21821; Citation-Grounded arXiv:2512.12117; EPAM COBOL/PL-I ACL 2026; MDRE-LLM SANER 2025; Chain-of-Verification ACL 2024; Automating DDD arXiv:2603.26244; hierárquica arXiv:2512.05908/2607.01425/2501.07857; domain model extraction arXiv:2608.12228) → 4 pacotes aprovados pelo operador (P1, P3, P4, P5; P2/MCP code-graph REJEITADO). Fundação knowledge-first prévia: `knowledge/reverse-engineering/KNOWLEDGE.md` v1.0.0.
- **Problema:** relatório reverso exigia formato de citação `[arquivo:linha @hash]` mas nada validava mecanicamente se existia (falha dominante de alucinação); não declarava cobertura (silêncio de completude); entregava sem autoverificação; varria repos grandes linearmente; declarava BCs por pastas; perdia vocabulário de domínio entre fatias.
- **Causa raiz:** instrução ausente/ambígua no agente — Princípio 3 sem pass de checagem (categoria: falta de validação); template das seções 1-4 sem contagens (template incompleto); protocolo sem passo CoVe (instrução ausente); Fatia 1 apoiada só em pastas (instrução ambígua, conflita com P-07); checkpoint JSON sem glossário (template incompleto).
- **Correção (4 pacotes):**
  - **P1 — verificação mecânica de citações (P-03/AP-02):** novo passo "Verificação Final de Citações" (último antes de retornar) checando TODAS as citações com `read`/`grep`/`glob` já permitidos — **opção (a), sem script novo e sem alterar o front matter**; arquivo existe? linha ≤ tamanho? trecho confere? hash coerente?; citação inválida corrigida (reler o real) ou regra rebaixada a `PEND-XXX (Dúvida)`; contagem `citações verificadas: N/N válidas` na seção 1; gancho também no Princípio 3.
  - **P3 — baseline de completude (P-04/AP-04):** linhas de baseline no template — seção 2 (tabelas: detectadas · cobertas N/N), seção 3 (endpoints: detectados · mapeados N/N) e seção 4 (telas/rotas FE: detectadas · mapeadas N/N); fonte = mineração determinística das fatias; cobertura < 100% exige listar faltantes + motivo.
  - **P4 — autoverificação em cadeia CoVe (P-06):** novo passo "Autoverificação em Cadeia" após a Fatia 5, checklist mínimo (evidência+hash, grau coerente, endpoint existe, PII existe no schema, contagens batem, glossário uniformizado) respondido relendo o código real; registro na seção 1 `Autoverificação: executada — N perguntas checadas, M correções aplicadas`.
  - **P5 — bundle de refinamentos (P-05/P-07/P-09):** (a) sumarização hierárquica em repo >~500 arquivos (índice arquivo→propósito antes do deep-dive, registro na seção 1); (b) event storming simulado na Fatia 1 antes de declarar BCs (pastas = sinal auxiliar, nunca decisão final); (c) campo `domain_glossary` (termo → def + evidência) no JSON do REVERSE_STATE.md, carregado no início e reutilizado entre fatias (alimenta glossários downstream do gm-doc).
- **Arquivos:** `agents/gm-reverse-orchestrator.md` (10 edições incrementais; front matter intocado — permissões inalteradas), `WORKFLOW_IMPROVEMENTS.md`.
- **Também:** `knowledge/reverse-engineering/KNOWLEDGE.md` listada na seção "Lê (Upstream)" do agente. Nenhum componente novo (sem skill/subagent/script). Relações de delegação inalteradas → registry/ARCHITECTURE sem mudança.
- **Status:** aplicada — requer reiniciar o OpenCode.


## IMP-126 — Grafo de código opcional no @gm-reverse-orchestrator (MCP codebase-memory-mcp como complemento determinístico)

- **Data:** 23/10/2026
- **Alvo:** `@gm-reverse-orchestrator`
- **Origem:** piloto controlado validou o MCP `codebase-memory-mcp` (grafo de conhecimento de código, repo DeusData, v0.12.1) para a camada de engenharia reversa — supply-chain 100% verificado (SHA-256 + SLSA attestation + Windows Defender) e ganho real medido por fatia: Fatia 1 `get_architecture` devolveu clusters Louvain e boundaries por fan-in/fan-out (BCs confirmados por estrutura real de call graph); Fatia 2 `search_graph "*Configuration*"` listou 19 configs EF em 1 query; Fatia 4 `trace_path(TelefonesCorrespondem)` devolveu 47 callers multi-arquivo com hop-distance (~96% menos tokens que grep iterativo). Limitação: nodes `Route` não capturam atributos ASP.NET — Fatia 3 continua grep-first. Fundação knowledge-first: `knowledge/reverse-engineering/KNOWLEDGE.md` v1.1.0 (seção "Ferramenta validada").
- **Problema:** o agente instruía só grep/glob; call chains multi-arquivo (propagação de regra entre Services → Repositories → Controllers → UnitTests) exigiam N greps iterativos e perdiam callers distantes; BCs se apoiavam apenas em eventos/vocabulário, sem validação estrutural independente.
- **Causa raiz:** instrução ausente — nenhuma seção do agente previa ferramenta estrutural de grafo nem a hierarquia fonte-primária/complemento (categoria: instrução ausente).
- **Correção (3 incrementos; todo o conteúdo prévio preservado — princípios 1-9, 5 fatias, IMP-125 P1/P3/P4/P5, template e casos de borda):**
  - (1) permissão MCP no front matter `"codebase-memory-mcp_*": allow` (namespace restrito ao server — nunca `mcp.*` genérico);
  - (2) seção "Ferramenta Estrutural Opcional (Grafo de Código)" após os Princípios: quando usar (`trace_path` para call chains, `get_architecture` aspects clusters/boundaries/layers, `search_graph`); hierarquia obrigatória — matriz de grep por stack = FONTE PRIMÁRIA (Fatia 3 especialmente: nodes `Route` não capturam atributos ASP.NET), grafo = COMPLEMENTO determinístico (P-01) e nunca fonte única de uma seção; fallback "MCP indisponível → seguir só com grep; a análise NUNCA falha por falta do grafo" com registro em 1 linha na seção 1; checkpoint citando a query junto da evidência (`trace_path(TelefonesCorrespondem) → 47 callers`); setup via skill `gm-mcp-codegraph-setup`;
  - (3) reforço na Fatia 4: `trace_path` em validadores/handlers/eventos achados pelo grep para mapear a propagação completa da regra (callers com hop-distance) — evidência do grafo ANEXA à `[arquivo:linha @hash]`, nunca substitui.
- **Arquivos:** `agents/gm-reverse-orchestrator.md` (front matter + 2 blocos no corpo), `WORKFLOW_IMPROVEMENTS.md`. Relações de delegação inalteradas → registry/ARCHITECTURE sem mudança.
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-127 — Grafo de código opcional nos executors @gm-dev-backend e @gm-dev-frontend (Pacote A)

- **Data:** 23/10/2026
- **Alvo:** `@gm-dev-backend`, `@gm-dev-frontend`
- **Origem:** análise de impacto pós-piloto do IMP-126 — os 2 executors de dev já têm passos MANUAIS de grep que o grafo faz melhor (backend: "consulte o código existente do repo (padrões...)" no Princípio 4 e "Use glob/grep para mapear estrutura e padrões dominantes" no Passo 4; frontend: "grep de usages de shared components" no Passo 4 e "reporte impacto em outros módulos que o usam (grep de usages)" nos Casos de Borda). Piloto mediu: `trace_path` resolveu 47 callers de uma regra com hop-distance ≈96% menos tokens que grep iterativo. Pacote A aprovado pelo operador. Fundação: `knowledge/reverse-engineering/KNOWLEDGE.md` v1.1.0; MCP `codebase-memory-mcp` operacional em escopo global; formato da permissão MCP já validado no `@gm-reverse-orchestrator` (IMP-126). Skill `gm-mcp-codegraph-setup` já existe (setup feito — não refazer).
- **Problema:** os executors redesenham call chains e usages de componentes com N greps iterativos, perdendo callers distantes — trabalho repetido que o grafo resolve em 1 query (`trace_path`).
- **Causa raiz:** instrução ausente — nenhum executor previa ferramenta estrutural de grafo nem hierarquia fonte-primária/complemento (categoria: instrução ausente).
- **Correção (2 incrementos; TODO o conteúdo prévio preservado):**
  - (1) permissão MCP no front matter de AMBOS os executors: `"codebase-memory-mcp_*": allow` (namespace restrito ao server — mesmo estilo do `@gm-reverse-orchestrator`, IMP-126); nenhuma outra permissão alterada;
  - (2) seção "Orientação Estrutural Opcional (Grafo de Código)" em cada executor, após a lista de Tools: quando usar nos passos que JÁ EXISTEM (Passo 4 → `get_architecture` aspects `structure`/`clusters`; localizar símbolos → `search_graph`; usages/impacto → `trace_path` com callers/callees e hop-distance); hierarquia P-01 (spec = verdade, grafo = orientação COMPLEMENTAR, grep = fallback, grafo nunca é fonte única de decisão); fallback (MCP indisponível/falha → seguir só com grep; a task NUNCA falha por falta do grafo); rastreabilidade (cite a query do grafo no relatório junto da evidência, ex.: `trace_path(X) → N callers`); setup via `gm-mcp-codegraph-setup`. Acréscimos específicos: backend — nodes `Route` do grafo não capturam atributos ASP.NET (`[HttpGet]`/`[Route]`) → endpoints via grep, grafo para call chains; frontend — o passo "impacto em outros módulos que o usam" (hoje grep de usages) apontado como candidato natural ao `trace_path`.
- **Arquivos:** `agents/gm-dev-backend.md` (front matter + 1 linha em Tools + seção nova), `agents/gm-dev-frontend.md` (idem), `WORKFLOW_IMPROVEMENTS.md`. Relações de delegação inalteradas → registry/ARCHITECTURE sem mudança (só permissão/instrução).
- **Deferido (com gatilho):** `@gm-dev-reviewer` (gatilho: bug de impacto em caller passar em review); `@gm-dev-qa` (gatilho: gap de cobertura estrutural); playbooks `gm-stack-*` (gatilho: adoção real do grafo pelos executors); tour de onboarding (gatilho: adoção estável).
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-128 — Loop design-first para CR com impacto visual (Figma antes de código)

- **Data:** 23/10/2026
- **Alvo:** `gm-change-request` (skill), `@gm-figma-orchestrator`, `gm-req` (primary)
- **Origem:** sessão de requisitos do módulo `<projeto-web>` — CR-014 (hero da landing `/<cliente>`) registrou "design Figma como pré-requisito" apenas como texto livre no campo Abordagem; o operador apontou: "qualquer mudança visual deve gerar um prompt para o agente do Figma e, após validadas, solicitar ao Golmet novamente para capturar a nova versão e mudar em código".
- **Problema:** CRs com impacto visual em módulos cujo front é derivado de design Figma podiam ser implementados direto do texto do CR — nada no fluxo obrigava o ciclo prompt Figma → validação do operador → captura (`gm-figma-tasks`) → delta de UI_SPEC → feature/código (categoria: instrução ausente / gate ausente).
- **Causa raiz:** `gm-change-request` não classificava impacto visual no Bloco 0 nem roteava pós-aprovação; `@gm-figma-orchestrator` não tinha rota para "mudança visual de CR"; o primary `gm-req` não tinha a regra design-first.
- **Correção (3 incrementos, rota — não réplica):**
  - (1) `skills/gm-change-request/SKILL.md` — Bloco 0 ganha pergunta de impacto visual; novo passo **7.1 LOOP DESIGN-FIRST** (condicional: só para módulos Figma-derived — modo não-Figma segue fluxo normal): `@gm-figma-orchestrator` → `gm-figma-prompt` (delta da tela/seção) → validação do operador no Figma → `gm-figma-tasks` (delta de UI_SPEC + handoff) → só então `gm-task-spec`/`gm-dev`; template do CR ganha campos `**Impacto visual:**` e `**Design Figma:**`; caso de borda "CR visual aprovado sem design" (implementação barrada até o loop completar; propagation-guard sinaliza o delta pendente).
  - (2) `agents/gm-figma-orchestrator.md` — nova linha na tabela de rotas do Passo 1: "CR aprovado com Impacto visual: sim" → `gm-figma-prompt` (delta) → `gm-figma-tasks` após validação.
  - (3) `agents/gm-req.md` — novo bullet no Comportamento: loop design-first em mudança visual (nunca direcionar implementação de código visual direto do texto do CR).
- **Arquivos:** `skills/gm-change-request/SKILL.md` (4 edições), `agents/gm-figma-orchestrator.md` (1 edição), `agents/gm-req.md` (1 edição), `WORKFLOW_IMPROVEMENTS.md`. Relações de delegação inalteradas — registry/ARCHITECTURE sem mudança (nenhum componente novo).
- **Nota:** sessão paralela havia aplicado o bullet design-first no `gm-req.md` com rótulo "IMP-112" sem entrada no log — número já tomado (Fase 2 Open Core); referências unificadas para IMP-128 (1+4+1 replacements).
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-129 — Colisão de IDs de nós `S<N>` no Mermaid do ARCHITECTURE.md (renderizador registry)

- **Data:** 24/10/2026
- **Alvo:** `gm-registry-render`
- **Problema:** §1 do ARCHITECTURE.md tinha dois nós com o mesmo ID `S78` (`gm-knowledge-auditor` Meta e `gm-mcp-codegraph-setup` Transversal) — no Mermaid a segunda definição sobrescreve o label do primeiro e o diagrama renderiza errado. O bug surgiu quando 3 skills novas entraram no mesmo ciclo de render (knowledge-auditor → S78, mcp-codegraph-setup → S78, mcp-hostinger-setup → S79), detectado em produção durante a publicação da gm-mcp-hostinger-setup.
- **Causa raiz:** Instrução ausente — a SKILL.md (View A) não definia como os IDs `S<N>` são atribuídos nem exigia checagem de unicidade; renders incrementais atribuíam "próximo ID" contra snapshot stale da view anterior.
- **Correção:** (1) regra determinística anti-colisão na View A: a lista completa de nós é montada ANTES da atribuição (ordem = chaves `domains:` do registry.yaml, depois a lista `skills:` de cada domínio; excluindo as skills de duplo registro), IDs `S1..SN` em passada única, NUNCA derivados da view anterior — idempotência preservada (mesma árvore ⇒ mesma saída) — com validação pré-aplicação (contagem = N, IDs únicos, arestas e class-line consistentes); (2) novo caso de borda "Colisão de ID de nó no Mermaid"; (3) §1 re-renderizada: 80 nós S1..S80 únicos (client-report agrupado em Requisitos como S15), 19 arestas e class-line remapeadas (80 refs, 80 únicos).
- **Validação:** fixture gm-registry-render 6/6 PASS; modo registry do runner (IMP-027) 5/5 PASS; 0 FAIL.
- **Arquivos:** `skills/gm-registry-render/SKILL.md` (2 inserções), `ARCHITECTURE.md` (§1: nós, arestas, class-line), `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada — requer reiniciar o OpenCode.

---

## IMP-130 - Guia de migração `MIGRATION.md` para a arquitetura open core (CORE / PACK / PROFILE)

- **Data:** 24/10/2026
- **Alvo:** Documentação do core (novo artefato `MIGRATION.md`)
- **Problema:** a adoção do open core (core público + repo de pack + profile) criou uma lacuna para operadores da abordagem antiga: não existia guia narrativo de migração — o conhecimento estava disperso entre `PACK_SCHEMA.md`, `BREAKING-CHANGES.md` e as skills (`gm-restructure`, `gm-pack-scaffold`, `gm-setup`, `gm-core-update`/`gm-pack-update`), sem um caminho passo a passo por cenário.
- **Correção:** novo `MIGRATION.md` na raiz do core com (1) mapa antes → depois da config monolítica para CORE/PACK/PROFILE; (2) Cenário A — config local antiga → core + pack (inventário, `gm-pack-scaffold`, movimentação de conteúdo de org, neutralização do core, instalação e validação do contrato no-override/`requires-core`); (3) Cenário B — módulos de docs no layout antigo via `gm-restructure` (4 modos, lote, preservação de âncoras PEND pré-IMP-094 e IDs `DEC-XXX` imutáveis) com nota de que a migração pode ser gradual (fallbacks de leitura); (4) Cenário C — máquina nova/nova adoção (`gm-setup`, modo core-only); (5) rotina pós-migração com a convenção `Golmet-<repo>-<action>` (IMP-124) e a semântica pin vs faixa; (6) checklist de migração. README referencia o novo doc.
- **Validação:** revisão cruzada com `PACK_SCHEMA.md` (contrato v1), `BREAKING-CHANGES.md`, `README.md` §Arquitetura open core e front matter das skills citadas — sem contradição.
- **Arquivos:** `MIGRATION.md` (novo), `README.md` (seção Documentação), `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-131 — Resíduos do bloco aposentado `gm-docs-repo` em 13 consumidores (referência stale pós-IMP-112)

- **Data:** 24/10/2026
- **Alvo:** 5 agents + 8 skills (apenas corpo — nenhuma permissão/description alterada)
- **Origem:** sessão de clarify sobre qualidade do onboarding — auditoria `ONBOARDING_AUDIT_2026-10-24.md` + checkpoint `meetings/2026-10-24-01.md` no workspace de produtos (achado F1, aprovado pelo operador: "vamos corrigir então"). Delegação inicial ao `@gm-workflow-improver` foi cancelada sem edições; correção aplicada inline pelo primary com o mesmo design.
- **Problema:** o IMP-112 aposentou o bloco `<!-- gm-docs-repo -->` (substituído por `<!-- gm-pack-accumulation -->`; o <docs-repo> permaneceu vivo como workspace de produtos), mas 13 consumidores seguiam citando o bloco antigo e o path `<repo_docs>/_docs/patterns/INDEX.md` — que não existe mais no workspace (o INDEX de patterns vivo está apenas no acúmulo do pack). A Área 2 do onboarding-orchestrator não resolvia o caminho do tour — o primeiro contato do operador novo com o workflow falhava silenciosamente (categoria: referência stale pós-refactor, família IMP-080).
- **Causa raiz:** propagação incompleta do IMP-112 — o aposentamento do bloco não foi varrido contra os consumidores.
- **Correção (3 direções, alinhadas ao design do IMP-112):**
  - (1) **Tour de onboarding migrado para a própria config:** novo `_docs/tour-onboarding.md` na raiz do core (conteúdo vindo do docs repo, header ajustado); `agents/gm-onboarding-orchestrator.md` (2 pontos) lê o path direto `~/.config/opencode/_docs/tour-onboarding.md` — portável, sem resolução de bloco; cópia antiga no docs repo a ser removida pelo primary.
  - (2) **Pattern library na rota canônica do pack** `packs/<pack-ativo>/accumulation/patterns/INDEX.md` (bloco `gm-pack-accumulation`): `agents/gm-dev.md` (1), `agents/gm-dev-backend.md` (3), `agents/gm-dev-frontend.md` (3), `skills/gm-task-spec` (1), `skills/gm-clarify` (1), `skills/gm-project-intake` (1), `skills/gm-skill-evolution` (patterns + METRICS → acúmulo do pack, destino do `gm-metrics-collector`), `skills/gm-project-retrospective` (1).
  - (3) **Workspace de produtos re-ancorado** em cwd/`diretorio_projetos` (bloco `<!-- projeto-padrao -->`), mantido o campo `repo_docs` do client-profile como dica: `skills/gm-project-intake` (seção "Regra de Localização de Artefatos Golmet" + token unificado `<workspace-de-produtos>`), `skills/gm-governance` (2), `skills/gm-tasks-pending` (1) + `agents/gm-tasks-pending` (1 — cwd vira resolução primária); `skills/gm-setup` (3 — lista de blocos esperados `gm-docs-repo` → `gm-pack-accumulation`; o `AGENTS.template.md` já usava o nome novo — sem drift a reconciliar).
- **Validação:** grep `gm-docs-repo|repo_docs` em agents/, skills/ e registry.yaml pós-edição → apenas resíduos históricos neste log + a dica intencional de perfil no intake (campo local do client-profile); front matter íntegro (sem BOM — IMP-096); nenhuma description/delegação alterada → registry/ARCHITECTURE sem mudança.
- **Nota:** o mecanismo de resolução do tour (path direto `~/.config/opencode/_docs/`) já havia entrado no commit 3c40300 de sessão paralela ("onboarding alinhado — tour com 4 primaries, vocabulário essencial e exemplo ponta a ponta"), que também entregou parte do F2 da auditoria (camada conceitual no tour); esta IMP registra e fecha os 13 consumidores restantes que a sessão paralela não cobriu. Versão negócio do tour (F3) e eval do orquestrador (F4) seguem abertos.
- **Arquivos:** `_docs/tour-onboarding.md` (novo), `agents/gm-onboarding-orchestrator.md` (2), `agents/gm-dev.md` (1), `agents/gm-dev-backend.md` (3), `agents/gm-dev-frontend.md` (3), `agents/gm-tasks-pending.md` (1), `skills/gm-task-spec/SKILL.md` (1), `skills/gm-clarify/SKILL.md` (1), `skills/gm-project-intake/SKILL.md` (4 pontos), `skills/gm-governance/SKILL.md` (2), `skills/gm-tasks-pending/SKILL.md` (1), `skills/gm-skill-evolution/SKILL.md` (1), `skills/gm-project-retrospective/SKILL.md` (1), `skills/gm-setup/SKILL.md` (3), `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-132 — Fixtures L0 sem `mode: manual`: CI "Golden Set Evals" vermelho desde 22/10 (guard do IMP-121 operando)

- **Data:** 25/10/2026
- **Alvo:** `evals/gm-domain-research/fixture-001/criteria.yaml`, `evals/gm-mcp-codegraph-setup/fixture-001/criteria.yaml` (1 linha cada)
- **Origem:** pipeline "Golden Set Evals" do <core-repo> em FAIL por 6 runs consecutivos (22/10–25/10); investigada após o push do IMP-131 — o push não foi a causa (o primeiro FAIL o antecede em 3 dias)
- **Problema:** as 2 fixtures são rubricas semânticas L0 (execução real da skill: fontes com URL/data de acesso; config de máquina) criadas com `criteria.yaml` sem `output-expected/` **e** sem a marca `mode: manual`. O guard do IMP-121 classifica criteria sem baseline e sem marca como **FAIL** (fim do SKIP silencioso): `output-expected ausente (ver .gitignore / IMP-121)` — 870/872 checks passavam, mas a suíte saía exit 1 em todo run
- **Causa raiz:** convenção do IMP-121 (rubrica sem baseline exige marca `mode: manual`) não aplicada na criação das 2 fixtures — a primeira entrou no commit `cde7ca3` (knowledge-first), a segunda junto da skill de setup do codegraph
- **Correção:** chave `mode: manual` como primeira entrada do front matter das 2 criteria — o grep do guard (`^mode:\s*manual`, `run-evals.sh` linhas ~318) passa a capturá-las, e a branch de baseline (FAIL) cede à de rubrica manual (SKIPPED visível, IMP-121). Nenhuma mojibake a corrigir: os arquivos já estavam em UTF-8 válido (o lixo visto em console era artefato de encoding do terminal)
- **Validação:** grep com o próprio regex do guard nos 2 arquivos → OK; suíte completa local **885 PASS / 0 FAIL / 24 skipped, exit 0**; veredito definitivo no run do CI pós-push. Nenhum skill/agent alterado — Golden Set de frescor não se aplica
- **Nota:** os 6 runs vermelhos foram o guard do IMP-121 operando como projetado — nenhuma regressão real de skill no período
- **Arquivos:** 2 `criteria.yaml`, `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-133 — Wordlist de neutralidade ampliada: 4 produtos reais vazariam na próxima release pública (31 hits neutralizados)

- **Data:** 25/10/2026
- **Alvo:** `evals/neutrality/scan.sh` + 3 agents + 5 skills + 9 fixtures/criteria (20 arquivos)
- **Origem:** análise de segurança da separação core privado / espelho público (`gm-core`) — o operador perguntou "o <core-repo> tem algo que comprometa a organização?"; a inspeção revelou que a wordlist do gate de neutralidade não cobria produtos reais da org além de <cliente>/<cliente>
- **Problema:** a wordlist da Fase 1 (`<org>|<setor>|<cliente>|<docs-repo>|<cliente>|PRJ.N|PRJ.N`) deixava passar **<cliente>, <cliente>, <cliente> e <cliente>** — nomes de produtos reais citados em exemplos de skills/agents e em 2 fixtures que continham charter/requisitos reais de cliente (compliance-check f001, dev-reviewer f002). A próxima release pública publicaria os 31 hits
- **Causa raiz:** wordlist construída com um subconjunto de identificadores na Fase 1 e nunca revisada quando novos produtos entraram na org (categoria: gate com cobertura incompleta)
- **Correção (2 incrementos):**
  - (1) wordlist ampliada: `+<cliente>|<cliente>|<cliente>|<cliente>|escola[-_ ]?conectada|assistente[-_ ]?ponto|lord[-_ ]?of[-_ ]?mysteries`
  - (2) 31 hits neutralizados com aliases no padrão IMP-112 (<cliente>→<cliente>, Acme-Group): **<cliente>→AcmeCut** · **<cliente>→<cliente>** · **<cliente>→Rapido** · **<cliente>→Candela** — aplicados consistentemente em input **e** output-expected dos fixtures (checks `contains` preservados)
- **Validação:** scan → `neutrality: OK (629 arquivos varridos)`, 0 hits; evals das skills tocadas → 55 PASS / 0 FAIL (compliance-check 9, dev-reviewer 14, project-intake 7, restructure 25; cicd-workflow/skill-evolution/stack-boilerplate são rubricas manuais — SKIPPED); sem BOM nos arquivos reescritos (IMP-096)
- **Nota (exposição residual):** o espelho público atual (snapshot `gm-core` de 21/10) pode conter ocorrências **anteriores** a esta correção — auditoria do conteúdo público pendente; releases futuras não carregam mais nenhum hit
- **Lição:** toda varredura de neutralidade depende da wordlist ser viva — novos produtos/clientes da org devem ser adicionados à lista no mesmo ciclo em que entram no dia a dia (candidato a checklist do `gm-setup`/pack)
- **Arquivos:** `evals/neutrality/scan.sh`, `agents/gm-dev.md`, `agents/gm-doc.md`, `agents/gm-req.md`, `skills/gm-compliance-check/SKILL.md`, `skills/gm-project-intake/SKILL.md`, `skills/gm-restructure/SKILL.md`, `skills/gm-stack-boilerplate/SKILL.md`, 9 arquivos de fixtures/criteria, `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada — requer reiniciar o OpenCode.
## IMP-134 — Hub de patterns cross-empresa no subset público (Fase 1 da proposta de contribuição cross-empresa)

- **Data:** 26/10/2026
- **Alvo:** `patterns/` (novo), `PUBLISH.md`, `CONTRIBUTING.md`, `.github/workflows/evals.yml`
- **Origem:** proposta de design "Contribuição Cross-Empresa no Golmet Open Core" (2026-10-26, APROVADA — decisões D1–D4 confirmadas pelo operador) — gap G2: patterns validados morrem na pattern library privada do pack; o subset essencial não tinha destino público para padrão generalizado. Execução da Fase 1 (MVP) do plano faseado
- **Problema:** cada empresa redescolve soluções já validadas por outra — `accumulation/patterns/` é por pack (privado por design, IMP-112) e o fluxo de contribuição do `gm-core` (IMP-113) não cobria a promoção de pattern pack → hub
- **Entrega:**
  - `patterns/TEMPLATE.md` — patlet com front matter de ciclo de vida (KEP-inspired): `id: PAT-NNN`, `titulo`, `categoria` (codigo|arquitetura|processo|ui|dados|teste), `status` (proposed|validated|accepted|superseded), `origem` (pack proponente — opt-in — ou `anonimo`), `projetos_validacao` (opt-in), `shepherd`, `criado_em`, `ultima_revisao`, `superseded_by`, `warranty_ate`; corpo Problema / Solução / Contexto e forças / Evidência de validação
  - `patterns/INDEX.md` — índice do hub (tabela de aceites vazia no MVP + instruções curtas de leitura/promoção)
  - `patterns/validate.sh` — gate determinístico estilo `kepval` (bash puro, sem dependências): campos obrigatórios presentes, enums de status/categoria, datas em AAAA-MM-DD e condicionais por status (`superseded_by` se superseded; `shepherd` se validated|accepted; `warranty_ate` se accepted); isentos TEMPLATE.md e INDEX.md (infraestrutura do hub, sem front matter)
  - `CONTRIBUTING.md` — seção "Promovendo patterns" (fluxo §3.2 da proposta): generalizar+anonimizar → neutrality scan → PR com checklist → shepherd de empresa ≠ origem (PLoP) → warranty 30 dias (InnerSource) → aceite no INDEX
  - `.github/workflows/evals.yml` — job `patterns` que roda `bash patterns/validate.sh` quando o PR toca `patterns/**`
  - `PUBLISH.md` — `patterns/` adicionado à tabela do subset essencial
- **Decisões aplicadas (fechadas na proposta, não reabrir):** D1 provenance nomeada com opt-in · D3 warranty fixa de 30 dias pós-aceite · D4 mantenedor único no MVP (<org> TC único; federar TCs com a 2ª empresa). D2 (bot de port `publish/port-pr.sh`) é Fase 3 e a skill `gm-pattern-promote` é Fase 2 — ambos fora do escopo
- **Validação:** `bash patterns/validate.sh` → `patterns: OK (0 patterns validados)` na baseline (só infraestrutura); matriz do gate: front matter quebrado → FALHOU (9 erros, com arquivo:linha) · proposed válido → OK (1) · accepted sem shepherd/warranty → FALHOU (2) · superseded sem superseded_by → FALHOU (1); neutrality scan → `neutrality: OK (630 arquivos varridos)`
- **Pendências para a próxima release (atualizado em 27/10/2026):** ~~`publish/publish-core.sh` SUBSET sem `patterns`~~ **resolvida 27/10/2026** — entrada `patterns` adicionada ao array SUBSET no ciclo da transferência do repo público (IMP-135); `.github/PULL_REQUEST_TEMPLATE.md` não existe — o aceite da warranty ficou documentado na seção "Promovendo patterns" do CONTRIBUTING (template de PR com checkbox é incremento futuro); escopo do `evals/neutrality/scan.sh` não inclui `patterns/` (lista fechada) — avaliar inclusão quando o hub receber o primeiro patlet
- **Arquivos:** `patterns/TEMPLATE.md`, `patterns/INDEX.md`, `patterns/validate.sh`, `PUBLISH.md`, `CONTRIBUTING.md`, `.github/workflows/evals.yml`, `WORKFLOW_IMPROVEMENTS.md`
- **Status:** aplicada.

## IMP-135 - Transferência do espelho público para conta pessoal (`<operador>/Golmet-CORE`)

- **Data:** 27/10/2026
- **Alvo:** `publish/publish-core.sh`, `PUBLISH.md`, `CONTRIBUTING.md`, `README.md`, `MIGRATION.md` + remote do clone local `~/.config/gm-core`
- **Origem:** operador transferiu o repo público do espelho de `<org>/gm-core` para `https://github.com/<operador>/Golmet-CORE` (GitHub redirect ativo no URL antigo; mesmo histórico, mesmo modelo snapshot)
- **Problema:** 4 docs + o script de publish apontavam para o local antigo; o clone local do público (`~/.config/gm-core`) mantinha `origin` no URL antigo — publicações futuras dependeriam de redirect
- **Entrega:**
  - `publish/publish-core.sh` — `PUBLIC_REPO="<operador>/Golmet-CORE"`, comentários e hint `gh repo create` atualizados; **entrada `patterns` adicionada ao array SUBSET** (resolução da pendência bloqueante do IMP-134)
  - `PUBLISH.md`, `CONTRIBUTING.md`, `README.md`, `MIGRATION.md` — referências ao clone/instalação atualizadas para o novo URL
  - Clone local `~/.config/gm-core` — `git remote set-url origin https://github.com/<operador>/Golmet-CORE.git` (HEAD 88e1e5a, snapshot de 26/10)
- **Nota:** referências históricas a `<org>/gm-core` em entradas IMP anteriores são registros imutáveis de contexto da época — não reescritas
- **Status:** aplicada.

## IMP-136 — Camada de operador: perfil declarativo (`rules/operator-profile.md`) + consumo em triagens e IMPs

- **Data:** 27/10/2026
- **Autor:** <operador>
- **Alvo:** `rules/operator-profile.template.md` (novo), `.gitignore`, `skills/gm-setup/SKILL.md`, `skills/gm-clarify/SKILL.md`, `skills/gm-decision-log/SKILL.md`, `WORKFLOW_IMPROVEMENTS.md` (formato), `CONTRIBUTING.md`, `PUBLISH.md`, `publish/publish-core.sh`, `AGENTS.template.md`, `AGENTS.md` (índice lazy)
- **Origem:** ciclo de clarify de 27/10/2026 (checkpoint `meetings/2026-10-27-02.md` no <docs-repo> — 5 itens, todos score >= 70: 100/80/90/100/100) — informações do operador não tinham camada declarativa (identidade espalhada em git config/gh auth); as de empresa já são cobertas pelo IMP-103 (client-profile)
- **Decisões fechadas no clarify (não reabrir):** gitignored + template versionado (modelo IMP-103) · consumo: Responsável em triagens + Autor em IMPs · gravação: passo do gm-setup · 1 operador por máquina (troca = editar o arquivo) · fallback: pedido manual ao operador
- **Entrega:**
  - `rules/operator-profile.template.md` (novo) — esqueleto versionado (nome, e-mail, papel, identidade git de commit, conta GitHub); o real (`rules/operator-profile.md`) é gitignored e gravado pelo gm-setup (Passo 2c), NUNCA por agente (dado pessoal)
  - `skills/gm-setup/SKILL.md` — Passo 2c (perfil do operador) logo após o Passo 2b; idempotente; mantido nos perfis core-only e completo
  - `skills/gm-clarify/SKILL.md` — triagem de PENDs: campo Responsável lido do perfil (fallback manual se ausente)
  - `skills/gm-decision-log/SKILL.md` — campo Decisor com default do perfil (fallback manual se ausente)
  - Formato IMP ganha o campo `**Autor:**` (fonte: `rules/operator-profile.md`) — documentado no cabeçalho deste arquivo e no CONTRIBUTING (§6 Publicar); primeira entrada a usá-lo é esta
  - `PUBLISH.md` + `publish/publish-core.sh` — template do perfil do operador entra no subset essencial (o real nunca sai)
  - `AGENTS.template.md` + `AGENTS.md` — entrada do perfil no índice lazy de referências
- **Validação:** neutrality scan `neutrality: OK`; `evals/run-evals.sh --all` verde (gm-setup/gm-clarify/gm-decision-log com fixtures); `evals/run-evals.sh --registry` 6/6
- **Status:** aplicada — requer reiniciar o OpenCode.

## IMP-137 — Skill gm-core-port: port automatizado público → core privado (Fase 3 da proposta de contribuição cross-empresa)

- **Data:** 28/10/2026
- **Autor:** <operador>
- **Alvo:** `skills/gm-core-port/SKILL.md` (nova), `evals/gm-core-port/fixture-001/`, `evals/gm-core-port/fixture-002/` (novas), `registry.yaml`, `ARCHITECTURE.md` (views re-renderizadas), `AGENTS.template.md` (bloco da convenção `Golmet-<repo>-<action>`)
- **Origem:** proposta de design "Contribuição Cross-Empresa no Golmet Open Core" (2026-10-26, APROVADA) §3.4 Opção A / decisão D2 (bot de port estilo GitLab 2017) + pedido do operador em 28/10/2026 — gap G1: modelo snapshot = sem ancestralidade git entre público e privado; PR aceito era portado à mão ao `<core-repo>`
- **Problema:** com N empresas contribuindo, o port manual de snapshots/PRs aceitos do `gm-core` público não escala (era pré-2016 do GitLab); a ponte público↔privado precisa ser reconstruída por conteúdo (o `<sha>` da mensagem de snapshot), com fronteira de subset e gates obrigatórios
- **Entrega:**
  - `skills/gm-core-port/SKILL.md` — 3º membro da convenção `Golmet-<repo>-<action>` (IMP-124): update (traz do privado) · publish (empurra ao privado) · port (traz do espelho público). Algoritmo: fetch no clone → detectar pendentes por sha (`release: snapshot <core-repo>@<sha>` cujo sha NÃO está no histórico do core; base = último snapshot cujo sha está) → delta `<base>..origin/main` (patch acumulado) → fronteira OBRIGATÓRIA contra o array `SUBSET` de `publish/publish-core.sh` (fonte única; exclusões `evals/reports|trends|golden-human` e perfis reais NUNCA passam) → `git apply --check` antes de aplicar (conflito aborta sem sujar o tree) → gates (`evals/run-evals.sh --all` + `evals/neutrality/scan.sh`; vermelho = revert com `git apply -R`) → commit local `port: snapshot público <short-sha> (<data UTC>)`. **NUNCA push** — publicação é sempre do `gm-core-publish` (decisão do operador). Modo `--pr <N>`: porta PR específico via `gh pr diff` com os mesmos checks, commit `port: PR#N <título> (autor original preservado)`
  - `evals/gm-core-port/fixture-001/` — rubrica manual: no-op idempotente sem snapshots novos (snapshot refere sha já no core → zero comandos mutantes)
  - `evals/gm-core-port/fixture-002/` — rubrica manual: patch com path fora do subset (ex.: `evals/reports/`, `rules/client-profile.md` parados no espelho) ABORTA antes de qualquer apply
  - `registry.yaml` — skill registrada (domain `meta`; `gm-req` invoca direta, par das irmãs) + views re-renderizadas via `gm-registry-render`
  - `AGENTS.template.md` — bloco "Ciclo de vida da config" citando o trio update/publish/port (base neutra publicável)
- **Fora de escopo (incrementos futuros):** roteamento de conflito por owner (registry.yaml → domínio → mantenedor — bot GitLab completo); `publish/port-pr.sh` como script shell determinístico (a skill cumpre o papel D2 no nível agent)
- **Validação:** `evals/run-evals.sh --all` verde (+2 fixtures manuais SKIPPED); `--registry` 6/6; `neutrality` OK; smoke test real contra o estado atual (snapshot público 8124977 referencia `fc0b9fe`, que é a HEAD do core) → no-op correto com zero mutações
- **Status:** aplicada — requer reiniciar o OpenCode.
## IMP-138 — Skill gm-jev-setup: setup/validação do runtime Jev (TypeSafe System One)

- **Data:** 28/10/2026
- **Autor:** <operador>
- **Alvo:** `skills/gm-jev-setup/SKILL.md` (nova), `skills/gm-setup/SKILL.md` (Passo 5d), `evals/gm-jev-setup/fixture-001/` + `evals/gm-jev-setup/fixture-002/` (novas), `registry.yaml`, `ARCHITECTURE.md` (views re-renderizadas)
- **Origem:** gap constatado no Passo 6 do gm-setup — a tabela de validação de ambiente checa a tool `jev_classify`, mas não havia wizard que validasse com smoke test nem orientasse a remediação (validava, não remediatava); investigação de ground truth em 28/10/2026 fechou o design: sem entry no opencode.jsonc (grep vazio), sem binário/plugin/config em arquivo (grep vazio), sem string no binário opencode.exe (`grep -a` vazio) — a tool `jev_classify` é provida pelo runtime da sessão (harness) e **não existe rota de instalação local**
- **Decisões fechadas (não reabrir):** a skill valida + smoke test e NUNCA instala (nenhum URL de MCP ou comando inventado); ausência do runtime é pendência NÃO bloqueante (padrão IMP-080) com remediação "verificar com o provedor do ambiente/harness da organização"; gatilho no gm-setup apenas quando a tool está ausente (presente passa direto — idempotente, padrão dos irmãos); Passo 6 do setup mantém a validação existente na tabela (dupla camada — setup valida de novo)
- **Entrega:**
  - `skills/gm-jev-setup/SKILL.md` (nova) — wizard thin no molde das irmãs de setup (azure/gh/aws): 4 passos — detecção no catálogo de tools da sessão → smoke test com input trivial (text + questions TypeSafe choice; resposta JSON tipada com probabilities = runtime funcional) → runtime ausente/degradado = pendência não bloqueante listando os consumidores que degradam para fallback (gm-decision-audit, gm-quality-gates, gm-prompt-gate) → relatório compacto; seção Ground truth documenta a constatação de 28/10/2026
  - `skills/gm-setup/SKILL.md` — Passo 5d (Jev, síncrono, opcional) entre 5c e 6; front matter (lista de delegações), linha de fluxo, índice lazy de perfil core-only, Tools, Lê (catálogo de tools), Casos de Borda e relatório final atualizados
  - `evals/gm-jev-setup/fixture-001/` — rubrica manual: runtime presente com smoke test ok (5 checks)
  - `evals/gm-jev-setup/fixture-002/` — rubrica manual: runtime ausente → pendência não bloqueante com remediação correta (4 checks)
  - `registry.yaml` — skill registrada (domain `meta`, padrão do gm-setup; também em `domains.meta.skills`) + views re-renderizadas (§1 renumerado S58/S83, §5.12, §6)
- **Validação:** `evals/run-evals.sh --all` verde (+2 fixtures manuais SKIPPED); `evals/run-evals.sh --registry` 6/6; `evals/neutrality/scan.sh` OK; smoke test real em 28/10/2026 na sessão do builder: `jev_classify` respondeu JSON tipado (`jev-1.14.0`, choice `baixa`, probabilities {alta: 0.36, baixa: 0.64}) — runtime funcional
- **Atualização 28/10/2026 (revisão do ground truth com o operador):** a 1ª investigação era **incompleta** — não varreu o diretório `plugins/`. Encontrado `plugins/jev-tool.js`: **plugin OpenCode** (API V2, auto-carregado — por isso ausente do bloco `mcp` do jsonc, causa do falso negativo) que registra a tool `jev_classify` e faz **chamada HTTPS direta** a `POST https://api.typesafe.ai/v1/systemone` (`Bearer $TYPESAFE_API_KEY`, env User-scope; `model: "jev-latest"` → `jev-1.14.0`). **Não é MCP** — NUNCA inventar entry no jsonc. Decisões do operador: (1) **distribuir** — `/plugins/` removido do `.gitignore` e adicionado ao SUBSET/PUBLISH.md (adotador recebe o plugin; a key é individual, nunca versionada); (2) **remediação real** no SKILL.md — diagnóstico de 2 causas (plugin ausente no runtime → copiar do core + reiniciar; key ausente → criar em console.typesafe.ai/keys e gravar env User-scope). Nota técnica: payload `noul` exige type minúsculo + `criteria` dict `{"false","true"}` (payload `nouL` sem criteria → 400; skills existentes já corretas, validadas contra jev-1.13.0, runtime 1.14.0 compatível)
- **Status:** aplicada — requer reiniciar o OpenCode.
- **Incidente 28/10/2026 (KE-002):** a 1ª snapshot com distribuição usou entry de DIRETÓRIO (\plugins\) no SUBSET e publicou 3 plugins pessoais do runtime (\alcode.js\, \
- **Incidente 28/10/2026 (KE-002):** a 1ª snapshot com distribuição usou entry de DIRETÓRIO (`plugins`) no SUBSET e publicou 3 plugins pessoais do runtime (`falcode.js`, `rtk.ts`, `anti-idle-detector.ts`) no repo público. Avaliação: severidade BAIXA — zero segredos, zero dado de cliente (varredura de padrões de credencial + neutrality OK); plugins genéricos de utilitários (Zellij status, rewriter de comandos, anti-idle). Correção: SUBSET passou a listar o ARQUIVO explícito (`plugins/jev-tool.js`), snapshot subsequente (`v2026-10-28.4`) repõe o estado limpo — o mirror do publish-core.sh remove o que sai do subset. **Lição:** SUBSET é lista explícita de ARQUIVOS — nunca entry de diretório sem remoções explícitas (o `evals` é a exceção consagrada porque já tem remoções codificadas).

## IMP-139 - Pré-scan determinístico de módulos (gm-scan.mjs) integrado ao gm-validate (R4)

- **Data:** 31/10/2026
- **Autor:** operador Souza
- **Origem:** análise de computação determinística no pipeline — a validação de 13 módulos (sessão 31/10) gastou 3 subagents em categorias que são operações de conjunto (refs definidas × referenciadas, cobertura presencial, contagem de marcadores). A própria skill documentava a armadilha de encoding (Get-Content ANSI mascara emoji → falso "0 marcadores") — classe de bug eliminada por leitura UTF-8 forçada em script. Aplica o princípio R4 (script para lista fechada, julgamento agêntico), até então aplicado só em gm-perf-auditor e gm-knowledge-auditor.
- **Arquivos:** skills/gm-validate/scripts/gm-scan.mjs (novo), skills/gm-validate/SKILL.md (Passo 0)
- **Status:** aplicada
- **O que faz:** extrai IDs definidos/referenciados por namespace (RN/CR/ADR/DEC/PEND + variante org ADR-XXX-NNN), classifica refs quebradas e mismatch de namespace (DEC citado × ADR definido — bug real do <cliente> na sessão 31/10), cobertura presencial RN×downstream com expansão de ranges ("RN-063..088"), evidência de CRs (status + RNs afetadas), confiança com pareamento contextual (emoji só conta com "Confiança" no contexto — severidades de PEND/riscos não viram calibração), staleness MP-03 e links internos quebrados. Fallbacks IMP-011 e união de múltiplos CHANGE_REQUESTS codificados. Saída: `<modulo>/quality/scan.json`; `--strict` dá exit 1 com ref quebrada (gate de CI).
- **Validação (golden case):** rodado nos 13 módulos do <docs-repo> pós-correção — 0 falsos negativos vs. validação subagêntica; counts de RN convergem com os máximos conhecidos em 9 módulos verificáveis; **corrigiu um falso positivo do processo agêntico** (Institucional: 3 emojis de severidade contados como confiança pelo subagent — pareamento rejeitou os 3; veredito correto: 13/13 sem calibração). O único achado exclusivo do scanner (link `./caminho.md` em `<produto-ui>/docs/UX_REVIEW_2026-10-30.md`) revelou-se falso positivo — link dentro de inline code é exemplo de sintaxe, não link; corrigido com strip de code fences/inline code antes da extração (0 quebrados nos 13 no rerun). Meta-lição: o loop determinístico convergiu em 1 ciclo sem julgamento — exatamente o que R4 propõe.
- **Fronteira R4 preservada:** cat. 1 (RN envolve dado/API/UI?), cat. 3 (CR refletido no texto?) e cat. 4 (supersession temática) continuam agênticas — o script entrega CANDIDATOS, não vereditos.
- **Próximos passos (propostos, não aplicados):** consumir scan.json em gm-traceability, gm-progress, gm-next, gm-tasks-pending, gm-cr-propagation-guard e gm-wiki-lint; gate `--strict` em GitHub Action no repo de docs; cobertura por evals (fixtures com refs quebradas conhecidas).

## IMP-140 - Suíte de scanners determinísticos (tasks/config/diff/prop) + drift histórico no gm-scan.mjs (R4)

- **Data:** 31/10/2026
- **Autor:** perfil ausente - registrada pelo @gm-dev na sessão de implementação (mesma sessão do IMP-139)
- **Origem:** execução dos "próximos passos" propostos no IMP-139. Análise de computação determinística no pipeline (sessão 31/10) mapeou os 3 gaps restantes: o parse de Feature.md era re-feito por LLM em até 8 consumidores (tasks-pending, progress, next, gh/azure creators, client-report, scope-agreement, reviewer); o health monitor gastava um subagent lendo ~70 componentes para checks que são regex/YAML/diff de conjuntos; reviewer e propagation-guard greppavam diffs/CRs manualmente.
- **Arquivos:** skills/gm-validate/scripts/gm-scan.mjs (dispatcher de subcomandos + 4 modos novos + micro-adds docs), skills/gm-tasks-pending/SKILL.md, skills/gm-agent-health-monitor/SKILL.md, skills/gm-cr-propagation-guard/SKILL.md, skills/gm-traceability/SKILL.md, skills/gm-validate/SKILL.md (todos com Passo 0), agents/gm-dev-reviewer.md (Passo 2)
- **Status:** aplicada
- **O que faz:** (1) \	asks <raiz>\ - parser de delivery com prioridade Feature (IMP-093) > Tasks (IMP-092) > pasta IMP-040 > flat (pré-040/034) > sprint, front matter com vocabulário de status normalizado (implemented/done/concluido -> done), proveniência (Análise/Promovida de PEND/Implementado em), tabela Resumo das tasks + headings RN-NNN-M, repos da Issue principal, PENDs §11 de REQUIREMENTS (fechada por [resolvido]/[bloqueado]/promoção), anomalias para --strict; (2) \config\ - linter de componentes contra CHECKLISTS.md (FM delimitadores IMP-086/BOM IMP-097, name==pasta/arquivo, tools: proibido, temperature, permission, edit/write allow amplo, seções obrigatórias case-insensitive, marcadores TODO/FIXME case-sensitive com strip de code, paths de máquina IMP-016, coerência registry.yaml <-> agents/skills, refs IMP-080 com skip de placeholders <gm-s1> e wildcards gm-stack-*), health.json + --strict para gate; (3) \diff <repo> --base <b> --rns\ - RNs citadas nos arquivos alterados (base...HEAD, fallback worktree + untracked) x RNs da task, review-evidence.json; (4) \prop <raiz>\ - CRs approved/implemented (do scan.json, auto-gerado) x seções Pendentes/Resolvidos do PROPAGATION_STATUS.md, rnsSemDownstream via coberturaCandidatos; (5) docs emite \sequenciaRn.gaps\ e acumula \quality/scan-history.jsonl\ (1 linha/execução - insumo do gm-drift-detector).
- **Validação (golden case):** tasks: 79/79 features nos 13 módulos do <docs-repo> = ground truth do glob (0 falsos negativos); deep-parse da RN-053 (<cliente>) exato (1 task Backend/<cliente>-API, fontes resumo+heading, promovidaDe PEND-001, implementadoEm 29/09/2026). config: 0 falsos positivos após 5 ciclos de correção - achados verdadeiros confirmados por leitura direta (gm-jev-classifier com bash: allow amplo, 9 skills mcp-*-setup sem ## Tools, 2 primaries sem Precedência); armadilhas corrigidas no loop: TDZ de EXCLUDE_* (dispatcher antes das consts), ref_orfa por ordem alfabética (agentIds pré-populado), description: >- multiline não capturada (folded scalar), "M**étodo**" contendo TODO case-insensitive (trap PT-BR), indexOf casando prefixo de token maior (gm-core dentro de gm-core-update). prop: convergência exata com o PROPAGATION_STATUS real do <cliente> (CR-001 6 entradas, CR-002 8, CR-003 em Pendentes, sem registro 0). diff: 72 arquivos do worktree, RN-999 fake corretamente faltando, --strict exit 1 verificado.
- **Fronteira R4 preservada:** presença no diff != implementação da RN (reviewer julga); presença de ID em PROPAGATION_STATUS != reflexo textual (guard julga); path_maquina/marcador são candidatos (path default documentado e template legítimo podem justificar); qualidade de description permanece agêntica (+Jev).
- **Próximos passos (propostos, não aplicados):** gm-progress e gm-next consumindo tasks.json + health.json; gm-gh/azure-issue-creator lendo a estrutura do tasks.json; gate --strict da config em GitHub Action; fixtures de eval para os 4 modos.

## IMP-141 - Política de persistência de health reports (efêmero na raiz, commitável em quality/ de módulo)

- **Data:** 31/10/2026
- **Autor:** perfil ausente - registrada pelo @gm-dev (mesma sessão do IMP-140)
- **Origem:** operador questionou o AGENT_HEALTH_REPORT_2026-10-07-0152.md commitado na RAIZ do <docs-repo> (commit 5b2950f). Verificação: das recomendações do relatório, as acionáveis já estavam aplicadas (create-github-issues removida, mcp-postgres-setup registrada, órfã gm-gerar-especificacao-us corrigida) e o estado descrito não existia mais (60 skills -> 87; 33 gsd-* -> 0) — snapshot volátil commitado virou desinformação. O valor duradouro (recomendações) já vivia nos IMPs.
- **Arquivos:** skills/gm-agent-health-monitor/SKILL.md (política em Gera + Formato de commit condicional), <docs-repo> .gitignore + git rm do relatório (commit d68bda5 no repo de docs)
- **Status:** aplicada
- **Regra:** relatório de saúde de MÓDULO em quality/ = commitável (evidência de auditoria do produto, padrão VALIDATION_REPORT); relatório da CONFIG/cross-module na raiz do workspace = EFÊMERO — nunca commitar (regenerável via gm-scan.mjs config; histórico = IMPs + scan-history.jsonl + gm-drift-detector).
- **Validação:** teste de mesa — critério da tabela aplicado ao caso de origem (relatório cross-module na raiz) classifica como efêmero ✓; git rm + gitignore no <docs-repo> confirma que novos relatórios de raiz não aparecem no git status.

## IMP-142 — Camada reverse/ por produto (fila viva de candidatas + cobertura) e migration/ opcional

- **Data:** 31/10/2026
- **Alvo:** @gm-reverse-orchestrator, @gm-doc, skills gm-restructure e gm-validate, CONSTITUTION.md do repo de docs (<docs-repo>)
- **Problema:** a camada de engenharia reversa era cidadã de segunda classe — reports append-only viviam em support/ (com checkpoint configurado para o caminho do pack, vazio na prática), sem fila viva: candidatas a RN ficavam esquecidas entre rodadas (KNOWLEDGE.md AP-10) e cobertura sem série comparável (P-11).
- **Causa raiz:** instrução ausente + template incompleto — a KNOWLEDGE.md v1.2.0 (2026-10-31, domínio reverse-engineering: P-10/P-11/P-12/P-13/P-14, AP-08..AP-10) já definia a estrutura reverse/ + migration/, mas os componentes do workflow não a incorporavam.
- **Correção:** (1) orchestrator grava os 4 artefatos em `<produto>/reverse/` (globs write restritos, edit: deny), atualiza CANDIDATES.md (pending com evidência; mudanças de status com dono+data) e COVERAGE.md (definição+resultado+data+hash) ao final das Fatias 4/5, com seções 8/9 no formato de saída; (2) gm-restructure ganha modo 5 reverse-layer (migração retroativa de support/REVERSE_REPORT* e do caminho legado do pack, gerando CANDIDATES/COVERAGE apurados dos reports); (3) gm-validate ganha categorias 8-11 (approved sem RN: error; RN de origem reverse sem candidata: error; reverse/ sem COVERAGE: warning; pending antigo: warning); (4) gm-doc lê CANDIDATES.md na Etapa 3 (nunca re-pergunta graduadas) e materializa reverse/ na Etapa 4; (5) CONSTITUTION §IMP-011 recebe reverse/ + migration/ (opcional) com nota da fronteira dura.
- **Arquivos:** agents/gm-reverse-orchestrator.md, agents/gm-doc.md, skills/gm-restructure/SKILL.md, skills/gm-validate/SKILL.md, <docs-repo>/CONSTITUTION.md, WORKFLOW_IMPROVEMENTS.md
- **Status:** aplicada
- **Fronteira:** registry NÃO re-renderizado (nenhum componente novo — apenas updates; árvore de delegação inalterada); migração retroativa dos produtos é FASE SEPARADA via gm-restructure (modo reverse-layer); `migration/` nunca é criado pela migração retroativa (condicional a projeto de migração total).
## IMP-143 — Anti-gigantismo da camada reverse/: sharding por Bounded Context + reverse-index.md + arquivamento da fila

- **Data:** 02/11/2026
- **Alvo:** @gm-reverse-orchestrator, @gm-doc, skills gm-validate e gm-restructure
- **Problema:** sistema gigante escaneado gera artefatos gigantes — relatório full único de milhares de linhas (risco de geração e de leitura com atenção degradada), CANDIDATES.md crescente sem teto e leitura downstream não-seletiva (a fila inteira é relida a cada validação).
- **Causa raiz:** instrução ausente — a IMP-142 criou a camada reverse/ sem partição; a KNOWLEDGE v1.2.0 já fundamentava a correção (P-05 sumarização hierárquica, P-10 segmentos — a unidade natural é o Bounded Context, P-11 observação datada, AP-03 varredura linear como anti-pattern), mas nenhum componente definia gatilho, layout particionado nem ponto de entrada.
- **Correção:** (1) gatilho determinístico de sharding avaliado ao fim da Fatia 1 — >3 BCs OU >80 tabelas OU >60 endpoints OU projeção de report >1.500 linhas → modo staged, declarado como "Modo de layout" na seção 1 do relatório; (2) modo staged particiona os artefatos em `reverse/<BC>/` (REVERSE_REPORT_<ts>.md, CANDIDATES.md, COVERAGE.md por BC), com REVERSE_STATE.md (campos `layout` + `per_context` + `reverse_index_path`) e o novo `reverse/reverse-index.md` (TOC: BC → arquivos → contagens da última rodada + data/hash) na raiz, atualizado a cada fatia concluída e no fim do run; sistema pequeno/médio mantém layout flat; (3) arquivamento da fila — candidata graduada/rejeitada comprime para 1 linha no bloco `## Arquivo (frio)` do rodapé do CANDIDATES.md (evidência completa permanece no report da rodada de origem); área viva com `pending` + rodada corrente; (4) gm-doc Etapa 2/3: leitura seletiva obrigatória via reverse-index.md, pendentes agregadas por BC na validação, convocação de UM BC por run em staged; (5) gm-validate: categorias 8-11 resolvem CANDIDATES/COVERAGE por glob `reverse/**/` (flat E staged) + nova categoria 12 anti-gigantismo (gatilho documentado com layout flat → warning; staged sem reverse-index.md → warning); (6) gm-restructure modo reverse-layer: nota de compatibilidade — flat válido, sharding só no próximo reverse, nunca migração retroativa.
- **Arquivos:** agents/gm-reverse-orchestrator.md, agents/gm-doc.md, skills/gm-validate/SKILL.md, skills/gm-restructure/SKILL.md, WORKFLOW_IMPROVEMENTS.md
- **Status:** aplicada
- **Fronteira:** registry NÃO re-renderizado (nenhuma `description:` alterada, nenhum componente novo — árvore de delegação inalterada); knowledge/ NÃO editado nesta IMP — P-15/AP-11 entram na KNOWLEDGE v1.3.0 via gm-domain-research (pendência do primary gm-doc); nenhum produto é gigante hoje — o sharding nasce no próximo reverse que disparar o gatilho.
## IMP-144 — Fatia 6 (regras em nível de DB, jobs e cobertura imperativa) + skill gm-ui-capture (captura visual runtime, golden master de UI)

- **Data:** 02/11/2026
- **Alvo:** @gm-reverse-orchestrator (Fatia 6 — parte A), skill nova gm-ui-capture (IMP-144 — parte B), @gm-doc, skill gm-validate, registry.yaml
- **Problema:** (A) a Fatia 4 do reverse só minera validadores declarativos + domain events — regras em triggers/stored procedures/CHECK constraints/views, jobs agendados (@Scheduled/Hangfire/Quartz/cron Node/tokio-cron) e lógica imperativa de service escapam — exatamente as que se perdem numa migração total. (B) a UI do legado só era vista estaticamente (o que o código DECLARA); a experiência real (estados visuais, validações disparadas, requisições reais, console) só existe em runtime e não tinha captura — metade do harness de paridade de UI faltava.
- **Causa raiz:** instrução ausente (fatia de mineração fora-da-UI não existia no protocolo) + componente ausente (nenhuma skill de captura runtime).
- **Correção — PARTE A (Fatia 6 no orchestrator):** (1) mineração DB-level (CREATE TRIGGER / CREATE PROCEDURE / FUNCTION, constraints CHECK, views com lógica) em migrations/DDL/SQL da stack — candidatas normais em §6 com evidência própria (`[repo Migrations/X.sql:12 @hash]`) e grau Alta (executável pelo banco); (2) jobs agendados — comportamento agendado é regra ("a cada X, o sistema faz Y") → candidatas em §6; (3) proxy de cobertura imperativa (P-04 estendido): métodos públicos de service com escrita de dados OU >20 linhas sem candidata associada → lista enumerada para triagem humana (não é regra), filtro anti-ruído (getters/setters/DTOs puros excluídos); (4) §2 ganha marcação de constraints CHECK; §9 ganha 3 linhas novas + 1 proxy (triggers minerados/detectados, SPs/functions mineradas/detectadas, jobs agendados mapeados/detectados, métodos públicos de escrita com ≥1 candidata X/Y); protocolo passa a "6 Fatias"; Lê (upstream) recebe `reverse/UI_CAPTURE.md` como insumo opcional (§4 pode citar evidência visual ANEXA às âncoras estáticas — nunca substitui).
- **Correção — PARTE B (skill gm-ui-capture):** captura visual runtime via MCP Playwright (golden master de UI). Pré-requisitos duros (sem eles: abort): sistema RODANDO em dev/staging declarada no prompt (NUNCA produção — linha dura), credenciais de teste, MCP Playwright configurado (aponta para gm-mcp-playwright-setup). Algoritmo: receber rotas (Fatia 3 estática ou do operador) → autenticar → por rota capturar estados padrão (vazio, preenchido, erro de validação, modal, mobile 390×844 + desktop 1280×800) → PNGs em `reverse/ui/<rota-slug>/<estado>.png` → requisições observadas + console por tela → manifesto `reverse/UI_CAPTURE.md` (cabeçalho de proveniência: data, URL, usuário de teste, resoluções; tabela Rota|Estado|Arquivo PNG|Requisições observadas|Console|⚠️ PII|Candidatas geradas; append por rodada) → candidatas visuais em `reverse/CANDIDATES.md` (pending, evidência `[screenshot: reverse/ui/...]`, P-12). Guardas: dados sintéticos/anonimizados; toda imagem com possível dado pessoal marcada ⚠️ PII no manifesto (triagem via gm-compliance-check — nunca opina); NUNCA URL não declarada; escrita restrita a reverse/ui/**, UI_CAPTURE.md e CANDIDATES.md. Integrações: gm-doc Etapa 2 oferece a captura quando o produto tem ambiente rodável (enriquece §4 e o futuro migration/PARITY_CHECKLIST.md); gm-validate categoria 13 (PNG referenciado inexistente = error; imagem PII sem marcação = warning; sem captura = N/A).
- **Arquivos:** agents/gm-reverse-orchestrator.md, skills/gm-ui-capture/SKILL.md (nova), agents/gm-doc.md, skills/gm-validate/SKILL.md, registry.yaml (+skill domain documentacao + gm-doc.invokes_direct), ARCHITECTURE.md (views re-renderizadas — delta: nó S8, renumeração S8..S84→S9..S85, label 89 skills, Views B/C/E/F), evals/gm-ui-capture/fixture-001/ (nova — criteria 5 checks, input/ROTAS.md, output-expected/), WORKFLOW_IMPROVEMENTS.md
- **Validação:** evals gm-validate 24/24 PASS (4 fixtures — categoria 13 fica N/A nos baselines existentes); fixture nova gm-ui-capture 5/5 PASS (baseline-mode — runner valida contra output-expected/ sem execução de browser); eval --registry 5/5 PASS (registry.yaml × disco consistente, gm-ui-capture resolve)
- **Status:** aplicada — requer reiniciar o OpenCode.
- **Fronteira / pendências do primary:** (1) knowledge/ NÃO editado — incremento da fundação (mineração fora-da-UI + captura visual nos princípios do domínio reverse-engineering) via gm-domain-research fica para o primary; (2) execução real da captura (browser) é runtime — o eval cobre a estrutura por baseline; fixture executável com browser é follow-up caso o runner passe a suportar MCP Playwright; (3) graduação de candidatas visuais permanece humana (P-12 — dono + data).

- **Refinamento pós-pesquisa v1.4.0 (02/11/2026):** aplicado após pesquisa de domínio registrada em `knowledge/reverse-engineering/KNOWLEDGE.md` v1.4.0 (P-16 regras em DB/jobs/config, P-17 paridade dual + Logic Drift, P-18 captura determinística; AP-12/13) — 5 lacunas no desenho aplicado:
  1. **Fatia 6 — tabelas de configuração:** mineração de tabelas cujo CONTEÚDO (flags, thresholds, parâmetros) altera comportamento (regra dirigida por dado) — detecção por nome (`*Config*`, `*Parametro*`, `*Setting*`, `*Flag*`) + consumo por regra já minerada; candidata com grau **Média** ("comportamento dirigido por dado — validar com o operador"), evidência `[repo tabela+consumidor @hash]`.
  2. **Fatia 6 — sinalização cross-unit:** chamadas entre procedures (`EXEC`/`CALL`), cascatas de trigger (tabela A → trigger → tabela B) e transaction boundaries multi-unidade → **candidato a PEND-XXX** em §7 ("a regra é maior que a unidade onde foi encontrada — boundaries atravessam procedures, triggers cascateiam"), evidência dos pontos de conexão.
  3. **gm-ui-capture — transições comportamentais (Logic Drift — P-17/AP-12):** fluxos multi-passo capturam a TRANSIÇÃO (passo N → avançar → passo N+1, registrando o que foi limpo/persistido), validação onBlur vs onClick disparada quando detectável, dados que reaparecem ao voltar; cada comportamento → candidata **comportamental** com evidência `[screenshot: fluxo-<nome>/passo-N+1.png]` + descrição da transição; manifesto ganha `Tipo evidência` (`estado` | `transição`).
  4. **gm-ui-capture — determinismo no manifesto (P-18):** colunas novas `Regiões dinâmicas mascaradas` (timestamps/animações excluídos quando possível) e `Threshold de paridade` (default `≤0,5% pixels`, anotado por tela — comparação old-vs-new futura sem recaptura); nota no cabeçalho: captura determinística (viewport fixo, fixture sintética) é pré-condição de comparabilidade.
  5. **gm-ui-capture — ária snapshot arquivado (P-17):** `reverse/ui/<rota-slug>/<estado>.aria.yml` (árvore AX em YAML) por estado — artefato de comparação ESTRUTURAL old-vs-new (sobrevive a redesign; label/perfil acessível perdido move zero pixels) — metade semântica da paridade dual; PNG é a metade visual; manifesto ganha coluna `Ária .yml`.
  - **Arquivos:** agents/gm-reverse-orchestrator.md, skills/gm-ui-capture/SKILL.md
  - **Validação:** eval gm-ui-capture fixture-001 (baseline-mode) PASS; health check F.10-13 sem findings nos 2 arquivos
  - **Status:** aplicada — requer reiniciar o OpenCode.


## IMP-145 — Comunicação nas perguntas de decisão (tool question) nos primary agents

- **Data:** 02/11/2026
- **Alvo:** `@gm-doc`, `@gm-req`, `@gm-dev`, `@gm-devops`
- **Problema:** perguntas via tool `question` durante a medição de acurácia (sessão do gm-doc, 02/11/2026) estavam robóticas — telegráficas, com jargão interno não explicado (`rev✓`, "âncora desviou", `CAND-G036`) e opções sem descrição (botões "Correta"/"Truncada" vazios). Feedback direto do operador pedindo melhoria permanente.
- **Causa raiz:** instrução ausente — os prompts dos primaries não tinham diretriz para a interface de decisão do operador; o OUTPUT STYLE "concise" (que vale para o CHAT) foi extrapolado para a tool `question`, onde clareza vence brevidade.
- **Correção:** nova seção `## Comunicação nas perguntas de decisão (tool question)` inserida antes de `## Encerramento de turno (anti-idle, IMP-085)` nos 4 primary agents — linguagem natural completa (1-2 frases de contexto), jargão só com explicação inline, toda opção com descrição da consequência, evidência técnica traduzida antes do veredito.
- **Arquivos:** `agents/gm-doc.md`, `agents/gm-req.md`, `agents/gm-dev.md`, `agents/gm-devops.md`, `WORKFLOW_IMPROVEMENTS.md`
- **Evals:** sem fixtures de eval para primary agents (evals cobrem skills) — aviso registrado conforme delegação; health check estrutural F.10-13 executado nos 4 arquivos editados (sem findings).
- **Status:** aplicada

## IMP-146 — Qualidade/fluxo do insumo reverse: postura de segurança observada, delta padronizado, errata de âncoras, triagem PII mecânica e auto-suficiência do report

- **Data:** 02/11/2026
- **Alvo:** @gm-reverse-orchestrator, skill gm-validate
- **Problema:** auditoria de qualidade do insumo reverse do <cliente> (primary + operador, 02/11/2026) — o REVERSE_REPORT.md do <cliente> tinha a seção "6. Segurança" excelente (tabela Aspecto | Implementação | Evidência: auth staff/cliente, tenant, lockout, CORS, Data Protection, webhooks, máscara de PII em logs) que a padronização do template descartou; o delta de 21/09 (`### 8.x Feature → Commits → Modelo/API/UI/Background → RNs/PENDs`) era o melhor formato de delta produzido mas não era formato oficial; âncoras corrigidas pós-publicação (pós-medição de acurácia, na fila CANDIDATES) não tinham convenção — e reports são append-only; marcação ⚠️ PII dependia de julgamento sem varredura ativa por padrões de nome; o report não declarava se se lê sozinho ou depende de downstream.
- **Causa raiz:** template incompleto + instrução ausente — o Formato de Saída do orchestrator não tinha seção de segurança, o protocolo não fixava formato de delta nem convenção de errata, e a Fatia 2 não prescrevia varredura mecânica de PII; o gm-validate não checava omissão de marcação nos reports.
- **Correção:** (P1) Formato de Saída ganha "## 5. Segurança (Postura Observada) (IMP-146)" — tabela Aspecto | Implementação | Evidência minerando auth staff/cliente, multi-tenant, lockout/bloqueio, CORS, Data Protection, webhooks (tokens), PII em logs/DTOs; fontes: middlewares, setup de auth em DI, cookies/JWT; somente POSTURA OBSERVADA, sem juízo de vulnerabilidade (análise formal segue na skill gm-security-audit); caso de borda "não observado no escopo" registrado — nunca omitir a seção; seções seguintes renumeradas 6-10 com todas as referências internas atualizadas (§6→§7 regras, §7→§8 PENDs, §8/§9→§9/§10 fila/cobertura). (P2a) Formato oficial do delta fixado no Princípio 7: `## N. Delta — Modificações pós-reversa (<data>)` + por feature `### N.x Feature: <nome>` → Commits → Modelo/API/UI/Background → RNs/PENDs geradas, cada sub-bloco com destino downstream (padronizado do delta <cliente> 21/09). (P2b) Convenção Errata: report publicado NUNCA é reescrito — a correção de âncoras vive na FILA (CANDIDATES.md) e o cabeçalho do report ganha 1 linha: `> Errata (<data>): âncoras das RNs X,Y,Z corrigidas em reverse/CANDIDATES.md — o corpo histórico mantém as âncoras originais.` (P3) Fatia 2 marca ⚠️ PII em TODO agregado com varredura ativa por padrões de nome (Cpf, Cnpj, Email, Telefone/Celular, Endereco/Endereço, DataNascimento, NumeroCartao/cartão e variantes) + gm-validate categoria 14: agregado do report §2 com campo que casa padrão de PII sem tag → warning (nunca error — report pré-padronização ou omissão; reports são append-only, a marcação vale para rodadas novas). (P5) Cabeçalho do report ganha `> **Auto-suficiência:** <completa | parcial — evidências completas das regras em <destino>>` — o orchestrator declara se o report se lê sozinho ou depende de downstream (ex. <cliente>: "parcial — evidências completas no REQUIREMENTS §5").
- **Arquivos:** agents/gm-reverse-orchestrator.md, skills/gm-validate/SKILL.md, WORKFLOW_IMPROVEMENTS.md
- **Validação:** evals gm-validate — 4 fixtures, 24/24 PASS (categoria 14 fica N/A nos baselines existentes); health check F.10-13 nos 2 arquivos editados — sem findings.
- **Status:** aplicada — requer reiniciar o OpenCode.
- **Fronteira:** registry/views NÃO re-renderizados (nenhuma `description:` alterada, nenhum componente novo — árvore de delegação inalterada); knowledge/ NÃO editado (fundação: KNOWLEDGE v1.4.0 consumida como base); <docs-repo>/<cliente>/reverse/ NÃO editado nesta IMP (backfill do COVERAGE do <cliente> é do primary, em paralelo).

---

## IMP-147 — Tríade O/I/U e ledger de unknowns residuais no @gm-reverse-orchestrator (P1 REA)

- **Data:** 04/11/2026
- **Autor:** @gm-workflow-improver — sessão delegada pelo primary gm-doc; perfil de operador ausente → regra IMP-136 ("quem registrou")
- **Origem:** análise do repo externo `morluto/rea` (REA — Reverse Engineer Anything; docs/mcp-prompts.md — o agente mantém observations/inferences/unknowns distintos e fecha cada rodada com `audit_residual_unknowns`). O operador aprovou aplicar APENAS as melhorias P1 (P2/P3 ficaram na conversa, sem registro).
- **Arquivos:** `agents/gm-reverse-orchestrator.md`; WORKFLOW_IMPROVEMENTS.md
- **Status:** aplicada

### Problema

O raciocínio da varredura reversa não era padronizado: fato, inferência e pergunta aberta podiam se misturar no mesmo enunciado. Perguntas que o código analisado não respondeu não tinham fila técnica própria — só existiam as filas de negócio (candidatas §§9 e PEND §8). O §7 aceitava candidata "Baixa" por nomenclatura e o §8 misturava ambiguidade com evidência.

### Causa raiz

Instrução ausente no prompt do subagent (registro de raciocínio e de unknowns) e template do report sem seção de unknowns.

### Correção

1. Subseção "Tríade O/I/U — Raciocínio da Varredura": **O** = fato com evidência `[arquivo:linha @hash]`; **I** = inferência rotulada e apoiada nas O's que a sustentam (I sem O correspondente vira U); **U** = pergunta aberta que o código não respondeu. Candidata nasce SÓ de O; U nunca é candidata nem vira fato.
2. Ledger de unknowns residuais: `reverse/UNKNOWNS.md` (flat) ou `reverse/<BC>/UNKNOWNS.md` (staged, contagem de U's open no `reverse-index.md` — IMP-143). Ciclo `open → evidence-qualified → resolved/obsolete`, dono + data em toda mudança de status (P-12/AP-10; transições decididas pela própria varredura registram dono `reverse-agent` + data). IDs `U-NNN` sequenciais; toda rodada termina com auditoria de residual unknowns (análogo ao REA); unknowns `open` são "next probes" da retomada (REVERSE_STATE.md / contexts_pending).
3. Integrações: globs de `write` do front matter (UNKNOWNS.md flat e staged); "Gera (downstream)" lista o ledger; REVERSE_STATE ganha `unknowns_path` (raiz e per_context); report ganha a seção 11 "Unknowns Residuais da Rodada", linha "Unknowns (IMP-147)" na seção 1, nota na legenda do §7 (exemplo RN-004 "Baixa" por nomenclatura vira U), nota de origem O no §9, pergunta O/I/U no CoVe e Casos de Borda (primeira rodada = cinco arquivos; escrita negada cobre UNKNOWNS.md).

### Compatibilidade e validação

- IMP-142/143/144/146 preservados (mesma disciplina P-12; layouts flat/staged). Registry/ARCHITECTURE intocados (descriptions intactas — sem re-render do `gm-registry-render`).
- Evals não aplicáveis: mudança em agent, não em skill (precedente IMP-020).
- Health check textual pós-edição (IMP-086/087/097): 16/16 pares aplicados atômicamente; sem BOM; delimitadores e `permission:` íntegros.
- Lição de transporte: canal shell corrompe acentos e REJEITA U+2014 no scanner — aplicar com texto como escapes unicode via PowerShell (precedente imp.ps1/IMP-099).

---

## IMP-148 — Escopo de tools como requisito de skill (P1 REA)

- **Data:** 04/11/2026
- **Autor:** @gm-workflow-improver — sessão delegada pelo primary gm-doc; perfil de operador ausente → regra IMP-136 ("quem registrou")
- **Origem:** mesma análise do `morluto/rea` — "tool families": só anunciar um workflow cuja família de tools está habilitada ("a rendered prompt never directs the agent to a disabled call"). O operador aprovou somente as P1; varredura em massa das skills existentes fica para demanda futura.
- **Arquivos:** `skills/gm-agent-health-monitor/SKILL.md`, `skills/gm-skill-creator/SKILL.md`; WORKFLOW_IMPROVEMENTS.md
- **Status:** aplicada

### Problema

Skill podia direcionar tools/MCP indisponíveis na sessão sem caminho alternativo documentado; o health monitor detectava apenas referências órfãs de SKILLS (IMP-080), não de tools.

### Causa raiz

Checklist sem o item (`gm-agent-health-monitor`) e template incompleto (`gm-skill-creator` sem declaração de escopo de tools).

### Correção

1. `gm-agent-health-monitor`: item 8b, transversal na Verificação F — tool/MCP citada inexistente no catálogo da sessão corrente nem configurada (`opencode.jsonc` global/projeto), ou **hard-dependency** do fluxo sem guard de disponibilidade → finding **não-bloqueante**, na MESMA seção das referências órfãs de skills (IMP-080). Linha no template da seção F: "Refs de tools/MCP pendentes (IMP-148, não-bloqueante)".
2. `gm-skill-creator`: regra 5 do template — a skill direciona SOMENTE tools cuja disponibilidade ela mesma verifica, com cláusula de fallback documentada quando indisponível (padrão IMP-080); nota no template da seção Tools; novo passo 6 "Escopo de tools" no Workflow (renumerados 6→7, 7→8, 8→9, 9→10).

### Compatibilidade e validação

- IMP-080 preservado (o item 8 de skills continua válido). Sem mudança de descriptions → registry/ARCHITECTURE intactos, sem re-render.
- Evals: run-evals -Skill gm-agent-health-monitor → 5/5 PASS; -Skill gm-skill-creator → 8/8 PASS (relatório 2026-11-04-220024).
- Health check textual (IMP-086/087/097): 2/2 pares por skill; sem BOM; front matter íntegro.
- Nota: primeira execução do eval da skill-creator apresentou warning no write do `trends.json` ("O fluxo não era legível" — lock de stream); o retry do mesmo fixture passou limpo (suite segue verde). Verificar tendências na próxima leva.

## IMP-149 — Vocabulário Reversa na camada reverse: força de evidência (confirmed/inferred/gap) na fila CANDIDATES, traceability_density no COVERAGE e severidade de bloqueio

- **Data:** 05/11/2026
- **Autor:** @gm-workflow-improver — sessão delegada pelo primary gm-doc; perfil de operador ausente → regra IMP-136 ("quem registrou")
- **Origem:** pesquisa competitiva do gm-doc (05/11/2026) — paper "Reversa: A Reverse Documentation Engineering Framework for Converting Legacy Software into Operational Specifications for AI Agents" (IFG/UFG, arXiv 2605.18684, 18/05/2026), peer quase 1:1 do fluxo reverse do Golmet. Crosswalk completo: <docs-repo>/REVERSA_ALINHAMENTO_2026-11-05.md (artefato do produto — leitura apenas). O operador aprovou o plano nesta sessão (gate Plan-first, IMP-053) e NÃO autorizou commit/push — publicação é da gm-core-publish por pedido explícito.
- **Alvo:** @gm-reverse-orchestrator; knowledge/reverse-engineering/KNOWLEDGE.md
- **Status:** aplicada — requer reiniciar o OpenCode.

### Problema

A fila `CANDIDATES.md` (IMP-142) só expressa status de governança (`pending`/`approved→RN-NNN`/`rejected`/`promoted→PEND-XXX`) — toda candidata nasce `pending` genérico, indistinguível entre "evidência direta no código" e "inferência por padrão". `COVERAGE.md` não tem métrica de densidade de rastreabilidade (protocolo Tabela 3 do paper). Gaps/PENDs não carregam severidade de bloqueio.

### Causa raiz

Template incompleto + instrução ausente: o template §9 do Formato de Saída não tinha coluna de força de evidência (o grau Alta/Média/Baixa já era computado no Princípio 8, mas nunca chegava à fila); o §10 e o P-11 do KNOWLEDGE não definiam traceability_density; o §8 não tinha tag de severidade.

### Correção

1. Coluna `Força` na fila (Princípio 8 + bullet de persistência + legenda e tabela do §9): mapeamento determinístico do grau já existente — **Alta → `confirmed`** (evidência executável/determinável: validação executada, evento de domínio, autorização explícita), **Média → `inferred`** (padrão recorrente/nome/fluxo, schema sem determinação do comportamento), **`gap`** (indeterminável) = U (IMP-147) → destino natural `promoted→PEND-XXX`. Complementa o status, NUNCA substitui a graduação humana dono+data (P-12); rodadas pré-IMP-149 sem coluna não são retro-editadas.
2. Métrica `traceability_density` = âncoras `[arquivo:linha]` ÷ RNs + candidatas + PENDs documentadas na rodada — linha dedicada no §10/COVERAGE.md seguindo o protocolo P-11 (definição + resultado + data/hashes); distribuição opcional `confirmed/inferred/gap`. Divergência consciente documentada no KNOWLEDGE: o paper conta schema como claim `confirmed`; no Golmet, determinação de comportamento a partir de schema continua `inferred` (rigor maior, alinhado à graduação humana).
3. Tag opcional `(blocking)`/`(cosmetic)` nos candidatos a PEND (§8) — severidade de bloqueio orienta a prioridade da validação humana antes de ações downstream; sem marca = indecisa para triagem (P-12).
4. KNOWLEDGE reverse-engineering v1.4.0 → v1.4.1: fonte Reversa (arXiv 2605.18684, acessado 2026-11-05); parágrafos novos em P-11 (métrica da rodada) e P-12 (crosswalk de força de evidência); linhas da tabela síntese de COVERAGE e CANDIDATES estendidas; 3 novos itens no Checklist aplicável (força na fila, traceability_density no COVERAGE, severidade opcional).

### Compatibilidade, arquivos e validação

- IMP-142/143/144/146/147 preservados: status de governança, arquivamento frio da fila, flat/staged e a tríade O/I/U intocados. Retrocompatível — fila sem coluna `Força` continua válida; o mapeamento parte do grau já computado.
- Sem `description:` alterada em nenhum componente → registry.yaml/ARCHITECTURE.md intocados, sem re-render do gm-registry-render.
- Fora de escopo nesta rodada (decisões do doc de alinhamento): parity specification (§3.4), índice de confiança auto-calculado (decisão de NÃO adotar como prova — §6), porta-multi-engine; e a propagação do vocabulário às RNs em REQUIREMENTS (gm-req) e ao TRACEABILITY.md downstream — propostas futuras.
- Arquivos: agents/gm-reverse-orchestrator.md; knowledge/reverse-engineering/KNOWLEDGE.md; WORKFLOW_IMPROVEMENTS.md. Nenhum repo de produto alterado; sem commit/push.
- Evals: sem fixtures para a camada reverse (suites cobrem skills; a mudança é em agent + knowledge — precedente IMP-147/IMP-020) → pendência registrada: fixture da fila/cobertura a criar quando houver rodada real de reverse como insumo golden (nunca inventar caso no golden set humano — IMP-100).
- Health check textual pós-edição (IMP-086/087/097): front matter íntegro nos 2 artefatos editados (delimitadores, YAML parseável, permission:, sem BOM). Edição aplicada via Node com escapes unicode (lição IMP-147 — o canal shell corrompe acentos e U+2014).
## IMP-150 — Referência de versão do KNOWLEDGE reverse-engineering no "Lê" do @gm-reverse-orchestrator (drift pós-IMP-149)

- **Data:** 05/11/2026
- **Autor:** @gm-workflow-improver — retomada da sessão do IMP-149; correção do resíduo aprovada pelo operador
- **Alvo:** @gm-reverse-orchestrator
- **Problema:** o bloco "Lê (Upstream)" citava `knowledge/reverse-engineering/KNOWLEDGE.md` v1.2.0 com princípios P-01..P-14 e AP-01..AP-10 — o arquivo real estava em v1.4.1 (IMP-149) com P-01..P-18 e AP-01..AP-13. Drift de referência/cross-dependency detectado como resíduo do IMP-149.
- **Causa raiz:** o KNOWLEDGE evolui via IMPs sem passo de sincronização das referências de versão nos consumidores — referência somente leitura (sem efeito de comportamento), mas induz o leitor ao catálogo de princípios antigo.
- **Correção:** "Lê" atualizado para v1.4.1, P-01..P-18 e AP-01..AP-13; front matter do KNOWLEDGE e o restante do agent intocados. Nota: `KNOWLEDGE v1.2.0 P-05` no Princípio 10 do agent (linha ~167) mantida como proveniência histórica do IMP-143 (fundação do sharding), não atualizada.
- **Consolidação (mesma sessão):** `agents/gm-doc.md:123` — segundo consumidor da mesma classe de drift (v1.2.0 → v1.4.1; menção a P-12 mantida, ainda válida na base atual).
- **Arquivos:** agents/gm-reverse-orchestrator.md; agents/gm-doc.md; WORKFLOW_IMPROVEMENTS.md
- **Evals:** sem fixtures para agents (precedente IMP-147) — health check F.10-13 reaplicado no agent após a edição.
- **Status:** aplicada — requer reiniciar o OpenCode.
- **Associação:** fecha o resíduo registrado no IMP-149.

## IMP-151 — Nudge de validação Golmet: plugin tool-hook que obriga gm-validate após edição de artefatos

- **Data:** 05/11/2026
- **Autor:** operador Souza (via gm-doc)
- **Origem:** sessão gm-doc — pergunta "o Golmet tem hooks de validação?" levou a discussão plugin V2 vs git hooks vs mecanismo declarativo; design em 3 camadas refinado e aprovado pelo operador para registro como pendência
- **Contexto técnico (base da decisão):** OpenCode V2 não tem hook declarativo no opencode.jsonc (campo `hook` é legado V1, deprecated — não usar). Catálogo V2 existente só na plugin API: `ctx.tool.hook("execute.before/after")`, `ctx.session.hook` (`prompt`, `context`, `compaction`, `generate`, `title`, `model.request`, `http.request`, `http.response`, `retry`), `ctx.permission.hook("evaluate")`, `ctx.shell.hook("create.before")`, `ctx.event.subscribe`. Não existe hook de fim de turno — a solução desenha em função desse limite.
- **Problema:** validação do workflow (`gm-validate`, `gm-wiki-lint`, `gm-decision-audit`) é on-demand por skill; nada garante que o agente encerra o turno com artefatos do produto (REQUIREMENTS.md, specs/, reverse/ etc.) editados sem validação rodada.
- **Design proposto (3 camadas):**
  1. **Nudge conversacional (camada principal):** plugin V2 no padrão do `anti-idle-detector` (`Plugin.define({ id, setup(ctx) })` + `ctx.tool.hook`) — `tool.execute.after` de `write`/`edit` que toque artefato do produto (<REPO_DOCS>/<Produto>/...) marca dirty em `ctx.storage`; na **próxima chamada interceptável após dirty** (`bash`/`execute`), o plugin nega com erro instrutivo ("artefatos Golmet mudaram — rodar `gm-validate` antes de encerrar o turno") e reseta o dirty. O throw volta visível ao modelo (mesmo canal do anti-idle) — única forma de fechar o loop com o agente.
  2. **Política declarativa (opcional):** `ctx.session.hook("context")` injetando 1 linha no system quando a sessão está no repo de docs do produto (soft enforcement).
  3. **Gate determinístico fora do runtime (complemento):** pre-commit hook git no repo de docs do produto + CI no push, com checagem de lista fechada (front matter de Feature.md, referências `RN-NNN`/`PEND-XXX` órfãs). Não substitui a validação agêntica da DAG (julgamento permanece agêntico — IMP-043 R4); git hooks não falam com o modelo.
- **Restrições:** plugin é workflow-level — vive em `~/.config/opencode/plugins/` e nunca edita repos de produto; API V2 (lições `err_f60fdb78`/`err_d19444b4` do anti-idle: não exportar hooks V1); sem chamada LLM no hot path (execução determinística barata; `permission.evaluate` com LLM fica fora do MVP).
- **Arquivos:** WORKFLOW_IMPROVEMENTS.md (este registro)
- **Status:** proposta — pendência registrada para o `@gm-workflow-builder`


## IMP-152 — Grafo de conhecimento: clique humano nunca selecionava (click-vs-drag) e canvas morto durante o layout assíncrono

- **Data:** 06/11/2026
- **Autor:** operador Souza (via gm-doc → @gm-workflow-improver)
- **Origem:** relato do operador na sessão gm-doc — o HTML do `gm-knowledge-graph` não permitia selecionar os nós/grafos nos 3 artefatos de <docs-repo>.
- **Problema:** clicar/selecionar nós no HTML gerado não respondia. Reprodução empírica (Playwright, clique humano simulado com micro-movimento de 2px entre press e release): `sel` permanecia null e o painel de atributos não abria — enquanto clique sintético SEM movimento selecionava (por isso o bug não apareceu na criação da skill).
- **Causa raiz:** 2 bugs de interação no template HTML embutido em `buildHtml()` (`scripts/build-knowledge-graph.mjs`) — (1) o handler `pointermove` setava `moved = true` em QUALQUER movimento durante o press, então o tremor humano de 1–2px convertia todo clique em arrasto e o `pointerup` só selecionava com `!moved`; (2) no caminho de layout assíncrono (grafos >= 200 nós), `cv.style.pointerEvents = "none"` + early-return no `pointerdown` deixavam o canvas morto durante o layout (cliques ignorados em silêncio).
- **Correção:** threshold click-vs-drag de 4px (Manhattan, com histerese — micro-movimento <= 4px não vira arrasto nem desloca o nó); clique/pan/zoom permitidos durante o layout assíncrono (removido o desligamento de pointer-events; drag de nó continua bloqueado no layout, pois as forças sobrescrevem a posição); pan com deltas explícitos (`lx/ly`) em vez de `ev.movementX` (robustez touch/NaN). Extra: modo `--from-json <graph.json>` no script — re-emite HTML/MD a partir de um graph.json existente sem re-parsear fontes nem alterar dados (usado para regenerar os artefatos de <docs-repo> com grafo congelado).
- **Arquivos:** skills/gm-knowledge-graph/scripts/build-knowledge-graph.mjs; skills/gm-knowledge-graph/SKILL.md (contrato de interação no "Gera" + flag no Passo 2); evals/gm-knowledge-graph/fixture-001/output-expected/ (baseline regenerado com o template corrigido — dados idênticos, criteria inalterados); <docs-repo>/knowledge-graph{,-Golmet,-<cliente>}/ regenerados via --from-json (graph.json intocado).
- **Evals:** 29/29 PASS (runner --skill gm-knowledge-graph, fixture L0). Validação browser-in-the-loop: clique humano seleciona alvo exato (sync 150 nós e async 371 nós, inclusive DURANTE o layout), drag segue o ponteiro sem re-seleção, pan/zoom/filtro ok, console limpo.
- **Status:** aplicada — requer reiniciar o OpenCode.
- **Nota de validação:** a reprodução usou server HTTP local efêmero (MCP Playwright bloqueia file://); dados do grafo são inline no HTML, então http não altera a semântica do teste.

## IMP-153 — Guardas anti-carry-over no MANIFEST do gm-core-publish (hashes duplicados silenciosos)

- **Data:** 07/11/2026
- **Autor:** operador Souza (via gm-doc → @gm-workflow-improver)
- **Origem:** incidente real 07/11/2026 na execução do `$gm-core-publish` — a regeneração do MANIFEST dropou a linha mandatória `$[Console]::OutputEncoding = UTF8` (Passo 3.7, bug 18/10) e revelou um modo de falha NOVO, pior que o documentado.
- **Problema:** `$git ls-files` retornou ANSI → ~20 paths com em-dash/acento viraram mojibake; `$Join-Path` montou paths inexistentes e `$Get-FileHash -LiteralPath` falhou de forma não-terminating; no PowerShell, a atribuição `$h = (Get-FileHash ...).Hash.ToLower()` sob falha não-terminating MANTém o valor da iteração anterior → ~20 arquivos receberam o hash do arquivo anterior (ex.: `$OPTIONS.md` == `$RN-030 — Analise-Funcional.md`, mesmo hash `$8c169f34...`). A validação de contagem PASSOU (888/888) — contagem mede cobertura, não corretude — e o MANIFEST corrompido foi commitado (32e3398); detectado por forense de duplicatas, corrigido com regeneração correta + `$commit --amend` → ed1dedc (nunca pushado corrompido).
- **Causa raiz:** Template incompleto + falta de validação no Passo 3.7 — o passo documentava encoding/UTF-8 e contagem, mas não tinha guarda por iteração (path/formato do hash), validação pós-escrita por linha, nem o modo de falha carry-over documentado (hash vazio era o sintoma descrito; o modo real foi hash duplicado do arquivo anterior).
- **Correção:** Passo 3.7 do `$gm-core-publish` ganhou as 4 guardas validadas em produção (888/888 sem falha): (1) guarda de path `$Test-Path -LiteralPath` + throw antes do hash; (2) guarda de formato `$h -notmatch '^[0-9a-f]{64}$'` + throw por iteração; (3) validação pós-escrita — toda linha do MANIFEST casa `^[0-9a-f]{64}  .+` antes do commit; (4) modo de falha carry-over documentado nos Casos de Borda + forense de duplicatas (`$Group-Object` por hash) como detecção complementar; Modo de erro ganhou abort obrigatório para MANIFEST suspeito.
- **Arquivos:** skills/gm-core-publish/SKILL.md (Passo 3.7, Modo de erro, Casos de Borda, Workflow item 6); evals/gm-core-publish/fixture-001/criteria.yaml (+2 checks, 8 → 10); evals/reports/EVAL_REPORT_agentico_skill-gm-core-publish_2026-11-07-*.md; evals/trends/trends.json (entrada 07/11 — Golden Set fresco para a próxima publicação).
- **Evals:** 13/13 PASS (modo agêntico — fixtures 001/002 são `$mode: manual`; fixture-001 10/10 checks, fixture-002 3/3 contra output-expected intocado).
- **Status:** aplicada — requer reiniciar o OpenCode. Nada commitado/pushado: a publicação do IMP-153 é decisão do operador via `$gm-core-publish`.
