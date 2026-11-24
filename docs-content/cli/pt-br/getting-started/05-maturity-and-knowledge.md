<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# 05 — O que sobra quando o projeto termina: o ciclo do pack

O tutorial [04](04-o-ciclo-de-uma-feature.pt-br.md) fechou a RN-001 do
MeuApp entregue e validada. O projeto fechou — as features entregues, o
validate verde, o cliente satisfeito. E agora? O que sobra do MeuApp não é
só o código: é a **maturidade** — os padrões que funcionaram, as métricas
que os evals mediram, as lições finas que o time aprendeu, o conhecimento de
domínio que foi pesquisado. A pergunta deste tutorial é uma só: **onde essa
maturidade mora, e como ela chega no próximo projeto.**

A resposta tem um nome: o **pack**. E um ciclo completo, que este doc
atravessa do início ao fim: o projeto fecha → a retrospective extrai → o
pack acumula → o publish sobe → o repo da org guarda → o próximo projeto
herda.

## 1. Criar o repo do pack na organização (uma vez por org)

A maturidade é ativo da organização — então ela mora num **repositório Git
próprio da org**, não numa pasta solta do seu computador. Crie o repo
privado (na interface do GitHub ou com a CLI):

```bash
gh repo create <org>/<pack-repo> --private
```

O nome fica a seu critério — o que importa é: repo privado, da org, com
 espaço para crescer. Este repo é a **fonte da verdade da maturidade** da
 organização: tudo que os projetos revelarem sobe para cá.

## 2. Criar o pack (a primeira vez)

Com o repo criado, a skill **`gm-pack-scaffold`** monta o esqueleto
completo do pack a partir do contrato do FORMAT §3.1 — o commit inicial e a
estrutura canônica:

```
pack.yaml                    # o manifesto do pack (kind: state — working copy bidirecional)
README.md                    # o propósito do pack
skills/                      # skills/agents que a org compartilha por overlay
rules/                       # as normas da org (uma por arquivo, com gatilho)
domains/                     # a fundação de domínio (KNOWLEDGE.md por domínio)
accumulation/                # o aprendizado acumulado:
├── patterns/                #   os padrões reutilizáveis (por tipo: code, process…)
├── metrics/                 #   as métricas acumuladas dos projetos
└── nuances/                 #   as observações finas, uma por tema
```

O que cada parte é: `pack.yaml` declara o que o pack fornece e o
arquétipo (`kind: state` — o clone é working copy bidirecional, não cache
read-only). `rules/` e `domains/` são o conhecimento declarativo — o jeito
da casa e o entendimento do domínio. `accumulation/` é o aprendizado
acumulado — cada projeto deposita aqui e o pack guarda a história.

## 3. Vincular na sua máquina

```bash
golmet pack add <url-do-repo> --engine opencode
```

O kit clona o repo para `<config>/packs/<id>/` — o **working copy**
bidirecional: ele está ligado ao repo (o origin aponta para ele) e o kit
sabe que aquilo é pack, não arquivo solto. A partir daqui, a maturidade da
org está disponível na sua máquina: as normas com gatilho entram no
AGENTS.md, os patterns ficam visíveis para as skills.

## 4. A retrospective (a cada projeto que fecha)

O MeuApp fechou. Antes de arquivar, rode o
**`gm-project-retrospective`** — a skill que conduz a extração do que o
projeto revelou, com os escritores canônicos gravando **no working copy do
pack**:

- os padrões que funcionaram → `accumulation/patterns/<tipo>/`, pelo
  **`gm-pattern-extractor`** (um padrão = o problema, a solução e o código
  que o demonstra);
- as métricas da retrospectiva (cobertura, evals, o que foi medido) →
  `accumulation/metrics/`, pelo **`gm-metrics-collector`**;
- as observações finas ("o scheduler tem drift de 2s com o banco de
  confirmação") → `accumulation/nuances/<tema>.md`, pelo
  **`gm-nuance-collector`** — uma nuance por tema, append-only;
- o conhecimento de domínio que o projeto pesquisou → `domains/`, pelo
  **`gm-domain-research`** (quando fundado — fontes primárias com URL e
  data de acesso).

Cada escritor tem formato e gatilho próprios — e o roteador de conhecimento
([docs/concepts/knowledge.pt-br.md](../concepts/knowledge.pt-br.md)) decide
o destino quando o artefato não tem um óbvio.

## 5. Subir para o repo da org

```bash
golmet pack publish
```

O publish faz o **commit do WIP** (as mudanças não-commitadas do working
copy) e o **push para o repo da org** — a fonte da verdade da maturidade
atualizada. A regra é deliberada: **o publish é manual por design** — o
operador decide quando o conhecimento está pronto para ser compartilhado
(nada sobe sem a sua mão; o kit nunca descarta o que a equipe acumulou, mas
também nunca publica sem decisão).

## 6. Herdar

O próximo projeto da MinhaOrganizacao (ou a máquina nova de um colaborador
que entra): **`golmet pack add`** de novo — e a maturidade acumulada está
lá na hora: as normas da casa, os patterns que o MeuApp deixou, a fundação
de domínio. Para quem já tem o pack vinculado: **`golmet pack update`**
sincroniza o repo para o working copy (com auto-commit da acumulação local
e rebase — nunca descartando o que você tem).

**O Golmet amadurece com o uso: o primeiro projeto ensina; o segundo
herda.**

## O ciclo, de cima

```
   projeto fecha (validate verde, entregas done)
          │
          ▼
   gm-project-retrospective ── extrai (patterns · metrics · nuances · domains)
          │                          grava NO WORKING COPY do pack
          ▼
   golmet pack publish ── commit do WIP + push (manual por design)
          │
          ▼
   repo da organização (ex.: <org>/<pack-repo>) ── a fonte da verdade
          │
          ▼
   golmet pack add (o próximo projeto · a máquina nova) ── herdando
```

O que este ciclo compra para a organização: o segundo projeto começa com
as normas da casa no lugar, os padrões provados disponíveis e a fundação de
domínio pesquisada — a IA da equipe herda o jeito da casa no primeiro dia.

## A jornada termina — o ciclo continua

[00 — por que o Golmet existe](00-por-que-golmet.pt-br.md) ·
[01 — a Organização](01-organizacao.pt-br.md) ·
[02 — o projeto](02-projeto.pt-br.md) ·
[03 — a IA no ciclo](03-trabalhando-com-ia.pt-br.md) ·
[04 — o ciclo de uma feature](04-o-ciclo-de-uma-feature.pt-br.md) ·
[05 — a maturidade](05-maturity-and-knowledge.pt-br.md).

Para os conceitos em profundidade: o ecossistema de conhecimento inteiro em
[docs/concepts/knowledge.pt-br.md](../concepts/knowledge.pt-br.md).
