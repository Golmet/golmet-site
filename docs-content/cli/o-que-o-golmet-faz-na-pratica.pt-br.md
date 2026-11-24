# O que o Golmet faz, na prática

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
