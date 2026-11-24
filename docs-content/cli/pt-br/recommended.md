<p align="center"><a href="/docs/recommended">English</a> | Português (Brasil)</p>

# O modo recomendado: Organização + FULL + Opencode

O Golmet funciona em muitas combinações — e por isso mesmo vale cravar qual
é a **testada de ponta a ponta**: **Organização + perfil FULL + Opencode**.
A jornada dos tutoriais
([00](getting-started/00-por-que-golmet.pt-br.md) a
[05](getting-started/05-maturity-and-knowledge.pt-br.md)) segue
exatamente este modo, e é nele que nada falta.

## O que cada escolha te dá

**Organização** — o produto nasce dentro de uma estrutura: os produtos se
registram no `products:`, o conhecimento compartilhado (normas, patterns,
domínios) mora na org e é herdado por todo projeto novo, e a zona do kit é
da raiz (no modelo `org-repo`, o produto nem carrega zona própria). Sem a
Organização, cada workspace é uma ilha: o validador funciona, mas nada se
acumula entre projetos.

**Perfil FULL** — as 93 componentes do workflow materializadas no engine.
Com o essencial, as 16 skills BASE versionadas na zona do workspace dão o
ciclo básico; com o FULL, a IA entra com os primários por domínio, os
subagents de execução/QA, o roteamento de conhecimento e as skills de
manutenção — o workflow inteiro, não um recorte. É a diferença entre "a IA
me ajuda a validar" e "a IA conduz o processo".

**Opencode** — o engine onde as capacidades do kit rodam sem redução:
cliente MCP, spawn de subagents, paralelismo, worktrees. Engines com
skills nativas (opencode, claude-code) aceitam o FULL; os demais recebem o
essencial na zona do workspace — e funcionam, com o recorte declarado.

## O que você perde sem cada peça

Sem a Organização: sem catálogo, sem normas herdadas, sem o
conhecimento acumulando entre projetos. Sem o FULL: o workflow roda no
subconjunto BASE — o ciclo existe, os primários e a delegação não. Sem um
engine com skills nativas: o FULL não se aplica (fail-closed — o install
filtra a lista); o essencial na zona do workspace é o caminho, com o
workflow BASE.

## Como montar (a sequência)

```bash
npm install -g golmet-cli
golmet install --engine opencode --profile completo --yes   # o FULL no engine
golmet init        # a Organização (o wizard)
golmet init        # o projeto, dentro da org
```

A partir daqui, a jornada dos tutoriais assume exatamente este estado.
