<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { type UsageLogProcessed } from '$lib/utils/types.js';
	import { serviceTypes } from '$lib/utils/filterOptions.js';
    import { type UsageLogFilter } from '$lib/utils/types.js';

	export let data;

	//for filters
	let usageLogFilter: UsageLogFilter = {
		usageLogID: 0,
		studentNumber: 0,
		serviceType: [],
		minDate: '',
		maxDate: ''
	};

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
	let usageLogObjects = data.usageLogRaws;
	let usageLogs: UsageLogProcessed[] = [];

	if (usageLogObjects !== null && usageLogObjects !== undefined) {
		usageLogs = usageLogObjects.map((usageLog) => {
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
	}

	// ----------------------------------------------------------------------------------
	import type { UsageLogResponse } from '$lib/classes/UsageLog.js';

	let selectResponse: UsageLogResponse;
	let deleteResponse: UsageLogResponse;
	let updateResponse: UsageLogResponse;

	async function handleSelect(filter: UsageLogFilter) {
		/* Handles Select event from the filter confirmation by sending a
        POST request with payload requirement: filter. */

		const response = await fetch('../../api/usagelog', {
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
        with payload requirement: usageLogID. */

		const response = await fetch('../../api/usagelog', {
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
	}
</script>

<div class="grid gap-2">
	<h3 class="pt-4">Usage Logs</h3>
	<div class="my-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect
			field={'Service Type'}
			options={serviceTypes}
			bind:value={usageLogFilter.serviceType}
		/>

		<!-- date range pickers -->
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-3 flex bg-white p-[5px] text-gray-400">
				Date Range Start
			</h6>
			<input
				class="datetime block h-1/2 h-full w-full rounded-md border border-gray-300 p-2.5 text-[14px] text-suse-black"
				on:input
				bind:value={usageLogFilter.minDate}
				type="datetime-local"
			/>
		</div>
		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-3 flex bg-white p-[5px] text-gray-400">
				Date Range End
			</h6>
			<input
				class="datetime block h-1/2 h-full w-full rounded-md border border-gray-300 p-2.5 text-[14px] text-suse-black"
				on:input
				bind:value={usageLogFilter.maxDate}
				type="datetime-local"
			/>
		</div>
	</div>
	<Table
		on:delete={handleDelete}
		on:update={handleUpdate}
		{headers}
		info={usageLogs}
		primaryKey="usageLogID"
		{hide}
		{disableEdit}
	/>
</div>
