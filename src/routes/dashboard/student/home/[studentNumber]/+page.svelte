<script>
    import ServiceCard from "$lib/components/ServiceCard.svelte";
    import { userID } from "$lib/stores/User";
    export let data;
    userID.set(+data.studentNumber) 

</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
    <ServiceCard
        serviceName = {"Calculator"}
        available = {1}
        src = {'/service-card-images/calculator.svg'}
    />

    <ServiceCard
        serviceName = {"Extension Cord"}
        available = {1}
        src = {'/service-card-images/extension-cord.svg'}
    />

    <ServiceCard
        serviceName = {"Discussion Room"}
        available = {1}
        src = {'/service-card-images/discussion-room.svg'}
    />

    <ServiceCard
        serviceName = {"Umbrella"}
        available = {1}
        src = {'/service-card-images/umbrella.svg'}
    />

    <ServiceCard
        serviceName = {"Laptop"}
        available = {1}
        src = {'/service-card-images/laptop.svg'}
    />

</div>
