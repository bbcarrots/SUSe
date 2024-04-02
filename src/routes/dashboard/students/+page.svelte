<script lang="ts">
	export let data;
	let headers = [
		'Student Number',
		'First Name',
		'Middle Initial',
		'Last Name',
		'Email',
		'Phone Number',
		'College',
		'Program'
	];

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
	let approveResponse;
	let deleteResponse;
	let updateResponse;

	async function handleApprove(event: any) {
		console.log('approve');
		console.log(event.detail);

		const payload = { isEnrolled: true, ...event.detail };

		approveResponse = await fetch('../api/student', {
			method: 'PATCH',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(await approveResponse.json());
	}

	async function handleDelete(event: any) {
		console.log('delete');
		console.log(event.detail);

        deleteResponse = await fetch('../api/student', {
			method: 'DELETE',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(await deleteResponse.json());
	}

	async function handleUpdate(event: any) {
		console.log('edit');
		console.log(event.detail);

		updateResponse = await fetch('../api/student', {
			method: 'PATCH',
			body: JSON.stringify(event.detail),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(await updateResponse.json());
	}
</script>

<Table
	on:approve={handleApprove}
	on:delete={handleDelete}
	on:update={handleUpdate}
	{headers}
	information={students}
	primaryKey="studentNumber"
/>
