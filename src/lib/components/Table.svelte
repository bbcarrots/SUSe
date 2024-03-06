<script lang="ts">
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
    export let information: Array<Object>;
    export let headers: Array<String>;
</script>

<!-- <TableSearch /> -->
<Table hoverable={true}>
  <TableHead theadClass="sentencecase">
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>
    {#each headers as header}
      <TableHeadCell> <p>{header}</p> </TableHeadCell>
    {/each}
  </TableHead>
  <TableBody>
    {#each information as info}
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