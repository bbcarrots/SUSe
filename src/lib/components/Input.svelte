<script lang="ts">
    import { CollegePrograms } from "$lib/stores/CollegePrograms";

    export let field: string;
    export let value: any;
    export let college = "College of Engineering";

</script>


{#if field == "college"}
    <select on:input name={field} id={field} class="border text-[14px] rounded-[5px] px-[16px] py-[12px] border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        {#each $CollegePrograms as program}
            {#if program.college == value}
                <option value={program.college} selected>{program.college}</option>
            {:else}
                <option value={program.college}>{program.college}</option>
            {/if}
        {/each}
    </select>
    

{:else if field=="program"}
    <select on:input name={field} id={field} class="border text-[14px] rounded-[5px] px-[16px] py-[12px] border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        {#each $CollegePrograms as program}
            {#if program.college == college}
                {#each program.programs as department}
                {#if department == value}
                    <option value={department} selected>{department}</option>
                {:else}
                    <option value={department}>{department}</option>
                {/if}
                {/each}
            {/if}
        {/each}
    </select>

{:else}
    <input type="text" id={field} name={field} value={value} on:input>
{/if}

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

        select {
            @apply border text-[14px] rounded border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 h-1/2;
        }
    }

</style>