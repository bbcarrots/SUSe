<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { userStatus, adminNicknames } from '$lib/utils/filterOptions.js';
	import { type AdminProcessed } from '$lib/utils/types.js';
	import { type AdminFilter } from '$lib/utils/types.js';

	export let data;

	//for filters
	let adminFilter = {
		nickname: [],
		isActive: []
	};

	//for table
	let headers: string[] = ['Admin ID', 'Nickname', 'Is Active'];
	let hide: string[] = ['isActive'];
	let disableEdit: string[] = ['adminID'];
	let adminObjects = data.adminRaws;
	let admins: AdminProcessed[] = [];

	if (adminObjects !== null && adminObjects !== undefined) {
		admins = adminObjects.map((admin) => {
			return {
				adminID: admin.admin_id,
				nickname: admin.nickname,
				isActive: admin.is_active
			};
		});
	}

	// ----------------------------------------------------------------------------------
	import type { AdminResponse } from '$lib/classes/Admin.js';

	let deleteResponse: AdminResponse;
	let updateResponse: AdminResponse;
	let selectResponse: AdminResponse;

	async function handleSelect(filter: AdminFilter) {
		/* Handles Select event from the filter confirmation by sending a
        POST request with payload requirement: filter. */

		const response = await fetch('../../api/admin', {
			method: 'POST',
			body: JSON.stringify(filter),
			headers: {
				'content-type': 'application/json'
			}
		});

		selectResponse = await response.json();
	}

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

<div class="grid gap-2">
	<h3 class="pt-4">Admins</h3>
	<div class="my-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect field={'User Status'} options={userStatus} bind:value={adminFilter.isActive} />
		<Multiselect
			field={'Admin Nicknames'}
			options={adminNicknames}
			bind:value={adminFilter.nickname}
		/>
	</div>
	<Table
		on:delete={handleDelete}
		on:update={handleUpdate}
		{headers}
		info={admins}
		primaryKey="adminID"
		{hide}
		{disableEdit}
	/>
</div>
