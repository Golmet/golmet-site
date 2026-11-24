# Uninstall

`golmet uninstall` removes the global Golmet structure layer by layer, with
dynamic discovery of the real state (manifest + personal.json + engine
config). Everything is selected by default EXCEPT packs — the pack's remote
repository is never touched. Flags: `--only <csv> --yes`
(non-interactive) · `--dry-run` · `--json`.
