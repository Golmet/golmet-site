import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App (RN-016-2 — rotas da única app)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the landing on the root route', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const compiled = harness.fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-landing h1')?.textContent).toContain('GOLMET');
  });

  it('navigates to /docs within the same app (landing → portal)', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    await harness.navigateByUrl('/docs');
    const compiled = harness.fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-docs-layout')).toBeTruthy();
    expect(compiled.querySelector('app-docs-index h2')?.textContent).toContain('Documentation');
  });
});
