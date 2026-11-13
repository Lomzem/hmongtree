import type { Handle } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'svelte-clerk/server';
import { authConfigured } from '#lib/features/auth/configuration.server.js';

const clerkHandler = withClerkHandler();

export const handle: Handle = ({ event, resolve }) => {
	if (!authConfigured) return resolve(event);
	return clerkHandler({ event, resolve });
};
