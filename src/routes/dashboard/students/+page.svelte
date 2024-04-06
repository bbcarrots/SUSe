<script lang="ts">
	export let data;
	let headers: string[] = [
		'Student Number',
		'First Name',
		'Middle Initial',
		'Last Name',
		'Email',
		'Phone Number',
		'College',
		'Program',
		'Is Enrolled'
	];

	let hide: string[] = ['isEnrolled'];

	let disableEdit: string[] = ['email', 'studentNumber'];

	import Table from '$lib/components/Table.svelte';
	import { type StudentProcessed } from '$lib/utils/types.js';

	let studentObjects = data.studentRaws;

	let students: StudentProcessed[] = [];

	if (studentObjects !== null && studentObjects !== undefined) {
		students = studentObjects.map((student) => {
			return {
				studentNumber: student.sn_id,
				firstName: student.first_name,
				middleInitial: student.middle_initial,
				lastName: student.last_name,
				email: student.username,
				phoneNumber: student.phone_number,
				college: student.college,
				program: student.program,
				isEnrolled: student.is_enrolled
			};
		});
	}

	// ----------------------------------------------------------------------------------
	import type { StudentResponse } from '$lib/classes/Student.js';

	let approveResponse: StudentResponse;
	let deleteResponse: StudentResponse;
	let updateResponse: StudentResponse;

	async function handleApprove(event: CustomEvent) {
		/* Handles Approve event from TableRow by sending a PATCH request 
        with payload requirements: studentNumber, isEnrolled=true. */

		const payload = { isEnrolled: true, ...event.detail };

		const response = await fetch('../api/student', {
			method: 'PATCH',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		approveResponse = await response.json();
	}

	async function handleDelete(event: CustomEvent) {
		/* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: studentNumber. */

		const response = await fetch('../api/student', {
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
        payload requirement: studentNumber, 
        optional: firstName, middleInitial, lastName, college, program, phoneNumber. */

		const response = await fetch('../api/student', {
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
	on:approve={handleApprove}
	on:delete={handleDelete}
	on:update={handleUpdate}
	{headers}
	info={students}
	primaryKey="studentNumber"
	{hide}
	{disableEdit}
/>
