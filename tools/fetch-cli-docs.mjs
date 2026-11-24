// RN-011-1/5 (ADR-009) — fonte das docs do portal = repositório PÚBLICO
// Golmet/golmet-cli (raw na main + GitHub Releases API).
//
// Gera em docs-content/cli/:
//   releases.md            — notas das GitHub Releases (aba "Releases"; EN,
//                            CHANGELOG não tem variante PT)
//   <base>.md              — README.md EN dividido por H2 (fonte, RN-013)
//   pt-br/<base>.md        — README.pt-br.md dividido por H2 (derivado)
//   manifest.json          — pares EN↔PT por base slug + flags de tradução
//
// Os READMEs EN/PT têm a MESMA sequência de H2 — o pareamento para a sidebar
// é por ÍNDICE; contagens divergentes = fonte inconsistente = exit 1.
// Strict: qualquer fonte sem resposta = exit 1, nada publica.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAW = 'https://raw.githubusercontent.com/Golmet/golmet-cli/main';
const RELEASES_API = 'https://api.github.com/repos/Golmet/golmet-cli/releases?per_page=10';
const OUT_DIR = 'docs-content/cli';
const PT_DIR = join(OUT_DIR, 'pt-br');

// RN-007-8/9 — GITHUB_TOKEN (quando presente no CI) autentica a API de
// Releases: rate limit 1.000/h vs 60/h anônimo (runners compartilham IP).
const githubHeaders = {
  'User-Agent': 'golmet-site-build',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const get = async (url) => {
  const isGithubApi = url.startsWith('https://api.github.com/');
  const res = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: isGithubApi ? githubHeaders : undefined,
  });
  if (!res.ok) throw new Error(`${url} respondeu HTTP ${res.status} — build estrito: nada publica`);
  return res.text();
};

// Divide o README por H2 FORA de code fences — cada seção vira página da
// sidebar com H1 próprio (RN-008). Pré-ambulo (antes do 1º H2) é descartado:
// título vem do H1 da página e o seletor de idioma vive no header (RN-011-3).
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

// Limpa antes: seções que sumiram do README não podem ficar órfãs na sidebar.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(PT_DIR, { recursive: true });

// 1) Releases — somente as notas das GitHub Releases (pedido do operador).
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

// 2) READMEs EN/PT divididos e pareados por índice (fonte consistente).
const sectionsEn = splitByH2(await get(`${RAW}/README.md`));
const sectionsPt = splitByH2(await get(`${RAW}/README.pt-br.md`));
if (sectionsEn.length !== sectionsPt.length) {
  rmSync(OUT_DIR, { recursive: true, force: true });
  throw new Error(
    `READMEs inconsistentes: EN tem ${sectionsEn.length} seções H2, PT-BR tem ${sectionsPt.length} — nada publica`,
  );
}

const manifest = [];
sectionsEn.forEach((sectionEn, i) => {
  const base = slugOf(sectionEn.title);
  const bodyEn = sectionEn.lines.join('\n').trim();
  const sectionPt = sectionsPt[i];
  const bodyPt = sectionPt.lines.join('\n').trim();
  if (bodyEn.length < 40) return; // seção mínima — vira ruído de sidebar
  writeFileSync(join(OUT_DIR, `${base}.md`), `# ${sectionEn.title}\n\n${bodyEn}\n`, 'utf8');
  const hasPt = bodyPt.length >= 40;
  if (hasPt) {
    writeFileSync(join(PT_DIR, `${base}.md`), `# ${sectionPt.title}\n\n${bodyPt}\n`, 'utf8');
  }
  manifest.push({ base, hasPt });
});

// Releases não tem variante PT (CHANGELOG do kit é EN) — fallback cobre.
writeFileSync(
  join(OUT_DIR, 'manifest.json'),
  JSON.stringify({ releases: { hasPt: false }, sections: manifest }, null, 2),
  'utf8',
);

const written = readdirSync(OUT_DIR, { recursive: true }).filter((f) => String(f).endsWith('.md'));
console.log(`cli-docs: ${written.length} arquivo(s) da doc do CLI gerados (EN/PT pareados + releases).`);
