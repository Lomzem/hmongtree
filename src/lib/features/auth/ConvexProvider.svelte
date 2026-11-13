<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { setupConvex } from 'convex-svelte';
	import ConvexAuthentication from './ConvexAuthentication.svelte';

	const { children, url }: { children: Snippet; url: string } = $props();
	setupConvex(untrack(() => url));
</script>

<ConvexAuthentication>
	{@render children()}
</ConvexAuthentication>
