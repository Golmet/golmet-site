// RN-007-8/9 (padrão CR-002) — fonte das docs do CLI = release publicado.
// Enquanto o repo Golmet/golmet-cli é privado, a fonte do portal é o TARBALL
// da versão publicada no registry npm (a mesma que o usuário instala com
// `npm i -g golmet-cli`) — zero edição manual, coerente com o release vigente.
//
// Extrai README.md (EN — RN-013) e README.pt-br.md para docs-content/cli/,
// prefixando o H1 que o portal exige (RN-008: exatamente 1 H1 por página).
// Strict: registry sem resposta, tarball sem READMEs = exit 1, nada publica.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REGISTRY = 'https://registry.npmjs.org/golmet-cli/latest';
const OUT_DIR = 'docs-content/cli';
const MEMBERS = ['package/README.md', 'package/README.pt-br.md'];

const registry = await fetch(REGISTRY, { signal: AbortSignal.timeout(10000) });
if (!registry.ok) {
  throw new Error(`registry npm respondeu HTTP ${registry.status} — build estrito: nada publica`);
}
const meta = await registry.json();
const version = meta?.version;
if (typeof version !== 'string' || !/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error(`versão inválida no registry npm: ${JSON.stringify(version)}`);
}
const tarballUrl = meta?.dist?.tarball;
if (typeof tarballUrl !== 'string' || !tarballUrl.startsWith('https://')) {
  throw new Error(`tarball inválido no registry npm: ${JSON.stringify(tarballUrl)}`);
}

const tarballRes = await fetch(tarballUrl, { signal: AbortSignal.timeout(30000) });
if (!tarballRes.ok) throw new Error(`tarball respondeu HTTP ${tarballRes.status}`);

// Adaptação de renderização cross-repo (não é edição de evidência — o texto
// dos comandos/saídas permanece intocado):
//  - banner-golmet.png referencia asset do repo, não embarcado no tarball
//  - href entre READMEs vira rota do portal; LICENSE relativo vira o do site
function adaptForPortal(md) {
  return md
    .replace(/^[ \t]*<img src="banner-golmet\.png"[^\n]*>\r?\n?/m, '')
    .replace(/href="README\.pt-br\.md"/g, 'href="/docs/readme.pt-br"')
    .replace(/href="README\.md"/g, 'href="/docs/readme"')
    .replace(/href="LICENSE"/g, 'href="https://github.com/Golmet/golmet-site/blob/main/LICENSE"');
}
const tmp = mkdtempSync(join(tmpdir(), 'golmet-cli-docs-'));
const tgzPath = join(tmp, 'kit.tgz');
const extractDir = join(tmp, 'out');
writeFileSync(tgzPath, Buffer.from(await tarballRes.arrayBuffer()));
mkdirSync(extractDir, { recursive: true });

const tar = spawnSync('tar', ['-xzf', tgzPath, '-C', extractDir, ...MEMBERS], { stdio: 'pipe' });
if (tar.status !== 0) {
  const stderr = tar.stderr?.toString() ?? '';
  rmSync(tmp, { recursive: true, force: true });
  throw new Error(`tar falhou (status ${tar.status}): ${stderr.slice(0, 300)}`);
}

try {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const member of MEMBERS) {
    const extracted = join(extractDir, member);
    const md = adaptForPortal(readFileSync(extracted, 'utf8'));
    if (md.trim().length < 200) {
      throw new Error(`${member} vazio ou mínimo demais no tarball — nada publica`);
    }
    const h1 =
      member === 'package/README.pt-br.md'
        ? `# GOLMET CLI — release v${version} (PT-BR)`
        : `# GOLMET CLI — release v${version}`;
    const outName = member.replace('package/', '').toLowerCase();
    writeFileSync(join(OUT_DIR, outName), `${h1}\n\n${md}`, 'utf8');
  }
  const written = readdirSync(OUT_DIR);
  console.log(`cli-docs: READMEs do release v${version} extraídos — ${written.join(', ')}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
