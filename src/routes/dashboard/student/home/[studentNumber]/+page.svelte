<script lang="ts">
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { userID } from '$lib/stores/User';
	import { page } from '$app/stores';
	import { camelize } from '$lib/utils/utils.js';

	export let data;

	userID.set(Number($page.params.studentNumber));

	console.log(data.availableServices);
	let availableServices = data.availableServices;

	// ----------------------------------------------------------------------------------
	import type { UsageLogDBObj } from '$lib/classes/UsageLog.js';

	type StudentServicesResponse = {
		success: boolean;
		activeUsageLogs: { [key: string]: UsageLogDBObj };
		availableServices: { [key: string]: number };
		error: string;
	};

	let availServiceResponse: StudentServicesResponse;
	let endServiceResponse: StudentServicesResponse;

	async function handleAvailService(event: CustomEvent) {
		/* Handles Avail Service event from ServiceCardForm by sending a POST request 
        with payload requirements: studentNumber, serviceType. */

		const payload = { studentNumber: $page.params.studentNumber, ...event.detail };

		const response = await fetch('../../api/avail-end', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		availServiceResponse = await response.json();
	}

	async function handleDeleteService(event: CustomEvent) {
		/* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: studentNumber. */

		const response = await fetch('../../api/avail-end', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		endServiceResponse = await response.json();
	}
</script>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#if availableServices}
		{#each Object.entries(availableServices) as [service, count]}
			<ServiceCard
				serviceName={service}
				available={count}
				src={`/service-card-images/${camelize(service)}.svg`}
			/>
		{/each}
	{:else}
		<p>No available services</p>
	{/if}
</div>
