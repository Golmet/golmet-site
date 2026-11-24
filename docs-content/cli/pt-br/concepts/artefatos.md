<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# A arquitetura de artefatos do Golmet

Toda a estrutura do Golmet — os diretórios, os formatos, as validações —
existe para sustentar uma cadeia de documentos onde **cada um nasce de um
outro e alimenta os seguintes**. Esta página conta essa cadeia como
história (a mesma jornada dos
[tutoriais](../getting-started/00-por-que-golmet.pt-br.md), vista de cima)
e fecha com a tabela de referência completa.

## A história: a semente e a descendência

**O charter é a semente.** O `PROJECT_CHARTER.md` declara o que o produto é
— e de onde vem o código (a tabela de Repos do §1). Tudo que existe no
workspace do MeuApp descende do charter: ele é o primeiro documento, e é por
isso que o `golmet validate` reclama quando ele está ausente ou ilegível —
sem semente, não há árvore.

**O REQUIREMENTS herda e expande.** As regras de negócio do produto (as
seções `## RN-NNN`) são refinamento do charter: o charter diz "é um produto
de agendamento", as RNs dizem "agendamento com confirmação de vaga, janela
de 15 minutos". As RNs confirmadas são o **único** fundamento de
implementação — uma Feature só pode nascer ancorada numa RN (`anchor:
RN-001`); ancorar em PEND é erro bloqueante (H1). É a regra que impede o
time de implementar o que ninguém confirmou.

**Os specs derivam das RNs.** Cada RN com implementação à frente ganha a
pasta `analysis/RN-NNN — título/` com a análise funcional e a técnica — o
COMO. A spec é escrita a partir da regra (nunca ao contrário): quando a
spec diverge da RN, ou a spec está `stale` (e precisa declarar por qual
CR), ou houve erro de derivação. É por isso que o FORMATO tem a seção §7.7:
o agregado `specs/DATA_MODEL.md` cresce por maturidade, e a quebra por
micro-contexto existe para quem implementa uma RN não precisar carregar o
banco inteiro.

**O delivery entrega.** A Feature em
`delivery/<grupo>/RN-NNN — título — Feature.md` é o andamento: as tasks
com estado e dono, a execução coordenada pelas skills de dev. A feature
andando é o que faz a RN subir para `active` — com evidência
(`[path:line @hash]`), o vínculo file+linha+commit com o código.

**A evidência é o fecho.** E aqui está a diferença do Golmet para qualquer
doc tradicional: a RN-001 não diz "foi implementado" — ela **aponta** para
o código, e o `golmet validate` confirma que o apontamento é real (o arquivo
existe, a linha existe, o hash é o HEAD — H7, S2). A documentação que a
máquina confere é a única que o time continua confiando.

**O índice é a memória de estados.** O `golmet.index.json` guarda o estado
de cada entidade na última validação boa. Quando uma regra é alterada
depois de confirmada, o caminho é o CR (o `CHANGE_REQUESTS.md` registra a
mudança, a RN atualiza, o spec desce para stale com a razão); quando uma
decisão técnica é tomada, ela vira ADR no `DECISIONS.md` — imutável, porque
a história de "por quê" é o que o time vai reler.

**E o que fecha o círculo do conhecimento**: o TRACEABILITY (no `quality/`)
mapeia RN → documentos gerados; o pacote de conhecimento (patterns,
domains, rules) herda o que o projeto revelou — a cadeia não termina na
entrega, termina virando ativo da organização.

## A tabela de referência

| Documento | Onde vive | Alimenta | É alimentado por | Quem produz (`gm-*`) |
|---|---|---|---|---|
| `PROJECT_CHARTER.md` | raiz do workspace | REQUIREMENTS, specs, tudo | a conversa de fundação | `gm-charter` |
| `REQUIREMENTS.md` (RNs + PENDs) | raiz | specs, delivery (as âncoras) | charter + a elicitação com o dono | `gm-req` (a via do `gm-clarify`) |
| `CHANGE_REQUESTS.md` (CRs) | raiz | RNs (a atualização), specs (o stale) | mudanças pós-confirmação | `gm-req` (o `gm-change-request`) |
| `DECISIONS.md` (ADRs) | raiz | as decisões técnicas dos specs | a discussão de arquitetura | `gm-decision-log` |
| `analysis/RN-NNN/` (análise funcional + técnica) | analysis/ | a Feature e as tasks | as RNs | `gm-taskspec` |
| `specs/DATA_MODEL.md` etc. | specs/ | implementação, db drift | as RNs | `gm-datamodel`, `gm-apicontracts`, `gm-arch`, `gm-uispec`, `gm-criteria` |
| `delivery/RN-NNN — Feature.md` | delivery/ | o código (as tasks) | a análise técnica | `gm-taskspec` |
| `golmet.index.json` | raiz | as comparações do validate | a prosa (o kit escreve) | o kit (`golmet validate`/`index`) |
| `quality/TRACEABILITY.md` | quality/ | a auditoria de cobertura | tudo | `gm-traceability` |
| pack de conhecimento (`rules/`, `accumulation/`, `domains/`) | pack da org | os próximos projetos | os retrospectos e decisões | `gm-rule-keeper`, `gm-pattern-extractor`, `gm-domain-research` |

## As regras que sustentam a cadeia

A cadeia só vale se for verificada. O [FORMAT v1](../../docs/FORMAT.pt-br.md) define os
checks que a impedem de apodrecer: H1 (PEND nunca ancora Feature), H3
(Feature pronta exige RN ativa), H4 (RN ativa exige evidência), H7 (a
evidência resolve no código), H10 (as referências cruzadas resolvem), H8 (o
estado no índice é a história — ADR aceito não muda). O soft (S1–S5) e o
lint (L1–L10) vigiam o resto — a disciplina completa em
[FORMAT §9](../../docs/FORMAT.pt-br.md).
