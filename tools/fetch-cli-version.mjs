// Busca a versão PUBLICADA do golmet-cli no registry npm e gera
// src/app/shared/cli-version.generated.ts — fonte única da versão
// exibida no site (badge do quickstart, notas e pré-lançamento).
// Strict: o guardião não publica o que não verifica — se o registry
// não responder ou responder maluado, o build falha.

import { writeFile } from 'node:fs/promises';

const REGISTRY = 'https://registry.npmjs.org/golmet-cli/latest';
const OUT = new URL('../src/app/shared/cli-version.generated.ts', import.meta.url);

const res = await fetch(REGISTRY, { signal: AbortSignal.timeout(10000) });
if (!res.ok) {
  throw new Error(`registry npm respondeu HTTP ${res.status} — build estrito: site não publica versão não verificada`);
}

const pkg = await res.json();
const version = pkg?.version;
if (typeof version !== 'string' || !/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error(`versão inválida no registry npm: ${JSON.stringify(version)}`);
}

const content =
  '// GERADO por tools/fetch-cli-version.mjs - nao editar.\n' +
  `// Versao publicada do golmet-cli no registry npm (capturada em ${new Date().toISOString().slice(0, 10)}).\n` +
  `export const CLI_VERSION = '${version}';\n`;

await writeFile(OUT, content, 'utf8');
console.log(`cli-version: v${version} capturada do registry npm`);
