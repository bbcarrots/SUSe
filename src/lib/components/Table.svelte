<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
  import { writable } from 'svelte/store';
  import { Icon, ExclamationCircle, Eye, Pencil, Trash, ChevronUp, ChevronDown } from 'svelte-hero-icons';
  
  export let information: Array<Object>;
  export let headers: Array<String>;

  let searchTerm = '';
  const sortKey = writable<string>('name'); // default sort key
  const sortDirection = writable<number>(1); // default sort direction (ascending)
  const sortedItems = writable<Array<any>>([]); // Sorted items store

  function camelize(str:String) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
  
  $: {
    const key: string = $sortKey;
    const direction: number = $sortDirection;
    const items: Array<any> = [...information];

    items.sort((a, b) => {
      const aVal: any = a[key];
      const bVal: any = b[key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return (aVal.localeCompare(bVal)) * direction;
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      } else {
        return 0;
      }
    });
    console.log(key);
    sortedItems.set(items);
  }

  const sortTable = (key: string): void => {
    if ($sortKey === key) {
      sortDirection.update((val) => -val);
    } else {
      sortKey.set(key);
      sortDirection.set(1);
    }
  };
</script>

<TableSearch placeholder="Search student by information" hoverable={true} bind:value={searchTerm}/>

<Table hoverable={true}>
  <TableHead theadClass="sentencecase drop-shadow-[0_35px_35px_rgba(17,51,17,0.03)]">
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    {#each headers as header}
      <TableHeadCell class="hover:cursor-pointer" on:click={() => sortTable(camelize(header))}>
        <div class="flex gap-2">
          <p class="font-bold">{header}</p>
          <div class="flex flex-col">
            <button type="button" class="p-0 -mb-1 sort-button"
              class:darkened={$sortKey === camelize(header) && $sortDirection === 1}
            > 
                <Icon src="{ChevronUp}" micro size="15"/> 
            </button>
            <button type="button" class="p-0 -mt-1 sort-button"
              class:darkened={$sortKey === camelize(header) && $sortDirection === -1}
            > 
              <Icon src="{ChevronDown}" micro size="15"/> 
            </button>
          </div>
        </div>
      </TableHeadCell>
    {/each}
  </TableHead>
  <TableBody>
    {#each $sortedItems as info}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        {#each Object.entries(info) as [field, value]}
          {#if field !== "isEnrolled"}
            <TableBodyCell>
              <span class="flex gap-3 items-center">
                
                <!-- to add the icon beside the name if applicable -->
                <span>
                  {#if field == "name" && Object.hasOwn(info, 'isEnrolled')}
                    {#if info.isenrolled == 1}
                      <span class="dot"></span>
                    {:else if info.isenrolled == 0}
                      <span class="warning-icon"><Icon src="{ExclamationCircle}" micro size="12"/></span>
                    {/if}
                  {/if}
                </span>

                <!-- the actual name goes here -->
                <p>{value}</p>
              </span>
            </TableBodyCell>
          {/if}
        {/each}
        <TableBodyCell>
          <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
          <a href="/tables" class="font-medium text-red-600 hover:underline dark:text-red-500">Remove</a>
        </TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>

<style>
  .sort-button.darkened{
    color:  var(--suse-black);
  }

  .sort-button{
    color: #B8B9B9;
  }
  
  .warning-icon{
    color: #FFA800;
  }

  .dot {
    height: 12px;
    width: 12px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }
</style>