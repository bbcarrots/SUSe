<script lang="ts">
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { Icon, CheckCircle, BookOpen, UserGroup, WrenchScrewdriver, ShieldCheck} from 'svelte-hero-icons';
    let spanClass = 'flex-1 ms-3 text-[14px] whitespace-nowrap';
    
    let activeClass = 'flex items-center p-2 text-base font-normal text-white bg-[#3D6765] dark:hover:bg-[#3D6765] rounded-md';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-[#F1F1F1] dark:hover:bg-[#3D6765]';

    $: activeUrl = $page.url.pathname;

</script>

<Sidebar {activeUrl} {nonActiveClass} {activeClass}>
    <SidebarWrapper class="h-screen">
        <SidebarGroup>
            <SidebarItem label="Usage Logs" href="/dashboard/usage-logs" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if activeUrl == "/dashboard/usage-logs"}
                            <Icon src="{BookOpen}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{BookOpen}" outline size="20"/>
                        {/if}
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Students" href="/dashboard/students" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white">
                        {#if activeUrl == "/dashboard/students"}
                            <Icon src="{UserGroup}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{UserGroup}" outline size="20"/>
                        {/if}
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Services" href="/dashboard/services" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if activeUrl == "/dashboard/services"}
                            <Icon src="{WrenchScrewdriver}" class="text-white" solid size="20"/>
                        {:else}
                            <Icon src="{WrenchScrewdriver}" outline size="20"/>
                        {/if} 
                    </span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Admins" href="/dashboard/admins" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        {#if activeUrl == "/dashboard/admins"}
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