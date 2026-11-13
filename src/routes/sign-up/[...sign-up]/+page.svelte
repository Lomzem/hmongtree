<script lang="ts">
	import { SignUp } from 'svelte-clerk';
	import { Button } from '#lib/components/ui/button/index.js';
	import SetupNotice from '#lib/features/auth/SetupNotice.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Create an account · Hmongtree</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12">
	<Button href="/" variant="ghost">Hmongtree</Button>
	{#if data.configured}
		<SignUp />
	{:else}
		<SetupNotice />
	{/if}
</main>
