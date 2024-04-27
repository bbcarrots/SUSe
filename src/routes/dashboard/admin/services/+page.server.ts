import { Service } from "$lib/classes/Service";

export async function load() {
	/* Loads service records from the DB when page is created. */
	return Service.selectServices();
}
