# Quickstart

## 1. Install

```bash
npm i -g golmet-cli
```

## 2. Initialize a workspace

```bash
golmet init my-product
```

The wizard asks for your agent, your repositories and creates the workspace layout.

## 3. Open your agent in the folder

```bash
opencode
```

Or the engine you picked during install — the MCP server of the kit is already configured.

## 4. Talk

Describe the product. The workflow produces charter → requirements (RNs) → specs → tasks — all markdown, all versioned in your git.

## 5. Keep it true

```bash
golmet validate
```

The guardian blocks anything that drifted.
