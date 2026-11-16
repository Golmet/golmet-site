import { Routes } from '@angular/router';

import { DocsIndex } from './docs/docs-index';
import { DocsLayout } from './docs/docs-layout';
import { Landing } from './landing/landing';

// RN-016-2 — rotas da única app: landing na raiz, portal sob /docs.
// A wildcard (404 custom, RN-020) entra com a feature RN-007 (RN-007-6).
export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'docs',
    component: DocsLayout,
    children: [{ path: '', component: DocsIndex }],
  },
];
