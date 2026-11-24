import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Landing } from './landing';
import { COPY } from '../shared/copy/copy';
import { CLI_VERSION } from '../shared/cli-version.generated';

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
    expect(compiled.querySelector('.gm-kicker')?.textContent).toContain('REQUISITOS');
    expect(compiled.querySelector('.gm-value')?.textContent).toContain('Seu contrato');
    expect(compiled.querySelector('.gm-quickstart h2')?.textContent).toContain(COPY.landing.quickstart.heading);
    expect(compiled.querySelectorAll('.gm-step').length).toBe(COPY.landing.quickstart.steps.length);
    // 3 botões no quickstart (npm, install, init) + 1 no CTA final
    expect(compiled.querySelectorAll('.gm-copy').length).toBe(4);
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

  it('RN-004/CR-005: os 18 comandos vivem na documentação, não na landing', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // a landing mostra 4 em destaque; a lista completa fica na docs (RN-007-9)
    expect(compiled.querySelectorAll('.gm-featured-cap').length).toBe(4);
    expect(compiled.querySelector('.gm-cap-doc-link')?.getAttribute('href')).toBe('/docs');
    // comando não lançado não aparece (ex.: golmet contribute — v1+)
    expect(compiled.textContent).not.toContain('golmet contribute');
  });

  it('renderiza CTAs para a org GitHub e o npm no hero e no CTA final (RN-005)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const heroCtas = compiled.querySelectorAll<HTMLAnchorElement>('.gm-hero .gm-ctas a');
    expect(heroCtas.length).toBe(2);
    expect(heroCtas[0].href).toContain('github.com/Golmet');
    expect(heroCtas[1].href).toContain('npmjs.com/package/golmet-cli');
    const finalCtas = compiled.querySelectorAll<HTMLAnchorElement>('.gm-final-cta .gm-ctas a');
    expect(finalCtas.length).toBe(2);
  });

  it('narrativa CR-004: problema, tese e como funciona', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.gm-problem-card').length).toBe(4);
    expect(compiled.querySelectorAll('.gm-layer').length).toBe(3);
    expect(compiled.querySelector('.gm-layer-name')?.textContent).toContain('FORMATO');
    expect(compiled.querySelectorAll('.gm-how-step').length).toBe(5);
    expect(compiled.textContent).not.toContain('estrelas');
  });

  it('CR-006: coerência de lançamento — badge v1.1.1, sem pré-lançamento nem jargão de fase', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.gm-badge')?.textContent).toContain(`v${CLI_VERSION}`);
    expect(compiled.textContent).not.toContain('Pré-lançamento');
    expect(compiled.textContent).not.toContain('pré-lançamento');
    expect(compiled.textContent).not.toContain('fase F2');
    expect(compiled.querySelector('.gm-final-command code')?.textContent).toContain('npm i -g golmet-cli');
  });

  it('CR-006: terminal com saída real da v1.7.4 (install, version, init, status, validate)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-terminal')).toBeTruthy();
    expect(compiled.textContent).toContain('golmet version v1.7.4');
    expect(compiled.textContent).toContain('Feature ancorada em PEND');
    expect(compiled.textContent).toContain('fix:');
  });

  it('CR-005: engines nomeados e diferenciação', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.gm-engine-chip').length).toBe(7);
    expect(compiled.querySelector('.gm-engine-chip')?.textContent).toContain('OpenCode');
    expect(compiled.querySelectorAll('.gm-diff-item').length).toBe(3);
    expect(compiled.querySelector('.gm-diff-item')?.textContent).toContain('Markdown no seu git');
  });

  it('RN-004/CR-005: 4 comandos em destaque + link para a documentação', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const featured = compiled.querySelectorAll('.gm-featured-cap');
    expect(featured.length).toBe(4);
    expect(compiled.querySelector('.gm-cap-doc-link')?.textContent).toContain('todos os 18 comandos');
    expect(compiled.textContent).not.toContain('golmet contribute');
  });
});
