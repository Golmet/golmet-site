import { Routes } from '@angular/router';

import { DocsIndex } from './docs/docs-index';
import { DocsLayout } from './docs/docs-layout';
import { Landing } from './landing/landing';
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
    children: [{ path: '', component: DocsIndex }],
  },
];
