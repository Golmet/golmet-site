// RN-007 — pipeline de conteúdo (docs-as-code, RN-008 strict).
//
// Ingestão: docs-content/cli/**.md — gerado por tools/fetch-cli-docs.mjs a
// partir do repo PÚBLICO Golmet/golmet-cli (raw + GitHub Releases API).
// Nenhuma página hand-written no front: tudo vem da doc do CLI (RN-007-8/9).
//
// Gera:
//   src/app/docs/docs-content.generated.ts  — páginas + TOC (para prerender)
//   public/docs-search.json                 — corpo para a busca client-side (RN-009)
//
// Strict (RN-008/ADR-005): qualquer violação = exit 1, nada publica.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { Marked } from 'marked';

// RN-011-1/5 — ingestão por locale: para cada página EN do release existe uma
// rota PT (shadow quando não há tradução — RN-011-4 renderiza EN + banner).
const SOURCES = [
  // Grupo único "CLI" nos dois locales; a variante PT-BR é derivada (ADR-009).
  { type: 'local', dir: 'docs-content/cli', group: 'CLI', lang: 'en' },
];

const OUT_TS = 'src/app/docs/docs-content.generated.ts';
const OUT_SEARCH = 'public/docs-search.json';

const marked = new Marked();

const slugOf = (rel) =>
  rel
    .replace(/\.md$/i, '')
    .replace(/\\/g, '/')
    .toLowerCase();

const titleOf = (md, rel) => {
  const h1 = md.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return rel
    .split(/[\\/]/)
    .pop()
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ');
};

