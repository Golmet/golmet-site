<p align="center">English | <a href="compatibility.pt-br.md">Português (Brasil)</a></p>

# INSTALL_COMPATIBILITY - Matriz MCP × Engine (v0.1)

> Matriz REAL de compatibilidade do `golmet install`, verificada célula a
> célula contra a implementação (`internal/core/install/`) e TRAVADA por
> testes (`internal/core/install/*_test.go` — o teste é citado na célula).
> Célula sem teste que a exercita está marcada **não verificado** — não
> presumida.

**Legenda:** ✅ suportado (teste trava) · ⚠️ parcial (o que falta citado) ·
❌ não suportado (motivo + teste que trava a degradação) · ◻ não verificado.

**Escala de suporte do engine:**
- **Primeira classe** — skills gm-* instaladas no engine + MCPs stdio e remote.
- **MCP-only** — MCPs via config, sem sistema de skills (skills ficam na zona
  `.golmet/` do workspace).
- **Remote degrada** — só stdio; remotes caem em ❌ com instrução manual.

## Capacidades por engine

| Engine | Skills gm-* | MCP stdio | MCP remote | env escrita no config | Wire |
|---|---|---|---|---|---|
| opencode | ✅ | ✅ | ✅ | ❌ (CLI v0.1 — engine lê ambiente herdado) | CLI `opencode mcp add --global` + pós-verify `mcp list` |
| claude-code | ✅ | ✅ | ✅ | ✅ literal no patch | CLI `claude mcp add -s user` → fallback patch `~/.claude.json` |
| copilot-cli | ❌ | ✅ | ✅ | ✅ literal (patch) / `--env` (CLI) | CLI `copilot mcp add` + pós-verify `mcp get` → fallback patch `$COPILOT_HOME/mcp-config.json` |
| vscode-copilot | ❌ | ✅ | ❌ | ✅ literal no patch | patch `.vscode/mcp.json` (workspace) — `servers.{type:stdio,...}` |
| cursor | ❌ | ✅ | ✅ | ✅ literal no patch | patch `~/.cursor/mcp.json` — `mcpServers` (remote por `url`) |
| gemini-cli | ❌ | ✅ | ❌ | ✅ literal no patch | patch `~/.gemini/settings.json` — `mcpServers` |
| codex | ❌ | ✅ | ❌ | ❌ (TOML v0.1 — engine lê ambiente herdado) | append `~/.codex/config.toml` — `[mcp_servers.<nome>]` |

**Contagem:** MCP stdio 7/7 engines ✅ · MCP remote 4/7 ✅ (opencode,
claude-code, copilot-cli, cursor) · skills 2/7 ✅ (opencode, claude-code) ·
env no config 5/7 ✅ literal (❌ opencode e codex: ambiente herdado).

## Matriz completo × Engine (`install --full` / `update --full`)

Regra de produto: o perfil **completo** (89 componentes; alias interno
`full`) exige engine com skills nativas — **só opencode e claude-code** (o
critério é `adapter.SkillsDir(home) != ""`, derive — nunca lista hardcoded).
Nos demais engines, os pontos de entrada falham fail-closed citando os
compatíveis. O perfil **essencial** aceita TODOS os engines. Travado por
`TestEngineMatrixProfilesAllSeven` (completo nativo + erro fail-closed) e
`TestWizardProfileConfirmFiltersEngines` (o wizard VT filtra a lista ao
confirmar completo):

| Engine | essencial | completo |
|---|---|---|
| opencode | ✅ (skills na zona `.golmet/`) | ✅ nativo — `~/.config/opencode/{agents,skills}/` · manifest `.golmet/manifest.json` |
| claude-code | ✅ (skills na zona `.golmet/`) | ✅ nativo — `~/.claude/{agents,skills}/` · manifest `.golmet/manifest.json` |
| copilot-cli | ✅ | ❌ erro fail-closed (`install`/`update --full`/`gm_update`) |
| vscode-copilot | ✅ | ❌ erro fail-closed |
| cursor | ✅ | ❌ erro fail-closed |
| gemini-cli | ✅ | ❌ erro fail-closed |
| codex | ✅ | ❌ erro fail-closed |

Notas:
- **Zona do workspace = comportamento interno do pipeline**, não exposição
  de UX: a infra de materialização em `<ws>/.golmet/` (com o manifest de
  conteúdo separado `manifest-content.json`, que não colide com o manifest
  essencial do `update.Install` — 3-way e proveniência preservados) permanece
  no pacote e coberta em nível de lib (`TestFullWorkspaceZoneCoexistsWithBaseManifest`,
  `TestFullFallbackDryRunWritesNothing`), mas nenhum ponto de entrada a
  escolhe mais.
- Mensagem de erro padrão: `o perfil completo exige engine com skills
  nativas — compatíveis: opencode, claude-code; para <engine>, use o perfil
  essencial`.
- Wizards (VT e numerado) filtram a lista de engines ao confirmar completo —
  engines fracos não aparecem no fluxo.
- dry-run da materialização em zona não escreve nada
  (`TestFullFallbackDryRunWritesNothing`).
- Nomes dos PERFIS do CLI: `essencial` | `completo` (semântica de contrato —
  veja a NOTA em FORMAT §2.1); `base`/`full` são aliases aceitos pelas
  flags. Os nomes de CAMADA L0–L3 (DR-021) não mudam.

## Matriz MCP × Engine

O comportamento é **uniforme por tipo** dentro de cada engine: as 8 linhas
stdio (golmet, codegraph, azure-devops, aws, sqlite, figma, playwright,
postgres) seguem a célula "stdio" do engine; os 4 remotes (github, supabase,
cloudflare, hostinger) seguem a célula "remote". A matriz completa, célula a
célula:

