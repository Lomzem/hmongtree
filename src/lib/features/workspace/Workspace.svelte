<script lang="ts">
	import { useAuth, useQuery } from 'convex-svelte';
	import { UserButton } from 'svelte-clerk';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { api } from '../../../../convex/_generated/api';

	const auth = useAuth();
	const viewer = useQuery(api.workspace.queries.viewer, () => (auth.isAuthenticated ? {} : 'skip'));
</script>

<main class="mx-auto min-h-screen max-w-5xl space-y-10 px-6 py-10">
	<header class="flex items-center justify-between gap-4">
		<Button href="/" variant="ghost">Hmongtree</Button>
		<UserButton />
	</header>
	<Card.Root class="max-w-2xl">
		<Card.Header>
			<Card.Title>Your workspace</Card.Title>
			<Card.Description>A place for your family connections.</Card.Description>
		</Card.Header>
		<Card.Content aria-live="polite">
			{#if auth.isLoading}
				<p class="text-muted-foreground">Opening your workspace…</p>
			{:else if !auth.isAuthenticated || viewer.error}
				<p>We couldn’t open your workspace. Please sign out and sign in again.</p>
			{:else if viewer.isLoading}
				<p class="text-muted-foreground">Opening your workspace…</p>
			{:else if viewer.data}
				<p>Welcome, {viewer.data.name}. Your workspace is ready.</p>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
