<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
  import { writable } from 'svelte/store';
  import { Icon, ChevronUpDown, ChevronUp, ChevronDown } from 'svelte-hero-icons';
  
  export let information: Array<Object>;
  export let headers: Array<String>;

  let searchTerm = '';
  const sortKey = writable<string>('name'); // default sort key
  const sortDirection = writable<number>(1); // default sort direction (ascending)
  const sortedItems = writable<Array<any>>([]); // Sorted items store

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
      <TableHeadCell class="hover:cursor-pointer" on:click={() => sortTable(header.replace(/\s+/g, '').toLowerCase())}>
        <div class="flex gap-2">
          <p class="font-bold">{header}</p>
          <div class="flex flex-col gap-">
            <button type="button" class="p-0 -mb-1 sort-button"
              class:darkened={$sortKey === header.replace(/\s+/g, '').toLowerCase() && $sortDirection === 1}
            > 
                <Icon src="{ChevronUp}" micro size="15"/> 
            </button>
            <button type="button" class="p-0 -mt-1 sort-button"
              class:darkened={$sortKey === header.replace(/\s+/g, '').toLowerCase() && $sortDirection === -1}
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
          {#if field !== "isenrolled"}
            <TableBodyCell><p>{value}</p></TableBodyCell>
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
  

</style>