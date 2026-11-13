import { describe, expect, it } from 'vitest';
import { authenticationConfigured } from './configuration';

const configured = {
	publishableKey: 'example-publishable',
	secretKey: 'example-private',
	convexUrl: 'https://example.convex.cloud'
};

describe('authentication configuration', () => {
	it('enables authentication when all required settings are present', () => {
		expect(authenticationConfigured(configured)).toBe(true);
	});

	it.each([
		{ ...configured, publishableKey: undefined },
		{ ...configured, secretKey: '' },
		{ ...configured, convexUrl: undefined },
		{ ...configured, convexUrl: 'not-a-url' }
	])('keeps the setup page available for incomplete or invalid settings', (configuration) => {
		expect(authenticationConfigured(configuration)).toBe(false);
	});
});
