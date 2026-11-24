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
    'GOLMET is the spec-driven workflow that keeps client agreements as versioned requirements — and keeps documentation true after the code ships.',
};

const landingMetaPt: PageMeta = {
  title: 'Requisitos versionados. Docs que não apodrecem.',
  description:
    'GOLMET é o workflow spec-driven que guarda o combinado com o cliente em requisitos versionados — e mantém a documentação verdadeira depois do código pronto.',
};

const docsMeta: PageMeta = {
  title: 'Documentation',
  description:
    'The GOLMET documentation — FORMAT, kit commands, MCP tools and concepts, rendered from the versioned sources.',
};

export const routes: Routes = [
  { path: '', component: Landing, data: { meta: landingMetaEn, locale: 'en' } },
  { path: 'pt-BR', component: Landing, data: { meta: landingMetaPt, locale: 'pt-BR' } },
  {
    path: 'docs',
    component: DocsLayout,
    data: { meta: docsMeta },
    children: [
      { path: '', component: DocsIndex, data: { meta: docsMeta } },
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
