<script lang='ts'>
    import ServiceCard from "$lib/components/ServiceCard.svelte";
    
    export let data;
    console.log(data)

    // ----------------------------------------------------------------------------------
	import type { UsageLogDBObj } from "$lib/classes/UsageLog.js";
    // import { page } from "$app/stores";

    // const studentNumber: number = $page.url.searchParams.get('sn')
    const studentNumber: number = 202021211

	type StudentServicesResponse = {
        success: boolean;
        activeUsageLogs: { [key: string]: UsageLogDBObj };
        availableServices: { [key: string]: number };
        error: string
    }

    let availResponse: StudentServicesResponse;
    let endResponse: StudentServicesResponse;

    async function handleAvailService(event: CustomEvent) {
        /* Handles Avail Service event from TableRow by sending a POST request 
        with payload requirements: studentNumber, serviceType. */

        const payload = { studentNumber: studentNumber, ...event.detail };

        const response = await fetch('../../api/avail-end', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'content-type': 'application/json'
            }
        });

        availResponse = await response.json();
    }

    async function handleEndService(event: CustomEvent) {
        /* Handles End Service event from TableRow by sending a PATCH request 
        with payload requirement: usageLogID. */

        const response = await fetch('../../api/avail-end', {
            method: 'PATCH',
            body: JSON.stringify(event.detail),
            headers: {
                'content-type': 'application/json'
            }
        });

        endResponse = await response.json();
    }
</script>

<div class="flex">
    <ServiceCard
        serviceName = {"Calculator"}
        available = {1}
        src = {'/service-card-images/calculator.svg'}
    />
</div>
