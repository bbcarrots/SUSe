<script lang="ts">
    import Button from "./Button.svelte";    
</script>

<section class="grid gap-y-8">

    <!-- HEADER -->
    <div class="grid text-center gap-4">
        <h1>Tap your UP ID to log in/register</h1>
        <p>Avail Engglib services using SUSê by tapping your RFID!</p>    
    </div>
    
    <div class="relative flex items-center">
        <div class="flex-grow border-t bg-[#131416]/50"></div>
        <span class="flex-shrink mx-2 text-[#131416]/50"><p>or view available services by logging in via username</p></span>
        <div class="flex-grow border-t bg-[#131416]/50"></div>
    </div>

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
  
    </form>

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