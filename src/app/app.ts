import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { COPY } from './shared/copy/copy';

// Shell da única app (RN-016-2): header com marca e nav, outlet, footer rico
// (CR-004). Identidade visual completa (Arki, OG, voz) é a feature RN-014.
@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly footer = COPY.footer;
}
