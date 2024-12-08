<script lang="ts">
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { userID } from '$lib/stores/User';
	import { page } from '$app/stores';
	import { camelize } from '$lib/utils/utils.js';
	import type { UsageLogDBObj } from '$lib/classes/UsageLog.js';
	import type { SvelteComponent } from 'svelte';
	import Toasts from '$lib/components/Toasts.svelte';

	export let data;
	let toasts: SvelteComponent;

	userID.set(Number($page.params.studentNumber));

	let availableServices: { [key: string]: number };

	if (data.availableServices) {
		availableServices = data.availableServices;
	}

	let activeUsageLogs: { [key: string]: UsageLogDBObj } =
		data.activeUsageLogs != undefined ? data.activeUsageLogs : {};

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

		const { serviceID, serviceType } = event.detail;

		const payload = {
			studentNumber: $page.params.studentNumber,
			serviceID: serviceID,
			serviceType: serviceType,
			updateStudent: Object.keys(activeUsageLogs).length == 0 ? true : false
		};
		
		const response = await fetch('../../../api/avail-end', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});
		
		availServiceResponse = await response.json();
		
		if (availServiceResponse.success) {
			activeUsageLogs = Object.assign(activeUsageLogs, availServiceResponse.activeUsageLogs);
			toasts.addToast({
				message: `${serviceType} availed successfully!`,
				timeout: 3,
				type: 'success',
				open: true
			});
		} else {
			toasts.addToast({
				message: availServiceResponse.error,
				timeout: 3,
				type: 'error',
				open: true
			});
		}
		
	}

	async function handleEndService(event: CustomEvent) {
		/* Handles End Service event from ServiceCardForm by sending a PATCH request 
        with payload requirement: usageLogID, serviceType. */

		const { serviceType } = event.detail;

		const payload = {
			studentNumber: $page.params.studentNumber,
			usageLogID: activeUsageLogs[serviceType].ul_id,
			serviceType: serviceType,
			serviceID: activeUsageLogs[serviceType].service_id, 
			updateStudent: Object.keys(activeUsageLogs).length == 1 ? true : false
		};
		
		const response = await fetch('../../../api/avail-end', {
			method: 'PATCH',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		endServiceResponse = await response.json();

        if (endServiceResponse.success) {
            delete activeUsageLogs[serviceType];
			availableServices = endServiceResponse.availableServices

			toasts.addToast({
				message: `${serviceType} ended successfully!`,
				timeout: 3,
				type: 'success',
				open: true
			});
        } else {
			toasts.addToast({
				message: `${serviceType} availed unsuccessfully.`,
				timeout: 3,
				type: 'error',
				open: true
			});
		}
	}
</script>

<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#if availableServices}
		<!-- for each available service -->
		{#each Object.entries(availableServices).sort((a, b) => a[0].localeCompare(b[0])) as [service, count]}
			{#if service in activeUsageLogs}
				<ServiceCard
					on:availService={handleAvailService}
					on:endService={handleEndService}
					serviceName={service}
					available={count}
					started={true}
					timeStarted={new Date(activeUsageLogs[service]?.datetime_start)}
					src={`/service-card-images/${camelize(service)}.svg`}
				/>
			{:else}
				<ServiceCard
					on:availService={handleAvailService}
					on:endService={handleEndService}
					serviceName={service}
					available={count}
					timeStarted={new Date(0)}
					src={`/service-card-images/${camelize(service)}.svg`}
				/>
			{/if}
		{/each}
	{:else}
		<p>No available services</p>
	{/if}
</div>
<Toasts bind:this={toasts}></Toasts>