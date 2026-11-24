
# 01 — Create the Organization

The Organization is the first step of the journey — and it is what makes
Golmet more than a loose validator: the company's products are born inside
it, the shared knowledge lives in it, and the norms of how the team works
accumulate in it. The full concept is in
[docs/concepts/organization.md](/docs/concepts/organization); here is the
step by step, on screen.

## The wizard, screen by screen

the operator creates the company folder and runs:

```bash
mkdir MinhaOrganizacao && cd MinhaOrganizacao
golmet init
```

Since bare `golmet init` is always interactive (the kit never creates
anything without asking), the wizard opens:

```
◆ What do you want to initialize? (↑/↓ move · enter confirms · esc cancels)

>   Organization the root that groups the workspaces
    Product workspace inside an existing Organization new project inside the root
    Free-root product workspace independent new project

An Organization is the company root that groups the workspaces. Create one if
you are structuring the company — the products are born inside it.
```

Notice: each option has a short description beside it, and **the line below
changes as the cursor moves** — that is the active item's description, at
the moment you need it. No jargon: the wizard says "Organization", not
"container".

The operator moves to **Organization** and hits enter. The wizard asks for the
name (empty = use the current folder). Then comes the Summary:

```
Summary:

  type:      Organization (container: true)
  root:      C:\company\MinhaOrganizacao
  files:     golmet.yaml · CONSTITUTION.md · INDEX.md

◆ Confirm and create? (ENTER confirms · n goes back to editing · esc cancels)
```

ENTER creates. (`n` goes back to the previous step — what you typed stays
pre-filled; `esc` cancels everything without creating anything, at any
step.)

## What each created file keeps

The kit created three files — each one has a role in the journey:

- **`golmet.yaml`** — the Organization's manifest. This is where the kit
  knows that this is an org (`container: true`), which versioning model is
  in effect (`versioning: org-repo` — the org is the repository and the
  products are folders of it) and which products exist (`products: []`, for
  now).
- **`CONSTITUTION.md`** — the organization's principles: what is
  non-negotiable in the way of working. A stub to edit — it becomes a
  living document.
- **`INDEX.md`** — the org's navigation: the index of products and
  documents.

And one more the kit created without announcing it: the **`.gitignore`** —
because in an `org-repo` org the kit's work zone (`.golmet/`, where
checkpoints and history live) is never versioned.

## The step that is yours: versioning

The Organization was made to be your **versioning repository** — the
products are born as folders inside it and version in its repo (the
`org-repo` model). The kit creates the structure and the `.gitignore`; Git
itself is your operation:

```bash
git init
git add -A
git commit -m "organization created — products to follow"
```

The already-created `.gitignore` protects the work zone `.golmet/` from
versioning (checkpoints and history never go up). From here, the org is a
repo like any other — with the difference that every product folder you
version inside it carries the whole workflow within.

## The catalog

What the wizard didn't show: the Organization was just registered in the
kit's **global catalog**, at `~/.golmet/organizations.json`. Next time
someone creates a product and picks "inside an existing Organization", the
catalog's organizations show up in the list with their path beside them —
no typing paths. The org's golmet.yaml is the source of truth; the catalog
is just wizard convenience.

## What comes next

An empty Organization does nothing on its own. The next step is being born
inside it: [02 — create the project](/docs/getting-started/02-projeto).
