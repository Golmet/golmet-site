import { Component } from '@angular/core';

// Índice do portal (rota /docs). As páginas reais vêm do prerender dos
// `.md` canônicos (feature RN-007 — RN-007-2).
@Component({
  selector: 'app-docs-index',
  styleUrl: './docs-index.scss',
  templateUrl: './docs-index.html',
})
export class DocsIndex {}
