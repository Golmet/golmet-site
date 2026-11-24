<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# A prateleira `profile/` e as normas

No config do engine (o `~/.config/opencode` do operador), existe uma pasta
que separa dois mundos que costumam se misturar: **os recursos de operação
que a IA lê** e **os dados que são só seus**. A prateleira `profile/` é a
resposta do kit à pergunta "onde a IA busca o contexto de operação sem eu
expor dado pessoal?".

## O que mora lá

Dois tipos de conteúdo, donos diferentes. Os **recursos kit-canônicos** —
escritos pelo kit, geridos pelo manifest de conteúdo: o registry de
boilerplates por stack (`profile/stack-templates.yaml`, que o
`gm-stack-boilerplate` usa para scaffaldar projetos novos) e as integrações
(a referência do Context7, por exemplo — [context7.md]((context7).pt-br.md)). E os
**definitivos pessoais-por-design**: o `profile/client-profile.md` (a org,
os produtos, as preferências do cliente) e o
`profile/operator-profile.md` (quem você é, papel, e-mail) — versionados
NUNCA: o `personal.json` designa o que é pessoal e o kit não os
rematerializa. O `golmet template <client-profile>` emite o esqueleto para
você preencher — templates vivem no kit, o config carrega só os
definitivos.

## As normas: o jeito da casa com gatilho

As **normas** — como a MinhaOrganizacao faz deploy, como um repo novo é criado —
não moram no config: moram IN-PLACE no state pack da org
(`packs/<id>/rules/`), **uma norma por arquivo**, com o formato canônico do
`gm-rule-keeper`: um título e um **gatilho explícito** no topo.

```
# Deploy da MinhaOrganizacao

> Gatilho: AO criar um pipeline de deploy, leia este arquivo
```

O gatilho é o que torna a norma viva: o AGENTS.md do workflow indexa as
normas por gatilho, e a IA as lê **no momento do trabalho** — quando vai
criar o pipeline, o gatilho dispara e a norma chega ao contexto. Não é
documentação para reler: é documentação que chega na hora certa.

O ciclo: edita o working copy do pack → `golmet pack publish` (commit +
push) → a equipe roda `golmet pack update` e herda. O kit nunca descarta
acumulação local — o aprendizado de quem opera é ativo da organização (o
ecossistema completo em [knowledge.md]((knowledge).pt-br.md)).
