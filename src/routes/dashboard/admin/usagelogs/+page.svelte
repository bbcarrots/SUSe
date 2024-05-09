<svelte:options accessors />

<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { type UsageLogProcessed } from '$lib/utils/types.js';
	import { serviceTypes } from '$lib/utils/filterOptions.js';
	import { type UsageLogFilter } from '$lib/utils/types.js';
	import { UsageLogFilterStore } from '$lib/stores/Filters.js';
	import { browser } from '$app/environment';
	import Toasts from '$lib/components/Toasts.svelte';
	let toasts: SvelteComponent;

	export let data;
	let table: SvelteComponent;

	//select everytime the usage log filter store is updated
	$: {
		if (browser) handleSelect($UsageLogFilterStore);
	}

	//for table
	let headers: string[] = [
		'Usage Log ID',
		'Service ID',
		'Service Type',
		'Student Number',
		'Admin ID',
		'Date Time Start',
		'Date Time End'
	];
	let hide: string[] = [];
	let disableEdit: string[] = [
		'usageLogID',
		'serviceID',
		'studentNumber',
		'serviceType',
		'adminID'
	];

	let usageLogs: UsageLogProcessed[] = [];

    // ----------------------------------------------------------------------------------
	import { type RealtimeChannel, type SupabaseClient, createClient } from '@supabase/supabase-js';
    let supabase: SupabaseClient;
    let channel: RealtimeChannel;

	onMount(() => {
		let usageLogObjects = data.usageLogRaws;
		mapULDatabaseObjects(usageLogObjects);

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
					table: 'usage_log'
				},
				() => {
					handleSelect($UsageLogFilterStore);
				}
			)
			.subscribe();
	});

    onDestroy(() => {
		supabase.removeChannel(channel)
    })

	function mapULDatabaseObjects(usageLogObjects: UsageLogDBObj[] | null) {
		if (usageLogObjects !== null && usageLogObjects !== undefined) {
			usageLogs = usageLogObjects.map((usageLog: any) => {
				return {
					usageLogID: usageLog.ul_id,
					serviceID: usageLog.service_id,
					serviceType: usageLog.service_type,
					studentNumber: usageLog.sn_id,
					adminID: usageLog.admin_id,
					dateTimeStart: usageLog.datetime_start,
					dateTimeEnd: usageLog.datetime_end
				};
			});
		} else {
			usageLogs = [];
		}
	}
	// ----------------------------------------------------------------------------------
	import type { UsageLogDBObj, UsageLogResponse } from '$lib/classes/UsageLog.js';
	import { SvelteComponent, onDestroy, onMount, type ComponentType } from 'svelte';

	let selectResponse: UsageLogResponse;
	let deleteResponse: UsageLogResponse;
	let updateResponse: UsageLogResponse;

	async function handleSelect(filter: UsageLogFilter) {
		/* Handles Select event from the filter confirmation by sending a
        POST request with payload requirement: filter. */

		const payload: UsageLogFilter = {
			usageLogID: filter.usageLogID,
			studentNumber: filter.studentNumber,
			serviceType: filter.serviceType,
			minDate: filter.minDate ? new Date(filter.minDate).toISOString() : filter.minDate,
			maxDate: filter.maxDate ? new Date(filter.maxDate).toISOString() : filter.maxDate
		};

		const response = await fetch('../../api/usagelog', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		selectResponse = await response.json();
		mapULDatabaseObjects(selectResponse.usageLogRaws);
	}

	async function handleDelete(event: CustomEvent) {
		/* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: usageLogID. */

		const response = await fetch('../../api/usagelog', {
			method: 'DELETE',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		deleteResponse = await response.json();
		if (deleteResponse.success == true) {
			table.deleteEntryUI();
			toasts.addToast({ message: "Successfully deleted usage log entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to delete usage log entry", timeout: 3, type: 'error', open: true })
		}
	}

	async function handleUpdate(event: CustomEvent) {
		/* Handles Update event from TableRow by sending a PATCH request with 
        payload requirement: usageLogID, 
        optional: dateTimeStart, dateTimeEnd. */

		const response = await fetch('../../api/usagelog', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		updateResponse = await response.json();
		if (updateResponse.success == true) {
			table.updateEntryUI();
			toasts.addToast({ message: "Successfully updated usage log entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to update usage log entry", timeout: 3, type: 'error', open: true })
		}
	}
</script>

<div class="grid gap-2">
	<h3 class="pt-4">Usage Logs</h3>
	<div class="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect
			field={'Service Type'}
			options={serviceTypes}
			bind:value={$UsageLogFilterStore.serviceType}
		/>

		<!-- date range pickers -->
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-3 flex bg-white p-[5px] text-gray-400">
				Date Range Start
			</h6>
			<input
				class="datetime block h-full w-full rounded-md border border-gray-300 p-2.5 text-[14px] text-suse-black"
				on:input
				bind:value={$UsageLogFilterStore.minDate}
				type="datetime-local"
			/>
		</div>
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-3 flex bg-white p-[5px] text-gray-400">
				Date Range End
			</h6>
			<input
				class="datetime block h-full w-full rounded-md border border-gray-300 p-2.5 text-[14px] text-suse-black"
				on:input
				bind:value={$UsageLogFilterStore.maxDate}
				type="datetime-local"
			/>
		</div>
	</div>
	<Table
		on:delete={handleDelete}
		on:update={handleUpdate}
		bind:this={table}
		{headers}
		info={usageLogs}
		primaryKey="usageLogID"
		{hide}
		{disableEdit}
	/>
</div>
<Toasts bind:this={toasts}></Toasts>