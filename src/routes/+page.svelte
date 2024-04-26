<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import LoginForm from "$lib/components/LoginForm.svelte";
    import Hero from "$lib/components/Hero.svelte";
	import { onMount } from "svelte";

    export let form;

    onMount(() => {
        let rfidInput = document.getElementById('rfidInput'); //take the rfid input

        const handleClickOutside = (e: any) => {
            const target = e.target;    //take the target of the event
            const focusedElement = document.activeElement;  //this is the active element being focused

            // if the current element is rfidInput and you are not clicking an input or a button, do not remove the focus
            if (focusedElement === rfidInput && !(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) {
                e.preventDefault();
            }

            // if the current element is not the rfidInput and you click anything else, it should focus the rfid input
            else if(focusedElement !== rfidInput && !(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) {

                //need to add a delay because of svelte
                setTimeout(() => {
                    rfidInput?.focus()
                }, 10)
            }  
        };
        
        const handleKeyDown = (e: any) => {
            const focusedElement = document.activeElement;  //this is the active element being focused
            if (rfidInput === focusedElement){
                console.log()
                e.preventDefault();
            }
        }

        // when mouse is clicked, call handle click outside
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

</script>

<section class="flex justify-center items-center lg:h-screen">
    
    <input id="rfidInput" autofocus/>

    <div 
        class="content grid 
                lg:grid-cols-12 lg:grid-rows-1 lg:gap-20
                sm:grid-cols-4 sm:grid-rows-2 gap-y-12"
    >
        <div 
            class="lg:col-span-5 lg:col-start-2 lg:col-end-7 lg:row-start-1
                    sm:col-span-2 sm:col-start-2 sm:row-start-1"
        >
            {#if form == null || form.success == false}
                <LoginForm/>
                {#if form != null && form.error != null}
                    <p class="text-red-600">{form.error}</p>
                {/if}
            {:else if form.success == true}
                <h1>Present your Form 5 to the admin for approval.</h1>
                <h4>Please prepare your Form 5 and present it to the admin to get your UP ID registered in SUSe!</h4>
                <Button>Return to Login</Button>
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
