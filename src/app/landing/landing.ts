import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Terminal } from '../shared/terminal/terminal';
import { COPY, Locale } from '../shared/copy/copy';

// RN-001 — landing promocional, conceito "mostra, não conta" (CR-004 v2):
// hero com stats reais + CTAs âncora → demo interativa (saída real clicável)
// → cenas dor→comando → engines → diferenciação → jornada de adoção → FAQ →
// CTA final como pergunta. Sem Arki no hero (CR-004 v2).
// RN-011 — copy pelo locale da rota (/ raiz EN, /pt-BR PT — ADR-009: fonte
// PT-BR). Metas/hreflang/lang ficam na GolmetTitleStrategy (RN-011-1).
@Component({
  imports: [RouterLink, Terminal],
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing {
  private readonly route = inject(ActivatedRoute);

  /** locale da rota ativa — / e /pt-BR usam o MESMO componente (RN-011-1). */
  protected readonly locale: Locale = (this.route.snapshot.data['locale'] ?? 'en') as Locale;
  protected readonly copy = COPY[this.locale].landing.hero;
  protected readonly demo = COPY[this.locale].landing.demo;
  protected readonly benefits = COPY[this.locale].landing.benefits;
  protected readonly tech = COPY[this.locale].landing.tech;
  protected readonly engines = COPY[this.locale].landing.engines;
  protected readonly differentiation = COPY[this.locale].landing.differentiation;
  protected readonly journey = COPY[this.locale].landing.journey;
  protected readonly faq = COPY[this.locale].landing.faq;
  protected readonly ctas = COPY[this.locale].landing.ctas;
  protected readonly finalCta = COPY[this.locale].landing.finalCta;

  /** título do passo copiado (feedback "Copiado") — null quando nenhum */
  protected readonly copiedStep = signal<string | null>(null);

  protected copyStep(step: { title: string; command?: string }): void {
    if (!step.command) return;
    // Falha silenciosa (mesmo espírito da RN-021): sem erro visível ao visitante
    navigator.clipboard
      ?.writeText(step.command)
      .then(() => {
        this.copiedStep.set(step.title);
        setTimeout(() => this.copiedStep.set(null), 2000);
      })
      .catch(() => {});
  }
}
