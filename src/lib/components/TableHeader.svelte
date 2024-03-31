<script lang="ts">
	import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
	import { Icon, ChevronUp, ChevronDown } from 'svelte-hero-icons';
	import { camelize} from '../utils/utils';
	import { sortTable } from '$lib/utils/tableOperations';

	export let headers: Array<String>;
	export let tableType: string;

	import { writable } from 'svelte/store';

	const sortKey = writable<string | undefined>(undefined);
	const sortDirection = writable<number | undefined>(undefined); 

	const handleSort = (header: String, tableType: string) => {
		const result = sortTable(camelize(header), tableType);
		if (result) {
			sortKey.set(result.sortKey);
			sortDirection.set(result.sortDirection);
		}
	};

	// You can also subscribe to these stores elsewhere in your component
	// sortKey.subscribe(value => {
	// 	console.log('sortKey:', value);
	// });

	// sortDirection.subscribe(value => {
	// 	console.log('sortDirection:', value);
	// });


</script>

<!-- TABLE HEADER -->
<TableHead theadClass="sentencecase" class="drop-shadow-[0_4px_4px_rgba(17,51,17,0.05)]">
	<!-- generating each of the headers -->
	{#each headers as header, index}
		<TableHeadCell
			class="{index === 0 ? 'sticky left-0' : ''} hover:cursor-pointer py-4 bg-white"
			on:click={() => handleSort(header, tableType)}
		>
			<div class="flex gap-2" style="width: 150px;">
				<!-- header name -->
				<p class="font-bold">{header}</p>

				<!-- sort buttons div -->
				<div class="flex flex-col">
					<button
						type="button"
						class="p-0 -mb-1 sort-button text-[#B8B9B9]"
						class:darkened={$sortKey === camelize(header) && $sortDirection === 1}
					>
						<Icon src={ChevronUp} micro size="15" />
					</button>
					<button
						type="button"
						class="p-0 -mt-1 sort-button text-[#B8B9B9]"
						class:darkened={$sortKey === camelize(header) && $sortDirection === -1}
					>
						<Icon src={ChevronDown} micro size="15" />
					</button>
				</div>
			</div>
		</TableHeadCell>
	{/each}

	<!-- filler div for header -->
	<div class="flex p-[27px] bg-white gap-4 pl-20 right-0 bg-gradient-to-l-ml-[100px]"></div>
</TableHead>

<style>
	.sort-button.darkened {
		color: var(--suse-black);
	}
</style>
