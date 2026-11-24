// RN-007-8/9 — fonte das docs do portal = repositório PÚBLICO golmet-cli
// (raw na main + GitHub Releases API + git trees).
//
// Gera em docs-content/cli/:
//   releases.md                 — notas das GitHub Releases (aba "Releases"; EN)
//   <base>.md                   — README.md EN dividido por H2 (fonte, RN-013)
//   pt-br/<base>.md             — README.pt-br.md dividido por H2 (derivado)
//   <subpath>.md                — árvore docs/**.md do repo (FORMAT, concepts/,
//                                 getting-started, reference, design, patterns,
//                                 migration, recommended) — EN é a fonte
//                                 técnica (ADR-009/RN-013)
//   pt-br/<subpath>.md          — variante PT da árvore (pareada por sufixo
//                                 .pt-br.md — convenção do repo do kit)
//   manifest.json               — pares EN↔PT + grupo da sidebar por página
//
// Links entre markdowns são REESCRITOS para rotas do portal (resolver
// relativo por arquivo); links para assets inexistentes fora do repo são
// removidos. Strict: qualquer fonte sem resposta = exit 1, nada publica.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, posix } from 'node:path';

const RAW = 'https://raw.githubusercontent.com/Golmet/golmet-cli/main';
const TREE_API = 'https://api.github.com/repos/Golmet/golmet-cli/git/trees/main?recursive=1';
const RELEASES_API = 'https://api.github.com/repos/Golmet/golmet-cli/releases?per_page=10';
const OUT_DIR = 'docs-content/cli';
const PT_DIR = join(OUT_DIR, 'pt-br');

// RN-007-8/9 — GITHUB_TOKEN (quando presente no CI) autentica a API GitHub:
// rate limit 1.000/h vs 60/h anônimo (runners compartilham IP).
const githubHeaders = {
  'User-Agent': 'golmet-site-build',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const get = async (url) => {
  const isGithubApi = url.startsWith('https://api.github.com/');
  const res = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: isGithubApi ? githubHeaders : undefined,
  });
  if (!res.ok) throw new Error(`${url} respondeu HTTP ${res.status} — build estrito: nada publica`);
  return res.text();
};

// Divide o README por H2 FORA de code fences — cada seção vira página da
// sidebar com H1 próprio (RN-008). Pré-ambulo é descartado: o título vem do
// H1 da página e o seletor de idioma vive no header (RN-011-3).
function splitByH2(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = null;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) {
      current?.lines.push(line);
      continue;
    }
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      current = { title: h2[1].trim(), lines: [] };
      sections.push(current);
      continue;
    }
    current?.lines.push(line);
  }
  return sections;
}

const slugOf = (title) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Grupo da sidebar pelo primeiro segmento do caminho na árvore docs/. */
const groupOf = (subpath) => {
  const first = subpath.includes('/') ? subpath.split('/')[0] : '';
  const groups = {
    concepts: 'Concepts',
    'getting-started': 'Getting started',
    reference: 'Reference',
    design: 'Design',
    patterns: 'Patterns',
  };
  return groups[first] ?? 'Guide';
};

// Limpa antes: seções/arquivos que sumiram do repo não podem ficar órfãos.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(PT_DIR, { recursive: true });

// ── 1) Árvore docs/**.md do repo ────────────────────────────────
const treeRaw = await get(TREE_API);
const tree = JSON.parse(treeRaw).tree ?? [];
const docsFiles = tree
  .map((entry) => entry.path)
  .filter((path) => path.startsWith('docs/') && path.endsWith('.md'));
if (docsFiles.length === 0) throw new Error('árvore sem docs/**.md — nada publica');

