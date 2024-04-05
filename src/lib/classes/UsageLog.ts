import {
	deleteUsageLogDB,
	insertUsageLogDB,
	selectUsageLogDB,
	updateUsageLogDB
} from '$lib/server/UsageLogSB';
import type { UsageLogProcessed } from '$lib/utils/types';

export type UsageLogDBObj = {
	ul_id: number;
	sn_id: number;
	admin_id: number;
    service_id: number;
	service_type: string;
	datetime_start: string;
	datetime_end: string;
};

export type UsageLogResponse = {
	success: boolean;
	usageLogRaws: UsageLogDBObj[] | null;
	error: string | null;
};

export type UsageLogFilter = {
	usageLogID: number;
	minDate: string;
	maxDate: string;
};

export class UsageLog {
	/* Contains all usage log methods. */

	public static toUsageLogDBObj(log: UsageLogProcessed): UsageLogDBObj {
		/* Converts a UsageLogUIObj to a UsageLogUIObj. */
		return {
			ul_id: log.usageLogID,
			sn_id: 'studentNumber' in log ? log.studentNumber : 0,
			admin_id: 'adminID' in log ? log.adminID : 0,
            service_id: 'serviceID' in log ? log.serviceID : 0,
			service_type: 'serviceType' in log ? log.serviceType : '',
			datetime_start: new Date(log.dateTimeStart).toISOString(),
			datetime_end: new Date(log.dateTimeEnd).toISOString()
		};
	}

	public static async selectUsageLogs(
		filter: UsageLogFilter = {
			usageLogID: 0,
			minDate: new Date(2000).toISOString(), // need to convert to ISOString to filter DB
			maxDate: new Date().toISOString()
		}
	): Promise<UsageLogResponse> {
		/* Selects all usage logs in database using the default or given filter. */
		return selectUsageLogDB(filter);
	}

	public static async insertUsageLog(log: UsageLogDBObj): Promise<UsageLogResponse> {
		/* Inserts unique student information in database. */
		return insertUsageLogDB(log);
	}

	public static async updateUsageLog(log: UsageLogDBObj): Promise<UsageLogResponse> {
		/* Updates the student record matching this Student's student number. */
		return updateUsageLogDB(log);
	}

	public static async deleteUsageLog(usageLogID: number): Promise<UsageLogResponse> {
		/* Deletes the student record matching this Student's student number. */
		return deleteUsageLogDB(usageLogID);
	}
}
