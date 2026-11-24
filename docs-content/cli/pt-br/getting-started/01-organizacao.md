<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# 01 — Criar a Organização

A Organização é o primeiro passo da jornada — e é ela que faz o Golmet ser
mais do que um validador solto: os produtos da empresa nascem dentro dela, o
conhecimento compartilhado mora nela, e as normas de como o time trabalha se
acumulam nela. O conceito completo está em
[docs/concepts/organization.md](../concepts/organization.pt-br.md); aqui é o
passo a passo na tela.

## O wizard, tela a tela

o operador cria a pasta da empresa e roda:

```bash
mkdir MinhaOrganizacao && cd MinhaOrganizacao
golmet init
```

Como o `golmet init` sem flags é sempre interativo (o kit nunca cria nada
sem perguntar), o wizard abre:

```
◆ O que inicializar? (↑/↓ move · enter confirma · esc cancela)

>   Organização a raiz que agrupa os workspaces
    Workspace-produto dentro de uma Organização existente projeto novo dentro da raiz
    Workspace-produto raiz livre projeto novo independente

Organização é a raiz da empresa que agrupa os workspaces. Crie-a se você está
estruturando a empresa — os produtos nascem dentro dela.
```

Repare: cada opção tem uma descrição curta ao lado, e **a linha embaixo
muda conforme o cursor navega** — é a descrição do item ativo, no momento
em que você precisa dela.

O operador navega até **Organização** e dá enter. O wizard pergunta o nome
(vazio = usar a pasta atual). Depois vem o Resumo:

```
Resumo:

  tipo:      Organização (container: true)
  raiz:      C:\empresa\MinhaOrganizacao
  arquivos:  golmet.yaml · CONSTITUTION.md · INDEX.md

◆ Confirmar e criar? (ENTER confirma · n volta a editar · esc cancela)
```

ENTER cria. (`n` volta a editar o passo anterior — o valor digitado fica
pré-preenchido; `esc` cancela tudo sem criar nada, em qualquer passo.)

## O que cada arquivo criado guarda

O kit criou três arquivos — e cada um tem um papel na jornada:

- **`golmet.yaml`** — o manifesto da Organização. É aqui que o kit sabe que
  aquilo é uma org (`container: true`), qual o modelo de versionamento
  (`versioning: org-repo` — a org é o repositório e os produtos são pastas
  dela) e quais produtos existem (`products: []`, por enquanto).
- **`CONSTITUTION.md`** — os princípios da organização: o que é inegociável
  no jeito de trabalhar. Stub para editar — vira documento vivo.
- **`INDEX.md`** — a navegação da org: índice dos produtos e documentos.

E mais um que o kit criou sem anúncio: o **`.gitignore`** — porque na org
`org-repo` a zona de trabalho do kit (`.golmet/`, onde ficam checkpoints e
históricos) nunca é versionada.

## O passo que é seu: o versionamento

A Organização foi feita para ser o seu **repositório de versionamento** — os
produtos nascem como pastas dentro dela e versionam no repo dela (o modelo
`org-repo`). O kit cria a estrutura e o `.gitignore`; o Git em si é operação
sua:

```bash
git init
git add -A
git commit -m "organização criada — produtos a seguir"
```

O `.gitignore` já criado protege a zona de trabalho `.golmet/` do
versionamento (checkpoints e histórico nunca sobem). A partir daqui, a org
é um repo como qualquer outro — com a diferença de que cada pasta de
produto que você versionar nela carrega o workflow inteiro dentro.

## O catálogo

O que o wizard não mostrou: a Organização acabou de ser registrada no
**catálogo global** do kit, em `~/.golmet/organizations.json`. Na próxima
vez que alguém criar um produto e escolher "dentro de uma Organização
existente", as organizações do catálogo aparecem na lista, com o caminho ao
lado — sem digitar caminho nenhum. O `golmet.yaml` da org é a fonte da
verdade; o catálogo é só a conveniência do wizard.

## O que vem depois

A Organização vazia não faz nada sozinha. O próximo passo é nascer dentro
dela: [02 — criar o projeto]((02-projeto).pt-br.md).
