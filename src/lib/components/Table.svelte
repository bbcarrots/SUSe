<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TableBody, Table } from "flowbite-svelte";
    import { writable } from "svelte/store";

    import TableHeader from "./TableHeader.svelte";
    import TableRow from "./TableRow.svelte";

    export let information: Array<Object>;
    export let headers: Array<String>;
    export let primaryKey: string;

    let sortKey: string; 
    let sortDirection: number; 
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

    const dispatchDelete = createEventDispatcher<{delete:any}>()
    const dispatchEdit = createEventDispatcher<{submit:any}>()
    const dispatchApprove = createEventDispatcher<{approve:any}>()

    const submitFormHandle = async (a: any) => {
        dispatchEdit('submit', a.detail);
    }

    const submitApproveHandle = async (a: any) => {
        dispatchApprove('approve', a.detail);
    }

    const deleteEntryHandle = async (a: any) => {
        dispatchDelete('delete', a.detail);
        console.log(a.detail);

        const primaryKeyDelete = a.detail[primaryKey];
        console.log(primaryKeyDelete)

        const index = information.findIndex((entry: { [key: string]: any }) => 
            entry[primaryKey] === primaryKeyDelete
        );

        if (index !== -1) {
            information.splice(index, 1);
        }

        update()
    };

    function update(){
        information = information;
    }

</script>

<Table hoverable={true} divClass="overflow-x-auto">
    <TableHeader headers={headers} bind:sortKey bind:sortDirection isEditing={isEditing}/>
    <TableBody>
        {#each $sortedItems as info}
            <TableRow on:approve={submitApproveHandle} on:delete={deleteEntryHandle} on:submit={submitFormHandle} info={info} primaryKey={primaryKey} bind:isEditing/>
        {/each}
    </TableBody>
</Table>