<script lang="ts">	
    import { Icon, ChevronLeft, ChevronRight } from "svelte-hero-icons";
    export let activePage: number;
    export let rowsPerPage: number;
    export let totalPages: number;
    export let totalRows: number;

</script>

<div class="flex items-center w-full">
    <h6>{activePage} - {totalPages} of {totalRows}</h6>

    <div class="flex">
        <button on:click={() => { if (activePage > 1) { activePage -= 1 } }}>
            <Icon src="{ChevronLeft}" micro size="15"/> 
        </button>
        <button on:click={() => { if (activePage < totalPages) { activePage += 1 } }}>
            <Icon src="{ChevronRight}" micro size="15"/> 
        </button>
    </div>
</div>

