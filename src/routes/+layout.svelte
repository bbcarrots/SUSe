<script>
	import '../app.pcss';
	import Loader from '$lib/components/Loader.svelte';
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<Loader></Loader>
{:else}
	<slot />
{/if}

