import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Landing } from './landing';
import { COPY } from '../shared/copy/copy';

// RN-001-1 — hero com Arki, proposta de valor e quickstart com comandos
// copiáveis (RN-001, RN-002); narrativa com wizard (CR-003).
describe('Landing — primeira dobra (RN-001-1)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renderiza hero com o asset do Arki (alt + eager)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector<HTMLImageElement>('.gm-hero-arki');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toContain('arki-hero.webp');
    expect(img!.getAttribute('loading')).toBe('eager');
    expect(img!.getAttribute('alt')).toContain('Arki');
  });

  it('renderiza proposta de valor e quickstart narrado do deck (4 passos)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.gm-value')?.textContent).toContain('requisito versionado');
    expect(compiled.querySelector('.gm-quickstart h2')?.textContent).toContain(COPY.landing.quickstart.heading);
    expect(compiled.querySelectorAll('.gm-step').length).toBe(COPY.landing.quickstart.steps.length);
    // passos 3-4 são ações narradas — sem botão de copiar
    expect(compiled.querySelectorAll('.gm-copy').length).toBe(2);
  });

  it('copia o comando com feedback "Copiado" (RN-002)', async () => {
    const written: string[] = [];
    const clipboard = { writeText: async (text: string) => void written.push(text) };
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });

    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    (compiled.querySelector<HTMLButtonElement>('.gm-copy') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(written).toContain(COPY.landing.quickstart.steps[0].command);
    expect(compiled.querySelector<HTMLButtonElement>('.gm-copy')?.textContent).toContain('Copiado');
  });

  it('renderiza os 3 caminhos com links para a documentação (RN-003)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const cards = compiled.querySelectorAll('.gm-path-card');
    expect(cards.length).toBe(3);
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.gm-path-card');
    for (const link of links) {
      expect(link.getAttribute('href')).toBe('/docs');
    }
    expect(compiled.querySelector('.gm-path-card h3')?.textContent).toContain('Produto novo');
  });

  it('renderiza somente os 18 comandos lançados do release 0.3.0 (RN-004, CR-001)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const rows = compiled.querySelectorAll('.gm-cap-table tbody tr');
    expect(rows.length).toBe(18);
    // comando não lançado não aparece (ex.: golmet contribute — v1+)
    expect(compiled.textContent).not.toContain('golmet contribute');
  });

  it('renderiza CTAs para a org GitHub e o npm (RN-005)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const ctas = compiled.querySelectorAll<HTMLAnchorElement>('.gm-ctas a');
    expect(ctas.length).toBe(2);
    expect(ctas[0].href).toContain('github.com/Golmet');
    expect(ctas[1].href).toContain('npmjs.com/package/golmet-cli');
  });
});
