<script lang="ts">
	import { Indicator, TableBodyCell, Tooltip } from 'flowbite-svelte';
	import { ExclamationCircle, Icon } from 'svelte-hero-icons';
	import { formatDateTime } from '$lib/utils/utils';
	export let info: any;
	export let field: string;
	export let value: any;
	export let primaryKey: string;
</script>

<TableBodyCell
	class={field === primaryKey
		? 'sticky left-0 bg-white drop-shadow-[10px_10px_5px_rgba(17,51,17,0.02)]'
		: ''}
>
	{#if field === 'studentNumber' && Object.hasOwn(info, 'isEnrolled') && Object.hasOwn(info, 'isActive')}
		<span class="flex items-center">
			<span class="pr-2">
				{#if info.isEnrolled === true && info.isActive == false}
					<Indicator size="sm" color="gray" class="mr-[2px]" />
					<Tooltip>Student is not using a service.</Tooltip>
				{:else if info.isEnrolled === true && info.isActive == true}
					<Indicator size="sm" color="green" class="mr-[2px]" />
					<Tooltip>Student is using a service.</Tooltip>
				{:else if info.isEnrolled === false}
					<span class="text-yellow-400"><Icon src={ExclamationCircle} micro size="12" /></span>
					<Tooltip>Student is not yet approved.</Tooltip>
				{/if}
			</span>
			<p>{value}</p>
		</span>
	{/if}

	{#if field == 'dateTimeStart' || field == 'dateTimeEnd'}
		<time datetime={value}>{value != null ? formatDateTime(value) : null}</time>
	{:else if field !== 'studentNumber' || !Object.hasOwn(info, 'isEnrolled')}
		<p class="max-w-60 text-wrap">{value}</p>
	{/if}
</TableBodyCell>
