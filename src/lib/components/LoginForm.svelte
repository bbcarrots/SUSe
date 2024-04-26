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

<section class="grid gap-y-8 h-full w-full items-center justify-center">

    {#if rfidLogin == true}

    <!-- HEADER -->
     <div class="grid text-center gap-6">
        <div class="grid gap-4">
            <h1>Tap your UP ID to log in or register</h1>
            <h4>Avail Engglib services using SUSê by tapping your RFID!</h4>         
        </div>

        <button on:click={handleChangeToUsername} class="text-blue-600"><p>Login using username</p></button>

        <input id="rfidInput" autofocus/>
    </div>  


    {:else}

    <!-- FORM -->
    <div class="grid text-center gap-6">
        <div class="grid gap-4">
            <h1>Log in using username</h1>
            <h4>to view all available services</h4> 
        </div>
   
        <div class="relative flex">
            <form class="grid gap-y-4 flex-grow" method="POST">

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
                    <div class="flex-grow">
                        <Button submit={true}> Login </Button>

                    </div>
                </div>
                <button on:click={handleChangeToRFID} class="text-blue-600"><p>Login using RFID</p></button>

            </form>
        </div>
    </div>

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