// Pares EN↔PT: X.md ↔ X.pt-br.md (convenção do repo do kit).
const enFiles = docsFiles.filter((path) => !path.endsWith('.pt-br.md'));
const pairs = enFiles.map((enPath) => {
  const subpath = enPath.replace(/^docs\//, '');
  const ptPath = `docs/${subpath.replace(/\.md$/i, '.pt-br.md')}`;
  return { subpath, enPath, ptPath, hasPt: docsFiles.includes(ptPath) };
});

// Bases existentes (para o resolver de links): 'concepts/overview', 'FORMAT'…
const baseSet = new Set(pairs.map((pair) => pair.subpath.replace(/\.md$/i, '').toLowerCase()));
const sortedBases = [...baseSet].sort();

// RN-011 âncoras — índice de headings (H2/H3 fora de fences) por página:
// base → [{ slug (GFM, igual ao gerado pelo build-docs), num ('9', '10.1') }].
// Links do kit com §N no TEXTO e sem fragmento no target (ex.: '[FORMAT §9]'
// → FORMAT.md) resolvem a âncora pelo número da seção.
const headingIndex = { en: new Map(), pt: new Map() };
const gfmSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

function recordHeadings(lang, base, md) {
  let inFence = false;
  const list = [];
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const heading = /^#{2,3}\s+(.+)$/.exec(line);
    if (!heading) continue;
    const text = heading[1].trim();
    const num = /^(\d+(?:\.\d+)*)/.exec(text);
    list.push({ slug: gfmSlug(text), num: num ? num[1] : null });
  }
  headingIndex[lang].set(base, list);
}

const stripFragment = (target) => target.split('#')[0];

/**
 * Resolve um target relativo/absoluto do repo para a rota do portal.
 * Candidatos: caminho relativo normalizado, caminho root-relativo com e sem
 * o prefixo docs/, e fallback pelo segmento final (leaf único na árvore).
 * Retorna null quando não resolve (link externo/âncora — fica como está).
 */
