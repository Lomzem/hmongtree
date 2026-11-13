import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import postcss from 'postcss';

const violations: string[] = [];
for await (const path of glob('src/**/*.css')) {
	const root = postcss.parse(await readFile(path, 'utf8'), { from: path });
	root.walkComments((comment) => {
		violations.push(
			`${path}:${comment.source?.start?.line ?? 1}: Remove the comment; put rationale in docs/agents/frontend.md.`
		);
	});
}
if (violations.length > 0) {
	console.error(violations.join('\n'));
	process.exitCode = 1;
}
