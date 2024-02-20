<script>
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
        <input 
            type="text" 
            id="name" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="First Name" 
            required 
        />
        <input 
            type="text" 
            id="middle-initial" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="MI"  
        />
        <input 
            type="text" 
            id="surname" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="Surname"
            required  
        />
    </div>

    <!-- student number -->
    <div class="mb-5">
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

    <!-- phone number -->
    <div class="mb-5">
        <label 
        for="student-number" 
        class="block mb-2 text-sm font-medium text-gray-900"
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

    <!-- college -->
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

    <!-- department -->
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
  
    <button 
        type="submit" 
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
    >
        Submit
    </button>

    </form>

</section>

<style>

</style>