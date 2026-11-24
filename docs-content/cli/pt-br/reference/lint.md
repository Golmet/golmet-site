<p align="center"><a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"English</a> | <a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"Português (Brasil)</a> | <a href="/docs/reference/lint"versão base deste doc</a></p>

# As camadas do lint (L1-L14)

O `golmet lint` é a varredura estrutural determinística do kit, do config do
engine e dos packs. É read-only, nunca adivinha e carrega o estado todo —
porque o agent não consegue: **o lint carrega tudo, o agent corrige o que
ele aponta**. O ciclo que ele habilita: o lint detecta → explica com
arquivo, linha e remediação PT-BR → o agent corrige → o lint confirma.

Onde roda: **CI** (o kit roda o lint contra si mesmo antes de qualquer
release), **CLI** (`golmet lint`) e **MCP** (`gm_lint` — a sessão do agent
varre e corrige). As skills de manutenção também o chamam:
`gm-agent-health-monitor` (verificação estrutural de saúde), `gm-setup`
(validação pós-install), `gm-workflow-improver` (gate pós-correção) e
`gm-pack-orchestrator` (estrutura do pack após publish/update).

Convenção de severidade: **error** = quebra o contrato ou o render;
**warning** = drift de qualidade/UX que não bloqueia o fluxo.

## As camadas

| Check | Severidade | Resumo |
|---|---|---|
| L1 | error | referência morta: path citado em `` `backticks` ``/link de `*.md` não existe em raiz conhecida |
| L3 | warning | órfão: arquivo do config sem proveniência (manifest / pessoal / pack / allowlist / citado) |
| L4 | error | entrada stale no manifest de conteúdo (o arquivo não existe no disco) |
| L5 | warning | nome estrutural fora de kebab-case ASCII |
| L6 | error/warning | componente fantasma: `gm-*` citado que não existe no registry (error em sources; warning em docs históricos) |
| L7 | error | estrutura de pastas fora do padrão canônico declarado (+ `L7-size` warnings para agregados unitários acima do limiar) |
| L8 | warning | definitivos que perderam o esqueleto estrutural mínimo declarado pelos templates do kit |
| L9 | error | schema do registry de stack-templates (o materializado do kit e os registries da org in-pack) |
| L10 | error/warning | internos dos state packs: `rules/*.md` sem gatilho explícito, tipos de pattern fora da taxonomia EN, `domains/` sem INDEX/KNOWLEDGE, working copy sem `pack.yaml` |
| L11 | warning | diagramas Mermaid quebrados ou mal formatados |
| L12 | error (BOM = warning) | encoding e texto quebrado: bytes não-UTF-8, U+FFFD, acentos com dupla codificação, UTF-16/BOM |
| L13 | warning | âncoras de idioma: link de um doc `*.pt-br.md` apontando destino EN quando o par PT-BR existe no disco |
| L14 | error | front matter YAML inválido: bloco `---` … `---` na primeira linha que não parseia como YAML genérico (ex.: valor com `: ` sem aspas) |

## L1 — referências mortas (error)

Todo path citado em `` `backticks` `` ou links markdown dos `*.md` varridos
(sources/docs do kit; `AGENTS.md` + `profile/` do config) deve resolver em
raiz conhecida (o dir do arquivo, a raiz do kit, a raiz do config). Os
`*.md` de packs NÃO são varridos v0.1 — docs de negócio do pack citam
paths de PRODUTO por design (deploy.yml do repo de produto, por exemplo),
falso-positivo estrutural; refs internas do pack são domínio do L5/L7.
Falsos-positivos conhecidos são tratados com raízes declaradas
(`profile/x` resolve o `coredata/rules/x` canônico do kit; refs de
module-stores e `skills/<id>` resolvem contra o registry).

**Exemplo de finding:** `` L1 AGENTS.md:6 — referência morta: `rules/client-profile.template.md` não existe `` →
fix: aponte a citação para o path certo (o template é emitido por
`golmet template client-profile` — não fica no config).

