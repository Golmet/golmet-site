# GOLMET CLI — release v1.7.4 (PT-BR)

<p align="center"><a href="/docs/readme">English</a> | Português (Brasil)</p>

<p align="center">
  <a href="https://github.com/Golmet">
  </a>
</p>

<h1 align="center">golmet-cli</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/golmet-cli"><img src="https://img.shields.io/npm/v/golmet-cli.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/golmet-cli"><img src="https://img.shields.io/npm/dw/golmet-cli.svg" alt="npm downloads"></a>
  <a href="https://github.com/Golmet/golmet-site/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</p>

## O problema que o Golmet resolve

Seus requisitos ficam num documento que ninguém relê. Os specs viram um diagrama
desenhado no começo do projeto e nunca mais atualizado. O código sai do jeito
que dá, e quando alguém pergunta "por que essa feature saiu assim?", a
resposta é "pergunta pro analista, ele que decidiu — acho". Três meses depois,
nem o analista lembra.

O pior não é perder o requisito. É que **ninguém confia mais na documentação**
— ela está sempre velha, sempre incompleta, sempre em outro lugar. Então o
time para de escrever, e o conhecimento vai embora quando a pessoa vai embora.

O Golmet existe para isso: fazer a documentação voltar a ser a parte
confiável do projeto — porque ela é **verificada por máquina** contra o que
o código realmente faz, a cada validação, antes de qualquer merge.

## O que o Golmet faz, na prática

Uma jornada real, do zero à entrega. O analista abre a pasta da empresa e roda
`golmet init`: nasce a **Organização** — o `golmet.yaml` que declara os
produtos, a constituição, o índice. Dentro dela ele cria o projeto do
produto, e o projeto nasce com os documentos certos já no lugar: o
`PROJECT_CHARTER.md` (o que o produto é), o `REQUIREMENTS.md` (as regras de
negócio, uma por seção, com estado e dono).

Nem todo projeto começa do zero. Quando o sistema já existe - em produção,
com histórico - a jornada começa pela **engenharia reversa**: o GOLMET
congela o código-fonte e transforma em verdade documentada (modelos,
contratos, regras de negócio - toda afirmação com o arquivo, a linha e o
hash), semeia a fila de candidatos e entrega ao humano a leitura guiada do
legado. O workflow novo é planejado sobre a verdade documentada, não sobre a
memória do modelo. Veja [engenharia reversa](docs/concepts/reverse.pt-br.md).

Quando o cliente pede a feature "agendamento com confirmação de vaga", o
requisito entra no REQUIREMENTS como uma seção `## RN-001 — ...` — e cada
regra carrega **evidência**: o arquivo, a linha e o hash do código que a
implementa. A spec técnica desce para `specs/`, a task para `delivery/`, o
código sai. Quando alguém roda `golmet validate`, o kit confere: a regra
RN-001 aponta para o código que existe? O hash bate com o HEAD? A spec está
stale? O que divergiu aparece — e não mergeia.

No fim do projeto, o que sobra não é um Word esquecido: é um **pacote de
conhecimento** — as normas de como aquela organização trabalha, os padrões
que os projetos revelaram, a fundação de domínio pesquisada. O próximo
projeto começa com tudo isso já carregado.

**IA em todo o ciclo.** O Golmet não é um validador solitário: ele vem com
um workflow de skills `gm-*` que a sua IA executa - quem elicita os
requisitos é a IA (com você), quem escreve a spec é a IA, quem escreve o
código com testes verdes contra a spec aprovada é a IA, quem revisa o
código contra a spec é a IA. A documentação deixa de ser o que ninguém tem
tempo de fazer.

## O modo recomendado

> **Para extrair o máximo do Golmet: Organização + perfil FULL + Opencode.**
> É o caminho testado e o que este guia segue — a Organização dá a estrutura
> e o conhecimento compartilhado, o perfil FULL instala o workflow completo
> no seu engine, e o Opencode é o engine onde as capacidades do kit rodam
> sem redução. Outros engines funcionam (com o perfil essencial, o kit vive
> versionado no repo) — mas é neste modo que nada falta. Detalhes em
> [docs/recommended.pt-br.md](docs/recommended.pt-br.md).

## Getting started (os 5 minutos)

