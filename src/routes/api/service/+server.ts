import { Service } from '$lib/classes/Service.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ request }) {
	/* Handles Update and Approve requests for service records. */
	const updateInfo = Service.toServiceDBObj(await request.json());
	return json(await Service.updateService(updateInfo));
}

export async function DELETE({ request }) {
	/* Handles Delete requests for service records. */
	const service = await request.json();
	return json(await Service.deleteService(service.serviceNumber));
}
