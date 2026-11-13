<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { PUBLIC_CONVEX_URL } from '$app/env/public';
	import { ClerkProvider } from 'svelte-clerk';
	import ConvexProvider from '#lib/features/auth/ConvexProvider.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="Keep your family connections close with Hmongtree." />
</svelte:head>

{#if data.configured && PUBLIC_CONVEX_URL}
	<ClerkProvider
		signInUrl="/sign-in"
		signUpUrl="/sign-up"
		signInFallbackRedirectUrl="/app"
		signUpFallbackRedirectUrl="/app"
	>
		<ConvexProvider url={PUBLIC_CONVEX_URL}>
			{@render children()}
		</ConvexProvider>
	</ClerkProvider>
{:else}
	{@render children()}
{/if}
