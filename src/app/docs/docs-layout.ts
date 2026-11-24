import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { DocsContentService } from './docs-content.service';
import { DocsSearch } from './docs-search';

// RN-007 — shell do portal: sidebar com TOC gerado dos .md (RN-010),
// busca (RN-009) e outlet das páginas. As variantes PT-BR ligam na
// RN-011-1 (build por locale).
@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DocsSearch],
  selector: 'app-docs-layout',
  styleUrl: './docs-layout.scss',
  templateUrl: './docs-layout.html',
})
export class DocsLayout {
  protected readonly toc = inject(DocsContentService).toc;
}
