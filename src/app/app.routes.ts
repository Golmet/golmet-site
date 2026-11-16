import { Routes } from '@angular/router';

import { Home } from './home/home';

// RN-016-1 — rota mínima para o prerender SSG; a estrutura completa de rotas
// (landing na raiz, portal em /docs) é da task RN-016-2.
export const routes: Routes = [{ path: '', component: Home }];
