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
        return {
          locale,
          copy: COPY[locale].portal,
          toc: this.content.tocFor(locale),
        };
      }),
    ),
    {
      initialValue: (() => {
        const locale = this.lang.activeLocale();
        return { locale, copy: COPY[locale].portal, toc: this.content.tocFor(locale) };
      })(),
    },
  );

  protected readonly pageToc = this.navService.pageToc;
}
