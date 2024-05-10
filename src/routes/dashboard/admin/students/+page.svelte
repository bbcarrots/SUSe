<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import Multiselect from '$lib/components/Multiselect.svelte';
	import { type StudentProcessed } from '$lib/utils/types.js';
	import { collegePrograms, colleges, studentNumberYear } from '$lib/utils/filterOptions.js';
	import { type StudentFilter } from '$lib/utils/types.js';
	import { StudentFilterStore } from '$lib/stores/Filters.js';
	import { browser } from '$app/environment';
	let toasts: SvelteComponent;

	export let data;
	let table: SvelteComponent;

	//for filters
	$: {
		if (browser) handleSelect($StudentFilterStore);
	}

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
	let students: StudentProcessed[] = [];

	// ----------------------------------------------------------------------------------
	import { type RealtimeChannel } from '@supabase/supabase-js';
	import { supabaseFront } from '$lib/stores/SupabaseClient.js';
    let channel: RealtimeChannel;

	onMount(() => {
		let studentObjects = data.studentRaws;
		mapStudentDatabaseObjects(studentObjects);

		channel = $supabaseFront
			.channel('student-db-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'student'
				},
				() => { // has payload arg if you want to print
					handleSelect($StudentFilterStore);
				}
			)
			.subscribe();
	});

    onDestroy(() => {
		$supabaseFront.removeChannel(channel)
    })

	function mapStudentDatabaseObjects(studentObjects: StudentDBObj[] | null) {
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
		} else {
			students = [];
		}
	}

	// ----------------------------------------------------------------------------------
	import type { StudentDBObj, StudentResponse } from '$lib/classes/Student.js';
	import { SvelteComponent, onDestroy, onMount } from 'svelte';
	import Toasts from '$lib/components/Toasts.svelte';

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
		mapStudentDatabaseObjects(selectResponse.studentRaws);
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
		if (approveResponse.success == true) {
			table.approveEntryUI();
			toasts.addToast({ message: "Successfully approved student entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to approve student entry", timeout: 3, type: 'error', open: true })
		}
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
		if (deleteResponse.success == true) {
			table.deleteEntryUI();
			toasts.addToast({ message: "Successfully deleted student entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to delete student entry", timeout: 3, type: 'error', open: true })
		}
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
		if (updateResponse.success == true) {
			table.updateEntryUI();
			toasts.addToast({ message: "Successfully updated student entry", timeout: 3, type: 'success', open: true })
		} else {
			toasts.addToast({ message: "Failed to update student entry", timeout: 3, type: 'error', open: true })
		}
	}
</script>

<div class="grid gap-2">
	<h3 class="pt-4">Students</h3>
	<div class="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		<Multiselect
			field={'College Programs'}
			options={collegePrograms}
			bind:value={$StudentFilterStore.program}
		/>
		<Multiselect field={'Colleges'} options={colleges} bind:value={$StudentFilterStore.college} />

		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">
				Is Active
			</h6>
			<select
				bind:value={$StudentFilterStore.isActive}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}>All</option>
				<option value={false}>Not Active</option>
				<option value={true}>Is Active</option>
			</select>
		</div>

		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">
				Is Enrolled
			</h6>
			<select
				bind:value={$StudentFilterStore.isEnrolled}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}>All</option>
				<option value={false}>Not Enrolled</option>
				<option value={true}>Is Enrolled</option>
			</select>
		</div>

		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">
				Min Student Number
			</h6>
			<select
				bind:value={$StudentFilterStore.minStudentNumber}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}></option>
				{#each studentNumberYear as year}
					<option value={year.value}>{year.name}</option>
				{/each}
			</select>
		</div>

		<div class="relative">
			<h6 class="absolute top-0 -m-[10px] ml-[12px] flex bg-white p-[5px] text-gray-400">
				Max Student Number
			</h6>
			<select
				bind:value={$StudentFilterStore.maxStudentNumber}
				class="block w-full rounded-[5px] border border-gray-200 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900"
			>
				<option class="text-grey-200" value={null}></option>
				{#each studentNumberYear as year}
					<option value={year.value} disabled={year.value < $StudentFilterStore.minStudentNumber}>{year.name}</option>
				{/each}
			</select>
		</div>
	</div>
	<Table
		on:approve={handleApprove}
		on:delete={handleDelete}
		on:update={handleUpdate}
		{headers}
		info={students}
		primaryKey="studentNumber"
		bind:this={table}
		{hide}
		{disableEdit}
	/>
</div>
<Toasts bind:this={toasts}></Toasts>