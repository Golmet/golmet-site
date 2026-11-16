import { Component, signal } from '@angular/core';

import { COPY } from '../shared/copy/copy';

// RN-001-1 — primeira dobra: hero (Arki + proposta de valor) + quickstart
// narrado com comandos copiáveis (RN-001, RN-002; narrativa CR-003).
// Copy vem do deck único (RN-014-3); asset do Arki da RN-014-2.
@Component({
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly copy = COPY.landing.hero;
  protected readonly quickstart = COPY.landing.quickstart;

  /** título do passo copiado (feedback "Copiado") — null quando nenhum */
  protected readonly copiedStep = signal<string | null>(null);

  protected copyStep(step: { title: string; command?: string }): void {
    if (!step.command) return;
    // Falha silenciosa (mesmo espírito da RN-021): sem erro visível ao visitante
    navigator.clipboard
      ?.writeText(step.command)
      .then(() => {
        this.copiedStep.set(step.title);
        setTimeout(() => this.copiedStep.set(null), 1600);
      })
      .catch(() => {});
  }
}
