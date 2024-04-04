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
    service_id: number;
	service_type: string;
	datetime_start: string;
	datetime_end: string;
};

export type UsageLogUIObj = {
	usageLogId: number;
	studentNumber: number;
	adminId: number;
    serviceId: number;
	serviceType: string;
	dateTimeIn: Date;
	dateTimeOut: Date;
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
			usageLogId: log.ul_id,
			studentNumber: log.sn_id,
			adminId: log.admin_id,
            serviceId: log.service_id,
			serviceType: log.service_type,
			dateTimeIn: new Date(log.datetime_start),
			dateTimeOut: new Date(log.datetime_end)
		};
	}

	public static toUsageLogDBObj(log: UsageLogUIObj): UsageLogDBObj {
		/* Converts a UsageLogUIObj to a UsageLogUIObj. */
		return {
			ul_id: log.usageLogId,
			sn_id: log.studentNumber,
			admin_id: log.adminId,
            service_id: log.serviceId,
			service_type: log.serviceType,
			datetime_start: new Date(log.dateTimeIn).toISOString(),
			datetime_end: new Date(log.dateTimeOut).toISOString()
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
