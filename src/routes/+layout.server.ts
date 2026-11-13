import { buildClerkProps } from 'svelte-clerk/server';
import { authConfigured } from '#lib/features/auth/configuration.server.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	if (!authConfigured) {
		return { configured: false, signedIn: false, initialState: undefined };
	}

	const auth = locals.auth();
	return {
		configured: true,
		signedIn: Boolean(auth.userId),
		...buildClerkProps(auth)
	};
};
