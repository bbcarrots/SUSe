<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { serviceTypes, serviceStatus } from '$lib/utils/filterOptions.js';
	import { type ServiceProcessed } from '$lib/utils/types.js';
	import { type ServiceFilter } from '$lib/utils/types.js';
	import { ServiceFilterStore } from '$lib/stores/Filters.js';
	import { browser } from '$app/environment';
	import { SvelteComponent, onDestroy, onMount } from 'svelte';

	export let data;
	let table: SvelteComponent;

	//for filters
	$: {
		if (browser) handleSelect($ServiceFilterStore);
	}

	//for table
	let headers: string[] = ['Service ID', 'Service Name', 'Service Type', 'In Use'];
	let hide: string[] = ['serviceTypeID'];
	let disableEdit: string[] = ['serviceID', 'serviceType'];
	let services: ServiceProcessed[] = [];

    // ----------------------------------------------------------------------------------
	import { RealtimeChannel, SupabaseClient, createClient } from '@supabase/supabase-js';
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

	onMount(() => {
		let serviceObjects = data.serviceRaws;
		mapServiceDatabaseObjects(serviceObjects);

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
					table: 'service'
				},
				() => {
					handleSelect($ServiceFilterStore);
				}
			)
			.subscribe();
	});

    onDestroy(() => {
		supabase.removeChannel(channel)
    })

	function mapServiceDatabaseObjects(serviceObjects: ServiceDBObj[] | null) {
		if (serviceObjects !== null && serviceObjects !== undefined) {
			services = serviceObjects.map((service) => {
				return {
					serviceID: service.service_id,
					serviceTypeID: service.service_type_id,
					serviceName: service.service_name,
					serviceType: service.service_type,
					inUse: service.in_use
				};
			});
		} else {
			services = [];
		}
	}

	// ----------------------------------------------------------------------------------
	import type { ServiceDBObj, ServiceResponse } from '$lib/classes/Service.js';

	let deleteResponse: ServiceResponse;
	let updateResponse: ServiceResponse;
	let selectResponse: ServiceResponse;

	async function handleSelect(filter: ServiceFilter) {
		/* Handles Select event from the filter confirmation by sending a
        POST request with payload requirement: filter. */

		const response = await fetch('../../api/service', {
			method: 'POST',
			body: JSON.stringify(filter),
			headers: {
				'content-type': 'application/json'
			}
		});

		selectResponse = await response.json();
		mapServiceDatabaseObjects(selectResponse.serviceRaws);
	}

	async function handleDelete(event: CustomEvent) {
		/* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: serviceID. */

		const response = await fetch('../../api/service', {
			method: 'DELETE',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		deleteResponse = await response.json();
		if (deleteResponse.success == true) {
			table.deleteEntryUI();
		}
	}

	async function handleUpdate(event: CustomEvent) {
		/* Handles Update event from TableRow by sending a PATCH request with 
        payload requirement: serviceID, 
        optional: serviceName, inUse. */

		const response = await fetch('../../api/service', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		updateResponse = await response.json();
		if (updateResponse.success == true) {
			table.updateEntryUI();
		}
	}
</script>

<div class="grid gap-2">
	<h3 class="pt-4">Services</h3>
	<div class="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect
			field={'Service Type'}
			options={serviceTypes}
			bind:value={$ServiceFilterStore.serviceType}
		/>
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">In Use</h6>
			<select
				bind:value={$ServiceFilterStore.inUse}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}>All</option>
				<option value={false}>Not In Use</option>
				<option value={true}>In Use</option>
			</select>
		</div>
	</div>
	<Table
		on:delete={handleDelete}
		on:update={handleUpdate}
		{headers}
		info={services}
		primaryKey="serviceID"
		bind:this={table}
		{hide}
		{disableEdit}
	/>
</div>
