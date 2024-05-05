<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { type StudentProcessed } from '$lib/utils/types.js';
	import {
		collegePrograms,
		colleges,
		studentNumberYear,
		userStatus
	} from '$lib/utils/filterOptions.js';
	import { type StudentFilter } from '$lib/utils/types.js';

	export let data;

	//for filters
	let studentFilter = {
		studentNumberYear: [],
		isActive: [],
		college: [],
		program: []
	};

	//for table
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
	let hide: string[] = ['isEnrolled', 'isActive'];
	let disableEdit: string[] = ['email', 'studentNumber'];
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
				isEnrolled: student.is_enrolled,
				isActive: student.is_active
			};
		});
	}

	// ----------------------------------------------------------------------------------
	import type { StudentResponse } from '$lib/classes/Student.js';

	let approveResponse: StudentResponse;
	let deleteResponse: StudentResponse;
	let updateResponse: StudentResponse;
	let selectResponse: StudentResponse;

	async function handleSelect(filter: StudentFilter) {
		/* Handles Select event from the filter confirmation by sending a
        POST request with payload requirement: filter. */

		const response = await fetch('../../api/student', {
			method: 'POST',
			body: JSON.stringify(filter),
			headers: {
				'content-type': 'application/json'
			}
		});

		selectResponse = await response.json();
	}

	async function handleApprove(event: CustomEvent) {
		/* Handles Approve event from TableRow by sending a PATCH request 
        with payload requirements: studentNumber, isEnrolled=true. */

		const payload = { isEnrolled: true, ...event.detail };

		const response = await fetch('../../api/student', {
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

		const response = await fetch('../../api/student', {
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

		const response = await fetch('../../api/student', {
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
	<h3 class="pt-4">Students</h3>
	<div class="my-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect field={'User Status'} options={userStatus} bind:value={studentFilter.isActive} />
		<Multiselect
			field={'College Programs'}
			options={collegePrograms}
			bind:value={studentFilter.program}
		/>
		<Multiselect field={'Colleges'} options={colleges} bind:value={studentFilter.college} />
		<Multiselect
			field={'Student Number Year'}
			options={studentNumberYear}
			bind:value={studentFilter.studentNumberYear}
		/>
	</div>
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
</div>
