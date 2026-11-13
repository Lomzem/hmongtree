# Fixing lint failures

Read the diagnostic, preserve the caller-visible behavior, and use the matching repair below. Rules that require a semantic rewrite provide guidance rather than an automatic fix. Run the lint and test scripts defined in `package.json` after the repair.

## no-try-catch

Capture a synchronous external operation with `Effect.try`, or an asynchronous SDK call with `Effect.tryPromise`. Map its unknown failure to a tagged domain failure. Compose recovery inside Effect; execute the program at the framework boundary. An object property named `try` or `catch` in these Effect APIs is valid.

Both catch and finally clauses are covered. Model resource acquisition and release with Effect's scoped resource APIs so cleanup also runs on cancellation.

## no-throw

Represent expected failures with `Effect.fail` and a tagged failure type. Callers must handle the resulting error channel or propagate it. Keep success and failure payloads serializable when crossing Convex's transport boundary.

SvelteKit `error()` and `redirect()` are framework boundary operations. Invoke them after interpreting the Effect result. Convex transaction rollback requires an exception: the designated Convex adapter translates a typed failure into `ConvexError`. A returned error value does not roll back writes. Keep that exception narrow in ESLint configuration; inline suppression comments are rejected.

## no-error-construction

Define failures with semantic tags and typed payloads, then return them through Effect. A failure such as `MissingMember` is more useful to a caller than a generic `Error` containing prose. Capture exceptions produced by dependencies at the boundary rather than manufacturing built-in exceptions in application code.

The rule checks direct built-in error constructors, calls without `new`, and `globalThis.Error`-style references. It is a syntax guard, not a proof against deliberately aliasing or reflecting on constructors. Typed failure classes remain available.

## no-comments

Use names, types, and small functions to explain behavior. Put rationale, contracts, and operational instructions in the relevant documentation. JavaScript and TypeScript line and block comments, Svelte HTML comments, and comments in Svelte CSS, PostCSS, and SCSS are rejected. Standalone stylesheets are parsed by the stylesheet lint script. Comment-like text inside strings remains valid. Use a supported style language so the parser can inspect its comments.

Keep generators and installed shadcn component source under their narrowly configured exclusions. Exclusions exist for generated or upstream-owned content; place authored feature logic outside those paths. Change an exact configuration entry when a framework contract requires an exception.

## prefer-shadcn-select

Import `* as Select` from `#lib/components/ui/select/index.js`. Compose `Select.Root`, `Select.Trigger`, `Select.Content`, and `Select.Item`, following the installed components' types. Preserve the accessible label, selected value, disabled state, form name, placeholder, and change handling. Use the shared shadcn label component where appropriate.

A native `<select>` cannot be rewritten safely by renaming tags: its value binding, options, keyboard interaction, and form submission must be migrated together. Check the current [shadcn-svelte Select documentation](https://www.shadcn-svelte.com/docs/components/select) before changing the control.

For other controls, check shadcn-svelte first, compose its components next, and build a custom component only when the available primitives cannot satisfy the behavior. Semantic headings, paragraphs, forms, and layout elements remain ordinary HTML.

## Control-flow depth

Keep at most two nested control-flow blocks within a function. Return early for rejected inputs and exhausted cases. Extract a function when a nested operation has a meaningful name and contract. Svelte template hierarchy is separate from control-flow depth; use readable component boundaries instead of flattening semantic markup to satisfy a code metric.

## Type safety

Preserve sound inference. Give unknown external data an `unknown` type and parse it at the system boundary. Derive Convex types from its schema and generated API. Replace unsafe values and operations with validated types rather than an assertion that conceals uncertainty. Explicit `any` and unsafe assignment, calls, member access, arguments, and returns fail lint.

Type-aware rules require a file to belong to the appropriate TypeScript project. Fix project inclusion or parser configuration when that contract is missing; do not weaken the application rules to silence a configuration failure.
