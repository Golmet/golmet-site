// RN-001-3 / CR-004/CR-006 — dados da tabela de capacidades (fonte única
// versionada, não hardcode no componente — ADR-003). Regra RN-004: somente
// comandos LANÇADOS no release vigente do golmet-cli (18 comandos),
// agrupados por tema. A lista canônica vive no repo do kit (docs/reference);
// atualize aqui a cada release novo.
export interface Capability {
  readonly command: string;
  readonly description: string;
}

export interface CapabilityGroup {
  readonly name: string;
  readonly description: string;
  readonly capabilities: readonly Capability[];
}

export const CAPABILITY_GROUPS: readonly CapabilityGroup[] = [
  {
    name: 'Comece',
    description: 'Bootstrap do workspace e do ambiente',
    capabilities: [
      { command: 'golmet init', description: 'Cria o workspace do produto (wizard interativo)' },
      { command: 'golmet install', description: 'Onboarding: engine + skills gm-* + MCPs + doctor' },
      { command: 'golmet doctor', description: 'Saúde do ambiente com dicas de remediação' },
      { command: 'golmet next', description: 'Recomenda a próxima ação sobre o workspace' },
    ],
  },
  {
    name: 'Mantenha a verdade',
    description: 'Validação, qualidade e estado do workspace',
    capabilities: [
      { command: 'golmet validate', description: 'Valida o workspace contra o FORMATO v1' },
      { command: 'golmet lint', description: 'Varredura estrutural determinística com remediação' },
      { command: 'golmet index', description: 'Recompõe o índice de estados do workspace' },
      { command: 'golmet status', description: 'Dashboard de estados das entidades' },
      { command: 'golmet adopt', description: 'Adota o FORMATO v1 num workspace existente (dry-run → apply)' },
      { command: 'golmet eval', description: 'Runner determinístico de evals de skills' },
      { command: 'golmet db', description: 'Serviços de banco de dados — drift entre DATA_MODEL e migrations' },
    ],
  },
  {
    name: 'Evolua e distribua',
    description: 'Updates, packs, tools e integração agêntica',
    capabilities: [
      { command: 'golmet update', description: 'Atualiza o subset BASE de skills no workspace' },
      { command: 'golmet upgrade', description: 'Self-update do binário via release do GitHub' },
      { command: 'golmet pack', description: 'Gerencia packs de skills e agents (camada L2)' },
      { command: 'golmet tools', description: 'Instala tools nativas (grafo de código)' },
      { command: 'golmet template', description: 'Emite templates do kit direto do embed' },
      { command: 'golmet uninstall', description: 'Remove a estrutura global por camadas' },
      { command: 'golmet mcp', description: 'Serve o kit via MCP — tools para o agente' },
    ],
  },
] as const;
