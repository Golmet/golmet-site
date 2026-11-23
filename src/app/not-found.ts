import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COPY } from './shared/copy/copy';

// RN-020 — 404 customizada da marca: mensagem do guardião + caminhos de
// saída (busca do portal e seções principais).
@Component({
  imports: [RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {
  protected readonly notFound = COPY.notFound;
  protected readonly copy = COPY;
}
