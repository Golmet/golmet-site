// RN-016-3 — gera sitemap.xml a partir das rotas pré-renderizadas no build.
// Regra: todo diretório com index.html no output SSG é uma rota indexável
// (auto-escala com o pipeline de conteúdo da feature RN-007). Exclui 404 e
// fallback CSR. Executado pós-build: `npm run build`.
import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BROWSER_DIR = 'dist/golmet-site/browser';
const SITE_URL = 'https://golmet.io';

function collectRoutes(dir, prefix = '') {
  const routes = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name === '404' || name.includes('.csr')) continue;
    const sub = join(dir, name);
    if (existsSync(join(sub, 'index.html'))) {
      routes.push(`${prefix}/${name}`);
    }
    routes.push(...collectRoutes(sub, `${prefix}/${name}`));
  }
  return routes;
}

const rootIndex = join(BROWSER_DIR, 'index.html');
const routes = existsSync(rootIndex) ? ['/', ...collectRoutes(BROWSER_DIR)] : collectRoutes(BROWSER_DIR);

const urls = routes
  .map((route) => `  <url><loc>${SITE_URL}${route === '/' ? '' : route}</loc></url>`)
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(BROWSER_DIR, 'sitemap.xml'), sitemap);

// RN-017 — index.csr.html é o shell CSR interno do Angular (não é página
// acessível por URL); removê-lo evita o Lighthouse testar um shell vazio
// (performance 0.82 mobile falhava o gate minScore 0.9).
const csrShell = join(BROWSER_DIR, 'index.csr.html');
rmSync(csrShell, { force: true });
console.log(`sitemap.xml gerado com ${routes.length} rota(s).`);
