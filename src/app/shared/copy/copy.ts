// RN-014-3 — copy base no tom "Guardião Estoico" (RN-015).
//
// Fonte da landing = PT-BR (RN-013, ADR-009); fonte da docs técnica = EN.
// O EN é derivado e revisado na feature RN-011 — este módulo é a única
// fonte dos textos base (nenhum copy inline em componente).
//
// Regras da voz: frases curtas, zero hype, sempre cita evidência.
// Arki NUNCA é retratado criando conteúdo — só diagnostica, cita
// evidência e bloqueia.

export interface QuickstartStep {
  readonly title: string;
  /** comando copiável — passos narrados (ações) não o têm */
  readonly command?: string;
  readonly text: string;
}

export const COPY = {
  landing: {
    hero: {
      title: 'GOLMET',
      tagline: 'Requisitos versionados. Docs que não apodrecem.',
      valueProposal:
        'O combinado com o cliente vira requisito versionado. O requisito vira spec. ' +
        'A spec vira código rastreável — e o documento continua verdadeiro depois do deploy.',
      statusNote: 'Site em construção — primeiro release na fase F2.',
    },
    quickstart: {
      heading: 'Comece pelo combinado',
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
          text: 'Charter, requisitos e specs — o humano confirma os gates.',
        },
        {
          title: 'A verdade fica versionada',
          text: 'Markdown no seu git — sobrevive a engines, kits e releases.',
        },
      ] as readonly QuickstartStep[],
    },
    paths: {
      heading: 'Escolha seu caminho',
      items: {
        novo: {
          title: 'Produto novo',
          text: 'Charter, requisitos e specs do zero — kit e agente na mesma pasta.',
          docPath: '/docs',
        },
        legado: {
          title: 'Repo legado',
          text: 'O guardião lê o código e propõe as regras; você confirma o que é verdade.',
          docPath: '/docs',
        },
        org: {
          title: 'Org multi-dev',
          text: 'Onboarding do dev #2: clone, doctor, pack sync — checklist sem manual.',
          docPath: '/docs',
        },
      },
    },
    capabilities: {
      heading: 'O que o kit faz',
      note: 'Somente o que está lançado no release vigente — o guardião não promete o que não existe.',
    },
    ctas: {
      github: 'Ver no GitHub',
      npm: 'golmet-cli no npm',
    },
  },
  portal: {
    sidebarTitle: 'Documentação',
    searchPlaceholder: 'Buscar na documentação…',
    notTranslated: 'Página não traduzida — exibindo a versão em inglês.',
    indexNote: 'Em construção — primeiro release na fase F2.',
  },
  notFound: {
    title: 'Página não encontrada',
    message:
      'Este endereço não existe no site — o guardião só afirma o que cita evidência.',
    hint: 'Use a busca ou volte pelos caminhos abaixo.',
  },
} as const;