```bash
# instalar (npm — a via principal; o launcher despacha o binário da sua plataforma)
npm install -g golmet-cli

# onboard: engine + skills + catálogo MCP + doctor, um comando
golmet install --engine opencode

# inicializar (o wizard pergunta o que criar)
golmet init

# os primeiros comandos, na ordem
golmet validate   # o workspace contra o FORMAT v1 — exit ≠ 0 bloqueia o CI
golmet lint       # a varredura estrutural determinística (L1–L10)
golmet doctor     # a saúde do ambiente (S1–S5, checks de máquina)
golmet status     # o dashboard dos estados das entidades
```

> Atualização por canal: `golmet upgrade` (self-update) atualiza
> instalações Go/binário; via npm, atualize com `npm update -g golmet-cli`.

## A documentação

A doc pública é escrita como uma **jornada** — comece por ela:

| Doc                                                                                      | O que é                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [Primeiros passos (os tutoriais em PT)](docs/getting-started/00-por-que-golmet.pt-br.md) | **Comece aqui.** Por que o Golmet existe, e a jornada: a Organização, o projeto, o trabalho com IA, o ciclo de uma feature, o que sobra no fim |
| [docs/concepts/overview.pt-br.md](docs/concepts/overview.pt-br.md)                       | **O que o Golmet entrega** — o mapa completo em uma página: tudo, camada por camada (os tutoriais mostram a jornada; este é o mapa)            |
| [docs/concepts/artefatos.pt-br.md](docs/concepts/artefatos.pt-br.md)                     | A arquitetura de artefatos: para que serve cada documento, o que o alimenta, o que ele alimenta                                                |
| [docs/recommended.pt-br.md](docs/recommended.pt-br.md)                                   | O modo recomendado (Organização + FULL + Opencode) — e o que você perde sem ele                                                                |
| [docs/concepts/](docs/concepts/)                                                         | Os conceitos em profundidade: organização e versionamento, camadas de conteúdo, profile, conhecimento, self-governing                          |
| [docs/FORMAT.md](docs/FORMAT.pt-br.md)                                                   | A spec normativa (v1) — o contrato que todo check enforça                                                                                      |
| [docs/reference/compatibility.md](docs/reference/compatibility.pt-br.md)                 | A matriz real MCP x engine - verificada celula a celula, travada por testes (marcas honestas de "nao verificado")                              |
| [docs/reference/](docs/reference/)                                                       | Referência: os 18 commands, as 14 tools MCP                                                                                                    |
| [docs/reference/lint.pt-br.md](docs/reference/lint.pt-br.md)                             | As camadas do lint em profundidade: o que cada check (L1-L14) valida, por que existe, exemplo de finding e o teste que trava                   |
| [CHANGELOG.md](CHANGELOG.md)                                                             | Onda por onda, com a motivação real                                                                                                            |
| [LICENSE](LICENSE)                                                                       | MIT                                                                                                                                            |

O site público renderiza esta árvore depois do release — o repo
é a fonte, o site é um render.

## Desinstalação

`golmet uninstall` remove a estrutura global do Golmet por camadas, com
descoberta dinâmica do estado real (manifest + personal.json + config do
engine). Tudo vem selecionado por padrão, MENOS o pack — o repositório
remoto do pack nunca é tocado. Flags: `--only <csv> --yes` (não-interativo)
· `--dry-run` · `--json`.

## Development

O CLI é escrito em **Go 1.22+** (módulo `github.com/Golmet/golmet-cli`), com
[spf13/cobra](https://github.com/spf13/cobra) como única dependência
externa. **639 testes Go** (unitários + integração + e2e do binário)
sustentam o estado atual.

```bash
go build ./...            # build
go build -o golmet ./cmd/golmet   # binário local
go test ./...             # testes
go vet ./... && gofmt -l . # obrigatórios antes de commitar
```

## Roadmap · Contributing · Licença

O plano de marcos vive no [ROADMAP.md](ROADMAP.pt-br.md) (F1 = este release; F2 =
o site de docs; F3 = fluxo de contribuição e migração de workspace).
Contribuições: [CONTRIBUTING.pt-br.md](CONTRIBUTING.pt-br.md) — testes table-driven e
`gofmt` são obrigatórios. Licença [MIT](LICENSE).
