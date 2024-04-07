export function camelize(str: String) {
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
