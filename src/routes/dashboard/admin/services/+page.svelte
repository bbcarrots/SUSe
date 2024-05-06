<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { serviceTypes, serviceStatus } from '$lib/utils/filterOptions.js';
	import { type ServiceProcessed } from '$lib/utils/types.js';
	import { type ServiceFilter } from '$lib/utils/types.js';
	import { ServiceFilterStore } from '$lib/stores/Filters.js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let data;

	//for filters
	$: {
		if (browser) handleSelect($ServiceFilterStore);
	}


	//for table
	let headers: string[] = ['Service ID', 'Service Name', 'Service Type', 'In Use'];
	let hide: string[] = ['serviceTypeID'];
	let disableEdit: string[] = ['serviceID', 'serviceType'];
	let services: ServiceProcessed[] = [];

	onMount(()=>{
		let serviceObjects = data.serviceRaws;
		mapServiceDatabaseObjects(serviceObjects);

	})

	function mapServiceDatabaseObjects(serviceObjects: ServiceDBObj[] | null){
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
			services=[];
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
		{hide}
		{disableEdit}
	/>
</div>
