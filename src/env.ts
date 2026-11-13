import { defineEnvVars } from '@sveltejs/kit/env';
import { clerkEnvVars } from 'svelte-clerk/env';

export const variables = defineEnvVars({
	...clerkEnvVars(),
	PUBLIC_CONVEX_URL: {
		public: true,
		schema: (value: string | undefined) => value,
		description: 'Convex deployment URL.'
	}
});
