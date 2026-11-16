import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Shell do portal de documentação (RN-016-2). A sidebar real com a árvore
// dos `.md`, a busca e a página renderizada são tasks da feature RN-007.
@Component({
  imports: [RouterOutlet],
  selector: 'app-docs-layout',
  styleUrl: './docs-layout.scss',
  templateUrl: './docs-layout.html',
})
export class DocsLayout {}
