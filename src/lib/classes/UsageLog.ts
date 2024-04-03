import {
	deleteUsageLogDB,
	insertUsageLogDB,
	selectUsageLogDB,
	updateUsageLogDB
} from '$lib/server/UsageLogSB';

export type UsageLogDBObj = {
	ul_id: number;
	sn_id: number;
	admin_id: number;
	service_type: string;
	datetime_start: string;
	datetime_end: string;
};

export type UsageLogUIObj = {
	usageLogID: number;
	studentNumber: number;
	AdminID: number;
	ServiceType: string;
	DateTimeIn: Date;
	DateTimeOut: Date;
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

	public static toUsageLogUIObj(log: UsageLogDBObj): UsageLogUIObj {
		/* Converts a UsageLogDBObj to a UsageLogUIObj. */
		return {
			usageLogID: log.ul_id,
			studentNumber: log.sn_id,
			AdminID: log.admin_id,
			ServiceType: log.service_type,
			DateTimeIn: new Date(log.datetime_start),
			DateTimeOut: new Date(log.datetime_end)
		};
	}

	public static toSUsageLogDBObj(log: UsageLogUIObj): UsageLogDBObj {
		/* Converts a UsageLogUIObj to a UsageLogUIObj. */
		return {
			ul_id: log.usageLogID,
			sn_id: log.studentNumber,
			admin_id: log.AdminID,
			service_type: log.ServiceType,
			datetime_start: new Date(log.DateTimeIn).toISOString(),
			datetime_end: new Date(log.DateTimeOut).toISOString()
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
