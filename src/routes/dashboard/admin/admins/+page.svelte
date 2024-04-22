<script lang="ts">
	export let data;
	let headers: string[] = [
        'Admin Number',
		'First Name',
		'Middle Initial',
		'Last Name',
	];

	let hide: string[] = [];

	let disableEdit: string[] = [
		'adminID',
	];

	import Table from '$lib/components/Table.svelte';
	import { type AdminProcessed } from '$lib/utils/types.js';

	const admins: AdminProcessed[] = [
        {
        adminID: 12345,
        firstName: "Gab",
	    middleInitial: "P",
	    lastName: "Ogi",
        }
    ];

</script>


<Table
	{headers}
	info={admins}
	primaryKey="adminID"
	{hide}
	{disableEdit}
/>