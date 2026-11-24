# Desinstalação

`golmet uninstall` remove a estrutura global do Golmet por camadas, com
descoberta dinâmica do estado real (manifest + personal.json + config do
engine). Tudo vem selecionado por padrão, MENOS o pack — o repositório
remoto do pack nunca é tocado. Flags: `--only <csv> --yes` (não-interativo)
· `--dry-run` · `--json`.
