import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { COPY } from '../shared/copy/copy';
import { DocsSearch } from './docs-search';
import { DocsContentService } from './docs-content.service';
import { DocsPageNavService } from './docs-page-nav.service';
import { LangService } from '../shared/i18n/lang';

// RN-007 — shell do portal estilo VitePress: sidebar com grupos colapsáveis
// (RN-010), busca (RN-009) e aside direito "Nesta página" (RN-011 toc).
// Layout 3 colunas ≥1400px; aside some <1400; sidebar some <960 (mobile).
@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DocsSearch],
  selector: 'app-docs-layout',
  styleUrl: './docs-layout.scss',
  templateUrl: './docs-layout.html',
})
export class DocsLayout {
  private readonly router = inject(Router);
  private readonly lang = inject(LangService);
  private readonly content = inject(DocsContentService);
  private readonly navService = inject(DocsPageNavService);

  protected readonly state = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const locale = this.lang.activeLocale();
        const url = decodeURIComponent(this.router.url.split('#')[0].split('?')[0]);
        // Índice do portal não tem sumário de página — limpa o estado do
        // aside "Nesta página" herdado da navegação anterior (RN-011).
        if (url === '/docs' || url === '/docs/') this.navService.setPageToc(null);
        // Slug da página ativa — PT prefixado ('pt-br/<base>'), EN direto.
        let slug = '';
        if (url.startsWith('/docs/pt-br/')) slug = 'pt-br/' + url.slice('/docs/pt-br/'.length);
        else if (url.startsWith('/docs/')) slug = url.slice('/docs/'.length);
        // Estilo VitePress: somente o grupo da página ativa nasce aberto.
        const openGroups = new Set(
          this.content
            .tocFor(locale)
            .filter((group) => group.items.some((item) => item.slug === slug))
            .map((group) => group.group),
        );
        return {
          locale,
          copy: COPY[locale].portal,
          toc: this.content.tocFor(locale),
          openGroups,
        };
      }),
    ),
    {
      initialValue: (() => {
        const locale = this.lang.activeLocale();
        const url = decodeURIComponent(this.router.url.split('#')[0].split('?')[0]);
        let slug = '';
        if (url.startsWith('/docs/pt-br/')) slug = 'pt-br/' + url.slice('/docs/pt-br/'.length);
        else if (url.startsWith('/docs/')) slug = url.slice('/docs/'.length);
        const openGroups = new Set<string>(
          this.content
            .tocFor(locale)
            .filter((group) => group.items.some((item) => item.slug === slug))
            .map((group) => group.group),
        );
        return { locale, copy: COPY[locale].portal, toc: this.content.tocFor(locale), openGroups };
      })(),
    },
  );

  protected readonly pageToc = this.navService.pageToc;

  /** RN-011 âncoras — rola SEM navegar: o <a href="#id"> plano dentro do app
   * Angular disparava navegação do Router para a raiz (base href "/"), e o
   * history.replaceState mutava o URL da mesma forma. Button + scroll puro:
   * nenhuma mutação de URL, nenhuma navegação. */
  protected scrollToAnchor(id: string): void {
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }
}
