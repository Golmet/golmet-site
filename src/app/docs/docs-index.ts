import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { COPY } from '../shared/copy/copy';
import { DocsContentService } from './docs-content.service';
import { LangService } from '../shared/i18n/lang';

// Índice do portal: páginas do locale ativo, geradas dos .md do CLI (RN-007).
// RN-011 — índice reativo ao locale da rota.
@Component({
  imports: [RouterLink],
  selector: 'app-docs-index',
  styleUrl: './docs-index.scss',
  templateUrl: './docs-index.html',
})
export class DocsIndex {
  private readonly router = inject(Router);
  private readonly lang = inject(LangService);
  private readonly content = inject(DocsContentService);

  protected readonly state = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        const locale = this.lang.activeLocale();
        return {
          copy: COPY[locale].portal,
          pages: this.content
            .byLocale(locale)
            .map((page) => ({ slug: page.slug, title: page.title })),
        };
      }),
    ),
    {
      initialValue: (() => {
        const locale = this.lang.activeLocale();
        return {
          copy: COPY[locale].portal,
          pages: this.content
            .byLocale(locale)
            .map((page) => ({ slug: page.slug, title: page.title })),
        };
      })(),
    },
  );
}
