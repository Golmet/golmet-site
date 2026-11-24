<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# O que o GOLMET entrega

O GOLMET é o guardião de pedra da verdade documentada do seu produto: um CLI
mais um toolkit agêntico que transforma requisitos em conhecimento governado,
validado e versionado — para um desenvolvedor solo ou para uma empresa
inteira. Esta página lista tudo que ele entrega, camada por camada, em um
lugar só. Cada item aponta a página de detalhe.

## 1. Um toolset agêntico completo — instalado em um comando

O `golmet install` materializa o toolset embarcado no seu engine (OpenCode,
Claude Code e outros): **4 primary agents** (Requisitos, Documentação, Dev,
DevOps), **25 subagents** e **95 skills** — 124 componentes no total.
Wizard interativo para a máquina, flags explícitos para scripts e um
relatório final de saúde. Veja [init.md](init.pt-br.md).

## 2. Camadas de conteúdo — de onde vem cada arquivo

Todo arquivo na sua máquina tem dono e precedência declarados:
**L0 embarcado** (dentro do binário) → **L1 FULL** (materializado, o kit é o
escritor único) → **L2 packs** (a camada da organização) → **L3 local**
(suas criações). Precedência: local > pack > full > base. Veja
[layers.md](layers.pt-br.md).

## 3. `profile/` — a sua camada pessoal

A identidade do seu cliente e do operador, mais as regras canônicas de
comportamento do kit (`context7`, stack templates). Os templates vivem no
kit e **nunca são instalados**; o config carrega só os definitivos
(pessoal-por-design — nunca versionados, nunca sobrescritos). Veja
[profile.md](profile.pt-br.md).

## 4. Packs — o conhecimento da organização, distribuído

Um **state pack** é um working copy Git clonado no config do engine —
bidirecional: a equipe herda via `golmet pack add`/`update` e você publica a
maturidade acumulada via `golmet pack publish`. Dentro dele, três
prateleiras com escritores canônicos: **`rules/`** (normas com gatilho de
leitura), **`domains/`** (fundamentos de domínio de fontes primárias) e
**`accumulation/`** (patterns, metrics, nuances). O ferramental do pack
(skills/agents) é materializado no engine; os dados são lidos localmente.
Veja [knowledge.md](knowledge.pt-br.md).

## 5. Engenharia reversa — a verdade documentada do que já existe

Nem todo projeto começa do zero: o código-fonte congelado de sistemas em
produção é analisado e transformado em verdade documentada (modelos,
contratos, regras de negócio, o golden master de UI) — toda afirmação
carregando a evidência — e o que é descoberto entra no workflow novo como
candidatos, não suposições. A leitura guiada permite a um humano validar
o que a IA documentou. Veja [reverse.md](reverse.pt-br.md).

## 6. Organização — governança empresarial

Um **container** guarda múltiplos workspaces de produto, com o próprio
golmet.yaml, um catálogo global de organizações
(`~/.golmet/organizations.json`) e dois modelos de versionamento
(org-repo | produtos-repo). A empresa governa as normas uma vez; todo
produto herda. Veja [organization.md](organization.pt-br.md).

## 7. Autogovernança determinística

Três validadores com contratos declarados: **`golmet validate`** (H1-H10 —
o workspace contra o FORMAT), **`golmet doctor`** (S1-S5 + o estado do
engine-config: gerido / pessoal / pack) e **`golmet lint`** (L1-L12 —
referências mortas, órfãos, manifest stale, nomes, componentes fantasma,
estrutura canônica, conformidade definitivo↔template, schema de registry,
estado de pack, diagramas Mermaid, encoding). Roda em CI, CLI e MCP. O lint
carrega o estado todo; o agent corrige o que ele aponta. Veja
[self-governing.md](self-governing.pt-br.md).

## 8. Servidor MCP — 14 tools na sessão do agent

O kit serve a si mesmo via MCP: `gm_validate`, `gm_doctor`, `gm_next`,
`gm_status`, `gm_index`, `gm_eval`, `gm_eval_reports`, `gm_jev_classify`,
`gm_lint`, `gm_upgrade`, `gm_update`, `gm_pack_update`, `gm_pack_list`,
`gm_pack_publish`. A sessão do agent valida, roteia e corrige sem sair do
chat. Referência: [../reference/tools.pt-br.md](../reference/tools.pt-br.md).

## 9. Self-update com release verificada

O `golmet upgrade` busca a última release do GitHub, verifica **SHA-256**
antes de tocar no binário, substitui com segurança no Windows (rollback
`.old`) e re-materializa o conteúdo gerido. Binários multiplataforma +
launcher npm. Veja [self-governing.md](self-governing.pt-br.md).

## 10. Gates de qualidade desde o primeiro dia

O kit testa a si mesmo: **evals** (61+ fixtures pontuando skills
deterministicamente), o **gate de neutralidade** (nenhuma identidade de
org/cliente no conteúdo embarcado) e **golden byte-equality** (fonte ↔
materialização). Toda release roda o lint contra o próprio kit no CI.

## 11. Saída limpa

O `golmet uninstall` remove toda a estrutura **camada por camada** com
contagens reais — tudo selecionado por default exceto os packs (o seu
working copy local fica deselecionado; o repositório remoto nunca é
tocado). Veja [init.md](init.pt-br.md).

## O design em um diagrama

A tese sobre a qual a plataforma inteira se sustenta:

> **O workflow é uma máquina de estados documental do produto.** O formato é
> o contrato; o kit é o motor determinístico; o runtime é a camada agêntica
> que executa por capacidades.

Três camadas divididas **por natureza** (cada uma com cadência de mudança e
canal de distribuição próprios — não por tier de cliente):

```
┌─────────────────────────────────────────────┐
│ 1. FORMAT — spec versionada                 │
│    layout do workspace · schemas dos        │
│    artefatos · transições de estado ·       │
│    gramática de evidência                   │
├─────────────────────────────────────────────┤
│ 2. KIT — CLI determinístico (sem LLM)       │
│    init · validate · doctor · pack · mcp ·  │
│    upgrade · uninstall · template           │
├─────────────────────────────────────────────┤
│ 3. RUNTIME — camada agêntica, por           │
│    capacidades: perfil essencial (qualquer  │
│    engine) · FULL (runtime de referência:   │
│    OpenCode)                                │
└─────────────────────────────────────────────┘
```

O contrato normativo vive em [docs/FORMAT.md](../FORMAT.pt-br.md); tudo que esta
página lista é enforcementado pelos validadores do item 6.
