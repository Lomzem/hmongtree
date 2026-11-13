import { CLERK_SECRET_KEY } from '$app/env/private';
import { PUBLIC_CLERK_PUBLISHABLE_KEY, PUBLIC_CONVEX_URL } from '$app/env/public';
import { authenticationConfigured } from './configuration';

export const authConfigured = authenticationConfigured({
	publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
	secretKey: CLERK_SECRET_KEY,
	convexUrl: PUBLIC_CONVEX_URL
});
