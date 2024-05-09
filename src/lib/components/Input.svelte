<script lang="ts">
	import { onMount } from 'svelte';
	import { CollegePrograms } from '$lib/stores/CollegePrograms';

	export let field: string;
	export let value: any;
	export let college = 'College of Engineering';

	interface Patterns {
		[key: string]: string;
	}

	let patterns: Patterns = {
		firstName: "[ A-Za-zÑñ\\-']+",
		middleInitial: '[A-Z]{1,2}',
		lastName: "[ A-Za-zÑñ\\-']+",
		email: '[A-Za-z0-9]+',
		studentNumber: '[0-9]{9}',
		phoneNumber: '[0-9]{11}'
	};

	let titles: Patterns = {
		firstName: 'Please input alphabets, spaces, dashes, apostrophes and special characters only.',
		middleInitial: 'Please input 1-2 uppercase letters.',
		lastName: 'Please input alphabets, spaces, dashes, apostrophes and special characters only.',
		email: 'Accepted letters: a-z, 0-9',
		studentNumber: 'Please input a 9 digit number.',
		phoneNumber: 'Please input an 11 digit number.'
	};

	onMount(() => {
		let inputs = document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select');

		inputs.forEach((input) => {
			input.addEventListener('invalid', () => {
				input.classList.add('error');
			});

			input.addEventListener('input', () => {
				if (input.validity.valid) {
					input.classList.remove('error');
				}
			});
		});

		return () => {
			inputs.forEach((input) => {
				input.removeEventListener('invalid', () => {
					input.classList.add('error');
				});

				input.removeEventListener('input', () => {
					if (input.validity.valid) {
						input.classList.remove('error');
					}
				});
			});
		};
	});
</script>

<div class="max-w-[190px]">
	{#if field == 'college'}
		<select
			on:input
			name={field}
			id={field}
			class="block w-full rounded-[5px] border border-gray-300 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		>
			{#each $CollegePrograms as program}
				{#if program.college == value}
					<option value={program.college} selected>{program.college}</option>
				{:else}
					<option value={program.college}>{program.college}</option>
				{/if}
			{/each}
		</select>
	{:else if field == 'dateTimeStart' || field == 'dateTimeEnd'}
		<input class="datetime" on:input type="datetime-local" id={field} name={field} {value} />
	{:else if field == 'program'}
		<select
			on:input
			bind:value
			name={field}
			id={field}
			class="block w-full rounded-[5px] border border-gray-300 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		>
			{#each $CollegePrograms as program}
				{#if program.college == college}
					{#if program.programs.includes(value)}
						{#each program.programs as department, index}
							{#if department == value}
								<option value={department} selected>{department} </option>
							{:else}
								<option value={department}>{department}</option>
							{/if}
						{/each}
					{:else}
						<option value={''} selected></option>
						{#each program.programs as department, index}
							<option value={department}>{department}</option>
						{/each}
					{/if}
				{/if}
			{/each}
		</select>
	{:else if field == 'isActive' || field == 'inUse'}
		<select
			on:input
			bind:value
			name={field}
			id={field}
			class="block w-full rounded-[5px] border border-gray-300 p-2.5 px-[16px] py-[12px] text-[14px] text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		>
			<option value={true} selected={value == 'true'}>true</option>
			<option value={false} selected={value == 'false'}>false</option>
		</select>
	{:else}
		<input
			class:error={false}
			type="text"
			id={field}
			name={field}
			{value}
			pattern={patterns[field]}
			title={titles[field]}
			required
			on:input
		/>
	{/if}
</div>

<style lang="postcss">
	@tailwind components;

	@layer components {
		input {
			@apply block h-1/2 w-full rounded border border-gray-300 p-2.5 text-[14px] text-gray-900;
		}

		input:focus {
			@apply border-blue-500 ring-blue-500;
		}

		input.error {
			@apply border-pink-600 text-pink-600;
		}

		input.datetime {
			@apply block h-1/2 w-full max-w-[230px] rounded border border-gray-300 px-2.5 py-1.5 text-[14px] text-gray-900;
		}

		input.error:focus {
			@apply border-pink-500 ring-pink-500;
		}

		.dot {
			@apply inline-block h-3 w-3 rounded-full bg-gray-300;
		}

		select {
			@apply block h-1/2 w-full rounded border border-gray-300 p-1.5 text-[14px] text-gray-900 focus:border-blue-500 focus:ring-blue-500;
		}
	}
</style>
