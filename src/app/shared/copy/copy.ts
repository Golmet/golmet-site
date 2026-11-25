// RN-014-3 / RN-011-5 / CR-005 — copy por locale no tom "Guardião Estoico" (RN-015).
//
// ADR-009/RN-013 — assimetria de fonte por superfície:
//   landing  → PT-BR é a FONTE canônica (EN derivado e revisado)
//   docs     → EN é a fonte (derivada do repo golmet-cli via pipeline RN-007)
// Mudança nessa estratégia exige CR (ADR-009). Consumidores pegam o tree pelo
// locale da rota (RN-011) — nenhum copy inline em componente.
//
// A versão do kit exibida no site NÃO é hardcoded: tools/fetch-cli-version.mjs
// captura do registry npm no build e gera ../cli-version.generated.ts.
//
// Regras da voz: frases curtas, zero hype, sempre cita evidência.
// Arki NUNCA é retratado criando conteúdo — só diagnostica, cita
// evidência e bloqueia.

import { CLI_VERSION } from '../cli-version.generated';

export type Locale = 'en' | 'pt-BR';

export interface QuickstartStep {
  readonly title: string;
  /** comando copiável — passos narrados (ações) não o têm */
  readonly command?: string;
  readonly text: string;
}

export interface ProblemCard {
  readonly title: string;
  readonly text: string;
}

export interface ThesisLayer {
  readonly name: string;
  readonly role: string;
  readonly text: string;
}

export interface FlowStep {
  readonly name: string;
  readonly text: string;
}

export interface PathCard {
  readonly title: string;
  readonly text: string;
  readonly docPath: string;
}

export interface FeatureCommand {
  readonly command: string;
  readonly description: string;
}

export interface DiffItem {
  readonly title: string;
  readonly text: string;
}

export interface CopyTree {
  readonly landing: {
    readonly hero: {
      readonly kicker: string;
      readonly title: string;
      readonly tagline: string;
      readonly plainLine: string;
      readonly valueHighlight: string;
      readonly valueProposal: string;
      readonly statusNote: string;
    };
    readonly terminal: { readonly title: string };
    readonly problem: {
      readonly heading: string;
      readonly note: string;
      readonly cards: readonly ProblemCard[];
    };
    readonly thesis: {
      readonly heading: string;
      readonly note: string;
      readonly layers: readonly ThesisLayer[];
    };
    readonly howItWorks: {
      readonly heading: string;
      readonly note: string;
      readonly steps: readonly FlowStep[];
    };
    readonly engines: {
      readonly heading: string;
      readonly note: string;
      readonly engines: readonly string[];
    };
    readonly differentiation: {
      readonly heading: string;
      readonly items: readonly DiffItem[];
    };
    readonly quickstart: {
      readonly heading: string;
      readonly badge: string;
      readonly note: string;
      readonly steps: readonly QuickstartStep[];
    };
    readonly paths: {
      readonly heading: string;
      readonly items: readonly PathCard[];
    };
    readonly capabilities: {
      readonly heading: string;
      readonly docLink: string;
      readonly note: string;
      readonly featured: readonly FeatureCommand[];
    };
    readonly ctas: { readonly github: string; readonly npm: string };
    readonly finalCta: {
      readonly heading: string;
      readonly text: string;
      readonly command: string;
      readonly preLaunch: string;
    };
  };
  readonly portal: {
    readonly sidebarTitle: string;
    readonly searchPlaceholder: string;
    readonly notTranslated: string;
    readonly indexNote: string;
    readonly onThisPage: string;
    readonly prevLabel: string;
    readonly nextLabel: string;
    readonly editPage: string;
    readonly updatedAt: string;
  };
  readonly notFound: {
    readonly title: string;
    readonly message: string;
    readonly hint: string;
  };
  readonly footer: {
    readonly links: { readonly docs: string; readonly github: string; readonly npm: string };
    readonly license: string;
    readonly copyright: string;
  };
}

// ── pt-BR — FONTE da landing (ADR-009/RN-013) ───────────────────

