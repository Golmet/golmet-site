
# The init wizard — what happens on screen

Tutorial [01](/docs/getting-started/01-organizacao) showed the wizard in
action. This page documents the mechanism — the guarantees the wizard gives
and the ones you can demand from it.

## The principle: never creates without asking

**Bare `golmet init` is always interactive** — it asks, shows the summary,
and only creates on ENTER at the confirm. It is the kit's answer to the
accident that motivated the rule: an init run in the wrong folder (the
HOME, next to the kit's global installation) created a workspace mixed with
the kit's own state. Hence: **the init never creates at the HOME root**,
and scripts/CI require explicit flags (`--org` or `--into <container>`)
with `--yes` — without a TTY and without flags, the init fails closed
(exit 2, nothing written, the remediation cites the flags).

## The guarantees at any step

The whole wizard runs in raw mode (the same arsenal as install), and the
guarantees are transversal: **esc/CTRL+C cancel everything, at any step** —
nothing is created before the final confirm. **← on empty text goes back to
the previous step**, with the typed value **pre-echoed for editing**; `n` at
the confirm also goes back to editing (it does not cancel). Text fields
accept UTF-8 (accents) and backspace erases the whole character — in raw
mode the keyboard ESC reaches the program, something the console captures
in cooked mode.

## The recommended mode in practice

For those who prefer the fast path, the flags are the wizard as a command:
`golmet init --org` (declares the org, creates the `.gitignore`, registers
in the global catalog) and `golmet init <produto> --into <container>`
(delivers the product in the org's declared versioning model). `--yes`
skips confirmation with explicit flags. The full declaration of the paths
is in [FORMAT §2](/docs/format) and in the reference
([commands.md](/docs/reference/commands)).
