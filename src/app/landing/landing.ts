import { Component } from '@angular/core';

import { COPY } from '../shared/copy/copy';

// Placeholder da dobra (Wave 2 da identidade — RN-014-3): copy vinda do
// deck único (fonte PT-BR, RN-013). O layout do hero com o Arki e o bloco
// de quickstart é implementado pela feature RN-001 (RN-001-1).
@Component({
  selector: 'app-landing',
  styleUrl: './landing.scss',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly copy = COPY.landing.hero;
}
