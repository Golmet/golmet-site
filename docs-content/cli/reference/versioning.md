<p align="center">English | <a href="versioning.pt-br.md">Português (Brasil)</a></p>

# Versioning (Conventional Commits → semver)

The version of the kit is decided by **the merge, not by a person**: every
merge to `main` runs the version workflow, which reads the commit subjects
since the last `v*` tag, classifies them by Conventional Commits and computes
the next semver. **The tag is the single source of truth** - the published
npm version always equals the tag. On every bump, the version workflow also
**commits the version into the repo** (`chore(release): vX.Y.Z`, stamped
into all 6 `package.json` files) and pushes it to `main` before tagging —
the tag is cut **on that bump commit**, so `git show vX.Y.Z:package.json`
always equals `vX.Y.Z` and a checkout of the tag is publishable as-is.
Direct push by the workflow uses a deploy key (the builtin `GITHUB_TOKEN`
cannot receive ruleset bypass); the publish-time stamp in the release
workflow remains as a verification guard. Tags cut before this mechanism
(`v1.7.2` and earlier) carry the old `1.0.0` placeholder in their tree.

## The commit format

```
<type>(<optional scope>)!: <subject>

optional body
BREAKING CHANGE: <optional footer>
```

Valid types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build`
`ci` `chore` `revert`. Every PR commit (except merge commits) and the PR
title are validated by CI — a commit outside the pattern does not enter
`main`, because it would be invisible to the version calculation.

## The bump rule

| Commits since the last `v*` tag | Bump | Example |
|---|---|---|
| `feat:` | **minor** | `feat(lint): L15 binary manifest check` |
| `fix:` | **patch** | `fix(launcher): resolve fallback exit code` |
| any type with `!`, or `BREAKING CHANGE:` footer | **major** | `feat!!: rename init flags` |
| only `docs:` `chore:` `refactor:` `test:` `ci:` `style:` `build:` | **none** | no tag, no release |

Precedence is semver's: major > minor > patch. One `feat!` among ten `fix`
commits bumps the major.

## The pipeline

1. **PR** (`.github/workflows/ci.yml`) — three gates in parallel: the test
   matrix (gofmt, vet, test, build, kit lint ×3 OS), `conventional-commits`
   (subjects + PR title) and `release-readiness` (version sync across the 6
   `package.json` files, `npm pack --dry-run` shape ×6, cross-compile smoke
   of the 5 release targets, launcher contract + dispatch + fallback).
2. **Merge to `main`** (`.github/workflows/version.yml`) — commits since the
   last tag are classified; no releasable commit ends here silently. With a
   bump: the annotated `vX.Y.Z` tag is created on HEAD, pushed, and the
   release workflow is dispatched explicitly (a tag push made with the
   `GITHUB_TOKEN` does not trigger workflows — `workflow_dispatch` is the
   documented exception).
3. **Tag** (`.github/workflows/release.yml`) — cross-compiles the 5
   platforms with the version stamped by the tag, SHA-256 checksums, GitHub
   Release (idempotent: create falls back to upload `--clobber` on re-run),
   release notes as a Conventional Commits digest, then npm: token
   pre-flight (`npm whoami`, fail fast), the 5 platform packages first, the
   main package last, already-published packages are skipped. **Any failed
   publish turns the job red** — the GitHub Release and its assets stay up,
   and a re-run completes only what is missing.

## Tag history note: v1.0.0

The first tag predates this pipeline. `v1.0.0` was pushed by hand as a
**lightweight** tag on `5ffacab`, half-way up the `release/v1.0.0` branch, so
the commits that landed after it on that branch — including the `feat(ci)`
that introduced this very version workflow — fell outside the tag and shipped
as `v1.1.0`. That is why the `v1.1.0` tag sits on the merge commit of the
`release/v1.0.0` PR: the merge carried the `feat(ci)`, and `feat` bumps the
minor. The tag stays as-is: it is already published and referenced by npm
releases, and re-cutting it would force-push a public tag. Every tag from
`v1.1.0` on is annotated and created by the workflow.

## Manual release

Tags pushed manually (`git tag v1.2.3 && git push origin v1.2.3`) release
through the same path. The release workflow also accepts a manual dispatch
(Actions → release → tag), useful to resume an interrupted publish — the
npm steps are idempotent.
