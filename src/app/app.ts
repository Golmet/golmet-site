import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// Shell da única app (RN-016-2): header com marca e nav, outlet, footer.
// Identidade visual completa (Arki, OG, voz) é a feature RN-014.
@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
