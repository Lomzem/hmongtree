import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import { plugin as shadcn } from '@shadcn/lint';
import project from './tooling/eslint/index.ts';

export default defineConfig(
	globalIgnores([
		'node_modules/',
		'.svelte-kit/',
		'.vercel/',
		'build/',
		'coverage/',
		'convex/_generated/',
		'src/lib/components/ui/'
	]),
	{ linterOptions: { noInlineConfig: true } },
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		plugins: { project },
		rules: {
			'no-undef': 'off',
			'max-depth': ['error', 2],
			'project/no-try-catch': 'error',
			'project/no-throw': 'error',
			'project/no-error-construction': 'error',
			'project/no-comments': 'error'
		}
	},
	{
		files: ['**/*.ts', '**/*.svelte'],
		extends: [ts.configs.recommendedTypeChecked],
		languageOptions: {
			parserOptions: { projectService: true, extraFileExtensions: ['.svelte'] }
		},
		rules: {
			'@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: { parserOptions: { parser: ts.parser } },
		plugins: { shadcn },
		settings: {
			shadcn: {
				ui: '#lib/components/ui',
				note: 'See docs/agents/lint.md and docs/agents/frontend.md for approved patterns.'
			}
		},
		rules: {
			'project/prefer-shadcn-select': 'error',
			'shadcn/no-arbitrary-values': 'error',
			'shadcn/no-inline-styles': 'error',
			'shadcn/no-restyle': ['error', { allow: ['layout'] }]
		}
	},
	{
		files: ['convex/auth/boundary.ts'],
		rules: { 'project/no-throw': 'off' }
	},
	prettier,
	svelte.configs.prettier,
	{ files: ['**/*.svelte.ts'], languageOptions: { parser: ts.parser } }
);
