
# GLOSSARY — Glossário do Workflow Golmet

Glossário dos termos específicos usados no workflow Golmet.

---

## A

### Acúmulo
Pasta do pack (`accumulation/`: `patterns/`, `metrics/`, `reverses/`) com o conteúdo orgânico da organização. Versionado no pack, NUNCA instalado no runtime (IMP-111). Ponte de contribuição: generalizar → PR no core.

### ADR (Architecture Decision Record)
Registro de uma decisão arquitetural. Documenta **o que foi decidido**, **por que** e **quais consequências**. No Golmet, os ADRs são mantidos em `DECISIONS.md` (do workflow) e em `DECISIONS.md` (dos módulos).

### API (Application Programming Interface)
Interface de Programação de Aplicações. No Golmet, documentada em `API_CONTRACTS.md` com endpoints, métodos, request/response e validações.

### Artefato
Documento gerado pelo pipeline Golmet. Pode ser de negócio (`REQUIREMENTS.md`, `SCOPE_AGREEMENT.md`) ou técnico (`DATA_MODEL.md`, `API_CONTRACTS.md`, `UI_SPEC.md`).

---

## B

### Blade
Tipo de componente no OpenCode para.carregar skills. Não confundir com "skill" — blade é o mecanismo de carregamento, skill é o conteúdo.

---

## C

### CR (Change Request)
Solicitação de mudança em requisito já confirmado. Registrado em `CHANGE_REQUESTS.md` com status `pending`, `approved`, `rejected` ou `implemented`. CRs aprovados disparam re-propagação downstream.

### DAG (Directed Acyclic Graph)
Grafo Acíclico Direcionado. No Golmet, representa a ordem de dependência entre documentos:
```
PROJECT_CHARTER → REQUIREMENTS → [DATA_MODEL, API_CONTRACTS, UI_SPEC, ...] → [TEST_STRATEGY, TASKS, ...]
```

### Drift
Desalinhamento entre documentos. Ocorre quando um artefato upstream é atualizado mas os downstream não foram regenerados. Detectado por `@gm-cr-propagation-guard`.

---

## D

### Domain (Domínio)
Categoria de funcionamento no pipeline Golmet. Exemplos: Intake, Requisitos, Tradução Técnica, Qualidade, Azure, Figma, Legal. Cada domínio tem um orquestrador padrão.

---

## E

### ECA (Estrutura de Componentes Abstrata)
No contexto do OpenCode, refere-se à estrutura interna de como skills e agents são organizados. Não confundir com ECA Digital (Lei nº 15.211/2025).

---

## F

### Fan-out
Padrão de design onde uma entrada gera múltiplas saídas paralelas. No Golmet: `REQUIREMENTS.md` faz fan-out para 7 artefatos de tradução técnica.

### Fail-open
Comportamento de um sistema que, ao encontrar erro, continua executando em vez de abortar. Usado no gate de duplicidade de tasks (IMP-023) para não bloquear por erro de infraestrutura.

---

## G

### Gate
Ponto de verificação obrigatório antes de prosseguir. Exemplos:
- **Gate de revisão:** TASKS.md deve existir e ser revisado antes de criar tasks no AzDO (IMP-011)
- **Gate de duplicidade:** verificar tasks existentes antes de criar (IMP-023)
- **Gate de qualidade:** VALIDATION_REPORT aprovado antes de criar PBI

### Golmet
Plataforma de orquestração de requisitos, documentação técnica e desenvolvimento assistido por IA. Construída sobre skills e subagents de engines de coding (OpenCode, Claude Code).

---

## H

### Handover
Transferência de conhecimento sobre um módulo. No Golmet, feito pela skill `gm-handover` que gera um veredito (finalizado/em andamento/bloqueado/não iniciado) e um guia de leitura.

---

## I

### IMP (Improvement)
Melhoria aplicada ao workflow Golmet. Registrada em `WORKFLOW_IMPROVEMENTS.md` com formato padronizado (IMP-001, IMP-002, ...).

### Intake
Fase inicial do pipeline Golmet. Captura o charter do projeto, contexto legado e faz perguntas estruturadas. Skills: `gm-charter`, `gm-init`, `gm-reverse`.

---

## L

### Legacy Context
Documentação de sistema legado relevante ao módulo. Gerado por `gm-reverse` quando `PROJECT_CHARTER.md` indica `legado: true` ou `sistema_existente: true`.

