import { ConvexError } from 'convex/values';

export function rejectUnauthenticated(): never {
	throw new ConvexError({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
}
