<p align="center"><a href="https://github.com/Golmet/golmet-cli/blob/main/README.md">English</a> | <a href="https://github.com/Golmet/golmet-cli/blob/main/README.md">Português (Brasil)</a> | <a href="/docs/concepts/reverse">versão base deste doc</a></p>

# Engenharia reversa — a verdade documentada do que já existe

Nem todo projeto começa do zero. Sistemas em produção, código legado, um
pipeline de ingestão que já funciona — o GOLMET faz a **engenharia reversa
do que existe** e transforma em verdade documentada, para que o workflow
novo nasça do que **é** (nunca da memória do modelo, nunca de palpite).

## O que a camada de reversa entrega

**O REVERSE_REPORT** — a análise documentada do código-fonte congelado:
modelos, contratos de API, regras de negócio. Toda afirmação carrega a
evidência (`[arquivo:linha @hash]`) — o agent cita a fonte em vez de
confiar em si mesmo.

**`reverse/CANDIDATES.md`** — a fila de conhecimento candidato (`CAND-NNN`):
o que foi descoberto do legado entra no workflow novo como candidato, não
como suposição. Esta é a ponte entre o que existe e o que vai ser
construído (veja [artefatos.md](/docs/pt-br/concepts/artefatos)).

**A camada humana do legado** (`gm-legacy-guide`) — `reverse/guide/`:
OVERVIEW, IMPACT_MAP, GUIDES/<domínio>, FORMS/<domínio> — a leitura guiada
que permite a um humano validar o que a IA documentou, domínio por domínio,
com formulários de confirmação.

**O golden master de UI** (`gm-ui-capture`) — a captura visual dos fluxos
do legado via o browser MCP Playwright: o sistema antigo também tem
aparência, e aparência é verdade documentada também.

## O princípio: evidência, não memória

A disciplina da camada de reversa é a mesma da prateleira de conhecimento,
levada além: toda afirmação sobre o legado carrega o arquivo, a linha e o
hash de commit. Quando a IA está insegura, ela declara o que não sabe em
vez de adivinhar. O humano lê, confirma ou rejeita, e a verdade confirmada
vira o fundamento sobre o qual o sistema novo é construído.

## Onde entra na jornada

Projetos brownfield começam aqui: analise o código-fonte congelado
primeiro, semeie a fila de candidatos, entregue ao humano a leitura guiada
— e só então planeje o workflow novo sobre a verdade documentada. Veja
[02-projeto.md](/docs/pt-br/getting-started/02-projeto) (a fila de
candidatos em projetos brownfield) e
[05-maturity-and-knowledge.md](/docs/pt-br/getting-started/05-maturity-and-knowledge)
(o que sobra quando o projeto termina).
