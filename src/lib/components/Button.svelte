<script lang="ts">
    import {Icon, ArrowDownTray, Plus, Trash} from "svelte-hero-icons"
    export let icon: string = "";
    export let inverse = false;
    export let small = false;
    export let disabled = true;

    function getIconSize() {
        return small ? "15" : "24";
    }

</script>

<button 
    type="button" 
    class="hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
    class:inverse={inverse}
    class:small={small}
    class:disabled={disabled}
    on:click
> 

    {#if icon == "download"}
        <Icon src="{ArrowDownTray}" macro size={getIconSize()}/>
    {:else if icon == "add"}
        <Icon src="{Plus}" macro size={getIconSize()}/>
    {:else if icon == "delete"}
        <Icon src="{Trash}" macro size={getIconSize()}/>        
    {/if}

    <p>
        <slot />
    </p>

</button>

<style>

    button{
        display: flex;
        gap: 8px;
        padding: 12px 24px;
        background-color: var(--suse-black);
        color: var(--suse-white);
        border-radius: 5px;
    }

    .inverse{
        background-color: transparent;
        color: var(--suse-black);
        border-color: var(--suse-black);
        border-width: 1px;
    }

    .small{
        padding: 6px 8px;
        gap: 4px;
    }

    .disabled{
        background-color: var(--suse-black);
        opacity: 50%;
        pointer-events: none;
    }

    .disabled:hover{
        cursor: not-allowed;
    }

</style>
