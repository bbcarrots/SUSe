<script lang="ts">	
    import { Icon, ChevronLeft, ChevronRight } from "svelte-hero-icons";
    export let activePage: number;
    // export let rowsPerPage: number;
    export let totalPages: number;
    // export let totalRows: number;

</script>

<div class="flex">
    <div class="flex items-center p-5">
        <button on:click={() => { if (activePage > 1) { activePage -= 1 } }}
            class="{activePage == 1 ? 'text-suse-grey' : 'text-suse-black'}"    
        >
            <Icon src="{ChevronLeft}" micro size="15"/> 
        </button>
        <h6> Page {activePage} of {totalPages}</h6>
        <button on:click={() => { if (activePage < totalPages) { activePage += 1 } }} 
            class="{activePage == totalPages ? 'text-suse-grey' : 'text-suse-black'}"
        >
            <Icon src="{ChevronRight}" micro size="15"/> 
        </button>
    </div>
</div>

