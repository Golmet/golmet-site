<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# As camadas de conteúdo

A primeira pergunta de quem adota o kit é "de onde vem o que a minha IA
carrega?" — e a resposta é uma escala de quatro camadas, da mais fraca para
a mais forte: **L0 embedded** (o BASE mínimo dentro do binário — offline),
**L1 FULL** (as 93 componentes do workflow, embarcadas), **L2 packs** (os
overlays da organização e os state packs de conhecimento) e **L3 local** (as
criações do operador). A precedência quando duas camadas fornecem o mesmo
componente: **local > pack > full > base** — o seu ajuste fino vence, o
embutido perde.

## Os dois perfis — e a escolha do operador

Quando o operador rodou `golmet install --engine opencode` (tutorial
[00](../getting-started/00-por-que-golmet.pt-br.md)), o wizard perguntou o
**perfil**. O `essencial` instala L0+BASE na zona `.golmet/` do workspace —
o kit fica versionado no repositório e a equipe herda ao clonar; funciona
em qualquer engine agentic. O `completo` materializa o L1 FULL no engine —
as 93 componentes (agents, skills, perfis, templates) vivem no Opencode, e
é o modo recomendado porque nada falta: a IA entra no workspace com o
workflow inteiro.

Customização local em arquivo gerido é detectada e **preservada** — o
manifest de conteúdo sabe a proveniência e o SHA-256 de cada arquivo;
sobrescrever o que o operador modificou exige `--force` explícito.

## A zona `.golmet/` muda de papel

A mesma pasta do kit, semânticas distintas conforme o contexto — e isso não
é acidente, é o design: no **workspace-produto**, a `.golmet/` é o kit
versionado do repositório (DR-008); no **config do engine**, é o estado do
kit (o manifest de conteúdo e o personal.json); na **Organização
`org-repo`**, é a zona de trabalho gitignored (checkpoints em `meetings/`,
histórico em `migrations/`) — com a exceção versionada `.golmet/skills/`
quando o essencial da org roda na raiz (ver
[organization.md]((organization).pt-br.md)).

O que isso significa na prática do MeuApp: o produto não carrega zona
própria — a zona é da MinhaOrganizacao. Se amanhã a org migrasse para
`produtos-repo`, cada produto ganharia a sua (o `init --into` entrega o
modelo declarado — ver o detail em
[docs/reference/commands.pt-br.md](../reference/commands.pt-br.md)).
