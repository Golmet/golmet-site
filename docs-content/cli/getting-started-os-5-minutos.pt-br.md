# Getting started (os 5 minutos)

```bash
# instalar (npm — a via principal; o launcher despacha o binário da sua plataforma)
npm install -g golmet-cli

# onboard: engine + skills + catálogo MCP + doctor, um comando
golmet install --engine opencode

# inicializar (o wizard pergunta o que criar)
golmet init

# os primeiros comandos, na ordem
golmet validate   # o workspace contra o FORMAT v1 — exit ≠ 0 bloqueia o CI
golmet lint       # a varredura estrutural determinística (L1–L10)
golmet doctor     # a saúde do ambiente (S1–S5, checks de máquina)
golmet status     # o dashboard dos estados das entidades
```

> Atualização por canal: `golmet upgrade` (self-update) atualiza
> instalações Go/binário; via npm, atualize com `npm update -g golmet-cli`.