Testes: `TestL1DeadRefsAndFalsePositives`, `TestL1RuntimeViewConfig`,
`TestL1ContainerResolvesEngineConfigRoot`.

## L3 — órfãos (warning)

Arquivos do config que nenhum mecanismo reclama: não estão no manifest, não
são pessoal-por-design, não estão dentro de um state pack, não estão na
allowlist de órfãos declarada, não são citados. O fix é uma decisão: mover
para o lugar canônico, designar pessoal-por-design, apagar ou ampliar a
**allowlist de órfãos declarada** se for órfão-legítimo.

Testes: `TestL3OrphansWithAllowlistAndCited`.

## L4 — entradas stale no manifest (error)

Uma entrada de proveniência no `.golmet/manifest.json` cujo arquivo não
existe mais no disco. O kit removeu ou moveu o arquivo mas o inventário
manteve a linha — o sinal clássico depois de um refactor ou de uma onda de
uninstall.

**Exemplo de finding:** `L4 rules/packs/<pack-id>.md — entrada stale` →
fix: re-materializar (`golmet pack update`) ou remover a entrada stale.

Testes: `TestL4ManifestStale`.

## L5 — nomes fora do padrão (warning)

Nomes estruturais (primeiro nível do config, pastas do pack, dirs de
skills) fora de kebab-case ASCII. Arquivos com extensão são isentos;
conteúdo de negócio não é descido.

Testes: `TestL5NamesPTAndNonKebab`.

## L6 — componentes fantasmas (error em sources / warning em docs)

Uma menção `gm-*` que não está no registry. **Error** em
`coredata/sources` (o contrato vivo), **warning** em docs (prosa
histórica). A primeira execução real pegou dez nomes de componentes
mal-escritos nas sources do kit (ex.: `gm-task-spec` → `gm-taskspec`) mais
`invokes` quebrados do registry.

Testes: `TestL6GhostsByContext`.

## L7 — estrutura canônica (error) + L7-size (warning)

As árvores canônicas declaradas: a raiz do config (`agents/`, `skills/`,
`profile/`, `packs/`, `plugins/`, `.golmet/`, settings da raiz), o state
pack (`pack.yaml` + `skills/ agents/ rules/ domains/ accumulation/` com o
`accumulation/` restrito a `patterns metrics nuances`), o repo do kit
(`coredata/` incl. `templates/`). Dir desconhecido = finding; o fix é mover
ou declarar exceção.

`L7-size` avisa quando um agregado do workspace (DATA_MODEL, DECISIONS,
ERROR_CATALOG, GLOSSARY) cresce além dos limiares de quebra declarados — o
lint detecta sem gramática; o plano de split é do `gm-doc`.

Testes: `TestL7CanonicalStructure`, `TestL7TemplateDepositFlag`,
`TestL7SpecAggregatesUnitaryAndBroken`, `TestL7SizeWarningsEarlyCandidates`,
`TestL7L1Container`.

## L8 — definitivos vs. templates (warning)

Os definitivos do config (AGENTS.md, os perfis) devem manter o **esqueleto
estrutural mínimo** que seus templates do kit declaram: os blocos marcadores,
as seções canônicas. Conteúdo extra é evolução legítima (nunca é finding);
só a **perda estrutural** flaga. Definitivo ausente (máquina nova antes do
setup) = skip silencioso; template depositado no config = warning do L7
(templates vivem no kit — M12).

Testes: `TestL8StructuralConformance`, `TestL7TemplateDepositFlag`.

## L9 — schema do registry de stack-templates (error)

Os dois registries que o leitor consome (o materializado do kit
`profile/stack-templates.yaml` e os da org in-place
`packs/*/rules/stack-templates.yaml` — pack-first, M15) devem parsear como
YAML com o schema mínimo: `boilerplate_org` presente, cada template com
`detect`, `description` presente quando `boilerplate` é setado.

Testes: `TestL9StackTemplatesSchema`, `TestL9PackRegistrySchema`.

## L10 — internos dos state packs (error/warning)

