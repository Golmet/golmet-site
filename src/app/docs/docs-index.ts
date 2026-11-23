import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { COPY } from '../shared/copy/copy';
import { DocsContentService } from './docs-content.service';

// Índice do portal: lista as páginas geradas dos .md canônicos (RN-007).
@Component({
  imports: [RouterLink],
  selector: 'app-docs-index',
  styleUrl: './docs-index.scss',
  templateUrl: './docs-index.html',
})
export class DocsIndex {
  protected readonly copy = COPY.portal;
  protected readonly toc = inject(DocsContentService).toc;
}