| MCP | opencode | claude-code | copilot-cli | vscode | cursor | gemini | codex |
|---|---|---|---|---|---|---|---|
| golmet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| codegraph | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| azure-devops | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| github (remote) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| supabase (remote) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| cloudflare (remote) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| aws | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| sqlite | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| figma | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| playwright | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| postgres | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| hostinger (remote) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

Notas por linha:
- **golmet** — command resolvido para o exe corrente no momento do install.
- **codegraph** — binário do bloco 3; ausente → download verificado
  (SHA-256 + attestation) durante o install.
- **azure-devops** — único com parâmetro obrigatório (`ORG`):
  `--mcp azure-devops=MinhaOrg`; PAT via env `ADO_PAT_B64` (ausente → pendente).
- **aws** — env `AWS_PROFILE` obrigatória (ausente → pendente).
- **sqlite** — binário LOCAL do usuário (`%LOCALAPPDATA%\Programs\mcp-sqlite\`);
  ausente → pendente com fix citando github.com/rusq/mcp-sqlite (o kit não
  instala no v0.1).

## Verificação célula a célula

- **stdio (todas as células ✅)** — comportamento travado POR ENGINE:
  - opencode: `TestOpenCodePlaceholdersResolvedAndPostVerify` (wire stdio +
    pós-verify `mcp list`), `TestOpenCodePostVerifyCatchSilentFailure`
    (falso-positivo proibido), `TestOpenCodeListUnavailableDegradesDeclared`.
  - claude-code: `TestClaudePatchIdempotentAndDiverge` (patch idempotente +
    divergência sem --force), `TestRunEnvLiteralWrittenNotLogged` (env
    literal, não logada).
  - copilot-cli: `TestCopilotPatchIdempotentCOPILOTHomeAndRemote`,
    `TestCopilotCLIFirstWithEnvAndPostVerify` (CLI `--env` + `mcp get`),
    `TestCopilotDefaultHome`, `TestCopilotDetectViaLookPathAndNoSkills`.
  - vscode: `TestVSCodeWorkspaceConfigAndCursorRemoteGemini` (servers.{stdio}).
  - cursor: idem (mcpServers stdio).
  - gemini: idem (mcpServers stdio).
  - codex: `TestCodexTOMLAppendSectionGuard` (guarda de seção + wire
    command/args separados), `TestClaudePatchIdempotentAndDiverge` não se
    aplica; wire regressão no mesmo teste.
- **remote (células ✅/❌)**:
  - opencode ✅: `TestOpenCodeRemoteURLWire` (`--url` + pós-verify).
  - claude-code ✅: `TestClaudeRemoteFallbackPatch` ({type:http,url}).
  - copilot-cli ✅: `TestCopilotPatchIdempotentCOPILOTHomeAndRemote`
    ({type:http,url} no patch) + CLI `--transport http` (sintaxe verificada
    em máquina real — `copilot mcp add --help` — célula CLI **não
    verificado** contra engine real no v0.1).
  - vscode ❌: `TestNewRemotesEngineMatrix` (unsupported + instrução).
  - cursor ✅: `TestNewRemotesEngineMatrix` + `TestVSCode...` (url).
  - gemini ❌ / codex ❌: `TestNewRemotesEngineMatrix` (unsupported +
    instrução).
- **env escrita no config**: `TestRunEnvLiteralWrittenNotLogged` (claude),
  `TestCopilotEnvLiteralInPatch` (copilot patch),
  `TestEnvLiteralOnJSONEngines` (vscode/cursor/gemini), `TestAWSEnvMissingPending`
  (ausente → pendente, config limpo). opencode/codex ❌ por wire (CLI/TOML).
- **skills**: `TestRunSkillsAndMCPPatch` (16 escritas no claude),
  `TestOpenCodeSkillsWithoutCLI` (16 no opencode sem CLI),
  `TestRunSkillsPreserveModifiedWithoutForce` (DR-008 preserve/force),
  `TestInstallCmdFlagsEndToEnd` (nota do codex sem skills).
- **pendências (config quebrada nunca)**: `TestRunEnvMissingPendingNotRegistered`,
  `TestAWSEnvMissingPending`, `TestAzureDevopsWithoutParamPending`,
  `TestSQLiteBinaryPresentAndMissing`.

## Não verificado (honesto)

- **opencode remote contra engine real** — o wire `--url` é travado por
  teste unitário (args da CLI); a execução contra um opencode real não foi
  feita no v0.1 (o `opencode mcp add` real saiu 0 SEM escrever em máquina
  do operador — ver `TestOpenCodePostVerifyCatchSilentFailure`, que trava
  exatamente essa classe de falso-positivo via pós-verify).
- **copilot-cli CLI-first contra engine real** — sintaxe `copilot mcp add
  --help` verificada em máquina real (2026-11); execução de registro real
  não feita (pós-verify via `mcp get` trava o falso-positivo).
- **vscode/gemini/codex remote** — sem forma verificada nos fontes; ficam
  ❌ até levantamento dedicado.
- **wire de env no TOML do codex** — v0.1 não escreve env (o engine lê o
  ambiente herdado no boot do processo filho); se um engine exigir env no
  config, revisit.

## Regra de ouro

`golmet install` **nunca apaga nem desativa** nada que já exista
(coexistência é estado normal da janela de migração) e **nunca escreve
config quebrada** (env/param ausente = pendência com `fix:`, não registro).
