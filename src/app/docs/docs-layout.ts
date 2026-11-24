import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { DocsSearch } from './docs-search';
import { DocsContentService } from './docs-content.service';
import { LangService } from '../shared/i18n/lang';

// RN-007 — shell do portal: sidebar com TOC (RN-010) e busca (RN-009).
// RN-011 — TOC e copy do locale da rota ativa (EN raiz / PT-BR pt-br/).
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

  protected readonly activeLocale = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.lang.activeLocale()),
    ),
    { initialValue: this.lang.activeLocale() },
  );

  protected readonly toc = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.content.tocFor(this.lang.activeLocale())),
    ),
    { initialValue: this.content.tocFor(this.lang.activeLocale()) },
  );
}
