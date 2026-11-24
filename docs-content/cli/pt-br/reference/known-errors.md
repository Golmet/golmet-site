<p align="center"><a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"English</a> | <a href="https://github.com/Golmet/golmet-cli/blob/main/README.md"Português (Brasil)</a> | <a href="/docs/reference/known-errors"English (pointer)</a></p>

# KNOWN_ERRORS — erros conhecidos do workflow Golmet

> Reativo: entradas nascem de incidentes reais de suporte/operação. Formato: sintoma, causa, workaround, status. Nunca proativo.

## KE-001 — `publish-core.sh` trava no push quando executado via WSL

- **Sintoma:** `publish/publish-core.sh` monta o snapshot e cria o commit no clone de `gm-core`, mas o passo `git push` fica pendente indefinidamente (tool timeout) quando o script roda via WSL/bash no Windows.
- **Causa:** o git do WSL não tem credential helper configurado e pede credencial de forma interativa, sem receber.
- **Workaround:** o commit já existe — empurre do lado Windows: `git -C ~ push origin main`. Fix definitivo (a fazer): no script, delegar o push ao git do Windows (`git.exe`) ou exigir `gh auth setup-git` no WSL.
- **Status:** ✅ resolvido (IMP-117) — o script usa `GIT_TERMINAL_PROMPT=0` (nunca travar: falha fast) e, se o push falhar, imprime o comando exato de push pelo lado Windows (`wslpath -w`). Ocorreu nas releases `af3da4a`, `16bae95` e `44637a3` (antes do fix).
- **Referência:** IMP-113/IMP-115 · 20-21/10/2026.
