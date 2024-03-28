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
<TableHead theadClass="sentencecase" class="drop-shadow-[0_4px_4px_rgba(17,51,17,0.05)]">
    <!-- checkbox for the header -->
    <TableHeadCell class="!p-4 sticky left-0 bg-white">
        <Checkbox />
    </TableHeadCell>

    <!-- generating each of the headers -->
    {#each headers as header, index}
    <TableHeadCell class="{index === 0 ? 'sticky left-14 drop-shadow-[0px -10px 4px rgba(17, 51, 17, 0.02)] z-10' : ''} hover:cursor-pointer py-4 bg-white"  on:click={() => sortTable(camelize(header))}>
        
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


</TableHead>
  
<style>
.sort-button.darkened{
    color:  var(--suse-black);
}
</style>
  