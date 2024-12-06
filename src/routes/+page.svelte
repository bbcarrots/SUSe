<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import { goto } from '$app/navigation';
	import { userRFID, userID } from '$lib/stores/User.js';
	import Loader from '$lib/components/Loader.svelte';

	export let form;

	let clicks: number = 0;
	let loading = false;

	// ----------------------------------------------------------------------------------
	import type { StudentResponse } from '$lib/classes/Student.js';
	import type { AdminResponse } from '$lib/classes/Admin.js';
	import Footer from '$lib/components/Footer.svelte';

	let rfidResponse: StudentResponse | AdminResponse;

	async function handleRFID(event: CustomEvent) {
		/* Handles RFID validation event from LoginForm by sending a POST request 
        with payload requirement: rfid. */

		loading = true;
		const payload = { isAdmin: false, rfid: parseInt(event.detail) };

		if (clicks == 5) {
			payload.isAdmin = true;
		}

		const response = await fetch('api/rfid', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'content-type': 'application/json'
			}
		});

		rfidResponse = await response.json();
		loading = false;

		if ('adminRaws' in rfidResponse) {
			if (rfidResponse.success && rfidResponse.adminRaws?.length == 1) {
				goto(`/dashboard/admin/usagelogs`);
			}
		} else if ('studentRaws' in rfidResponse) {
			// if success but no returned students, redirect to register page
			if (rfidResponse.success && rfidResponse.studentRaws?.length == 0) {
				userRFID.set(event.detail);
				goto(`/register`);
			}

			// if success, redirect to approprate student dashboard
			else if (rfidResponse.success == true) {
				// if there is a student ID,
				if (rfidResponse.studentRaws?.[0].sn_id !== undefined) {
					if (rfidResponse.studentRaws?.[0].is_enrolled) {
						// if the user is enrolled
						userID.set(rfidResponse.studentRaws?.[0].sn_id);
						goto(`/dashboard/student/home/${$userID}`);
					} else {
						// if the user is not enrolled, redirect to form 5 notice
						goto(`/register/form5`);
					}
				}
			}
		}

		clicks = 0; // return count to 0
	}
</script>

{#if !loading}
	<div class="flex flex-col justify-center lg:h-screen">
        <section class="flex grow items-center justify-center">
            <div
                class="content grid
                        gap-y-12 sm:grid-cols-4 sm:grid-rows-2
                        lg:grid-cols-12 lg:grid-rows-1 lg:gap-20"
            >
                <div
                    class="sm:col-span-2 sm:col-start-2 sm:row-start-1 lg:col-span-5
                            lg:col-start-2 lg:col-end-7 lg:row-start-1"
                >
                    <LoginForm bind:clicks on:inputRFID={handleRFID} />
                    {#if form != null && form.error != null}
                        <p class="text-red-600">{form.error}</p>
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
        
        <Footer/>
    </div>

	<style>
		.content {
			max-width: 1400px;
		}
	</style>
{:else}
	<Loader></Loader>
{/if}