import { Component, inject } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { COPY, Locale } from '../shared/copy/copy';
import { DocsContentService } from './docs-content.service';
import { GeneratedDocPage } from './docs-content.generated';

// RN-007 — página de documentação renderizada do .md canônico (RN-007-2).
// RN-011-4 — fallback: página PT sem tradução renderiza EN + banner discreto.
// Título/description dinâmicos por página; canonical/hreflang/lang ficam na
// GolmetTitleStrategy (RN-011-1 — server-safe pelo DOCUMENT inject).
@Component({
  selector: 'app-docs-page',
  styleUrl: './docs-page.scss',
  templateUrl: './docs-page.html',
})
export class DocsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(DocsContentService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly page: GeneratedDocPage | undefined = this.content.bySlug(
    this.route.snapshot.data['slug'] ?? '',
  );

  protected readonly translated = this.page?.translated ?? false;
  protected readonly locale: Locale = this.route.snapshot.data['locale'] ?? 'en';
  protected readonly copy = COPY[this.locale].portal;

  protected readonly html = this.page
    ? this.sanitizer.bypassSecurityTrustHtml(this.page.html)
    : null;

  constructor() {
    this.title.setTitle(this.page ? `${this.page.title} — GOLMET` : 'Page not found — GOLMET');
    this.meta.updateTag({
      name: 'description',
      content: this.page?.title ?? 'Documentation page not found',
    });
  }
}
