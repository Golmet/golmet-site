import { afterEach, describe, expect, it } from 'vitest';

import { loadScript } from './load-script';

// RN-016-4 — padrão de carregamento não-bloqueante com falha silenciosa.
describe('loadScript (shared/analytics)', () => {
  afterEach(() => {
    document.head.replaceChildren();
  });

  it('injeta script async com id e atributos extras', async () => {
    const promise = loadScript('https://analytics.example/umami.js', {
      id: 'gm-analytics',
      attributes: { 'data-website-id': 'abc123' },
    });

    const script = document.getElementById('gm-analytics') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.src).toContain('umami.js');
    expect(script.async).toBe(true);
    expect(script.getAttribute('data-website-id')).toBe('abc123');

    script.dispatchEvent(new Event('load'));
    await expect(promise).resolves.toBe(true);
  });

  it('resolve false em falha sem rejeitar nem lançar erro (falha silenciosa — RN-021)', async () => {
    const promise = loadScript('https://analytics.example/indisponivel.js', {
      id: 'gm-analytics',
    });

    const script = document.getElementById('gm-analytics') as HTMLScriptElement;
    script.dispatchEvent(new Event('error'));

    await expect(promise).resolves.toBe(false);
  });

  it('é idempotente por id — segunda chamada não injeta duplicado', async () => {
    const first = loadScript('https://analytics.example/umami.js', { id: 'gm-analytics' });
    const script = document.getElementById('gm-analytics') as HTMLScriptElement;
    script.dispatchEvent(new Event('load'));
    await first;

    await loadScript('https://analytics.example/umami.js', { id: 'gm-analytics' });

    expect(document.querySelectorAll('#gm-analytics').length).toBe(1);
  });
});
