<script lang="ts">
    import Button from "./Button.svelte";

    function handleClick(){
        console.log("clicked");
    }

    export let form;
</script>

<!-- TODO: Add form pattern validation -->
<!-- TODO: Custom styles -->

<section class="grid gap-y-8">

    <!-- HEADER -->
    <div class="grid">
        <h1>Register</h1>
        <p>Tap your UP ID to register it to your account.</p>    
    </div>

    <!-- FORM -->
    <form class="grid gap-y-4" method="POST">

        <!-- ITEMS -->
        <div class="grid gap-y-2">
            <!-- name section -->
            <div class="grid gap-y-2">
                <label 
                    for="full-name" 
                >  
                    <p>Name</p>
                </label>
                <div 
                    class="grid lg:grid-cols-6 gap-4
                        sm:grid-cols-1"
                >
                    <input 
                        name="firstName"
                        type="text" 
                        id="first-name" 
                        class="lg:col-span-3 sm:col-span-1 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="First Name"
                        pattern="[A-Za-z\s]+" 
                        required 
                    />
                    <input 
                        name="middleInitial"
                        type="text" 
                        id="middle-initial" 
                        class="lg:col-span-1 sm:col-span-1 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        pattern="[A-Za-z\s]+" 
                        placeholder="MI"  
                    />
                    <input 
                        name="lastName"
                        type="text" 
                        id="last-name" 
                        class="lg:col-span-2 sm:col-span-1 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="Surname"
                        pattern="[A-Za-z\s]+" 
                        required  
                    />
                </div>
            </div>

            <!-- student number and phone number -->
            <div 
                class="grid lg:grid-cols-2 gap-4
                sm:grid-cols-1"
            >
                <div class="grid gap-y-2 cols-span-1">
                    <label 
                    for="student-number" 
                    >  
                        <p>Student Number</p>
                    </label>
                    <input 
                        name="sn"
                        type="text" 
                        id="student-number" 
                        class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="20XXXXXXX" 
                        pattern="^\d{'{'}9{'}'}$"
                        required 
                    />
                    
                </div>

                <div class="grid gap-y-2 cols-span-1">
                    <label 
                    for="student-number" 
                    >  
                        <p>Phone Number</p>
                    </label>
                    <input 
                        name="phoneNum"
                        type="text" 
                        id="phone-number" 
                        class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                        placeholder="09XXXXXXXXX" 
                        pattern="^\d{'{'}11{'}'}$"
                        required 
                    />
                </div>
            </div>

            <!-- college and department -->
            <div 
                class="grid lg:grid-cols-2 gap-4
                        sm:grid-cols-1"
            >
                <div class="grid gap-y-2 cols-span-1">
                    <label 
                        for="college" 
                    >
                        <p>College</p>
                    </label>
                    <select name="college" id="college" class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <!-- TODO: make dynamic options from a database of colleges -->
                        <option>College of Engineering</option>
                        <option>College of Arts and Letters</option>
                        <option>College of Science</option>
                    </select>
                </div>

                <div class="grid gap-y-2 cols-span-1">
                    <label 
                        for="program" 
                    >
                        <p>Degree Program</p>
                    </label>
                    <select name="program" id="program" class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <!-- TODO: make dynamic options from a database of programs -->
                        <option>Computer Science</option>
                        <option>Computer Engineering</option>
                    </select>
                </div>

            </div>

            <!-- email section -->
            <div class="grid gap-y-2">
                <label 
                for="email" 
            >
                <p>Email</p>
                </label>
                <div class="flex">
                    <input 
                        name="username"
                        type="text" 
                        id="email" 
                        class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full p-2.5" 
                        placeholder="jdelacruz"
                        pattern="[A-Za-z]+" 
                        required
                    />
                    <span id="email-suffix" class="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-s-0 border-gray-300">
                        <p>@up.edu.ph</p>
                    </span>
                </div>
            </div>
            


            <!-- password section-->
            <div class="grid gap-y-2">
                <label 
                    for="password" 
                >
                <p>Password</p>
                </label>
                <input 
                    name="password"
                    type="password" 
                    id="password" 
                    class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{'{'}8,{'}'}"
                    placeholder="••••••••" 
                    required 
                />
            </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="inline-flex gap-4">
            <Button inverse={true}> Cancel </Button>
            <Button submit={true}> Register </Button>
        </div>
  
    </form>

</section>

<style>

input{
    background-color: transparent;
    border-radius: 5px;
    border-color: #EAEAEA;
}

::placeholder{
    padding: 12px, 16px;
    color: var(--suse-black);
    opacity: 50%;
}

#email{
    border-radius: 5px 0px 0px 5px;
}

#email-suffix{
    border-radius: 0px 5px 5px 0px;
    padding: 12px, 16px;
    background-color: #EAEAEA;
    border-color: #EAEAEA;
}

#email-suffix p{
    color: var(--suse-black);
    opacity: 50%;
}

select{
    padding: 12px, 16px;
    border-radius: 5px;
}


</style>