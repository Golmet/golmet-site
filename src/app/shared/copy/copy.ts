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
    readonly tech: {
      readonly heading: string;
      readonly text: readonly string[];
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
      titleFollow: 'Tudo o que o seu projeto precisa, em um só lugar.',
      sub:
        'O Golmet reúne o desenvolvimento inteiro do seu produto em um único lugar. A inteligência ' +
        'artificial levanta os requisitos do projeto, escreve análises que as pessoas ' +
        'entendem, cria as tarefas e programa sob as regras do projeto. A cada mudança, confere ' +
        'cada regra contra o código antes de ir para produção. Outras ferramentas ajudam a ' +
        'escrever código. O Golmet garante o que foi escrito.',
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
      done: 'Entre o status e o validate, alguém criou a primeira feature com o anchor errado. O Golmet pegou na hora. Na sua máquina, os comandos respondem igual.',
    },
    tech: {
      heading: 'Como o Golmet faz tudo isso?',
      text: [
        'O Golmet é um programa nativo que roda na sua máquina, junto com o seu código. Dentro dela convivem três camadas. O FORMATO v1 é a especificação criada pelo Golmet que define como o projeto deve ser organizado, em arquivos de markdown, com estados e transições para cada documento e os portões de qualidade que tudo precisa passar. O KIT é o motor determinístico que valida essa especificação. E o RUNTIME é onde a inteligência artificial executa o processo.',
        'A escrita segue princípios de linguística aplicada e neurociência da leitura. Cada documento controla a carga cognitiva, progride do simples ao complexo e mantém os termos consistentes. Por isso, tudo é claro na primeira leitura, para qualquer pessoa do time.',
        'Cada regra de negócio carrega a evidência do código que a implementa, com arquivo, linha e hash criptográfico. A cada validação, o Golmet compara essa impressão digital com o código atual. Se divergir, o problema aparece antes de entrar no projeto, nunca depois.',
        'As habilidades gm-* foram construídas estudando o fluxo de empresas de referência e as melhores práticas do mercado, e refinadas versão após versão. Elas guiam o seu agente de IA, passo a passo, do levantamento de requisitos à revisão do código, por padrões abertos como AGENTS.md e MCP.',
        'E os portões de qualidade H1 a H10 são as regras dessa conferência. O conceito vem da prática de DevOps, onde um portão de qualidade é uma verificação automática que precisa passar antes do código avançar. O Golmet aplicou a mesma ideia à documentação. Cada portão examina um tipo de inconsistência entre documentação e código, como uma regra sem responsável ou uma referência quebrada. A falha bloqueia o avanço. O que antes era descoberto em produção, agora aparece na tela do analista. E o projeto cresce sem perder o controle, com tudo rodando offline na sua máquina.',
      ],
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
      titleFollow: 'Everything your project needs, in one place.',
      sub:
        'GOLMET brings your product\'s entire development into a single flow. The artificial ' +
        'intelligence gathers requirements directly with the client, writes analysis people ' +
        'actually understand, creates the tasks and programs under the project rules. On every ' +
        'change, it checks each rule against the code before it reaches production. Other tools ' +
        'help you write code. GOLMET guarantees what was written.',
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
      done: 'Between status and validate, someone created the first feature with the wrong anchor. GOLMET caught it instantly. On your machine, the commands behave the same.',
    },
    tech: {
      heading: 'How does GOLMET do all of this?',
      text: [
        'GOLMET is a native program that runs on your machine, right next to your code. Inside it live three layers. FORMAT v1 is the GOLMET specification that defines how the project must be organized, in markdown files, with states and transitions for every document and the quality gates everything must pass. The KIT is the deterministic engine that validates this specification. And the RUNTIME is where the artificial intelligence executes the process.',
        'The writing follows principles of applied linguistics and reading neuroscience. Every document controls cognitive load, progresses from simple to complex and keeps terminology consistent. Everything is clear on the first read, for anyone on the team.',
        'Every business rule carries the evidence of the code implementing it, with file, line and cryptographic hash. On every validation, GOLMET compares that fingerprint with the current code. If it drifts, the problem shows up before entering the project, never after.',
        'The gm-* skills were built studying the workflows of reference companies and the best practices in the market, refined version after version. They guide your AI agent, step by step, from gathering requirements to reviewing code, through open standards like AGENTS.md and MCP.',
        'And the quality gates H1 through H10 are the rules of that check. The concept comes from DevOps practice, where a quality gate is an automated check that must pass before the code moves forward. GOLMET applied the same idea to documentation. Each gate examines one type of inconsistency between documentation and code, like a rule without an owner or a broken reference. A failure blocks progress. What used to be discovered in production now shows up on the analyst screen. And the project grows without losing control, everything running offline on your machine.',
      ],
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
