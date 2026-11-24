<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# 04 — O ciclo de uma feature

Este tutorial atravessa UMA feature do começo ao fim — a confirmação de
vaga do MeuApp (RN-001) — com cada documento aparecendo no momento em que
ele nasce. É a melhor forma de entender a arquitetura de artefatos do
Golmet: não como um diagrama, mas como uma sequência de trabalho. (O mapa
de referência, com a tabela completa de quem alimenta quem, está em
[docs/concepts/artefatos.md](../concepts/artefatos.pt-br.md).)

## 1. O requisito já está no REQUIREMENTS

Pelo tutorial 03, a RN-001 nasceu no `REQUIREMENTS.md` do MeuApp, estado
`confirmed`. É o ponto de partida de tudo: **a regra de negócio é a âncora**
— o documento ao redor do qual spec, task e código se organizam.

## 2. A spec técnica desce para o analysis

João pede no Opencode: "spec da RN-001". A skill `gm-taskspec` faz duas
coisas, nesta ordem:

- a **análise funcional** — o que a regra significa em comportamento (os
  critérios de aceitação, dado-quando-então);
- a **análise técnica** — como isso vira código: entidades afetadas,
  endpoints, contratos.

E cria a pasta `analysis/RN-001 — Agendamento com confirmação de vaga/`
com os dois documentos, mais o arquivo de Feature em `delivery/`. A feature
nasce com `anchor: RN-001` — o vínculo formal: esta feature existe PARA
esta regra. (Um feature com âncora PEND é erro bloqueante — o H1 do
FORMAT: nunca se implementa o que não foi confirmado.)

## 3. As tasks entram no delivery

Dentro da Feature, as tasks (`### RN-001-1`, `RN-001-2`…) descrevem o
trabalho com estado e dono. É daqui que a implementação parte: o `gm-dev`
pega a task, delega ao executor de código, e o QA independente roda a
suíte.

## 4. O código sai — e a evidência nasce

O executor implementa a confirmação de vaga. No commit, a evidência é
registrada na RN-001: `[BPro-API/src/Agendamento.cs:88 @a1b2c3d]` — o
arquivo, a linha e o hash. Este é o momento em que a documentação para de
ser promessa: a regra agora APONTA para o código.

## 5. A validação fecha o ciclo

```bash
golmet validate
```

O kit confere tudo de uma vez: a RN-001 aponta para código que existe (H7)?
O hash é o HEAD atual ou a evidência está stale (S2)? A feature está pronta
e a RN está ativa (H3)? O índice de estados bate com a prosa (H8)? As
referências cruzadas resolvem (H10)? Tudo verde:

```
ok — workspace conforme (FORMAT v1) — contexto: workspace-produto
0 erro(s), 0 aviso(s) — 57 arquivo(s), RN 14, PEND 1, CR 2, ADR 5, CAND 0, Feature 6, Task 21, Spec 12
```

Tudo verde. O `golmet lint` (a varredura estrutural L1–L10) passa limpo —
as referências da doc resolvem, os nomes estão no padrão, nada órfão.

Se algo estivesse divergindo — uma evidência stale, um spec sem a razão de
mudança — o validate apontaria **com a remediação**: o que corrigir, e qual
skill é a responsável. A IA corrige o que o lint aponta; o lint carrega o
estado. ([docs/concepts/self-governing.md](../concepts/self-governing.pt-br.md))

## 6. A entrega

A task sobe para `done`, a feature para `done`, a RN-001 fica `active` com
evidência consolidada. O `golmet status` mostra o quadro:

```
RN: 14 (12 active · 1 confirmed · 1 draft) · PEND: 1 · CR: 2 · Feature: 6 (5 done · 1 in progress)
```

E é isso — o ciclo completo. Quando o cliente perguntar "por que a
confirmação de vaga tem 15 minutos?", a resposta não está na cabeça de
ninguém: está na RN-001, com a spec que a detalha, a feature que a
implementou e o código que ela aponta.

O fim da história de um projeto não é o lixo: é
[05 — o que sobra no fim]((05-maturity-and-knowledge).pt-br.md).
