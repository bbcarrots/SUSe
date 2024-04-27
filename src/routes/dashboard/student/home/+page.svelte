<script>
    import ServiceCard from "$lib/components/ServiceCard.svelte";
    
    export let data;
    console.log(data)
</script>

<div class="flex">
    <ServiceCard
        serviceName = {"Calculator"}
        available = {1}
        src = {'/service-card-images/calculator.svg'}
    />
</div>
