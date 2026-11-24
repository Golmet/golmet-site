import { Injectable } from '@angular/core';
import MiniSearch from 'minisearch';

import { Locale } from '../shared/copy/copy';

// RN-009 — busca client-side sobre o índice estático gerado no build
// (public/docs-search.json — ADR-004/013). RN-011 — filtro pelo locale ativo.
interface SearchDoc {
  slug: string;
  title: string;
  text: string;
  locale: 'en' | 'pt-BR';
}

export interface SearchResult {
  slug: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class DocsSearchService {
  private index?: MiniSearch<SearchDoc>;

  async ensureIndex(): Promise<void> {
    if (this.index) return;
    const response = await fetch('docs-search.json');
    const docs = (await response.json()) as SearchDoc[];
    this.index = new MiniSearch({
      fields: ['title', 'text'],
      storeFields: ['slug', 'title', 'locale'],
    });
    this.index.addAll(docs);
  }

  async search(query: string, locale: Locale): Promise<readonly SearchResult[]> {
    if (!query.trim()) return [];
    await this.ensureIndex();
    return this.index!
      .search(query, { prefix: true, fuzzy: 0.2 })
      .filter((hit) => hit['locale'] === locale)
      .slice(0, 8)
      .map((hit) => ({ slug: hit['slug'] as string, title: hit['title'] as string }));
  }
}
