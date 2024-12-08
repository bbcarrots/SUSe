<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { serviceTypes, serviceHeaders } from '$lib/utils/filterOptions.js';
	import { type ServiceProcessed } from '$lib/utils/types.js';
	import { type ServiceFilter } from '$lib/utils/types.js';
	import { ServiceFilterStore } from '$lib/stores/Filters.js';
	import { SvelteComponent } from 'svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import type { ServiceDBObj, ServiceResponse } from '$lib/classes/Service.js';
	import { ServiceTable } from '$lib/stores/AdminTables.js';
	import { browser } from '$app/environment';

    // components
	let toasts: SvelteComponent;
	let table: SvelteComponent;

	// for table
	let headers: string[] = serviceHeaders;
	let hide: string[] = ['serviceTypeID'];
	let disableEdit: string[] = ['serviceID', 'serviceType'];
    let services: ServiceProcessed[] = [];

    // ----------------------------------------------------------------------------------
	
	function mapServiceDatabaseObjects(serviceObjects: ServiceDBObj[] | null) {
		if (serviceObjects !== null && serviceObjects !== undefined) {
			$ServiceTable = serviceObjects.map((service) => {
				return {
					serviceID: service.service_id,
					serviceTypeID: service.service_type_id,
					serviceName: service.service_name,
					serviceType: service.service_type,
					inUse: service.in_use
				};
			});
		} else {
			$ServiceTable = [];
		}
        filterServiceTable($ServiceFilterStore);
	}

    function filterServiceTable(filter: ServiceFilter) {
		services = $ServiceTable.filter((service) => {    
            if (filter.serviceType.length == 0 && filter.inUse == null) {
				return true;
			}

			if (filter.serviceType.length != 0) {
				if (!(filter.serviceType.includes(service.serviceType))) {
                    return false;
                }
			} 

			if (filter.inUse != null) {
				if (filter.inUse != service.inUse) {
                    return false;
                }
			} 

            return true;
		});
	}

	$: filterServiceTable($ServiceFilterStore);

	$: {
		// refreshes the table if there are changes in the db
		if (!$ServiceTable.length && browser) {
			handleSelect($ServiceFilterStore);
		}
	}

	// ----------------------------------------------------------------------------------

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
			toasts.addToast({ message: "Successfully deleted service entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to delete service entry", timeout: 3, type: 'error', open: true })
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
			toasts.addToast({ message: "Successfully updated service entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to update service entry", timeout: 3, type: 'error', open: true })
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
<Toasts bind:this={toasts}></Toasts>