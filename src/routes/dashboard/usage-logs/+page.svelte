<script lang="ts">
	export let data;
	let headers: string[] = [
		'Usage Log ID',
		'Service ID',
		'Service Type',
		'Student Number',
		'Admin ID',
		'Date Time Start',
		'Date Time End'
	];

	let hide: string[] = [
	]

	let disableEdit: string[] = [
		"usageLogID",
		"serviceID",
		"studentNumber",
		"serviceType",
		"adminID"
	]

	import Table from '$lib/components/Table.svelte';
	import { type UsageLogProcessed } from '$lib/utils/types.js';

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

	// // ----------------------------------------------------------------------------------
	// import type { StudentResponse } from '$lib/classes/Student.js';

	// let approveResponse: StudentResponse;
	// let deleteResponse: StudentResponse;
	// let updateResponse: StudentResponse;

	// async function handleApprove(event: CustomEvent) {
	// 	/* Handles Approve event from TableRow by sending a PATCH request 
    //     with payload requirements: studentNumber and isEnrolled=true. */

	// 	const payload = { isEnrolled: true, ...event.detail };

	// 	const response = await fetch('../api/student', {
	// 		method: 'PATCH',
	// 		body: JSON.stringify(payload),
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});

	// 	approveResponse = await response.json();
	// }

	// async function handleDelete(event: CustomEvent) {
	// 	/* Handles Delete event from TableRow by sending a DELETE request 
    //     with payload requirement: studentNumber. */

	// 	const response = await fetch('../api/student', {
	// 		method: 'DELETE',
	// 		body: JSON.stringify(event.detail),
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});

	// 	deleteResponse = await response.json();
	// }

	// async function handleUpdate(event: CustomEvent) {
	// 	/* Handles Update event from TableRow by sending a PATCH request with 
    //     payload requirement: studentNumber, 
    //     optional: firstName, middleInitial, lastName, college, program, phoneNumber. */

	// 	const response = await fetch('../api/student', {
	// 		method: 'PATCH',
	// 		body: JSON.stringify(event.detail),
	// 		headers: {
	// 			'content-type': 'application/json'
	// 		}
	// 	});

	// 	updateResponse = await response.json();
	// }
</script>

<Table
	{headers}
	info={usageLogs}
	primaryKey="usageLogID"
	hide={hide}
	disableEdit={disableEdit}
/>
