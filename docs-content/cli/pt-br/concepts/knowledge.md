<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# O ecossistema de conhecimento

O tutorial [05](../getting-started/05-maturity-and-knowledge.pt-br.md)
contou o que sobra quando o projeto termina. Esta página abre o ecossistema:
onde o conhecimento mora, quem escreve nele e como um artefato acha o seu
lugar.

## Os três prateleiras do state pack

O conhecimento da MinhaOrganizacao vive num **state pack** — um repositório Git
clonado em `packs/<id>/` no config do engine, herdado pela equipe via
`golmet pack update`. Dentro dele, três prateleiras com donos e formatos
definidos: **`domains/`** (a fundação — conhecimento de domínio pesquisado
em fontes primárias, com URL e data de acesso, escrito pelo
`gm-domain-research` ANTES de qualquer componente consumir o domínio),
**`accumulation/`** (o aprendizado — patterns extraídos pelo
`gm-pattern-extractor`, métricas pelo `gm-metrics-collector`, nuances pelo
`gm-nuance-collector`) e **`rules/`** (as normas com gatilho, escritas pelo
`gm-rule-keeper` — ver [profile.md](profile.pt-br.md)).

A separação não é burocrática — cada prateleira tem um ciclo de vida
diferente: a fundação muda devagar (o domínio não muda toda semana), o
aprendizado cresce a cada projeto, as normas consolidam quando o time decide.

## O roteador: para onde vai o que

No meio do trabalho, surge o artefato sem destino óbvio — a descoberta
"fazemos deploy assim" pode ser nuance, pattern ou norma. A pergunta não é
do operador: o roteador (a skill `gm-knowledge-route`, guiado pela tabela
T1–T5 do AGENTS.md) classifica o encaixe **delega ao escritor canônico** —
cada prateleira tem UM escritor, nunca dois. A regra central: **rota, nunca
replicue** — cada prateleira tem o seu índice, e copiar conteúdo entre
elas é o caminho para o conhecimento apodrecer em duas versões diferentes.

**A válvula de escape** cobre o que não encaixa em nada: o artefato nasce
na zona de trabalho (`.golmet/`) — nunca solto — e é promovido quando
ganha função, com o escritor canônico responsável pela promoção.

## Por que pack e não pasta solta

Um state pack é um repo Git próprio: o `pack publish` empurra para o
remoto, o `pack update` puxa para a equipe — com auto-commit da acumulação
local e rebase, e o kit **nunca descarta** o que a equipe acumulou. É a
diferença entre o conhecimento morar num arquivo que ninguém versiona e
morar num ativo versionado da organização.
