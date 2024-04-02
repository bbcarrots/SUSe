<script lang="ts">
    import { Indicator, TableBodyCell } from "flowbite-svelte";
    import { ExclamationCircle, Icon } from "svelte-hero-icons";
    
    export let info: any;
    export let field: string;
    export let value: any;
    export let primaryKey: string;

</script>

<TableBodyCell class="{field === primaryKey ? 'sticky left-0 bg-white drop-shadow-[10px_10px_5px_rgba(17,51,17,0.02)]' : ''}">
    {#if field === "studentNumber" && Object.hasOwn(info, 'isEnrolled')}
        <span class="flex items-center">
            <span class="pr-2">
            {#if info.isEnrolled === true}
                <Indicator size="md" color="gray" />
            {:else if info.isEnrolled === false}
                <span class="text-[#FFA800]"><Icon src="{ExclamationCircle}" micro size="12"/></span>
            {/if}
            </span>
            <p>{value}</p>
      </span>
    {/if}
    
    {#if field !== "studentNumber" || !Object.hasOwn(info, 'isEnrolled')}
      <p>{value}</p>
    {/if}
</TableBodyCell>