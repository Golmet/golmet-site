import { InjectionToken } from '@angular/core';

// RN-011/RN-017 — conteúdo das páginas de docs FORA do bundle inicial:
// o provider default (browser) é vazio (o cliente faz fetch por página);
// o app.config.server sobrescreve lendo do disco no prerender (build-time) —
// o HTML estático sai com o conteúdo embutido (SEO/LCP) sem pesar o bundle.
export interface DocsHtmlEntry {
  readonly title: string;
  readonly html: string;
  readonly sourcePath?: string;
}

export const DOCS_HTML = new InjectionToken<Record<string, DocsHtmlEntry>>('DOCS_HTML', {
  factory: () => ({}),
});
