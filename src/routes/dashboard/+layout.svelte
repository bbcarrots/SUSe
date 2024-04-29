<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="">
	<div class="absolute h-screen">
		<Sidebar></Sidebar>
	</div>
	<div class="ml-[230px]">
		<div class="ml-6 mr-6">
			<slot />
		</div>
	</div>
</div>
