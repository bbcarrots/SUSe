<script lang="ts">
    import { TableBodyRow, TableBodyCell, Checkbox } from "flowbite-svelte";
    import { getKey } from "$lib/utils/utils";
    import { Check, XMark, Icon, Pencil, Trash } from "svelte-hero-icons";
    import TableCell from "./TableCell.svelte";
    import { isEditing } from "$lib/stores/TableStores";

    export let info: any;
    export let primaryKey: string;

    // for edit
    let primaryKeyEdit: string | number | null = null;

    function triggerEdit(primaryKey:number) {
        isEditing.set(true);
        primaryKeyEdit = primaryKey;
        console.log(primaryKeyEdit)
    }

</script>

<TableBodyRow color="custom" class="overflow-x-auto bg-white hover:bg-[#FBFBFB] outline-1 outline-[#D2D2D2]/[.50]">

    <!-- checkbox for each table row -->
    <TableBodyCell class="!px-4 py-5 sticky left-0">
      <Checkbox />
    </TableBodyCell>

    <!-- If it's for editing, display a form -->
    {#if isEditing && getKey(info, primaryKey) === primaryKeyEdit}
        {#each Object.entries(info) as [field, value]}
          {#if field !== "isEnrolled"}
            <TableBodyCell class="pt-0 pb-0 pl-[12px]">
              <input type="text" id={field} name={field} value={value}>
            </TableBodyCell>
          {/if}
        {/each}

        <!-- generate the action buttons -->
        <TableBodyCell class="flex gap-4">
          <!-- save -->
          <button on:click={() => triggerEdit(getKey(info, primaryKey))} class="font-medium text-green-800">
            <Icon src="{Check}" micro size="20"/>
          </button>
          <!-- save -->
          <button on:click={() => triggerEdit(getKey(info, primaryKey))} class="font-medium text-red-600">
            <Icon src="{XMark}" micro size="20"/>
          </button>
        </TableBodyCell>

    <!-- If not for editing, display the information -->
    {:else}
      <!-- generate information for each column -->
      {#each Object.entries(info) as [field, value]}
        {#if field !== "isEnrolled"}
            <TableCell field={field} value={value} info={info} primaryKey={primaryKey}/>
        {/if}
      {/each}

        <!-- generate the action buttons -->
        <TableBodyCell class="flex gap-4">
          <!-- delete -->
          <a href="/tables" class="font-medium text-red-600"><Icon src="{Trash}" micro size="20"/></a>
          <!-- approve for students who are not enrolled -->
          {#if info.hasOwnProperty("isEnrolled") && info.isEnrolled == "0"}
            <a href="/tables" class="font-medium text-green-800"><Icon src="{Check}" micro size="20"/></a>
          {/if}
          <!-- edit -->
          <button on:click={() => triggerEdit(getKey(info, primaryKey))} class="font-medium text-green-800">
            <Icon src="{Pencil}" micro size="20"/>
          </button>
        </TableBodyCell>
    {/if}

  </TableBodyRow>

<style lang="postcss">
    @tailwind components;

    @layer components{
        input {
            @apply border border-gray-300 text-gray-900 block w-full text-[14px] p-2.5 h-1/2 rounded;
        }

        input:focus{
            @apply ring-blue-500 border-blue-500; 
        }
        
        input.error {
            @apply border-pink-600 text-pink-600; 
        }

        input.error:focus{
            @apply ring-pink-500 border-pink-500; 
        }

        .dot {
            @apply h-3 w-3 bg-gray-300 rounded-full inline-block;
        }
    }
</style>