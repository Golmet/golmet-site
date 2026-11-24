import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs';

import { GENERATED_DOCS, GENERATED_TOC, GeneratedDocPage } from './docs-content.generated';
import { DocsHtmlEntry } from './docs-html';
import { Locale } from '../shared/copy/copy';

// RN-007 — serviço de conteúdo do portal: lookup de página (metadados —
// bundle leve), TOC por locale (RN-011) e loader do conteúdo por página
// (fetch de public/docs-html — cacheado; RN-011/RN-017).
@Injectable({ providedIn: 'root' })
export class DocsContentService {
  private readonly htmlCache = new Map<string, DocsHtmlEntry>();

  tocFor(locale: Locale): readonly { group: string; items: readonly { slug: string; title: string }[] }[] {
    return GENERATED_TOC.find((toc) => toc.locale === locale)?.groups ?? [];
  }

  bySlug(slug: string): GeneratedDocPage | undefined {
    return GENERATED_DOCS.find((page) => page.slug === slug);
  }

  byLocale(locale: Locale): readonly GeneratedDocPage[] {
    return GENERATED_DOCS.filter((page) => page.locale === locale);
  }

  get pages(): readonly GeneratedDocPage[] {
    return GENERATED_DOCS;
  }

  /** RN-011 — conteúdo da página (fetch por página, cacheado — RN-017). */
  loadHtml(page: GeneratedDocPage): Observable<DocsHtmlEntry> {
    const key = `${page.locale}/${page.base}`;
    const cached = this.htmlCache.get(key);
    if (cached) return of(cached);
    const url = `/docs-html/${page.locale === 'pt-BR' ? 'pt-BR' : 'en'}/${page.base}.json`;
    return from(
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`docs-html ${res.status}`);
        return res.json() as Promise<DocsHtmlEntry>;
      }),
    ).pipe(
      tap((entry) => this.htmlCache.set(key, entry)),
      shareReplay(1),
    );
  }
}
