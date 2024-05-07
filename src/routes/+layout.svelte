<script>
	import '../app.pcss';
	import { browser } from '$app/environment';
</script>

{#if !browser}
<div class="w-full h-screen flex items-center justify-center">
    <div class="loader"></div>
</div>


{:else}
	<slot />
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');

	:global(body){
		font-family: "Public Sans", sans-serif;
	}

	.loader {
		width: 50px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: 
			radial-gradient(farthest-side,var(--suse-green) 94%,#0000) top/8px 8px no-repeat,
			conic-gradient(#0000 30%,var(--suse-green));
		-webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
		animation: l13 1s infinite linear;
		}
		@keyframes l13{ 
		100%{transform: rotate(1turn)}
	}
</style>