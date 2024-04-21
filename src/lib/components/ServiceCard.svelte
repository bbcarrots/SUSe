<script lang="ts">    
    import { onMount, onDestroy } from "svelte";

    import Button from "./Button.svelte";
    export let serviceName: string;
    export let available: number;

    let timeStarted: string;
    let timeEnded: string;
    let timeNow: string;
    let started = false;

    let src = '/service-card-images/extension-cord.svg'

    function startService(){
        started = true;
        timeStarted = timeNow;

        //todo: add the usage log entry
    }

    function endService(){
        started = false;
        timeEnded = timeNow;

        //todo: edit the usage log entry
    }

    // function to update the current time for the count
    function updateTimeNow() {
        timeNow = new Date().toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'medium'});
    }

    let intervalId: ReturnType<typeof setTimeout>;
    onMount(() => {
        updateTimeNow(); // Update timeNow immediately
        intervalId = setInterval(updateTimeNow, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

</script>

<div class="relative w-[200px] h-[200px] bg-gray-200 overflow-hidden">
    <h4 class="top-0 left-0">{serviceName}</h4>
    {#if started == false}
        <p>{available}</p>
    {:else}
        <p>{timeNow}</p>
    {/if}
    <div class="absolute bottom-0 right-0 flex justify-end items-end w-full h-full">
        {#if started == false}
            <Button on:click={startService}>Start</Button>
        {:else}
            <Button on:click={endService}>End</Button>
        {/if}
    </div>
    <div class="absolute w-[160px] h-[160px] -bottom-[50px] -left-[30px] flex justify-end items-end w-full h-full">
        <img {src} alt="Icon of the service">
    </div>
</div>