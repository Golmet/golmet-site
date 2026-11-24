import { Injectable } from '@angular/core';

import { GENERATED_DOCS, GENERATED_TOC, GeneratedDocPage } from './docs-content.generated';
import { Locale } from '../shared/copy/copy';

// RN-007 — serviço de conteúdo do portal: lookup de página + TOC para a
// sidebar. RN-011 — TOC e páginas por locale (shadow pages incluídas —
// RN-011-4). Fonte: gerado no build (docs-as-code).
@Injectable({ providedIn: 'root' })
export class DocsContentService {
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
}
