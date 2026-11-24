// CR-005/CR-006 — bloco de terminal com SAÍDA REAL do kit v1.7.4 (capturada
// em 24/11/2026: `npm i -g`, `golmet --version`, `golmet init --plain` em
// workspace novo, `golmet status` e `golmet validate` num workspace com
// violação H1). A marca cita evidência — o terminal mostra o comportamento
// verdadeiro, não texto inventado. A versão NÃO vem daqui (evidência é
// congelada na captura): a versão exibida no site vem do registry npm
// via tools/fetch-cli-version.mjs.
import { Component } from '@angular/core';

interface TermLine {
  readonly kind: 'prompt' | 'output' | 'success' | 'error' | 'fix' | 'blank';
  readonly text: string;
}

const LINES: readonly TermLine[] = [
  { kind: 'prompt', text: '$ npm i -g golmet-cli' },
  { kind: 'output', text: 'added 2 packages in 489ms' },
  { kind: 'prompt', text: '$ golmet --version' },
  { kind: 'output', text: 'golmet version v1.7.4' },
  { kind: 'blank', text: '' },
  { kind: 'prompt', text: '$ golmet init demo-produto --plain' },
  { kind: 'output', text: '  criou: golmet.yaml' },
  { kind: 'output', text: '  criou: PROJECT_CHARTER.md' },
  { kind: 'output', text: '  criou: REQUIREMENTS.md' },
  { kind: 'output', text: '  criou: CHANGE_REQUESTS.md' },
  { kind: 'output', text: '  criou: DECISIONS.md' },
  { kind: 'output', text: '  criou: reverse/CANDIDATES.md' },
  { kind: 'output', text: '  criou: specs/README.md' },
  { kind: 'output', text: '  criou: .golmet/manifest.json' },
  { kind: 'output', text: '  criou: golmet.index.json' },
  {
    kind: 'success',
    text:
      'workspace demo-produto inicializado em C:\\Users\\victo\\Desktop\\Empresas\\TechMinds\\golmet-site\\demo-produto' +
      ' — 9 criado(s), 0 pulado(s)',
  },
  { kind: 'blank', text: '' },
  { kind: 'prompt', text: '$ golmet status' },
  { kind: 'output', text: 'workspace: demo-produto — format: 1' },
  { kind: 'blank', text: '' },
  { kind: 'output', text: 'RN 0' },
  { kind: 'output', text: 'PEND 0' },
  { kind: 'output', text: 'CR 0' },
  { kind: 'output', text: 'ADR 0' },
  { kind: 'output', text: 'CAND 0' },
  { kind: 'output', text: 'Feature 0' },
  { kind: 'output', text: 'Task 0' },
  { kind: 'output', text: 'Spec 0' },
  { kind: 'blank', text: '' },
  { kind: 'prompt', text: '$ golmet validate' },
  {
    kind: 'error',
    text:
      '[delivery/2026-11/RN-100 — Pagamentos — Feature.md:3] Feature PEND-001 [H1]' +
      ' Feature ancorada em PEND — PEND nunca ancora Feature',
  },
  { kind: 'fix', text: '  fix: troque anchor para a RN que formalizou a pendência (ex.: anchor: RN-NNN)' },
  {
    kind: 'error',
    text:
      '[delivery/2026-11/RN-100 — Pagamentos — Feature.md:3] PEND PEND-001 [H10]' +
      ' referência quebrada — PEND-001 não existe no workspace',
  },
  { kind: 'fix', text: '  fix: crie a entidade citada ou corrija o ID' },
  {
    kind: 'error',
    text:
      '2 erro(s), 0 aviso(s) — 7 arquivo(s), RN 0, PEND 0, CR 0, ADR 0, CAND 0,' +
      ' Feature 1, Task 0, Spec 0',
  },
];

@Component({
  selector: 'app-terminal',
  styleUrl: './terminal.scss',
  templateUrl: './terminal.html',
})
export class Terminal {
  protected readonly lines = LINES;
}
