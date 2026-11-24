<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# O Context7 no workflow

Durante o tutorial [03](../getting-started/03-trabalhando-com-ia.pt-br.md),
quando a IA foi escrever a integração de confirmação de vaga com o gateway
de pagamento, ela precisava da API atual do gateway — não da API de quando
o modelo dela foi treinado. É para esse buraco que existe a integração
Context7.

## O gatilho

A regra de operação mora no `profile/context7.md` do config (a prateleira
do [profile](profile.pt-br.md)): **ANTES de responder sobre
library/framework/SDK/API/CLI/cloud, o agent consulta o Context7** —
resolve o ID da library e busca a documentação atual pela tool MCP. A
memória do modelo envelhece; a documentação da fonte, não.

## Como o kit entrega

O wizard do `golmet install` registra a tool MCP do Context7 no engine (o
catálogo marca a integração), e o setup guiado (`gm-setup`, opcional)
valida com um smoke test. A API key é opcional (grátis em context7.com) —
via `profile/` da instância, nunca no repo.

## A fronteira

O Context7 é pesquisa de documentação pública — o dado do produto (a org, os
tokens, os requisitos) nunca vai na consulta. No MeuApp, a IA buscou no
Context7 como o gateway confirma pagamentos; o COMO o MeuApp confirma a vaga
está na RN-001 — uma coisa é a API do mundo, outra é a regra do seu
produto.
