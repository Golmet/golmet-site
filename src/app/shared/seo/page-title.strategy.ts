import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { equivalentPath, activeLocaleOfPath } from '../i18n/lang';
import { LOCALES, OG_IMAGE_PATH, SITE_NAME, SITE_URL, PageMeta } from '../../site.config';

// RN-016-3 — metas por página no prerender: title + canonical + hreflang
// (EN + x-default; variante PT-BR liga com o build por locale da RN-011-1)
// + Open Graph com o banner do Arki (og-default.jpg — feature RN-014).

const upsertLink = (doc: Document, rel: string, href: string, hreflang?: string): void => {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let link = doc.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = doc.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    doc.head.appendChild(link);
  }
  link.href = href;
};

@Injectable({ providedIn: 'root' })
export class GolmetTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageMeta = this.pageMetaOf(snapshot);
    if (!pageMeta) return;

    const fullTitle = `${pageMeta.title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${snapshot.url}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: pageMeta.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: pageMeta.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}${OG_IMAGE_PATH}` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    upsertLink(this.doc, 'canonical', url);
    // RN-011-1 — hreflang bidirecional: cada locale aponta a URL equivalente
    // (shadow routes cobrem páginas não traduzidas — RN-011-4).
    for (const locale of LOCALES) {
      upsertLink(this.doc, 'alternate', `${SITE_URL}${equivalentPath(snapshot.url, locale)}`, locale);
    }
    upsertLink(this.doc, 'alternate', url, 'x-default');
    // lang do documento segue o idioma do PATH (shadow PT = EN — RN-011-4).
    this.doc.documentElement.lang = activeLocaleOfPath(snapshot.url) === 'pt-BR' ? 'pt-BR' : 'en';
  }

  private pageMetaOf(snapshot: RouterStateSnapshot): PageMeta | undefined {
    let route = snapshot.root;
    let meta: PageMeta | undefined;
    while (route.firstChild) {
      route = route.firstChild;
      const data = route.data as { meta?: PageMeta };
      if (data?.meta) meta = data.meta;
    }
    return meta;
  }
}
