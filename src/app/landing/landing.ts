import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Terminal } from '../shared/terminal/terminal';
import { COPY } from '../shared/copy/copy';

// RN-001 — landing promocional, estrutura narrativa (CR-004) + credibilidade
// de pré-lançamento (CR-005): hero + terminal real (dobra) → problema →
// tese → como funciona → engines → diferenciação → caminhos → capacidades
// em destaque → CTA final.
// Copy vem do deck único (RN-014-3); asset do Arki da RN-014-2.
@Component({
  imports: [RouterLink, Terminal],
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly copy = COPY.landing.hero;
  protected readonly terminal = COPY.landing.terminal;
  protected readonly quickstart = COPY.landing.quickstart;
  protected readonly problem = COPY.landing.problem;
  protected readonly thesis = COPY.landing.thesis;
  protected readonly howItWorks = COPY.landing.howItWorks;
  protected readonly engines = COPY.landing.engines;
  protected readonly differentiation = COPY.landing.differentiation;
  protected readonly paths = COPY.landing.paths;
  protected readonly capabilitiesCopy = COPY.landing.capabilities;
  protected readonly ctas = COPY.landing.ctas;
  protected readonly finalCta = COPY.landing.finalCta;

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
