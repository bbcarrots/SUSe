<script lang="ts">
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { userRFID } from '$lib/stores/User';
	import { CollegePrograms } from '$lib/stores/CollegePrograms';

	let inputs: NodeListOf<HTMLInputElement | HTMLSelectElement>;
	let college = 'College of Engineering';

	onMount(() => {
		inputs = document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select');

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

<section class="grid gap-y-8">
	<!-- HEADER -->
	<div class="grid gap-4">
		<h1>Register</h1>
		<p>Tap your UP ID to register it to your account.</p>
	</div>

	<!-- FORM -->
	<form
		class="grid gap-y-4"
		method="POST"
		use:enhance={({ formData }) => {
			formData.append('rfid', String($userRFID));
		}}
	>
		<!-- ITEMS -->
		<div class="grid gap-y-2">
			<!-- name section -->
			<div class="grid gap-y-2">
				<label for="full-name">
					<p>Name</p>
				</label>
				<div
					class="grid gap-4 sm:grid-cols-1
                            lg:grid-cols-6"
				>
					<input
						name="firstName"
						type="text"
						id="first-name"
						class="col-span-3"
						class:error={false}
						placeholder="First Name"
						pattern="(?:[A-Za-z\s]+)?"
						title="Please only enter alphabets"
						required
					/>

					<input
						name="middleInitial"
						type="text"
						id="middle-initial"
						class="col-span-1"
						pattern="[A-Za-z\s]+"
						title="Please only enter alphabets"
						placeholder="MI"
					/>
					<input
						name="lastName"
						type="text"
						id="last-name"
						class="col-span-2"
						placeholder="Surname"
						pattern="[A-Za-z\s]+"
						title="Please only enter alphabets"
						required
					/>
				</div>
			</div>

			<!-- student number and phone number -->
			<div
				class="grid gap-4 sm:grid-cols-1
                lg:grid-cols-2"
			>
				<div class="cols-span-1 grid gap-y-2">
					<label for="student-number">
						<p>Student Number</p>
					</label>
					<input
						name="studentNumber"
						type="text"
						id="student-number"
						placeholder="20XXXXXXX"
						pattern="^\d{'{'}9{'}'}$"
						title="Please enter a 9 digit number."
						required
					/>
				</div>

				<div class="cols-span-1 grid gap-y-2">
					<label for="student-number">
						<p>Phone Number</p>
					</label>
					<input
						name="phoneNumber"
						type="text"
						id="phone-number"
						placeholder="09XXXXXXXXX"
						pattern="^\d{'{'}11{'}'}$"
						title="Please enter an 11 digit number."
						required
					/>
				</div>
			</div>

			<!-- college and department -->
			<div
				class="grid gap-4 sm:grid-cols-1
                        lg:grid-cols-2"
			>
				<div class="cols-span-1 grid gap-y-2">
					<label for="college">
						<p>College</p>
					</label>
					<select
						name="college"
						id="college"
						class="block w-full border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						bind:value={college}
					>
						{#each $CollegePrograms as program}
							<option value={program.college}>{program.college}</option>
						{/each}
					</select>
				</div>

				<div class="cols-span-1 grid gap-y-2">
					<label for="program">
						<p>Degree Program</p>
					</label>
					<select
						name="program"
						id="program"
						class="block w-full border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					>
						{#each $CollegePrograms as program}
							{#if program.college == college}
								{#each program.programs as department}
									{#if department == college}
										<option value={department} selected>{department}</option>
									{:else}
										<option value={department}>{department}</option>
									{/if}
								{/each}
							{/if}
						{/each}
					</select>
				</div>
			</div>

			<!-- email section -->
			<div class="grid gap-y-2">
				<label for="email">
					<p>Email</p>
				</label>
				<div class="flex">
					<input
						name="username"
						type="text"
						id="email"
						placeholder="jdelacruz"
						pattern="[A-Za-z0-9]+"
						title="Please only enter alphabets"
						required
					/>
					<span
						id="email-suffix"
						class="inline-flex items-center border border-s-0 border-gray-300 bg-gray-200 px-3 text-gray-900"
					>
						<p>@up.edu.ph</p>
					</span>
				</div>
			</div>

			<!-- password section-->
			<div class="grid gap-y-2">
				<label for="password">
					<p>Password</p>
				</label>
				<input
					name="password"
					type="password"
					id="password"
					pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{'{'}8,{'}'}"
					title="Please enter at least one lowercase letter, uppercase letter, and number."
					placeholder="••••••••"
					required
				/>
				<span> </span>
			</div>
		</div>

		<!-- ACTION BUTTONS -->
		<div class="inline-flex gap-4">
			<Button inverse={true}>Cancel</Button>
			<Button submit={true}>Register</Button>
		</div>
	</form>
</section>

<style lang="postcss">
	@tailwind components;

	@layer components {
		input {
			@apply block w-full rounded border border-gray-300 p-2.5 text-gray-900;
		}

		input:focus {
			@apply border-blue-500 ring-blue-500;
		}

		input.error {
			@apply border-pink-600 text-pink-600;
		}

		input.error:focus {
			@apply border-pink-500 ring-pink-500;
		}
	}

	::placeholder {
		padding: 12px, 16px;
		color: var(--suse-black);
		opacity: 50%;
	}

	#email {
		border-radius: 5px 0px 0px 5px;
	}

	#email-suffix {
		border-radius: 0px 5px 5px 0px;
		padding: 12px, 16px;
		background-color: #eaeaea;
		border-color: #eaeaea;
	}

	#email-suffix p {
		color: var(--suse-black);
		opacity: 50%;
	}

	select {
		padding: 12px, 16px;
		border-radius: 5px;
	}
</style>
