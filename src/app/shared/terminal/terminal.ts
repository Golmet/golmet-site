// CR-005/CR-006 — terminal INTERATIVO com SAÍDA REAL do kit v1.7.4 (capturada
// em 24/11/2026: `npm i -g`, `golmet --version`, `golmet init --plain` em
// workspace novo, `golmet status` e `golmet validate` num workspace com
// violação H1). A marca cita evidência — o terminal mostra o comportamento
// verdadeiro, não texto inventado. Conceito "mostra, não conta": o visitante
// clica nos comandos e revela a saída real passo a passo. O nome do workspace
// de exemplo foi renomeado para `nome-produto` a pedido do operador (o
// comportamento exibido permanece o da captura). A versão exibida no site
// vem do registry npm via tools/fetch-cli-version.mjs.
//
// Interação 100% MANUAL (decisão do operador 27/11/2026): o terminal nasce
// VAZIO (só o placeholder) e o visitante inicia com o 1º clique — cada comando
// executado libera o próximo; ↺ reseta para o vazio. Estados intermediários
// (auto-demo, saída completa no carregamento) chegaram a existir e foram
// revertidos a pedido do operador.
import { Component, computed, signal } from '@angular/core';

interface TermLine {
  readonly kind: 'prompt' | 'output' | 'success' | 'error' | 'fix' | 'blank';
  readonly text: string;
}

interface TermStep {
  /** comando exibido no botão (código, não copy) */
  readonly command: string;
  readonly lines: readonly TermLine[];
}

// Grupos EXATAMENTE na ordem capturada — nenhuma linha alterada.
const STEPS: readonly TermStep[] = [
  {
    command: 'npm i -g golmet-cli',
    lines: [
      { kind: 'prompt', text: '$ npm i -g golmet-cli' },
      { kind: 'output', text: 'added 2 packages in 489ms' },
      { kind: 'prompt', text: '$ golmet --version' },
      { kind: 'output', text: 'golmet version v1.7.4' },
      { kind: 'blank', text: '' },
    ],
  },
  {
    command: 'golmet init nome-produto',
    lines: [
      { kind: 'prompt', text: '$ golmet init nome-produto --plain' },
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
          'workspace nome-produto inicializado em C:\\Users\\victo\\Desktop\\Empresas\\TechMinds\\golmet-site\\nome-produto' +
          ' — 9 criado(s), 0 pulado(s)',
      },
      { kind: 'blank', text: '' },
    ],
  },
  {
    command: 'golmet status',
    lines: [
      { kind: 'prompt', text: '$ golmet status' },
      { kind: 'output', text: 'workspace: nome-produto — format: 1' },
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
    ],
  },
  {
    command: 'golmet validate',
    lines: [
      { kind: 'prompt', text: '$ golmet validate' },
      {
        kind: 'error',
        text:
          '[delivery/2026-11/RN-100 — Pagamentos — Feature.md:3] Feature PEND-001 [H1]' +
          ' Feature ancorada em PEND — PEND nunca ancora Feature',
      },
      {
        kind: 'fix',
        text: '  fix: troque anchor para a RN que formalizou a pendência (ex.: anchor: RN-NNN)',
      },
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
    ],
  },
];

@Component({
  selector: 'app-terminal',
  styleUrl: './terminal.scss',
  templateUrl: './terminal.html',
})
export class Terminal {
  protected readonly steps = STEPS;

  /** passos já revelados, em ordem — 0 = terminal vazio aguardando o 1º clique */
  protected readonly revealed = signal(0);

  /** linhas visíveis = concatenação dos passos revelados (saída real, na ordem) */
  protected readonly visibleLines = computed(() =>
    STEPS.slice(0, this.revealed()).flatMap((step) => step.lines),
  );

  /** executa só o próximo comando — a sequência é a da captura real */
  protected runStep(index: number): void {
    if (index === this.revealed()) {
      this.revealed.set(index + 1);
    }
  }

  protected reset(): void {
    this.revealed.set(0);
  }
}
