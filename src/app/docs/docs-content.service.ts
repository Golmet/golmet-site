import { Injectable } from '@angular/core';

import { GENERATED_DOCS, GENERATED_TOC, GeneratedDocPage, GeneratedTocGroup } from './docs-content.generated';

// RN-007 — serviço de conteúdo do portal: lookup de página + TOC para a
// sidebar. Fonte: gerado no build a partir dos .md canônicos (docs-as-code).
@Injectable({ providedIn: 'root' })
export class DocsContentService {
  readonly toc: readonly GeneratedTocGroup[] = GENERATED_TOC;

  bySlug(slug: string): GeneratedDocPage | undefined {
    return GENERATED_DOCS.find((page) => page.slug === slug);
  }

  get pages(): readonly GeneratedDocPage[] {
    return GENERATED_DOCS;
  }
}
