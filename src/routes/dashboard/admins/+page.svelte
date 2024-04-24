<script lang="ts">



    // ----------------------------------------------------------------------------------
	import type { AdminResponse } from '$lib/classes/Admin.js';

    let deleteResponse: AdminResponse;
    let updateResponse: AdminResponse;

    async function handleDelete(event: CustomEvent) {
        /* Handles Delete event from TableRow by sending a DELETE request 
        with payload requirement: adminID. */

        const response = await fetch('../api/admin', {
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
        payload requirement: adminID, 
        optional: adminName. */

        const response = await fetch('../api/admin', {
            method: 'PATCH',
            body: JSON.stringify(event.detail),
            headers: {
                'content-type': 'application/json'
            }
        });

        updateResponse = await response.json();
    }
</script>