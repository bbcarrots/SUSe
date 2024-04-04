<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TableBodyRow, TableBodyCell, Modal } from 'flowbite-svelte';
	import { Check, XMark, Icon, Pencil, Trash } from 'svelte-hero-icons';

	import { getKey } from '$lib/utils/utils';

	import TableCell from './TableCell.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';

	export let info: any; // stores the information of the object in the TableRow entry
	export let primaryKey: string; // stores the name of the primary key of the table
	export let isEditing: boolean = false; // stores whether or not the user is currently editing an entry
	export let hide: Array<string>;
	export let disableEdit: Array<string>;

	let popupModal = false; // stores whether or not the delete modal should appear
	let primaryKeyEdit: number | null = null; // stores the primaryKey of the entry being edited

	const dispatch = createEventDispatcher(); // for forwarding events

	function triggerEdit(primaryKey: number) {
		/* Sets the isEditing variable to true and keeps track of the current primaryKey being edited. */
		if (isEditing == false) {
			isEditing = true;
			primaryKeyEdit = primaryKey;
		}
	}

	function cancelEdit() {
		/* If isEditing is true, set it back to false after the editing is done and reset the primaryKey being edited. */
		if (isEditing == true) {
			isEditing = false;
			primaryKeyEdit = null;
		}
	}

	function approveEnrollment(primaryKeyApprove: string, info: any) {
		/* Edits the isEnrolled field of the information to true. */
		/* Forwards the information to Table.svelte */
		const payload: any = {};

		info.isEnrolled = true;
		payload[primaryKey] = primaryKeyApprove;

		dispatch('approve', payload);

        /* Update the content of info for the changes to be reflected in the DOM without needing to refresh. */
		updateInfo(); 
	}

	// specific store for student tables
	const defaultCollegeValue = info.college ? info.college : ''; // gets the default value of college based on info.college
	export let college = defaultCollegeValue; // stores the current value of the college property to dynamically show which programs are available

	let formData = new FormData(); // stores the data from the input fields

	function updateFormData(property: string) {
		/* Gets the value in the input field given the property being edited. */
		/* Stores the value in formData corresponding to the correct property. */
		const element = document.getElementById(property) as HTMLInputElement;
		const value = element?.value || '';

		if (property == 'college') {
			college = value;
		}

		formData.set(property, value);
	}

	function handleInputChange(event: any) {
		/* Handles everytime the input is changed. */
		/* Takes the ID of the current input and calls updateFormDate on the ID. */
		const { id } = event.target;
		updateFormData(id);
	}

	const submitForm = async () => {
		/* Handles the operation when the editing is saved. */
		/* Forwards the formData to Table.svelte. */
		const payload: any = {};
		payload[primaryKey] = primaryKeyEdit;

		for (let [key, value] of formData.entries()) {
			payload[key] = value;
			if (info.hasOwnProperty(key)) {
				info[key] = value;
			}
		}

		dispatch('update', payload);

		/* Reset isEditing and primaryKeyEdit */
		if (isEditing == true) {
			isEditing = false;
			primaryKeyEdit = null;
		}
        
		/* Update the content of info for the changes to be reflected in the DOM without needing to refresh. */
		updateInfo();
	};


	function updateInfo() { 
		/* Updates information shown in the TableRow component. */
		info = info;
	}

	function deleteEntry(primaryKeyDelete: string) {
		/* Forwards the primary key to be deleted to Table.svelte */
		const payload: any = {};
		payload[primaryKey] = primaryKeyDelete;

		dispatch('delete', payload);
	}
</script>

<TableBodyRow
	color="custom"
	class="group overflow-x-auto outline-1 outline-[#D2D2D2]/[.50] hover:bg-[#FBFBFB]"
>
	<!-- If it's for editing, display a form -->
	{#if isEditing && getKey(info, primaryKey) === primaryKeyEdit}
		{#each Object.entries(info) as [field, value]}
			<!-- generate the primary key col (uneditable) -->
			{#if disableEdit.includes(field) && !hide.includes(field)}
				<TableCell {field} {value} {info} {primaryKey} />
			{:else if !disableEdit.includes(field) && !hide.includes(field)}
				<TableBodyCell class="pb-0 pl-[12px] pt-0">
					<Input
						college={field == 'program' ? college : ''}
						{field}
						{value}
						on:input={handleInputChange}
					/>
				</TableBodyCell>
			{/if}
		{/each}

		<!-- generate the action buttons -->
		<div
			class="invisible sticky right-0 -ml-[40px] flex gap-4 bg-gradient-to-l from-white via-white to-transparent py-5 pl-[50px] group-hover:visible"
		>
			<!-- save -->
			<button on:click={() => submitForm()} class="font-medium text-green-800">
				<Icon src={Check} micro size="20" />
			</button>
			<!-- cancel -->
			<button on:click={() => cancelEdit()} class="font-medium text-red-600">
				<Icon src={XMark} micro size="20" />
			</button>
		</div>

		<!-- If not for editing, display the information -->
	{:else}
		<!-- generate information for each column -->
		{#each Object.entries(info) as [field, value]}
			{#if !hide.includes(field)}
				<TableCell {field} {value} {info} {primaryKey} />
			{/if}
		{/each}

		<!-- action buttons -->
		<div
			class="invisible sticky right-0 -ml-[40px] flex gap-4 bg-gradient-to-l from-white via-white to-transparent py-5 pl-[50px] group-hover:visible"
		>
			<!-- generate the action buttons -->
			<button on:click={() => (popupModal = true)} class="font-medium text-red-600">
				<Icon src={Trash} micro size="20" />
			</button>
			{#if info.hasOwnProperty('isEnrolled') && info.isEnrolled == '0'}
				<button
					on:click={() => approveEnrollment(getKey(info, primaryKey), info)}
					class="font-medium text-green-800"
				>
					<Icon src={Check} micro size="20" />
				</button>
			{/if}
			<button
				on:click={() => triggerEdit(getKey(info, primaryKey))}
				class="font-medium text-green-800"
			>
				<Icon src={Pencil} micro size="20" />
			</button>
		</div>
	{/if}
</TableBodyRow>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<p class="font-bold text-[#131416]">Are you sure you want to delete this entry?</p>
		<p>This cannot be undone.</p>
		{#each Object.entries(info) as [field, value], index}
			{#if field !== 'isEnrolled'}
				<span> {value}, </span>
			{/if}
		{/each}
	</div>

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button inverse={true}>Cancel</Button>
		<Button on:click={() => deleteEntry(getKey(info, primaryKey))} icon="delete">Delete</Button>
	</div>
</Modal>

<style lang="postcss">
	@tailwind components;

	@layer components {
		input {
			@apply block h-1/2 w-full rounded border border-gray-300 p-2.5 text-[14px] text-gray-900;
		}

		input:focus {
			@apply border-blue-500 ring-blue-500;
		}

		input.error {
			@apply border-pink-600 text-pink-600;
		}

		input.error:focus {
			@apply border-pink-500 ring-pink-500;
		}

		.dot {
			@apply inline-block h-3 w-3 rounded-full bg-gray-300;
		}
	}
</style>
