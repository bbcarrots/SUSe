<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TableBodyRow, TableBodyCell, Modal } from 'flowbite-svelte';
	import { Check, XMark, Icon, Pencil, Trash, Star } from 'svelte-hero-icons';

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

	// specific store for student tables
	const defaultCollegeValue = info.college ? info.college : ''; // gets the default value of college based on info.college
	export let college = defaultCollegeValue; // stores the current value of the college property to dynamically show which programs are available

	let formData = new FormData(); // stores the data from the input fields

	// ----------------------------------------------------------------------------------
	// functions that handle the edit form

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
		let hasInvalid = false;

		/* Check if each input has valid entries */
		document.querySelectorAll('input').forEach((input) => {
			if (!input.reportValidity()) {
				hasInvalid = true;
			}
		});

		if (!hasInvalid) {
			for (let [key, value] of formData.entries()) {
				payload[key] = value;
			}

			dispatch('update', payload);

			/* Reset isEditing and primaryKeyEdit */
			if (isEditing == true) {
				isEditing = false;
				primaryKeyEdit = null;
			}
		} else {
			hasInvalid = false;
		}
	};

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

	// ----------------------------------------------------------------------------------
	// update, delete, approve functions that dispatch the corresponding event upwards

	function approveEnrollment(primaryKeyApprove: string) {
		/* Edits the isEnrolled field of the information to true. */
		/* Forwards the information to Table.svelte */
		const payload: any = {};
		payload[primaryKey] = primaryKeyApprove;

		dispatch('approve', payload);
	}

	function updateActive(primaryKeyIsActive: string, currentStatus: boolean) {
        /* Forwards the adminID and isActive status to Table.svelte. */
		const payload: any = {};
		payload[primaryKey] = primaryKeyIsActive;
        payload['currentStatus'] = currentStatus;

		dispatch('updateActive', payload);
	}

	function deleteEntry(primaryKeyDelete: string) {
		/* Forwards the primary key to be deleted to Table.svelte */
		const payload: any = {};
		payload[primaryKey] = primaryKeyDelete;

		dispatch('delete', payload);
		popupModal = false;
	}
</script>

<TableBodyRow
	color="custom"
	class="group overflow-x-auto outline-1 outline-suse-black/[.20] hover:bg-suse-grey/[.10]"
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
			class="items-right invisible sticky right-0 -ml-[40px] flex gap-4 bg-gradient-to-l from-white via-white to-transparent py-5 pl-[30px] group-hover:visible"
		>
			<!-- save button-->
			<button on:click={() => submitForm()} class="font-medium text-green-800">
				<Icon src={Check} micro size="20" />
			</button>
			<!-- cancel button-->
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
			class="items-right invisible sticky right-0 -ml-[40px] flex gap-4 bg-gradient-to-l from-white via-white to-transparent py-5 pl-[30px] group-hover:visible"
		>
			<!-- delete button -->
			<button on:click={() => (popupModal = true)} class="font-medium text-red-600">
				<Icon src={Trash} micro size="20" />
			</button>
			{#if info.hasOwnProperty('isEnrolled') && info.isEnrolled == '0'}
				<!-- approve enrollment button -->
				<button
					on:click={() => approveEnrollment(getKey(info, primaryKey))}
					class="font-medium text-green-800"
				>
					<Icon src={Check} micro size="20" />
				</button>
			{/if}
			{#if info.hasOwnProperty('nickname') && info.hasOwnProperty('adminID')}
				{#if info.isActive == false}
					<!-- set active button -->
					<button
						on:click={() => updateActive(getKey(info, primaryKey), getKey(info, 'isActive'))}
						class="font-medium text-green-800"
					>
						<Icon src={Star} outline size="20" />
					</button>
				{:else}
					<!-- set inactive button -->
					<button
						on:click={() => updateActive(getKey(info, primaryKey), getKey(info, 'isActive'))}
						class="font-medium text-green-800"
					>
						<Icon src={Star} micro size="20" />
					</button>
				{/if}
			{/if}
			<!-- edit button -->
			<button
				on:click={() => triggerEdit(getKey(info, primaryKey))}
				class="font-medium text-green-800"
			>
				<Icon src={Pencil} micro size="20" />
			</button>
		</div>
	{/if}
</TableBodyRow>

<!-- Modal for deleting confirmation -->
<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<p class="font-bold text-suse-black">Are you sure you want to delete this entry?</p>
		<p>This cannot be undone.</p>
		{#each Object.entries(info) as [field, value], index}
			{#if field !== 'isEnrolled'}
				<span> {value}, </span>
			{/if}
		{/each}
	</div>

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button on:click={() => (popupModal = false)} inverse={true}>Cancel</Button>
		<Button on:click={() => deleteEntry(getKey(info, primaryKey))} icon="delete">Delete</Button>
	</div>
</Modal>
