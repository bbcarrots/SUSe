import { Admin } from '$lib/classes/Admin';

export async function load() {
	/* Loads admin records from the DB when page is created. */
	return Admin.selectAdmins();
}
