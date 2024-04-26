<script lang="ts">    
    import { onMount, onDestroy } from "svelte";
    import { formatTime } from "$lib/utils/utils";
	import { Modal } from 'flowbite-svelte';
    import Button from "./Button.svelte";

    export let serviceName: string;
    export let available: number;
    export let src: string;

    let timeStarted: string;
    let timeEnded: string;
    let timeNow: string;
    let started = false;
    let countdown: string = formatTime(0);

    let popupModalStart = false;
    let popupModalEnd = false;

    function startService(){
        started = true;
        timeStarted = timeNow;
        countdown = formatTime(0); 
        popupModalStart = false;

        //todo: add the usage log entry
    }

    function endService(){
        started = false;
        timeEnded = timeNow;        
        popupModalEnd = false;

        //todo: edit the usage log entry
    }

    // function to update the current time for the count
    function updateTimeNow() {
        const currentTime = new Date();
        timeNow = currentTime.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' });
        countdown = formatTime(currentTime.getTime() - new Date(timeStarted).getTime());
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

<div class="relative max-w-full h-[250px] bg-white rounded-[20px] overflow-hidden p-6 m-4 drop-shadow-[4px_4px_10px_rgba(17,51,17,0.05)]">
    <h4 class="z-10 top-0 left-0 relative">{serviceName}</h4>
    {#if started == false}
        <p>Available: {available}</p>
    {:else}
        <p>Time Started: {timeStarted}</p>
        <p>{countdown}</p>
    {/if}
    <div class="z-20 absolute bottom-2 right-2 flex justify-end items-end w-[100px]">
        {#if started == false}
            <Button small={true} on:click={() => popupModalStart = true}>Start</Button>
        {:else}
            <Button small={true} on:click={() => popupModalEnd = true}>End</Button>
        {/if}
    </div>
    <div class="z-5 absolute w-[170px] -bottom-[30px] -left-[30px] flex justify-end items-end w-full h-full">
        <img {src} alt="Service icon" class="z-5">
    </div>
</div>


<!-- Modal for start service confirmation -->
<Modal bind:open={popupModalStart} size="xs" autoclose>
	<div class="text-center">
	</div>

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button on:click={() => popupModalStart = false} inverse={true}>Cancel</Button>
        <Button on:click={startService}> Start </Button>
	</div>
</Modal>

<!-- Modal for end service confirmation -->
<Modal bind:open={popupModalEnd} size="xs" autoclose>
	<div class="text-center">
	</div>

	<!-- Action buttons -->
	<div class="flex justify-center gap-4">
		<Button on:click={() => popupModalEnd = false} inverse={true}>Cancel</Button>
        <Button on:click={endService}> End </Button>
	</div>
</Modal>