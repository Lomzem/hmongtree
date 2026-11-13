<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import SetupNotice from '#lib/features/auth/SetupNotice.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Hmongtree</title>
</svelte:head>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-6 py-16">
	<div class="max-w-2xl space-y-5">
		<p class="text-lg font-medium text-primary">Hmongtree</p>
		<h1 class="text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
			Every connection has a story.
		</h1>
		<p class="max-w-lg text-lg text-muted-foreground">
			A place to keep your family connections close.
		</p>
	</div>
	{#if data.configured}
		<div class="flex flex-wrap gap-3">
			<Button href={data.signedIn ? '/app' : '/sign-in'}>
				{data.signedIn ? 'Open your workspace' : 'Sign in'}
			</Button>
			{#if !data.signedIn}
				<Button variant="outline" href="/sign-up">Create an account</Button>
			{/if}
		</div>
	{:else}
		<SetupNotice />
	{/if}
</main>
