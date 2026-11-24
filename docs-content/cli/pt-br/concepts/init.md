<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# O wizard do init — o que acontece na tela

O tutorial [01](../getting-started/01-organizacao.pt-br.md) mostrou o
wizard em ação. Esta página documenta o mecanismo — as garantias que o
wizard dá e as que você pode exigir dele.

## O princípio: nunca cria sem perguntar

**O `golmet init` sem flags é sempre interativo** — pergunta, mostra o
resumo, e só cria com ENTER no confirm. É a resposta do kit ao acidente
que motivou a regra: um init rodado na pasta errada (o HOME, junto da
instalação global do kit) criou um workspace misturado com o estado do
próprio kit. Por isso: **o init nunca cria na raiz do HOME**, e script/CI
exige flags explícitos (`--org` ou `--into <container>`) com `--yes` — sem
TTY e sem flags, o init falha fechado (exit 2, nada escrito, a remediação
cita os flags).

## As garantias em qualquer passo

O wizard inteiro roda em raw mode (o mesmo arsenal do install), e as
garantias são transversais: **esc/CTRL+C cancelam tudo, em qualquer passo**
— nada é criado antes do confirm final. **← no texto vazio volta ao passo
anterior**, com o valor digitado **pré-ecado para editar**; `n` no confirm
também volta a editar (não cancela). Os campos de texto aceitam UTF-8
(acentos) e o backspace apaga o caractere inteiro — em raw mode o ESC de
teclado chega ao programa, coisa que o console captura no modo cooked.

## O modo recomendado em prática

Para quem prefere o caminho rápido, os flags são o wizard em forma de
comando: `golmet init --org` (declara a org, cria o `.gitignore`, registra
no catálogo global) e `golmet init <produto> --into <container>` (entrega o
produto no modelo de versionamento declarado pela org). O `--yes` pula a
confirmação nos flags explícitos. A declaração completa dos caminhos está
em [FORMAT §2](../../docs/FORMAT.pt-br.md) e na referência
([commands.pt-br.md](../reference/commands.pt-br.md)).
