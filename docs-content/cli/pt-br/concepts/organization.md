<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# Organização, workspaces e versionamento

Quando o operador criou a MinhaOrganizacao no tutorial
[01](../getting-started/01-organizacao.pt-br.md), o Golmet perguntou "o que
inicializar?" — e a primeira escolha da jornada define a estrutura de tudo:
**a Organização é a raiz que agrupa os workspaces**, guarda os princípios
(`CONSTITUTION.md`), a navegação (`INDEX.md`) e o manifesto dos produtos
(`products:`). Ela não roda o pipeline de requisitos — o pipeline vive nos
workspaces.

## Os dois modelos de versionamento

A decisão que muda a estrutura de cada produto é o `versioning:` no
`golmet.yaml` da org. A MinhaOrganizacao usa `org-repo`: **a organização inteira é
um repositório Git** — o MeuApp é uma pasta versionada dentro dela. Nesse
modelo, o `.gitignore` é da raiz da org (o `init --org` o cria), a zona do
kit (`.golmet/`) é da raiz — compartilhada — e o produto nasce enxuto, sem
zona própria e sem `.gitignore` próprio: o versionamento da org já cobre.

O outro modelo, `produtos-repo`, é o clássico do FORMAT (DR-008): cada
produto é um repositório próprio, com a sua `.golmet/` versionada (o kit do
repo DELE, que a equipe do produto herda ao clonar) e o `.gitignore` de
cada um. Containers criados antes do campo existir são tratados como
`produtos-repo` (o default retroativo).

Na prática: o `init --into` lê o modelo declarado e entrega o produto do
jeito certo, reportando qual aplicou — "modelo de versionamento da
organização: org-repo". A zona `.golmet/` muda de papel conforme o contexto
(workspace versionada · config do engine estado · container zona de
trabalho) — o detalhe em [layers.md]((layers).pt-br.md).

## O catálogo e a verdade

As organizações que o kit cria (ou adota) entram no **catálogo global**
(`~/.golmet/organizations.json`) — o wizard usa o catálogo para listar as
orgs quando alguém cria um produto. O invariante: **o `golmet.yaml` da org é
a fonte da verdade** (estrutura e `products:`); o catálogo é conveniência.
Quando o validate roda num container, ele valida a declaração: produto
declarado sem diretório é falha; diretório de produto fora do products é
aviso — a org e o disco precisam contar a mesma história.

## A regra de scoping

Uma pergunta prática que a estrutura responde: **onde gravo este
artefato?** A regra é uma: no workspace do assunto. Assunto de produto
(uma RN, uma spec) grava no workspace-produto; assunto transversal da org
(o checkpoint de uma reunião, o histórico de migração) grava na zona de
trabalho `.golmet/` da org — gitignored, porque é trabalho do kit, não
conteúdo da empresa. E o que não encaixa em nada nasce na zona de trabalho
e é promovido por decisão — nunca solto na raiz.
