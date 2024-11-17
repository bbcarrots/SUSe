import { type AdminDBObj, type AdminResponse } from '$lib/classes/Admin';
import { type AdminFilter } from '$lib/utils/types';
import { supabase } from './SupabaseClient';

const success: AdminResponse = {
	success: true,
	adminRaws: null,
	error: null
};

export async function selectAdminDB(filter: AdminFilter): Promise<AdminResponse> {
	/* Selects the admin record/s from the database using a filter.
    Filter contains option for admin ID, nickname, and is active. */

	let query = supabase.from('admin').select('*');

	if (filter.adminID) {
		query = query.eq('admin_id', filter.adminID);
	}

    if (filter.rfid) {
		query = query.eq('rfid', filter.rfid);
	}

	if (filter.nickname) {
		query = query.like('admin_name', '%' + filter.nickname + '%');
	}

    if (filter.isActive != null) {
        query = query.eq('is_active', filter.isActive);
    }

	const { data, error } = await query;

    console.log(data)
    console.log(error)

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
        if (adminDB.adminRaws[0].is_active) {
			return {
				success: true,
				adminRaws: null,
				error: 'Warning: Admin is active.'
			};
		}

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
        rfid: 0,
		nickname: '',
		isActive: null // Admin should be inactive to be updated
	});

	if (!adminCheck.success) {
		return adminCheck;
	}

	const updateObj: { [key: string]: string | boolean } = {};

	for (const [key, value] of Object.entries(admin)) {
		// updates admin name and is active
		if ((value && typeof value == 'string') || typeof value == 'boolean') {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase.from('admin').update(updateObj).eq('admin_id', admin.admin_id);

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
        rfid: 0,
		nickname: '',
		isActive: null
	});

	if (!adminCheck.success) {
		return adminCheck;
	} else if (adminCheck.error == 'Warning: Admin is active.') {
        return {
            success: false,
            adminRaws: null,
            error: adminCheck.error
        };
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
