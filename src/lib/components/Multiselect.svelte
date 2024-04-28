<script lang="ts">
	import Pill from './Pill.svelte';
	import { onMount } from 'svelte';

	import { Icon, ChevronDown, MagnifyingGlass } from 'svelte-hero-icons';

	export let field;
	export let options: any;
	export let value: any[];

	let filter = '';
	let showOptions = false;

	function handleInput(event: any) {
		filter = event.target.value.toLowerCase();
	}

	function toggleOptions() {
		showOptions = !showOptions;
	}

	function handleSelect(item: string) {
		value.push(item);
		refreshInfo();
	}

	function handleRemove(itemToRemove: string) {
		(event as MouseEvent).stopPropagation(); // Stop event propagation
		const updatedValue = value.filter((item) => item !== itemToRemove);
		value = updatedValue;
		refreshInfo();
	}

	function refreshInfo() {
		value = value;
		options = options;
	}

	function closeDropdown() {
		showOptions = false; // Hide the dropdown menu
	}

	onMount(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const dropdown = document.getElementById(field);
			const target = e.target as HTMLElement;

			if (dropdown && !dropdown.contains(target)) {
				closeDropdown(); // Close the dropdown
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

<div id={field} class="dropdown-menu relative w-full">
	<div class="border-1 relative rounded-md border p-3">
		<button
			class="btn btn-primary dropdown-toggle w-full"
			type="button"
			on:click={toggleOptions}
			aria-expanded={showOptions}
		>
			<div class="flex justify-between text-gray-400">
				<!-- If there's nothing selected, display the field -->
				{#if value.length == 0}
					<p>{field}</p>
				{:else}
					<!-- load pills -->
					<h6 class="absolute top-0 -m-[10px] ml-[1px] flex bg-white p-[5px]">{field}</h6>
					<div class="z-10 flex flex-wrap justify-start gap-1 text-start">
						{#each value as item}
							<Pill value={item} on:click={() => handleRemove(item)} />
						{/each}
					</div>
				{/if}
				<div>
					<Icon src={ChevronDown} micro size="20" />
				</div>
			</div>
		</button>
	</div>

	<div
		class="border-1 dropdown-menu fixed z-20 mt-2 rounded-md border bg-white p-5"
		style="display: {showOptions ? 'block' : 'none'};"
	>
		<!-- search input -->
		<div class="relative w-full text-gray-300">
			<input
				class="w-full rounded-lg border border-gray-300 pr-10 text-suse-black"
				bind:value={filter}
				on:input={handleInput}
				type="text"
				placeholder="Search"
			/>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
				<Icon src={MagnifyingGlass} micro size="20" />
			</div>
		</div>

		<hr class="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />

		<!-- options -->
		<div class="grid max-h-[300px] w-full overflow-auto">
			<div class="grid">
				{#each options as option}
					{#if typeof option.name === 'string' && option.name
							.toLowerCase()
							.includes(filter) && !value.includes(option.name)}
						<button
							on:click={() => handleSelect(option.name)}
							class="dropdown-item p-4 hover:bg-gray-100"
						>
							<p class="text-left">{option.name}</p>
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
