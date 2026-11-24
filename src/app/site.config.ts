// Config do site (RN-016-3) — fonte das metas, canonical, sitemap e hreflang.
// LOCAIS cresce com o build por locale da feature RN-011 (RN-011-1):
// hoje só EN; amanhã ['en', 'pt-BR'] liga as variantes PT nas metas/hreflang.

export const SITE_NAME = 'GOLMET';

/** URL canônica do site (sem barra final) */
export const SITE_URL = 'https://golmet.io';

/** Idiomas publicados na estratégia de rotas (EN na raiz, PT em /pt-BR/ — ADR-007) */
export const LOCALES = ['en', 'pt-BR'] as const;

/** OG image default — asset da RN-014-2 */
export const OG_IMAGE_PATH = '/og/og-default.jpg';

export interface PageMeta {
  /** título da página (sem sufixo da marca) */
  title: string;
  description: string;
}
