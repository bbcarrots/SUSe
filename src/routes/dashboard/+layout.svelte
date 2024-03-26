<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
</script>

<div class="flex">
    <div class="h-screen">
        <Sidebar ></Sidebar>
    </div>
    <div>
        <slot/>
    </div>
</div>
