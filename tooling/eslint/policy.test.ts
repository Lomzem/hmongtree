import { ESLint } from 'eslint';
import { expect, it } from 'vitest';

it.each([
	[
		'src/lib/features/auth/setup-clerk-convex.svelte.ts',
		'export const value = $state(0); throw value;',
		'project/no-throw'
	],
	[
		'src/lib/features/auth/configuration.ts',
		'export const value: any = 1;',
		'@typescript-eslint/no-explicit-any'
	],
	[
		'src/lib/features/auth/SetupNotice.svelte',
		'<select><option>Choose</option></select>',
		'project/prefer-shadcn-select'
	],
	[
		'src/lib/features/auth/SetupNotice.svelte',
		'<!-- eslint-disable project/no-comments --><p>Text</p>',
		'project/no-comments'
	],
	[
		'src/lib/features/auth/configuration.ts',
		'export function depth(a: boolean, b: boolean, c: boolean) { if(a) { if(b) { if(c) { return 1; } } } return 0; }',
		'max-depth'
	]
])('enforces the repository policy for %s', async (filePath, source, ruleId) => {
	const results = await new ESLint().lintText(source, { filePath });
	expect(results.flatMap((result) => result.messages.map((message) => message.ruleId))).toContain(
		ruleId
	);
});
