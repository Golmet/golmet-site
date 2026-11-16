// RN-016-4 / RN-021 — padrão de carregamento de scripts externos.
// Contrato (feature RN-016): async (não participa do caminho crítico de
// render), idempotente por id, SEM retry agressivo e SEM erro visível —
// a promise nunca rejeita: resolve `true` no sucesso e `false` na falha.
// Consumido pelo embed do analytics Umami (feature RN-019 — ADR-011/012).

export interface LoadScriptOptions {
  /** id do elemento script — garante idempotência em re-navegações */
  id: string;
  /** default true — não-bloqueante (RN-021) */
  async?: boolean;
  /** atributos extras (ex.: data-website-id do Umami — feature RN-019) */
  attributes?: Record<string, string>;
}

export function loadScript(src: string, options: LoadScriptOptions): Promise<boolean> {
  return new Promise((resolve) => {
    // Prerender SSG: no build não há DOM de navegação — script só em runtime
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    const existing = document.getElementById(options.id) as HTMLScriptElement | null;
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = options.id;
    script.src = src;
    script.async = options.async ?? true;
    for (const [key, value] of Object.entries(options.attributes ?? {})) {
      script.setAttribute(key, value);
    }

    // RN-021: falha silenciosa — resolve false, sem erro visível, sem retry
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });
}
