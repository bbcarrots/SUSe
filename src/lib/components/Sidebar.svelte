<script lang="ts">
    import { userID } from '$lib/stores/User';
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { Icon, CheckCircle, Home, BookOpen, UserGroup, WrenchScrewdriver, ShieldCheck} from 'svelte-hero-icons';
    let spanClass = 'flex-1 ms-3 text-[14px] whitespace-nowrap';
    
    let activeClass = 'flex items-center p-2 text-base font-normal text-white bg-suse-green rounded-md';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg hover:bg-suse-white';

    $: activeUrl = $page.url.pathname;

</script>

<Sidebar {activeUrl} {nonActiveClass} {activeClass}>
    <SidebarWrapper class="h-screen max-w-[230px]">
        <SidebarGroup>
            {#if activeUrl.includes('/dashboard/student')}
                <SidebarItem label="Home" href="/dashboard/student/home/{$userID}" {spanClass}>
                    <svelte:fragment slot="icon">
                        <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            {#if activeUrl === `/dashboard/student/home/${$userID}`}
                                <Icon src="{Home}" class="text-white" solid size="20"/>
                            {:else}
                                <Icon src="{Home}" outline size="20"/>
                            {/if}
                        </span>
                    </svelte:fragment>
                </SidebarItem>
            {/if}
            <!-- show the nav buttons for admin -->
            {#if activeUrl.includes('/dashboard/admin')}
                <SidebarItem label="Usage Logs" href="/dashboard/admin/usagelogs" {spanClass}>
                    <svelte:fragment slot="icon">
                        <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            {#if activeUrl == "/dashboard/admin/usagelogs"}
                                <Icon src="{BookOpen}" class="text-white" solid size="20"/>
                            {:else}
                                <Icon src="{BookOpen}" outline size="20"/>
                            {/if}
                        </span>
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Students" href="/dashboard/admin/students" {spanClass}>
                    <svelte:fragment slot="icon">
                        <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-white">
                            {#if activeUrl == "/dashboard/admin/students"}
                                <Icon src="{UserGroup}" class="text-white" solid size="20"/>
                            {:else}
                                <Icon src="{UserGroup}" outline size="20"/>
                            {/if}
                        </span>
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Services" href="/dashboard/admin/services" {spanClass}>
                    <svelte:fragment slot="icon">
                        <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            {#if activeUrl == "/dashboard/admin/services"}
                                <Icon src="{WrenchScrewdriver}" class="text-white" solid size="20"/>
                            {:else}
                                <Icon src="{WrenchScrewdriver}" outline size="20"/>
                            {/if} 
                        </span>
                    </svelte:fragment>
                </SidebarItem>
                <SidebarItem label="Admins" href="/dashboard/admin/admins" {spanClass}>
                    <svelte:fragment slot="icon">
                        <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                            {#if activeUrl == "/dashboard/admin/admins"}
                                <Icon src="{ShieldCheck}" class="text-white" solid size="20"/>
                            {:else}
                                <Icon src="{ShieldCheck}" outline size="20"/>
                            {/if} 
                        </span>
                    </svelte:fragment>
                </SidebarItem>
            {/if}
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>