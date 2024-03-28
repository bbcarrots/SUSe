<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
</script>

<div class="">
    <div class="h-screen float-left">
        <Sidebar ></Sidebar>
    </div>
    <div class="w-full">
        <div class="">
            <slot />
        </div>
    </div>
</div>