const ptBR: CopyTree = {
  landing: {
    hero: {
      kicker: 'REQUISITOS · EVIDÊNCIAS · VERSIONAMENTO',
      title: 'GOLMET',
      tagline: 'Requisitos versionados. Docs que não apodrecem.',
      plainLine:
        'GOLMET é uma CLI que transforma requisitos em markdown versionado no seu git — ' +
        'e avisa quando código e doc divergem.',
      valueHighlight: 'Seu contrato.',
      valueProposal: 'Seu repositório. Uma fonte de verdade que acompanha o código.',
      statusNote: `Site em construção — o kit v${CLI_VERSION} já está estável no npm.`,
    },
    terminal: {
      title: 'Saída real — install · version · init · status · validate',
    },
    problem: {
      heading: 'Todo mundo de software já viveu',
      note: 'Se alguma dessas cenas é familiar, o problema não é o time — é a ausência de uma fonte de verdade.',
      cards: [
        {
          title: 'A conversa ficou no passado',
          text: 'O cliente pediu numa reunião. Ninguém registrou direito. Três semanas depois, cada um lembra de um jeito.',
        },
        {
          title: 'O código virou mistério',
          text: 'A funcionalidade está no ar — mas o detalhe (valor mínimo, o que bloqueia, por quê) mora na cabeça de quem escreveu.',
        },
        {
          title: 'Escopo fantasma',
          text: '"Não foi isso que eu pedi" — e não há como provar o que foi pedido.',
        },
        {
          title: 'A doc apodreceu',
          text: 'Mudou o requisito, ninguém atualizou o documento. Doc velha é doc que ninguém confia.',
        },
      ],
    },
    thesis: {
      heading: 'Uma máquina de estados documental',
      note: 'O requisito versionado é o estado normativo do produto. Três camadas, divididas por natureza:',
      layers: [
        {
          name: 'FORMATO',
          role: 'O contrato',
          text: 'Layout do workspace, schemas e transições de estado — versionado e estável.',
        },
        {
          name: 'KIT',
          role: 'O motor determinístico',
          text: 'Valida, indexa, checa evidência. Sem LLM, sem surpresa.',
        },
        {
          name: 'RUNTIME',
          role: 'A camada agêntica',
          text: 'O julgamento por capacidades — em qualquer engine dos padrões abertos.',
        },
      ],
    },
    howItWorks: {
      heading: 'Como funciona',
      note: 'Do acordo inicial à verificação contínua em cada commit.',
      steps: [
        { name: 'Charter', text: 'O que vamos construir — confirmado com o cliente.' },
        { name: 'Regras', text: 'RNs numeradas, claras e aprovadas antes do código.' },
        { name: 'Specs', text: 'Modelo de dados, contratos e telas derivados das regras.' },
        { name: 'Código', text: 'Tasks com critérios de aceitação e evidência citada.' },
        { name: 'Verdade viva', text: 'Mudou o requisito? O kit aponta exatamente o que ficou desatualizado.' },
      ],
    },
    engines: {
      heading: 'Funciona com o seu agente',
      note: 'Via os padrões abertos do ecossistema — AGENTS.md, SKILL.md e MCP. Sem lock-in de engine.',
      engines: ['OpenCode', 'Claude Code', 'Cursor', 'Codex', 'Gemini CLI', 'Copilot CLI', 'VS Code Copilot'],
    },
    differentiation: {
      heading: 'Por que não é só mais um spec-tool',
      items: [
        {
          title: 'Markdown no seu git',
          text: 'Requisitos são arquivos simples que qualquer engine lê. Sem formato proprietário, sem lock-in.',
        },
        {
          title: 'Evidência parseável',
          text: 'Cada regra cita `[caminho:linha @hash]` — a conexão docs ↔ código é verificável por máquina.',
        },
        {
          title: 'O kit é o árbitro',
          text: 'Um binário determinístico valida estados e evidência. A verdade não depende só do prompt.',
        },
      ],
    },
    quickstart: {
      heading: 'Comece pelo combinado',
      badge: `v${CLI_VERSION}`,
      note: `Release v${CLI_VERSION} estável no npm — os comandos acima já funcionam.`,
      steps: [
        {
          title: 'Instale o binário',
          command: 'npm i -g golmet-cli',
          text: 'Nativo, zero dependência de runtime.',
        },
        {
          title: 'Configure o kit',
          command: 'golmet install',
          text: 'Wizard configura engine, skills gm-* e MCPs do kit.',
        },
        {
          title: 'Inicie o workspace',
          command: 'golmet init NomeDoProduto',
          text: 'Wizard cria o workspace: golmet.yaml, charter e zonas do FORMATO.',
        },
        {
          title: 'A verdade fica versionada',
          text: 'Markdown no seu git — sobrevive a engines, kits e releases.',
        },
      ],
    },
    paths: {
      heading: 'Escolha seu caminho',
      items: [
        {
          title: 'Produto novo',
          text: 'Charter, requisitos e specs do zero — kit e agente na mesma pasta.',
          docPath: '/docs/pt-br',
        },
        {
          title: 'Repo legado',
          text: 'O guardião lê o código e propõe as regras; você confirma o que é verdade.',
          docPath: '/docs/pt-br',
        },
        {
          title: 'Org multi-dev',
          text: 'Onboarding do dev #2: clone, doctor, pack sync — checklist sem manual.',
          docPath: '/docs/pt-br',
        },
      ],
    },
    capabilities: {
      heading: 'O que o kit faz',
      docLink: 'todos os 18 comandos na documentação →',
      note: 'Somente o que está lançado no release vigente — o guardião não promete o que não existe.',
      featured: [
        { command: 'golmet init', description: 'Cria o workspace do produto (wizard interativo)' },
        { command: 'golmet validate', description: 'Valida o workspace contra o FORMATO v1' },
        { command: 'golmet status', description: 'Dashboard de estados das entidades' },
        { command: 'golmet next', description: 'Recomenda a próxima ação sobre o workspace' },
      ],
    },
    ctas: {
      github: 'Ver no GitHub',
      npm: 'golmet-cli no npm',
    },
    finalCta: {
      heading: 'Comece hoje',
      text: 'Um comando. Um workspace. A verdade versionada no seu git.',
      command: 'npm i -g golmet-cli',
      preLaunch: `v${CLI_VERSION} estável — instalação funcional pelo npm.`,
    },
  },
  portal: {
    sidebarTitle: 'Documentação',
    searchPlaceholder: 'Buscar na documentação…',
    notTranslated: 'Página não traduzida — exibindo a versão em inglês.',
    indexNote: 'Renderizada direto do repositório golmet-cli — docs, releases e changelog.',
    onThisPage: 'Nesta página',
    prevLabel: '← Anterior',
    nextLabel: 'Próximo →',
    editPage: '✏️ Edite esta página no GitHub',
    updatedAt: 'Atualizado em:',
  },
  notFound: {
    title: 'Página não encontrada',
    message:
      'Este endereço não existe no site — o guardião só afirma o que cita evidência.',
    hint: 'Use a busca ou volte pelos caminhos abaixo.',
  },
  footer: {
    links: {
      docs: '/docs/pt-br',
      github: 'https://github.com/Golmet',
      npm: 'https://www.npmjs.com/package/golmet-cli',
    },
    license: 'Licença MIT',
    copyright: '© 2026 GOLMET',
  },
};

