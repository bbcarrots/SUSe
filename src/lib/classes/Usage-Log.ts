export type UsageLogDBObj = {
	ul_id: number;
	sn_id: number;
	admin_id: number;
	service_type: string;
	datetime_start: Date;
	datetime_end: Date;
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
	studentRaws: UsageLogDBObj[] | null;
	error: string | null;
};

export type UsageLogFilter = {
	minDate: Date;
	maxDate: Date;
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
			DateTimeIn: log.datetime_start,
			DateTimeOut: log.datetime_end
		};
	}

	public static toSUsageLogDBObj(log: UsageLogUIObj): UsageLogDBObj {
		/* Converts a UsageLogUIObj to a UsageLogUIObj. */
		return {
			ul_id: log.usageLogID,
			sn_id: log.studentNumber,
			admin_id: log.AdminID,
			service_type: log.ServiceType,
			datetime_start: log.DateTimeIn,
			datetime_end: log.DateTimeOut
		};
	}

    // public static async selectUsageLogs(
	// 	filter: UsageLogFilter = {
    //         minDate: new Date(2000),
    //         maxDate: new Date(),
	// 	}
	// ): Promise<UsageLogResponse> {
	// 	/* Selects all student records in database using the default or given filter. */
	// 	return selectUsageLogDB(filter);
	// }
}
