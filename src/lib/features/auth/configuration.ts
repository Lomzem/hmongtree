import { Effect, Result, Schema } from 'effect';

const Configuration = Schema.Struct({
	publishableKey: Schema.NonEmptyString,
	secretKey: Schema.NonEmptyString,
	convexUrl: Schema.URLFromString
});

export function authenticationConfigured(input: unknown): boolean {
	return Result.isSuccess(
		Effect.runSync(Schema.decodeUnknownEffect(Configuration)(input).pipe(Effect.result))
	);
}
