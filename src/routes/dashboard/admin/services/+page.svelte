<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { type ServiceProcessed } from '$lib/utils/types.js';

	export let data;
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

<Table {headers} info={services} primaryKey="serviceID" {hide} {disableEdit} />
