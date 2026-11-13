# Agent instructions

## Working conventions

Organize authored application code by feature under `src/lib/features/<feature>/` and backend code under `convex/<feature>/`. Keep route files as thin SvelteKit entry points. Promote code to a shared module only when multiple features need the same contract.

Use current Svelte runes, snippets, event properties, and SvelteKit APIs. Put reusable reactive state in `.svelte.ts` modules and keep request-specific state out of server globals. Prefer inferred types and schema-derived types.

Use Effect for workflows, external operations, validation, resources, and typed failures. Use ordinary TypeScript for simple pure functions. Framework adapters interpret Effect results; keep the exception boundary documented and narrow.

Prefer shadcn-svelte controls before composing or building custom controls. Use semantic HTML for document structure. Before UI work, read `docs/agents/frontend.md`; before fixing lint failures or changing lint policy, read `docs/agents/lint.md`.

Authored code must pass the enforced comment, exception, nesting, and type-safety policies. Keep explanations in documentation. Generated Convex files and copied UI primitives have exact exclusions; keep feature logic outside them.

Before authentication work, read `docs/agents/auth.md`. Before deployment, external service calls, or review automation changes, read `docs/agents/operations.md` for free-tier and manual-review constraints.

Use the scripts in `package.json` as the command reference. Complete type checks, lint, behavioral tests, build, and fully redacted secret checks before shipping. Record decisions and verification in the existing `.scratch/<feature>/spec.md` at task boundaries.

## Agent skills

Before creating, fetching, or updating issues and specs, read `docs/agents/issue-tracker.md`.

Before triaging issues, read `docs/agents/triage-labels.md`.

Before exploring the codebase, read `docs/agents/domain.md`.

## Enforcement

| Rule                                          | Enforcement                                                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Typed failures; narrow framework translation  | ESLint `project/no-try-catch`, `no-throw`, `no-error-construction`; exact Convex boundary override |
| Explanations in docs                          | ESLint `project/no-comments`, stylesheet lint; inline ESLint configuration disabled                |
| At most two nested control-flow blocks        | ESLint `max-depth`                                                                                 |
| Sound types and inference                     | Strict TypeScript, unchecked-index checking, type-aware unsafe-operation rules                     |
| Shared Select control                         | ESLint `project/prefer-shadcn-select`                                                              |
| Theme and component variants                  | `@shadcn/lint` rules                                                                               |
| Production lint configuration stays connected | `tooling/eslint/policy.test.ts` exercises the real ESLint configuration                            |
| Quality checks before shipping                | `verify` script in CI; Lefthook pre-commit quality checks                                          |
| Credentials stay private                      | Ignored env files; fully redacted Gitleaks at commit, push, and CI                                 |
| Manual CodeRabbit reviews                     | `.coderabbit.yaml` and repository dashboard overrides                                              |

Feature ownership, choosing Effect appropriately, and checking shadcn before custom controls require review; the frontend and auth docs explain those judgment calls.
