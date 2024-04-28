<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { serviceTypes } from '$lib/utils/filterOptions.js';
	import { type ServiceProcessed } from '$lib/utils/types.js';

	export let data;
	//for filters
	let serviceTypesValue: string[] = [];

	//for table
	let headers: string[] = ['Service ID', 'Service Type'];
	let hide: string[] = [];
	let disableEdit: string[] = ['serviceID', 'serviceType'];
	const services: ServiceProcessed[] = [];

	// TO DO: Implement ServiceDBObj map to ServiceProcessed

	// ----------------------------------------------------------------------------------
	import type { ServiceResponse } from '$lib/classes/Service.js';

	let deleteResponse: ServiceResponse;
	let updateResponse: ServiceResponse;

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
	<div class="my-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect field={'Service Type'} options={serviceTypes} bind:value={serviceTypesValue} />
	</div>
	<Table {headers} info={services} primaryKey="serviceID" {hide} {disableEdit} />
</div>
