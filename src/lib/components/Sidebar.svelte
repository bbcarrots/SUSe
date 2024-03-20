<script>
    import { page } from '$app/stores';
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { Icon, CheckCircle, BookOpen, UserGroup, WrenchScrewdriver, ShieldCheck} from 'svelte-hero-icons';
    let spanClass = 'flex-1 ms-3 text-[14px] whitespace-nowrap';
    $: activeUrl = $page.url.pathname;
</script>

<Sidebar {activeUrl} >
    <SidebarWrapper class="h-screen">
        <SidebarGroup>
            <SidebarItem label="Usage Logs" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><Icon src="{BookOpen}" micro size="20"/></span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Students" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><Icon src="{UserGroup}" micro size="20"/></span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Services" {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><Icon src="{WrenchScrewdriver}" micro size="20"/></span>
                </svelte:fragment>
            </SidebarItem>
            <SidebarItem label="Admin" href="/docs/components/sidebar" active={activeUrl === '/docs/components/sidebar'} {spanClass}>
                <svelte:fragment slot="icon">
                    <span class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><Icon src="{ShieldCheck}" micro size="20"/></span>
                </svelte:fragment>
            </SidebarItem>`
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>