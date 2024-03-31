<script lang="ts">
    import { TableBody, Table, TableHead } from "flowbite-svelte";
    import { sortDirection, sortKey, isEditing, sortedItems } from "$lib/stores/TableStores";

    import TableHeader from "./TableHeader.svelte";
    import TableRow from "./TableRow.svelte";

    import { createEventDispatcher } from "svelte";

    export let information: Array<Object>;
    export let headers: Array<String>;
    export let primaryKey: string;

    // for event forwarding
    const dispatch = createEventDispatcher();

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

    function forwardCommand(event: CustomEvent<{command:string}>) {
        dispatch('command', event.detail);
    }
</script>

<Table hoverable={true} divClass="overflow-x-auto">
    <TableHeader headers={headers}/>
    <TableBody>
        {#each $sortedItems as info}
            <TableRow info={info} primaryKey={primaryKey} on:command={forwardCommand}/>
        {/each}
    </TableBody>
</Table>
