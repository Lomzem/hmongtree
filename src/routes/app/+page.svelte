<script lang="ts">
	import SetupNotice from '#lib/features/auth/SetupNotice.svelte';
	import Workspace from '#lib/features/workspace/Workspace.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Your workspace · Hmongtree</title>
</svelte:head>

{#if data.configured}
	<Workspace />
{:else}
	<main class="flex min-h-screen items-center justify-center p-6">
		<SetupNotice />
	</main>
{/if}
