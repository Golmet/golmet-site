import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { DOCS_HTML } from './docs/docs-html';

// RN-011/RN-017 — no prerender (build-time) o conteúdo das docs é lido do
// disco (public/docs-html/<locale>/<base>.json, gerado pelo pipeline RN-007)
// e entregue ao DocsPage via DOCS_HTML — o HTML estático sai com o conteúdo
// embutido (SEO/LCP) sem inflar o bundle do cliente.
function loadDocsHtml(): Record<string, { title: string; html: string }> {
  const map: Record<string, { title: string; html: string }> = {};
  const root = 'public/docs-html';
  const walk = (dir: string, localeDir: string, prefix: string) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // pasta do locale ausente
    }
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full, localeDir, prefix ? `${prefix}/${entry.name}` : entry.name);
        continue;
      }
      if (!entry.name.endsWith('.json')) continue;
      const base = `${prefix ? `${prefix}/` : ''}${entry.name.replace(/\.json$/, '')}`;
      try {
        map[`${localeDir}/${base}`] = JSON.parse(readFileSync(full, 'utf8'));
      } catch {
        /* arquivo inválido — a página vira fallback vazio no prerender */
      }
    }
  };
  walk(join(root, 'en'), 'en', '');
  walk(join(root, 'pt-BR'), 'pt-br', '');
  return map;
}

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), { provide: DOCS_HTML, useFactory: loadDocsHtml }],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
