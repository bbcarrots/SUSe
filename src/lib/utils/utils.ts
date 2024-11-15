// import type { NumberInputSlots } from 'flowbite-svelte/NumberInput.svelte';
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://yfhwfzwacdlqmyunladz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

export function camelize(str: string) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

export function getKey(info: any, primaryKey: string) {
	return info[primaryKey];
}

export function formatDateTime(datetimeString: string): string {
	const date = new Date(datetimeString);
	// Example format: "January 1, 2022 12:00 PM"
	const formattedDate = date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
	return formattedDate;
}

export function formatTime(milliseconds: number) {
	// Example input: milliseconds = 3661000 (represents 1 hour, 1 minute, 1 second)
	// Example output: formattedTime = '01:01:01'

	const totalSeconds = Math.floor(milliseconds / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
		2,
		'0'
	)}:${String(seconds).padStart(2, '0')}`;

	return formattedTime;
}
