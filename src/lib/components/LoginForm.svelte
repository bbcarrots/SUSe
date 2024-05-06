<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	//to determine which login to display
	let rfidLogin = true;
	let rfidValue: string;
	export let clicks: number = 0;

	const dispatch = createEventDispatcher(); // for forwarding events

	onMount(() => {
		const handleClickOutside = (e: any) => {
			const rfidInput = document.getElementById('rfidInput'); //take the rfid input
			const target = e.target; //take the target of the event
			const focusedElement = document.activeElement; //this is the active element being focused

			//if the current element is an image, increment the clicks if the count is less than 5
			if (target instanceof HTMLImageElement) {
				e.preventDefault();

				if (clicks < 5) {
					clicks = clicks + 1;
				}
			}

			// if the current element is rfidInput and you are not clicking an input or a button, do not remove the focus
			else if (
				focusedElement === rfidInput &&
				!(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)
			) {
				e.preventDefault();
			}

			// if the current element is not the rfidInput and you click anything else, it should focus the rfid input
			else if (
				focusedElement !== rfidInput &&
				!(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)
			) {
				//need to add a delay because of svelte
				setTimeout(() => {
					rfidInput?.focus();
				}, 10);
			}
		};

		const handleKeyDown = (e: any) => {
			const rfidInput = document.getElementById('rfidInput'); //take the rfid input
			const focusedElement = document.activeElement; //this is the active element being focused

			if (rfidInput === focusedElement) {
				if (e.key == 'Enter') {
					let payload = rfidValue;
					dispatch('inputRFID', payload);
				}
			}
		};

		// when mouse is clicked, call handle click outside
		document.addEventListener('mousedown', handleClickOutside);

		// when keyboard is pressed, call handle key down
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	function handleChangeToUsername() {
		rfidLogin = false;
		clicks = 0;
	}

	function handleChangeToRFID() {
		rfidLogin = true;
		clicks = 0;
	}
</script>

<section class="grid h-full w-full items-center justify-center gap-y-8">
	{#if rfidLogin == true}
		<!-- HEADER -->
		<div class="grid gap-6 text-center">
			<div class="grid gap-4">
				<h1>Tap your UP ID to log in or register</h1>
				<h4>Avail Engglib services using SUSê by tapping your RFID!</h4>
			</div>

			<input type="password" id="rfidInput" bind:value={rfidValue} autofocus />
			<button on:click={handleChangeToUsername} class="text-blue-600"
				><p>Login using username</p></button
			>
		</div>
	{:else}
		<!-- FORM -->
		<div class="grid gap-6 text-center">
			<div class="grid gap-4">
				<h1>Log in using username</h1>
				<h4>to view all available services</h4>
			</div>

			<div class="relative flex">
				<form class="grid flex-grow gap-y-4" method="POST">
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
						<span> </span>
					</div>

					<!-- ACTION BUTTONS -->
					<div class="inline-flex gap-4">
						<div class="flex-grow">
							<Button submit={true}>Login</Button>
						</div>
					</div>
					<button on:click={handleChangeToRFID} class="text-blue-600"
						><p>Login using RFID</p></button
					>
				</form>
			</div>
		</div>
	{/if}
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
</style>
