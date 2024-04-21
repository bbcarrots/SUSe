import { createClient } from '@supabase/supabase-js';
// import { env } from '$env/dynamic/public';
import { type AdminDBObj, type AdminFilter, type AdminResponse } from '$lib/classes/Admin';

// creates the connection to SUSe supabase
export const supabase = createClient(
	'https://yfhwfzwacdlqmyunladz.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaHdmendhY2RscW15dW5sYWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MDIyNjEsImV4cCI6MjAyNTQ3ODI2MX0.gzr5edDIVJXS1YYsQSyuZhc3oHGQYuVDtVfH4_2d30A'
);

const success: AdminResponse = {
	success: true,
	adminRaws: null,
	error: null
};

export async function selectAdminDB(filter: AdminFilter): Promise<AdminResponse> {
	/* Selects the admin record/s from the database using a filter.
    Filter contains option for admin ID, type, name, and if in use. */

	let query = supabase
		.from('admin')
		.select('*')

	if (filter.adminID) {
		query = query.eq('admin_id', filter.adminID);
	}

	if (filter.nickname) {
		query = query.like('admin_name', '%' + filter.nickname + '%');
	}

	const { data, error } = await query;

	if (error) {
		return {
			success: false,
			adminRaws: null,
			error: error.message
		};
	}

	return {
		success: true,
		adminRaws: data,
		error: null
	};
}

export async function insertAdminDB(admin: AdminDBObj): Promise<AdminResponse> {
	/* Inserts a non-existing admin record into the database. */
	delete (admin as { admin_type?: string }).admin_type; // deletes the admin_type property to properly insert a admin

	const { error } = await supabase.from('admin').insert(admin);

	if (error) {
		return {
			success: false,
			adminRaws: null,
			error: error.message
		};
	}

	return success;
}

async function checkAdminExistsDB(filter: AdminFilter): Promise<AdminResponse> {
	/* Checks if there is a single existing record of a admin with the given admin ID. */
	const adminDB = await selectAdminDB(filter);

	if (adminDB.success && adminDB.adminRaws?.length == 1) {
		return success;
	}

	return {
		success: false,
		adminRaws: null,
		error: 'Error: Admin does not exist'
	};
}

export async function updateAdminDB(admin: AdminDBObj): Promise<AdminResponse> {
	/* Updates a admin record based using their admin ID.
    NOTE: Cannot update the admin id. Need to delete and insert again. */
	const adminCheck = await checkAdminExistsDB({
		adminID: admin.admin_id,
        nickname: ''
	});

	if (!adminCheck.success) {
		return adminCheck;
	}

	const updateObj: { [key: string]: string | boolean } = {};

	for (const [key, value] of Object.entries(admin)) {
		// updates admin name only
		if (value && typeof value == 'string') {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase
		.from('admin')
		.update(updateObj)
		.eq('admin_id', admin.admin_id);

	if (error) {
		return {
			success: false,
			adminRaws: null,
			error: error.message
		};
	}

	return success;
}

export async function deleteAdminDB(adminID: number): Promise<AdminResponse> {
	/* Deletes an existing admin record. */
	const adminCheck = await checkAdminExistsDB({
		adminID: adminID,
        nickname: ''
	});

	if (!adminCheck.success) {
		return adminCheck;
	}

	const { error } = await supabase.from('admin').delete().eq('admin_id', adminID);

	if (error) {
		return {
			success: false,
			adminRaws: null,
			error: error.message
		};
	}

	return success;
}
