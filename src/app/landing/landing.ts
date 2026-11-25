import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Terminal } from '../shared/terminal/terminal';
import { COPY, Locale } from '../shared/copy/copy';
import { CLI_VERSION } from '../shared/cli-version.generated';

// RN-001 — landing promocional, estrutura narrativa (CR-004) + credibilidade
// de pré-lançamento (CR-005): hero + terminal real (dobra) → problema →
// tese → como funciona → engines → diferenciação → caminhos → capacidades
// em destaque → CTA final.
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
  protected readonly cliVersion = CLI_VERSION;

  /** locale da rota ativa — / e /pt-BR usam o MESMO componente (RN-011-1). */
  protected readonly locale: Locale = (this.route.snapshot.data['locale'] ?? 'en') as Locale;
  /** Índice de docs no locale da landing (links "documentação" da página). */
  protected readonly docsIndexRoute = this.locale === 'pt-BR' ? '/docs/pt-br' : '/docs';
  /** Referência de comandos no locale da landing (link do rodapé de capacidades). */
  protected readonly capDocRoute =
    this.locale === 'pt-BR' ? '/docs/pt-br/reference/commands' : '/docs/reference/commands';
  protected readonly copy = COPY[this.locale].landing.hero;
  protected readonly landing = COPY[this.locale].landing;
  protected readonly terminal = COPY[this.locale].landing.terminal;
  protected readonly quickstart = COPY[this.locale].landing.quickstart;
  protected readonly problem = COPY[this.locale].landing.problem;
  protected readonly thesis = COPY[this.locale].landing.thesis;
  protected readonly howItWorks = COPY[this.locale].landing.howItWorks;
  protected readonly engines = COPY[this.locale].landing.engines;
  protected readonly differentiation = COPY[this.locale].landing.differentiation;
  protected readonly paths = COPY[this.locale].landing.paths;
  protected readonly capabilitiesCopy = COPY[this.locale].landing.capabilities;
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
        setTimeout(() => this.copiedStep.set(null), 1600);
      })
      .catch(() => {});
  }
}
