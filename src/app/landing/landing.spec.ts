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
    expect(compiled.querySelector('.gm-hl')?.textContent).toContain('Every AI writes code');
    // stats reais, nada de ROI inventado
    const stats = compiled.querySelectorAll('.gm-stat');
    expect(stats.length).toBe(4);
    expect(compiled.textContent).toContain('18');
    expect(compiled.textContent).toContain('engines supported');
    // CTAs do hero: comando copiável primário + GitHub secundário; sem npm
    const install = compiled.querySelector('.gm-install-block .gm-install-command');
    expect(install?.textContent).toContain('npm i -g golmet-cli');
    const heroCopy = compiled.querySelector<HTMLButtonElement>('.gm-install-block .gm-install-copy');
    expect(heroCopy?.textContent).toContain('Copy');
    const anchors = compiled.querySelectorAll<HTMLAnchorElement>('.gm-hero-actions a');
    expect(anchors.length).toBe(1);
    expect(anchors[0].href).toContain('github.com/Golmet');
    expect(compiled.querySelector('.gm-hero-actions a[href*="npmjs"]')).toBeNull();
  });

  it('trilha "Testar hoje" absorve o quickstart: 4 passos com descrição e selo de versão', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // card isolado "Como começar" não existe mais
    expect(compiled.querySelector('.gm-quickstart')).toBeNull();
    // trilha 1: 4 passos (install, init, status, validate) com descrição curta
    const firstTrackSteps = compiled.querySelectorAll('.gm-track:first-of-type .gm-track-cmd');
    expect(firstTrackSteps.length).toBe(4);
    expect(firstTrackSteps[0]?.textContent).toContain('npm i -g golmet-cli');
    expect(compiled.querySelectorAll('.gm-track:first-of-type .gm-track-step-desc').length).toBe(4);
    // selo de versão migrou para o cabeçalho da trilha
    expect(compiled.querySelector('.gm-track .gm-badge')?.textContent).toContain(`v${CLI_VERSION}`);
    // comandos nas trilhas são conteúdo — sem botão de copiar
    expect(compiled.querySelectorAll('.gm-track .gm-copy').length).toBe(0);
  });

  it('os comandos da trilha 1 espelham a demo interativa (mesma sequência)', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const guideCommands = Array.from(compiled.querySelectorAll('.gm-track:first-of-type .gm-track-cmd')).map(
      (el) => el.textContent?.replace('❯ ', '').trim(),
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

    // estado inicial: vazio, aguardando o 1º clique (manual — 27/11/2026)
    expect(compiled.textContent).not.toContain('golmet version v1.7.4');
    expect(compiled.querySelector('.gm-t-idle')).not.toBeNull();
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

    // reset volta ao estado inicial vazio
    compiled.querySelector<HTMLButtonElement>('.gm-term-reset')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('golmet version v1.7.4');
    expect(buttons[0].disabled).toBeFalsy();
  });

  it('tecnico: card por camada com texto ao lado, setas e evidência', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const text = Array.from(compiled.querySelectorAll('.gm-tech-text'))
      .map((el) => el.textContent)
      .join(' ');
    expect(text).toContain('Lives in your git');
    expect(text).toContain('deterministic binary');
    expect(text).toContain('guided by the gm-* skills');
    // conteúdo removido no refactor 27/11 não volta
    expect(text).not.toContain('cognitive load');
    expect(text).not.toContain('reference companies');
    expect(text).not.toContain('automated check');

    // setas com semântica do árbitro + bloco de evidência com divergência
    const section = compiled.querySelector('.gm-tech')!.textContent ?? '';
    expect(section).toContain('Gates H1 through H10');
    expect(section).toContain('the agent runs under them');
    expect(section).toContain('[src/pedido.ts:42 @a3f9c1]');
    expect(section).toContain('x diverges');
    expect(section).toContain('file, line and hash');

    // técnico vem DEPOIS dos benefícios (convence primeiro, explica depois)
    const order = compiled
      .querySelector('.gm-benefits')!
      .compareDocumentPosition(compiled.querySelector('.gm-tech')!);
    expect(!!(order & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  });

  it('benefícios: simples, direto, limpo, antes do Como começar', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // 10 motivos, cada um com título e uma linha de explicação
    expect(compiled.querySelectorAll('.gm-benefit').length).toBe(10);
    expect(compiled.querySelectorAll('.gm-benefit-title').length).toBe(10);
    expect(compiled.textContent).toContain('See everything GOLMET offers');
    expect(compiled.textContent).toContain('Requirements organized and versioned');
    expect(compiled.textContent).toContain('Legacy systems stop being a black box');
    // a transformação vem ANTES da jornada — o visitante sabe o que ganha antes de agir
    const order = compiled
      .querySelector('.gm-benefits')!
      .compareDocumentPosition(compiled.querySelector('.gm-journey')!);
    expect(!!(order & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    // comando não lançado não aparece (ex.: golmet contribute — v1+)
    expect(compiled.textContent).not.toContain('golmet contribute');
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
    // trilhas 2 e 3 sem botão de copiar (comando é conteúdo)
    expect(compiled.querySelectorAll('.gm-track:nth-of-type(2) .gm-track-step-desc').length).toBe(0);
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

  it('CTA final como pergunta + link externo + comando copiável', async () => {
    const written: string[] = [];
    const clipboard = { writeText: async (text: string) => void written.push(text) };
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true });

    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.gm-final-cta h2')?.textContent).toContain('Tired of docs');
    const finalCtas = compiled.querySelectorAll<HTMLAnchorElement>('.gm-final-actions .gm-cta');
    expect(finalCtas.length).toBe(1);
    expect(finalCtas[0].href).toContain('github.com/Golmet');

    // copiar o comando do CTA final com feedback "Copiado"
    const finalCopy = compiled.querySelector<HTMLButtonElement>('.gm-install-block .gm-install-copy');
    finalCopy?.click();
    await fixture.whenStable();
    expect(written).toContain('npm i -g golmet-cli');
    expect(finalCopy?.textContent).toContain(COPY.en.landing.ctas.copied);
  });

  it('CR-006: coerência de lançamento — sem pré-lançamento, jargão de fase ou prova social inventada', () => {
    const fixture = TestBed.createComponent(Landing);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Pré-lançamento');
    expect(compiled.textContent).not.toContain('pré-lançamento');
    expect(compiled.textContent).not.toContain('fase F2');
    expect(compiled.textContent).not.toContain('estrelas');
    expect(compiled.querySelector('.gm-install-command')?.textContent).toContain('npm i -g golmet-cli');
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

    expect(compiled.querySelector('.gm-hero h1')?.textContent).toContain('Toda IA escreve código');
    expect(compiled.textContent).toContain('comandos lançados');
    expect(compiled.querySelector('.gm-track .gm-badge')?.textContent).toContain(`v${CLI_VERSION}`);
    // trilha 1 com docs localizadas
    const links = compiled.querySelectorAll<HTMLAnchorElement>('.gm-track-link');
    expect(links[0].getAttribute('href')).toBe('/docs/pt-br/getting-started-5-minutes');
  });
});
