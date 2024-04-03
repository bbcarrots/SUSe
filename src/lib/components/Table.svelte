<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TableBody, Table } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';

	export let info: Array<Object>;
	export let headers: Array<String>;
	export let primaryKey: string;

	let sortKey: string;
	let sortDirection: number;
	let isEditing: boolean;
	let sortedItems = writable<Array<any>>([]);

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

		if (index !== -1) {
			info.splice(index, 1);
		}

		updateInfo(); // why do we need this function? 
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
	<TableHeader {headers} bind:sortKey bind:sortDirection {isEditing} />
	<TableBody>
		{#each $sortedItems as info}
			<TableRow
				on:approve={forwardApprove}
				on:delete={forwardDelete}
				on:update={forwardUpdate}
				{info}
				{primaryKey}
				bind:isEditing
			/>
		{/each}
	</TableBody>
</Table>
