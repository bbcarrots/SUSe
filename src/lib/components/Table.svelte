<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';
  import { writable } from 'svelte/store';
  import { Icon, ExclamationCircle, Check, Pencil, Trash, ChevronUp, ChevronDown } from 'svelte-hero-icons';
  
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

<TableSearch divClass="drop-shadow-none" placeholder="Search" hoverable={true} bind:value={searchTerm}/>

<Table hoverable={true}>

  <!-- TABLE HEADER -->
  <TableHead theadClass="sentencecase" class="bg-white drop-shadow-[0_4px_4px_rgba(17,51,17,0.03)]">
    <!-- checkbox for the header -->
    <TableHeadCell class="!p-4">
      <Checkbox />
    </TableHeadCell>

    <!-- generating each of the headers -->
    {#each headers as header}
      <TableHeadCell class="hover:cursor-pointer py-4" on:click={() => sortTable(camelize(header))}>

        <div class="flex gap-2">
          <!-- header name -->
          <p class="font-bold">{header}</p>

          <!-- sort buttons div -->
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

    <!-- Add separate actions column -->
    <TableHeadCell>
      <p class="font-bold">Actions</p>
    </TableHeadCell>
  </TableHead>

  <!-- TABLE CONTENT -->
  <TableBody >

    <!-- generate all sorted items -->
    {#each $sortedItems as info}
      <TableBodyRow color="custom" class="bg-white hover:bg-[#FBFBFB] outline-1 outline-[#D2D2D2]/[.50]">

        <!-- checkbox for each table row -->
        <TableBodyCell class="!px-4 py-5">
          <Checkbox />
        </TableBodyCell>

        <!-- generate information for each column -->
        {#each Object.entries(info) as [field, value]}
          {#if field !== "isEnrolled"}
            <TableBodyCell>
              <span class="flex items-center">
                
                <!-- to add the icon beside the name if applicable. specific for student table-->
                {#if field == "name" && Object.hasOwn(info, 'isEnrolled')}
                  <span class="pr-2">
                    {#if info.isEnrolled == 1}
                      <span class="dot" ></span>
                    {:else if info.isEnrolled == 0}
                      <span class="warning-icon"><Icon src="{ExclamationCircle}" micro size="12"/></span>
                    {/if}
                  </span>
                {/if}


                <!-- the actual value goes here -->
                <p>{value}</p>
              </span>
            </TableBodyCell>
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
          <a href="/tables" class="font-medium text-green-800"><Icon src="{Pencil}" micro size="20"/></a>
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