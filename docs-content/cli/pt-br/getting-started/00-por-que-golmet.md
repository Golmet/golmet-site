<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>

# 00 — Por que o Golmet existe

Todo projeto de software começa com boas intenções: alguém escreve os
requisitos, alguém desenha a arquitetura, o time alinha o escopo. E então o
prazo aperta. O requisito muda numa conversa de corredor e ninguém atualiza
o documento. O spec desenhado no Figma fica duas sprints atrás do que o
código faz. Três meses depois, a documentação é um museu de coisas que já
não são verdade — e o time para de olhar para ela.

O operador, dono da **MinhaOrganizacao**, viveu isso em todos os projetos. O produto
de agendamento da empresa, o **MeuApp**, tinha requisitos num Word, decisões
espalhadas em mensagens e um código que cresceu sem ninguém saber exatamente
quais regras de negócio estavam implementadas. Quando um cliente perguntava
"por que a confirmação de vaga funciona assim?", a resposta estava na cabeça
de uma pessoa — e pessoas saem de férias, trocam de empresa, esquecem.

O problema não é falta de vontade de documentar. É que **documentar não
compete**: enquanto o doc é um esforço separado do código, ele sempre perde
prioridade, e enquanto ele não é verificado, ele sempre apodrece. Ferramentas
de documentação bonitas não resolvem isso — só mudam o lugar onde o museu
fica.

## O que muda com o Golmet

O Golmet ataca os dois lados de uma vez:

**A documentação passa a ser verificada por máquina.** O kit define um
contrato (o FORMAT v1): cada regra de negócio é uma seção de documento com
estado e dono, e cada regra carrega **evidência** — o arquivo, a linha e o
hash do código que a implementa. `golmet validate` confere tudo isso a cada
execução. Documentação velha não é "chato", é **finding que bloqueia o
merge**.

**A IA faz o trabalho que ninguém tinha tempo de fazer.** O Golmet não é só
o validador: ele traz um workflow de skills (`gm-*`) que a sua IA executa
dentro do editor. É a IA que conduz a elicitação com o dono do produto, a IA
que escreve a spec técnica a partir das regras, a IA que revisa o código
contra a spec antes do merge. Escrever documentação deixa de ser um esfuerzo
heroico de fim de sprint e vira subproduto do próprio desenvolvimento.

Na prática, com o Golmet instalado e o Opencode aberto no workspace:

- você descreve o requisito em português e a skill `gm-clarify`/`gm-req`
  transforma em seção de requisito com score, estado e dono;
- a partir da requisição, o `gm-taskspec` gera a análise funcional e a
  técnica, e o delivery nasce com as tasks;
- quando o código sai, o `gm-dev-qa` roda a suíte e o `golmet validate`
  confere a congruência — o que divergiu aparece com remediação.

O resultado que o operador viu no MeuApp: quando o cliente pergunta por que a
confirmação de vaga funciona assim, a resposta é uma seção de requisito com
evidência apontando para o código — e ela está correta porque a máquina
confirma a cada validação.

## Por onde começar

A jornada continua nos próximos tutoriais:
[01 — criar a Organização](01-organizacao.pt-br.md) ·
[02 — criar o projeto](02-projeto.pt-br.md) ·
[03 — trabalhando com IA](03-trabalhando-com-ia.pt-br.md) ·
[04 — o ciclo de uma feature](04-o-ciclo-de-uma-feature.pt-br.md) ·
[05 — o que sobra no fim](05-maturidade-e-conhecimento.pt-br.md).