function resolveMdTarget(rawTarget, relSubpath) {
  const target = stripFragment(rawTarget);
  if (!target || /^(https?:|\/|#|mailto:)/i.test(target)) return null;
  const isPt = /\.pt-br\.md$/i.test(target);
  const withoutPt = target.replace(/\.pt-br\.md$/i, '.md');
  const dir = relSubpath.includes('/') ? relSubpath.slice(0, relSubpath.lastIndexOf('/')) : '';
  const candidates = [
    posix.normalize(posix.join(dir, withoutPt)),
    posix.normalize(withoutPt.replace(/^docs\//, '')),
    posix.normalize(withoutPt),
  ].map((candidate) => candidate.replace(/\.md$/i, '').toLowerCase());

  // Leaf do PRIMEIRO candidato (o pop do último segmento funciona mesmo com
  // '..' no meio do caminho — '../docs/FORMAT.md' → leaf 'format').
  const leaf = (candidates[0] ?? '').split('/').pop();
  if (leaf && baseSet.has(leaf)) {
    return isPt ? `/docs/pt-br/${leaf}` : `/docs/${leaf}`;
  }

  const inside = candidates.filter((candidate) => candidate && !candidate.startsWith('..'));
  if (inside.length === 1 && baseSet.has(inside[0])) {
    const base = inside[0];
    return isPt ? `/docs/pt-br/${base}` : `/docs/${base}`;
  }
  const leafMatches =
    leaf && !leaf.startsWith('..') ? sortedBases.filter((base) => base.endsWith(`/${leaf}`)) : [];
  if (leafMatches.length === 1) {
    const base = leafMatches[0];
    return isPt ? `/docs/pt-br/${base}` : `/docs/${base}`;
  }

  // Target que ESCAPA da árvore docs/ (ex.: ../../evals/x.md) → blob no repo.
  const repoPath = posix.normalize(posix.join('docs', dir, withoutPt));
  if (!repoPath.startsWith('..')) {
    return `https://github.com/Golmet/golmet-cli/blob/main/${repoPath}`;
  }
  return null;
}

/** Diretório da árvore (ex.: 'docs/concepts/') → primeira página do grupo. */
function resolveDirTarget(rawTarget) {
  const target = stripFragment(rawTarget).replace(/\/+$/, '');
  if (!target || /^(https?:|\/|#|mailto:)/i.test(target)) return null;
  const prefix = target.replace(/^docs\//, '').toLowerCase();
  if (!prefix) return null;
  const child = sortedBases.find((base) => base.startsWith(`${prefix}/`));
  return child ? `/docs/${child}` : null;
}

/** Arquivos da raiz do repo FORA da árvore docs/ → blob no GitHub (PT incluso). */
const repoRootBlobs = /^(ROADMAP|CONTRIBUTING)(\.pt-br)?\.md$/i;

/**
 * Reescreve links entre markdowns para rotas do portal (não é edição de
 * evidência — é a conexão do grafo de docs no contexto do site).
 * Aplica a markdown links ](target), html href="target" e diretórios.
 * RN-011 âncoras — o kit escreve "[FORMAT §9](FORMAT.md)" SEM fragmento:
 * quando o texto cita §N, resolve a âncora no heading numerado do alvo
 * (índice headingIndex; GFM slug igual ao gerado pelo build-docs).
 */
function rewriteLinks(md, relSubpath, lang) {
  const sourceLocale = lang === 'pt-BR' ? 'pt' : 'en';
  // Âncoras (fragmento após #) são PRESERVADAS na rota resolvida — o HTML
  // renderizado ganha ids GFM nos headings (build-docs) para o scroll funcionar.
  // Os branches testam o CLEAN (sem fragmento) — targets com # não terminam
  // em .md e cairiam fora de todas as regras.
  const fragmentOf = (target) => {
    const hash = target.split('#').slice(1).join('#');
    return hash ? `#${hash}` : '';
  };

  /** Âncora por §N do texto: heading do alvo cujo número casa (9, 9.1…). */
  const anchorFromText = (linkText, targetBase) => {
    const section = /§(\d+(?:\.\d+)*)/.exec(linkText ?? '');
    if (!section || !targetBase) return '';
    const headings = headingIndex[sourceLocale].get(targetBase) ?? headingIndex.en.get(targetBase) ?? [];
    const num = section[1];
    const match =
      headings.find((heading) => heading.num === num) ??
      headings.find((heading) => heading.num?.startsWith(`${num}.`));
    return match ? `#${match.slug}` : '';
  };

  let out = md.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, linkText, target) => {
    const fragment = fragmentOf(target);
    const clean = stripFragment(target);
    const applyFragment = (route) =>
      route +
      (fragment ||
        anchorFromText(linkText, route.replace('/docs/pt-br/', '').replace('/docs/', '')));
    if (/CHANGELOG\.md$/i.test(clean)) return `[${linkText}](/docs/releases${fragment})`;
    if (repoRootBlobs.test(clean)) {
      return `[${linkText}](https://github.com/Golmet/golmet-cli/blob/main/${clean}${fragment})`;
    }
    if (/\.md$/i.test(clean)) {
      const resolved = resolveMdTarget(clean, relSubpath);
      if (!resolved) return match;
      const targetBase = resolved
        .replace('/docs/pt-br/', '')
        .replace('/docs/', '');
      return `[${linkText}](${applyFragment(resolved, targetBase)})`;
    }
    if (/^(docs\/)?[a-z0-9-]+\/?$/i.test(clean)) {
      const resolved = resolveDirTarget(clean);
      return resolved ? `[${linkText}](${applyFragment(resolved)})` : match;
    }
    return match;
  });
  out = out.replace(/href="([^"\s]+)"[^>]*>?/gi, (match, target) => {
    const fragment = fragmentOf(target);
    const clean = stripFragment(target);
    if (/CHANGELOG\.md$/i.test(clean)) return `href="/docs/releases${fragment}"`;
    if (repoRootBlobs.test(clean)) {
      return `href="https://github.com/Golmet/golmet-cli/blob/main/${clean}${fragment}"`;
    }
    if (/\.md$/i.test(clean)) {
      const resolved = resolveMdTarget(clean, relSubpath);
      return resolved ? `href="${resolved}${fragment}"` : match;
    }
    if (/^(docs\/)?[a-z0-9-]+\/?$/i.test(clean)) {
      const resolved = resolveDirTarget(clean);
      return resolved ? `href="${resolved}${fragment}"` : match;
    }
    return match;
  });
  out = out.replace(/href="LICENSE"/gi, 'href="https://github.com/Golmet/golmet-cli/blob/main/LICENSE"');
  return out;
}

// ── 2) Baixa a árvore docs/ (EN + PT) com links resolvidos ─────
const docsManifest = [];
for (const pair of pairs) {
  const group = groupOf(pair.subpath);
  const base = pair.subpath.replace(/\.md$/i, '').toLowerCase();
  let enMd = rewriteLinks(await get(`${RAW}/${pair.enPath}`), pair.subpath, 'en');
  const h1Count = (text) => (text.replace(/```[\s\S]*?```/g, ' ').match(/^#\s+.+$/gm) ?? []).length;
  if (h1Count(enMd) === 0) {
    const humanized = base
      .slice(base.lastIndexOf('/') + 1)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    enMd = `# ${humanized}\n\n${enMd}`;
  }
  recordHeadings('en', base, enMd);
  const enOut = join(OUT_DIR, `${base}.md`);
  mkdirSync(join(enOut, '..'), { recursive: true });
  writeFileSync(enOut, enMd, 'utf8');

  let hasPt = false;
  if (pair.hasPt) {
    const ptRel = `pt-br/${base}.md`;
    let ptMd = rewriteLinks(await get(`${RAW}/${pair.ptPath}`), pair.subpath.replace(/\.md$/i, '.pt-br.md'), 'pt-BR');
    if (h1Count(ptMd) === 0) {
      const humanized = base
        .slice(base.lastIndexOf('/') + 1)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      ptMd = `# ${humanized}\n\n${ptMd}`;
    }
    recordHeadings('pt', base, ptMd);
    const ptOut = join(PT_DIR, `${base}.md`);
    mkdirSync(join(ptOut, '..'), { recursive: true });
    writeFileSync(ptOut, ptMd, 'utf8');
    hasPt = true;
  }
  docsManifest.push({ base, hasPt, group });
}

// ── 3) READMEs EN/PT divididos por H2 (pareados por índice) ────
const sectionsEn = splitByH2(await get(`${RAW}/README.md`));
const sectionsPt = splitByH2(await get(`${RAW}/README.pt-br.md`));
if (sectionsEn.length !== sectionsPt.length) {
  rmSync(OUT_DIR, { recursive: true, force: true });
  throw new Error(
    `READMEs inconsistentes: EN tem ${sectionsEn.length} seções H2, PT-BR tem ${sectionsPt.length} — nada publica`,
  );
}

const readmeManifest = [];
sectionsEn.forEach((sectionEn, i) => {
  const base = slugOf(sectionEn.title);
  const bodyEn = sectionEn.lines.join('\n').trim();
  const sectionPt = sectionsPt[i];
  const bodyPt = sectionPt.lines.join('\n').trim();
  if (bodyEn.length < 40) return; // seção mínima — vira ruído de sidebar
  // As seções do README linkam a árvore docs/ — mesmas reescritas das páginas
  // da árvore (relSubpath = raiz de docs/, onde o README vive).
  const enFile = rewriteLinks(`# ${sectionEn.title}\n\n${bodyEn}\n`, base, 'en');
  writeFileSync(join(OUT_DIR, `${base}.md`), enFile, 'utf8');
  const hasPt = bodyPt.length >= 40;
  if (hasPt) {
    const ptFile = rewriteLinks(`# ${sectionPt.title}\n\n${bodyPt}\n`, base, 'pt-BR');
    writeFileSync(join(PT_DIR, `${base}.md`), ptFile, 'utf8');
  }
  readmeManifest.push({ base, hasPt, group: 'CLI' });
});

// ── 4) Releases — notas das GitHub Releases (aba Releases) ────
const releasesRaw = await get(RELEASES_API);
const releases = JSON.parse(releasesRaw);
if (!Array.isArray(releases) || releases.length === 0) {
  throw new Error('GitHub Releases vazio — nada publica');
}
const dateOf = (iso) => (iso ?? '').slice(0, 10).split('-').reverse().join('/');
const releasesMd = releases
  .map((r) => {
    // git-cliff embute heading próprio com a tag ("## [1.7.4] - data", SEM o
    // prefixo v do tag_name) — o heading meu já cobre; soltar qualquer heading
    // que cite o número da versão.
    const tagNum = r.tag_name.replace(/^v/, '');
    const body = (r.body ?? '')
      .split('\n')
      .filter((line) => !(/^\s*#{2,4}\s/.test(line) && line.includes(`[${tagNum}]`)))
      .join('\n')
      .trim();
    return `## ${r.tag_name} — ${dateOf(r.published_at)}\n\n${body}`;
  })
  .join('\n\n');
writeFileSync(join(OUT_DIR, 'releases.md'), `# Releases\n\n${releasesMd}\n`, 'utf8');

// ── 5) manifest ────────────────────────────────────────────────
writeFileSync(
  join(OUT_DIR, 'manifest.json'),
  JSON.stringify(
    {
      releases: { hasPt: false, group: 'CLI' },
      readme: readmeManifest,
      docs: docsManifest,
    },
    null,
    2,
  ),
  'utf8',
);

const written = readdirSync(OUT_DIR, { recursive: true }).filter((f) => String(f).endsWith('.md'));
console.log(`cli-docs: ${written.length} arquivo(s) da doc do CLI gerados (EN/PT pareados + releases).`);
