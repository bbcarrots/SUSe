<script lang="ts">
    import { Tabs, TabItem } from 'flowbite-svelte';

    export let serviceName: string;
    export let formData = {
        consented: false,
        selectedRoom: "None"
    };

    
    let inactiveClasses = "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
    let activeClasses = "inline-block p-4 text-suse-green border-b-2 border-suse-green rounded-t-lg active"

    function handleCheckboxChange(event: any) {
        const checkbox = event.target;

        if (checkbox.checked) {
            formData.consented = true;
        } else {
            formData.consented = false;
        }
    }

</script>


<div class="grid gap-4 text-center items-center">
    {#if serviceName !== "Discussion Room"}
        <h5>Liability Agreement</h5>
        <p>
            I accept full responsibility for the {serviceName} once it is loaned to me.
            I agree that I received the {serviceName} in good condition and I understand that I will be charged with corresponding fees or replacement if it is damaged or lost while under my possession. 
        </p>
    {:else if serviceName == "Discussion Room"}
        <Tabs tabStyle='underline' contentClass="" divider={false}>
            <TabItem open title="New Room" {inactiveClasses} {activeClasses}>
                <p>
                    I agree that I will not damage any property in the Discussion Room, refrain from obstructive behaviour and blablabla. 
                </p>
            </TabItem>
            <TabItem title="Join Room" {inactiveClasses} {activeClasses}>
                <select bind:value={formData.selectedRoom} class="mb-4 border text-[14px] rounded-[5px] px-[16px] py-[12px] border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select a room</option>
                    <option value="option1">Frequency</option>
                    <option value="option2">Signal</option>
                    <option value="option3">Something</option>
                    <option value="option4">Something</option>
                </select>
                <p>
                    I agree that I will not damage any property in the Discussion Room and refrain from obstructive behaviour. 
                </p>
            </TabItem>
        </Tabs>
    {/if}
    <form class="flex gap-2 items-center justify-center">
        <input type="checkbox" id="consent" value="Consented" on:change={handleCheckboxChange}>
        <label for="checkbox"><p>I agree to these Terms and Conditions.</p></label>
    </form>
</div>
