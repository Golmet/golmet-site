import { Component, inject } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { DocsContentService } from './docs-content.service';

// RN-007 — página de documentação renderizada do .md canônico (RN-007-2).
// O HTML é gerado no build (marked) e vinculado via [innerHTML] — o
// sanitizador default do Angular aplica na renderização (SECURITY §5:
// conteúdo de autoria confiável, sanitizado por padrão).
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

  private readonly page = this.content.bySlug(this.route.snapshot.data['slug'] ?? '');

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
