<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
  export let information: Array<Object>;
  export let headers: Array<String>;

  let searchTerm = '';

  // filters the information based on the search term in the searh bar
  $: filteredInformation = information.filter((item: any) => {
      const term = searchTerm.toLowerCase();
      
      return Object.values(item).some((value: any) => {
          const lowercasedValue = String(value).toLowerCase();
          return lowercasedValue.includes(term);
      });
  });
</script>

<TableSearch placeholder="Search student by information" hoverable={true} bind:inputValue={searchTerm}/>
<Table hoverable={true}>
  <TableHead theadClass="sentencecase drop-shadow-[0_35px_35px_rgba(17,51,17,0.03)]">
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    {#each headers as header}
      <TableHeadCell> <p class="font-bold">{header}</p> </TableHeadCell>
    {/each}
  </TableHead>
  <TableBody>
    {#each filteredInformation as info}
      <TableBodyRow>
        <TableBodyCell class="!p-4">
          <Checkbox />
        </TableBodyCell>
        {#each Object.entries(info) as [field, value]}
          {#if field!=="isEnrolled"}
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

</style>