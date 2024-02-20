<script lang="ts">
    import {Icon, ArrowDownTray, Plus, Trash} from "svelte-hero-icons"
    export let text: string;
    export let icon: string = "";
    // export let is_small: boolean;

</script>

<button 
    type="button" 
    class="hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
> 
    {#if icon == "download"}
        <Icon src="{ArrowDownTray}" macro size="24"/>
    {:else if icon == "add"}
        <Icon src="{Plus}" macro size="24"/>
    {:else if icon == "delete"}
        <Icon src="{Trash}" macro size="24"/>        
    {/if}
    <p>{text}</p>
</button>

<style>

    button{
        display: flex;
        gap: 8px;
        padding: 12px 24px;
        background-color: var(--suse-black);
        color: var(--suse-white);
    }


</style>
