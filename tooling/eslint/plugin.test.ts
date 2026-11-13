import { Linter } from 'eslint';
import * as svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import { describe, expect, it } from 'vitest';
import plugin from './index.ts';

const lint = (code: string, rule: string, filename = 'example.js') => {
	const parser = filename.endsWith('.svelte') ? svelteParser : tsParser;
	return new Linter().verify(
		code,
		[
			{
				files: ['**/*.{js,ts,svelte}'],
				languageOptions: {
					parser,
					ecmaVersion: 'latest',
					sourceType: 'module',
					parserOptions: { parser: tsParser }
				},
				plugins: { project: plugin },
				rules: { [`project/${rule}`]: 'error' }
			}
		],
		{ filename }
	);
};

describe('typed failure diagnostics', () => {
	it.each<[string, string]>([
		['try { work(); } catch { recover(); }', 'no-try-catch'],
		['try { work(); } finally { cleanup(); }', 'no-try-catch'],
		['throw failure;', 'no-throw'],
		["const failure = new Error('failed');", 'no-error-construction'],
		["const failure = Error('failed');", 'no-error-construction'],
		["const failure = new TypeError('failed');", 'no-error-construction'],
		["const failure = new globalThis.Error('failed');", 'no-error-construction']
	])('rejects %s', (code, rule) => {
		const messages = lint(code, rule);
		expect(messages).toHaveLength(1);
		expect(messages[0]).toMatchObject({ ruleId: `project/${rule}`, severity: 2 });
		expect(messages[0]?.message).toContain('Effect');
		expect(messages[0]?.message).toContain('docs/agents/lint.md');
	});

	it.each<[string, string]>([
		['const result = Effect.try({ try: work, catch: toFailure });', 'no-try-catch'],
		["const result = Effect.fail(new MissingMember({ id: 'member' }));", 'no-throw'],
		["const result = Effect.fail(new MissingMember({ id: 'member' }));", 'no-error-construction']
	])('accepts typed composition %s', (code, rule) => {
		expect(lint(code, rule)).toEqual([]);
	});

	it('inspects TypeScript in Svelte script blocks', () => {
		const messages = lint(
			'<script lang="ts">const load = (): never => { throw failure; };</script>',
			'no-throw',
			'Example.svelte'
		);
		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe('project/no-throw');
	});
});

describe('comment diagnostics', () => {
	it.each<[string, string, number]>([
		['const value = 1; // rationale', 'example.js', 1],
		['/* rationale */ const value: number = 1;', 'example.ts', 1],
		['<!-- rationale --><h1>Title</h1>', 'Example.svelte', 1],
		[
			'<script lang="ts">/* rationale */ const value = 1;</script><p>{value}</p>',
			'Example.svelte',
			1
		],
		['<p>Text</p><style>/* rationale */ p { color: red; }</style>', 'Example.svelte', 1],
		[
			'<!-- rationale --><p>Text</p><style>p { /* rationale */ color: red; }</style>',
			'Example.svelte',
			2
		]
	])('rejects comments in %s', (code, filename, count) => {
		const messages = lint(code, 'no-comments', filename);
		expect(messages).toHaveLength(count);
		expect(messages.map((message) => message.ruleId)).toEqual(
			Array.from({ length: count }, () => 'project/no-comments')
		);
	});

	it.each<[string, string]>([
		["const url = 'https://example.test'; const text = '/* literal */';", 'example.js'],
		['<script>const text = "<!-- literal -->";</script><p>{text}</p>', 'Example.svelte'],
		['<p>Text</p><style>p::before { content: "/* literal */"; }</style>', 'Example.svelte']
	])('preserves comment-like literal content %s', (code, filename) => {
		expect(lint(code, 'no-comments', filename)).toEqual([]);
	});
});

describe('Select diagnostics', () => {
	it('rejects a statically known dynamic native select', () => {
		const messages = lint(
			"<svelte:element this={'select'} />",
			'prefer-shadcn-select',
			'Example.svelte'
		);
		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe('project/prefer-shadcn-select');
	});

	it('rejects native selects with a manual migration guide', () => {
		const messages = lint(
			'<select name="language"><option value="hmn">Hmong</option></select>',
			'prefer-shadcn-select',
			'Example.svelte'
		);
		expect(messages).toHaveLength(1);
		expect(messages[0]).toMatchObject({ ruleId: 'project/prefer-shadcn-select' });
		expect(messages[0]?.message).toContain('Select.Root');
		expect(messages[0]?.fix).toBeUndefined();
	});

	it('accepts shadcn composition and ordinary semantic HTML', () => {
		expect(
			lint(
				'<script>import * as Select from "#lib/components/ui/select/index.js";</script><form><h1>Language</h1><Select.Root type="single"><Select.Trigger>Language</Select.Trigger></Select.Root></form>',
				'prefer-shadcn-select',
				'Example.svelte'
			)
		).toEqual([]);
	});
});
