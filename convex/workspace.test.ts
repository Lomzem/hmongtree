import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';

const modules = import.meta.glob('./**/*.*s');

describe('workspace viewer', () => {
	it('rejects an unauthenticated request', async () => {
		const backend = convexTest(schema, modules);
		await expect(backend.query(api.workspace.queries.viewer, {})).rejects.toMatchObject({
			data: { code: 'UNAUTHENTICATED' }
		});
	});

	it('returns only the authenticated viewer identity', async () => {
		const backend = convexTest(schema, modules).withIdentity({
			subject: 'family-member-one',
			name: 'Mai'
		});
		await expect(backend.query(api.workspace.queries.viewer, {})).resolves.toEqual({
			subject: 'family-member-one',
			name: 'Mai'
		});
	});
});
