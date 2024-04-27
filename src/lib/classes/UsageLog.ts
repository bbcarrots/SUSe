import {
	deleteUsageLogDB,
	insertUsageLogDB,
	selectUsageLogDB,
	updateUsageLogDB
} from '$lib/server/UsageLogSB';
import type { UsageLogProcessed } from '$lib/utils/types';

// parameter type for insert and update usage log DB functions
export type UsageLogDBObj = {
	ul_id: number;
	sn_id: number;
	admin_id: number;
	service_id: number;
	service_type: string;
	datetime_start: string;
	datetime_end: string;
};

// return value of usage log DB functions
export type UsageLogResponse = {
	success: boolean;
	usageLogRaws: UsageLogDBObj[] | null;
	error: string | null;
};

// filters for selecting usage log records
export type UsageLogFilter = {
	usageLogID: number;
	minDate: string;
	maxDate: string;
};

export class UsageLog {
	/* Contains all usage log methods for conversion and DB communication. */

	public static toUsageLogDBObj(log: UsageLogProcessed): UsageLogDBObj {
		/* Converts a UsageLogProcessed to a UsageLogDBObj. */
		return {
			ul_id: log.usageLogID,
			sn_id: 'studentNumber' in log ? log.studentNumber : 0,
			admin_id: 'adminID' in log ? log.adminID : 0,
			service_id: 'serviceID' in log ? log.serviceID : 0,
			service_type: 'serviceType' in log ? log.serviceType : '',
			datetime_start: 'dateTimeStart' in log ? new Date(log.dateTimeStart).toISOString() : '',
			datetime_end: 'dateTimeEnd' in log ? new Date(log.dateTimeEnd).toISOString() : ''
		};
	}

	public static async selectUsageLogs(
		filter: UsageLogFilter = {
			usageLogID: 0,
			minDate: new Date(2000).toISOString(), // need to convert to ISOString to filter DB
			maxDate: new Date().toISOString() // gets date today
		}
	): Promise<UsageLogResponse> {
		/* Selects all usage logs in database using the default or given filter. */
		return selectUsageLogDB(filter);
	}

	public static async insertUsageLog(log: UsageLogDBObj): Promise<UsageLogResponse> {
		/* Inserts unique usage log information in database. */
		return insertUsageLogDB(log);
	}

	public static async updateUsageLog(log: UsageLogDBObj): Promise<UsageLogResponse> {
		/* Updates the usage log record matching this log's usage log ID. */
		return updateUsageLogDB(log);
	}

	public static async deleteUsageLog(usageLogID: number): Promise<UsageLogResponse> {
		/* Deletes the usage log record matching this log's usage log ID. */
		return deleteUsageLogDB(usageLogID);
	}
}
