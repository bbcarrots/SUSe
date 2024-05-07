<script>
	import '../app.pcss';
	import { browser } from '$app/environment';
	import Loader from '$lib/components/Loader.svelte';
</script>

{#if !browser}
	<Loader></Loader>
{:else}
	<slot />
{/if}

