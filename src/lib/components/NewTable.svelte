<script lang="ts">
    import { TableBody, Table, TableHead } from "flowbite-svelte";
    import { writable } from "svelte/store";

    import TableHeader from "./NewTableHeader.svelte";
    import TableRow from "./NewTableRow.svelte";

    export let information: Array<Object>;
    export let headers: Array<String>;
    export let primaryKey: string;

    let sortKey: string; 
    let sortDirection:number; 
    let isEditing: boolean;
    let sortedItems = writable<Array<any>>([]); 

    $: {
        const disableSort: boolean = isEditing;
        const key: string = sortKey;
        const direction: number = sortDirection;
        const items: Array<any> = [...information];
        
        if (!disableSort){
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
            sortedItems.set(items);
        }
    }

    const submitFormHandle = function (a: any) {
        console.log("From Table Row", a.detail)
    }
</script>

<Table hoverable={true} divClass="overflow-x-auto">
    <TableHeader headers={headers} bind:sortKey bind:sortDirection isEditing={isEditing}/>
    <TableBody>
        {#each $sortedItems as info}
            <TableRow on:submit={submitFormHandle} info={info} primaryKey={primaryKey} bind:isEditing/>
        {/each}
    </TableBody>
</Table>