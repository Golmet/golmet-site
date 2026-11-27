import { Routes } from '@angular/router';

import { DocsIndex } from './docs/docs-index';
import { DocsLayout } from './docs/docs-layout';
import { DocsPage } from './docs/docs-page';
import { GENERATED_DOCS } from './docs/docs-content.generated';
import { Landing } from './landing/landing';
import { NotFound } from './not-found';
import { PageMeta } from './site.config';

// RN-016-2 — rotas da única app: landing na raiz, portal sob /docs.
// RN-011-1 — build por locale: EN na raiz, PT-BR em /pt-BR (landing) e
// /docs/pt-br/** (portal). hreflang por página via LangService (RN-017).

const landingMetaEn: PageMeta = {
  title: "Versioned requirements. Docs that don't rot.",
  description:
    'Scope creep, stale docs, AI agents coding the wrong thing. Every gap becomes rework. GOLMET keeps client agreements versioned in your git and flags the exact code that diverged.',
};

const landingMetaPt: PageMeta = {
  title: 'Requisitos versionados. Docs que não apodrecem.',
  description:
    'Escopo que cresce escondido, doc velha, agente de IA codando errado. Cada brecha vira retrabalho. O GOLMET guarda o combinado com o cliente versionado no seu git e aponta o código que divergiu.',
};

const docsMeta: PageMeta = {
  title: 'Documentation',
  description:
    'The GOLMET documentation. FORMAT, kit commands, MCP tools and concepts, rendered from the versioned sources.',
};

const docsMetaPt: PageMeta = {
  title: 'Documentação',
  description:
    'A documentação GOLMET. FORMAT, comandos do kit, ferramentas MCP e conceitos, renderizada das fontes versionadas.',
};

export const routes: Routes = [
  { path: '', component: Landing, data: { meta: landingMetaEn, locale: 'en' } },
  { path: 'pt-BR', component: Landing, data: { meta: landingMetaPt, locale: 'pt-BR' } },
  {
    path: 'docs',
    component: DocsLayout,
    data: { meta: docsMeta },
    children: [
      { path: '', component: DocsIndex, data: { meta: docsMeta, locale: 'en' } },
      // RN-011 — índice PT-BR próprio (navbar Docs preserva o locale).
      { path: 'pt-br', component: DocsIndex, data: { meta: docsMetaPt, locale: 'pt-BR' } },
      // RN-007 — página de docs por slug; RN-011 — docs EN na raiz do portal
      // e PT-BR sob pt-br/ (shadow pages cobrem fallback — RN-011-4).
      ...GENERATED_DOCS.map((page) => ({
        path: page.slug,
        component: DocsPage,
        data: { slug: page.slug, locale: page.locale },
      })),
      // Rotas desconhecidas sob /docs caem no fallback da própria página
      // (NotFound renderizado dentro do shell do portal).
      { path: '**', component: DocsPage },
    ],
  },
  { path: '**', component: NotFound },
];
