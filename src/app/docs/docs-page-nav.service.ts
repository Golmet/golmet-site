import { Injectable, signal } from '@angular/core';

import { COPY, Locale } from '../shared/copy/copy';
import { CAPTURED_AT, GENERATED_DOCS, GENERATED_ORDER } from './docs-content.generated';

// RN-007/estilo VitePress — navegação da página ativa:
//  - "Nesta página" (sumário H2/H3, setado pelo DocsPage após o fetch)
//  - Prev/Next pela ORDEM SEMÂNTICA do manifest (GENERATED_ORDER)
//  - "Edita esta página" + "Atualizado em" (sourcePath + capturedAt)
export interface PageTocItem {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

export interface PageNav {
  readonly prev: { slug: string; title: string } | null;
  readonly next: { slug: string; title: string } | null;
  readonly sourcePath: string;
  readonly capturedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class DocsPageNavService {
  /** Sumário da página ativa ("Nesta página") — null enquanto carrega. */
  readonly pageToc = signal<readonly PageTocItem[] | null>(null);

  setPageToc(items: readonly PageTocItem[] | null): void {
    this.pageToc.set(items);
  }

  /** Prev/Next pela ordem semântica do locale (RN-011 — sidebar sem ordem alfabética). */
  navFor(slug: string, locale: Locale): PageNav {
    const order = GENERATED_ORDER[locale] ?? [];
    const index = order.indexOf(slug);
    const pageAt = (candidateSlug: string) => {
      const page = GENERATED_DOCS.find(
        (p) => p.slug === candidateSlug && p.locale === locale,
      );
      return page ? { slug: page.slug, title: page.title } : null;
    };
    return {
      prev: index > 0 ? pageAt(order[index - 1]) : null,
      next: index >= 0 && index < order.length - 1 ? pageAt(order[index + 1]) : null,
      sourcePath: GENERATED_DOCS.find((p) => p.slug === slug && p.locale === locale)?.sourcePath ?? '',
      capturedAt: CAPTURED_AT,
    };
  }

  /** Extraindo o sumário H2/H3 do HTML renderizado (ids GFM já gerados no build). */
  extractToc(root: HTMLElement): readonly PageTocItem[] {
    const items: PageTocItem[] = [];
    root.querySelectorAll<HTMLElement>('.gm-doc-content h2, .gm-doc-content h3').forEach((heading) => {
      if (!heading.id) return;
      items.push({
        id: heading.id,
        text: heading.textContent?.trim() ?? '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });
    return items;
  }
}
