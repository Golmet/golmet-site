// RN-011-2/3 — serviço de idioma: locale ativo (da URL), detecção inicial
// (preferência salva → navegador PT → EN) e URL equivalente para o seletor.
// localStorage é a única persistência do V1 (REQUIREMENTS §9 — não é dado pessoal).
// Funções PURAS de path (activeLocaleOfPath/equivalentPath) são usadas também
// pela GolmetTitleStrategy (hreflang/canonical por rota — server-safe).
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SITE_URL } from '../../site.config';

export type Locale = 'en' | 'pt-BR';

export const LOCALES: readonly { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt-BR', label: 'PT-BR' },
];

const STORAGE_KEY = 'gm-lang';

/** Locale do PATH (RN-011-1: EN raiz / PT-BR em /pt-BR e /docs/pt-br/). */
export function activeLocaleOfPath(path: string): Locale {
  return path === '/pt-BR' ||
    path.startsWith('/pt-BR/') ||
    path.startsWith('/docs/pt-br/') ||
    path.startsWith('/docs/pt-br')
    ? 'pt-BR'
    : 'en';
}

/** URL da mesma página no locale alvo (shadow routes cobrem o fallback). */
export function equivalentPath(path: string, target: Locale): string {
  if (path.startsWith('/docs/pt-br/')) {
    const slug = path.slice('/docs/pt-br/'.length).split('?')[0].split('#')[0];
    return target === 'pt-BR' ? path : `/docs/${slug}`;
  }
  if (path.startsWith('/docs') ) {
    // /docs e /docs/ são o índice único (bilingue) — sem variante por locale.
    if (path === '/docs' || path === '/docs/') return target === 'pt-BR' ? '/docs' : '/docs';
    const slug = path.slice('/docs/'.length).split('?')[0].split('#')[0];
    return target === 'pt-BR' ? `/docs/pt-br/${slug}` : `/docs/${slug}`;
  }
  if (path === '/pt-BR' || path.startsWith('/pt-BR/')) {
    return target === 'en' ? path.replace('/pt-BR', '') || '/' : path;
  }
  return target === 'pt-BR' ? '/pt-BR' : path;
}

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly router = inject(Router);

  /** Locale da URL atual (reativo via toSignal nos consumidores). */
  activeLocale(url = this.router.url): Locale {
    return activeLocaleOfPath(url);
  }

  /** Preferência salva (RN-011-3). */
  savedPreference(): Locale | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'pt-BR' || saved === 'en' ? saved : null;
    } catch {
      return null;
    }
  }

  private persist(locale: Locale): void {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage indisponível — segue sem persistir */
    }
  }

  /**
   * RN-011-2 — detecção no boot (browser only; o prerender nunca redireciona):
   * preferência salva sobrepõe o navegador; navegador em PT na raiz vai para
   * /pt-BR; demais idiomas ficam no EN da raiz.
   */
  detectAndRedirect(): void {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    const url = this.router.url;
    // Só a raiz NEUTRA '/' negocia idioma (pref/navegador). Qualquer URL
    // explícita (/pt-BR, /docs/**) é intenção do visitante — nunca redireciona.
    if (url !== '/' && url !== '') return;
    const saved = this.savedPreference();
    const wantsPt = saved ? saved === 'pt-BR' : /^pt\b/i.test(navigator.language ?? '');
    if (wantsPt && activeLocaleOfPath(url) === 'en') {
      this.persist('pt-BR');
      void this.router.navigate(['/pt-BR'], { replaceUrl: true });
    }
  }

  /** RN-011-3 — troca pelo seletor: persiste e navega para o equivalente. */
  switchTo(locale: Locale): void {
    this.persist(locale);
    const targetUrl = equivalentPath(this.router.url, locale);
    if (targetUrl !== this.router.url) void this.router.navigate([targetUrl], { replaceUrl: true });
  }
}
