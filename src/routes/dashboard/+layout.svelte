<script>
    import Sidebar from "$lib/components/Sidebar.svelte";
</script>

<div class="">
    <div class="h-screen absolute">
        <Sidebar ></Sidebar>
    </div>
    <div class="ml-[230px]">
        <slot />
    </div>
</div>
