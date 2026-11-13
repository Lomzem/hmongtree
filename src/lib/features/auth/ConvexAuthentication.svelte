<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setupClerkConvex } from './setup-clerk-convex.svelte';

	const { children }: { children: Snippet } = $props();
	setupClerkConvex();
</script>

{@render children()}
