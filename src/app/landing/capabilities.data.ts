// RN-001-3 — dados da tabela de capacidades (fonte única versionada, não
// hardcode no componente — ADR-003). Regra RN-004: somente comandos LANÇADOS
// no release vigente do golmet-cli (0.3.0 — 18 comandos). A lista canônica
// vive no repo do kit (docs/reference); atualize aqui a cada release novo.
export interface Capability {
  readonly command: string;
  readonly description: string;
}

export const CAPABILITIES: readonly Capability[] = [
  { command: 'golmet adopt', description: 'Adota o FORMATO v1 num workspace existente (dry-run → apply)' },
  { command: 'golmet db', description: 'Serviços de banco de dados — drift entre DATA_MODEL e migrations' },
  { command: 'golmet doctor', description: 'Saúde do ambiente com dicas de remediação' },
  { command: 'golmet eval', description: 'Runner determinístico de evals de skills' },
  { command: 'golmet index', description: 'Recompõe o índice de estados do workspace' },
  { command: 'golmet init', description: 'Cria o workspace do produto (wizard interativo)' },
  { command: 'golmet install', description: 'Onboarding: engine + skills gm-* + MCPs + doctor' },
  { command: 'golmet lint', description: 'Varredura estrutural determinística com remediação' },
  { command: 'golmet mcp', description: 'Serve o kit via MCP — tools para o agente' },
  { command: 'golmet next', description: 'Recomenda a próxima ação sobre o workspace' },
  { command: 'golmet pack', description: 'Gerencia packs de skills e agents (camada L2)' },
  { command: 'golmet status', description: 'Dashboard de estados das entidades' },
  { command: 'golmet template', description: 'Emite templates do kit direto do embed' },
  { command: 'golmet tools', description: 'Instala tools nativas (grafo de código)' },
  { command: 'golmet uninstall', description: 'Remove a estrutura global por camadas' },
  { command: 'golmet update', description: 'Atualiza o subset BASE de skills no workspace' },
  { command: 'golmet upgrade', description: 'Self-update do binário via release do GitHub' },
  { command: 'golmet validate', description: 'Valida o workspace contra o FORMATO v1' },
] as const;
