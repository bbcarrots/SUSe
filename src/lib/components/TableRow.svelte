<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { TableBodyRow, TableBodyCell, Checkbox } from "flowbite-svelte";
    import { Check, XMark, Icon, Pencil, Trash } from "svelte-hero-icons";

    import { getKey } from "$lib/utils/utils";

    import TableCell from "./TableCell.svelte";
    import Input from "./Input.svelte";

    export let info: any;
    export let primaryKey: string;
    export let isEditing: boolean = false;
    
    // for edit
    let primaryKeyEdit: string | number | null = null;

    function triggerEdit(primaryKey:number) {
        if (isEditing == false){
            isEditing = true;
            primaryKeyEdit = primaryKey;
        }
    }

    function cancelEdit(){
        if (isEditing == true){
            isEditing = false;
            primaryKeyEdit = null;
        }
    }

    // specific store for student tables
    const defaultCollegeValue = info.college ? info.college : '';
    export let college = defaultCollegeValue;

    // update FormData store
    let formData = new FormData()

    function updateFormData(property: string) {
        const element = document.getElementById(property) as HTMLInputElement;
        const value = element?.value || ''; 

        if (property == "college"){
            college = value;
        }

        formData.set(property, value)
    }

    // event listener for changes in input
    function handleInputChange(event: any) {
        const { id } = event.target;
        updateFormData(id);
    }

    //TODO
    //function for submitting the formData
    const dispatch = createEventDispatcher<{submit:any}>()
    let isSubmitting = false
    const submitForm = async () => {
        isSubmitting = true;
        const payload:any = {};

        payload[primaryKey] = primaryKeyEdit;
        for (let [key, value] of formData.entries()) {
            payload[key] = value;
        }
        console.log(payload);
        await dispatch('submit', payload);
        if (isEditing == true){
            isEditing = false;
            primaryKeyEdit = null;
        }
        isSubmitting = false;
    }
</script>

<TableBodyRow color="custom" class="group relative overflow-x-auto hover:bg-[#FBFBFB] outline-1 outline-[#D2D2D2]/[.50]">

    <!-- If it's for editing, display a form -->
    {#if isEditing && getKey(info, primaryKey) === primaryKeyEdit}

        {#each Object.entries(info) as [field, value]}

          <!-- generate the primary key col (uneditable) -->
          {#if field == primaryKey || field == "email"}
            <TableCell field={field} value={value} info={info} primaryKey={primaryKey}/>
          {:else if field !== "isEnrolled"}
            <TableBodyCell class="pt-0 pb-0 pl-[12px]">
              <Input college={ field == "program" ? college : ""} field={field} value={value} on:input={handleInputChange}/>
            </TableBodyCell>
          {/if}
        {/each}

        <!-- generate the action buttons -->
        <div class="flex p-5 gap-4 group-hover:visible invisible pl-20 sticky right-0 bg-gradient-to-l from-white via-white to-transparent -ml-[100px]">

            <!-- save -->
            <button on:click={() => submitForm()} class="font-medium text-green-800">
              <Icon src="{Check}" micro size="20"/>
            </button>
            <!-- cancel -->
            <button on:click={() => cancelEdit()} class="font-medium text-red-600">
              <Icon src="{XMark}" micro size="20"/>
            </button>
        </div>

    <!-- If not for editing, display the information -->
    {:else}
        <!-- generate information for each column -->
        {#each Object.entries(info) as [field, value]}
            {#if field !== "isEnrolled"}
                <TableCell field={field} value={value} info={info} primaryKey={primaryKey}/>
            {/if}
        {/each}

        <!-- action buttons -->
        <div class="flex p-5 gap-4 group-hover:visible invisible pl-20 sticky right-0 bg-gradient-to-l from-white via-white to-transparent -ml-[100px]">
            <!-- generate the action buttons -->
            <a href="/tables" class="font-medium text-red-600"><Icon src="{Trash}" micro size="20"/></a>
            {#if info.hasOwnProperty("isEnrolled") && info.isEnrolled == "0"}
                <a href="/tables" class="font-medium text-green-800"><Icon src="{Check}" micro size="20"/></a>
            {/if}
            <button on:click={() => triggerEdit(getKey(info, primaryKey))} class="font-medium text-green-800">
                <Icon src="{Pencil}" micro size="20"/>
            </button>
        </div>
    {/if}
</TableBodyRow>

<style lang="postcss">
    @tailwind components;

    @layer components{
        input {
            @apply border border-gray-300 text-gray-900 block w-full text-[14px] p-2.5 h-1/2 rounded;
        }

        input:focus{
            @apply ring-blue-500 border-blue-500; 
        }
        
        input.error {
            @apply border-pink-600 text-pink-600; 
        }

        input.error:focus{
            @apply ring-pink-500 border-pink-500; 
        }

        .dot {
            @apply h-3 w-3 bg-gray-300 rounded-full inline-block;
        }
    }


</style>