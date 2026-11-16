import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
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

  it('should render the home route in the outlet', async () => {
    await TestBed.createComponent(App).whenStable();
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const compiled = harness.fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-home h1')?.textContent).toContain('GOLMET');
  });
});
