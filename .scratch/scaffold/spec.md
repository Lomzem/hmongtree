# Repository scaffold

Status: complete; preparing commit and push

## Accepted decisions

Use Sol exclusively for this task. Scaffold current Svelte/SvelteKit, TypeScript, Bun, Vercel adapter, Prettier, ESLint, Vitest, shadcn-svelte, @shadcn/lint, Convex, Clerk, Lefthook, and Effect.

Prove an email-code sign-in flow, protected route, and authenticated Convex operation. OAuth remains a future provider configuration. No product features in this increment.

Effect owns application workflows, external calls, validation, and typed expected failures. Ordinary TypeScript serves pure functions; Svelte runes own UI reactivity. Framework adapters translate failures when framework contracts require errors, redirects, or transaction rollback.

Organize by feature. Prefer shadcn controls, then composition, then justified custom components. Preserve semantic HTML. Reject native select with actionable guidance.

Enforce no authored comments, try/catch, explicit throw, Error construction, explicit any or unsafe any operations. Permit sound inference. Maximum two nested control-flow blocks per function. Generator-owned Convex output and copied shadcn primitives have narrow exclusions.

## Verification and handoff

Implemented: SvelteKit 3/Svelte 5, Effect 4, Bun lockfile, Vercel adapter, shadcn controls, strict typed ESLint policy with actionable diagnostics, stylesheet comment check, Lefthook quality/secret hooks, Clerk server/client flow, Convex auth adapter and generated API, and agent docs.

Verified: frozen dependency installation; zero type errors or warnings; Prettier, ESLint, stylesheet policy; 30 passing tests including native/dynamic select and comment rules plus authenticated/unauthenticated Convex queries; Vercel build; five production HTTP routes without credentials; fully redacted staged and history secret scans.

Additional accepted scope: keep costs on free tiers, avoid redundant API requests, initialize CodeRabbit with automatic reviews disabled, use shared browser for dashboard setup, conventional commit, push, settle current T3 thread.

Provider progress: Clerk Hobby hmongtree development app created; email-code defaults confirmed, passwords disabled. Google social provider disabled; convex JWT template saved. CodeRabbit Free account and existing repository installation verified; automatic/incremental/draft/keyword/label triggers disabled and persisted after reload; unsolicited replies and finishing-touch automation off. Convex hmongtree development deployed to astute-hamster-212 with Clerk issuer set; cloud unauthenticated query rejects with UNAUTHENTICATED. Live browser test-email sign-up, code verification, protected redirect, and authenticated cloud query all succeeded. This proves the configured JWT bridge; actual email delivery is not exercised by Clerk test addresses.

Clerk keys transferred directly from authorized dashboard into ignored mode-600 .env.local using a temporary browser download that was deleted; keys never printed. Live browser sign-up with Clerk's reserved test email and documented test code reached /app and rendered the authenticated cloud viewer.

$correct audit: no repeated mistake class established by the two pre-scaffold commits; no PRs/reverts. A configuration coverage gap was fixed with five tests through the actual ESLint config, plus a rule/enforcement table and a single CI verification job. Removing the final rune-file parser override reproduces the actual earlier failure (missing type information); the new integration test fails. Restoring it passes. CI cancels superseded runs and uses the same verify command as local development.

Browser refresh of /app retained the verified session and authenticated Convex data. Final local checks: zero type errors/warnings, full formatting/ESLint/stylesheet checks, 35 tests, Vercel build, and redacted staged/history secret checks pass. Production policy negative control fails without the rune parser override and passes restored.

Sign-out succeeded; a fresh /app request redirects to /sign-in. CodeRabbit dashboard settings were saved/reloaded, and the Convex backend was deployed through normal CLI codegen. Production inbox delivery and a public Vercel deployment are outside the verified development flow.

Delivery: conventional scaffold commit and push to origin/main requested; final remote-head check and T3 settlement follow. No unresolved implementation work.
