<script lang="ts">
    import { TableBody, Table, TableHead } from "flowbite-svelte";
    import { sortDirection, sortKey, isEditing, sortedItems } from "$lib/stores/TableStores";

    import TableHeader from "./TableHeader.svelte";
    import TableRow from "./TableRow.svelte";

    export let information: Array<Object>;
    export let headers: Array<String>;
    export let primaryKey: string;

    $: {
        const disableSort: boolean = $isEditing;
        const key: string = $sortKey;
        const direction: number = $sortDirection;
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

    //handler that gets the payload forwarded from table row
    //payload contains properties edited and the new value of the property
    const submitFormHandle = function (a: any) {
        console.log("From Table Row", a.detail)
    }
</script>

<Table hoverable={true} divClass="overflow-x-auto">
    <TableHeader headers={headers}/>
    <TableBody>
        {#each $sortedItems as info}
            <TableRow on:submit={submitFormHandle} info={info} primaryKey={primaryKey}/>
        {/each}
    </TableBody>
</Table>
