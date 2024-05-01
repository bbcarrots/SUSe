<script lang="ts">
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { userID } from '$lib/stores/User';
	import { page } from '$app/stores';

	export let data;
	userID.set(Number($page.params.studentNumber));

	let services: { [key: string]: number };

	if (data.availableServices) {
		services = data.availableServices;
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

	async function handleAvailService(event: CustomEvent) {
		/* Handles Avail Service event from ServiceCardForm by sending a POST request 
        with payload requirements: studentNumber, serviceType. */

		const payload = { studentNumber: $page.params.studentNumber, ...event.detail };

        console.log(payload)

		const response = await fetch('../../../api/avail-end', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		availServiceResponse = await response.json();

        console.log(availServiceResponse)   
	}

	async function handleEndService(event: CustomEvent) {
		/* Handles End Service event from ServiceCardForm by sending a PATCH request 
        with payload requirement: usageLogID. */

		const response = await fetch('../../../api/avail-end', {
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
	<ServiceCard
        on:availService={handleAvailService}
		serviceName={'Calculator'}
		available={services?.['Calculator']}
		src={'/service-card-images/calculator.svg'}
	/>

	<ServiceCard
		serviceName={'Extension Cord'}
		available={services?.['Extension Cord']}
		src={'/service-card-images/extension-cord.svg'}
	/>

	<ServiceCard
		serviceName={'Discussion Room'}
		available={services?.['Discussion Room']}
		src={'/service-card-images/discussion-room.svg'}
	/>

	<ServiceCard
		serviceName={'Umbrella'}
		available={services?.['Umbrella']}
		src={'/service-card-images/umbrella.svg'}
	/>

	<ServiceCard
		serviceName={'Laptop'}
		available={services?.['Laptop']}
		src={'/service-card-images/laptop.svg'}
	/>

	<ServiceCard
		serviceName={'Adapter'}
		available={services?.['Adapter']}
		src={'/service-card-images/adapter.svg'}
	/>

	<ServiceCard
		serviceName={'Reading Glasses'}
		available={services?.['Reading Glasses']}
		src={'/service-card-images/reading-glasses.svg'}
	/>
</div>
