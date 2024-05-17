<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Hero from '$lib/components/Hero.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let delay = 5000;
	let targetUrl = '/'; 
	let countdown = delay / 1000;

	onMount(() => {
		const intervalId = setInterval(() => {
		countdown -= 1;
		}, 1000);

		const timeoutId = setTimeout(() => {
			goto(targetUrl);
		}, delay);

		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	});

</script>

<section class="flex items-center justify-center lg:h-screen">
	<div
		class="content grid items-center
                gap-y-12 sm:grid-cols-4 sm:grid-rows-2
                lg:grid-cols-12 lg:grid-rows-1 lg:gap-20"
	>
		<div
			class="grid gap-10 sm:col-span-2 sm:col-start-2 sm:row-start-1 lg:col-span-5
                    lg:col-start-2 lg:col-end-7 lg:row-start-1"
		>
			<div class="grid gap-4 text-center">
				<h1>Present your Form 5 to the admin for approval.</h1>
				<h4>
					Please prepare your Form 5 and present it to the admin to get your UP ID registered in
					SUSe!
				</h4>
				<p></p>
			</div>

			<a href="/"><Button>Return to Login (Returning in {countdown})</Button></a>
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
