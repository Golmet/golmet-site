import { TestBed } from '@angular/core/testing';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from '../../app';
import { routes } from '../../app.routes';
import { GolmetTitleStrategy } from './page-title.strategy';
import { SITE_URL } from '../../site.config';

// RN-016-3 — metas por página no prerender (title, description, canonical,
// hreflang, Open Graph com o banner do Arki).
// Nota: em testes o appConfig do bootstrapApplication não é aplicado — o
// provider da estratégia precisa ser declarado aqui explicitamente.
describe('GolmetTitleStrategy (shared/seo)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: TitleStrategy, useClass: GolmetTitleStrategy }],
    }).compileComponents();
  });

  it('landing: aplica title, description, canonical e hreflang da rota', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    const head = (harness.fixture.nativeElement as HTMLElement).ownerDocument!.head;
    expect(document.title).toContain("Docs that don't rot");
    expect(head.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('GOLMET');
    expect(head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(`${SITE_URL}/`);
    expect(head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="en"]')?.href).toBe(`${SITE_URL}/`);
    // RN-011-1 — hreflang pt-BR aponta a variante equivalente.
    expect(head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="pt-BR"]')?.href).toBe(
      `${SITE_URL}/pt-BR`,
    );
    expect(head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]')?.href).toBe(`${SITE_URL}/`);
  });

  it('landing PT-BR: title da fonte e lang do documento (RN-011-1/5)', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/pt-BR');

    expect(document.title).toContain('Requisitos versionados');
    expect(document.documentElement.getAttribute('lang')).toBe('pt-BR');
  });

  it('landing: og:image aponta para o banner do Arki (asset RN-014-2)', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      `${SITE_URL}/og/og-default.jpg`,
    );
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('website');
  });

  it('docs: metas da rota do portal (EN — fonte técnica)', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/docs');

    expect(document.title).toContain('Documentation');
    const head = (harness.fixture.nativeElement as HTMLElement).ownerDocument!.head;
    expect(head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(`${SITE_URL}/docs`);
  });
});
