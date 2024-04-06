<script lang="ts">
    import {Icon, ArrowDownTray, Plus, Trash} from "svelte-hero-icons"
    export let icon: string = "";
    export let inverse = false;
    export let small = false;
    export let disabled = false;
    export let submit = false;

    function getIconSize() {
        return small ? "15" : "24";
    }

</script>

<button 
    type={submit ? 'submit' : 'button'}
    class="flex gap-2 py-3 px-6 rounded-md hover:bg-suse-black/95 font-medium text-sm inline-flex items-center
        {inverse ? 'bg-transparent text-suse-black border border-suse-black border-solid hover:bg-suse-black/40' : 'bg-suse-black text-suse-white'}
        {small ? 'py-2 px-4' : 'py-3 px-6'}
        {disabled ? 'opacity-50 pointer-events-none' : ''}"
    on:click
> 
    {#if icon == "download"}
        <Icon src={ArrowDownTray} macro size={getIconSize()}/>
    {:else if icon == "add"}
        <Icon src={Plus} macro size={getIconSize()}/>
    {:else if icon == "delete"}
        <Icon src={Trash} macro size={getIconSize()}/>        
    {/if}

    <p>
        <slot />
    </p>
</button>