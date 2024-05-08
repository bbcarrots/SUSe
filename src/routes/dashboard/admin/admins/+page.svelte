<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { userStatus, adminNicknames } from '$lib/utils/filterOptions.js';
	import { type AdminProcessed } from '$lib/utils/types.js';
	import { type AdminFilter } from '$lib/utils/types.js';
	import { AdminFilterStore } from '$lib/stores/Filters.js';
	import { browser } from '$app/environment';
	import { SvelteComponent, onMount } from 'svelte';

	export let data;
	let table: SvelteComponent;

	//for filters
	$: {
		if (browser) handleSelect($AdminFilterStore);
	}

	//for table
	let headers: string[] = ['Admin ID', 'Nickname', 'Is Active'];
	let hide: string[] = ['rfid'];
	let disableEdit: string[] = ['adminID'];
	let admins: AdminProcessed[] = [];

	onMount(() => {
		let adminObjects = data.adminRaws;
		mapAdminDatabaseObjects(adminObjects);
	});

	function mapAdminDatabaseObjects(adminObjects: AdminDBObj[] | null) {
		if (adminObjects !== null && adminObjects !== undefined) {
			admins = adminObjects.map((admin) => {
				return {
					adminID: admin.admin_id,
					rfid: admin.rfid,
					nickname: admin.nickname,
					isActive: admin.is_active
				};
			});
		} else {
			admins = [];
		}
	}

	// ----------------------------------------------------------------------------------
	import type { AdminDBObj, AdminResponse } from '$lib/classes/Admin.js';

	let deleteResponse: AdminResponse;
	let updateResponse: AdminResponse;
	let selectResponse: AdminResponse;
	let updateActiveResponse: AdminResponse;

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
		mapAdminDatabaseObjects(selectResponse.adminRaws);
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
		if (deleteResponse.success == true) {
			table.deleteEntryUI();
		}
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
		if (updateResponse.success == true) {
			table.updateEntryUI();
		}
	}

	async function handleUpdateActive(event: CustomEvent) {
		/* Handles Update Active event from TableRow by sending a PATCH request with 
        payload requirement: adminID, currentStatus*/

		const payload = { adminID: event.detail.adminID, isActive: !event.detail.currentStatus };

		const response = await fetch('../../api/admin', {
			method: 'PATCH',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		updateActiveResponse = await response.json();
		if (updateActiveResponse.success) {
			table.updateEntryActiveUI();
		}
	}
</script>

<div class="grid gap-2">
	<h3 class="pt-4">Admins</h3>
	<div class="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">
				Is Active
			</h6>
			<select
				bind:value={$AdminFilterStore.isActive}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}>All</option>
				<option value={false}>Not Active</option>
				<option value={true}>Is Active</option>
			</select>
		</div>
	</div>
	<Table
		on:delete={handleDelete}
		on:update={handleUpdate}
		on:updateActive={handleUpdateActive}
		{headers}
		info={admins}
		primaryKey="adminID"
		bind:this={table}
		{hide}
		{disableEdit}
	/>
</div>
