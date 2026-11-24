<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# 02 — Criar o projeto dentro da Organização

Com a Organização criada, o operador cria o workspace do **MeuApp** — o produto
de agendamento. Um workspace-produto é a unidade onde o workflow acontece:
é nele que os requisitos vivem, as specs descem e o delivery anda. O
conceito completo: [docs/concepts/organization.md](../concepts/organization.pt-br.md).

## O wizard de novo — agora dentro da org

```bash
cd MinhaOrganizacao
golmet init
```

O wizard abre de novo, mas com uma diferença: como o diretório atual é uma
Organização, a segunda opção ganha vida:

```
◆ O que inicializar? (↑/↓ move · enter confirma · esc cancela)

    Organização a raiz que agrupa os workspaces
>   Workspace-produto dentro de uma Organização existente projeto novo dentro da raiz
    Workspace-produto raiz livre projeto novo independente
```

O cursor está agora na opção 2 (a última usada), e o wizard sabe que a
raiz é uma Organização — o operador confirma com enter.

```
◆ Escolha a Organização (↑/↓ move · enter confirma · esc cancela)

  1. MinhaOrganizacao — C:\empresa\MinhaOrganizacao
  2. Outra — caminho manual — a Organização não está no catálogo
```

A lista vem do **catálogo global** — a org que ele criou no tutorial 01 já
está lá. Enter na MinhaOrganizacao. O wizard pergunta o nome do produto: **MeuApp**.
Resumo, ENTER, criado:

```
produto MeuApp inicializado em C:\empresa\MinhaOrganizacao\MeuApp — 9 criado(s), 0 pulado(s)
container atualizado: products: [MeuApp]
modelo de versionamento da organização: org-repo
produto SEM .golmet/ própria — a zona do kit é a da organização (org-repo)
```

Três linhas que valem a leitura. O `products: [MeuApp]` é a org reconhecendo
o filho. O "modelo de versionamento: org-repo" diz que a ORG é o
repositório — o MeuApp é uma pasta versionada nela, sem `.gitignore`
próprio. E o produto nasceu **sem zona de kit própria**: a zona `.golmet/`
é a da organização, compartilhada — o conceito completo em
[docs/concepts/layers.md](../concepts/layers.pt-br.md).

## O que nasceu no MeuApp — e o papel de cada documento

Cinco documentos e três pastas. Cada um é um personagem da história que vem
pela frente (o mapa completo dos artefatos está em
[docs/concepts/artefatos.md](../concepts/artefatos.pt-br.md)):

- **`golmet.yaml`** — o manifesto do workspace. O kit lê daqui que aquilo é
  um workspace (não uma org) e o formato é 1.
- **`PROJECT_CHARTER.md`** — o charter: **o que o produto É**. Nome, dono,
  purpose, os repositórios de código. É a semente de tudo que vem depois —
  o charter é o primeiro documento da DAG, e todos os outros descendem dele
  de um jeito ou de outro.
- **`REQUIREMENTS.md`** — o documento das **regras de negócio**. Nasce
  vazio e é o que mais cresce: cada requisito vira uma seção `## RN-001 —
  título` com estado (`draft` → `confirmed` → `active`) e evidência. O
  cliente valida aqui.
- **`CHANGE_REQUESTS.md`** e **`DECISIONS.md`** — onde mudanças de escopo e
  decisões técnicas são registradas. Elas existem como documentos próprios
  porque são os registros que o time vai reler quando perguntarem "por
  quê?".
- **`reverse/CANDIDATES.md`** — a fila de conhecimento candidato (em
  projetos brownfield, o que foi descoberto do código legado entra aqui).
- **`specs/`** e **`delivery/`** (pastas criadas) — para onde a análise
  técnica desce e onde as features andam, respectivamente.
- **`golmet.index.json`** — o baseline do índice de estados: a máquina de
  validação compara o estado declarado nos documentos contra este cache
  gerido pelo kit.

## O que vem depois

O workspace está pronto e vazio — vazio de propósito. A vida começa quando
a IA entra: [03 — trabalhando com IA]((03-trabalhando-com-ia).pt-br.md).
