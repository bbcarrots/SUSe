<script lang="ts">    
    import { onMount, onDestroy } from "svelte";

    import Button from "./Button.svelte";
    export let serviceName: string;

    let timeStarted: string;
    let timeEnded: string;
    let timeNow: string;
    let started = false;

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

<div class="w-[200px] h-[200px] bg-gray-200">
    <h4>{serviceName}</h4>
    {#if started == false}
        <Button on:click={startService}>Start</Button>
    {:else}
        <p>{timeNow}</p>
        <Button on:click={endService}>End</Button>
    {/if}
</div>
