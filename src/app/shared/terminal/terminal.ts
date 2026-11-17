// CR-005 — bloco de terminal com SAÍDA REAL do kit (capturada em 17/11/2026:
// `golmet init` em workspace novo, `golmet status` e `golmet validate` num
// workspace com violação H1). A marca cita evidência — o terminal mostra o
// comportamento verdadeiro, não texto inventado.
import { Component } from '@angular/core';

interface TermLine {
  readonly kind: 'prompt' | 'output' | 'success' | 'error' | 'fix' | 'blank';
  readonly text: string;
}

const LINES: readonly TermLine[] = [
  { kind: 'prompt', text: '$ npm i -g golmet-cli' },
  { kind: 'prompt', text: '$ golmet init meu-produto' },
  { kind: 'output', text: '  criou: golmet.yaml · PROJECT_CHARTER.md · REQUIREMENTS.md' },
  { kind: 'output', text: '  criou: DECISIONS.md · reverse/CANDIDATES.md · specs/ · .golmet/' },
  { kind: 'success', text: 'workspace meu-produto inicializado — 9 criado(s), 0 pulado(s)' },
  { kind: 'blank', text: '' },
  { kind: 'prompt', text: '$ golmet status' },
  { kind: 'output', text: 'RN 22 (active 7, draft 15) · PEND 2 (resolved 2)' },
  { kind: 'output', text: 'Feature 6 (done 1, draft 5) · Task 35 (done 13, todo 22)' },
  { kind: 'blank', text: '' },
  { kind: 'prompt', text: '$ golmet validate' },
  { kind: 'error', text: '[RN-100 — Pagamentos — Feature.md:3] Feature PEND-001 [H1] Feature ancorada em PEND' },
  { kind: 'fix', text: '  fix: troque anchor para a RN que formalizou a pendência (ex.: anchor: RN-NNN)' },
  { kind: 'error', text: '1 erro(s), 0 aviso(s) — o guardião bloqueou a publicação' },
];

@Component({
  selector: 'app-terminal',
  styleUrl: './terminal.scss',
  templateUrl: './terminal.html',
})
export class Terminal {
  protected readonly lines = LINES;
}
