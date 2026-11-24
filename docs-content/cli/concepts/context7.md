<p align="center">English | <a href="/docs/pt-br/concepts/context7">Português (Brasil)</a></p>

# Context7 in the workflow

During tutorial [03](/docs/getting-started/03-trabalhando-com-ia), when the
AI was writing the slot-confirmation integration with the payment gateway,
it needed the gateway's CURRENT API — not the API from when its model was
trained. That gap is what the Context7 integration exists for.

## The trigger

The operation rule lives at `profile/context7.md` in the config (the shelf
of [profile](/docs/concepts/profile)): **BEFORE answering about a
library/framework/SDK/API/CLI/cloud, the agent consults Context7** — it
resolves the library ID and fetches the current documentation through the
MCP tool. Model memory ages; the source's documentation doesn't.

## How the kit delivers it

The `golmet install` wizard registers the Context7 MCP tool in the engine
(the catalog marks the integration), and the guided setup (`gm-setup`,
optional) validates it with a smoke test. The API key is optional (free at
context7.com) — via the instance's `profile/`, never in the repo.

## The boundary

Context7 is public documentation research — product data (the org, tokens,
requirements) never goes into the query. In MeuApp, the AI looked up how the
gateway confirms payments; HOW MeuApp confirms the slot is in RN-001 — one
is the world's API, the other is your product's rule.