Dentro dos state packs em `packs/<id>/`: `rules/*.md` sem gatilho explícito
no topo (o formato do `gm-rule-keeper`: H1 + "> Gatilho: AO ...", uma norma
por arquivo), pastas de patterns fora da taxonomia EN
(`process|architecture|code|ui|test|data`), `domains/` sem INDEX ou
`domains/<domínio>/` sem KNOWLEDGE, e working copy com `.git` sem
`pack.yaml` (**error** — a fonte da verdade do pack sumiu). O lint aponta;
o escritor canônico corrige (`gm-rule-keeper`, `gm-pattern-extractor`,
`gm-domain-research`).

Testes: `TestL10PackState` e irmãos.

## L11 — diagramas Mermaid (warning)

Heurística determinística sem Node: tipo de diagrama válido na primeira
linha significativa (lista declarada), delimitadores balanceados **por
bloco** (o padrão ER de attribute-blocks abre `{` numa linha e fecha em
outra — julgar por linha quebra sintaxe válida), aspas em pares, setas com
origem e destino, `subgraph`/`end` pareados, fence fechado. Mermaid quebrado
falha o render silenciosamente (o mostrador exibe o código cru) — o lint
torna isso audível.

Testes: `TestL11Mermaid`.

## L12 — encoding e texto quebrado (error; BOM = warning)

Texto quebrado por encoding é invisível na estrutura e só quebra no render:
bytes não-UTF-8 (Latin-1/Windows-1252 salvos crus), replacement character
U+FFFD (o conteúdo JÁ está corrompido no arquivo), acentos com dupla
codificação (os pares clássicos "Ã©/Ã£/Ã§" — UTF-8 lido como Latin-1 e
regravado), BOM UTF-16 (**error**), BOM UTF-8 (**warning** — IMP-096: sem
BOM). Evals ficam fora (fixtures podem conter conteúdo proposital).

Testes: `TestL12Encoding`.

## L13 — âncoras de idioma (warning)

Um link de um `*.pt-br.md` apontando um destino EN **quando o par PT existe
no disco**. O achado real: o README PT navegando para os docs EN — o link
resolvia no L1 mas ensinava o idioma errado. Só docs PT são validados (um
base EN linkando o par PT é legítimo: badge, cross-links). A remediação
troca para o par PT e avisa para conferir a âncora `#...` no idioma.

Testes: `TestL13Anchors`.

## L14 — front matter YAML parseável (error)

Um bloco de front matter (`---` na primeira linha até o fechamento `---`)
deve parsear como YAML genérico — sem schema de componente (skills/agents
têm suas regras próprias). O achado real (IMP-013): `titulo: X: Y` sem
aspas passou por todos os checks e só quebrou no consumidor (editor) —
"Nested mappings are not allowed in compact mappings". Arquivo sem front
matter = skip silencioso (não é erro); bloco vazio entre delimitadores =
parse válido; abertura `---` sem fechamento não é front matter. Alvos: os
mesmos `*.md` do L12 (kit/config/packs; evals e testdata fora — fixtures
podem conter conteúdo proposital).

Testes: `TestL14FrontMatter`.

## A política anti-falso-positivo

Um finding que aponta conteúdo válido treina as pessoas a ignorar o lint.
Toda heurística segue: **falso-positivo é pior que falso-negativo**. A prova
rodou no primeiro dia do L11: três falsos-positivos reais (delimitadores por
linha vs. o padrão ER de attribute-blocks, os tokens de cardinalidade do
erDiagram, os blocos `alt...end` do sequenceDiagram) foram pegos na primeira
varredura e viraram correção de heurística **mais testes de regressão**.
Allowlists declaradas e heurísticas por check vivem no FORMAT §9.1 e no
código.

## O contrato normativo

Os checks enforcementam o [FORMAT §9.1](/docs/pt-br/format#91-golmet-lint-varredura-estrutural-determinística-read-only) — o lint é o
executor, o FORMAT é o contrato. Referência: [commands](/docs/pt-br/reference/commands)
(`golmet lint`) e [tools](/docs/pt-br/reference/tools) (`gm_lint`).
