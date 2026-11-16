// RN-016-5 / RN-017 — gate de metas no CI: verifica cada página pré-renderizada
// do output SSG (title, description, og:*, canonical, hreflang) e a presença
// do asset de OG + sitemap.xml. Qualquer falha = exit 1 (bloqueia o merge).
//
// Auto-escala com o build por locale (feature RN-011): quando `pt-BR/`
// existir no output, o hreflang=pt-BR passa a ser exigido.
// A validação strict dos `.md` (RN-008) entra com o pipeline de conteúdo
// (feature RN-007 — RN-007-1) como etapa própria do workflow.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BROWSER_DIR = 'dist/golmet-site/browser';
const SITE_URL = 'https://golmet.io';
const OG_IMAGE = `${SITE_URL}/og/og-default.jpg`;

export function collectRoutes(dir, prefix = '') {
  const routes = [];
  if (!existsSync(dir)) return routes;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const sub = join(dir, name);
    if (statSync(sub).isDirectory() && existsSync(join(sub, 'index.html'))) {
      routes.push(`${prefix}/${name}`);
    }
    routes.push(...collectRoutes(sub, `${prefix}/${name}`));
  }
  return routes;
}

/** Verifica o HTML de uma página — devolve lista de falhas (vazio = ok). */
export function checkPage(html, { path, hasPtLocale }) {
  const failures = [];
  const has = (pattern) => pattern.test(html);
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const descriptionPattern = /<meta\s+name="description"\s+content="[^"]+"/;
  const ogPattern = (property) => new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]+"`);

  if (!titleMatch || titleMatch[1].trim() === '') failures.push(`${path}: <title> ausente ou vazio`);
  if (!has(descriptionPattern)) {
    failures.push(`${path}: meta description ausente ou vazia`);
  }
  if (!has(ogPattern('og:title'))) failures.push(`${path}: og:title ausente`);
  if (!has(ogPattern('og:image'))) failures.push(`${path}: og:image ausente`);
  if (!has(ogPattern('og:url'))) failures.push(`${path}: og:url ausente`);
  if (!has(/<link\s+rel="canonical"/)) failures.push(`${path}: canonical ausente`);
  if (!has(/<link\s+rel="alternate"\s+hreflang="en"/)) failures.push(`${path}: hreflang=en ausente`);
  if (!has(/<link\s+rel="alternate"\s+hreflang="x-default"/)) failures.push(`${path}: hreflang=x-default ausente`);
  if (hasPtLocale && !has(/<link\s+rel="alternate"\s+hreflang="pt-BR"/)) {
    failures.push(`${path}: hreflang=pt-BR ausente (build PT no ar)`);
  }
  return failures;
}

function main() {
  const errors = [];

  if (!existsSync(join(BROWSER_DIR, 'og', 'og-default.jpg'))) {
    errors.push(`OG image ausente no build: ${OG_IMAGE} (asset da RN-014-2)`);
  }
  if (!existsSync(join(BROWSER_DIR, 'sitemap.xml'))) {
    errors.push('sitemap.xml ausente no build (gerado pós-build — RN-016-3)');
  }
  if (!existsSync(join(BROWSER_DIR, 'robots.txt'))) {
    errors.push('robots.txt ausente no build');
  }

  const hasPtLocale = existsSync(join(BROWSER_DIR, 'pt-BR'));
  const indexable = ['/', ...collectRoutes(BROWSER_DIR)];
  for (const route of indexable) {
    const file = route === '/' ? join(BROWSER_DIR, 'index.html') : join(BROWSER_DIR, route, 'index.html');
    if (!existsSync(file)) {
      errors.push(`página pré-renderizada ausente: ${route}`);
      continue;
    }
    errors.push(...checkPage(readFileSync(file, 'utf8'), { path: route, hasPtLocale }));
  }

  if (errors.length > 0) {
    console.error(`check-metas: ${errors.length} falha(s):`);
    for (const error of errors) console.error(`  ✗ ${error}`);
    process.exit(1);
  }
  console.log(`check-metas: ok — ${indexable.length} página(s), OG + sitemap + robots presentes.`);
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) main();
