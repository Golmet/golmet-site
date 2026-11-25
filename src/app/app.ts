import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, first, map, startWith } from 'rxjs';

import { COPY, Locale } from './shared/copy/copy';
import { LangService, LOCALES } from './shared/i18n/lang';
// Shell da única app (RN-016-2): header com marca, seletor de idioma (RN-011-3)
// e nav, outlet, footer rico (CR-004). Detecção inicial no boot (RN-011-2).
@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  protected readonly lang = inject(LangService);
  protected readonly locales = LOCALES;

  /** Locale da rota ativa — reativo à navegação (RN-011). */
  protected readonly activeLocale = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.lang.activeLocale()),
    ),
    { initialValue: this.lang.activeLocale() },
  );

  constructor() {
    // RN-011-2 — detecção DEPOIS da navegação inicial resolver (deep links
    // preservados; o prerender nunca redireciona — browser only no service).
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), first())
      .subscribe(() => this.lang.detectAndRedirect());
  }

  /** RN-011 — o link Docs da navbar preserva o locale ativo
   * (PT-BR → /docs/pt-br; EN → /docs). */
  protected docsLink(locale: Locale): string {
    return locale === 'pt-BR' ? '/docs/pt-br' : '/docs';
  }

  /** Copy do locale ativo — footer/notFound alternam com a rota (RN-011). */
  protected get copy() {
    return COPY[this.activeLocale()];
  }

  protected asLocale(code: string): Locale {
    return code as Locale;
  }
}
