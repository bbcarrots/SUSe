<script lang="ts">
    import RegisterForm from "$lib/components/RegisterForm.svelte";
    import Hero from "$lib/components/Hero.svelte";

    export let form;
    console.log(form)
</script>

<section class="flex justify-center items-center lg:h-screen">
    <div 
        class="content grid 
                lg:grid-cols-12 lg:grid-rows-1 lg:gap-20
                sm:grid-cols-4 sm:grid-rows-2 gap-y-12"
    >
        <div 
            class="lg:col-span-5 lg:col-start-2 lg:col-end-7 lg:row-start-1
                    sm:col-span-2 sm:col-start-2 sm:row-start-1"
        >
            <RegisterForm/>
            {#if form != null && form.error == 'Error: No database connection'}
                <p class="text-red-600">No database connection.</p>
            {:else if form != null && form.error == 'Error: Student sn/username already exists in database'}
                <p class="text-red-600">Student record already exists.</p>
            {:else}
                <p></p>
            {/if}
        </div>
        <div class="lg:col-span-5 lg:col-start-7 lg:col-end-12 lg:row-start-1
                    sm:col-span-2 sm:col-start-2 sm:row-start-2"
        >
            <Hero/>
        </div>
    </div>
</section>

<style>
    .content {
        max-width: 1400px;
    }
</style>
