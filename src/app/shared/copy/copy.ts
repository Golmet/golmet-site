// RN-014-3 / CR-005 — copy base no tom "Guardião Estoico" (RN-015).
//
// Fonte da landing = PT-BR (RN-013, ADR-009); fonte da docs técnica = EN.
// O EN é derivado e revisado na feature RN-011 — este módulo é a única
// fonte dos textos base (nenhum copy inline em componente).
//
// Regras da voz: frases curtas, zero hype, sempre cita evidência.
// Arki NUNCA é retratado criando conteúdo — só diagnostica, cita
// evidência e bloqueia.
//
// CR-005 (17/11/2026): linguagem simples no hero para quem chega frio,
// coerência de pré-lançamento (sem jargão de fase interno), engines
// nomeados, diferenciação e terminal com saída real do kit.

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

export const COPY = {
  landing: {
    hero: {
      title: 'GOLMET',
      tagline: 'Requisitos versionados. Docs que não apodrecem.',
      plainLine:
        'GOLMET é uma CLI que transforma requisitos em markdown versionado no seu git — ' +
        'e avisa quando código e doc divergem.',
      valueProposal:
        'O combinado com o cliente vira requisito versionado. O requisito vira spec. ' +
        'A spec vira código rastreável — e o documento continua verdadeiro depois do deploy.',
      statusNote: 'Site em construção — o kit v1.1.1 já está estável no npm.',
    },
    terminal: {
      title: 'Saída real — golmet init · status · validate',
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
      ] as readonly ProblemCard[],
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
      ] as readonly ThesisLayer[],
    },
    howItWorks: {
      heading: 'Como funciona',
      steps: [
        { name: 'Charter', text: 'O que vamos construir — confirmado com o cliente.' },
        { name: 'Regras', text: 'RNs numeradas, claras e aprovadas antes do código.' },
        { name: 'Specs', text: 'Modelo de dados, contratos e telas derivados das regras.' },
        { name: 'Código', text: 'Tasks com critérios de aceitação e evidência citada.' },
        { name: 'Verdade viva', text: 'Mudou o requisito? O kit aponta exatamente o que ficou desatualizado.' },
      ] as readonly FlowStep[],
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
      ] as readonly DiffItem[],
    },
    quickstart: {
      heading: 'Comece pelo combinado',
      badge: 'v1.1.1',
      note: 'Release v1.1.1 estável no npm — os comandos acima já funcionam.',
      steps: [
        {
          title: 'Instale o kit',
          command: 'npm i -g golmet-cli',
          text: 'Binário nativo, zero dependência de runtime.',
        },
        {
          title: 'Inicie o workspace',
          command: 'golmet init NomeDoProduto',
          text: 'Wizard guia: engine, repos e layout do FORMATO.',
        },
        {
          title: 'Abra o agente na pasta',
          command: 'opencode',
          text: 'Ou o engine que você escolheu no install — o init já deixou o MCP do kit configurado.',
        },
        {
          title: 'A verdade fica versionada',
          text: 'Markdown no seu git — sobrevive a engines, kits e releases.',
        },
      ] as readonly QuickstartStep[],
    },
    paths: {
      heading: 'Escolha seu caminho',
      items: [
        {
          title: 'Produto novo',
          text: 'Charter, requisitos e specs do zero — kit e agente na mesma pasta.',
          docPath: '/docs',
        },
        {
          title: 'Repo legado',
          text: 'O guardião lê o código e propõe as regras; você confirma o que é verdade.',
          docPath: '/docs',
        },
        {
          title: 'Org multi-dev',
          text: 'Onboarding do dev #2: clone, doctor, pack sync — checklist sem manual.',
          docPath: '/docs',
        },
      ] as readonly PathCard[],
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
      ] as readonly FeatureCommand[],
    },
    ctas: {
      github: 'Ver no GitHub',
      npm: 'golmet-cli no npm',
    },
    finalCta: {
      heading: 'Comece hoje',
      text: 'Um comando. Um workspace. A verdade versionada no seu git.',
      command: 'npm i -g golmet-cli',
      preLaunch: 'v1.1.1 estável — instalação funcional pelo npm.',
    },
  },
  portal: {
    sidebarTitle: 'Documentação',
    searchPlaceholder: 'Buscar na documentação…',
    notTranslated: 'Página não traduzida — exibindo a versão em inglês.',
    indexNote: 'Documentação em evolução — renderizada da main do repo.',
  },
  notFound: {
    title: 'Página não encontrada',
    message:
      'Este endereço não existe no site — o guardião só afirma o que cita evidência.',
    hint: 'Use a busca ou volte pelos caminhos abaixo.',
  },
  footer: {
    links: {
      docs: '/docs',
      github: 'https://github.com/Golmet',
      npm: 'https://www.npmjs.com/package/golmet-cli',
    },
    license: 'Licença MIT',
    status: 'Kit v1.1.1 estável no npm · site em construção.',
  },
};
