<p align="center">English | <a href="/docs/pt-br/concepts/organization"Português (Brasil)</a></p>

# Organization, workspaces and versioning

When the operator created MinhaOrganizacao in tutorial
[01](/docs/getting-started/01-organizacao), Golmet asked "what do you want
to initialize?" — and the journey's first choice defines the structure of
everything: **the Organization is the root that groups the workspaces**, it
keeps the principles (`CONSTITUTION.md`), the navigation (`INDEX.md`) and
the product manifest (`products:`). It doesn't run the requirements
pipeline — the pipeline lives in the workspaces.

## The two versioning models

The decision that shapes every product is the `versioning:` field in the
org's golmet.yaml. MinhaOrganizacao uses `org-repo`: **the whole organization is
one Git repository** — MeuApp is a folder versioned inside it. In this
model, the `.gitignore` belongs to the org root (created by `init --org`),
the kit zone (`.golmet/`) belongs to the root — shared — and the product is
born lean, without its own zone and without its own `.gitignore`: the
org's versioning already covers it.

The other model, `produtos-repo`, is the FORMAT classic (DR-008): each
product is its own repository, with its own versioned `.golmet/` (the kit
of THAT repo, inherited by the product team when cloning) and its own
`.gitignore`. Containers created before the field existed are treated as
`produtos-repo` (the retroactive default).

In practice: `init --into` reads the declared model and delivers the
product the right way, reporting which one it applied — "organization
versioning model: org-repo". The `.golmet/` zone changes role by context
(workspace versioned · engine config state · container work zone) — the
detail in [layers.md](/docs/concepts/layers).

## The catalog and the truth

The organizations the kit creates (or adopts) enter the **global catalog**
(`~/.golmet/organizations.json`) — the wizard uses the catalog to list orgs
when someone creates a product. The invariant: **the org's golmet.yaml is
the source of truth** (structure and `products:`); the catalog is
convenience. When the validate runs on a container, it validates the
declaration: a declared product without a directory is a failure; a product
directory outside products is a warning — the org and the disk must tell
the same story.

## The scoping rule

A practical question the structure answers: **where do I write this
artifact?** The rule is one: in the subject's workspace. A product subject
(an RN, a spec) is written in the product workspace; a transversal org
subject (a meeting checkpoint, a migration history) is written in the
org's work zone `.golmet/` — gitignored, because it's kit work, not
company content. And what fits nowhere is born in the work zone and
promoted by decision — never loose at the root.