/** RN-008 — validação strict de uma página do portal. Devolve falhas. */
export function validatePage(md, rel) {
  const errors = [];
  // H1s contam FORA de blocos de código — `# comentário` em fence shell do
  // README do kit não é heading (docs reais do release, RN-007-8).
  const mdNoFences = md.replace(/```[\s\S]*?```/g, ' ');
  const h1s = mdNoFences.match(/^#\s+.+$/gm) ?? [];
  if (h1s.length !== 1) errors.push(`${rel}: exatamente 1 H1 é obrigatório (achados: ${h1s.length})`);
  if (md.trim().length < 40) errors.push(`${rel}: corpo vazio ou mínimo demais`);
  if (md.trimStart().startsWith('---')) {
    const closed = md.trimStart().split('\n').slice(1).includes('---');
    if (!closed) errors.push(`${rel}: front matter aberto (--- sem fechar)`);
  }
  return errors;
}

function stripMd(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*`>\[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function walkMd(dir, exclude = []) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (exclude.includes(entry.name)) continue;
      out.push(...walkMd(full, exclude));
    } else if (entry.name.toLowerCase().endsWith('.md')) out.push(full);
  }
  return out;
}

function ingest() {
  const pages = [];
  const failures = [];
  const source = SOURCES[0];
  const manifest = JSON.parse(readFileSync(join(source.dir, 'manifest.json'), 'utf8'));

  // RN-011 âncoras — ids GFM nos headings (lowercase, sem pontuação,
  // espaços → hífen; duplicatas ganham -1/-2) para links com # rolar.
  const headingIds = (html) => {
    const used = new Map();
    return html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
      const text = inner.replace(/<[^>]+>/g, '').trim();
      let slug = text
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-');
      if (!slug) slug = 'secao';
      const count = used.get(slug) ?? 0;
      used.set(slug, count + 1);
      const id = count === 0 ? slug : `${slug}-${count}`;
      return `<h${level} id="${id}">${inner}</h${level}>`;
    });
  };

  // RN-008 — o front matter é VALIDADO mas NÃO renderizado (docs-as-code:
  // o corpo publicado é o conteúdo após o delimitador de fechamento).
  const stripFrontMatter = (md) => md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();

  const readMd = (rel) => {
    const md = readFileSync(join(source.dir, rel), 'utf8');
    failures.push(...validatePage(md, rel));
    const body = stripFrontMatter(md);
    return { md: body, html: headingIds(marked.parse(body)), title: titleOf(md, rel), text: stripMd(body) };
  };

  // Página EN (fonte) + rota PT (traduzida ou shadow EN + banner — RN-011-4).
  // sourcePath/sourcePathPt: caminho do arquivo no repo do kit (edit link).
  const addPair = (base, hasPt, fileEn, filePt, group, sourcePath, sourcePathPt) => {
    const en = readMd(fileEn);
    push(pages, {
      slug: base,
      base,
      locale: 'en',
      lang: 'en',
      translated: true,
      sourcePath,
      ...en,
      group,
    });
    const ptRel = filePt;
    if (hasPt && existsSync(join(source.dir, ptRel))) {
      const pt = readMd(ptRel.replace(/\\/g, '/'));
      push(pages, {
        slug: `pt-br/${base}`,
        base,
        locale: 'pt-BR',
        lang: 'pt-BR',
        translated: true,
        sourcePath: sourcePathPt ?? sourcePath,
        ...pt,
        group,
      });
    } else {
      // RN-011-4 — shadow: rota PT existe, conteúdo EN + banner de não traduzida.
      push(
        pages,
        {
          slug: `pt-br/${base}`,
          base,
          locale: 'pt-BR',
          lang: 'en',
          translated: false,
          sourcePath,
          title: en.title,
          html: en.html,
          text: en.text,
          group,
        },
      );
    }
  };

  const push = (arr, page, group) => arr.push({ ...page, group: page.group ?? group });

  // Seções do README (pareadas por índice — READMEs gêmeos).
  for (const entry of manifest.readme ?? []) {
    const file = `${entry.base}.md`;
    if (!existsSync(join(source.dir, file))) {
      failures.push(`${file}: no manifest mas ausente no disco`);
      continue;
    }
    addPair(
      entry.base,
      entry.hasPt === true,
      file,
      `pt-br/${entry.base}.md`,
      entry.group,
      entry.sourcePath ?? 'README.md',
      entry.sourcePathPt ?? 'README.pt-br.md',
    );
  }

  // Releases (CHANGELOG das GitHub Releases) — ÚLTIMA aba do grupo CLI
  // (pedido do operador: a aba Releases fecha a guia CLI com o changelog).
  addPair(
    'releases',
    manifest.releases?.hasPt === true,
    'releases.md',
    'pt-br/releases.md',
    manifest.releases?.group ?? 'CLI',
    manifest.releases?.sourcePath ?? 'CHANGELOG.md',
  );

  // Árvore docs/** do repo (FORMAT, concepts, getting-started, reference…).
  for (const entry of manifest.docs ?? []) {
    const file = `${entry.base}.md`;
    if (!existsSync(join(source.dir, file))) {
      failures.push(`${file}: no manifest mas ausente no disco`);
      continue;
    }
    // sourcePath do fetch já inclui o prefixo docs/ (caminho no repo do kit).
    addPair(
      entry.base,
      entry.hasPt === true,
      file,
      `pt-br/${entry.base}.md`,
      entry.group,
      entry.sourcePath ?? `docs/${entry.base}.md`,
      entry.sourcePathPt ?? `docs/${entry.base}.pt-br.md`,
    );
  }

  // Arquivos .md órfãos (no disco, fora do manifest) = fonte inconsistente.
  const manifestBases = new Set([
    'releases',
    ...(manifest.readme ?? []).map((e) => e.base),
    ...(manifest.docs ?? []).map((e) => e.base),
  ]);
  for (const file of walkMd(source.dir)) {
    const rel = relative(source.dir, file).replace(/\\/g, '/');
    if (rel === 'manifest.json') continue;
    const base = rel.replace(/^pt-br\//i, '').replace(/\.md$/i, '').toLowerCase();
    if (!manifestBases.has(base)) {
      failures.push(`${rel}: órfão — no disco mas ausente no manifest.json`);
    }
  }

  return { pages, failures };
}

function emitGenerated(pages, capturedAt) {
  // Ordem SEMÂNTICA do manifest (sequência de leitura) — não alfabética.
  const tocByLocale = { en: [], 'pt-BR': [] };
  for (const locale of Object.keys(tocByLocale)) {
    const groups = new Map();
    for (const page of pages.filter((p) => p.locale === locale)) {
      if (!groups.has(page.group)) groups.set(page.group, []);
      groups.get(page.group).push({ slug: page.slug, title: page.title });
    }
    tocByLocale[locale] = Array.from(groups, ([group, items]) => ({ group, items }));
  }

  // RN-011/RN-017 — conteúdo FORA do bundle: um JSON por página em
  // public/docs-html/<locale>/<base>.json (servido estático; o cliente faz
  // fetch e o prerender lê do disco — app.config.server).
  const htmlRoot = 'public/docs-html';
  rmSync(htmlRoot, { recursive: true, force: true });
  for (const page of pages) {
    const dir = join(htmlRoot, page.locale === 'pt-BR' ? 'pt-BR' : 'en');
    const outFile = join(dir, `${page.base}.json`);
    mkdirSync(join(outFile, '..'), { recursive: true });
    writeFileSync(
      outFile,
      JSON.stringify({ title: page.title, html: page.html, sourcePath: page.sourcePath }),
      'utf8',
    );
  }

  const ts = `// GENERATED by tools/build-docs.mjs (RN-007 pipeline + RN-011 locales) — do not edit.
// Regenerated on every build; the truth is the .md in docs-content/cli/ (RN-008).
// Metadados APENAS — o conteúdo vive em public/docs-html/<locale>/<base>.json
// (fetch no cliente, fs no prerender) para o bundle inicial continuar leve
// (gate Lighthouse mobile >= 90 — RN-017).
// RN-011: locale por página; páginas pt-BR com translated:false são shadow
// (conteúdo EN + banner de não traduzida — RN-011-4).
// Ordem SEMÂNTICA do manifest (sequência de leitura) — GENERATED_ORDER alimenta
// prev/next (estilo VitePress).
export interface GeneratedDocPage {
  slug: string;
  base: string;
  locale: 'en' | 'pt-BR';
  lang: string;
  group: string;
  title: string;
  translated: boolean;
  sourcePath: string;
}
export interface GeneratedTocLocale {
  locale: 'en' | 'pt-BR';
  groups: readonly { group: string; items: readonly { slug: string; title: string }[] }[];
}
export const GENERATED_DOCS: readonly GeneratedDocPage[] = ${JSON.stringify(
    pages.map(({ slug, base, locale, lang, group, title, translated, sourcePath }) => ({
      slug,
      base,
      locale,
      lang,
      group,
      title,
      translated,
      sourcePath,
    })),
    null,
    2,
  )};
export const GENERATED_ORDER: Record<'en' | 'pt-BR', readonly string[]> = ${JSON.stringify(
    {
      en: pages.filter((p) => p.locale === 'en').map((p) => p.slug),
      'pt-BR': pages.filter((p) => p.locale === 'pt-BR').map((p) => p.slug),
    },
    null,
    2,
  )};
export const GENERATED_TOC: readonly GeneratedTocLocale[] = ${JSON.stringify(
    Object.entries(tocByLocale).map(([locale, groups]) => ({ locale, groups })),
    null,
    2,
  )};
export const CAPTURED_AT = ${JSON.stringify(capturedAt ?? null)};
`;
  writeFileSync(OUT_TS, ts);
  writeFileSync(
    OUT_SEARCH,
    JSON.stringify(
      pages.map(({ slug, title, text, locale }) => ({ slug, title, text, locale })),
      null,
      2,
    ),
  );
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) {
  const { pages, failures } = ingest();
  if (failures.length > 0) {
    console.error(`build-docs: ${failures.length} violação(ões) strict:`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exit(1);
  }
  const capturedAt = JSON.parse(readFileSync(join('docs-content/cli', 'manifest.json'), 'utf8')).capturedAt ?? null;
  emitGenerated(pages, capturedAt);
  console.log(`build-docs: ${pages.length} página(s) gerada(s) — strict ok.`);
}
