<script lang="ts">
    import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
    import { Icon, ChevronUp, ChevronDown } from 'svelte-hero-icons';
    import { camelize } from '../utils/utils'
    import { sortKey, sortDirection, isEditing } from '$lib/stores/TableStores';

    export let headers: Array<String>;

    export const sortTable = (key: string): void => {
        console.log($isEditing)
        if (!$isEditing){
            if ($sortKey === key) {
                sortDirection.update((val) => -val);
            } else {
                sortKey.set(key);
                sortDirection.set(1);
            }
        }
    };

</script>
  
<!-- TABLE HEADER -->
<TableHead theadClass="sentencecase" class="bg-white drop-shadow-[0_4px_4px_rgba(17,51,17,0.03)]">
    <!-- checkbox for the header -->
    <TableHeadCell class="!p-4">
        <Checkbox />
    </TableHeadCell>

    <!-- generating each of the headers -->
    {#each headers as header}
        <TableHeadCell class="hover:cursor-pointer py-4" on:click={() => sortTable(camelize(header))}>
        
        <div class="flex gap-2" style="width: 150px;">
            <!-- header name -->
            <p class="font-bold">{header}</p>

            <!-- sort buttons div -->
            <div class="flex flex-col">
                <button type="button" class="p-0 -mb-1 sort-button text-[#B8B9B9]"
                    class:darkened={$sortKey === camelize(header) && $sortDirection === 1}
                > 
                    <Icon src="{ChevronUp}" micro size="15"/> 
                </button>
                <button type="button" class="p-0 -mt-1 sort-button text-[#B8B9B9]"
                    class:darkened={$sortKey === camelize(header) && $sortDirection === -1}
                > 
                    <Icon src="{ChevronDown}" micro size="15"/> 
                </button>
            </div>
        </div>
        </TableHeadCell>
    {/each}

    <!-- Add separate actions column -->
    <TableHeadCell>
        <p class="font-bold">Actions</p>
    </TableHeadCell>
</TableHead>
  
<style>
.sort-button.darkened{
    color:  var(--suse-black);
}
</style>
  