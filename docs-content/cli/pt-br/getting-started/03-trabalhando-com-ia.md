<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# 03 — Trabalhando com a IA

Até aqui, tudo que o kit fez poderia ser feito à mão (e era — por isso ninguém
fazia). A diferença começa agora: o workspace do MeuApp está preparado para
uma IA trabalhar dentro dele, conduzindo o workflow. Este tutorial abre o
**Opencode** no workspace e roda o primeiro ciclo real.

## Abrir o Opencode no workspace

```bash
cd MinhaOrganizacao\MeuApp
opencode
```

O que a IA enxerga ao abrir não é o workspace pelado. O `golmet install
--engine opencode` (tutorial 00) materializou o **workflow completo** no
config do engine — e o engine, ao abrir no workspace, carrega:

- o **AGENTS.md** — a página do workflow que a IA lê primeiro: os primários
  por domínio (quem conduz requisitos, quem conduz doc, quem conduz dev),
  as skills `gm-*` por gatilho ("AO elicitar requisitos, leia isto"), as
  regras da organização e o roteador de conhecimento;
- a **arquitetura de delegação** — a IA sabe que `gm-req` é quem conduz a
  descoberta de negócio, que `gm-dev` coordena implementação com executores
  e QA, que nada edita o REQUIREMENTS.md sem passar pelo ciclo de
  requisito.

É por isso que o modo recomendado é **FULL + Opencode**: no FULL, as 93
componentes do workflow (agents, skills, perfis, templates) estão no
engine. Com o perfil essencial, as 16 skills BASE vivem versionadas na zona
`.golmet/` do workspace — o workflow funciona em qualquer engine, com o
subconjunto base.

## O primeiro requisito, com a IA

O cliente pediu: *"o agendamento precisa de confirmação de vaga — o cliente
reserva, tem 15 minutos para confirmar, senão a vaga libera"*. João, o dev,
abre o Opencode e conversa:

> "Precisa entrar o requisito de confirmação de vaga no MeuApp — reserva com
> janela de 15 minutos para confirmar."

A skill `gm-clarify` entra. Ela não engole o pedido: **questiona** — qual a
política de no-show? O que acontece com o pagamento se a vaga liberar? O
15 minutos conta de qual marco? Cada ambiguidade vira uma pergunta com
score; o que o cliente confirma vira requisito, o que fica em aberto vira
PEND com follow-up datado.

Quando o escore fecha, o `gm-req` escreve a seção no `REQUIREMENTS.md`:

```markdown
## RN-001 — Agendamento com confirmação de vaga

estado: confirmed

O cliente confirma a reserva em até 15 minutos ...
```

Nascida `confirmed` — porque veio do dono do produto. Quando o código
implementar, o estado sobe para `active` **com evidência**: o arquivo, a
linha e o hash do commit.

## O ciclo real

A partir daí a jornada segue sozinha — e é o próximo tutorial:
[04 — o ciclo de uma feature]((04-o-ciclo-de-uma-feature).pt-br.md) atravessa uma
feature inteira (requisito → spec → task → código → validação → entrega)
com cada documento aparecendo no momento em que ele é criado. O mapa
completo de quem nasce de quem está em
[docs/concepts/artefatos.md](../concepts/artefatos.pt-br.md).

O que importa aqui: **a IA não inventa o processo — ela o executa**. As
skills têm contrato (FORMAT §10): elas sabem o que podem escrever, o que
precisa de confirmação do operador, e quando degradar. O estado do projeto
continua sendo declarado em documentos que humanos leem — a IA é o
motor, não o dono.
