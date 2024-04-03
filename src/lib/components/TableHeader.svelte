<script lang="ts">
    import { TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
    import { Icon, ChevronUp, ChevronDown } from 'svelte-hero-icons';
    import { camelize } from '../utils/utils'
    
    export let headers: Array<String>;
    export let sortKey: string; 
    export let sortDirection: number; 
    export let isEditing: boolean;

    export const sortTable = (key: string): void => {
        // console.log(isEditing, sortDirection, sortKey)
        if (!isEditing){
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
    <TableHeadCell class="{index === 0 ? 'sticky left-0' : ''} hover:cursor-pointer py-4 bg-white"  on:click={() => sortTable(camelize(header))}>
        
        <div class="flex gap-2" style="width: 150px;">
            <!-- header name -->
            <p class="font-bold">{header}</p>

            <!-- sort buttons div -->
            <div class="flex flex-col">
                <button type="button" class="p-0 -mb-1 sort-button text-[#B8B9B9]"
                    class:darkened={sortKey === camelize(header) && sortDirection === 1}
                > 
                    <Icon src="{ChevronUp}" micro size="15"/> 
                </button>
                <button type="button" class="p-0 -mt-1 sort-button text-[#B8B9B9]"
                    class:darkened={sortKey === camelize(header) && sortDirection === -1}
                > 
                    <Icon src="{ChevronDown}" micro size="15"/> 
                </button>
            </div>
        </div>
        </TableHeadCell>
    {/each}

    <!-- filler div for header -->
    <div class="flex p-[27px] bg-white gap-4 pl-20 right-0 bg-gradient-to-l-ml-[50px]">
    </div>
</TableHead>
  
<style>
.sort-button.darkened{
    color:  var(--suse-black);
}
</style>
  