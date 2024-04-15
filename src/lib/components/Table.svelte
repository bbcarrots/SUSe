<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TableBody, Table } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';
	import Pagination from './Pagination.svelte';

	export let info: Array<Object>;
	export let headers: Array<String>;
	export let primaryKey: string;
	export let hide: Array<string>;
	export let disableEdit: Array<string>;

    /* sortKey and sortDirection are binded to values from TableHeader.svelte */
	let sortKey: string;
	let sortDirection: number;

    /* isEditing is binded to the value from TableRow.svelte. */
	let isEditing: boolean;
	let sortedItems = writable<Array<any>>([]);

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
				} else {
					return 0;
				}
			});
			sortedItems.set(items);
		}
	}

	// ----------------------------------------------------------------------------------
	const dispatch = createEventDispatcher();

	async function forwardApprove(event: CustomEvent) {
        /* Forwards Approve event to parent page. */
		dispatch('approve', event.detail);
	}

	async function forwardDelete(event: CustomEvent) {
        /* Forwards Delete event to parent page and updates Table after deletion. */
		dispatch('delete', event.detail);

		const primaryKeyDelete = event.detail[primaryKey];
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

	function updateInfo() {
        /* Updates information shown in the Table component after a successful deletion. */
		info = info;
	}

	async function forwardUpdate(event: CustomEvent) {
        /* Forwards Update event to parent page. */
		dispatch('update', event.detail);
	}
</script>

<Table hoverable={true} divClass="overflow-x-auto">
	<TableHeader {hide} {headers} bind:sortKey bind:sortDirection {isEditing} />
	<TableBody>
		{#each $sortedItems as info}
			<TableRow
				on:approve={forwardApprove}
				on:delete={forwardDelete}
				on:update={forwardUpdate}
				{info}
				{primaryKey}
				bind:isEditing
				{hide}
				{disableEdit}
			/>
		{/each}
	</TableBody>
</Table>

<Pagination total_rows={1000}></Pagination>
