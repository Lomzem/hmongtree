# Frontend conventions

## Feature boundaries

Keep a feature's components, reactive state, workflows, schemas, and tests beside one another under `src/lib/features/<feature>/`. Routes compose those features and handle framework concerns. Backend functions live under the matching `convex/<feature>/` directory because Convex discovers its functions there. Shared copied UI primitives live in `src/lib/components/ui/`.

Use `.svelte.ts` for reusable rune-based reactive state. Ordinary `.ts` files serve pure transforms, schemas, and Effect programs. Derive UI values with `$derived`; reserve `$effect` for synchronization with external systems. Use `$props`, snippets, event properties, and the installed SvelteKit version's generated route types. Keep per-user server state request-scoped.

This repo uses SvelteKit 3's `#lib` package imports. Include the actual `.js` or `.svelte` extension required by the package-import mapping. Check installed types before copying older SvelteKit or Effect examples.

## Component selection

First inspect installed shadcn-svelte components and its current registry. Add the appropriate component with the shadcn-svelte CLI if it is absent. Compose those primitives before introducing custom controls. Use a custom control when the available primitives cannot meet a concrete accessibility or interaction requirement, and record the reason with the feature decision.

Native headings, paragraphs, forms, lists, and layout elements remain useful semantic structure. Native selects fail lint; follow the migration guide in `lint.md`. Clerk's provider-owned authentication widgets are an integration boundary and preserve email-code and future OAuth flows.

Use theme tokens and component variants. Let a parent own layout; let controls own their visual treatment. Change shared component variants deliberately rather than restyling individual instances. The installed `@shadcn/lint` diagnostics explain the accepted replacement.

## Exclusions

Treat `src/lib/components/ui/` as copied upstream primitives for lint policy purposes. Add authored behavior in the owning feature. Updating the copied primitives requires type checks and interaction verification; their lint exclusion does not waive review. The small shared `utils.ts` module remains authored and linted.
