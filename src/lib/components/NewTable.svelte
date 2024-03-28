<script lang="ts">
    import { TableBody, Table } from "flowbite-svelte";
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

</script>

<Table hoverable={true}>
    <TableHeader headers={headers}/>
    <TableBody>
        <!-- generate all sorted items -->
        {#each $sortedItems as info}
            <TableRow info={info} primaryKey={primaryKey}/>
        {/each}
    </TableBody>
</Table>
