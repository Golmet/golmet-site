# shared/analytics — analytics anonimizado

**Padrão de carregamento** (`load-script.ts` — implementado na RN-016-4): async não-bloqueante, idempotente por id, sem retry agressivo, falha silenciosa (nunca rejeita — RN-021). Prerender seguro (guard `document`).

**Embed do Umami** (feature RN-019 — ADR-011/012): consome o padrão acima; CSP com a única exceção de `script-src` (SECURITY §5) configurada junto.
