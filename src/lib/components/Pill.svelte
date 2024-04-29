<script lang="ts">
	import { Icon, XMark } from 'svelte-hero-icons';
	export let value;
</script>

<div class="flex items-center">
	<div
		class="flex inline-flex items-center justify-between rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
	>
		<p class="m-0">{value}</p>
		<!-- Removed margin to make the text flush with the container -->
		<button on:click>
			<Icon src={XMark} micro size="15" />
		</button>
	</div>
</div>
