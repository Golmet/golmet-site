import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';

import { Landing } from './landing';
import { COPY } from '../shared/copy/copy';
import { CLI_VERSION } from '../shared/cli-version.generated';

// RN-001-1 — conceito "mostra, não conta" (CR-004 v2): hero com stats reais,
// demo interativa de saída real, cenas dor→comando, jornada em 3 trilhas.
// Sem Arki no hero. RN-011 — locale da rota: default EN (raiz); PT-BR via data.
describe('Landing — conceito mostra, não conta (RN-001-1)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('hero: headline com apelo + Arki + stats reais + comando primário', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // mascote de volta na dobra (pedido do operador)
    const img = compiled.querySelector<HTMLImageElement>('.gm-hero-arki');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toContain('arki-hero.webp');
    expect(img!.getAttribute('loading')).toBe('eager');
    // headline em ouro, sem badge de release na dobra
    expect(compiled.querySelector('.gm-hero-badge')).toBeNull();
    expect(compiled.querySelector('.gm-hl')?.textContent).toContain('No more stale documentation');
    // stats reais, nada de ROI inventado
    const stats = compiled.querySelectorAll('.gm-stat');
    expect(stats.length).toBe(4);
    expect(compiled.textContent).toContain('18');
    expect(compiled.textContent).toContain('engines supported');
    // CTAs externos do hero (GitHub primário, npm secundário)
    const anchors = compiled.querySelectorAll<HTMLAnchorElement>('.gm-hero-actions a');
    expect(anchors.length).toBe(2);
    expect(anchors[0].href).toContain('github.com/Golmet');
    expect(anchors[1].href).toContain('npmjs.com/package/golmet-cli');
    // comando de instalação não duplica no hero (vive no quickstart)
    expect(compiled.querySelector('.gm-hero-install')).toBeNull();
  });

  it('quickstart com 4 passos e comandos copiáveis abaixo do hero', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.gm-quickstart h2')?.textContent).toContain(
      COPY.en.landing.hero.quickstart.heading,
    );
    expect(compiled.querySelectorAll('.gm-step').length).toBe(4);
    // os 4 passos são acionáveis, cada um com comando copiável
    expect(compiled.querySelectorAll('.gm-quickstart .gm-copy').length).toBe(4);
    expect(compiled.querySelector('.gm-quickstart .gm-badge')?.textContent).toContain(`v${CLI_VERSION}`);
  });

  it('os comandos do quickstart espelham a demo interativa (mesma sequência)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const guideCommands = Array.from(compiled.querySelectorAll('.gm-quickstart .gm-step-command')).map(
      (el) => el.textContent?.trim(),
    );
    const demoButtons = Array.from(compiled.querySelectorAll('.gm-term-step-cmd')).map(
      (el) => el.textContent?.trim(),
    );
    expect(guideCommands).toEqual(demoButtons);
  });

  it('demo interativa: revela a saída real passo a passo e permite recomeçar', async () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // 4 comandos reais; só o primeiro habilitado
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('.gm-term-step');
    expect(buttons.length).toBe(4);
    expect(buttons[0].disabled).toBeFalsy();
    expect(buttons[1].disabled).toBeTruthy();

    // passo 1 revela a captura real (install + version)
    buttons[0].click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('golmet version v1.7.4');
    // saída do validate ainda oculta
    expect(compiled.textContent).not.toContain('Feature ancorada em PEND');

    // roda o restante na ordem — validação com drift e fix aparecem
    // (aguardando a re-renderização: botão desabilitado não dispara click no jsdom)
    const clickStep = async (i: number) => {
      (fixture.nativeElement.querySelectorAll('.gm-term-step')[i] as HTMLButtonElement).click();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    await clickStep(1);
    await clickStep(2);
    await clickStep(3);
    expect(compiled.textContent).toContain('Feature ancorada em PEND');
    expect(compiled.textContent).toContain('fix:');

    // reset volta ao estado inicial
    compiled.querySelector<HTMLButtonElement>('.gm-term-reset')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('golmet version v1.7.4');
  });

  it('cenas dor→comando: 4 cards, só comandos lançados + link para os 18', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const scenes = compiled.querySelectorAll('.gm-scene');
    expect(scenes.length).toBe(4);
    expect(compiled.querySelectorAll('.gm-scene-command').length).toBe(4);
    // comando não lançado não aparece (ex.: golmet contribute — v1+)
    expect(compiled.textContent).not.toContain('golmet contribute');
    const docLink = compiled.querySelector<HTMLAnchorElement>('.gm-scenes-doc-link');
    expect(docLink?.getAttribute('href')).toBe('/docs/reference/commands');
    expect(docLink?.textContent).toContain('all 18 commands');
  });

  it('engines nomeados no meio da página (7 chips) + diferenciação com 3 itens', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.gm-engine-chip').length).toBe(7);
    expect(compiled.querySelector('.gm-engine-chip')?.textContent).toContain('OpenCode');
    expect(compiled.querySelectorAll('.gm-diff-item').length).toBe(3);
    expect(compiled.querySelector('.gm-diff-item')?.textContent).toContain('Markdown in your git');
    // FORMATO + KIT + RUNTIME condensados
    expect(compiled.querySelector('.gm-under-the-hood')?.textContent).toContain('FORMAT');
  });

  it('jornada: 3 trilhas com passos reais e links para a documentação', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const tracks = compiled.querySelectorAll('.gm-track');
    expect(tracks.length).toBe(3);
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.gm-track-link');
    const expected = ['/docs/getting-started-5-minutes', '/docs/concepts/reverse', '/docs/concepts/organization'];
    links.forEach((link, i) => {
      expect(link.getAttribute('href')).toBe(expected[i]);
    });
    // trilhas começam com o mesmo comando real
    expect(compiled.textContent).toContain('npm i -g golmet-cli');
  });

  it('FAQ com 3 objeções respondidas antes do CTA final', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const items = compiled.querySelectorAll('.gm-faq-item');
    expect(items.length).toBe(3);
    expect(items[0].querySelector('summary')).not.toBeNull();
    expect(compiled.textContent).toContain(COPY.en.landing.faq.items[2].question);
  });

  it('CTA final como pergunta + 2 links externos + comando copiável', async () => {
    const written: string[] = [];
    const clipboard = { writeText: async (text: string) => void written.push(text) };
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });

    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.gm-final-cta h2')?.textContent).toContain('Tired of docs');
    const finalCtas = compiled.querySelectorAll<HTMLAnchorElement>('.gm-final-cta .gm-ctas a');
    expect(finalCtas.length).toBe(2);
    expect(finalCtas[0].href).toContain('github.com/Golmet');
    expect(finalCtas[1].href).toContain('npmjs.com/package/golmet-cli');

    // copiar o comando do CTA final com feedback "Copiado"
    const finalCopy = compiled.querySelector<HTMLButtonElement>('.gm-final-command .gm-copy');
    finalCopy?.click();
    await fixture.whenStable();
    expect(written).toContain('npm i -g golmet-cli');
    expect(finalCopy?.textContent).toContain('Copiado');
  });

  it('CR-006: coerência de lançamento — sem pré-lançamento, jargão de fase ou prova social inventada', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Pré-lançamento');
    expect(compiled.textContent).not.toContain('pré-lançamento');
    expect(compiled.textContent).not.toContain('fase F2');
    expect(compiled.textContent).not.toContain('estrelas');
    expect(compiled.querySelector('.gm-final-command code')?.textContent).toContain('npm i -g golmet-cli');
  });

  it('RN-011: locale pt-BR pela rota — fonte PT-BR da landing (ADR-009)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Landing],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { locale: 'pt-BR' } } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.gm-hero h1')?.textContent).toContain('Chega de documentação velha');
    expect(compiled.textContent).toContain('comandos lançados');
    expect(compiled.querySelector('.gm-quickstart .gm-badge')?.textContent).toContain(`v${CLI_VERSION}`);
    // trilha 1 com docs localizadas
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.gm-track-link');
    expect(links[0].getAttribute('href')).toBe('/docs/pt-br/getting-started-5-minutes');
  });
});
