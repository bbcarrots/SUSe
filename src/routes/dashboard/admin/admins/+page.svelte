<script lang="ts">
	export let data;
	let headers: string[] = [
        'Admin Number',
		'Nickname',
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
        nickname: "Gab"
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