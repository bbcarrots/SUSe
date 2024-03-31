<script lang="ts">
    import { writable } from "svelte/store";
    import { TableBody, Table, TableHead } from "flowbite-svelte";
    import { sortDirectionStudents, sortKeyStudents, isEditingStudents, sortedItemsStudents } from "$lib/stores/StudentTableStores";
    import { setSortedItems } from "$lib/utils/tableOperations"

    import TableHeader from "./TableHeader.svelte";
    import TableRow from "./TableRow.svelte";

    export let information: Array<Object>;
    export let headers: Array<String>;
    export let primaryKey: string;
    export let tableType: string;

    let sortedItems = writable<any>([]);

    $: {
        let disableSort: boolean;
        let key: string;
        let direction: number ;
        const items: Array<any> = [...information];

        if(tableType == "students"){
            disableSort = $isEditingStudents;
            key = $sortKeyStudents;
            direction = $sortDirectionStudents;
        } else{
            disableSort = $isEditingStudents;
            key = $sortKeyStudents;
            direction = $sortDirectionStudents;
        }

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
            sortedItems.set(setSortedItems(tableType, items));
        }
    }

    const submitFormHandle = function (a: any) {
        console.log("From Table Row", a.detail)
    }
</script>

<Table hoverable={true} divClass="overflow-x-auto">
    <TableHeader headers={headers} tableType={tableType}/>
    <TableBody>
        {#each $sortedItems as info}
            <TableRow tableType={tableType} on:submit={submitFormHandle} info={info} primaryKey={primaryKey}/>
        {/each}
    </TableBody>
</Table>
