<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import RegisterForm from '$lib/components/RegisterForm.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { goto } from '$app/navigation';

	export let form;

	$: {
		let submitSuccess = form?.success;
		if (submitSuccess == true) {
			goto('/register/form5');
		}
	}
</script>

<section class="flex items-center justify-center lg:h-screen">
	<div
		class="content grid
                gap-y-12 sm:grid-cols-4 sm:grid-rows-2
                lg:grid-cols-12 lg:grid-rows-1 lg:gap-20"
	>
		<div
			class="sm:col-span-2 sm:col-start-2 sm:row-start-1 lg:col-span-5
                    lg:col-start-2 lg:col-end-7 lg:row-start-1"
		>
			<RegisterForm />
			{#if form != null && form.error != null}
				<p class="text-red-600">{form.error}</p>
			{/if}
		</div>
		<div
			class="sm:col-span-2 sm:col-start-2 sm:row-start-2 lg:col-span-5
                    lg:col-start-7 lg:col-end-12 lg:row-start-1"
		>
			<Hero />
		</div>
	</div>
</section>

<style>
	.content {
		max-width: 1400px;
	}
</style>
