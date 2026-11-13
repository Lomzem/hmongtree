import { redirect } from '@sveltejs/kit';
import { authConfigured } from '#lib/features/auth/configuration.server.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!authConfigured) return { configured: false };
	if (!locals.auth().userId) redirect(303, '/sign-in');
	return { configured: true };
};
