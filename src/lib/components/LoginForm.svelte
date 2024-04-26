<script lang="ts">
    import { onMount } from "svelte";
    import Button from "./Button.svelte";    

    //to determine which login to display
    let rfidLogin = true;

    onMount(() => {

        const handleClickOutside = (e: any) => {
            const rfidInput = document.getElementById('rfidInput'); //take the rfid input
            const target = e.target;    //take the target of the event
            const focusedElement = document.activeElement;  //this is the active element being focused
            console.log(rfidInput, focusedElement)

            // if the current element is rfidInput and you are not clicking an input or a button, do not remove the focus
            if (focusedElement === rfidInput && !(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) {
                e.preventDefault();
            }

            // if the current element is not the rfidInput and you click anything else, it should focus the rfid input
            else if(focusedElement !== rfidInput && !(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) {

                //need to add a delay because of svelte
                setTimeout(() => {
                    rfidInput?.focus()
                }, 10)
            }  
        };
        
        const handleKeyDown = (e: any) => {
            const rfidInput = document.getElementById('rfidInput'); //take the rfid input
            const focusedElement = document.activeElement;  //this is the active element being focused

            if (rfidInput === focusedElement){
                console.log()
                e.preventDefault();
            }
        }

        // when mouse is clicked, call handle click outside
        document.addEventListener('mousedown', handleClickOutside);

        // when keyboard is pressed, call handle key down
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    function handleChangeToUsername() {
        rfidLogin = false;
    }

    function handleChangeToRFID() {
        rfidLogin = true;
    }
</script>

<section class="grid gap-y-8">

    {#if rfidLogin == true}
    <!-- HEADER -->
    <div class="grid text-center gap-4">
        <h1>Tap your UP ID to log in or register</h1>
        <p>Avail Engglib services using SUSê by tapping your RFID!</p>    
    </div>
    
    <div class="relative flex items-center">
        <div class="flex-grow border-t bg-suse-black/50"></div>
        <!-- <span class="flex-shrink mx-2 text-suse-black/50"><p>or view available services by logging in via username</p></span> -->
            <button on:click={handleChangeToUsername} class="text-blue-600">Login using username and password to view available services</button>
        <div class="flex-grow border-t bg-suse-black/50"></div>
    </div>

    <input id="rfidInput" autofocus/>

    {:else}

    <!-- FORM -->
    <form class="grid gap-y-4" method="POST">

           <!-- email section -->
           <div class="grid gap-y-2">
            <div class="flex">
                <input 
                    name="username"
                    type="text" 
                    id="email" 
                    placeholder="Username"
                    pattern="[A-Za-z0-9]+" 
                    title="Please only enter alphabets"
                    required
                />
            </div>
        </div>

        <!-- password section-->
        <div class="grid gap-y-2">
            <input 
                name="password"
                type="password" 
                id="password" 
                title="Please enter at least one lowercase letter, uppercase letter, and number."
                placeholder="Password" 
                required 
            />
            <span>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="inline-flex gap-4">
            <Button submit={true}> Login </Button>
        </div>
        <button on:click={handleChangeToRFID} class="text-blue-600">Login using RFID to avail services</button>

    </form>
    {/if}
</section>

<style lang="postcss">

@tailwind components;

@layer components{
    input {
        @apply border border-gray-300 text-gray-900 block w-full p-2.5 rounded;
    }

    input:focus{
        @apply ring-blue-500 border-blue-500; 
    }
    
    input.error {
        @apply border-pink-600 text-pink-600; 
    }

    input.error:focus{
        @apply ring-pink-500 border-pink-500; 
    }
}

::placeholder{
    padding: 12px, 16px;
    color: var(--suse-black);
    opacity: 50%;
}

</style>