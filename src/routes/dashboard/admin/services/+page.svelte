<script lang="ts">
	export let data;
	let headers: string[] = [
		'Service ID',
		'Service Type',
	];

	let hide: string[] = [];

	let disableEdit: string[] = [
		'serviceID',
		'serviceType',
	];

	import Table from '$lib/components/Table.svelte';
	import { type ServiceProcessed } from '$lib/utils/types.js';

	const services: ServiceProcessed[] = [
        {
        serviceID: 12345,
        serviceType: "Laptop"
        }
    ];

</script>


<Table
	{headers}
	info={services}
	primaryKey="serviceID"
	{hide}
	{disableEdit}
/>