---

## M

### MCP (Model Context Protocol)
Protocolo para integração de ferramentas externas com o OpenCode.

### Merge Incremental
Estratégia de atualização de documentos que preserva IDs e conteúdo existente, adicionando apenas novos itens. Usado por `gm-requirements` para evitar renumeração.

### Menor Privilégio
Princípio de segurança: cada componente deve ter apenas as permissões necessárias para sua função. Subagents têm permissão escopada; primary agents têm permissão ampla (risco controlado).

---

## O

### Orchestrator (Orquestrador)
Subagent que coordena múltiplas skills de um domínio. Exemplos: `@gm-intake-orchestrator`, `@gm-translation-orchestrator`. Diferente de "auto-contido" (que não invoca skills).

---

## N

### Neutrality gate
Verificação determinística (`evals/neutrality/scan.sh`) que falha se conteúdo identificado de organização/cliente entrar na base aberta do core. Roda no CI, no pre-push e antes de cada release pública (IMP-111).

## P

### Pack
Camada de conteúdo de uma organização no open core: repo privado com `pack.yaml` (`provides` instaláveis no runtime + `accumulation/` nunca instalado). Criado pelo `gm-pack-scaffold`, atualizado pelo `gm-pack-update`. Contrato em `PACK_SCHEMA.md`.

### PEND (Pendência)
Item de esclarecimento pendente. Registrado como `PEND-XXX` no `REQUIREMENTS.md`. IDs são imutáveis.

### Primary Agent
Agente principal ativo na sessão. No Golmet compõe a Quadri: `gm-req` (Requisitos), `gm-doc` (Documentação), `gm-dev` (Desenvolvimento) e `gm-devops` (DevOps). Tem permissão ampla para coordenar subagents.

### Propagation Status
Estado de atualização dos artefatos downstream. Detectado por `@gm-cr-propagation-guard` e registrado em `PROPAGATION_STATUS.md`.

---

## R

### RN (Regra de Negócio)
Regra de negócio documentada no `REQUIREMENTS.md`. IDs são `RN-XXX` e imutáveis.

---

## S

### Scope Agreement
Documento de alinhamento com o cliente em linguagem de negócio. Gerado por `gm-scope`. Atualizado a cada novo lote de requisitos ou CR aprovado.

### sources.yaml
Lockfile do runtime (`.Golmet/sources.yaml`): pack@versão + commit exato + paths instalados de cada pack. Garante reprodutibilidade entre operadores (IMP-111).

### Skill
Bloco de conhecimento sob demanda. Executável isoladamente ou composto em fluxos maiores. Sem estado (não retém dados entre execuções).

### Stale
Artefato desatualizado em relação a um upstream modificado. Detectado por `@gm-cr-propagation-guard`.

### Subagent
Agente especializado com permissão escopada. Orquestra skills do seu domínio. Exemplos: `@gm-intake-orchestrator`, `@gm-translation-orchestrator`.

---

## T

### Task
Unidade de trabalho. No Golmet, especificada em `TASKS.md` antes de ser criada (gate de revisão).

### Traceability (Rastreabilidade)
Capacidade de rastrear um requisito desde sua origem até a implementação. No Golmet: matriz de rastreabilidade em `TRACEABILITY.md`.

### Translation (Tradução Técnica)
Fase do pipeline que converte requisitos de negócio em artefatos técnicos: DATA_MODEL, API_CONTRACTS, UI_SPEC, ARCHITECTURE, GLOSSARIES, ACCEPTANCE_CRITERIA.

---

## V

### Validation Report
Relatório de validação de integridade da DAG. Gerado por `gm-validate`. Lista findings (erros, warnings) e sugere skills corretivas.

---

## W

### Working Tree
Estado dos arquivos no repositório Git. Se "sujo" (arquivos modificados sem commit), auto-update e auto-publish abortam para não sobrescrever trabalho.

### Workflow
Fluxo de trabalho do Golmet. Composto por phases (Intake → Requisitos → Tradução → Qualidade), skills, subagents e primary agents.

---

*Este glossário é mantido pela Quadri Golmet (gm-req, gm-doc, gm-dev, gm-devops). Para termos não listados, consulte o `CONSTITUTION.md` do módulo ou o `AGENTS.md`.*
