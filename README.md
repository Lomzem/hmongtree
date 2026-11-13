# hmongtree

SvelteKit application with Clerk email-code authentication, authenticated Convex functions, and Effect workflows. Uses Bun, TypeScript, shadcn-svelte, and the Vercel adapter.

## Development

Install Bun and Node versions satisfying `package.json`, plus [Gitleaks](https://github.com/gitleaks/gitleaks) for the commit and push secret checks.

```sh
bun install
cp .env.example .env.local
bun run dev
```

Without credentials, the application displays setup guidance. Follow [authentication setup](docs/agents/auth.md) to connect Clerk and Convex. Keep keys in ignored environment files or the hosting provider's secret store.

```sh
bun run verify
```

This checks types, formatting, ESLint, behavioral tests, and the production Vercel build. Lefthook installs on dependency installation and runs quality checks plus a fully redacted staged secret scan before commits; pushes scan Git history. The scripts in `package.json` are the command reference.

## Project conventions

Authored features live under `src/lib/features/`; Convex functions live under matching feature directories in `convex/`. Routes compose features. Copied shadcn controls live under `src/lib/components/ui/`. See [AGENTS.md](AGENTS.md), [frontend conventions](docs/agents/frontend.md), and [lint repair guidance](docs/agents/lint.md).

[Operations](docs/agents/operations.md) documents free-tier usage, deployment constraints, and manual CodeRabbit reviews. Automatic CodeRabbit reviews are disabled in `.coderabbit.yaml`.
