import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COPY } from '../shared/copy/copy';
import { DocsSearchService, SearchResult } from './docs-search.service';
import { LangService } from '../shared/i18n/lang';

// RN-009 — busca do portal: campo no layout, resultados linkando as páginas
// (RN-010 — cross-links via sidebar/sumário). RN-011 — busca no locale ativo.
@Component({
  imports: [RouterLink],
  selector: 'app-docs-search',
  styleUrl: './docs-search.scss',
  templateUrl: './docs-search.html',
})
export class DocsSearch {
  private readonly searchService = inject(DocsSearchService);
  private readonly lang = inject(LangService);

  protected readonly placeholder = COPY[this.lang.activeLocale()].portal.searchPlaceholder;
  protected readonly query = signal('');
  protected readonly results = signal<readonly SearchResult[]>([]);
  protected readonly searching = signal(false);

  protected async onInput(value: string): Promise<void> {
    this.query.set(value);
    if (!value.trim()) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    const results = await this.searchService.search(value, this.lang.activeLocale());
    this.results.set(results);
    this.searching.set(false);
  }
}
