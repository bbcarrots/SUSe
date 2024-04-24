<script lang="ts">



    // ----------------------------------------------------------------------------------
	import type { ServiceResponse } from '$lib/classes/Service.js';

    let deleteResponse: ServiceResponse;
    let updateResponse: ServiceResponse;

    async function handleDelete(event: CustomEvent) {
        /* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: serviceID. */

        const response = await fetch('../api/service', {
            method: 'DELETE',
            body: JSON.stringify(event.detail),
            headers: {
                'content-type': 'application/json'
            }
        });

        deleteResponse = await response.json();
    }

    async function handleUpdate(event: CustomEvent) {
        /* Handles Update event from TableRow by sending a PATCH request with 
        payload requirement: serviceID, 
        optional: serviceName. */

        const response = await fetch('../api/service', {
            method: 'PATCH',
            body: JSON.stringify(event.detail),
            headers: {
                'content-type': 'application/json'
            }
        });

        updateResponse = await response.json();
    }
</script>