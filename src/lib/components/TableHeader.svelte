<script lang="ts">
	import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
	import { Icon, ChevronUp, ChevronDown } from 'svelte-hero-icons';
	import { camelize } from '../utils/utils';

	export let headers: Array<String>;
	export let sortKey: string = 'isEnrolled';
	export let sortDirection: number = 1;
	export let isEditing: boolean;
	export let hide: Array<string>;

	export const sortTable = (key: string): void => {
		/* If the user is not editing, set the appropriate sortKey and sortDirection based on the key. */
		/* If the key is the same, inverse the direction of the sorting. */
		/* If the key is different, sort upwards and set the sortKey to the new key. */
		// console.log(isEditing, sortDirection, sortKey)
		if (!isEditing) {
			if (sortKey === key) {
				sortDirection = -sortDirection;
			} else {
				sortKey = key;
				sortDirection = 1;
			}
		}
	};
</script>

<!-- TABLE HEADER -->
<TableHead theadClass="sentencecase" class="drop-shadow-[0_4px_4px_rgba(17,51,17,0.05)]">
	<!-- generating each of the headers -->
	{#each headers as header, index}
		{#if !hide.includes(camelize(header))}
			<TableHeadCell
				class="{index === 0 ? 'sticky left-0' : ''} bg-white py-4 hover:cursor-pointer"
				on:click={() => sortTable(camelize(header))}
			>
				<div class="flex gap-2" style="width: 180px;">
					<!-- header name -->
					<p class="font-bold">{header}</p>

					<!-- sort buttons div -->
					<div class="flex flex-col">
						<button
							type="button"
							class="sort-button -mb-1 p-0
                            {sortKey === camelize(header) && sortDirection === 1
								? 'text-suse-black'
								: 'text-suse-grey'}"
						>
							<Icon src={ChevronUp} micro size="15" />
						</button>
						<button
							type="button"
							class="sort-button -mt-1 p-0
                            {sortKey === camelize(header) && sortDirection === -1
								? 'text-suse-black'
								: 'text-suse-grey'}"
						>
							<Icon src={ChevronDown} micro size="15" />
						</button>
					</div>
				</div>
			</TableHeadCell>
		{/if}
	{/each}

	<!-- filler div for header -->
	<div class="bg-gradient-to-l-ml-[50px] right-0 flex gap-4 bg-white p-[27px] pl-20"></div>
</TableHead>
