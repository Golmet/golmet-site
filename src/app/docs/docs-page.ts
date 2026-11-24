import { Component, inject } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, from } from 'rxjs';

import { COPY, Locale } from '../shared/copy/copy';
import { DocsContentService } from './docs-content.service';
import { GeneratedDocPage } from './docs-content.generated';
import { DOCS_HTML } from './docs-html';
import { DocsPageNavService, PageNav, PageTocItem } from './docs-page-nav.service';

// RN-007 — página de documentação: conteúdo por página (fetch client-side,
// RN-011/RN-017 — bundle leve) e embutido no HTML estático pelo prerender
// via DOCS_HTML (app.config.server — SEO/LCP).
// RN-011-4 — fallback: página PT sem tradução renderiza EN + banner discreto.
// Estilo VitePress — rodapé da página: edit link + "Atualizado em" + Prev/Next.
@Component({
  imports: [RouterLink],
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
  private readonly navService = inject(DocsPageNavService);

  private readonly page: GeneratedDocPage | undefined = this.content.bySlug(
    this.route.snapshot.data['slug'] ?? '',
  );

  protected readonly translated = this.page?.translated ?? false;
  protected readonly hasPage = !!this.page;
  protected readonly locale: Locale = this.route.snapshot.data['locale'] ?? 'en';
  protected readonly copy = COPY[this.locale].portal;

  /** RN-011-4 — banner visível quando a rota PT é shadow (sem tradução). */
  protected readonly showFallbackBanner =
    this.locale === 'pt-BR' && !!this.page && !this.page.translated;

  /** Estilo VitePress — Prev/Next + edit link + atualizado em. */
  protected readonly nav: PageNav = this.page
    ? this.navService.navFor(this.page.slug, this.locale)
    : { prev: null, next: null, sourcePath: '', capturedAt: null };

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
      this.navService.setPageToc(null);
      return from(Promise.resolve(null));
    }
    const prerenderEntry = this.docsHtml[this.page.slug];
    if (prerenderEntry) {
      return from(
        Promise.resolve(this.setPage(prerenderEntry.html)),
      );
    }
    if (!isPlatformBrowser(this.platformId)) {
      return from(Promise.resolve(null));
    }
    return from(
      firstValueFrom(this.content.loadHtml(this.page))
        .then((entry) => {
          const safe = this.setPage(entry.html);
          // RN-011 âncoras — o browser não rola para o fragmento antes do
          // fetch; re-rola quando o conteúdo da página chega.
          const hash = decodeURIComponent(location.hash.slice(1));
          if (hash) {
            document.getElementById(hash)?.scrollIntoView({ block: 'start' });
          }
          return safe;
        })
        .catch(() => null),
    );
  }

  /** Extrai o sumário H2/H3 do HTML (ids GFM gerados no build) para o aside. */
  private setPage(html: string): SafeHtml {
    const items: PageTocItem[] = [];
    const headingRe = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
    let match: RegExpExecArray | null;
    while ((match = headingRe.exec(html)) !== null) {
      items.push({
        id: match[2],
        text: match[3].replace(/<[^>]+>/g, '').trim(),
        level: Number(match[1]) as 2 | 3,
      });
    }
    this.navService.setPageToc(items);
    return this.safe(html);
  }

  private safe(raw: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }
}
