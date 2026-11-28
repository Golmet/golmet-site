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
      readonly titleFollow: string;
      readonly sub: string;
      readonly install: { readonly command: string };
      readonly stats: readonly { readonly value: string; readonly label: string }[];
    };
    readonly demo: {
      readonly heading: string;
      readonly done: string;
    };
    readonly tech: {
      readonly heading: string;
      readonly arrows: readonly { readonly text: string; readonly code: string }[];
      readonly layers: readonly {
        readonly name: string;
        readonly role: string;
        readonly text: string;
      }[];
      readonly evidence: {
        readonly tag: string;
        readonly line: string;
        readonly drift: string;
        readonly verdict: string;
        readonly caption: string;
        readonly captionCode: string;
        readonly captionTail: string;
      };
    };
    readonly benefits: {
      readonly heading: string;
      readonly items: readonly { readonly title: string; readonly text: string }[];
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
      readonly badge: string;
      readonly tracks: readonly {
        readonly title: string;
        readonly tagline: string;
        readonly steps: readonly { readonly command: string; readonly desc: string }[];
        readonly docPath: string;
        readonly docLabel: string;
      }[];
    };
    readonly faq: {
      readonly heading: string;
      readonly items: readonly FaqItem[];
    };
    readonly ctas: { readonly github: string; readonly copy: string; readonly copied: string };
    readonly finalCta: {
      readonly heading: string;
      readonly text: string;
      readonly command: string;
      readonly release: string;
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
      titleLead: 'Toda IA escreve código.',
      titleFollow: 'Nenhuma responde por ele.',
      sub:
        'O Golmet é um workflow agêntico de desenvolvimento de software: requisitos versionados que o ' +
        'agente é obrigado a seguir, evidência de arquivo e hash em cada regra, e validate bloqueando ' +
        'divergência antes da produção.',
      install: { command: 'npm i -g golmet-cli' },
      stats: [
        { value: '18', label: 'comandos lançados' },
        { value: '7', label: 'engines suportados' },
        { value: '0', label: 'dependências de runtime' },
        { value: 'MIT', label: 'custo zero' },
      ],
    },
    demo: {
      heading: 'O que você vai ver no terminal',
      done: 'Entre o status e o validate, alguém criou a primeira feature com a referência ao código errada. O Golmet pegou na hora. Na sua máquina, os comandos respondem igual.',
    },
    tech: {
      heading: 'Como o Golmet faz tudo isso?',
      arrows: [
        { text: 'define as regras', code: 'golmet validate' },
        { text: 'o agente executa sob elas', code: '' },
      ],
      layers: [
        {
          name: 'FORMATO v1',
          role: 'o contrato',
          text:
            'A especificação do projeto: arquivos markdown com estados, transições e responsável por cada regra. Mora no seu git.',
        },
        {
          name: 'KIT',
          role: 'o árbitro',
          text:
            'Um binário determinístico que valida o FORMATO e confere cada regra contra o código. Os portões H1 a H10 bloqueiam o avanço se algo divergir.',
        },
        {
          name: 'RUNTIME',
          role: 'o agente',
          text:
            'O seu agente de IA (Claude Code, Cursor, OpenCode...) escreve e programa sob esse contrato, guiado pelas habilidades gm-*.',
        },
      ],
      evidence: {
        tag: 'evidência · KIT',
        line: '[src/pedido.ts:42 @a3f9c1]',
        drift: '-> código mudou → @7e21b0',
        verdict: 'x diverge',
        caption: 'Cada regra cita arquivo, linha e hash do código. Se o hash divergir, o',
        captionCode: 'golmet validate',
        captionTail: 'avisa antes de entrar no projeto.',
      },
    },
    benefits: {
      heading: 'Veja tudo que o Golmet oferece',
      items: [
        {
          title: 'Requisitos organizados e versionados',
          text: 'Cada requisito do produto fica documentado no projeto, com responsável, situação atual e o histórico completo de mudanças. Nada entra no desenvolvimento sem aprovação.',
        },
        {
          title: 'Da ideia à especificação técnica em minutos',
          text: 'Descreva o que precisa ser feito em linguagem simples. A IA transforma em análise funcional, análise técnica, modelo de dados e tarefas detalhadas. O time revisa e aprova tudo antes de programar.',
        },
        {
          title: 'A IA programa dentro das regras do projeto',
          text: 'Antes de escrever qualquer código, o agente lê as regras versionadas do negócio. O resultado é o que foi combinado, não o que ele achou.',
        },
        {
          title: 'Todo código é conferido antes de entrar no projeto',
          text: 'Quando o código fica pronto, o Golmet compara com a especificação aprovada e mostra qualquer divergência. Erro de interpretação não chega ao time.',
        },
        {
          title: 'Documentos para a IA e documentos para pessoas',
          text: 'O Golmet separa os dois mundos. Os documentos de trabalho ficam no formato que a máquina entende, e os documentos de leitura são escritos para pessoas, com uma camada de linguística que estuda como humanos leem e compreendem. O resultado é leitura fluida, fácil, clara e sem excesso.',
        },
        {
          title: 'O conhecimento não fica preso em quem escreveu',
          text: 'Cada regra e cada decisão do produto fica documentada junto ao código. Quem chega depois entende o que foi feito e por quê, sem precisar procurar a pessoa que fez.',
        },
        {
          title: 'Desenvolvedor novo produzindo em minutos',
          text: 'Quem chega clona o projeto e roda o doctor, o comando que confere se o Golmet está instalado e configurado corretamente, aponta o que falta e mostra como resolver.',
        },
        {
          title: 'O próximo passo sempre claro',
          text: 'Sem saber por onde começar? O Golmet analisa o projeto inteiro e mostra o que precisa ser feito primeiro, por ordem de prioridade.',
        },
        {
          title: 'Banco de dados sem surpresas',
          text: 'Mudou o banco? Essa mudança fica registrada em arquivos chamados migrations. O Golmet compara com o modelo documentado e aponta diferenças antes de virar incidente em produção.',
        },
        {
          title: 'Sistema legado deixa de ser uma caixa preta',
          text: 'O Golmet lê o código que já existe e mostra as regras de negócio escondidas nele, cada uma com o arquivo e a linha. Você confirma o que é verdade, e o time segue com uma base que todo mundo entende.',
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
          title: 'O Golmet é o árbitro',
          text: 'Um binário determinístico valida estados e evidência. A verdade não depende só do prompt.',
        },
      ],
      underTheHood:
        'Sob o capô vivem o FORMATO, o contrato que define o projeto, o programa determinístico que confere tudo e a camada de inteligência artificial que executa o processo. Detalhes na documentação.',
    },
    journey: {
      heading: 'Sua jornada com o GOLMET',
      note: 'Três trilhas. Todas começam com o mesmo comando.',
      badge: `v${CLI_VERSION}`,
      tracks: [
        {
          title: 'Testar hoje',
          tagline: 'De zero a workspace rodando em 5 minutos.',
          steps: [
            {
              command: 'npm i -g golmet-cli',
              desc: 'Baixa e instala o programa no seu computador, direto do npm.',
            },
            {
              command: 'golmet init nome-produto',
              desc: 'Cria a pasta do seu produto com requisitos e decisões já estruturados.',
            },
            {
              command: 'golmet status',
              desc: 'Mostra o que já existe no projeto e o estado de cada parte.',
            },
            {
              command: 'golmet validate',
              desc: 'Compara a documentação com o código e avisa se algo ficou para trás.',
            },
          ],
          docPath: '/docs/pt-br/getting-started-5-minutes',
          docLabel: 'Guia de 5 minutos →',
        },
        {
          title: 'Adotar no produto',
          tagline: 'Repo existente? O guardião lê o código e propõe as regras, e você confirma o que é verdade.',
          steps: [
            { command: 'golmet doctor', desc: '' },
            { command: 'golmet adopt .', desc: '' },
            { command: 'golmet validate', desc: '' },
          ],
          docPath: '/docs/pt-br/concepts/reverse',
          docLabel: 'Do legado ao FORMATO →',
        },
        {
          title: 'Escala para o time',
          tagline: 'Onboarding do dev #2 sem manual, com clone, doctor e pack.',
          steps: [
            { command: 'golmet pack', desc: '' },
            { command: 'golmet doctor', desc: '' },
            { command: 'clone + sync', desc: '' },
          ],
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
            'Não. O Golmet é um programa determinístico que valida o projeto e confere a documentação contra o código. O julgamento é da máquina, não de um modelo de linguagem. ' +
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
      copy: 'Copiar',
      copied: 'Copiado',
    },
    finalCta: {
      heading: 'Cansado de doc em que ninguém confia?',
      text: 'Um comando. Um workspace. A verdade versionada no seu git.',
      command: 'npm i -g golmet-cli',
      release: `v${CLI_VERSION} · Licença MIT · sem cadastro`,
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
      titleLead: 'Every AI writes code.',
      titleFollow: 'None of them answers for it.',
      sub:
        'GOLMET is an end-to-end agentic development workflow: requirements the agent must follow, file and ' +
        'hash evidence on every rule, and validate blocking divergence before production.',
      install: { command: 'npm i -g golmet-cli' },
      stats: [
        { value: '18', label: 'commands shipped' },
        { value: '7', label: 'engines supported' },
        { value: '0', label: 'runtime dependencies' },
        { value: 'MIT', label: 'zero cost' },
      ],
    },
    demo: {
      heading: "What you'll see in your terminal",
      done: 'Between status and validate, someone created the first feature with the wrong code reference. GOLMET caught it instantly. On your machine, the commands behave the same.',
    },
    tech: {
      heading: 'How does GOLMET do all of this?',
      arrows: [
        { text: 'defines the rules', code: 'golmet validate' },
        { text: 'the agent runs under them', code: '' },
      ],
      layers: [
        {
          name: 'FORMAT v1',
          role: 'the contract',
          text:
            "The project's specification: markdown files with states, transitions and an owner for every rule. Lives in your git.",
        },
        {
          name: 'KIT',
          role: 'the referee',
          text:
            'A deterministic binary that validates the FORMAT and checks every rule against the code. Gates H1 through H10 block progress when anything diverges.',
        },
        {
          name: 'RUNTIME',
          role: 'the agent',
          text:
            'Your AI agent (Claude Code, Cursor, OpenCode...) writes code under this contract, guided by the gm-* skills.',
        },
      ],
      evidence: {
        tag: 'evidence · KIT',
        line: '[src/pedido.ts:42 @a3f9c1]',
        drift: '-> code changed → @7e21b0',
        verdict: 'x diverges',
        caption: 'Every rule cites the file, line and hash of its code. If the hash diverges,',
        captionCode: 'golmet validate',
        captionTail: 'warns you before it enters the project.',
      },
    },
    benefits: {
      heading: 'See everything GOLMET offers',
      items: [
        {
          title: 'Requirements organized and versioned',
          text: 'Every product requirement is documented in the project, with an owner, its current state and the full change history. Nothing enters development without approval.',
        },
        {
          title: 'Functional analysis, technical analysis and tasks generated by the AI',
          text: 'The AI turns every approved requirement into functional analysis, technical analysis, data model, API contracts and tasks with clear acceptance criteria. The team reviews and approves.',
        },
        {
          title: 'The AI programs within the project rules',
          text: 'Before writing any code, the agent reads the versioned business rules. The result is what was agreed, not what it guessed.',
        },
        {
          title: 'Nothing enters the project unchecked',
          text: 'When the code is done, GOLMET checks that every requirement was fulfilled. Whatever diverges is flagged before entering the project.',
        },
        {
          title: 'Documents for the AI and documents for people',
          text: 'GOLMET keeps the two worlds apart. Working documents stay in the format the machine understands, and reading documents are written for people, with a linguistics layer that studies how humans read and comprehend. The result is fluid, easy, clear reading with no information overload.',
        },
        {
          title: 'Knowledge is not trapped in whoever wrote it',
          text: 'Every rule and every decision of the product is documented next to the code. Whoever comes later understands what was done and why, without having to find the person who did it.',
        },
        {
          title: 'New developer productive in minutes',
          text: 'Whoever arrives clones the project and runs doctor. The command checks whether GOLMET is installed and configured correctly, points out what is missing and shows how to fix it.',
        },
        {
          title: 'The next action always by priority',
          text: 'When nobody knows where to start, the command analyzes every project document and shows, in priority order, what needs to be done first.',
        },
        {
          title: 'Database aligned with the project',
          text: 'When someone changes the database, that change is recorded in files called migrations. GOLMET compares those migrations with the data model documented in the project and points out any difference before it becomes a production incident.',
        },
        {
          title: 'Legacy systems stop being a black box',
          text: 'GOLMET reads the existing code and surfaces the business rules hidden in it, each one with its file and line. You confirm what is true, and the team moves forward on a base everyone understands.',
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
          title: 'GOLMET is the arbiter',
          text: "A deterministic binary validates states and evidence. Truth doesn't depend on the prompt alone.",
        },
      ],
      underTheHood:
        'Under the hood live the FORMAT, the contract that defines the project, the deterministic program that checks everything and the artificial intelligence layer that runs the process. Details in the docs.',
    },
    journey: {
      heading: 'Your GOLMET journey',
      note: 'Three tracks. All of them start with the same command.',
      badge: `v${CLI_VERSION}`,
      tracks: [
        {
          title: 'Try it today',
          tagline: 'From zero to a running workspace in 5 minutes.',
          steps: [
            {
              command: 'npm i -g golmet-cli',
              desc: 'Downloads and installs the program on your computer, straight from npm.',
            },
            {
              command: 'golmet init nome-produto',
              desc: 'Creates your product folder with requirements and decisions already structured.',
            },
            {
              command: 'golmet status',
              desc: 'Shows what already exists in the project and the state of each part.',
            },
            {
              command: 'golmet validate',
              desc: 'Compares the documentation with the code and warns you if anything fell behind.',
            },
          ],
          docPath: '/docs/getting-started-5-minutes',
          docLabel: '5-minute guide →',
        },
        {
          title: 'Adopt it on your product',
          tagline: 'Existing repo? The guardian reads the code and proposes the rules, and you confirm what is true.',
          steps: [
            { command: 'golmet doctor', desc: '' },
            { command: 'golmet adopt .', desc: '' },
            { command: 'golmet validate', desc: '' },
          ],
          docPath: '/docs/concepts/reverse',
          docLabel: 'From legacy to FORMAT →',
        },
        {
          title: 'Scale to the team',
          tagline: 'Dev #2 onboarding without a manual, with clone, doctor and pack.',
          steps: [
            { command: 'golmet pack', desc: '' },
            { command: 'golmet doctor', desc: '' },
            { command: 'clone + sync', desc: '' },
          ],
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
            'No. GOLMET is a deterministic program that validates the project and checks documentation against the code. The judgment is made by the machine, not by a language model. ' +
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
      copy: 'Copy',
      copied: 'Copied',
    },
    finalCta: {
      heading: 'Tired of docs nobody trusts?',
      text: 'One command. One workspace. Versioned truth in your git.',
      command: 'npm i -g golmet-cli',
      release: `v${CLI_VERSION} · MIT license · no sign-up`,
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
