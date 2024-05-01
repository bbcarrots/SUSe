<script lang="ts">
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { userID } from '$lib/stores/User';
	import { page } from '$app/stores';
	import { camelize } from '$lib/utils/utils.js';

	export let data;

	userID.set(Number($page.params.studentNumber));

	let availableServices: { [key: string]: number };

	if (data.availableServices) {
		availableServices = data.availableServices;
	}

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

    let activeUsageLogs: { [key: string]: UsageLogDBObj } = {}

	async function handleAvailService(event: CustomEvent) {
		/* Handles Avail Service event from ServiceCardForm by sending a POST request 
        with payload requirements: studentNumber, serviceType. */

        const { serviceType } = event.detail

		const payload = { studentNumber: $page.params.studentNumber, serviceType: serviceType };

		const response = await fetch('../../../api/avail-end', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		availServiceResponse = await response.json();

        console.log(availServiceResponse)   

        activeUsageLogs = Object.assign(activeUsageLogs, availServiceResponse.activeUsageLogs)

        console.log(activeUsageLogs)   
	}

	async function handleEndService(event: CustomEvent) {
		/* Handles End Service event from ServiceCardForm by sending a PATCH request 
        with payload requirement: usageLogID, serviceType. */

        const { serviceType } = event.detail

		const response = await fetch('../../../api/avail-end', {
			method: 'PATCH',
			body: JSON.stringify({ usageLogID: activeUsageLogs[serviceType].ul_id }),
			headers: {
				'content-type': 'application/json'
			}
		});

		endServiceResponse = await response.json();

        console.log(endServiceResponse)   
	}
</script>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#if availableServices}
		{#each Object.entries(availableServices) as [service, count]}
			<ServiceCard
				on:availService={handleAvailService}
				on:endService={handleEndService}
				serviceName={service}
				available={count}
				src={`/service-card-images/${camelize(service)}.svg`}
			/>
		{/each}
	{:else}
		<p>No available services</p>
	{/if}
</div>
