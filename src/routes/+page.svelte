<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import LoginForm from "$lib/components/LoginForm.svelte";
    import Hero from "$lib/components/Hero.svelte";

    export let form;

    async function getPorts() {
        const filters = [{ usbVendorId: 0x0C45, usbProductId: 0x671B}, { usbVendorId: 0x04E8, usbProductId: 0xA051}, { usbVendorId: 0x046D, usbProductId: 0xC52F}]
        const device = await navigator.usb.requestDevice({ filters})
        console.log(device.configuration.interfaces[0].alternate.endpoints) // finds the endpoints of a device
        // look for "in" endpoint and do a device.controlTransferIn(<in endpoint>, <legnth of msg in bytes)
        console.log("calls getPorts")
    }

    import { onMount } from "svelte";
    onMount(() => {
        const button = document.querySelector('button');
        button?.addEventListener('click', async function() {
            if ("serial" in navigator) {
                getPorts()
            }
        } )
        
    })
</script>

<button>Request Serial Port</button>

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
