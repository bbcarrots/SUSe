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

	let activeUsageLogs: { [key: string]: UsageLogDBObj } =
		data.activeUsageLogs != undefined ? data.activeUsageLogs : {};

    // ----------------------------------------------------------------------------------
	import { type RealtimeChannel, type SupabaseClient, createClient } from '@supabase/supabase-js';
	import { onMount, onDestroy } from 'svelte';
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

	onMount(() => {
		supabase = createClient(
			'https://yfhwfzwacdlqmyunladz.supabase.co',
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
		);

		channel = supabase
			.channel('student-db-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'service',
                    filter: 'in_use=eq.true'
				},
				(payload) => {
                    for (const serviceType of serviceTypes) {
                        if (serviceType.value == payload.new.service_type_id) {
                             availableServices[serviceType.name] -= 1;
                        }
                    }
				}
			)
            .on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'service',
                    filter: 'in_use=eq.false'
				},
				(payload) => {
                    for (const serviceType of serviceTypes) {
                        if (serviceType.value == payload.new.service_type_id) {
                             availableServices[serviceType.name] += 1;
                        }
                    }
				}
			)
			.subscribe();
	});

    onDestroy(() => {
		supabase.removeChannel(channel)
    })

	// ----------------------------------------------------------------------------------
	import type { UsageLogDBObj } from '$lib/classes/UsageLog.js';
	import { serviceTypes } from '$lib/utils/filterOptions.js';

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

		const { serviceType } = event.detail;

		const payload = {
			studentNumber: $page.params.studentNumber,
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
		activeUsageLogs = Object.assign(activeUsageLogs, availServiceResponse.activeUsageLogs);
	}

	async function handleEndService(event: CustomEvent) {
		/* Handles End Service event from ServiceCardForm by sending a PATCH request 
        with payload requirement: usageLogID, serviceType. */

		const { serviceType } = event.detail;

		const payload = {
			studentNumber: $page.params.studentNumber,
			usageLogID: activeUsageLogs[serviceType].ul_id,
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
            delete activeUsageLogs[serviceType]
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
