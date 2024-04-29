<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { onMount } from 'svelte';

	export let form;

	// ----------------------------------------------------------------------------------
	import type { StudentResponse } from '$lib/classes/Student.js';

	let rfidResponse: StudentResponse;

	async function handleRFID(event: CustomEvent) {
		/* Handles RFID validation event from LoginForm by sending a POST request 
        with payload requirement: rfid. */

		const response = await fetch('api/rfid', {
			method: 'POST',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		rfidResponse = await response.json();
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
			{#if form == null || form.success == false}
				<LoginForm />
				{#if form != null && form.error != null}
					<p class="text-red-600">{form.error}</p>
				{/if}
			{:else if form.success == true}
				<h1>Present your Form 5 to the admin for approval.</h1>
				<h4>
					Please prepare your Form 5 and present it to the admin to get your UP ID registered in
					SUSe!
				</h4>
				<Button>Return to Login</Button>
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
