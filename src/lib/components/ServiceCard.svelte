<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '$lib/utils/utils';
	import { Modal } from 'flowbite-svelte';
	import Button from './Button.svelte';
	import ServiceForm from './ServiceForm.svelte';
	import type { serviceTypes } from '$lib/utils/filterOptions';

	export let serviceName: string;
	export let available: number;
	export let src: string;

	let formData: {consented: Boolean, serviceID: Number} = {
		consented: false,
		serviceID: 0
	};

	export let timeStarted: Date;
	let timeEnded: Date;
	let timeNow: Date;
	export let started = false;
	let countdown: string = formatTime(0);

	let popupModalStart = false;
	let popupModalEnd = false;

	const dispatch = createEventDispatcher(); // for forwarding events

	// ----------------------------------------------------------------------------------

	function startService() {
		timeStarted = timeNow;
		countdown = formatTime(0);
		popupModalStart = false;

		dispatch('availService', { serviceID: formData.serviceID, serviceType: serviceName });
	}

	function endService() {
		popupModalEnd = false;

        dispatch('endService', { serviceType: serviceName })
	}

	// function to update the current time for the count
	function updateTimeNow() {
		timeNow = new Date();
		countdown = formatTime(timeNow.getTime() - new Date(timeStarted).getTime());
	}

	let intervalId: ReturnType<typeof setTimeout>;
	onMount(() => {
		updateTimeNow();
		intervalId = setInterval(updateTimeNow, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div
	class="relative m-4 h-[250px] max-w-full overflow-hidden rounded-[20px] bg-white p-6 drop-shadow-[4px_4px_10px_rgba(17,51,17,0.05)]"
>
	<h4 class="relative left-0 top-0 z-10">{serviceName}</h4>
	{#if started == false}
		<p>Available: {available}</p>
	{:else}
		<p>Time Started: {timeStarted.toLocaleDateString()}</p>
		<p>{countdown}</p>
	{/if}
	<div class="absolute bottom-2 right-2 z-20 flex w-[100px] items-end justify-end">
		{#if started == false}
			<Button small={true} on:click={() => (popupModalStart = true)}>Start</Button>
		{:else}
			<Button small={true} on:click={() => (popupModalEnd = true)}>End</Button>
		{/if}
	</div>
	<div class="z-5 absolute -bottom-[30px] -left-[20px] flex w-[70%] items-end justify-end">
		<img {src} alt="Service icon" class="z-5" />
	</div>
</div>

<!-- Modal for start service confirmation -->
<Modal bind:open={popupModalStart} size="xs">
	<ServiceForm {serviceName} bind:formData />

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button on:click={() => (popupModalStart = false)} inverse={true}>Cancel</Button>
		<Button disabled={formData.consented == false} on:click={startService}>Start</Button>
	</div>
</Modal>

<!-- Modal for end service confirmation -->
<Modal bind:open={popupModalEnd} size="xs" autoclose>
	<div class="text-center">
		<p>
            I confirm that I will be ending the returning/ending the service of {serviceName}.
        </p>
	</div>

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button on:click={() => (popupModalEnd = false)} inverse={true}>Cancel</Button>
		<Button on:click={endService}>End</Button>
	</div>
</Modal>
