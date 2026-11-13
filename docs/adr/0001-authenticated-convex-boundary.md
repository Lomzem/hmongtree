# Clerk identity with Convex authorization

Use Clerk for email-code authentication and Convex for authenticated backend operations. Keep Clerk's community Svelte integration and the Convex token bridge in the auth feature so future OAuth providers can reuse the same identity boundary. Convex verifies identity independently; a protected SvelteKit route alone does not authorize backend access.

Expected failures travel through Effect's typed error channel. SvelteKit adapters interpret them as framework redirects or errors. A single Convex adapter may throw `ConvexError` because returning an error value would commit writes rather than abort a transaction. Generated types and copied UI primitives retain their upstream syntax under exact lint exclusions.
