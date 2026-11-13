import { setupAuth } from 'convex-svelte';
import { useClerkContext } from 'svelte-clerk';
import { Effect, Result } from 'effect';

export function setupClerkConvex() {
	const clerk = useClerkContext();

	setupAuth(() => ({
		isLoading: !clerk.isLoaded,
		isAuthenticated: Boolean(clerk.auth.userId),
		fetchAccessToken: async ({ forceRefreshToken }) => {
			const result = await Effect.runPromise(
				Effect.tryPromise(
					() =>
						clerk.session?.getToken({ template: 'convex', skipCache: forceRefreshToken }) ??
						Promise.resolve(null)
				).pipe(Effect.result)
			);
			return Result.isSuccess(result) ? result.success : null;
		}
	}));
}
