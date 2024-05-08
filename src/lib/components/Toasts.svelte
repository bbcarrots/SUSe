<script lang="ts">
    import { Toast } from "flowbite-svelte";
    import { Icon, CheckCircle, XCircle, Check } from "svelte-hero-icons";

    type toast = {
        message: string,
        timeout: number,
        type: string,
        open: boolean
    }

    let toasts: toast[] = [];

    // Add toast to the array then begin decrementing the timeout
    export function addToast(newToast: toast) {
        toasts = [...toasts, newToast];
        decrementTimeout(newToast);
    }

    // Decrement the timeout for a toast
    function decrementTimeout(toast: toast) {
        if (toast.timeout > 0) {
            const timerId = setInterval(() => {
                // decrement the timeout
                const newTimeout = toast.timeout - 1;
                toast.timeout = newTimeout;

                // update toast array
                toasts = toasts.map(t => (t === toast ? toast : t));

                // clear interval when the end is reached
                if (toast.timeout <= 0) {
                    toast.open = false;
                    clearInterval(timerId);
                }
            }, 1000);
        }
    }


</script>

<div class="grid absolute top-2 right-2 gap-2">
    {#each toasts as toast}
        {#if toast.type == 'success'}
            <Toast dismissable={true} color={'green'} open={toast.open} on:close={() => {toast.open = false}}>
                <svelte:fragment slot="icon">
                    <Icon src={CheckCircle} micro size="15"/>
                </svelte:fragment>
                {toast.message}
            </Toast>
        {:else if toast.type == 'error'}
            <Toast dismissable={true} color={'red'} open={toast.open} on:close={() => {toast.open = false}}>
                <svelte:fragment slot="icon">
                    <Icon src={XCircle} micro size="15"/>
                </svelte:fragment>
                {toast.message}
            </Toast>
        {/if}
    {/each}
</div>

<button on:click={() => addToast({ message: "This is a success toast", timeout: 500, type: 'success', open: true })}>Add Success Toast</button>
<button on:click={() => addToast({ message: "This is an error toast", timeout: 10, type: 'error', open: true })}>Add Error Toast</button>
