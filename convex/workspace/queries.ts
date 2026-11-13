import { v } from 'convex/values';
import { Effect, Result } from 'effect';
import { query } from '../_generated/server';
import { rejectUnauthenticated } from '../auth/boundary';

export const viewer = query({
	args: {},
	returns: v.object({ subject: v.string(), name: v.string() }),
	handler: async (ctx) => {
		const result = await Effect.runPromise(
			Effect.tryPromise(() => ctx.auth.getUserIdentity()).pipe(
				Effect.flatMap((identity) =>
					identity
						? Effect.succeed({ subject: identity.subject, name: identity.name ?? 'Family member' })
						: Effect.fail({ _tag: 'Unauthenticated' as const })
				),
				Effect.result
			)
		);
		if (Result.isFailure(result)) return rejectUnauthenticated();
		return result.success;
	}
});
