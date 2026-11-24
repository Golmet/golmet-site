<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# Self-governing: o lint carrega o estado

No tutorial [04](../getting-started/04-o-ciclo-de-uma-feature.pt-br.md), o
`golmet validate` conferiu o ciclo inteiro da RN-001 e saiu verde. Esta
página explica a filosofia por trás desses checks — e por que o Golmet
funciona quando os processos tradicionais apodrecem.

## O princípio

**A IA não carrega o estado todo; o lint carrega — e a IA corrige o que o
lint aponta.** Parece invertido, mas é o que faz o sistema operar: o lint
(`golmet lint`) é uma varredura determinística — mesma árvore, mesma
saída, sem julgamento. Ele aponta exatamente o que está quebrado, com a
remediação citando a skill responsável pela correção. Nenhum agent precisa
re-derivar o estado do projeto; ninguém precisa lembrar de conferir nada.

## Os dois níveis — e o que vigiam

O **hard** é o `golmet validate`: as regras H1–H10 do FORMAT bloqueiam —
uma Feature nunca nasce de um PEND (H1), Feature pronta exige RN ativa
(H3), RN ativa exige evidência (H4), a evidência resolve no código (H7), as
referências cruzadas resolvem (H10), o estado no índice é história
imutável (H8). É o que bloqueia o merge.

O **soft** é o resto: os avisos S1–S5 do doctor (evidência stale, capacidades
ausentes com degradação declarada) e o lint L1–L10 — as refs mortas da doc
(L1), os órfãos sem proveniência (L3), as entradas stale de manifest (L4),
os nomes fora do padrão (L5), os componentes `gm-*` fantasma citados (L6),
a estrutura canônica (L7), o tamanho dos agregados (L7-size), a
conformidade definitivo↔template (L8), o schema dos registries (L9) e o
estado interno dos state packs (L10). Nada disso bloqueia sozinho — mas
tudo aparece, sempre.

## Onde roda

O lint roda no CI do repo do kit (doc com ref morta = build quebra), via
MCP (`gm_lint` — read-only para os agents), nos gates das skills de
manutenção (o `gm-setup` valida pós-install, o `gm-workflow-improver`
exige lint verde pós-correção, os `gm-pack-*` validam pós publish/update).
O `golmet validate` é o gate do dia a dia — e o `--json` é o contrato para
CI e agents.

A consequência prática: a documentação do MeuApp continua correta não
porque alguém tem disciplina — porque **desviar dela é o caminho difícil**.
