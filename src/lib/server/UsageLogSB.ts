import type { UsageLogDBObj, UsageLogResponse } from '$lib/classes/UsageLog';
import type { UsageLogFilter } from '$lib/utils/types';
import { supabase } from './SupabaseClient';

const success = {
	success: true,
	usageLogRaws: null,
	error: null
};

export async function selectUsageLogDB(filter: UsageLogFilter): Promise<UsageLogResponse> {
	/* Selects the usage logs/s from the database using a filter.
    Filter only contains option for date start and end for now. */

	let query = supabase
		.from('usage_log')
		.select(
			'ul_id, sn_id, admin_id, datetime_start, datetime_end, service ( service_id, service_type ( service_type ) ), location'
		);
	// .select() joins the usage_log, service, and service_type tables to get the `service_type` property

	if (filter.usageLogID) {
		// if there is a given usageLogID, search for that
		query = query.eq('ul_id', filter.usageLogID);
	}

	if (filter.studentNumber) {
		// if there is a given usageLogID, search for that
		query = query.eq('sn_id', filter.studentNumber);
	}

	if (filter.minDate) {
		// if there is a given start and end date range, search for that
		query = query.gte('datetime_start', filter.minDate);
	}

	if (filter.maxDate && typeof filter.maxDate == 'string') {
		// if there is a given start and end date range, search for that
		query = query.lte('datetime_end', filter.maxDate);
	} else if (filter.maxDate == null) {
		query = query.is('datetime_end', null);
	}

	const { data, error } = await query;

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	const formattedData: UsageLogDBObj[] = [];

	for (const row of data) {
		// reformats supabase return values to conform to UsageLogDBObj
		if (filter.serviceType.length && filter.serviceType.includes(row.service.service_type.service_type)) {
            formattedData.push({
                ul_id: row.ul_id,
                sn_id: row.sn_id,
                admin_id: row.admin_id,
                service_id: row.service.service_id, // will fix later after tinkering with supabase type returns
                service_type: row.service.service_type.service_type, // we assume each service only has one service_type
                datetime_start: row.datetime_start,
                datetime_end: row.datetime_end != null ? row.datetime_end : null,
                location: row.location
            });
        } else if (filter.serviceType.length == 0) {
            formattedData.push({
                ul_id: row.ul_id,
                sn_id: row.sn_id,
                admin_id: row.admin_id,
                service_id: row.service.service_id, // will fix later after tinkering with supabase type returns
                service_type: row.service.service_type.service_type, // we assume each service only has one service_type
                datetime_start: row.datetime_start,
                datetime_end: row.datetime_end != null ? row.datetime_end : null,
                location: row.location
            });
        }
	}

	return {
		success: true,
		usageLogRaws: formattedData,
		error: null
	};
}

export async function insertUsageLogDB(log: UsageLogDBObj): Promise<UsageLogResponse> {
	/* Inserts a non-existing usage log record into the database. */
	delete (log as { service_type?: string }).service_type; // deletes the service_type property to properly insert a usage log

	const { error } = await supabase.from('usage_log').insert(log);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}

async function checkUsageLogExistsDB(filter: UsageLogFilter): Promise<UsageLogResponse> {
	/* Checks if there is a single existing record of a usage log with the given usage log ID. */
	const usageLogDB = await selectUsageLogDB(filter);

	if (usageLogDB.success && usageLogDB.usageLogRaws?.length == 1) {
        if (usageLogDB.usageLogRaws[0].datetime_end == null) {
            return {
                success: true,
                usageLogRaws: null,
                error: 'Warning: Usage log is ongoing.'
            };
        }

		return success;
	}

	return {
		success: false,
		usageLogRaws: null,
		error: 'Error: Usage log does not exist'
	};
}

export async function updateUsageLogDB(log: UsageLogDBObj): Promise<UsageLogResponse> {
	/* Updates a usage log based using the usage log ID.
    NOTE: We can only update date start and end for now. */
	const usageLogCheck = await checkUsageLogExistsDB({
		usageLogID: log.ul_id,
		studentNumber: 0,
        serviceType: [],
		minDate: '',
		maxDate: ''
	});

	if (!usageLogCheck.success) {
		return usageLogCheck;
	}

	const updateObj: { [key: string]: string | number } = {};

	for (const [key, value] of Object.entries(log)) {
		if (value && typeof value == 'string' && key != 'service_type') {
			updateObj[key] = value;
		}
	}

	const { error } = await supabase.from('usage_log').update(updateObj).eq('ul_id', log.ul_id);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}

export async function deleteUsageLogDB(usageLogID: number): Promise<UsageLogResponse> {
	/* Deletes an existing usage log record. */
	const usageLogCheck = await checkUsageLogExistsDB({
		usageLogID: usageLogID,
		studentNumber: 0,
        serviceType: [],
		minDate: '',
		maxDate: ''
	});

	if (!usageLogCheck.success) {
		return usageLogCheck;
	} else if (usageLogCheck.error == 'Warning: Usage log is ongoing.') {
        return {
            success: false,
            usageLogRaws: null,
            error: usageLogCheck.error
        };
    }

	const { error } = await supabase.from('usage_log').delete().eq('ul_id', usageLogID);

	if (error) {
		return {
			success: false,
			usageLogRaws: null,
			error: error.message
		};
	}

	return success;
}
