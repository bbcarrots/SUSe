import { Admin } from '$lib/classes/Admin.js';
import { json } from '@sveltejs/kit';

export async function PATCH({ request }) {
	/* Handles Update and Approve requests for admin records. */
	const updateInfo = Admin.toAdminDBObj(await request.json());
	return json(await Admin.updateAdmin(updateInfo));
}

export async function DELETE({ request }) {
	/* Handles Delete requests for admin records. */
	const admin = await request.json();
	return json(await Admin.deleteAdmin(admin.adminID));
}
