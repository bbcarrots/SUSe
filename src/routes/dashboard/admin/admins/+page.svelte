<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { type AdminProcessed } from '$lib/utils/types.js';

	export let data;
	let headers: string[] = ['Admin Number', 'Nickname'];
	let hide: string[] = [];
	let disableEdit: string[] = ['adminID'];
	const admins: AdminProcessed[] = [
		{
			adminID: 12345,
			nickname: 'Gab'
		}
	];

	// TO DO: Implement mapping of AdminDBObj to AdminProcessed

	// ----------------------------------------------------------------------------------
	import type { AdminResponse } from '$lib/classes/Admin.js';

	let deleteResponse: AdminResponse;
	let updateResponse: AdminResponse;

	async function handleDelete(event: CustomEvent) {
		/* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: adminID. */

		const response = await fetch('../../api/admin', {
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
        payload requirement: adminID, 
        optional: nickname. */

		const response = await fetch('../../api/admin', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		updateResponse = await response.json();
	}
</script>

<Table
	on:delete={handleDelete}
	on:update={handleUpdate}
	{headers}
	info={admins}
	primaryKey="adminID"
	{hide}
	{disableEdit}
/>
