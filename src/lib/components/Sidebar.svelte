<script lang="ts">
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { Icon, CheckCircle, BookOpen, UserGroup, WrenchScrewdriver, ShieldCheck} from 'svelte-hero-icons';
    let spanClass = 'flex-1 ms-3 text-[14px] whitespace-nowrap';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:text-white hover:bg-[#3D6765] dark:hover:bg-[#3D6765]';

    $: activeUrl = $page.url.pathname;

    // keep track of active
    let active:string = ""

    function setActive(label:string){
        active = label;
    }

</script>

<Sidebar {activeUrl} {nonActiveClass}>
    <SidebarWrapper class="h-screen">
        <SidebarGroup>
            <SidebarItem label="Usage Logs" {spanClass} on:mouseenter={() => setActive("Usage Logs")} on:mouseleave={() => setActive("")}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if active=="Usage Logs"}
                            <Icon src="{BookOpen}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{BookOpen}" outline size="20"/>
                        {/if}
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Students" {spanClass} on:mouseenter={() => setActive("Students")} on:mouseleave={() => setActive("")}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white">
                        {#if active=="Students"}
                            <Icon src="{UserGroup}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{UserGroup}" outline size="20"/>
                        {/if}
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Services" {spanClass} on:mouseenter={() => setActive("Services")} on:mouseleave={() => setActive("")}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if active=="Services"}
                            <Icon src="{WrenchScrewdriver}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{WrenchScrewdriver}" outline size="20"/>
                        {/if} 
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Admin" href="/docs/components/sidebar" active={activeUrl === '/docs/components/sidebar'} {spanClass} on:mouseenter={() => setActive("Admin")} on:mouseleave={() => setActive("")}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if active=="Admin"}
                            <Icon src="{ShieldCheck}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{ShieldCheck}" outline size="20"/>
                        {/if} 
                    </span>
                </svelte:fragment>
            </SidebarItem>`
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>