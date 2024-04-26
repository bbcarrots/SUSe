import { insertAdminDB, selectAdminDB, updateAdminDB, deleteAdminDB } from '$lib/server/AdminSB';
import type { AdminProcessed } from '$lib/utils/types';

// parameter type for insert and update admin DB functions
export type AdminDBObj = {
	admin_id: number;
	rfid: number;
	pw: string;
	nickname: string;
};

// return value of admin DB functions
export type AdminResponse = {
	success: boolean;
	adminRaws: AdminDBObj[] | null;
	error: string | null;
};

// filters for selecting admin records
export type AdminFilter = {
	adminID: number;
	nickname: string;
};

export class Admin {
	/* Contains all admin methods for conversion and DB communication. */

	public static toAdminDBObj(admin: AdminProcessed): AdminDBObj {
		/* Converts aa AdminProcessed to aa AdminDBObj. */
		return {
			admin_id: admin.adminID,
			rfid: 0,
			pw: '',
			nickname: 'nickname' in admin ? admin.nickname : ''
		};
	}

	public static async selectAdmins(
		filter: AdminFilter = {
			adminID: 0,
			nickname: ''
		}
	): Promise<AdminResponse> {
		/* Selects all admin records in database using the default or given filter. */
		return selectAdminDB(filter);
	}

	public static async insertAdmin(admin: AdminDBObj): Promise<AdminResponse> {
		/* Inserts unique admin information in database. */
		return insertAdminDB(admin);
	}

	public static async updateAdmin(admin: AdminDBObj): Promise<AdminResponse> {
		/* Updates the admin record matching this admin's admin ID. */
		return updateAdminDB(admin);
	}

	public static async deleteAdmin(adminID: number): Promise<AdminResponse> {
		/* Deletes the admin record matching this Admin's admin ID. */
		return deleteAdminDB(adminID);
	}
}
