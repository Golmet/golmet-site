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

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface CopyTree {
  readonly landing: {
    readonly hero: {
      readonly titleLead: string;
      readonly sub: string;
      readonly quickstart: {
        readonly heading: string;
        readonly badge: string;
        readonly steps: readonly {
          readonly title: string;
          readonly command?: string;
          readonly text: string;
        }[];
      };
      readonly stats: readonly { readonly value: string; readonly label: string }[];
    };
    readonly demo: {
      readonly heading: string;
      readonly done: string;
    };
    readonly scenes: {
      readonly heading: string;
      readonly note: string;
      readonly docLink: string;
      readonly docPath: string;
      readonly items: readonly {
        readonly pain: string;
        readonly outcome: string;
        readonly command: string;
        readonly chips: readonly string[];
      }[];
    };
    readonly engines: {
      readonly label: string;
      readonly engines: readonly string[];
    };
    readonly differentiation: {
      readonly heading: string;
      readonly items: readonly { readonly title: string; readonly text: string }[];
      readonly underTheHood: string;
    };
    readonly journey: {
      readonly heading: string;
      readonly note: string;
      readonly tracks: readonly {
        readonly title: string;
        readonly tagline: string;
        readonly steps: readonly string[];
        readonly docPath: string;
        readonly docLabel: string;
      }[];
    };
    readonly faq: {
      readonly heading: string;
      readonly items: readonly FaqItem[];
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
      titleLead: 'Chega de documentação velha.',
      sub:
        'Uma regra de negócio sem evidência é opinião. No Golmet, cada regra aponta o arquivo, a ' +
        'linha e o hash do código que a implementa. Se o código muda e a regra fica para trás, o ' +
        'validate acusa antes do merge. Documentação deixa de ser memória e vira fato verificável.',
      quickstart: {
        heading: 'Como começar',
        badge: `v${CLI_VERSION}`,
        steps: [
          {
            title: 'Instale o Golmet',
            command: 'npm i -g golmet-cli',
            text: 'Baixa e instala o programa no seu computador, direto do npm.',
          },
          {
            title: 'Crie o espaço do projeto',
            command: 'golmet init nome-produto',
            text: 'Cria a pasta do seu produto com os arquivos de requisitos e decisões já estruturados. O conteúdo você preenche depois.',
          },
          {
            title: 'Veja o resumo',
            command: 'golmet status',
            text: 'Mostra o que já existe no projeto e o estado de cada parte.',
          },
          {
            title: 'Confira se está tudo certo',
            command: 'golmet validate',
            text: 'Compara o que está escrito na documentação com o que o código faz e avisa se algo ficou para trás.',
          },
        ],
      },
      stats: [
        { value: '18', label: 'comandos lançados' },
        { value: '7', label: 'engines suportados' },
        { value: '0', label: 'dependências de runtime' },
        { value: 'MIT', label: 'custo zero' },
      ],
    },
    demo: {
      heading: 'O que você vai ver no terminal',
      done: 'Entre o status e o validate, alguém criou a primeira feature com o anchor errado. O kit pegou na hora. Na sua máquina, os comandos respondem igual.',
    },
    scenes: {
      heading: 'A cena que você conhece e o comando que resolve',
      note: 'Cada cena termina com um comando real do kit. Sem promessa que não roda.',
      docLink: 'todos os 18 comandos na documentação →',
      docPath: '/docs/pt-br/reference/commands',
      items: [
        {
          pain: 'A conversa ficou no passado',
          outcome: 'O combinado confirmado com o cliente fica versionado, com charter, RNs e specs num workspace.',
          command: 'golmet init NomeDoProduto',
          chips: ['charter', 'RNs', 'workspace'],
        },
        {
          pain: 'A doc apodreceu',
          outcome: 'Mudou o código e a doc ficou para trás? O dashboard de estados aponta o que ficou stale.',
          command: 'golmet status',
          chips: ['drift', 'estados', 'evidência'],
        },
        {
          pain: 'Escopo que ninguém consegue provar',
          outcome: 'Cada regra cita o trecho que a implementa, verificável por máquina no formato `[caminho:linha @hash]`.',
          command: 'golmet validate',
          chips: ['H1–H10', 'fix sugerido'],
        },
        {
          pain: 'E agora, o que falta?',
          outcome: 'Nada de adivinhar. O kit recomenda a próxima ação sobre o workspace.',
          command: 'golmet next',
          chips: ['recomendação', 'estado real'],
        },
      ],
    },
    engines: {
      label: 'Funciona com o seu agente',
      engines: ['OpenCode', 'Claude Code', 'Cursor', 'Codex', 'Gemini CLI', 'Copilot CLI', 'VS Code Copilot'],
    },
    differentiation: {
      heading: 'Por que a doc não apodrece',
      items: [
        {
          title: 'Markdown no seu git',
          text: 'Requisitos são arquivos simples que qualquer engine lê. Sem formato proprietário, sem lock-in.',
        },
        {
          title: 'Evidência parseável',
          text: 'Cada regra cita `[caminho:linha @hash]` e a conexão docs ↔ código é verificável por máquina.',
        },
        {
          title: 'O kit é o árbitro',
          text: 'Um binário determinístico valida estados e evidência. A verdade não depende só do prompt.',
        },
      ],
      underTheHood:
        'Sob o capô vivem o FORMATO (o contrato), o KIT (o motor determinístico) e o RUNTIME (a camada agêntica). Detalhes na documentação.',
    },
    journey: {
      heading: 'Sua jornada com o GOLMET',
      note: 'Três trilhas. Todas começam com o mesmo comando.',
      tracks: [
        {
          title: 'Testar hoje',
          tagline: 'De zero a workspace rodando em 5 minutos.',
          steps: ['npm i -g golmet-cli', 'golmet init nome-produto', 'golmet status'],
          docPath: '/docs/pt-br/getting-started-5-minutes',
          docLabel: 'Guia de 5 minutos →',
        },
        {
          title: 'Adotar no produto',
          tagline: 'Repo existente? O guardião lê o código e propõe as regras, e você confirma o que é verdade.',
          steps: ['golmet doctor', 'golmet adopt .', 'golmet validate'],
          docPath: '/docs/pt-br/concepts/reverse',
          docLabel: 'Do legado ao FORMATO →',
        },
        {
          title: 'Escala para o time',
          tagline: 'Onboarding do dev #2 sem manual, com clone, doctor e pack.',
          steps: ['golmet pack', 'golmet doctor', 'clone + sync'],
          docPath: '/docs/pt-br/concepts/organization',
          docLabel: 'Checklist do time →',
        },
      ],
    },
    faq: {
      heading: 'Perguntas diretas',
      items: [
        {
          question: 'Precisa de LLM ou API paga?',
          answer:
            'Não. O kit é um binário determinístico que valida, indexa e confere evidência sem LLM. ' +
            'O julgamento agêntico usa o engine que você já tem.',
        },
        {
          question: 'E se eu trocar de engine?',
          answer:
            'A verdade vive em markdown no seu git, não no engine. OpenCode, Claude Code, Cursor ' +
            'e os outros apenas leem os mesmos arquivos.',
        },
        {
          question: 'Quanto custa?',
          answer: 'Nada. Licença MIT no GitHub, binário nativo no npm. Sem plano e sem cadastro.',
        },
      ],
    },
    ctas: {
      github: 'Ver no GitHub',
      npm: 'golmet-cli no npm',
    },
    finalCta: {
      heading: 'Cansado de doc que ninguém confia?',
      text: 'Um comando. Um workspace. A verdade versionada no seu git.',
      command: 'npm i -g golmet-cli',
      preLaunch: `Release v${CLI_VERSION} estável, com instalação funcional pelo npm.`,
    },
  },
  portal: {
    sidebarTitle: 'Documentação',
    searchPlaceholder: 'Buscar na documentação…',
    notTranslated: 'Página não traduzida, exibindo a versão em inglês.',
    indexNote: 'Renderizada direto do repositório golmet-cli. Docs, releases e changelog.',
    onThisPage: 'Nesta página',
    prevLabel: '← Anterior',
    nextLabel: 'Próximo →',
    editPage: '✏️ Edite esta página no GitHub',
    updatedAt: 'Atualizado em:',
  },
  notFound: {
    title: 'Página não encontrada',
    message:
      'Este endereço não existe no site. O guardião só afirma o que cita evidência.',
    hint: 'Use a busca ou volte pelos caminhos abaixo.',
  },
  footer: {
    links: {
      docs: '/docs/pt-br',
      github: 'https://github.com/Golmet/golmet-cli',
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
      titleLead: 'No more stale documentation.',
      sub:
        'A business rule without evidence is an opinion. In GOLMET, every rule points to the file, ' +
        'the line and the hash of the code that implements it. If the code moves and the rule falls ' +
        'behind, validate flags it before merge. Documentation stops being memory and becomes ' +
        'verifiable fact.',
      quickstart: {
        heading: 'How to start',
        badge: `v${CLI_VERSION}`,
        steps: [
          {
            title: 'Install GOLMET',
            command: 'npm i -g golmet-cli',
            text: 'Downloads and installs the program on your computer, straight from npm.',
          },
          {
            title: 'Create your project space',
            command: 'golmet init nome-produto',
            text: 'Creates your product folder with the requirements and decisions files already structured. You fill in the content afterwards.',
          },
          {
            title: 'See the summary',
            command: 'golmet status',
            text: 'Shows what already exists in the project and the state of each part.',
          },
          {
            title: 'Check that everything matches',
            command: 'golmet validate',
            text: 'Compares what the documentation says with what the code does and warns you if anything fell behind.',
          },
        ],
      },
      stats: [
        { value: '18', label: 'commands shipped' },
        { value: '7', label: 'engines supported' },
        { value: '0', label: 'runtime dependencies' },
        { value: 'MIT', label: 'zero cost' },
      ],
    },
    demo: {
      heading: "What you'll see in your terminal",
      done: 'Between status and validate, someone created the first feature with the wrong anchor. The kit caught it instantly. On your machine, the commands behave the same.',
    },
    scenes: {
      heading: 'The scene you know and the command that fixes it',
      note: 'Every scene ends with a real kit command. No promises that don\'t run.',
      docLink: 'all 18 commands in the docs →',
      docPath: '/docs/reference/commands',
      items: [
        {
          pain: 'The conversation stayed in the past',
          outcome: 'The confirmed agreement stays versioned, with charter, RNs and specs in one workspace.',
          command: 'golmet init YourProductName',
          chips: ['charter', 'RNs', 'workspace'],
        },
        {
          pain: 'The docs rotted',
          outcome: 'Code moved and docs fell behind? The state dashboard points to what went stale.',
          command: 'golmet status',
          chips: ['drift', 'states', 'evidence'],
        },
        {
          pain: 'Scope nobody can prove',
          outcome: 'Every rule cites the snippet that implements it, machine-verifiable in `[path:line @hash]` format.',
          command: 'golmet validate',
          chips: ['H1–H10', 'suggested fix'],
        },
        {
          pain: 'So what\'s missing now?',
          outcome: 'No guessing. The kit recommends the next action on the workspace.',
          command: 'golmet next',
          chips: ['recommendation', 'real state'],
        },
      ],
    },
    engines: {
      label: 'Works with your agent',
      engines: ['OpenCode', 'Claude Code', 'Cursor', 'Codex', 'Gemini CLI', 'Copilot CLI', 'VS Code Copilot'],
    },
    differentiation: {
      heading: "Why the docs don't rot",
      items: [
        {
          title: 'Markdown in your git',
          text: 'Requirements are plain files any engine can read. No proprietary format, no lock-in.',
        },
        {
          title: 'Parseable evidence',
          text: 'Every rule cites `[path:line @hash]`, so the docs ↔ code connection is machine-verifiable.',
        },
        {
          title: 'The kit is the arbiter',
          text: "A deterministic binary validates states and evidence. Truth doesn't depend on the prompt alone.",
        },
      ],
      underTheHood:
        'Under the hood live the FORMAT (the contract), the KIT (the deterministic engine) and the RUNTIME (the agentic layer). Details in the docs.',
    },
    journey: {
      heading: 'Your GOLMET journey',
      note: 'Three tracks. All of them start with the same command.',
      tracks: [
        {
          title: 'Try it today',
          tagline: 'From zero to a running workspace in 5 minutes.',
          steps: ['npm i -g golmet-cli', 'golmet init nome-produto', 'golmet status'],
          docPath: '/docs/getting-started-5-minutes',
          docLabel: '5-minute guide →',
        },
        {
          title: 'Adopt it on your product',
          tagline: 'Existing repo? The guardian reads the code and proposes the rules, and you confirm what is true.',
          steps: ['golmet doctor', 'golmet adopt .', 'golmet validate'],
          docPath: '/docs/concepts/reverse',
          docLabel: 'From legacy to FORMAT →',
        },
        {
          title: 'Scale to the team',
          tagline: 'Dev #2 onboarding without a manual, with clone, doctor and pack.',
          steps: ['golmet pack', 'golmet doctor', 'clone + sync'],
          docPath: '/docs/concepts/organization',
          docLabel: 'Team checklist →',
        },
      ],
    },
    faq: {
      heading: 'Straight answers',
      items: [
        {
          question: 'Does it need an LLM or a paid API?',
          answer:
            'No. The kit is a deterministic binary that validates, indexes and checks evidence without an LLM. ' +
            'The agentic judgment uses the engine you already have.',
        },
        {
          question: 'What if I switch engines?',
          answer:
            'The truth lives in markdown in your git, not in the engine. OpenCode, Claude Code, Cursor ' +
            'and the rest just read the same files.',
        },
        {
          question: 'How much does it cost?',
          answer: 'Nothing. MIT license on GitHub, native binary on npm. No plan and no signup.',
        },
      ],
    },
    ctas: {
      github: 'View on GitHub',
      npm: 'golmet-cli on npm',
    },
    finalCta: {
      heading: 'Tired of docs nobody trusts?',
      text: 'One command. One workspace. Versioned truth in your git.',
      command: 'npm i -g golmet-cli',
      preLaunch: `Release v${CLI_VERSION} stable, with a functional install via npm.`,
    },
  },
  portal: {
    sidebarTitle: 'Documentation',
    searchPlaceholder: 'Search the docs…',
    notTranslated: 'Page not translated, showing the English version.',
    indexNote: 'Rendered straight from the golmet-cli repository. Docs, releases and changelog.',
    onThisPage: 'On this page',
    prevLabel: '← Previous',
    nextLabel: 'Next →',
    editPage: '✏️ Edit this page on GitHub',
    updatedAt: 'Updated:',
  },
  notFound: {
    title: 'Page not found',
    message: "This address doesn't exist on the site. The guardian only states what cites evidence.",
    hint: 'Use the search or go back through the paths below.',
  },
  footer: {
    links: {
      docs: '/docs',
      github: 'https://github.com/Golmet/golmet-cli',
      npm: 'https://www.npmjs.com/package/golmet-cli',
    },
    license: 'MIT License',
    copyright: '© 2026 GOLMET',
  },
};

export const COPY: Record<Locale, CopyTree> = { 'pt-BR': ptBR, en };
