// RN-007-8/9 — fonte das docs do portal = repositório PÚBLICO golmet-cli.
// O repo abriu (private: false) — o padrão CR-002 do tarball foi substituído
// pela fonte canônica: raw.githubusercontent na main + GitHub Releases API.
//
// Gera em docs-content/cli/:
//   releases.md                — notas das GitHub Releases (a "aba Releases")
//   <section>.md               — README.md EN dividido por H2 (sidebar estruturada)
//   <section>.pt-br.md         — README.pt-br.md dividido por H2 (lang pt-br)
//
// Strict: qualquer fonte sem resposta = exit 1, nada publica.
// Pré-ambulo do README (H1, badges, language links) é descartado — o título
// vem do H1 de cada página e a troca de idioma vive nos grupos da sidebar.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAW = 'https://raw.githubusercontent.com/Golmet/golmet-cli/main';
const RELEASES_API = 'https://api.github.com/repos/Golmet/golmet-cli/releases?per_page=10';
const OUT_DIR = 'docs-content/cli';

const get = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} respondeu HTTP ${res.status} — build estrito: nada publica`);
  return res.text();
};

// Divide o README por H2 FORA de code fences — cada seção vira página da
// sidebar com H1 próprio (RN-008). Pré-ambulo (antes do 1º H2) é descartado.
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

// 1) Releases — somente o CHANGELOG/notas das releases (pedido do operador).
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

// 2) README EN + PT-BR divididos por H2.
for (const [file, lang] of [
  ['README.md', 'en'],
  ['README.pt-br.md', 'pt-br'],
]) {
  const md = await get(`${RAW}/${file}`);
  const sections = splitByH2(md);
  if (sections.length === 0) throw new Error(`${file} sem seções H2 — nada publica`);
  for (const section of sections) {
    const suffix = lang === 'pt-br' ? '.pt-br' : '';
    const name = `${slugOf(section.title)}${suffix}.md`;
    const body = section.lines.join('\n').trim();
    if (body.length < 40) continue; // seção mínima — vira ruído de sidebar
    writeFileSync(join(OUT_DIR, name), `# ${section.title}\n\n${body}\n`, 'utf8');
  }
}

const written = readdirSync(OUT_DIR);
console.log(`cli-docs: ${written.length} arquivo(s) da doc do CLI gerados — ${written.slice(0, 6).join(', ')}…`);
