<script lang="ts">	
    import { Icon, ChevronLeft, ChevronRight } from "svelte-hero-icons";
    export let total_rows: number;
    let current_page: number = 1;
    let total_page: number = 10;
</script>

<div class="flex items-center w-full">
    <h6>{current_page} - {total_page} of {total_rows}</h6>

    <div class="flex">
        <button>
            <Icon src="{ChevronLeft}" micro size="15"/> 
        </button>
        <button>
            <Icon src="{ChevronRight}" micro size="15"/> 
        </button>
    </div>
</div>

