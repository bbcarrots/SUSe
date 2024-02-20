<script lang="ts">
    import Button from "./Button.svelte";

    function handleClick(){
        console.log("clicked");
    }
</script>

<section>

<!-- TODO: Add form pattern validation -->
<!-- TODO: Custom styles -->
<form class="max-w-sm mx-auto">
    <!-- name section -->
    <div class="mb-5">
        <label 
            for="name" 
            class="block mb-2 text-sm font-medium text-gray-900"
        >  
            Name
        </label>
        <div class="grid grid-cols-6 gap-4">
            <input 
                type="text" 
                id="name" 
                class="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="First Name" 
                required 
            />
            <input 
                type="text" 
                id="middle-initial" 
                class="col-span-1 -gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="MI"  
            />
            <input 
                type="text" 
                id="surname" 
                class="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="Surname"
                required  
            />
        </div>
    </div>

    <!-- student number and phone number -->
    <div class="grid grid-cols-2 gap-4">
        <div class="mb-5 cols-span-1 ">
            <label 
            for="student-number" 
            class="block mb-2 text-sm font-medium text-gray-900"
            >  
                Student Number
            </label>
            <input 
                type="text" 
                id="student-number" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="20XXXXXXX" 
                required 
            />
        </div>

        <div class="mb-5 cols-span-1">
            <label 
            for="student-number" 
            class="cols-span-1 block mb-2 text-sm font-medium text-gray-900"
            >  
                Phone Number
            </label>
            <input 
                type="text" 
                id="phone-number" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                placeholder="09XXXXXXXXX" 
                required 
            />
        </div>
    </div>

    <!-- college and department -->
    <div class="grid grid-cols-2 gap-4">
        <div class="mb-5 cols-span-1">
            <label 
                for="college" 
                class="block mb-2 text-sm font-medium text-gray-900"
            >
                College
            </label>
            <select id="college" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <!-- TODO: make dynamic options from a database of colleges -->
                <option>College of Engineering</option>
                <option>College of Arts and Letters</option>
                <option>College of Science</option>
            </select>
        </div>

        <div class="mb-5 cols-span-1">
            <label 
                for="program" 
                class="block mb-2 text-sm font-medium text-gray-900"
            >
                Degree Program
            </label>
            <select id="program" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <!-- TODO: make dynamic options from a database of programs -->
                <option>Computer Science</option>
                <option>Computer Engineering</option>
            </select>
        </div>

    </div>

    <!-- email section -->
    <label 
        for="website-admin" 
        class="block mb-2 text-sm font-medium text-gray-900"
    >
        Email
    </label>
    <div class="flex">
        <input 
            type="text" 
            id="website-admin" 
            class="rounded-s-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="jdelacruz"
            required
        />
        <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-e-lg ">
            @up.edu.ph
        </span>
    </div>


    <!-- password section-->
    <div class="mb-5">
        <label 
            for="password" 
            class="block mb-2 text-sm font-medium text-gray-900"
        >
            Password
        </label>
        <input 
            type="password" 
            id="password" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="••••••••" 
            required 
        />
    </div>
  
    <div class="inline-flex gap-4">
        <Button inverse={true} on:click={handleClick}> Cancel </Button>
        <Button on:click={handleClick}> Register </Button>
    </div>
  
    </form>

</section>

<style>

</style>