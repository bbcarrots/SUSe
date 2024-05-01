<script lang="ts">
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { userID } from '$lib/stores/User';
	import { page } from '$app/stores';

	export let data;
	userID.set(Number($page.params.studentNumber));

	// console.log($page.params.studentNumber);
	// console.log(data);

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
	<ServiceCard
		serviceName={'Calculator'}
		available={1}
		src={'/service-card-images/calculator.svg'}
	/>

	<ServiceCard
		serviceName={'Extension Cord'}
		available={1}
		src={'/service-card-images/extension-cord.svg'}
	/>

	<ServiceCard
		serviceName={'Discussion Room'}
		available={1}
		src={'/service-card-images/discussion-room.svg'}
	/>

	<ServiceCard serviceName={'Umbrella'} available={1} src={'/service-card-images/umbrella.svg'} />

	<ServiceCard serviceName={'Laptop'} available={1} src={'/service-card-images/laptop.svg'} />

	<ServiceCard serviceName={'Adapter'} available={1} src={'/service-card-images/adapter.svg'} />

	<ServiceCard
		serviceName={'Reading Glasses'}
		available={1}
		src={'/service-card-images/reading-glasses.svg'}
	/>
</div>
