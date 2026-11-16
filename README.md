# golmet-site

> The public site of **GOLMET** — landing + documentation portal for [golmet.io](https://golmet.io).

Single Angular application (SSG, bilingual EN + PT-BR). Built with the [GOLMET workflow](https://github.com/Golmet) — every rule of this project is versioned as a numbered requirement (`RN-001..RN-022`) with traceable specs and acceptance criteria in the workspace.

**Status:** under construction — first public release targeted for the F2 milestone.

## Stack

- Angular 22 (standalone, zoneless) — one app, landing + docs as internal routes
- Static SSG output (`outputMode: static`, prerender) — deployed to Vercel at golmet.io
- Client-side search (MiniSearch index generated at build time)
- Quality gates in CI: strict FORMAT validation of docs + Lighthouse ≥ 90 (mobile)

## Development

```bash
npm ci
npm start        # dev server
npm test         # unit tests (vitest)
npm run build    # production SSG build
```

## Documentation

The product requirements live in the GOLMET workspace (`REQUIREMENTS.md`, `specs/`, `delivery/`). The kit itself is documented at [Golmet/golmet-cli](https://github.com/Golmet/golmet-cli).

---

MIT licensed. The guardian never invents — it cites evidence.
