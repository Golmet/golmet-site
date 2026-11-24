import { Component, inject } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, from } from 'rxjs';

import { COPY, Locale } from '../shared/copy/copy';
import { DocsContentService } from './docs-content.service';
import { GeneratedDocPage } from './docs-content.generated';
import { DOCS_HTML } from './docs-html';

// RN-007 — página de documentação: conteúdo por página (fetch client-side,
// RN-011/RN-017 — bundle leve) e embutido no HTML estático pelo prerender
// via DOCS_HTML (app.config.server — SEO/LCP).
// RN-011-4 — fallback: página PT sem tradução renderiza EN + banner discreto.
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly docsHtml = inject(DOCS_HTML);

  private readonly page: GeneratedDocPage | undefined = this.content.bySlug(
    this.route.snapshot.data['slug'] ?? '',
  );

  protected readonly translated = this.page?.translated ?? false;
  protected readonly locale: Locale = this.route.snapshot.data['locale'] ?? 'en';
  protected readonly copy = COPY[this.locale].portal;

  /** RN-011-4 — banner visível quando a rota PT é shadow (sem tradução). */
  protected readonly showFallbackBanner =
    this.locale === 'pt-BR' && !!this.page && !this.page.translated;

  private readonly html = toSignal(this.loadHtml(), { initialValue: null as SafeHtml | null });

  protected get contentHtml(): SafeHtml | null {
    return this.html();
  }

  /**
   * Conteúdo da página: no prerender lê do DOCS_HTML (disco — app.config.server,
   * o HTML estático sai com o conteúdo embutido); no cliente faz fetch do JSON
   * por página (public/docs-html — leve, gate Lighthouse RN-017).
   */
  private loadHtml() {
    if (!this.page) {
      return from(Promise.resolve(null));
    }
    const prerenderEntry = this.docsHtml[this.page.slug];
    if (prerenderEntry) {
      return from(Promise.resolve(this.safe(prerenderEntry.html)));
    }
    if (!isPlatformBrowser(this.platformId)) {
      return from(Promise.resolve(null));
    }
    return from(
      firstValueFrom(this.content.loadHtml(this.page))
        .then((entry) => this.safe(entry.html))
        .catch(() => null),
    );
  }

  private safe(raw: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }
}
