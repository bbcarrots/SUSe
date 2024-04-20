<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import Hero from '$lib/components/Hero.svelte';

	export let form;

	//////////////////////////////////////////////////////////////////////////////////////

	async function getPorts() {
		const filters = [
			{ usbVendorId: 0x0c45, usbProductId: 0x671b },
			{ usbVendorId: 0x04e8, usbProductId: 0xa051 },
			{ usbVendorId: 0x046d, usbProductId: 0xc52f }
		];
		const device = await navigator.usb.requestDevice({ filters });
		console.log(device.configuration.interfaces[0].alternate.endpoints); // finds the endpoints of a device (.find(obj => obj.direction === 'out').endpointNumber)
		// look for "in" endpoint and do a device.controlTransferIn(<in endpoint>, <legnth of msg in bytes)
		await device.open();
		// await device.selectConfiguration(1) // why is this 1?
		// await device.claimInterface(0) // search for the correct interface to claim
		// device.transferIn(3, 4).then((result) => (console.log(result.data))) // once we have an "in"
		console.log('calls getPorts');
	}

	import { onMount } from 'svelte';
	onMount(() => {
		const button = document.querySelector('button');
		button?.addEventListener('click', async function () {
			if ('usb' in navigator) {
				getPorts();
			}
		});
	});

	//////////////////////////////////////////////////////////////////////////////////////

	import type { RFIDLoginResponse } from '$lib/utils/types.js';
	import type { StudentResponse } from '$lib/classes/Student.js';

	let loginResponse: RFIDLoginResponse;

	async function handleRFID(rfid: number) {
		/* Handles RFID input event from the RFID scanner connected to a USB port by sending a POST request with 
        payload requirement: rfid. */

		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify(rfid),
			headers: {
				'content-type': 'application/json'
			}
		});

        const studentResponse: StudentResponse = await response.json();

		if (studentResponse.success && studentResponse.studentRaws?.length == 1) {
            loginResponse = {
                success: true,
                id: studentResponse.studentRaws[0].sn_id,
                error: null
            }
        } else {
            loginResponse = {
                success: studentResponse.success,
                id: null,
                error: studentResponse.error
            }
        }
	}
</script>

<button>Request Serial Port</button>

<section class="flex items-center justify-center lg:h-screen">
	<div
		class="content grid
                gap-y-12 sm:grid-cols-4 sm:grid-rows-2
                lg:grid-cols-12 lg:grid-rows-1 lg:gap-20"
	>
		<div
			class="sm:col-span-2 sm:col-start-2 sm:row-start-1 lg:col-span-5
                    lg:col-start-2 lg:col-end-7 lg:row-start-1"
		>
			{#if form == null || form.success == false}
				<LoginForm />
				{#if form != null && form.error != null}
					<p class="text-red-600">{form.error}</p>
				{/if}
			{:else if form.success == true}
				<h1>Present your Form 5 to the admin for approval.</h1>
				<h4>
					Please prepare your Form 5 and present it to the admin to get your UP ID registered in
					SUSe!
				</h4>
				<Button>Return to Login</Button>
			{/if}
		</div>
		<div
			class="sm:col-span-2 sm:col-start-2 sm:row-start-2 lg:col-span-5
                    lg:col-start-7 lg:col-end-12 lg:row-start-1"
		>
			<Hero />
		</div>
	</div>
</section>

<style>
	.content {
		max-width: 1400px;
	}
</style>
