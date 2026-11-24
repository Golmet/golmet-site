import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COPY } from './shared/copy/copy';
import { LangService } from './shared/i18n/lang';

// RN-020 — 404 customizada da marca: mensagem do guardião + caminhos de
// saída (busca do portal e seções principais). RN-011 — copy por locale.
@Component({
  imports: [RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {
  private readonly lang = inject(LangService);
  protected readonly notFound = COPY[this.lang.activeLocale()].notFound;
  protected readonly copy = COPY[this.lang.activeLocale()];
}
