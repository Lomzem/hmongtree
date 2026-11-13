import type { Rule } from 'eslint';
import type { CallExpression, Expression, NewExpression, SourceLocation, Super } from 'estree';
import type { AST, StyleContext } from 'svelte-eslint-parser';
import type { Node as StyleNode } from 'postcss';

const docs = 'https://github.com/Lomzem/hmongtree/blob/main/docs/agents/lint.md';

const metadata = (
	name: string,
	description: string,
	messages: Record<string, string>
): Rule.RuleMetaData => ({
	type: 'problem',
	docs: { description, url: `${docs}#${name}` },
	schema: [],
	messages
});

const noTryCatch: Rule.RuleModule = {
	meta: metadata('no-try-catch', 'Represent failures with Effect', {
		forbidden:
			'Use Effect.try or Effect.tryPromise to capture external failures, then compose typed recovery with Effect. See docs/agents/lint.md#no-try-catch.'
	}),
	create(context) {
		return {
			TryStatement(node) {
				context.report({ node, messageId: 'forbidden' });
			}
		};
	}
};

const noThrow: Rule.RuleModule = {
	meta: metadata('no-throw', 'Keep expected failures in the typed error channel', {
		forbidden:
			'Return Effect.fail with a typed domain error. Map failures at the framework boundary; Convex transaction aborts belong in the designated adapter. See docs/agents/lint.md#no-throw.'
	}),
	create(context) {
		return {
			ThrowStatement(node) {
				context.report({ node, messageId: 'forbidden' });
			}
		};
	}
};

const errorConstructors = new Set([
	'Error',
	'AggregateError',
	'EvalError',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
	'URIError'
]);

const isErrorConstructor = (callee: Expression | Super) =>
	(callee.type === 'Identifier' && errorConstructors.has(callee.name)) ||
	(callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'globalThis' &&
		!callee.computed &&
		callee.property.type === 'Identifier' &&
		errorConstructors.has(callee.property.name));

const noErrorConstruction: Rule.RuleModule = {
	meta: metadata('no-error-construction', 'Use typed domain failures', {
		forbidden:
			'Define a tagged domain failure and return it through Effect.fail; capture SDK exceptions with Effect.try or Effect.tryPromise. See docs/agents/lint.md#no-error-construction.'
	}),
	create(context) {
		const check = (node: NewExpression | CallExpression) => {
			if (isErrorConstructor(node.callee)) {
				context.report({ node, messageId: 'forbidden' });
			}
		};
		return { NewExpression: check, CallExpression: check };
	}
};

interface SvelteStyleServices {
	getStyleContext: () => StyleContext;
	styleNodeLoc: (node: StyleNode) => Partial<SourceLocation>;
}

const hasStyleServices = (value: unknown): value is SvelteStyleServices =>
	typeof value === 'object' &&
	value !== null &&
	'getStyleContext' in value &&
	typeof value.getStyleContext === 'function' &&
	'styleNodeLoc' in value &&
	typeof value.styleNodeLoc === 'function';

const isSvelteElement = (value: unknown): value is AST.SvelteElement =>
	typeof value === 'object' && value !== null && 'type' in value && value.type === 'SvelteElement';

const noComments: Rule.RuleModule = {
	meta: metadata('no-comments', 'Keep explanations in documentation', {
		forbidden:
			'Express intent with names and small functions; move rationale to the relevant documentation. Inline suppression comments are also forbidden. See docs/agents/lint.md#no-comments.',
		style:
			'Use CSS, PostCSS, or SCSS so the comment policy can inspect style syntax. See docs/agents/lint.md#no-comments.'
	}),
	create(context) {
		const source = context.sourceCode;
		const reported = new Set<string>();
		const report = (comment: { loc?: SourceLocation | null }) => {
			if (!comment.loc) return;
			const key = `${comment.loc.start.line}:${comment.loc.start.column}`;
			if (reported.has(key)) return;
			reported.add(key);
			context.report({ loc: comment.loc, messageId: 'forbidden' });
		};
		const inspectStyle = () => {
			const services: unknown = source.parserServices;
			if (!hasStyleServices(services)) return;
			const style = services.getStyleContext();
			if (style.status === 'success') {
				style.sourceAst.walkComments((comment) => {
					const loc = services.styleNodeLoc(comment);
					if (loc.start && loc.end) report({ loc: { start: loc.start, end: loc.end } });
				});
				return;
			}
			if (style.status === 'unknown-lang') {
				context.report({ loc: { line: 1, column: 0 }, messageId: 'style' });
			}
		};
		return {
			SvelteHTMLComment(node: unknown) {
				if (typeof node !== 'object' || node === null || !('loc' in node)) return;
				if (!isSourceLocation(node.loc)) return;
				report({ loc: node.loc });
			},
			'Program:exit'() {
				source.getAllComments().forEach(report);
				inspectStyle();
			}
		};
	}
};

const isPosition = (value: unknown): value is SourceLocation['start'] =>
	typeof value === 'object' &&
	value !== null &&
	'line' in value &&
	typeof value.line === 'number' &&
	'column' in value &&
	typeof value.column === 'number';

const isSourceLocation = (value: unknown): value is SourceLocation =>
	typeof value === 'object' &&
	value !== null &&
	'start' in value &&
	isPosition(value.start) &&
	'end' in value &&
	isPosition(value.end);

const isSelectElement = (node: AST.SvelteElement): boolean => {
	if (node.kind === 'html') return node.name.name === 'select';
	if (node.kind !== 'special' || node.name.name !== 'svelte:element') return false;
	return node.startTag.attributes.some(
		(attribute) =>
			attribute.type === 'SvelteSpecialDirective' &&
			attribute.expression.type === 'Literal' &&
			attribute.expression.value === 'select'
	);
};

const preferShadcnSelect: Rule.RuleModule = {
	meta: metadata('prefer-shadcn-select', 'Use the shared shadcn-svelte Select', {
		forbidden:
			"Import * as Select from '#lib/components/ui/select/index.js' and compose Select.Root, Trigger, Content, and Item. Preserve labels, bindings, form values, and keyboard behavior; see docs/agents/lint.md#prefer-shadcn-select."
	}),
	create(context) {
		return {
			SvelteElement(node: unknown) {
				if (isSvelteElement(node) && isSelectElement(node)) {
					context.report({ node: node.startTag, messageId: 'forbidden' });
				}
			}
		};
	}
};

export default {
	meta: { name: 'hmongtree', version: '1.0.0' },
	rules: {
		'no-try-catch': noTryCatch,
		'no-throw': noThrow,
		'no-error-construction': noErrorConstruction,
		'no-comments': noComments,
		'prefer-shadcn-select': preferShadcnSelect
	}
};