// ── en — derivado da fonte PT-BR (RN-011-5, revisão seguinte) ───

const en: CopyTree = {
  landing: {
    hero: {
      kicker: 'REQUIREMENTS · EVIDENCE · VERSIONING',
      title: 'GOLMET',
      tagline: "Versioned requirements. Docs that don't rot.",
      plainLine:
        'GOLMET is a CLI that turns requirements into versioned markdown in your own git — ' +
        'and warns when code and docs drift.',
      valueHighlight: 'Your agreement.',
      valueProposal: 'Your repository. A source of truth that follows the code.',
      statusNote: `Site under construction — kit v${CLI_VERSION} is already stable on npm.`,
    },
    terminal: {
      title: 'Real output — install · version · init · status · validate',
    },
    problem: {
      heading: 'Every software team has lived this',
      note: "If any of these scenes feel familiar, the problem isn't the team — it's the absence of a source of truth.",
      cards: [
        {
          title: 'The conversation stayed in the past',
          text: 'The client asked in a meeting. Nobody wrote it down properly. Three weeks later, everyone remembers it differently.',
        },
        {
          title: 'The code became a mystery',
          text: 'The feature is live — but the detail (min value, what blocks it, why) lives in the head of whoever wrote it.',
        },
        {
          title: 'Ghost scope',
          text: `"That's not what I asked for" — and there's no way to prove what was agreed.`,
        },
        {
          title: 'The docs rotted',
          text: 'The requirement changed, nobody updated the document. Old docs are docs nobody trusts.',
        },
      ],
    },
    thesis: {
      heading: 'A documentary state machine',
      note: "The versioned requirement is the product's normative state. Three layers, split by nature:",
      layers: [
        {
          name: 'FORMAT',
          role: 'The contract',
          text: 'Workspace layout, schemas and state transitions — versioned and stable.',
        },
        {
          name: 'KIT',
          role: 'The deterministic engine',
          text: 'Validates, indexes, checks evidence. No LLM, no surprises.',
        },
        {
          name: 'RUNTIME',
          role: 'The agentic layer',
          text: 'Judgment through capabilities — on any engine from the open standards.',
        },
      ],
    },
    howItWorks: {
      heading: 'How it works',
      note: 'From the initial agreement to continuous verification on every commit.',
      steps: [
        { name: 'Charter', text: "What we're building — confirmed with the client." },
        { name: 'Rules', text: 'Numbered RNs, clear and approved before the code.' },
        { name: 'Specs', text: 'Data model, contracts and screens derived from the rules.' },
        { name: 'Code', text: 'Tasks with acceptance criteria and cited evidence.' },
        { name: 'Living truth', text: 'The requirement changed? The kit points to exactly what became stale.' },
      ],
    },
    engines: {
      heading: 'Works with your agent',
      note: "Through the ecosystem's open standards — AGENTS.md, SKILL.md and MCP. No engine lock-in.",
      engines: ['OpenCode', 'Claude Code', 'Cursor', 'Codex', 'Gemini CLI', 'Copilot CLI', 'VS Code Copilot'],
    },
    differentiation: {
      heading: "Why it isn't just another spec-tool",
      items: [
        {
          title: 'Markdown in your git',
          text: 'Requirements are plain files any engine can read. No proprietary format, no lock-in.',
        },
        {
          title: 'Parseable evidence',
          text: 'Every rule cites `[path:line @hash]` — the docs ↔ code connection is machine-verifiable.',
        },
        {
          title: 'The kit is the arbiter',
          text: "A deterministic binary validates states and evidence. Truth doesn't depend on the prompt alone.",
        },
      ],
    },
    quickstart: {
      heading: 'Start from the agreement',
      badge: `v${CLI_VERSION}`,
      note: `Release v${CLI_VERSION} stable on npm — the commands above already work.`,
      steps: [
        {
          title: 'Install the binary',
          command: 'npm i -g golmet-cli',
          text: 'Native, zero runtime dependency.',
        },
        {
          title: 'Set up the kit',
          command: 'golmet install',
          text: 'The wizard configures engine, gm-* skills and kit MCPs.',
        },
        {
          title: 'Initialize the workspace',
          command: 'golmet init YourProductName',
          text: 'The wizard creates the workspace: golmet.yaml, charter and FORMAT zones.',
        },
        {
          title: 'The truth gets versioned',
          text: 'Markdown in your git — survives engines, kits and releases.',
        },
      ],
    },
    paths: {
      heading: 'Choose your path',
      items: [
        {
          title: 'New product',
          text: 'Charter, requirements and specs from scratch — kit and agent in the same folder.',
          docPath: '/docs',
        },
        {
          title: 'Legacy repo',
          text: 'The guardian reads the code and proposes rules; you confirm what is true.',
          docPath: '/docs',
        },
        {
          title: 'Multi-dev org',
          text: 'Dev #2 onboarding: clone, doctor, pack sync — checklist, no manual.',
          docPath: '/docs',
        },
      ],
    },
    capabilities: {
      heading: 'What the kit does',
      docLink: 'all 18 commands in the docs →',
      note: "Only what's released in the current version — the guardian doesn't promise what doesn't exist.",
      featured: [
        { command: 'golmet init', description: 'Creates the product workspace (interactive wizard)' },
        { command: 'golmet validate', description: 'Validates the workspace against FORMAT v1' },
        { command: 'golmet status', description: 'Dashboard of entity states' },
        { command: 'golmet next', description: 'Recommends the next action on the workspace' },
      ],
    },
    ctas: {
      github: 'View on GitHub',
      npm: 'golmet-cli on npm',
    },
    finalCta: {
      heading: 'Start today',
      text: 'One command. One workspace. Versioned truth in your git.',
      command: 'npm i -g golmet-cli',
      preLaunch: `v${CLI_VERSION} stable — functional install via npm.`,
    },
  },
  portal: {
    sidebarTitle: 'Documentation',
    searchPlaceholder: 'Search the docs…',
    notTranslated: 'Page not translated — showing the English version.',
    indexNote: 'Rendered straight from the golmet-cli repository — docs, releases and changelog.',
    onThisPage: 'On this page',
    prevLabel: '← Previous',
    nextLabel: 'Next →',
    editPage: '✏️ Edit this page on GitHub',
    updatedAt: 'Updated:',
  },
  notFound: {
    title: 'Page not found',
    message: "This address doesn't exist on the site — the guardian only states what cites evidence.",
    hint: 'Use the search or go back through the paths below.',
  },
  footer: {
    links: {
      docs: '/docs',
      github: 'https://github.com/Golmet',
      npm: 'https://www.npmjs.com/package/golmet-cli',
    },
    license: 'MIT License',
    copyright: '© 2026 GOLMET',
  },
};

export const COPY: Record<Locale, CopyTree> = { 'pt-BR': ptBR, en };
