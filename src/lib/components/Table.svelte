<script lang="ts">
	import { SvelteComponent, createEventDispatcher } from 'svelte';
	import { TableBody, Table } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';
	import Pagination from './Pagination.svelte';

	export let info: Array<Object>;
	export let headers: Array<string>;
	export let primaryKey: string;
	export let hide: Array<string>;
	export let disableEdit: Array<string>;

	/* activePage is binded to the value from Pagination.svelte */
	let activePage = 1;
	const rowsPerPage = 100;
	let totalRows = info.length;
	let totalPages = Math.ceil(totalRows / rowsPerPage);

	/* sortKey and sortDirection are binded to values from TableHeader.svelte */
	let sortKey: string;
	let sortDirection: number;

	/* isEditing is binded to the value from TableRow.svelte. */
	let isEditing: boolean;
	let sortedItems = writable<Array<any>>([]);
	let calculatedRows = writable<Array<any>>([]);
	/* Reactively sorts the items and stores in sortedItems based on the sortKey and sortDirection. */
	/* The sorting will be disabled if isEditing is true. */

	$: {
		const disableSort: boolean = isEditing;
		const key: string = sortKey;
		const direction: number = sortDirection;
		const items: Array<any> = [...info];

		if (!disableSort) {
			items.sort((a, b) => {
				const aVal: any = a[key];
				const bVal: any = b[key];

				if (typeof aVal === 'string' && typeof bVal === 'string') {
					return aVal.localeCompare(bVal) * direction;
				} else if (typeof aVal === 'number' && typeof bVal === 'number') {
					return (aVal - bVal) * direction;
				} else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
					const aNum = aVal ? 1 : 0;
					const bNum = bVal ? 1 : 0;
					return (aNum - bNum) * direction;
				} else {
					return 0;
				}
			});
			sortedItems.set(items);
		}

		totalRows = $sortedItems.length;
		totalPages = Math.ceil(totalRows / rowsPerPage);

		calculatedRows.set(
			$sortedItems.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage)
		);
	}

	// ----------------------------------------------------------------------------------
	const dispatch = createEventDispatcher();

	let eventObject: CustomEvent; //to store the event

	async function forwardApprove(event: CustomEvent) {
		/* Forwards Approve event to parent page. */
		eventObject = event;
		dispatch('approve', event.detail);
	}

	async function forwardActive(event: CustomEvent) {
		/* Forwards Approve event to parent page. */
		eventObject = event;
		dispatch('updateActive', event.detail);
	}

	async function forwardDelete(event: CustomEvent) {
		/* Forwards Delete event to parent page and updates Table after deletion. */
		eventObject = event;
		dispatch('delete', event.detail);
	}

	async function forwardUpdate(event: CustomEvent) {
		/* Forwards Update event to parent page. */
		eventObject = event;
		dispatch('update', event.detail);
	}

	// ----------------------------------------------------------------------------------
	// UI functions to update after receiving success response
	interface InfoEntry {
		[key: string]: any;
	}

	export function deleteEntryUI() {
		const primaryKeyDelete = eventObject.detail[primaryKey];
		const index = info.findIndex(
			(entry: { [key: string]: any }) => entry[primaryKey] === primaryKeyDelete
		);

		/* Delete the current entry from all the other entries */
		if (index !== -1) {
			info.splice(index, 1);
		}

		/* Update the content of info for the changes to be reflected in the DOM without needing to refresh */
		updateInfo();
	}

	export function updateEntryUI() {
		//find the current entry to update edit
		for (const [, entry] of Object.entries<InfoEntry>(info)) {
			//if the object to edit is found, update the information of the entry
			if (entry[primaryKey] == eventObject.detail[primaryKey]) {
				for (const [key, value] of Object.entries(eventObject.detail)) {
					if (entry.hasOwnProperty(key)) {
						entry[key] = value;
					}
				}
			}
		}

		updateInfo();
	}

	export function approveEntryUI() {
		//find the current entry to update edit
		for (const [, entry] of Object.entries<InfoEntry>(info)) {
			//if the object to edit is found, update the information of the entry
			if (entry[primaryKey] == eventObject.detail[primaryKey]) {
				entry['isEnrolled'] = true;
			}
		}

		updateInfo();
	}

	export function updateEntryActiveUI() {
		//find the current entry to update edit
		for (const [, entry] of Object.entries<InfoEntry>(info)) {
			//if the object to edit is found, update the information of the entry
			if (entry[primaryKey] == eventObject.detail[primaryKey]) {
				entry['isActive'] = !entry['isActive'];
			}
		}

		updateInfo();
	}

	function updateInfo() {
		/* Updates information shown in the Table component after a successful deletion. */
		info = info;
	}
</script>

<div class="justify-items grid">
	<Table hoverable={true} divClass="overflow-x-auto">
		<TableHeader {hide} {headers} bind:sortKey bind:sortDirection {isEditing} />
		<TableBody>
			{#each $calculatedRows as info, index}
				<TableRow
					on:approve={forwardApprove}
					on:delete={forwardDelete}
					on:update={forwardUpdate}
					on:updateActive={forwardActive}
					{info}
					{primaryKey}
					bind:isEditing
					{hide}
					{disableEdit}
				/>
			{/each}
		</TableBody>
	</Table>

	<Pagination {totalPages} bind:activePage></Pagination>
</div>
