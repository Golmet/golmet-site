import { Routes } from '@angular/router';

import { DocsIndex } from './docs/docs-index';
import { DocsLayout } from './docs/docs-layout';
import { DocsPage } from './docs/docs-page';
import { GENERATED_DOCS } from './docs/docs-content.generated';
import { Landing } from './landing/landing';
import { NotFound } from './not-found';
import { PageMeta } from './site.config';

// RN-016-2 — rotas da única app: landing na raiz, portal sob /docs.
// A wildcard (404 custom, RN-020) entra com a feature RN-007 (RN-007-6).
// RN-016-3 — meta por rota: fonte das metas no prerender (copy da landing
// em PT-BR — fonte, RN-013; portal em EN — fonte técnica, RN-013/ADR-009).

const landingMeta: PageMeta = {
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
  { path: '', component: Landing, data: { meta: landingMeta } },
  {
    path: 'docs',
    component: DocsLayout,
    data: { meta: docsMeta },
    children: [
      { path: '', component: DocsIndex, data: { meta: docsMeta } },
      // RN-007 — página de docs por slug: rotas concretas geradas do conteúdo
      // (prerender por página — RN-007-2); conteúdo resolvido pelo componente
      // a partir do .md canônico (docs-as-code, RN-008 strict).
      ...GENERATED_DOCS.map((page) => ({
        path: page.slug,
        component: DocsPage,
        data: { slug: page.slug },
      })),
      // Rotas desconhecidas sob /docs caem no fallback da própria página
      // (NotFound renderizado dentro do shell do portal).
      { path: '**', component: DocsPage },
    ],
  },
  { path: '**', component: NotFound },
];
