
# 02 — Create the project inside the Organization

With the Organization created, the operator creates the **MeuApp** workspace — the
scheduling product. A product workspace is the unit where the workflow
happens: requirements live in it, specs descend into it, delivery moves in
it. The full concept: [docs/concepts/organization.md](/docs/concepts/organization).

## The wizard again — now inside the org

```bash
cd MinhaOrganizacao
golmet init
```

The wizard opens again, but with a difference: since the current directory
is an Organization, the second option comes alive:

```
◆ What do you want to initialize? (↑/↓ move · enter confirms · esc cancels)

    Organization the root that groups the workspaces
>   Product workspace inside an existing Organization new project inside the root
    Free-root product workspace independent new project
```

The cursor is now on option 2 (the last used), and the wizard knows the
root is an Organization — The operator confirms with enter.

```
◆ Choose the Organization (↑/↓ move · enter confirms · esc cancels)

  1. MinhaOrganizacao — C:\company\MinhaOrganizacao
  2. Outra — manual path — the Organization is not in the catalog
```

The list comes from the **global catalog** — the org he created in tutorial
01 is already there. Enter on MinhaOrganizacao. The wizard asks for the product
name: **MeuApp**. Summary, ENTER, created:

```
product MeuApp initialized at C:\company\MinhaOrganizacao\MeuApp — 9 created, 0 skipped
container updated: products: [MeuApp]
organization versioning model: org-repo
product WITHOUT its own .golmet/ — the kit zone is the organization's (org-repo)
```

Three lines worth reading. The `products: [MeuApp]` is the org recognizing
its child. The "versioning model: org-repo" says the ORG is the repository
— MeuApp is a folder versioned inside it, with no `.gitignore` of its own.
And the product was born **without its own kit zone**: the `.golmet/` zone
is the organization's, shared — the full concept in
[docs/concepts/layers.md](/docs/concepts/layers).

## What was born in MeuApp — and each document's role

Five documents and three folders. Each one is a character in the story
coming ahead (the full artifact map is in
[docs/concepts/artefatos.md](/docs/concepts/artefatos)):

- **`golmet.yaml`** — the workspace manifest. The kit reads from here that
  this is a workspace (not an org) and that the format is 1.
- **`PROJECT_CHARTER.md`** — the charter: **what the product IS**. Name,
  owner, purpose, the code repositories. It is the seed of everything that
  comes after — the charter is the first document of the DAG, and all the
  others descend from it one way or another.
- **`REQUIREMENTS.md`** — the **business rules** document. Born empty, it
  is the one that grows the most: each requirement becomes a `## RN-001 —
  title` section with state (`draft` → `confirmed` → `active`) and
  evidence. The client validates here.
- **`CHANGE_REQUESTS.md`** and **`DECISIONS.md`** — where scope changes and
  technical decisions get recorded. They exist as their own documents
  because they are the records the team will re-read when someone asks
  "why?".
- **`reverse/CANDIDATES.md`** — the candidate knowledge queue (in
  brownfield projects, what was discovered from legacy code enters here).
- **`specs/`** and **`delivery/`** (folders created) — where the technical
  analysis descends and where features move, respectively.
- **`golmet.index.json`** — the state index baseline: the validation
  machine compares the state declared in the documents against this
  kit-managed cache.

## What comes next

The workspace is ready and empty — empty on purpose. Life starts when the
AI walks in: [03 — working with AI](/docs/getting-started/03-trabalhando-com-ia).
