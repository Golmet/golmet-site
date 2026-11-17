import { Component, signal } from '@angular/core';

import { CAPABILITIES } from './capabilities.data';
import { COPY } from '../shared/copy/copy';

// RN-001 — landing promocional: hero + quickstart (RN-001-1), escolha seu
// caminho (RN-001-2), capacidades (RN-001-3) e CTAs (RN-001-4).
// Copy vem do deck único (RN-014-3); asset do Arki da RN-014-2.
@Component({
  imports: [],
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly copy = COPY.landing.hero;
  protected readonly quickstart = COPY.landing.quickstart;
  protected readonly paths = COPY.landing.paths;
  protected readonly capabilitiesCopy = COPY.landing.capabilities;
  protected readonly ctas = COPY.landing.ctas;
  protected readonly capabilities = CAPABILITIES;

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
